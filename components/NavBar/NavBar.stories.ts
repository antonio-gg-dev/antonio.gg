import NavBar from './NavBar.vue'
import { type Meta, type StoryObj } from '@storybook/vue3'
import { Viewport } from '@/config/Viewport'

export default {
  component: NavBar,
} satisfies Meta<typeof NavBar>

export const Default: StoryObj<typeof NavBar> = {}

export const MobileClosed: StoryObj<typeof NavBar> = {
  args: {
    open: false,
  },
  parameters: {
    viewport: {
      defaultViewport: Viewport.sm.name,
    },
  },
}

export const MobileOpen: StoryObj<typeof NavBar> = {
  args: {
    open: true,
  },
  parameters: {
    viewport: {
      defaultViewport: Viewport.sm.name,
    },
  },
}
