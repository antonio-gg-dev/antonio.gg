import ProjectCard from '@/components/ProjectList/ProjectCard.vue'
import { bashunit, carDoorTrashBin, huezzle } from '@/components/ProjectList/stories.fixtures'
import { type Meta, type StoryObj } from '@storybook/vue3-vite'

export default {
  component: ProjectCard,
} satisfies Meta<typeof ProjectCard>

export const Bashunit: StoryObj<typeof ProjectCard> = {
  args: {
    project: bashunit,
  },
}

export const Huezzle: StoryObj<typeof ProjectCard> = {
  args: {
    project: huezzle,
  },
}

export const Compact: StoryObj<typeof ProjectCard> = {
  args: {
    compact: true,
    project: carDoorTrashBin,
  },
}
