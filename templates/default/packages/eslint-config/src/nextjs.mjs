import componentsConfig, { createConfigFileRule, createTypeAwareConfig } from "./components.mjs";
import pluginReact from "eslint-plugin-react";
import { FlatCompat } from "@eslint/eslintrc";

export { createConfigFileRule, createTypeAwareConfig };

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...componentsConfig,
  ...compat.config({
    extends: ["plugin:@next/next/recommended"],
  }),
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    plugins: { react: pluginReact },
    settings: { react: { version: "detect" } },
    rules: {
      "@next/next/no-html-link-for-pages": "off",
      "@typescript-eslint/triple-slash-reference": "off",
      "import/no-default-export": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-argument": "off",

      // Next.js specific
      "react-hooks/exhaustive-deps": "off",
      "react/no-unknown-property": ["error", { ignore: ["jsx", "global"] }],
    },
  },
  {
    ignores: [".next/**", "out/**", "public/**", "node_modules/**", ".vercel/**"],
  },
];
