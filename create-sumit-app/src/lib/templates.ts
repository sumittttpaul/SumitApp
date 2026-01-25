import { Project, Preset, PackageManagerInfo } from "../types/index.js";

const REPO_URL = "https://github.com/sumittttpaul/SumitApp.git";

// Define individual projects that can be selected
export const PROJECTS: Record<string, Project> = {
  website: {
    name: "website",
    description: "Next.js 16 web application with App Router",
    path: "templates/projects/website",
  },
  mobile: {
    name: "mobile",
    description: "Expo 54 mobile app for iOS and Android",
    path: "templates/projects/mobile",
  },
  backend: {
    name: "backend",
    description: "Node.js 25 Express API with Vercel deployment",
    path: "templates/projects/backend",
  },
};

// Define preset combinations for quick selection
export const PRESETS: Preset[] = [
  {
    name: "default",
    description: "Full-stack: Next.js + Expo + Node.js",
    projects: ["website", "mobile", "backend"],
  },
  {
    name: "mobile-and-backend",
    description: "Mobile-first: Expo + Node.js",
    projects: ["mobile", "backend"],
  },
  {
    name: "website-and-backend",
    description: "Web-only: Next.js + Node.js",
    projects: ["website", "backend"],
  },
  {
    name: "custom",
    description: "Choose your own projects",
    projects: [], // Will be selected interactively
  },
];

// Define package managers
export const PACKAGE_MANAGERS: PackageManagerInfo[] = [
  {
    name: "bun",
    lockFile: "bun.lock",
    command: "bun",
    installArgs: ["install"],
  },
  {
    name: "pnpm",
    lockFile: "pnpm-lock.yaml",
    command: "pnpm",
    installArgs: ["install"],
  },
  {
    name: "yarn",
    lockFile: "yarn.lock",
    command: "yarn",
    installArgs: ["install"],
  },
  {
    name: "npm",
    lockFile: "package-lock.json",
    command: "npm",
    installArgs: ["install", "--legacy-peer-deps"],
  },
];

// Base template configuration
export const BASE_TEMPLATE = {
  path: "templates/base",
  url: REPO_URL,
};

// Deprecated alias for backward compatibility
export const TEMPLATES = PRESETS;
