import { Preview } from '@storybook/vue3'
import { themes } from '@storybook/theming'
import '@/styles/index.scss'
import { Theme, ThemeId, type PresetThemeId } from '@/config/Theme'
import { Viewport } from '@/config/Viewport'

const availableThemes = Theme.all()

export default {
  globalTypes: {
    theme: {
      description: 'Theme for the preview',
      defaultValue: ThemeId.Mambo,
      toolbar: {
        icon: 'paintbrush',
        items: Object.values(availableThemes).map((theme) => ({
          value: theme.id,
          title: theme.name,
        })),
      },
    },
  },

  decorators: [
    (story: () => unknown, context: { globals: { theme?: ThemeId } }) => {
      const theme = availableThemes[context.globals.theme as PresetThemeId] ?? availableThemes[ThemeId.Mambo]

      document.documentElement.dataset.theme = theme.id
      Object.entries(theme.toCssProperties()).forEach(
        ([
          property,
          value,
        ]) => {
          document.documentElement.style.setProperty(property, value)
        },
      )
      document.body.style.backgroundColor = 'var(--color-background)'

      return story()
    },
  ],

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
