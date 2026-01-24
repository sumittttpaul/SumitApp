import baseConfig, { createConfigFileRule, createTypeAwareConfig } from "./base.mjs";
import importPlugin from "eslint-plugin-import";
import pluginNode from "eslint-plugin-n";
import tsEslint from "typescript-eslint";
import globals from "globals";

export { createConfigFileRule, createTypeAwareConfig };

/** @type {import('eslint').Linter.Config[]} */
const nodejsConfig = [
  ...baseConfig,
  {
    files: ["**/*.{js,ts,mjs,cjs}"],
    languageOptions: { globals: { ...globals.node, ...globals.es2022 } },
    plugins: {
      n: pluginNode,
      import: importPlugin,
      "@typescript-eslint": tsEslint.plugin,
    },
    rules: {
      // Node.js specific rules
      "n/no-unsupported-features/node-builtins": "error",
      "n/prefer-global/process": "error",
      "n/prefer-global/buffer": "error",
      "n/no-deprecated-api": "error",

      // Allow console in serverless functions
      "no-console": "off",

      // Allow default export
      "import/no-default-export": "off",

      // Relax some TypeScript rules
      "@typescript-eslint/no-unsafe-member-access": "warn",
      "@typescript-eslint/no-unsafe-assignment": "warn",
      "@typescript-eslint/no-unsafe-return": "warn",
      "@typescript-eslint/no-unsafe-call": "warn",
    },
  },
  {
    files: ["**/api/**/*.{js,ts}"],
    rules: { "import/no-anonymous-default-export": "off" },
  },
  { ignores: ["**/eslint.config.*"] },
];

export default nodejsConfig;
