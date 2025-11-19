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
      sans: [
        'Inter',
        'sans-serif',
      ],
      serif: [
        'Aleo',
        'serif',
      ],
      mono: [
        'Source Code Pro',
        'monospace',
      ],
    },

    colors: {
      transparent: 'transparent',
      black: '#000000',
      white: '#ffffff',
      primary: {
        50: '#f9efee',
        100: '#edcfcc',
        200: '#e1b0a9',
        300: '#d59087',
        400: '#c87065',
        500: '#bc5043',
        600: '#9a4237',
        700: '#78332a',
        800: '#56251e',
        900: '#331612',
        950: '#060706',
        v1: {
          50: '#eeeff9',
          100: '#cccfed',
          200: '#a9b0e1',
          300: '#8790d5',
          400: '#6570c8',
          500: '#4350bc',
          600: '#37429a',
          700: '#2a3378',
          800: '#1e2556',
          900: '#121633',
          950: '#060711',
        },
      },
      background: {
        first: '#7d5219',
        second: '#7d2e19',
        third: '#7d1947',
        v1: {
          first: '#1e4756',
          second: '#1e2556',
          third: '#3d1e56',
        },
      },
      'warning-block': '#56491e',
      'danger-block': '#561e21',
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
