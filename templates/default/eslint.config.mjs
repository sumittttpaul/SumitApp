// This root config is minimal - each package/project has its own ESLint config
// ESLint v9 requires a root config file, so this serves that purpose

import eslintJs from "@eslint/js";
import globals from "globals";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Global ignores
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.turbo/**",
      "**/coverage/**",
      "**/.next/**",
      "**/.expo/**",
      "**/out/**",
      "**/.vercel/**",
      "**/*.json",
      "**/packages/**",
      "**/projects/**",
    ],
  },

  // Base JavaScript config for root level files only
  eslintJs.configs.recommended,

  // Configuration for JavaScript config files at root level
  {
    files: [
      "*.config.{js,mjs,cjs}",
      "eslint.config.{js,mjs,cjs}",
      "babel.config.js",
      "metro.config.js",
      "tailwind.config.js",
      "next.config.{js,mjs,cjs}",
      "vite.config.{js,mjs,cjs}",
      "*.{js,mjs,cjs}",
    ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.node },
    },
    rules: {
      "no-undef": "off",
    },
  },

  // Root level specific rules for any remaining files
  {
    files: ["**/*"],
    ignores: ["**/packages/**", "**/projects/**"],
    rules: {
      // Add any root level specific rules here
    },
  },
];
