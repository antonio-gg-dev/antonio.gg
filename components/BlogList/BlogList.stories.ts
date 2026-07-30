import BlogList from './BlogList.vue'
import { type Meta, type StoryObj } from '@storybook/vue3'

export default {
  component: BlogList,
} satisfies Meta<typeof BlogList>

export const Default: StoryObj<typeof BlogList> = {
  args: {
    posts: [
      {
        url: '#re-aprendiendo-oop',
        title: 'Re-aprendiendo OOP',
        description: 'TODO',
        createdAt: '2025-10-28',
        coverUrl: '/images/blog/2025-10-28-re-aprendiendo-oop.png',
        coverAlt: 'Imagen de portada de Re-aprendiendo OOP',
      },
      {
        url: '#por-que-usar-inline-svgs',
        title: 'Por qué usar Inline SVGs',
        description: 'TODO',
        createdAt: '2025-11-19',
        coverUrl: '/images/blog/2025-11-19-por-que-usar-inline-svgs.png',
        coverAlt: 'Imagen de portada de Por qué usar Inline SVGs',
      },
    ],
  },
}
