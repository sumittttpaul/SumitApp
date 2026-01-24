export interface Project {
  name: string;
  description: string;
  path: string;
}

export interface Preset {
  name: string;
  description: string;
  projects: string[];
}

export interface Config {
  defaultPreset?: string;
  packageManager?: 'npm' | 'yarn' | 'pnpm' | 'bun';
  git?: boolean;
  verbose?: boolean;
  skipUpdateCheck?: boolean;
  // Legacy support
  defaultTemplate?: string;
}

export interface CreateProjectOptions {
  preset?: string;
  projects?: string[];
  packageManager?: string;
  verbose?: boolean;
  git?: boolean;
  skipInstall?: boolean;
  // Legacy support
  template?: string;
}

export type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun';

export interface PackageManagerInfo {
  name: PackageManager;
  lockFile: string;
  command: string;
  installArgs: string[];
}

// Legacy types for backward compatibility
export interface Template {
  name: string;
  description: string;
  url: string;
  path?: string;
  dependencies?: string[];
  features: string[];
}
