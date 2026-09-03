import BlogList from './BlogList.vue'
import { porQueUsarInlineSvgs, reAprendiendoOop } from './stories.fixtures'
import { type Meta, type StoryObj } from '@storybook/vue3-vite'

export default {
  component: BlogList,
} satisfies Meta<typeof BlogList>

export const Default: StoryObj<typeof BlogList> = {
  args: {
    posts: [
      reAprendiendoOop,
      porQueUsarInlineSvgs,
    ],
  },
}
