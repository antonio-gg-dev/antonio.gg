import { type Config } from 'tailwindcss'

export default {
  content: [
    './pages/**/*.md',
    './components/**/*.vue',
  ],
  theme: {
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
    zIndex: {
      'body-background-before': '-2',
      'body-background-after': '-1',

      'code-lang': '1',
      'code-copy': '2',
      'navigation-bar': '3',
    },
    extend: {
      transitionDuration: {
        DEFAULT: '300ms',
      },
    },
  },
  plugins: [],
} satisfies Config
