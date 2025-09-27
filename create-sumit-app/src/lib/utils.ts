import { PackageManager, PackageManagerInfo } from '../types/index.js';
import updateCheck from 'update-check';
import { Logger } from './logger.js';
import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';

const PACKAGE_MANAGERS: PackageManagerInfo[] = [
  {
    name: 'bun',
    lockFile: 'bun.lock',
    command: 'bun',
    installArgs: ['install'],
  },
  {
    name: 'pnpm',
    lockFile: 'pnpm-lock.yaml',
    command: 'pnpm',
    installArgs: ['install'],
  },
  {
    name: 'yarn',
    lockFile: 'yarn.lock',
    command: 'yarn',
    installArgs: ['install'],
  },
  {
    name: 'npm',
    lockFile: 'package-lock.json',
    command: 'npm',
    installArgs: ['install'],
  },
];

export function getPackageManagerInfo(
  name: PackageManager
): PackageManagerInfo {
  return PACKAGE_MANAGERS.find((pm) => pm.name === name) || PACKAGE_MANAGERS[3]; // Default to npm
}

export async function checkForUpdates(logger: Logger): Promise<void> {
  try {
    const packagePath = path.resolve(process.cwd(), 'package.json');
    if (!(await fs.pathExists(packagePath))) return;

    const packageJson = await fs.readJson(packagePath);
    const update = await updateCheck(packageJson);

    if (update) {
      logger.newLine();
      logger.box(
        `A new version is available: ${logger.gradient(update.latest)}\n` +
          `Current version: ${packageJson.version}\n\n` +
          `Run: ${logger.gradient('npm install -g create-sumit-app@latest')} to update`,
        '🚀 Update Available'
      );
      logger.newLine();
    }
  } catch (error) {
    logger.debug(`Update check failed: ${error}`);
  }
}

export async function isDirectoryEmpty(dirPath: string): Promise<boolean> {
  try {
    const files = await fs.readdir(dirPath);
    return files.length === 0;
  } catch {
    return true; // Directory doesn't exist, so it's "empty"
  }
}

export async function validateProjectName(
  name: string
): Promise<{ valid: boolean; message?: string }> {
  // Check for valid npm package name
  const validNameRegex = /^[a-z0-9]([a-z0-9._-]*[a-z0-9])?$/i;

  if (!validNameRegex.test(name)) {
    return {
      valid: false,
      message:
        'Project name must be a valid package name (lowercase, no spaces, only letters, numbers, dashes, underscores, and dots)',
    };
  }

  if (name.length > 214) {
    return {
      valid: false,
      message: 'Project name must be less than 214 characters',
    };
  }

  if (name.startsWith('.') || name.startsWith('-') || name.startsWith('_')) {
    return {
      valid: false,
      message: 'Project name cannot start with a dot, dash, or underscore',
    };
  }

  return { valid: true };
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ${seconds % 60}s`;
}

export async function initializeGitRepository(
  projectPath: string,
  logger: Logger
): Promise<boolean> {
  try {
    await execa('git', ['init'], { cwd: projectPath });
    await execa('git', ['add', '.'], { cwd: projectPath });
    await execa(
      'git',
      ['commit', '-m', 'Initial commit from create-sumit-app'],
      { cwd: projectPath }
    );
    logger.verbose('Initialized git repository with initial commit');
    return true;
  } catch (error) {
    logger.debug(`Git initialization failed: ${error}`);
    return false;
  }
}
