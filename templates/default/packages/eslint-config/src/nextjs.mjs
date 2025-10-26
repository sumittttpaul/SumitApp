import componentsConfig, { createConfigFileRule, createTypeAwareConfig } from "./components.mjs";
import nextPlugin from "@next/eslint-plugin-next";
import importPlugin from "eslint-plugin-import";
import { FlatCompat } from "@eslint/eslintrc";
import pluginReact from "eslint-plugin-react";
import tsEslint from "typescript-eslint";

export { createConfigFileRule, createTypeAwareConfig };

/** @type {import('eslint').Linter.Config[]} */
const nextjsConfig = [
  ...componentsConfig,
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    settings: { react: { version: "detect" } },
    plugins: {
      react: pluginReact,
      import: importPlugin,
      "@next/next": nextPlugin,
      "@typescript-eslint": tsEslint.plugin,
    },
    rules: {
      // Next.js specific
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "react/no-unknown-property": ["error", { ignore: ["jsx", "global"] }],
      "@next/next/no-html-link-for-pages": "off",

      // Allow default export
      "import/no-default-export": "off",

      // Relax some TypeScript rules
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/triple-slash-reference": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-call": "off",
    },
  },
  { ignores: [".next/**", "out/**", "public/**", "node_modules/**", ".vercel/**"] },
];

export default nextjsConfig;
