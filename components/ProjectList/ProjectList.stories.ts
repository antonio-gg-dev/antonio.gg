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
        fileName: 'bashunit.src',
        title: 'bashunit',
        description: 'TODO',
        createdAt: '2023-09-04',
        author: 'TypedDevs',
        wordCount: 528,
        tags: [
          'bash',
          'software',
          'testing',
        ],
        coverUrl: '/images/projects/bashunit.png',
        coverAlt: 'Imagen de portada de bashunit',
      },
      {
        url: '#huezzle',
        fileName: 'huezzle.src',
        title: 'Huezzle',
        description: 'TODO',
        createdAt: '2023-07-01',
        author: 'Antonio',
        wordCount: 369,
        tags: [
          'frontend',
          'juego',
          'puzzle',
          'software',
          'vue',
        ],
        coverUrl: '/images/projects/huezzle.png',
        coverAlt: 'Imagen de portada de Huezzle',
      },
    ],
  },
}
