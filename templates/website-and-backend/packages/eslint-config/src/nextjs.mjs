import componentsConfig, { createConfigFileRule, createTypeAwareConfig } from "./components.mjs";
import nextPlugin from "@next/eslint-plugin-next";
import { FlatCompat } from "@eslint/eslintrc";
import pluginReact from "eslint-plugin-react";

export { createConfigFileRule, createTypeAwareConfig };

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...componentsConfig,
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    plugins: { react: pluginReact, "@next/next": nextPlugin },
    settings: { react: { version: "detect" } },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,

      // Next.js specific
      "@next/next/no-html-link-for-pages": "off",
      "react-hooks/exhaustive-deps": "off",
      "react/no-unknown-property": ["error", { ignore: ["jsx", "global"] }],

      // Allow default export
      "import/no-default-export": "off",

      // Relax some TypeScript rules
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/triple-slash-reference": "off",
    },
  },
  { ignores: [".next/**", "out/**", "public/**", "node_modules/**", ".vercel/**"] },
];
