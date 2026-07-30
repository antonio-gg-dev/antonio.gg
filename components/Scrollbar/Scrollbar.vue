<template>
  <div
    ref="track"
    :class="{
      scrollbar__scrollbar: true,
      'scrollbar__scrollbar--scrollable': scrollable,
    }"
    :role="interactive ? 'scrollbar' : undefined"
    :tabindex="interactive && scrollable ? 0 : -1"
    :aria-controls="interactive ? targetId : undefined"
    :aria-disabled="interactive ? !scrollable : undefined"
    :aria-hidden="interactive ? undefined : true"
    :aria-label="interactive ? 'Page scroll' : undefined"
    :aria-orientation="interactive ? 'vertical' : undefined"
    :aria-valuemin="interactive ? 0 : undefined"
    :aria-valuemax="interactive ? maximumScrollTop : undefined"
    :aria-valuenow="interactive ? currentScrollTop : undefined"
    @keydown="handleKeydown"
    @lostpointercapture="finishDragging"
    @pointercancel="finishDragging"
    @pointerdown="handleTrackPointerDown"
    @pointermove="handlePointerMove"
    @pointerup="finishDragging"
  >
    <div
      ref="thumb"
      :class="{
        scrollbar__thumb: true,
        'scrollbar__thumb--dragging': dragging,
        'scrollbar__thumb--scrollable': scrollable,
      }"
      :style="thumbStyle"
      @pointerdown.stop="startDragging"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type CSSProperties, type PropType } from 'vue'

export default defineComponent({
  name: 'CustomScrollbar',

  props: {
    targetId: {
      required: true,
      type: String as PropType<string>,
    },
  },

  data() {
    return {
      currentScrollTop: 0,
      dragging: false,
      dragStartScrollTop: 0,
      dragStartY: 0,
      interactive: true,
      maximumScrollTop: 0,
      mediaQueryListener: null as ((event: MediaQueryListEvent) => void) | null,
      minimumThumbHeight: null as number | null,
      pointerId: null as number | null,
      pointerMediaQuery: null as MediaQueryList | null,
      resizeObserver: null as ResizeObserver | null,
      scrollListener: null as (() => void) | null,
      scrollable: false,
      target: null as HTMLElement | null,
      thumbHeight: 0,
      thumbOffset: 0,
      trackHeight: 0,
    }
  },

  computed: {
    thumbStyle(): CSSProperties {
      return {
        height: `${this.thumbHeight}px`,
        ...(this.minimumThumbHeight === null
          ? {}
          : {
              minHeight: `${Math.min(this.minimumThumbHeight, this.trackHeight)}px`,
            }),
        transform: `translateY(${this.thumbOffset}px)`,
      }
    },
  },

  mounted() {
    this.target = document.getElementById(this.targetId)

    if (this.target === null) {
      return
    }

    this.scrollListener = () => {
      this.updateScrollbar()
    }
    this.target.addEventListener('scroll', this.scrollListener, { passive: true })

    this.resizeObserver = new ResizeObserver(() => {
      this.updateScrollbar()
    })
    this.resizeObserver.observe(this.target)

    const content = this.target.firstElementChild

    if (content instanceof HTMLElement) {
      this.resizeObserver.observe(content)
    }

    this.pointerMediaQuery = window.matchMedia('(pointer: coarse)')
    this.interactive = !this.pointerMediaQuery.matches
    this.mediaQueryListener = (event: MediaQueryListEvent) => {
      this.interactive = !event.matches
      this.finishDragging()
    }
    this.pointerMediaQuery.addEventListener('change', this.mediaQueryListener)

    void this.$nextTick(() => {
      const thumb = this.$refs.thumb

      if (thumb instanceof HTMLElement) {
        const minimumThumbHeight = Number.parseFloat(window.getComputedStyle(thumb).minHeight)
        this.minimumThumbHeight = Number.isFinite(minimumThumbHeight) ? minimumThumbHeight : 0
      }

      this.updateScrollbar()
    })
  },

  beforeUnmount() {
    if (this.target !== null && this.scrollListener !== null) {
      this.target.removeEventListener('scroll', this.scrollListener)
    }

    this.resizeObserver?.disconnect()

    if (this.pointerMediaQuery !== null && this.mediaQueryListener !== null) {
      this.pointerMediaQuery.removeEventListener('change', this.mediaQueryListener)
    }
  },

  methods: {
    finishDragging(event?: PointerEvent): void {
      if (event !== undefined && this.pointerId !== event.pointerId) {
        return
      }

      this.dragging = false
      this.pointerId = null
    },

    focusTrack(): void {
      const track = this.$refs.track

      if (track instanceof HTMLElement) {
        track.focus({ preventScroll: true })
      }
    },

    handleKeydown(event: KeyboardEvent): void {
      if (!this.interactive || !this.scrollable || this.target === null) {
        return
      }

      const lineDistance = 40
      let nextScrollTop: number

      switch (event.key) {
        case 'ArrowUp':
          nextScrollTop = this.target.scrollTop - lineDistance
          break
        case 'ArrowDown':
          nextScrollTop = this.target.scrollTop + lineDistance
          break
        case 'PageUp':
          nextScrollTop = this.target.scrollTop - this.target.clientHeight
          break
        case 'PageDown':
          nextScrollTop = this.target.scrollTop + this.target.clientHeight
          break
        case 'Home':
          nextScrollTop = 0
          break
        case 'End':
          nextScrollTop = this.maximumScrollTop
          break
        default:
          return
      }

      event.preventDefault()
      this.target.scrollTop = nextScrollTop
    },

    handlePointerMove(event: PointerEvent): void {
      if (!this.dragging || this.pointerId !== event.pointerId || this.target === null || this.maximumScrollTop === 0) {
        return
      }

      const availableTrack = this.trackHeight - this.thumbHeight

      if (availableTrack === 0) {
        return
      }

      const pointerDistance = event.clientY - this.dragStartY
      this.target.scrollTop = this.dragStartScrollTop + (pointerDistance / availableTrack) * this.maximumScrollTop
    },

    handleTrackPointerDown(event: PointerEvent): void {
      if (!this.interactive || !this.scrollable || event.button !== 0 || this.target === null) {
        return
      }

      const track = this.$refs.track

      if (!(track instanceof HTMLElement)) {
        return
      }

      event.preventDefault()
      this.focusTrack()

      const desiredThumbOffset = event.clientY - track.getBoundingClientRect().top - this.thumbHeight / 2
      const availableTrack = this.trackHeight - this.thumbHeight

      if (availableTrack === 0) {
        return
      }

      const thumbOffset = Math.min(Math.max(desiredThumbOffset, 0), availableTrack)

      this.target.scrollTop = (thumbOffset / availableTrack) * this.maximumScrollTop
      this.startDragging(event)
    },

    startDragging(event: PointerEvent): void {
      if (!this.interactive || !this.scrollable || event.button !== 0 || this.target === null) {
        return
      }

      event.preventDefault()
      this.focusTrack()
      this.dragging = true
      this.dragStartScrollTop = this.target.scrollTop
      this.dragStartY = event.clientY
      this.pointerId = event.pointerId

      const track = this.$refs.track

      if (track instanceof HTMLElement) {
        track.setPointerCapture(event.pointerId)
      }
    },

    updateScrollbar(): void {
      if (this.target === null) {
        return
      }

      const track = this.$refs.track

      if (!(track instanceof HTMLElement)) {
        return
      }

      this.trackHeight = track.clientHeight
      this.maximumScrollTop = Math.max(this.target.scrollHeight - this.target.clientHeight, 0)
      this.currentScrollTop = Math.round(Math.min(Math.max(this.target.scrollTop, 0), this.maximumScrollTop))
      this.scrollable = this.maximumScrollTop > 0 && this.trackHeight > 0

      if (!this.scrollable) {
        this.thumbHeight = this.trackHeight
        this.thumbOffset = 0

        return
      }

      const proportionalHeight = (this.target.clientHeight / this.target.scrollHeight) * this.trackHeight
      this.thumbHeight = Math.min(this.trackHeight, Math.max(this.minimumThumbHeight ?? 0, proportionalHeight))

      const availableTrack = this.trackHeight - this.thumbHeight
      this.thumbOffset = (this.currentScrollTop / this.maximumScrollTop) * availableTrack
    },
  },
})
</script>

