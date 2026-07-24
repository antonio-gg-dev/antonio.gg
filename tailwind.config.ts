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
      bg: '#2E3436',
      fg: '#EEEEEC',
      neutral: {
        bg: '#555753',
        fg: '#D3D7CF',
      },
      danger: {
        bg: '#CC0000',
        fg: '#EF2929',
      },
      success: {
        bg: '#4E9A06',
        fg: '#8AE234',
      },
      warning: {
        bg: '#C4A000',
        fg: '#FCE94F',
      },
      primary: {
        bg: '#3465A4',
        fg: '#729FCF',
      },
      accent: {
        bg: '#75507B',
        fg: '#AD7FA8',
      },
      info: {
        bg: '#06989A',
        fg: '#34E2E2',
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
      [
        'body-background-after',
        'body-background-before',
      ],
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
