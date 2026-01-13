// @ts-check

import { globalIgnores, defineConfig } from "eslint/config";
import { configs as tsConfigs } from "typescript-eslint";
import perfectionist from "eslint-plugin-perfectionist";
import prettier from "eslint-config-prettier/flat";
import globals from "globals";
import js from "@eslint/js";

export default defineConfig([
  globalIgnores(["dist/"]),
  js.configs.recommended,
  tsConfigs.recommendedTypeChecked,
  {
    rules: {
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ["eslint.config.js"],
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  perfectionist.configs["recommended-line-length"],
  prettier,
]);
