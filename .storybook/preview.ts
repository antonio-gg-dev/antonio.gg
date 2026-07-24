import { Preview } from '@storybook/vue3'
import { themes } from '@storybook/theming'
import '@/styles/index.scss'
import { Viewport } from '@/config/Viewport'

export default {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    darkMode: {
      current: 'dark',
    },

    docs: {
      theme: themes.dark,
    },

    viewport: {
      viewports: {
        [Viewport.xs.name]: {
          name: Viewport.xs.name,
          styles: { width: Viewport.xs.pixelWidth, height: '100%' },
        },
        [Viewport.sm.name]: {
          name: Viewport.sm.name,
          styles: { width: Viewport.sm.pixelWidth, height: '100%' },
        },
        [Viewport.md.name]: {
          name: Viewport.md.name,
          styles: { width: Viewport.md.pixelWidth, height: '100%' },
        },
        [Viewport.lg.name]: {
          name: Viewport.lg.name,
          styles: { width: Viewport.lg.pixelWidth, height: '100%' },
        },
        [Viewport.xl.name]: {
          name: Viewport.xl.name,
          styles: { width: Viewport.xl.pixelWidth, height: '100%' },
        },
        [Viewport.xxl.name]: {
          name: Viewport.xxl.name,
          styles: { width: Viewport.xxl.pixelWidth, height: '100%' },
        },
      },
      defaultViewport: Viewport.xxl.name,
    },
  },
} satisfies Preview
