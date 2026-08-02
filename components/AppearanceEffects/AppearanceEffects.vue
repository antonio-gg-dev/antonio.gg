<template>
  <fieldset class="appearance-effects">
    <legend class="appearance-effects__legend">Efectos</legend>

    <label class="appearance-effects__field">
      <input
        v-model="curvature"
        class="appearance-effects__checkbox"
        type="checkbox"
      />
      <span>Distorsión de barril</span>
    </label>

    <label class="appearance-effects__field">
      <input
        v-model="scanlines"
        class="appearance-effects__checkbox"
        type="checkbox"
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
      <span>Barrido luminoso</span>
    </label>

    <label class="appearance-effects__field">
      <input
        v-model="aberration"
        class="appearance-effects__checkbox"
        type="checkbox"
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
      <span>Parpadeo de la aberración</span>
    </label>
  </fieldset>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { type Appearance, AppearanceEffect } from '@/config/Appearance'
import { appearanceService } from '@/config/AppearanceService'

export default defineComponent({
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
  @apply my-8 flex max-w-md flex-col gap-3;

  &__legend {
    @apply mb-2;
  }

  &__field {
    @apply flex cursor-pointer items-center gap-3;

    &:has(input:disabled) {
      @apply cursor-not-allowed opacity-50;
    }
  }

  &__checkbox {
    @apply h-5 w-5 cursor-pointer accent-primary-emphasis;

    &:disabled {
      @apply cursor-not-allowed;
    }
  }
}
</style>
