import js from '@eslint/js'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import storybook from 'eslint-plugin-storybook'
import vue from 'eslint-plugin-vue'
import globals from 'globals'
import typescriptEslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'

const browserGlobals = {
  ...globals.browser,
  ...globals.es2021,
}

export default typescriptEslint.config(
  {
    ignores: [
      '.agents/snapshots/**',
      '.vitepress/cache/**',
      '.vitepress/dist/**',
      'storybook-static/**',
    ],
  },
  js.configs.recommended,
  {
    extends: [typescriptEslint.configs.strictTypeChecked],
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      globals: browserGlobals,
      parserOptions: {
        projectService: true,
      },
    },
  },
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      globals: browserGlobals,
      parser: vueParser,
      parserOptions: {
        extraFileExtensions: ['.vue'],
        parser: typescriptEslint.parser,
        projectService: true,
        sourceType: 'module',
      },
    },
  },
  ...storybook.configs['flat/recommended'],
  prettierRecommended,
  {
    rules: {
      'prettier/prettier': 'error',
    },
  },
)