<style lang="scss">
@use '@/styles/mixins/crt';

.scrollbar {
  $p: &;

  &__scrollbar {
    @apply invisible absolute inset-y-2 right-0 z-scrollbar w-2 touch-none bg-transparent;

    @screen md {
      @apply inset-y-4 w-4;
    }

    @screen xl {
      @apply inset-y-8 w-8;
    }

    &::before {
      @apply absolute inset-0 bg-neutral content-[''];
      @include crt.shadow(theme('colors.neutral.DEFAULT'));

      @screen md {
        @apply border-0.5 border-neutral bg-transparent;
      }

      @screen xl {
        @apply inset-x-2;
      }
    }

    &--scrollable {
      @apply visible;

      &:hover::before {
        @apply bg-neutral-emphasis;
        @include crt.shadow(theme('colors.neutral.emphasis'));

        @screen md {
          @apply border-neutral-emphasis bg-transparent;
        }
      }

      &:focus-visible {
        @apply outline-none;

        &::before {
          @apply bg-neutral-emphasis;
          @include crt.shadow(theme('colors.neutral.emphasis'));

          @screen md {
            @apply border-neutral-emphasis bg-transparent;
          }
        }
      }
    }

    @media (pointer: coarse) {
      @apply pointer-events-none;
    }

    @media print {
      @apply hidden;
    }
  }

  &__thumb {
    @apply absolute inset-x-0 top-0 min-h-8 will-change-transform;

    &::before {
      @apply absolute inset-0 bg-neutral-emphasis content-[''];
      @include crt.shadow(theme('colors.neutral.emphasis'));

      @screen md {
        @apply inset-1;
      }

      @screen xl {
        @apply inset-x-3;
      }
    }

    &--scrollable {
      #{$p}__scrollbar:hover &::before {
        @apply bg-primary-emphasis;
        @include crt.shadow(theme('colors.primary.emphasis'));

        @screen md {
          @apply bg-neutral-emphasis;
          @include crt.shadow(theme('colors.neutral.emphasis'));
        }
      }

      &:hover::before,
      #{$p}__scrollbar:hover &:hover::before {
        @apply bg-primary-emphasis;
        @include crt.shadow(theme('colors.primary.emphasis'));
      }

      #{$p}__scrollbar:focus-visible &::before {
        @apply bg-primary-emphasis;
        @include crt.shadow(theme('colors.primary.emphasis'));
      }
    }

    &--dragging::before,
    #{$p}__scrollbar:hover &--dragging::before {
      @apply bg-primary-emphasis;
      @include crt.shadow(theme('colors.primary.emphasis'));
    }
  }
}
</style>
