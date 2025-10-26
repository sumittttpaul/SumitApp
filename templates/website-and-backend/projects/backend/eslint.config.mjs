import nodejsConfig, { createConfigFileRule, createTypeAwareConfig } from "@packages/eslint-config/nodejs";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Do not type-check this config file
  createConfigFileRule(),

  // Base Node.js config
  ...nodejsConfig,

  // Type-aware config for this project
  createTypeAwareConfig(import.meta.dirname),

  {
    files: ["**/*.{js,ts}"],
    // API-specific rules
    rules: {
      // Add any API-specific rule overrides here
    },
  },
];
