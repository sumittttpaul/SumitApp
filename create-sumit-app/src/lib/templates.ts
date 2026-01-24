import { Project, Preset } from '../types/index.js';

const REPO_URL = 'https://github.com/sumittttpaul/SumitApp.git';

// Define individual projects that can be selected
export const PROJECTS: Record<string, Project> = {
  website: {
    name: 'website',
    description: 'Next.js 16 web application with App Router',
    path: 'templates/projects/website',
  },
  mobile: {
    name: 'mobile',
    description: 'Expo 54 mobile app for iOS and Android',
    path: 'templates/projects/mobile',
  },
  backend: {
    name: 'backend',
    description: 'Node.js 22 Express API with Vercel deployment',
    path: 'templates/projects/backend',
  },
};

// Define preset combinations for quick selection
export const PRESETS: Preset[] = [
  {
    name: 'default',
    description: 'Full-stack: Next.js + Expo + Node.js',
    projects: ['website', 'mobile', 'backend'],
  },
  {
    name: 'mobile-and-backend',
    description: 'Mobile-first: Expo + Node.js',
    projects: ['mobile', 'backend'],
  },
  {
    name: 'website-and-backend',
    description: 'Web-only: Next.js + Node.js',
    projects: ['website', 'backend'],
  },
  {
    name: 'custom',
    description: 'Choose your own projects',
    projects: [], // Will be selected interactively
  },
];

// Base template configuration
export const BASE_TEMPLATE = {
  path: 'templates/base',
  url: REPO_URL,
};

export function getPreset(name: string): Preset | undefined {
  return PRESETS.find((preset) => preset.name === name);
}

export function getProject(name: string): Project | undefined {
  return PROJECTS[name];
}

export function listPresets(): void {
  console.log('\n📋 Available presets:\n');

  PRESETS.forEach((preset, index) => {
    console.log(`${index + 1}. ${preset.name}`);
    console.log(`   ${preset.description}`);
    if (preset.projects.length > 0) {
      console.log(`   Projects: ${preset.projects.join(', ')}`);
    }
    console.log();
  });
}

export function listProjects(): void {
  console.log('\n📦 Available projects:\n');

  Object.values(PROJECTS).forEach((project, index) => {
    console.log(`${index + 1}. ${project.name}`);
    console.log(`   ${project.description}`);
    console.log();
  });
}

// Kept for backward compatibility - maps old template names to presets
export function getTemplate(name: string): Preset | undefined {
  // Map old template names to presets
  const templateToPreset: Record<string, string> = {
    default: 'default',
    'mobile and backend': 'mobile-and-backend',
    'website and backend': 'website-and-backend',
  };

  const presetName = templateToPreset[name] || name;
  return getPreset(presetName);
}

// Legacy export for backward compatibility
export const TEMPLATES = PRESETS;

export function listTemplates(): void {
  listPresets();
}
