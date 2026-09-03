import ProjectList from './ProjectList.vue'
import { bashunit, huezzle } from './stories.fixtures'
import { type Meta, type StoryObj } from '@storybook/vue3'

export default {
  component: ProjectList,
} satisfies Meta<typeof ProjectList>

export const Default: StoryObj<typeof ProjectList> = {
  args: {
    projects: [
      bashunit,
      huezzle,
    ],
  },
}
