<template>
  <span
    :class="{
      'hash-tag__label': true,
      [variantClass]: true,
    }"
  >
    {{ tag }}
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    tag: {
      required: true,
      type: String,
    },
  },

  computed: {
    variantClass(): string {
      return `hash-tag__label--${this.hash(this.tag) % 28}`
    },
  },

  methods: {
    /**
     * @see https://www.rfc-editor.org/rfc/rfc9923.html#section-5
     */
    hash(value: string): number {
      const FNV_OFFSET_BASIS = 2166136261
      const FNV_PRIME = 16777619
      let result = FNV_OFFSET_BASIS

      for (const character of value) {
        result ^= character.codePointAt(0) ?? 0
        result = Math.imul(result, FNV_PRIME)
      }

      return result >>> 0
    },
  },
})
</script>

<style lang="scss">
@use '@/styles/mixins/crt';

.hash-tag {
  &__label {
    @apply inline-block whitespace-nowrap px-1;

    &--0 {
      @apply bg-neutral text-foreground;
      @include crt.shadow(theme('colors.neutral.DEFAULT'));
    }

    &--1 {
      @apply bg-danger text-foreground;
      @include crt.shadow(theme('colors.danger.DEFAULT'));
    }

    &--2 {
      @apply bg-success text-foreground;
      @include crt.shadow(theme('colors.success.DEFAULT'));
    }

    &--3 {
      @apply bg-warning text-foreground;
      @include crt.shadow(theme('colors.warning.DEFAULT'));
    }

    &--4 {
      @apply bg-primary text-foreground;
      @include crt.shadow(theme('colors.primary.DEFAULT'));
    }

    &--5 {
      @apply bg-accent text-foreground;
      @include crt.shadow(theme('colors.accent.DEFAULT'));
    }

    &--6 {
      @apply bg-info text-foreground;
      @include crt.shadow(theme('colors.info.DEFAULT'));
    }

    &--7 {
      @apply bg-neutral-emphasis text-background;
      @include crt.shadow(theme('colors.neutral.emphasis'));
    }

    &--8 {
      @apply bg-danger-emphasis text-background;
      @include crt.shadow(theme('colors.danger.emphasis'));
    }

    &--9 {
      @apply bg-success-emphasis text-background;
      @include crt.shadow(theme('colors.success.emphasis'));
    }

    &--10 {
      @apply bg-warning-emphasis text-background;
      @include crt.shadow(theme('colors.warning.emphasis'));
    }

    &--11 {
      @apply bg-primary-emphasis text-background;
      @include crt.shadow(theme('colors.primary.emphasis'));
    }

    &--12 {
      @apply bg-accent-emphasis text-background;
      @include crt.shadow(theme('colors.accent.emphasis'));
    }

    &--13 {
      @apply bg-info-emphasis text-background;
      @include crt.shadow(theme('colors.info.emphasis'));
    }

    &--14 {
      @apply bg-foreground text-neutral;
      @include crt.shadow(theme('colors.foreground'));
    }

    &--15 {
      @apply bg-foreground text-danger;
      @include crt.shadow(theme('colors.foreground'));
    }

    &--16 {
      @apply bg-foreground text-success;
      @include crt.shadow(theme('colors.foreground'));
    }

    &--17 {
      @apply bg-foreground text-warning;
      @include crt.shadow(theme('colors.foreground'));
    }

    &--18 {
      @apply bg-foreground text-primary;
      @include crt.shadow(theme('colors.foreground'));
    }

    &--19 {
      @apply bg-foreground text-accent;
      @include crt.shadow(theme('colors.foreground'));
    }

    &--20 {
      @apply bg-foreground text-info;
      @include crt.shadow(theme('colors.foreground'));
    }

    &--21 {
      @apply bg-background text-neutral-emphasis;
      @include crt.shadow(theme('colors.background'));
    }

    &--22 {
      @apply bg-background text-danger-emphasis;
      @include crt.shadow(theme('colors.background'));
    }

    &--23 {
      @apply bg-background text-success-emphasis;
      @include crt.shadow(theme('colors.background'));
    }

    &--24 {
      @apply bg-background text-warning-emphasis;
      @include crt.shadow(theme('colors.background'));
    }

    &--25 {
      @apply bg-background text-primary-emphasis;
      @include crt.shadow(theme('colors.background'));
    }

    &--26 {
      @apply bg-background text-accent-emphasis;
      @include crt.shadow(theme('colors.background'));
    }

    &--27 {
      @apply bg-background text-info-emphasis;
      @include crt.shadow(theme('colors.background'));
    }
  }
}
</style>
