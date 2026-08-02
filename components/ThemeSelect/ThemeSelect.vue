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
import { Theme, type ThemeId } from '@/config/Theme'
import { themeService } from '@/config/ThemeService'

export default defineComponent({
  computed: {
    themes(): Record<ThemeId, Theme> {
      return Theme.all()
    },

    activeThemeId: {
      get(): ThemeId {
        return themeService.state.activeTheme.id
      },

      set(themeId: ThemeId): void {
        themeService.activate(this.themes[themeId])
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
    @apply cursor-pointer border-1 border-neutral-emphasis bg-neutral px-4 py-2 text-foreground;

    &:hover,
    &:focus {
      @include crt.shadow(theme('colors.primary.emphasis'));
      @apply border-primary-emphasis outline-none;
    }
  }
}
</style>
