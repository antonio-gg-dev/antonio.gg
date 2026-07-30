import { userEvent, within } from '@storybook/test'
import { type Meta, type StoryObj } from '@storybook/vue3'
import Scrollbar from './Scrollbar.vue'

interface ScrollbarStoryArgs {
  contentHeight: string
  initialScrollTop: number
  targetId: string
}

const meta = {
  title: 'Scrollbar',
  component: Scrollbar,
  parameters: {
    layout: 'fullscreen',
  },
  render(args) {
    return {
      components: {
        Scrollbar,
      },

      data() {
        return {
          contentHeight: args.contentHeight,
          targetId: args.targetId,
        }
      },

      mounted() {
        void this.$nextTick(() => {
          const surface = this.$refs.surface

          if (surface instanceof HTMLElement) {
            surface.scrollTop = args.initialScrollTop
          }
        })
      },

      template: `
        <div class="relative m-8 h-96 overflow-hidden bg-background">
          <div
            ref="surface"
            :id="targetId"
            class="h-full overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div
              class="relative p-8"
              :style="{ height: contentHeight }"
            >
              <span class="absolute left-8 top-8">Top</span>
              <span class="absolute left-8 top-1/2">Middle</span>
              <span class="absolute bottom-8 left-8">Bottom</span>
            </div>
          </div>

          <Scrollbar :target-id="targetId" />
        </div>
      `,
    }
  },
} satisfies Meta<ScrollbarStoryArgs>

export default meta

type Story = StoryObj<ScrollbarStoryArgs>

export const Scrollable: Story = {
  args: {
    contentHeight: '96rem',
    initialScrollTop: 0,
    targetId: 'scrollbar-story-scrollable',
  },
}

export const Scrolled: Story = {
  args: {
    contentHeight: '96rem',
    initialScrollTop: 640,
    targetId: 'scrollbar-story-scrolled',
  },
}

export const WithoutOverflow: Story = {
  args: {
    contentHeight: '100%',
    initialScrollTop: 0,
    targetId: 'scrollbar-story-without-overflow',
  },
}

export const Focused: Story = {
  args: {
    contentHeight: '96rem',
    initialScrollTop: 0,
    targetId: 'scrollbar-story-focused',
  },
  play: async () => {
    await userEvent.tab()
  },
}

export const KeyboardNavigation: Story = {
  args: {
    contentHeight: '96rem',
    initialScrollTop: 0,
    targetId: 'scrollbar-story-keyboard',
  },
  play: async ({ canvasElement }) => {
    const scrollbar = within(canvasElement).getByRole('scrollbar')

    scrollbar.focus()
    await userEvent.keyboard('{End}')
  },
}
