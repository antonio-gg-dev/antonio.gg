import ProjectList from './ProjectList.vue'
import { type Meta, type StoryObj } from '@storybook/vue3'

export default {
  component: ProjectList,
} satisfies Meta<typeof ProjectList>

export const Default: StoryObj<typeof ProjectList> = {
  args: {
    projects: [
      {
        url: '#bashunit',
        title: 'bashunit',
        description: 'TODO',
        createdAt: '2023-09-04',
        coverUrl: '/images/projects/bashunit.png',
        coverAlt: 'Imagen de portada de bashunit',
      },
      {
        url: '#huezzle',
        title: 'Huezzle',
        description: 'TODO',
        createdAt: '2023-07-01',
        coverUrl: '/images/projects/huezzle.png',
        coverAlt: 'Imagen de portada de Huezzle',
      },
    ],
  },
}
