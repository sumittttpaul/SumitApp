import componentsConfig, { createConfigFileRule, createTypeAwareConfig } from "./components.mjs";
import globals from "globals";

export { createConfigFileRule, createTypeAwareConfig };

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...componentsConfig,
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        __DEV__: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        global: "readonly",
        process: "readonly",
        Buffer: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        setImmediate: "readonly",
        clearImmediate: "readonly",
        requestAnimationFrame: "readonly",
        cancelAnimationFrame: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/triple-slash-reference": "off",
      "no-console": "off",
      "import/no-relative-parent-imports": "off",

      // React Native specific
      "react-native/no-inline-styles": "off",
      "react-native/no-color-literals": "off",
      "react-native/no-raw-text": "off",

      // Relax some rules for React Native
      "jsx-a11y/accessible-emoji": "off",
      "jsx-a11y/aria-role": "off",
      "jsx-a11y/aria-props": "off",
      "jsx-a11y/aria-proptypes": "off",
      "jsx-a11y/aria-unsupported-elements": "off",
    },
  },
  {
    ignores: [
      "android/**",
      "ios/**",
      "plugins/**",
      ".expo/**",
      "metro.config.js",
      "babel.config.js",
      "tailwind.config.js",
      "expo-env.d.ts",
      "node_modules/**",
      "dist/**",
      "build/**",
    ],
  },
];
