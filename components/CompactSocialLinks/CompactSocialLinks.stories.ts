import CompactSocialLinks from '@/components/CompactSocialLinks/CompactSocialLinks.vue'
import { type Meta, type StoryObj } from '@storybook/vue3-vite'

export default {
  component: CompactSocialLinks,
} satisfies Meta<typeof CompactSocialLinks>

export const AllEnabled: StoryObj<typeof CompactSocialLinks> = {
  args: {
    linkedInHandle: 'agg-dev',
    xHandle: 'antonio_gg_dev',
    gitHubHandle: 'antonio-gg-dev',
    printablesHandle: 'Katarn',
  },
}

export const OnlyLinkedIn: StoryObj<typeof CompactSocialLinks> = {
  args: {
    linkedInHandle: 'agg-dev',
  },
}

export const OnlyX: StoryObj<typeof CompactSocialLinks> = {
  args: {
    xHandle: 'antonio_gg_dev',
  },
}

export const OnlyGitHub: StoryObj<typeof CompactSocialLinks> = {
  args: {
    gitHubHandle: 'antonio-gg-dev',
  },
}

export const OnlyPrintables: StoryObj<typeof CompactSocialLinks> = {
  args: {
    printablesHandle: 'Katarn',
  },
}
