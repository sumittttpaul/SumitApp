import nextjsConfig, { createConfigFileRule, createTypeAwareConfig } from "@packages/eslint-config/nextjs";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Do not type-check this config file
  createConfigFileRule(),

  // Rest of website config
  ...nextjsConfig,

  // Type-aware config for this project
  createTypeAwareConfig(import.meta.dirname),

  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    // App-specific rules
    rules: {
      // Add any app-specific rule overrides here
    },
  },
];
