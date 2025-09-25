/* eslint-disable */

const fs = require("fs");
const path = require("path");

/**
 * Force delete directories and files, handling Windows permission issues
 */
async function forceDelete(targetPath) {
  try {
    if (!fs.existsSync(targetPath)) {
      // console.log(`✓ ${targetPath} doesn't exist, skipping`);
      return;
    }

    const stats = fs.statSync(targetPath);

    if (stats.isDirectory()) {
      console.log(`🗂️  Deleting directory: ${targetPath}`);

      // On Windows, change permissions first
      if (process.platform === "win32") {
        try {
          await changePermissionsRecursive(targetPath);
        } catch (err) {
          console.warn(`⚠️  Could not change permissions for ${targetPath}:`, err.message);
        }
      }

      await fs.promises.rm(targetPath, {
        recursive: true,
        force: true,
        maxRetries: 3,
        retryDelay: 100,
      });
    } else {
      console.log(`📄 Deleting file: ${targetPath}`);

      // On Windows, remove read-only flag
      if (process.platform === "win32") {
        try {
          await fs.promises.chmod(targetPath, 0o666);
        } catch (err) {
          console.warn(`⚠️  Could not change permissions for ${targetPath}:`, err.message);
        }
      }

      await fs.promises.unlink(targetPath);
    }

    console.log(`✅ Successfully deleted: ${targetPath}`);
  } catch (error) {
    console.error(`❌ Failed to delete ${targetPath}:`, error.message);

    // Last resort: try system commands on Windows
    if (process.platform === "win32" && error.code === "EPERM") {
      try {
        const { execSync } = require("child_process");
        const isDirectory = stats && stats.isDirectory();

        if (isDirectory) {
          // Try multiple approaches for directories
          try {
            execSync(`rmdir /s /q "${targetPath}"`, { stdio: ["ignore", "ignore", "ignore"] });
          } catch {
            // Alternative approach using PowerShell
            execSync(`powershell -c "Remove-Item -Recurse -Force '${targetPath}' -ErrorAction SilentlyContinue"`, {
              stdio: ["ignore", "ignore", "ignore"],
            });
          }
        } else {
          execSync(`del /f /q "${targetPath}"`, { stdio: ["ignore", "ignore", "ignore"] });
        }

        // Verify deletion
        if (!fs.existsSync(targetPath)) {
          console.log(`✅ Force deleted using system command: ${targetPath}`);
        } else {
          console.log(`⚠️  Partial deletion of ${targetPath} - some files may remain`);
        }
      } catch (systemError) {
        console.error(`❌ System command also failed for ${targetPath}:`, systemError.message);
        console.log(`ℹ️  You may need to manually delete ${targetPath} or restart processes using it`);
      }
    }
  }
}

/**
 * Recursively change permissions on Windows
 */
async function changePermissionsRecursive(dirPath) {
  if (process.platform !== "win32") return;

  const items = await fs.promises.readdir(dirPath);

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    try {
      const stats = await fs.promises.stat(fullPath);

      if (stats.isDirectory()) {
        await fs.promises.chmod(fullPath, 0o755);
        await changePermissionsRecursive(fullPath);
      } else {
        await fs.promises.chmod(fullPath, 0o666);
      }
    } catch (err) {
      // Ignore permission errors on individual files
      continue;
    }
  }
}

/**
 * Kill turbo processes more aggressively
 */
async function killTurboProcesses() {
  if (process.platform !== "win32") return;

  try {
    const { execSync } = require("child_process");

    console.log("🔍 Killing turbo processes...");

    // Kill turbo processes
    try {
      execSync("taskkill /f /im turbo.exe /t", { stdio: ["ignore", "ignore", "ignore"] });
      console.log("✅ Killed turbo.exe processes");
    } catch {
      console.log("ℹ️  No turbo.exe processes found");
    }

    // Kill any processes using turbo files
    try {
      execSync('taskkill /f /fi "MODULES eq turbo*" /t', { stdio: ["ignore", "ignore", "ignore"] });
    } catch {
      // Ignore if no processes found
    }

    // Give processes time to release handles
    console.log("⏳ Waiting for file handles to release...");
    await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 second delay
  } catch (error) {
    console.warn("⚠️  Could not kill all processes:", error.message);
  }
}

/**
 * Main clean function
 */
async function main() {
  console.log("🧹 Starting force clean...\n");

  // Kill processes first
  await killTurboProcesses();

  const itemsToDelete = [
    ".turbo",
    "node_modules",
    // Yarn files
    ".yarn",
    "yarn.lock",
    ".yarnrc.yml",
    ".yarnrc",
    // npm files
    "package-lock.json",
    ".npmrc",
    // pnpm files
    "pnpm-lock.yaml",
    ".pnpmfile.cjs",
    ".pnpm-store",
    // Bun files
    "bun.lockb",
    "bun.lock",
    ".bunfig.toml",
  ];

  for (const item of itemsToDelete) {
    await forceDelete(item);
    console.log(""); // Empty line for better readability
  }

  console.log("🎉 Force clean completed!");
}

// Handle unhandled promises
process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
  process.exit(1);
});

// Run the script
main().catch((error) => {
  console.error("Script failed:", error);
  process.exit(1);
});
