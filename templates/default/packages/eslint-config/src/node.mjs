import baseConfig, { createConfigFileRule, createTypeAwareConfig } from "./base.mjs";
import importPlugin from "eslint-plugin-import";
import pluginNode from "eslint-plugin-n";
import globals from "globals";

export { createConfigFileRule, createTypeAwareConfig };

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...baseConfig,
  { ignores: ["**/eslint.config.*"] },
  {
    files: ["**/*.{js,ts,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
    },
    plugins: {
      n: pluginNode,
      import: importPlugin,
    },
    rules: {
      // Node.js specific rules
      "n/no-unsupported-features/node-builtins": "error",
      "n/no-deprecated-api": "error",
      "n/prefer-global/buffer": "error",
      "n/prefer-global/process": "error",

      // Allow console in serverless functions
      "no-console": "off",

      // Vercel/serverless specific
      "import/no-default-export": "off",

      // Relax some TypeScript rules for API
      "@typescript-eslint/no-unsafe-assignment": "warn",
      "@typescript-eslint/no-unsafe-member-access": "warn",
      "@typescript-eslint/no-unsafe-call": "warn",
      "@typescript-eslint/no-unsafe-return": "warn",
    },
  },
  {
    files: ["**/api/**/*.{js,ts}"],
    rules: { "import/no-anonymous-default-export": "off" },
  },
];
