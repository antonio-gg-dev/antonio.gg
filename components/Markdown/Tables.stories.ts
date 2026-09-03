import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MarkdownWrapper from '@/components/Markdown/MarkdownWrapper.vue'

interface args {
  content: string
}

export default {
  title: 'Markdown/Tables',
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
    content: `\
| size | price | qty |
| ---- | ----- | --- |
| 9    | 13    | 100 |
| 10   | 21    | 200 |
| 11   | 3     | 390 |`,
  },
}

export const AlignCenter: StoryObj<args> = {
  args: {
    content: `\
| size | price | qty |
| :--: | :---: | :-: |
| 9    | 13    | 100 |
| 10   | 21    | 200 |
| 11   | 3     | 390 |`,
  },
}

export const AlignRight: StoryObj<args> = {
  args: {
    content: `\
| size | price | qty |
| ---: | ----: | --: |
| 9    | 13    | 100 |
| 10   | 21    | 200 |
| 11   | 3     | 390 |`,
  },
}

export const AlignMixed: StoryObj<args> = {
  args: {
    content: `\
| size | price | qty |
| ---- | :---: | --: |
| 9    | 13    | 100 |
| 10   | 21    | 200 |
| 11   | 3     | 390 |`,
  },
}

export const WithStyles: StoryObj<args> = {
  args: {
    content: `\
| _size_ | **price** | \`qty\` |
| ------ | --------  | ----- |
| _9_    | **13**    | \`100\` |
| _10_   | **21**    | \`200\` |
| _11_   | **3**     | \`390\` |`,
  },
}
