import ProjectList from '@/components/ProjectList/ProjectList.vue'
import { bashunit, huezzle } from '@/components/ProjectList/stories.fixtures'
import { type Meta, type StoryObj } from '@storybook/vue3-vite'

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
