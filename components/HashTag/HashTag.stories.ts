import { type Meta, type StoryObj } from '@storybook/vue3'
import HashTag from './HashTag.vue'

const meta = {
  component: HashTag,
} satisfies Meta<typeof HashTag>

export default meta

type Story = StoryObj<typeof HashTag>

export const Default: Story = {
  args: {
    tag: 'software',
  },
}

export const AllColors: Story = {
  args: {
    tag: 'software',
  },
  render() {
    return {
      components: {
        HashTag,
      },

      data() {
        return {
          tags: [
            'tag-6',
            'tag-5',
            'tag-71',
            'tag-10',
            'tag-15',
            'tag-16',
            'tag-8',
            'tag-21',
            'tag-2',
            'tag-1',
            'tag-4',
            'tag-69',
            'tag-11',
            'tag-12',
            'tag-17',
            'tag-18',
            'tag-20',
            'tag-23',
            'tag-0',
            'tag-7',
            'tag-68',
            'tag-70',
            'tag-13',
            'tag-14',
            'tag-19',
            'tag-9',
            'tag-22',
            'tag-3',
          ],
        }
      },

      template: `
        <div class="flex flex-wrap gap-2">
          <HashTag
            v-for="(tag, index) of tags"
            :key="index"
            :tag="tag"
          />
        </div>
      `,
    }
  },
}
