import ProjectCard from './ProjectCard.vue'
import { type Meta, type StoryObj } from '@storybook/vue3'

export default {
  component: ProjectCard,
} satisfies Meta<typeof ProjectCard>

export const Bashunit: StoryObj<typeof ProjectCard> = {
  args: {
    project: {
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
  },
}

export const Huezzle: StoryObj<typeof ProjectCard> = {
  args: {
    project: {
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
  },
}

export const Compact: StoryObj<typeof ProjectCard> = {
  args: {
    compact: true,
    project: {
      url: '#car-door-trash-bin',
      fileName: 'car-door-trash-bin.3d',
      title: 'Papelera para puerta del coche',
      description: 'TODO',
      createdAt: '2022-02-15',
      author: 'Antonio',
      wordCount: 921,
      tags: [
        '3d-print',
        'accesorio',
        'coche',
      ],
      coverUrl: '/images/projects/car-door-trash-bin.jpg',
      coverAlt: 'Imagen de portada de la papelera para puerta del coche',
    },
  },
}
