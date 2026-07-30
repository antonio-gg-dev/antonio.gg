import BlogCard from './BlogCard.vue'
import { type Meta, type StoryObj } from '@storybook/vue3'

export default {
  component: BlogCard,
} satisfies Meta<typeof BlogCard>

export const ReAprendiendoOop: StoryObj<typeof BlogCard> = {
  args: {
    post: {
      url: '#re-aprendiendo-oop',
      fileName: 're-aprendiendo-oop.md',
      title: 'Re-aprendiendo OOP',
      description: 'TODO',
      createdAt: '2025-10-28',
      author: 'Varios',
      wordCount: 336,
      tags: [
        'diseño',
        'oop',
        'software',
      ],
      coverUrl: '/images/blog/2025-10-28-re-aprendiendo-oop.png',
      coverAlt: 'Imagen de portada de Re-aprendiendo OOP',
    },
  },
}

export const PorQueUsarInlineSvgs: StoryObj<typeof BlogCard> = {
  args: {
    post: {
      url: '#por-que-usar-inline-svgs',
      fileName: 'por-que-usar-inline-svgs.md',
      title: 'Por qué usar Inline SVGs',
      description: 'TODO',
      createdAt: '2025-11-19',
      author: 'Antonio',
      wordCount: 520,
      tags: [
        'frontend',
        'software',
        'svg',
      ],
      coverUrl: '/images/blog/2025-11-19-por-que-usar-inline-svgs.png',
      coverAlt: 'Imagen de portada de Por qué usar Inline SVGs',
    },
  },
}
