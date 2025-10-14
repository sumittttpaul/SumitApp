import baseConfig, { createConfigFileRule, createTypeAwareConfig } from "@packages/eslint-config/base";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Do not type-check this config file
  createConfigFileRule(),

  // Base ESLint configuration
  ...baseConfig,

  // Type-aware config for this package
  createTypeAwareConfig(import.meta.dirname),

  {
    files: ["**/*.{js,ts,mjs,json}"],
    // Package-specific rules
    rules: {
      // Add any package-specific rule overrides here
    },
  },
];
