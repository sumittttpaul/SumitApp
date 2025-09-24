import * as path from "path";
import * as fs from "fs";

export function getTurborepoRoot(projectRoot: string): string {
  // Assuming the structure is: turborepo/projects/mobile
  // Go up two levels to reach the turborepo root
  return path.resolve(projectRoot, "../../");
}

export function getRootNodeModulePath(projectRoot: string, packageName: string): string {
  const rootDir = getTurborepoRoot(projectRoot);
  return path.join(rootDir, "node_modules", packageName);
}

export function getRootNodeModuleFilePath(projectRoot: string, packageName: string, filePath: string): string {
  const packagePath = getRootNodeModulePath(projectRoot, packageName);
  return path.join(packagePath, filePath);
}

export function rootNodeModuleFileExists(projectRoot: string, packageName: string, filePath: string): boolean {
  const fullPath = getRootNodeModuleFilePath(projectRoot, packageName, filePath);
  return fs.existsSync(fullPath);
}

export function findNodeModuleFile(projectRoot: string, packageName: string, filePath: string): string | null {
  const fullPath = getRootNodeModuleFilePath(projectRoot, packageName, filePath);
  return fs.existsSync(fullPath) ? fullPath : null;
}

export async function copyFiles(srcDir: string, destDir: string): Promise<void> {
  await fs.promises.mkdir(destDir, { recursive: true });
  for (const file of await fs.promises.readdir(srcDir)) {
    const srcFile = path.join(srcDir, file);
    const destFile = path.join(destDir, file);
    const stat = await fs.promises.lstat(srcFile);
    if (stat.isDirectory()) {
      await copyFiles(srcFile, destFile);
    } else {
      await fs.promises.copyFile(srcFile, destFile);
    }
  }
}
