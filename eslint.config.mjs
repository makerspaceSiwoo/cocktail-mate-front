import storybook from "eslint-plugin-storybook";
import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

const eslintConfig = defineConfig([
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "storybook-static/**",
      "next-env.d.ts",
      ".claude/worktrees/**",
      "node_modules/**",
      "dist/**",
    ],
  },
  ...nextVitals,
  ...nextTs,
  prettier,
  ...storybook.configs["flat/recommended"],
]);

export default eslintConfig;
