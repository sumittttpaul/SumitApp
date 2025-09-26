/* eslint-disable */

const fs = require("fs");
const path = require("path");

/**
 * Color codes for better terminal output
 */
const colors = {
  reset: "[0m",
  bold: "[1m",
  dim: "[2m",
  red: "[31m",
  green: "[32m",
  yellow: "[33m",
  blue: "[34m",
  magenta: "[35m",
  cyan: "[36m",
  gray: "[90m"
};

/**
 * Spinner animation class for loading indicators
 */
class Spinner {
  constructor(text = "Loading...", frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]) {
    this.text = text;
    this.frames = frames;
    this.current = 0;
    this.interval = null;
    this.isSpinning = false;
  }

  start() {
    if (this.isSpinning) return;

    this.isSpinning = true;
    process.stdout.write("\x1b[?25l"); // Hide cursor

    this.interval = setInterval(() => {
      const frame = this.frames[this.current];
      process.stdout.write(`\r\x1b[K${colors.cyan}${frame} ${this.text}${colors.reset}`);
      this.current = (this.current + 1) % this.frames.length;
    }, 100);
  }

  stop(message = null) {
    if (!this.isSpinning) return;

    this.isSpinning = false;
    clearInterval(this.interval);
    process.stdout.write("\r\x1b[K"); // Clear current line completely
    process.stdout.write("\x1b[?25h"); // Show cursor

    if (message) {
      console.log(message);
    }
  }

  setText(text) {
    this.text = text;
  }
}

/**
 * Progress bar for multiple operations
 */
class ProgressBar {
  constructor(total, text = "Progress") {
    this.total = total;
    this.current = 0;
    this.text = text;
  }

  update(current, text = null) {
    this.current = current;
    if (text) this.text = text;

    const percentage = Math.round((current / this.total) * 100);
    const filled = Math.round((current / this.total) * 20);
    const empty = 20 - filled;

    const bar = "█".repeat(filled) + "░".repeat(empty);
    const progress = `${colors.cyan}[${bar}] ${percentage}%${colors.reset}`;

    process.stdout.write(`\r\x1b[K${progress} ${colors.gray}${this.text}${colors.reset}`);

    if (current === this.total) {
      process.stdout.write("\n");
    }
  }

  complete(message) {
    this.update(this.total, message);
  }
}

/**
 * Helper function for styled logging
 */
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * Force delete directories and files with loading animation
 */
async function forceDelete(targetPath, spinner = null) {
  try {
    if (!fs.existsSync(targetPath)) {
      return true;
    }

    const stats = fs.statSync(targetPath);
    const itemType = stats.isDirectory() ? "directory" : "file";
    const emoji = stats.isDirectory() ? "🗂️ " : "📄 ";

    if (spinner) {
      spinner.setText(`Deleting: ${path.basename(targetPath)}`);
    } else {
      log(`${emoji} Deleting ${itemType}: ${colors.cyan}${targetPath}${colors.reset}`);
    }

    if (stats.isDirectory()) {
      // On Windows, change permissions first
      if (process.platform === "win32") {
        try {
          await changePermissionsRecursive(targetPath);
        } catch (err) {
          if (!spinner) log(`⚠️  Could not change permissions for ${targetPath}: ${err.message}`, colors.yellow);
        }
      }

      await fs.promises.rm(targetPath, {
        recursive: true,
        force: true,
        maxRetries: 3,
        retryDelay: 100,
      });
    } else {
      // On Windows, remove read-only flag
      if (process.platform === "win32") {
        try {
          await fs.promises.chmod(targetPath, 0o666);
        } catch (err) {
          if (!spinner) log(`⚠️  Could not change permissions for ${targetPath}: ${err.message}`, colors.yellow);
        }
      }

      await fs.promises.unlink(targetPath);
    }

    if (!spinner) {
      log(`✅ Successfully deleted: ${colors.green}${targetPath}${colors.reset}`);
    }

    return true;
  } catch (error) {
    if (!spinner) {
      log(`❌ Failed to delete ${targetPath}: ${error.message}`, colors.red);
    }

    // Last resort: try system commands on Windows
    if (process.platform === "win32" && error.code === "EPERM") {
      try {
        const { execSync } = require("child_process");
        const isDirectory = stats && stats.isDirectory();

        if (isDirectory) {
          try {
            execSync(`rmdir /s /q "${targetPath}"`, { stdio: ["ignore", "ignore", "ignore"] });
          } catch {
            execSync(`powershell -c "Remove-Item -Recurse -Force '${targetPath}' -ErrorAction SilentlyContinue"`, {
              stdio: ["ignore", "ignore", "ignore"],
            });
          }
        } else {
          execSync(`del /f /q "${targetPath}"`, { stdio: ["ignore", "ignore", "ignore"] });
        }

        if (!fs.existsSync(targetPath)) {
          if (!spinner) log(`✅ Force deleted using system command: ${colors.green}${targetPath}${colors.reset}`);
          return true;
        } else {
          if (!spinner) log(`⚠️  Partial deletion of ${targetPath} - some files may remain`, colors.yellow);
          return false;
        }
      } catch (systemError) {
        if (!spinner) {
          log(`❌ System command also failed for ${targetPath}: ${systemError.message}`, colors.red);
          log(`ℹ️  You may need to manually delete ${targetPath} or restart processes using it`, colors.blue);
        }
        return false;
      }
    }
    return false;
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
      continue;
    }
  }
}

