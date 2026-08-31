<template>
  <div
    ref="track"
    :class="{
      scrollbar__scrollbar: true,
      [`scrollbar__scrollbar--${variant}`]: true,
      [`scrollbar__scrollbar--${orientation}`]: true,
      'scrollbar__scrollbar--scrollable': scrollable,
    }"
    :role="interactive ? 'scrollbar' : undefined"
    :tabindex="interactive && scrollable ? 0 : -1"
    :aria-controls="interactive && targetId !== '' ? targetId : undefined"
    :aria-disabled="interactive ? !scrollable : undefined"
    :aria-hidden="interactive ? undefined : true"
    :aria-label="interactive ? (isPageVariant ? 'Page scroll' : 'Horizontal content scroll') : undefined"
    :aria-orientation="interactive ? (isVerticalOrientation ? 'vertical' : 'horizontal') : undefined"
    :aria-valuemin="interactive ? 0 : undefined"
    :aria-valuemax="interactive ? ariaValueMax : undefined"
    :aria-valuenow="interactive ? ariaValueNow : undefined"
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
        [`scrollbar__thumb--${orientation}`]: true,
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

export enum CustomScrollbarVariant {
  Content = 'content',
  Page = 'page',
}

export enum CustomScrollbarOrientation {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
}

export default defineComponent({
  props: {
    variant: {
      required: true,
      type: String as PropType<CustomScrollbarVariant>,
    },
    orientation: {
      required: true,
      type: String as PropType<CustomScrollbarOrientation>,
    },
    targetId: {
      default: '',
      type: String as PropType<string>,
    },
    targetElement: {
      default: null,
      type: Object as PropType<HTMLElement | null>,
    },
  },

  data() {
    return {
      currentScrollTop: 0,
      currentScroll: 0,
      dragging: false,
      dragStartScrollTop: 0,
      dragStartY: 0,
      interactive: true,
      maximumScrollTop: 0,
      maximumScroll: 0,
      mediaQueryListener: null as ((event: MediaQueryListEvent) => void) | null,
      minimumThumbHeight: null as number | null,
      minimumThumbWidth: null as number | null,
      pointerId: null as number | null,
      pointerMediaQuery: null as MediaQueryList | null,
      resizeObserver: null as ResizeObserver | null,
      scrollListener: null as (() => void) | null,
      scrollable: false,
      target: null as HTMLElement | null,
      thumbHeight: 0,
      thumbOffset: 0,
      trackHeight: 0,
      trackWidth: 0,
      thumbWidth: 0,
    }
  },

  computed: {
    isPageVariant(): boolean {
      return this.variant === CustomScrollbarVariant.Page
    },

    isVerticalOrientation(): boolean {
      return this.orientation === CustomScrollbarOrientation.Vertical
    },

    ariaValueMax(): number {
      return this.orientation === CustomScrollbarOrientation.Horizontal ? this.maximumScroll : this.maximumScrollTop
    },

    ariaValueNow(): number {
      return this.orientation === CustomScrollbarOrientation.Horizontal ? this.currentScroll : this.currentScrollTop
    },

    thumbStyle(): CSSProperties {
      if (this.orientation === CustomScrollbarOrientation.Horizontal) {
        return {
          minWidth:
            this.minimumThumbWidth === null ? undefined : `${Math.min(this.minimumThumbWidth, this.trackWidth)}px`,
          transform: `translateX(${this.thumbOffset}px)`,
          width: `${this.thumbWidth}px`,
        }
      }

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
    this.target = this.targetElement ?? document.getElementById(this.targetId)

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
        const minimumThumbSize = Number.parseFloat(
          window.getComputedStyle(thumb)[
            this.orientation === CustomScrollbarOrientation.Horizontal ? 'minWidth' : 'minHeight'
          ],
        )

        if (this.orientation === CustomScrollbarOrientation.Horizontal) {
          this.minimumThumbWidth = Number.isFinite(minimumThumbSize) ? minimumThumbSize : 0
        } else {
          this.minimumThumbHeight = Number.isFinite(minimumThumbSize) ? minimumThumbSize : 0
        }
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

      if (this.orientation === CustomScrollbarOrientation.Horizontal) {
        const distance = 40
        let nextScrollLeft: number

        switch (event.key) {
          case 'ArrowLeft':
            nextScrollLeft = this.target.scrollLeft - distance
            break
          case 'ArrowRight':
            nextScrollLeft = this.target.scrollLeft + distance
            break
          case 'PageUp':
            nextScrollLeft = this.target.scrollLeft - this.target.clientWidth
            break
          case 'PageDown':
            nextScrollLeft = this.target.scrollLeft + this.target.clientWidth
            break
          case 'Home':
            nextScrollLeft = 0
            break
          case 'End':
            nextScrollLeft = this.maximumScroll
            break
          default:
            return
        }

        event.preventDefault()
        this.target.scrollLeft = nextScrollLeft
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
      if (
        !this.dragging ||
        this.pointerId !== event.pointerId ||
        this.target === null ||
        (this.orientation === CustomScrollbarOrientation.Horizontal ? this.maximumScroll : this.maximumScrollTop) === 0
      ) {
        return
      }

      if (this.orientation === CustomScrollbarOrientation.Horizontal) {
        const availableTrack = this.trackWidth - this.thumbWidth

        if (availableTrack === 0) {
          return
        }

        const pointerDistance = event.clientX - this.dragStartY
        this.target.scrollLeft = this.dragStartScrollTop + (pointerDistance / availableTrack) * this.maximumScroll
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

      if (this.orientation === CustomScrollbarOrientation.Horizontal) {
        const pointerPosition = event.clientX - track.getBoundingClientRect().left
        const availableTrack = this.trackWidth - this.thumbWidth

        if (availableTrack === 0) {
          return
        }

        const thumbOffset = Math.min(Math.max(pointerPosition - this.thumbWidth / 2, 0), availableTrack)
        this.target.scrollLeft = (thumbOffset / availableTrack) * this.maximumScroll
        this.startDragging(event)
        return
      }

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

      if (this.orientation === CustomScrollbarOrientation.Horizontal) {
        this.dragStartScrollTop = this.target.scrollLeft
        this.dragStartY = event.clientX
      }

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

      if (this.orientation === CustomScrollbarOrientation.Horizontal) {
        this.trackWidth = this.target.clientWidth
        this.maximumScroll = Math.max(this.target.scrollWidth - this.target.clientWidth, 0)
        this.currentScroll = Math.round(Math.min(Math.max(this.target.scrollLeft, 0), this.maximumScroll))
        this.scrollable = this.maximumScroll > 0 && this.trackWidth > 0

        if (!this.scrollable) {
          this.thumbWidth = this.trackWidth
          this.thumbOffset = 0
          return
        }

        this.thumbWidth = Math.min(
          this.trackWidth,
          Math.max(this.minimumThumbWidth ?? 0, (this.target.clientWidth / this.target.scrollWidth) * this.trackWidth),
        )
        this.thumbOffset = (this.currentScroll / this.maximumScroll) * (this.trackWidth - this.thumbWidth)
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
    @apply invisible z-scrollbar touch-none bg-background;

    &--horizontal {
      @apply relative hidden h-2 w-full overflow-hidden;

      @screen md {
        @apply h-4;
      }

      &#{$p}__scrollbar--scrollable {
        @apply block;
      }
    }

    &--vertical {
      @apply absolute right-0 w-2;

      @screen md {
        @apply w-4;
      }
    }

    &--page {
      @apply absolute right-0;

      &#{$p}__scrollbar--horizontal {
        @apply bottom-0 left-0 right-0;

        @screen xl {
          @apply h-8;
        }
      }

      &#{$p}__scrollbar--vertical {
        @apply inset-y-2;

        @screen xl {
          @apply w-8;
        }
      }

      &#{$p}__scrollbar--vertical::before {
        @screen xl {
          @apply inset-x-2;
        }
      }

      &#{$p}__scrollbar--horizontal::before {
        @screen xl {
          @apply inset-y-2;
        }
      }
    }

    &::before {
      @apply absolute inset-0 bg-neutral content-[''];
      @include crt.shadow(theme('colors.neutral.DEFAULT'));

      @screen md {
        @apply border-0.5 border-neutral bg-transparent;
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

    &--content {
      @apply relative inset-auto bottom-auto left-auto right-auto top-auto;

      &#{$p}__scrollbar--horizontal {
        @screen xl {
          @apply h-4;
        }
      }

      &#{$p}__scrollbar--vertical {
        @apply absolute inset-y-0 right-0 w-2;

        @screen xl {
          @apply w-4;
        }
      }

      @media (pointer: coarse) {
        @apply pointer-events-auto;
      }

      @media print {
        @apply hidden;
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
    @apply absolute will-change-transform;

    &--vertical {
      @apply inset-x-0 top-0 min-h-8;
    }

    &--horizontal {
      @apply bottom-0 left-0 right-auto top-0 h-full min-h-0 min-w-8 overflow-hidden;
    }

    &::before {
      @apply absolute inset-0 bg-neutral-emphasis content-[''];
      @include crt.shadow(theme('colors.neutral.emphasis'));

      @screen md {
        @apply inset-1;
      }
    }

    #{$p}__scrollbar--page#{$p}__scrollbar--vertical &::before {
      @screen xl {
        @apply inset-x-3;
      }
    }

    #{$p}__scrollbar--page#{$p}__scrollbar--horizontal &::before {
      @screen xl {
        @apply inset-y-3;
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
