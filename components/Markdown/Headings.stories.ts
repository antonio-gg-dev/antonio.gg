import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MarkdownWrapper from '@/components/Markdown/MarkdownWrapper.vue'

enum headings {
  h1 = '#',
  h2 = '##',
  h3 = '###',
  h4 = '####',
  h5 = '#####',
  h6 = '######',
}

interface args {
  tag: headings
  content: string
}

export default {
  title: 'Markdown/Headings',
  argTypes: {
    tag: {
      control: 'select',
      options: Object.values({ ...headings }),
    },
    content: {
      control: 'text',
    },
  },
  args: {
    tag: headings.h1,
  },
  render(args) {
    return {
      components: { MarkdownWrapper },
      computed: {
        template() {
          return `${args.tag} ${args.content}`
        },
      },
      template: `
        <MarkdownWrapper
          :template="template"
        />
      `,
    }
  },
} satisfies Meta<args>

export const HeadingLevel1: StoryObj<args> = {
  args: {
    tag: headings.h1,
    content: 'Heading',
  },
}

export const HeadingLevel2: StoryObj<args> = {
  args: {
    tag: headings.h2,
    content: 'Heading',
  },
}

export const HeadingLevel3: StoryObj<args> = {
  args: {
    tag: headings.h3,
    content: 'Heading',
  },
}

export const HeadingLevel4: StoryObj<args> = {
  args: {
    tag: headings.h4,
    content: 'Heading',
  },
}

export const HeadingLevel5: StoryObj<args> = {
  args: {
    tag: headings.h5,
    content: 'Heading',
  },
}

export const HeadingLevel6: StoryObj<args> = {
  args: {
    tag: headings.h6,
    content: 'Heading',
  },
}

export const HeadingWithStyles: StoryObj<args> = {
  args: {
    content: 'Heading **Bold** _italic_ `code`',
  },
}
