import baseConfig, { createConfigFileRule, createTypeAwareConfig } from "./base.mjs";
import reactCompilerPlugin from "eslint-plugin-react-compiler";
import pluginReactHooks from "eslint-plugin-react-hooks";
import prettierPlugin from "eslint-plugin-prettier";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import pluginReact from "eslint-plugin-react";
import tsEslint from "typescript-eslint";
import globals from "globals";

export { createConfigFileRule, createTypeAwareConfig };

/** @type {import('eslint').Linter.Config[]} */
const componentsConfig = [
  ...baseConfig,
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    settings: { react: { version: "detect" } },
    languageOptions: { globals: { ...globals.browser, ...globals.serviceworker, React: "readonly", JSX: "readonly" } },
    plugins: {
      react: pluginReact,
      import: importPlugin,
      "jsx-a11y": pluginJsxA11y,
      "react-hooks": pluginReactHooks,
      "react-compiler": reactCompilerPlugin,
    },
    rules: {
      // React rules
      ...pluginReact.configs.recommended.rules,
      "react/no-unescaped-entities": "warn",
      "react/react-in-jsx-scope": "off",
      "react/display-name": "off",
      "react/prop-types": "off",

      // React Hooks rules
      ...pluginReactHooks.configs.recommended.rules,
      "react-hooks/exhaustive-deps": "off",

      // Accessibility rules
      ...pluginJsxA11y.configs.strict.rules,
      "jsx-a11y/no-noninteractive-element-interactions": "off",
      "jsx-a11y/click-events-have-key-events": "off",
      "jsx-a11y/interactive-supports-focus": "off",
      "jsx-a11y/no-autofocus": "warn",

      // React Compiler
      "react-compiler/react-compiler": "error",

      // Override some import rules for React components
      "import/prefer-default-export": "off",
      "import/no-default-export": "off",
    },
  },

  // Special configuration for .d.ts files
  {
    files: ["**/*.d.ts", "**/types.d.ts"],
    plugins: {
      import: importPlugin,
      prettier: prettierPlugin,
      "@typescript-eslint": tsEslint.plugin,
    },
    rules: {
      // Disable all rules that don't make sense for type declaration files
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/ban-types": "off",
      "import/no-extraneous-dependencies": "off",
      "import/no-unresolved": "off",
      "prettier/prettier": "off",
      "no-unused-vars": "off",
      "no-undef": "off",
    },
  },
];

export default componentsConfig;