/**
 * Kill turbo processes with loading animation
 */
async function killTurboProcesses() {
  if (process.platform !== "win32") return;

  const spinner = new Spinner("Scanning for turbo processes...");
  spinner.start();

  try {
    const { execSync } = require("child_process");

    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate scanning

    spinner.setText("Terminating turbo processes...");

    try {
      execSync("taskkill /f /im turbo.exe /t", { stdio: ["ignore", "ignore", "ignore"] });
      await new Promise(resolve => setTimeout(resolve, 500));
      spinner.stop(`✅ Killed turbo.exe processes`);
    } catch {
      spinner.stop(`ℹ️  No turbo.exe processes found`);
    }

    // Kill any processes using turbo files
    try {
      execSync('taskkill /f /fi "MODULES eq turbo*" /t', { stdio: ["ignore", "ignore", "ignore"] });
    } catch {
      // Ignore if no processes found
    }

  } catch (error) {
    spinner.stop(`⚠️  Could not kill all processes: ${error.message}`);
  }
}

/**
 * Animated file handle wait
 */
async function waitForFileHandles() {
  const spinner = new Spinner("Waiting for file handles to release...");
  spinner.start();

  // Animate for 2 seconds
  await new Promise((resolve) => setTimeout(resolve, 2000));

  spinner.stop("⏳ File handles released");
}

/**
 * Main clean function with progress tracking
 */
async function main() {
  // Print header
  console.log();
  log("🧹 Starting force clean...", colors.bold + colors.magenta);
  console.log();

  // Step 1: Kill processes
  await killTurboProcesses();
  await waitForFileHandles();

  // Step 2: Delete files with progress
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

  // Filter only existing items
  const existingItems = itemsToDelete.filter(item => fs.existsSync(item));

  if (existingItems.length > 0) {
    const progressBar = new ProgressBar(existingItems.length, "Preparing cleanup...");

    for (let i = 0; i < existingItems.length; i++) {
      const item = existingItems[i];
      const spinner = new Spinner(`Processing ${item}...`);

      spinner.start();
      // Add a small delay to ensure proper terminal clearing
      await new Promise(resolve => setTimeout(resolve, 100));

      const success = await forceDelete(item, spinner);

      // Stop spinner first, then show result
      spinner.stop();

      if (success) {
        log(`✅ Successfully deleted: ${colors.green}${item}${colors.reset}`);
      } else {
        log(`⚠️  Could not delete: ${colors.yellow}${item}${colors.reset}`);
      }

      progressBar.update(i + 1, `Deleted ${i + 1}/${existingItems.length} items`);

      // Small delay between operations for better UX and to prevent overlap
      if (i < existingItems.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }

  } else {
    log("ℹ️  No files to clean - workspace is already clean!", colors.blue);
  }

  // Final completion animation with proper spacing
  const completionSpinner = new Spinner("Finalizing cleanup...");
  completionSpinner.start();
  await new Promise(resolve => setTimeout(resolve, 1000));
  completionSpinner.stop();

  console.log();
  log("🎉 Force clean completed!", colors.bold + colors.green);
  console.log();
}

// Handle unhandled promises
process.on("unhandledRejection", (error) => {
  log("Unhandled promise rejection:", colors.red);
  console.error(error);
  process.exit(1);
});

// Handle process termination
process.on("SIGINT", () => {
  process.stdout.write("\x1b[?25h"); // Show cursor
  console.log("\n\nCleaning interrupted.");
  process.exit(0);
});

// Run the script
main().catch((error) => {
  process.stdout.write("\x1b[?25h"); // Show cursor
  log("Script failed:", colors.red);
  console.error(error);
  process.exit(1);
});