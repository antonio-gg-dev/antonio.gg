import ProjectCard from './ProjectCard.vue'
import { type Meta, type StoryObj } from '@storybook/vue3'

export default {
  component: ProjectCard,
  render(args) {
    return {
      setup() {
        return { args }
      },
      components: { ProjectCard },
      template: `
        <div style="width: 20rem">
          <ProjectCard :project="args.project"/>
        </div>
      `,
    }
  },
} satisfies Meta<typeof ProjectCard>

export const Bashunit: StoryObj<typeof ProjectCard> = {
  args: {
    project: {
      url: '#bashunit',
      title: 'bashunit',
      description: 'TODO',
      createdAt: '2023-09-04',
      coverUrl: '/images/projects/bashunit.png',
      coverAlt: 'Imagen de portada de bashunit',
    },
  },
}

export const Huezzle: StoryObj<typeof ProjectCard> = {
  args: {
    project: {
      url: '#huezzle',
      title: 'Huezzle',
      description: 'TODO',
      createdAt: '2023-07-01',
      coverUrl: '/images/projects/huezzle.png',
      coverAlt: 'Imagen de portada de Huezzle',
    },
  },
}
