<template>
  <button
    v-if="visible"
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

  data() {
    return {
      resizeObserver: null as ResizeObserver | null,
      scrollListener: null as (() => void) | null,
      target: null as HTMLElement | null,
      visible: false,
    }
  },

  mounted() {
    this.target = document.getElementById(this.targetId)

    if (this.target === null) {
      return
    }

    this.scrollListener = () => {
      this.updateVisibility()
    }
    this.target.addEventListener('scroll', this.scrollListener, { passive: true })

    this.resizeObserver = new ResizeObserver(() => {
      this.updateVisibility()
    })

    this.resizeObserver.observe(this.target)

    const content = this.target.firstElementChild

    if (content instanceof HTMLElement) {
      this.resizeObserver.observe(content)
    }

    this.updateVisibility()
  },

  beforeUnmount() {
    if (this.target !== null && this.scrollListener !== null) {
      this.target.removeEventListener('scroll', this.scrollListener)
    }

    this.resizeObserver?.disconnect()
  },

  methods: {
    scrollToBottom(): void {
      if (this.target === null) {
        return
      }

      this.target.scrollTop = this.target.scrollHeight
      this.updateVisibility()
    },

    updateVisibility(): void {
      if (this.target === null) {
        this.visible = false

        return
      }

      const maximumScrollTop = Math.max(this.target.scrollHeight - this.target.clientHeight, 0)
      this.visible = maximumScrollTop > 0 && this.target.scrollTop < maximumScrollTop - 1
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
