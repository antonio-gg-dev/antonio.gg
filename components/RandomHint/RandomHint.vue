<template>
  <p
    v-if="$slots[selectedHintName]"
    class="random-hint"
    role="note"
  >
    <slot :name="selectedHintName" />
  </p>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

type HintFrequencies = Record<string, number>

export default defineComponent({
  props: {
    hints: {
      type: Object as PropType<HintFrequencies>,
      default: () => ({}),
      validator(hints: HintFrequencies): boolean {
        let totalFrequency = 0

        for (const name of Object.keys(hints)) {
          const frequency = hints[name]

          if (
            name.trim() === '' ||
            name === 'default' ||
            !Number.isFinite(frequency) ||
            frequency <= 0 ||
            frequency > 100
          ) {
            return false
          }

          totalFrequency += frequency
        }

        return totalFrequency <= 100
      },
    },
  },

  data() {
    return {
      selectedHintName: 'default',
    }
  },

  mounted() {
    let randomValue = Math.random()

    for (const name of Object.keys(this.hints)) {
      const frequency = this.hints[name]
      randomValue -= frequency / 100

      if (randomValue < 0) {
        this.selectedHintName = name

        return
      }
    }
  },
})
</script>

<style lang="scss">
.random-hint {
  @apply text-info;

  code {
    @apply text-foreground;
  }
}
</style>
