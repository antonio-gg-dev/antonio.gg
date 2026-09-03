import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MarkdownWrapper from '@/components/Markdown/MarkdownWrapper.vue'

interface args {
  content: string
}

export default {
  title: 'Markdown/Links',
  argTypes: {
    content: {
      control: 'text',
    },
  },
  render(args) {
    return {
      components: { MarkdownWrapper },
      computed: {
        template() {
          return args.content
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

export const Default: StoryObj<args> = {
  args: {
    content: `[Link text](/)`,
  },
}

export const WithStyles: StoryObj<args> = {
  args: {
    content: `[Link **bold** _italic_ and \`code\`](/)`,
  },
}
