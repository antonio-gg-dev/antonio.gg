import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MarkdownWrapper from '@/components/Markdown/MarkdownWrapper.vue'

interface args {
  content: string
}

export default {
  title: 'Markdown/Ordered Lists',
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

export const OneItem: StoryObj<args> = {
  args: {
    content: `1. One item`,
  },
}

export const ManyItems: StoryObj<args> = {
  args: {
    content: `\
1. First item
2. Second item
3. Third item
4. Fourth item`,
  },
}

export const WithParagraphs: StoryObj<args> = {
  args: {
    content: `\
1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus risus id velit lacinia tempus.
   Mauris in nisi ligula. Ut pulvinar diam purus. Nulla dignissim ante non rutrum cursus.

   Morbi id nisi sed elit accumsan auctor. Integer egestas velit non lectus lobortis, quis aliquet arcu elementum.
   Donec convallis lacus ut leo vehicula, in vulputate tortor consectetur.`,
  },
}

export const WithStyles: StoryObj<args> = {
  args: {
    content: `\
1. Bold **item**
2. Italic _item_
3. Code \`item\``,
  },
}

export const Nested: StoryObj<args> = {
  args: {
    content: `\
1. First item
   1. First child
   2. Second child
2. Second item
   1. Other child`,
  },
}
