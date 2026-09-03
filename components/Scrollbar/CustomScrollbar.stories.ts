import { type Meta, type StoryObj } from '@storybook/vue3-vite'
import { defineComponent, nextTick } from 'vue'
import CustomScrollbar from './CustomScrollbar.vue'
import { CustomScrollbarOrientation, CustomScrollbarVariant } from './customScrollbar'

interface CustomScrollbarStoryArgs {
  contentHeight: string
  contentWidth: string
  initialScrollLeft: number
  initialScrollTop: number
  orientation: CustomScrollbarOrientation
  targetId: string
  variant: CustomScrollbarVariant
}

const meta = {
  title: 'CustomScrollbar',
  component: CustomScrollbar,
  parameters: {
    layout: 'fullscreen',
  },
  render(args) {
    return defineComponent({
      components: {
        CustomScrollbar,
      },

      data() {
        return {
          contentHeight: args.contentHeight,
          contentWidth: args.contentWidth,
          containerBackground: args.variant === CustomScrollbarVariant.Content ? 'bg-neutral' : 'bg-background',
          initialScrollLeft: args.initialScrollLeft,
          initialScrollTop: args.initialScrollTop,
          orientation: args.orientation,
          targetId: args.targetId,
          variant: args.variant,
        }
      },

      mounted() {
        void nextTick(() => {
          const surface = document.getElementById(args.targetId)

          if (surface !== null) {
            surface.scrollLeft = args.initialScrollLeft
            surface.scrollTop = args.initialScrollTop
          }
        })
      },

      template: `
        <div
          :class="{
            relative: true,
            'm-8': true,
            'overflow-hidden': true,
            [containerBackground]: true,
          }"
        >
          <div
            ref="surface"
            :id="targetId"
            class="h-96 w-full overflow-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div
              class="relative p-8"
              :style="{ height: contentHeight, width: contentWidth }"
            >
              <span class="absolute left-8 top-8">Top left</span>
              <span class="absolute right-8 top-8">Top right</span>
              <span class="absolute bottom-8 left-8">Bottom left</span>
              <span class="absolute bottom-8 right-8">Bottom right</span>
            </div>
          </div>

          <CustomScrollbar
            :orientation="orientation"
            :target-id="targetId"
            :variant="variant"
          />
        </div>
      `,
    })
  },
} satisfies Meta<CustomScrollbarStoryArgs>

export default meta

type Story = StoryObj<CustomScrollbarStoryArgs>

export const PageVertical: Story = {
  args: {
    contentHeight: '96rem',
    contentWidth: '100%',
    initialScrollLeft: 0,
    initialScrollTop: 0,
    orientation: CustomScrollbarOrientation.Vertical,
    targetId: 'scrollbar-story-page-vertical',
    variant: CustomScrollbarVariant.Page,
  },
}

export const PageHorizontal: Story = {
  args: {
    contentHeight: '100%',
    contentWidth: '200%',
    initialScrollLeft: 0,
    initialScrollTop: 0,
    orientation: CustomScrollbarOrientation.Horizontal,
    targetId: 'scrollbar-story-page-horizontal',
    variant: CustomScrollbarVariant.Page,
  },
}

export const ContentHorizontal: Story = {
  args: {
    contentHeight: '100%',
    contentWidth: '200%',
    initialScrollLeft: 0,
    initialScrollTop: 0,
    orientation: CustomScrollbarOrientation.Horizontal,
    targetId: 'scrollbar-story-content-horizontal',
    variant: CustomScrollbarVariant.Content,
  },
}

export const ContentVertical: Story = {
  args: {
    contentHeight: '96rem',
    contentWidth: '100%',
    initialScrollLeft: 0,
    initialScrollTop: 0,
    orientation: CustomScrollbarOrientation.Vertical,
    targetId: 'scrollbar-story-content-vertical',
    variant: CustomScrollbarVariant.Content,
  },
}
