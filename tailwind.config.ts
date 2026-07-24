import { type Config } from 'tailwindcss'
import { Viewport } from './config/Viewport'

export default {
  content: [
    './pages/**/*.md',
    './components/**/*.vue',
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
      background: '#2E3436',
      foreground: '#EEEEEC',
      neutral: {
        DEFAULT: '#555753',
        emphasis: '#D3D7CF',
      },
      danger: {
        DEFAULT: '#CC0000',
        emphasis: '#EF2929',
      },
      success: {
        DEFAULT: '#4E9A06',
        emphasis: '#8AE234',
      },
      warning: {
        DEFAULT: '#C4A000',
        emphasis: '#FCE94F',
      },
      primary: {
        DEFAULT: '#3465A4',
        emphasis: '#729FCF',
      },
      accent: {
        DEFAULT: '#75507B',
        emphasis: '#AD7FA8',
      },
      info: {
        DEFAULT: '#06989A',
        emphasis: '#34E2E2',
      },
    },

    borderWidth: ({ theme }) => ({
      0: '0px',
      DEFAULT: '1px',
      0.5: theme('spacing')['0.5'],
      1: theme('spacing.1'),
      2: theme('spacing.2'),
      3: theme('spacing.3'),
      4: theme('spacing.4'),
    }),

    container: {
      center: true,
      padding: {
        DEFAULT: '2rem',
        sm: '2rem',
        md: '2rem',
        lg: '4rem',
        xl: '8rem',
        '2xl': '16rem',
      },
    },

    zIndex: generateZIndexes(
      [],
      [
        'code-lang',
        'code-copy',
        'navbar',
        'menu',
      ],
    ),

    extend: {
      transitionDuration: {
        DEFAULT: '300ms',
      },
    },
  },
  plugins: [],
} satisfies Config

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
