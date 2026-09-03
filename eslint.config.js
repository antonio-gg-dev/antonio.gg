import js from '@eslint/js'
import love from 'eslint-config-love'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import storybook from 'eslint-plugin-storybook'
import vue from 'eslint-plugin-vue'
import globals from 'globals'
import typescriptEslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'

const sourceFiles = ['**/*.ts']
const vueFiles = ['**/*.vue']
const browserGlobals = {
  ...globals.browser,
  ...globals.es2021,
}
const legacyLoveCompatibilityRules = {
  '@typescript-eslint/class-methods-use-this': 'off',
  '@typescript-eslint/init-declarations': 'off',
  '@typescript-eslint/max-params': 'off',
  '@typescript-eslint/no-empty-function': 'off',
  '@typescript-eslint/no-import-type-side-effects': 'off',
  '@typescript-eslint/no-magic-numbers': 'off',
  '@typescript-eslint/no-redundant-type-constituents': 'off',
  '@typescript-eslint/no-unnecessary-condition': 'off',
  '@typescript-eslint/no-unsafe-assignment': 'off',
  '@typescript-eslint/no-unsafe-call': 'off',
  '@typescript-eslint/no-unsafe-enum-comparison': 'off',
  '@typescript-eslint/no-unsafe-member-access': 'off',
  '@typescript-eslint/no-unsafe-return': 'off',
  '@typescript-eslint/no-unsafe-type-assertion': 'off',
  '@typescript-eslint/prefer-destructuring': 'off',
  '@typescript-eslint/unbound-method': 'off',
  complexity: 'off',
  'max-lines': 'off',
  'no-console': 'off',
  'no-negated-condition': 'off',
  'no-param-reassign': 'off',
  'no-plusplus': 'off',
  'prefer-exponentiation-operator': 'off',
  'prefer-named-capture-group': 'off',
  'require-unicode-regexp': 'off',
}
const sharedLoveConfig = {
  plugins: love.plugins,
  rules: {
    ...love.rules,
    ...legacyLoveCompatibilityRules,
  },
}

export default [
  {
    ignores: [
      '.agents/snapshots/**',
      '.vitepress/cache/**',
      '.vitepress/dist/**',
      'storybook-static/**',
    ],
  },
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    ...love,
    ...sharedLoveConfig,
    files: sourceFiles,
    languageOptions: {
      ...love.languageOptions,
      globals: browserGlobals,
    },
  },
  {
    ...sharedLoveConfig,
    files: vueFiles,
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
]
