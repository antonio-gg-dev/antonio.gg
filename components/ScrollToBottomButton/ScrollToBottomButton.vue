<template>
  <button
    class="scroll-to-bottom-button"
    type="button"
    aria-label="Scroll to bottom"
    @click="scrollToBottom"
  >
    <ArrowDownIcon class="scroll-to-bottom-button__icon" />
  </button>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import ArrowDownIcon from '@/components/Icons/ArrowDownIcon.vue'

export default defineComponent({
  components: {
    ArrowDownIcon,
  },

  props: {
    targetId: {
      required: true,
      type: String as PropType<string>,
    },
  },

  methods: {
    scrollToBottom(): void {
      const target = document.getElementById(this.targetId)

      if (target === null) {
        return
      }

      target.scrollTop = target.scrollHeight
    },
  },
})
</script>

<style lang="scss">
@use '@/styles/mixins/crt';

.scroll-to-bottom-button {
  @include crt.shadow(theme('colors.primary.DEFAULT'));
  @apply absolute bottom-2 right-2 z-scroll-to-bottom hidden h-8 w-8 items-center justify-center bg-primary;

  @screen md {
    @apply bottom-4 right-4;
  }

  @screen xl {
    @apply bottom-8 right-8;
  }

  @media (pointer: coarse) {
    @apply flex;
  }

  @media print {
    @apply hidden;
  }

  &:hover,
  &:focus {
    @include crt.shadow(theme('colors.primary.emphasis'));
    @apply bg-primary-emphasis;
  }

  &__icon {
    @apply pointer-events-none h-4 w-4 text-foreground;
  }
}
</style>
