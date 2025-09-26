import nodeConfig, { createConfigFileRule, createTypeAwareConfig } from "@packages/eslint-config/node";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Do not type-check this config file
  createConfigFileRule(),

  // Base Node.js config
  ...nodeConfig,

  // Type-aware config for this project
  createTypeAwareConfig(import.meta.dirname),

  {
    files: ["**/*.{js,ts,mjs,cjs}"],
    // API-specific rules
    rules: {
      // Add any API-specific rule overrides here
    },
  },
];
