<template>
  <div class="theme-colors__groups">
    <fieldset
      v-for="group in colorGroups"
      :key="group.name"
      class="theme-colors__group"
    >
      <legend class="theme-colors__legend">{{ group.name }}</legend>

      <div class="theme-colors__fields">
        <label
          v-for="color in group.colors"
          :key="color.id"
          class="theme-colors__field"
        >
          <input
            class="theme-colors__input"
            type="color"
            :value="color.value"
            :aria-label="color.ariaLabel"
            @input="activateColor(color.id, $event)"
          />
          <span>{{ color.label }}</span>
        </label>
      </div>
    </fieldset>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ThemeColor, type Theme } from '@/config/Theme'
import { appearanceService } from '@/config/AppearanceService'

const colorGroups: Array<{
  name: string
  colors: Array<{
    id: ThemeColor
    label: string
    ariaLabel?: string
  }>
}> = [
  {
    name: 'Colores base',
    colors: [
      { id: ThemeColor.Bezel, label: 'Marco' },
      { id: ThemeColor.Background, label: 'Fondo' },
      { id: ThemeColor.Neutral, label: 'Neutro' },
      {
        id: ThemeColor.NeutralEmphasis,
        label: 'Neutro énf.',
        ariaLabel: 'Neutro con énfasis',
      },
      { id: ThemeColor.Foreground, label: 'Texto' },
    ],
  },
  {
    name: 'Colores semánticos',
    colors: [
      { id: ThemeColor.Danger, label: 'Peligro' },
      {
        id: ThemeColor.DangerEmphasis,
        label: 'Peligro énf.',
        ariaLabel: 'Peligro con énfasis',
      },
      { id: ThemeColor.Success, label: 'Éxito' },
      {
        id: ThemeColor.SuccessEmphasis,
        label: 'Éxito énf.',
        ariaLabel: 'Éxito con énfasis',
      },
      { id: ThemeColor.Warning, label: 'Advertencia' },
      {
        id: ThemeColor.WarningEmphasis,
        label: 'Advertencia énf.',
        ariaLabel: 'Advertencia con énfasis',
      },
      { id: ThemeColor.Primary, label: 'Primario' },
      {
        id: ThemeColor.PrimaryEmphasis,
        label: 'Primario énf.',
        ariaLabel: 'Primario con énfasis',
      },
      { id: ThemeColor.Accent, label: 'Acento' },
      {
        id: ThemeColor.AccentEmphasis,
        label: 'Acento énf.',
        ariaLabel: 'Acento con énfasis',
      },
      { id: ThemeColor.Info, label: 'Información' },
      {
        id: ThemeColor.InfoEmphasis,
        label: 'Información énf.',
        ariaLabel: 'Información con énfasis',
      },
    ],
  },
]

export default defineComponent({
  computed: {
    theme(): Theme {
      return appearanceService.appearance.theme
    },

    colorGroups() {
      return colorGroups.map((group) => ({
        ...group,
        colors: group.colors.map((color) => ({
          ...color,
          value: this.theme[color.id],
        })),
      }))
    },
  },

  methods: {
    activateColor(color: ThemeColor, event: Event): void {
      if (!(event.target instanceof HTMLInputElement)) {
        return
      }

      appearanceService.activateThemeColor(color, event.target.value)
    },
  },
})
</script>

<style lang="scss">
@use '@/styles/mixins/crt';

.theme-colors {
  &__groups {
    @apply my-8 flex flex-col gap-8;
  }

  &__group {
    @apply flex flex-col gap-2;
  }

  &__legend {
    @apply mb-2;
  }

  &__fields {
    @apply grid grid-cols-1 gap-2;

    @screen sm {
      @apply grid-cols-2;
    }
  }

  &__field {
    @apply flex cursor-pointer items-center gap-4;
  }

  &__input {
    @include crt.shadow(theme('colors.neutral.emphasis'));
    @apply h-5 w-5 shrink-0 cursor-pointer border-0.5 border-neutral-emphasis bg-neutral p-0;

    &::-webkit-color-swatch-wrapper {
      @apply p-0;
    }

    &::-webkit-color-swatch,
    &::-moz-color-swatch {
      @apply border-0;
    }

    &:hover,
    &:focus-visible {
      @include crt.shadow(theme('colors.primary.emphasis'));
      @apply border-primary-emphasis outline-none;
    }
  }
}
</style>
