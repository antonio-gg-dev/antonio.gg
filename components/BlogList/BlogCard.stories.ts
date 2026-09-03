import BlogCard from './BlogCard.vue'
import { porQueUsarInlineSvgs, reAprendiendoOop } from './stories.fixtures'
import { type Meta, type StoryObj } from '@storybook/vue3-vite'

export default {
  component: BlogCard,
} satisfies Meta<typeof BlogCard>

export const ReAprendiendoOop: StoryObj<typeof BlogCard> = {
  args: {
    post: reAprendiendoOop,
  },
}

export const PorQueUsarInlineSvgs: StoryObj<typeof BlogCard> = {
  args: {
    post: porQueUsarInlineSvgs,
  },
}

export const Compact: StoryObj<typeof BlogCard> = {
  args: {
    compact: true,
    post: reAprendiendoOop,
  },
}
