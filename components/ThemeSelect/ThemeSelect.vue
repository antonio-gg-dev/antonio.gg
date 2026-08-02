<template>
  <label class="theme-select__field">
    <span class="theme-select__label">Tema</span>
    <select
      v-model="activeThemeId"
      class="theme-select__select"
    >
      <option
        v-for="theme in themes"
        :key="theme.id"
        :value="theme.id"
      >
        {{ theme.name }}
      </option>
    </select>
  </label>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { type Appearance } from '@/config/Appearance'
import { Theme, ThemeId } from '@/config/Theme'
import { appearanceService } from '@/config/AppearanceService'

export default defineComponent({
  computed: {
    appearance(): Appearance {
      return appearanceService.appearance
    },

    themes(): Theme[] {
      const themes = Theme.all()

      if (this.appearance.customTheme === null) {
        return Object.values(themes)
      }

      return [
        themes[ThemeId.Chocula],
        themes[ThemeId.Mambo],
        themes[ThemeId.P1Phosphor],
        this.appearance.customTheme,
        themes[ThemeId.Solaris],
      ]
    },

    activeThemeId: {
      get(): ThemeId {
        return this.appearance.theme.id
      },

      set(themeId: ThemeId): void {
        const theme = this.themes.find((availableTheme) => availableTheme.id === themeId)

        if (theme !== undefined) {
          appearanceService.activateTheme(theme)
        }
      },
    },
  },
})
</script>

<style lang="scss">
@use '@/styles/mixins/crt';

.theme-select {
  &__field {
    @apply my-8 flex max-w-md flex-col gap-2;
  }

  &__select {
    @include crt.shadow(theme('colors.neutral.emphasis'));
    @apply cursor-pointer border-0.5 border-neutral-emphasis bg-neutral px-4 py-2 text-foreground;

    &:hover,
    &:focus {
      @include crt.shadow(theme('colors.primary.emphasis'));
      @apply border-primary-emphasis outline-none;
    }
  }
}
</style>
