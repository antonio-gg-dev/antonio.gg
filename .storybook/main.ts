import type { StorybookConfig } from '@storybook/vue3-vite'

export default {
  stories: [
    '../components/**/*.stories.ts',
  ],
  addons: [
    '@chromatic-com/storybook',
    'storybook-dark-mode',
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {
      docgen: 'vue-component-meta',
    },
  },
} satisfies StorybookConfig
