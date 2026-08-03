<template>
  <fieldset class="appearance-effects">
    <legend class="appearance-effects__legend">Efectos</legend>

    <label class="appearance-effects__field">
      <input
        v-model="curvature"
        class="appearance-effects__checkbox"
        type="checkbox"
      />
      <CheckBoxIcon
        :active="curvature"
        aria-hidden="true"
        class="appearance-effects__icon"
      />
      <span>Distorsión de barril</span>
    </label>

    <label class="appearance-effects__field">
      <input
        v-model="scanlines"
        class="appearance-effects__checkbox"
        type="checkbox"
      />
      <CheckBoxIcon
        :active="scanlines"
        aria-hidden="true"
        class="appearance-effects__icon"
      />
      <span>Líneas de exploración</span>
    </label>

    <label class="appearance-effects__field">
      <input
        v-model="sweep"
        class="appearance-effects__checkbox"
        type="checkbox"
        :disabled="!appearance.scanlines"
      />
      <CheckBoxIcon
        :active="sweep"
        aria-hidden="true"
        class="appearance-effects__icon"
      />
      <span>Barrido luminoso</span>
    </label>

    <label class="appearance-effects__field">
      <input
        v-model="aberration"
        class="appearance-effects__checkbox"
        type="checkbox"
      />
      <CheckBoxIcon
        :active="aberration"
        aria-hidden="true"
        class="appearance-effects__icon"
      />
      <span>Aberración cromática</span>
    </label>

    <label class="appearance-effects__field">
      <input
        v-model="flicker"
        class="appearance-effects__checkbox"
        type="checkbox"
        :disabled="!appearance.aberration"
      />
      <CheckBoxIcon
        :active="flicker"
        aria-hidden="true"
        class="appearance-effects__icon"
      />
      <span>Parpadeo de la aberración</span>
    </label>
  </fieldset>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CheckBoxIcon from '@/components/Icons/CheckBoxIcon.vue'
import { type Appearance, AppearanceEffect } from '@/config/Appearance'
import { appearanceService } from '@/config/AppearanceService'

export default defineComponent({
  components: {
    CheckBoxIcon,
  },

  computed: {
    appearance(): Appearance {
      return appearanceService.appearance
    },

    aberration: {
      get(): boolean {
        return this.appearance.aberration
      },

      set(active: boolean): void {
        appearanceService.activateEffect(AppearanceEffect.Aberration, active)
      },
    },

    flicker: {
      get(): boolean {
        return this.appearance.flicker
      },

      set(active: boolean): void {
        appearanceService.activateEffect(AppearanceEffect.Flicker, active)
      },
    },

    curvature: {
      get(): boolean {
        return this.appearance.curvature
      },

      set(active: boolean): void {
        appearanceService.activateEffect(AppearanceEffect.Curvature, active)
      },
    },

    scanlines: {
      get(): boolean {
        return this.appearance.scanlines
      },

      set(active: boolean): void {
        appearanceService.activateEffect(AppearanceEffect.Scanlines, active)
      },
    },

    sweep: {
      get(): boolean {
        return this.appearance.sweep
      },

      set(active: boolean): void {
        appearanceService.activateEffect(AppearanceEffect.Sweep, active)
      },
    },
  },
})
</script>

<style lang="scss">
.appearance-effects {
  $p: &;

  @apply my-8 flex max-w-md flex-col gap-2;

  &__legend {
    @apply mb-2;
  }

  &__field {
    @apply relative flex cursor-pointer items-center gap-4;

    &:has(input:disabled) {
      @apply cursor-not-allowed text-neutral;
    }
  }

  &__checkbox {
    @apply h-5 w-5 shrink-0 cursor-pointer opacity-0;
  }

  &__icon {
    @apply pointer-events-none absolute inset-y-0 left-0 my-auto h-5;

    --check: #{theme('colors.foreground')};

    #{$p}__field:not(:has(input:disabled)):hover & {
      @apply text-primary-emphasis;
    }

    #{$p}__field:has(input:disabled) & {
      --check: #{theme('colors.neutral.DEFAULT')};
    }

    #{$p}__checkbox:focus-visible + & {
      @apply outline outline-2 outline-offset-2 outline-primary-emphasis;
    }
  }
}
</style>
