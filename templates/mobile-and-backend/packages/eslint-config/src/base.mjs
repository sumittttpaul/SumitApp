import eslintConfigPrettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import importPlugin from "eslint-plugin-import";
import turboPlugin from "eslint-plugin-turbo";
import pluginNode from "eslint-plugin-n";
import tsEslint from "typescript-eslint";
import eslintJs from "@eslint/js";
import globals from "globals";

// Centralized TypeScript rules to disable for config files
const disabledTypeScriptRulesForConfigFiles = {
  "@typescript-eslint/no-require-imports": "off",
  "@typescript-eslint/no-var-requires": "off",
  "@typescript-eslint/prefer-nullish-coalescing": "off",
  "@typescript-eslint/no-unsafe-assignment": "off",
  "@typescript-eslint/no-unsafe-member-access": "off",
  "@typescript-eslint/no-unsafe-call": "off",
  "@typescript-eslint/no-unsafe-return": "off",
  "@typescript-eslint/no-unsafe-argument": "off",
  "@typescript-eslint/no-floating-promises": "off",
  "@typescript-eslint/await-thenable": "off",
  "@typescript-eslint/no-misused-promises": "off",
  "@typescript-eslint/restrict-template-expressions": "off",
  "@typescript-eslint/restrict-plus-operands": "off",
  "@typescript-eslint/unbound-method": "off",
  "@typescript-eslint/require-await": "off",
  "@typescript-eslint/prefer-regexp-exec": "off",
  "@typescript-eslint/no-base-to-string": "off",
  "@typescript-eslint/prefer-includes": "off",
  "@typescript-eslint/prefer-string-starts-ends-with": "off",
  "@typescript-eslint/no-unnecessary-type-assertion": "off",
  "@typescript-eslint/non-nullable-type-assertion-style": "off",
  "@typescript-eslint/prefer-optional-chain": "off",
  "@typescript-eslint/no-redundant-type-constituents": "off",
  "@typescript-eslint/no-duplicate-type-constituents": "off",
  "@typescript-eslint/dot-notation": "off",
  "@typescript-eslint/prefer-reduce-type-parameter": "off",
  "no-undef": "off",
};

// Helper to create a config that completely avoids TypeScript parsing for config files
/**
 * @returns {import('eslint').Linter.Config}
 */
const createConfigFileRule = () => ({
  files: ["eslint.config.mjs"],
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    globals: { ...globals.node },
  },
  rules: {
    // Disable all TypeScript rules for config files
    ...disabledTypeScriptRulesForConfigFiles,
  },
});
// Helper to create type-aware config for workspace packages
/**
 * @param {string} tsconfigRootDir - The root directory for TypeScript configuration
 * @returns {import('eslint').Linter.Config}
 */
const createTypeAwareConfig = (tsconfigRootDir) => ({
  files: ["**/*.{ts,tsx}"],
  languageOptions: {
    parser: tsEslint.parser,
    parserOptions: {
      projectService: {
        allowDefaultProject: ["*.js", "*.mjs", "*.cjs"],
      },
      tsconfigRootDir: tsconfigRootDir,
    },
  },
});

/** @type {import('eslint').Linter.Config[]} */
const baseConfig = [
  // Base JavaScript config - applies to all files initially
  eslintJs.configs.recommended,

  // Configuration for JavaScript config files ONLY - no TypeScript parsing at all
  {
    files: ["**/*.config.{js,mjs,cjs}", "**/eslint.config.{js,mjs,cjs}", "**/*.{mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.node },
      // Explicitly no parser specified - use default Espree parser
    },
    plugins: {
      import: importPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      // Disable ALL TypeScript rules for config files
      ...disabledTypeScriptRulesForConfigFiles,
      "import/no-extraneous-dependencies": ["error", { devDependencies: true, packageDir: [".", "./", "./packages/*", "./projects/*"] }],
      "import/no-anonymous-default-export": ["error", { allowArray: true, allowObject: true }],
      "prettier/prettier": ["warn", { endOfLine: "auto" }],
    },
  },

  // TypeScript configuration - ONLY for .ts/.tsx source files, NOT config files
  {
    files: ["**/*.{ts,tsx}"],
    ignores: ["**/*.config.*"],
    languageOptions: {
      sourceType: "module",
      ecmaVersion: "latest",
      parser: tsEslint.parser,
      globals: { ...globals.node },
      // Note: tsconfigRootDir will be set by createTypeAwareConfig helper
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: ["./tsconfig.json", "./packages/*/tsconfig.json", "./projects/*/tsconfig.json"],
        },
        node: true,
      },
      "import/internal-regex": "^(@packages|@projects)/",
    },
    plugins: {
      n: pluginNode,
      turbo: turboPlugin,
      import: importPlugin,
      prettier: prettierPlugin,
      "@typescript-eslint": tsEslint.plugin,
    },
    rules: {
      // TypeScript rules
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_", ignoreRestSiblings: true },
      ],
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/no-unsafe-function-type": "warn",
      "@typescript-eslint/no-unsafe-member-access": "warn",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-empty-object-type": "warn",
      "@typescript-eslint/no-unsafe-assignment": "warn",
      "@typescript-eslint/no-unsafe-return": "warn",
      "@typescript-eslint/no-unsafe-call": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/prefer-nullish-coalescing": "warn",

      // Disable base rule in favor of TypeScript version
      "no-undef": "off",
      "no-unused-vars": "off",

      // Turbo rules
      "turbo/no-undeclared-env-vars": "error",

      // Node rules (selective to avoid conflicts)
      "n/no-missing-import": "off",
      "n/no-unsupported-features/es-syntax": "off",
      "n/no-unsupported-features/node-builtins": "off",
      "n/no-unpublished-import": "off",
      "n/no-unpublished-require": "off",
      "n/no-extraneous-import": "off",
      "n/no-extraneous-require": "off",

      // Import rules
      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: [
            "**/*.test.*",
            "**/*.spec.*",
            "**/test/**",
            "**/tests/**",
            "**/*.config.*",
            "**/vite.config.*",
            "**/next.config.*",
            "**/.eslintrc.*",
            "**/eslint.config.*",
            "**/scripts/**",
          ],
          packageDir: [".", "./", "./packages/*", "./projects/*"],
        },
      ],
      "import/no-relative-parent-imports": "off",
      "import/no-internal-modules": "off",
      "import/no-unresolved": ["error", { ignore: ["^@/"] }],

      // General rules
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],

      // Prettier
      "prettier/prettier": ["warn", { endOfLine: "auto" }],
    },
  },

  // JavaScript source files (not config files)
  {
    files: ["**/*.{js,jsx}"],
    ignores: ["**/*.config.*", "**/*.mjs", "**/*.cjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.node },
    },
    plugins: {
      n: pluginNode,
      turbo: turboPlugin,
      import: importPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_", ignoreRestSiblings: true }],
      "turbo/no-undeclared-env-vars": "error",
      "n/no-missing-import": "off",
      "n/no-unsupported-features/es-syntax": "off",
      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: ["**/*.test.*", "**/*.spec.*", "**/test/**", "**/tests/**", "**/*.config.*", "**/scripts/**"],
          packageDir: [".", "./", "./packages/*", "./projects/*"],
        },
      ],
      "prettier/prettier": ["warn", { endOfLine: "auto" }],
    },
  },

  // Prettier config
  eslintConfigPrettier,

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
    ],
  },
];

export { createConfigFileRule, createTypeAwareConfig };
export default baseConfig;
