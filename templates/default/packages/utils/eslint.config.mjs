import componentsConfig, { createConfigFileRule, createTypeAwareConfig } from "@packages/eslint-config/components";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Do not type-check this config file
  createConfigFileRule(),

  // Base components config (for utilities)
  ...componentsConfig,

  // Type-aware config for this package
  createTypeAwareConfig(import.meta.dirname),

  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    // Package-specific rules
    rules: {
      // Add any package-specific rule overrides here
    },
  },
];
