export interface Template {
  name: string;
  description: string;
  url: string;
  path?: string;
  dependencies?: string[];
  features: string[];
}

export interface Config {
  defaultTemplate?: string;
  packageManager?: 'npm' | 'yarn' | 'pnpm' | 'bun';
  git?: boolean;
  verbose?: boolean;
  skipUpdateCheck?: boolean;
}

export interface CreateProjectOptions {
  template?: string;
  packageManager?: string;
  verbose?: boolean;
  git?: boolean;
  skipInstall?: boolean;
}

export type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun';

export interface PackageManagerInfo {
  name: PackageManager;
  lockFile: string;
  command: string;
  installArgs: string[];
}
