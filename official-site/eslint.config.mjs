import eslintConfigPrettier from "eslint-config-prettier";
import reactCompiler from "eslint-plugin-react-compiler";
import prettierPlugin from "eslint-plugin-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";
import { FlatCompat } from "@eslint/eslintrc";
import pluginReact from "eslint-plugin-react";
import jsxA11y from "eslint-plugin-jsx-a11y";
import pluginNode from "eslint-plugin-n";
import tsEslint from "typescript-eslint";
import eslintJs from "@eslint/js";
import globals from "globals";

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

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
export default [
  // Do not type-check this config file
  createConfigFileRule(),

  // Global ignores
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
      "**/.next/**",
      "**/.expo/**",
      "**/out/**",
      "**/.vercel/**",
      "**/*.json",
    ],
  },

  // Base JavaScript config - applies to all files initially
  eslintJs.configs.recommended,

  // Configuration for JavaScript config files ONLY - no TypeScript parsing at all
  {
    files: ["**/*.config.{js,mjs,cjs}", "**/eslint.config.{js,mjs,cjs}", "**/*.{mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.node },
    },
    plugins: {
      import: importPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...disabledTypeScriptRulesForConfigFiles,
      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: true,
          packageDir: [".", "./", "./packages/*", "./projects/*"],
        },
      ],
      "prettier/prettier": ["warn", { endOfLine: "auto" }],
    },
  },

  // Consolidated TypeScript/React/Next.js configuration
  {
    files: ["**/*.{ts,tsx}"],
    ignores: ["**/*.config.*"],
    languageOptions: {
      parser: tsEslint.parser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.serviceworker,
        ...globals.node,
        React: "readonly",
        JSX: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tsEslint.plugin,
      n: pluginNode,
      import: importPlugin,
      prettier: prettierPlugin,
      react: pluginReact,
      "jsx-a11y": jsxA11y,
      "react-hooks": reactHooks,
      "react-compiler": reactCompiler,
    },
    settings: {
      react: { version: "detect" },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: ["./tsconfig.json", "./packages/*/tsconfig.json", "./projects/*/tsconfig.json"],
        },
        node: true,
      },
      "import/internal-regex": "^(@packages|@projects)/",
    },
    rules: {
      // TypeScript rules
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/no-unsafe-function-type": "warn",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-empty-object-type": "warn",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/prefer-nullish-coalescing": "warn",
      "@typescript-eslint/triple-slash-reference": "off",

      // Disable base rule in favor of TypeScript version
      "no-undef": "off",
      "no-unused-vars": "off",

      // Node rules (selective to avoid conflicts)
      "n/no-missing-import": "off",
      "n/no-unsupported-features/es-syntax": "off",
      "n/no-unsupported-features/node-builtins": "warn",
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
      "import/no-default-export": "off",
      "import/prefer-default-export": "off",

      // React rules
      ...pluginReact.configs.recommended.rules,
      "react/prop-types": "off",
      "react/display-name": "off",
      "react/react-in-jsx-scope": "off",
      "react/no-unescaped-entities": "warn",
      "react/no-unknown-property": ["error", { ignore: ["jsx", "global"] }],

      // React Hooks rules
      ...reactHooks.configs.recommended.rules,
      "react-hooks/exhaustive-deps": "off",

      // Accessibility rules
      ...jsxA11y.configs.strict.rules,
      "jsx-a11y/no-autofocus": "warn",
      "jsx-a11y/no-noninteractive-element-interactions": "off",
      "jsx-a11y/click-events-have-key-events": "off",
      "jsx-a11y/interactive-supports-focus": "off",

      // React Compiler
      "react-compiler/react-compiler": "error",

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
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      n: pluginNode,
      import: importPlugin,
      prettier: prettierPlugin,
      react: pluginReact,
      "jsx-a11y": jsxA11y,
      "react-hooks": reactHooks,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "n/no-missing-import": "off",
      "n/no-unsupported-features/es-syntax": "off",
      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: ["**/*.test.*", "**/*.spec.*", "**/test/**", "**/tests/**", "**/*.config.*", "**/scripts/**"],
          packageDir: [".", "./", "./packages/*", "./projects/*"],
        },
      ],

      // React rules for JSX files
      ...pluginReact.configs.recommended.rules,
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",

      // React Hooks
      ...reactHooks.configs.recommended.rules,

      // Basic accessibility for JSX
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-has-content": "error",

      "prettier/prettier": ["warn", { endOfLine: "auto" }],
    },
  },

  // Prettier config
  eslintConfigPrettier,

  // Special configuration for .d.ts files
  {
    files: ["**/*.d.ts", "**/types.d.ts"],
    languageOptions: {
      parser: tsEslint.parser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "no-undef": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-namespace": "off",
      "import/no-extraneous-dependencies": "off",
      "import/no-unresolved": "off",
      "prettier/prettier": "off",
    },
  },

  // Next.js specific overrides
  ...compat.config({
    extends: ["plugin:@next/next/recommended"],
  }),
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    rules: {
      "@next/next/no-html-link-for-pages": "off",
      "import/no-default-export": "off",
      "import/prefer-default-export": "off",
    },
  },

  // Type-aware config for this project
  createTypeAwareConfig(import.meta.dirname),
];
