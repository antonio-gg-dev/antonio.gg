import RandomHint from './RandomHint.vue'
import { type Meta, type StoryObj } from '@storybook/vue3-vite'

export default {
  component: RandomHint,
} satisfies Meta<typeof RandomHint>

export const Default: StoryObj<typeof RandomHint> = {
  render() {
    return {
      components: { RandomHint },

      template: `
        <RandomHint>
          Este es el hint por defecto.
        </RandomHint>
      `,
    }
  },
}

export const RandomVariant: StoryObj<typeof RandomHint> = {
  render() {
    return {
      components: { RandomHint },

      template: `
        <RandomHint :hints="{ secret: 100 }">
          Este es el hint por defecto.
          <template #secret>
            Este hint contiene el comando <code>secret --option</code>.
          </template>
        </RandomHint>
      `,
    }
  },
}

export const WithoutSelectedContent: StoryObj<typeof RandomHint> = {}
