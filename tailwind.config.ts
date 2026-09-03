import { type Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'
import { Theme, ThemeId } from './config/Theme'
import { Viewport } from './config/Viewport'

export default {
  content: [
    './pages/**/*.md',
    './components/**/*.vue',
    './components/**/*.stories.ts',
  ],

  theme: {
    screens: {
      [Viewport.sm.name]: Viewport.sm.pixelWidth,
      [Viewport.md.name]: Viewport.md.pixelWidth,
      [Viewport.lg.name]: Viewport.lg.pixelWidth,
      [Viewport.xl.name]: Viewport.xl.pixelWidth,
      [Viewport.xxl.name]: Viewport.xxl.pixelWidth,
    },

    fontFamily: {
      default: [
        'Pixel Code',
        'sans-serif',
      ],
      heading: [
        'Pixel Code',
        'serif',
      ],
      code: [
        'Pixel Code',
        'monospace',
      ],
    },

    colors: {
      transparent: 'transparent',
      bezel: variableColor('bezel'),
      background: variableColor('background'),
      foreground: variableColor('foreground'),
      crt: {
        aberration: {
          left: 'rgb(from currentcolor r 0 0)',
          right: 'rgb(from currentcolor 0 g b)',
        },
      },
      neutral: {
        DEFAULT: variableColor('neutral'),
        emphasis: variableColor('neutral-emphasis'),
      },
      danger: {
        DEFAULT: variableColor('danger'),
        emphasis: variableColor('danger-emphasis'),
      },
      success: {
        DEFAULT: variableColor('success'),
        emphasis: variableColor('success-emphasis'),
      },
      warning: {
        DEFAULT: variableColor('warning'),
        emphasis: variableColor('warning-emphasis'),
      },
      primary: {
        DEFAULT: variableColor('primary'),
        emphasis: variableColor('primary-emphasis'),
      },
      accent: {
        DEFAULT: variableColor('accent'),
        emphasis: variableColor('accent-emphasis'),
      },
      info: {
        DEFAULT: variableColor('info'),
        emphasis: variableColor('info-emphasis'),
      },
    },

    borderWidth: (utils) => ({
      0: '0px',
      DEFAULT: '1px',
      0.5: readThemeValue(utils.theme('spacing'), '0.5'),
      1: readThemeValue(utils.theme('spacing.1')),
      2: readThemeValue(utils.theme('spacing.2')),
      3: readThemeValue(utils.theme('spacing.3')),
      4: readThemeValue(utils.theme('spacing.4')),
    }),

    container: {
      center: true,
      padding: {
        DEFAULT: '0.5rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1rem',
        xl: '2rem',
        '2xl': '2rem',
      },
    },

    zIndex: generateZIndexes(
      [],
      [
        'scrollbar',
        'code-lang',
        'code-copy',
        'snake-score-feedback',
        'scroll-to-bottom',
        'crt-overlay',
      ],
    ),
  },

  plugins: [
    plugin((api) => {
      api.addBase(createThemeBaseStyles())
    }),
  ],
} satisfies Config

function variableColor(name: string): string {
  return `rgb(from var(--color-${name}) r g b / <alpha-value>)`
}

function readThemeValue(value: unknown, key?: string): string {
  if (key !== undefined && isRecord(value) && key in value) {
    return readThemeValue(value[key])
  }

  if (typeof value !== 'string') {
    throw new TypeError('Expected Tailwind theme value to be a string.')
  }

  return value
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function generateZIndexes(negative: string[], positive: string[]): Record<string, string> {
  const result: Record<string, string> = { auto: 'auto' }

  negative.forEach((component, i) => {
    result[component] = (-1 - i).toString()
  })

  positive.forEach((component, i) => {
    result[component] = (i + 1).toString()
  })

  return result
}

export function createThemeBaseStyles(): Record<string, Record<string, string>> {
  const themes = Theme.all()
  const styles: Record<string, Record<string, string>> = {
    ':root': themes[ThemeId.Mambo].toCssProperties(),
  }

  Object.values(themes).forEach((theme) => {
    styles[`[data-theme='${theme.id}']`] = theme.toCssProperties()
  })

  return styles
}
