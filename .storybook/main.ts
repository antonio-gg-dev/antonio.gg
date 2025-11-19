import type { StorybookConfig } from '@storybook/vue3-vite'

export default {
  stories: [
    '../components/**/*.stories.ts',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
    'storybook-dark-mode',
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
} satisfies StorybookConfig
