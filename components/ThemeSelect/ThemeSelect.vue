<template>
  <label class="theme-select__field">
    <span class="theme-select__label">Tema</span>
    <select
      class="theme-select__select"
      :value="activeThemeId"
      @change="changeTheme"
    >
      <option value="mambo">Mambo</option>
      <option value="p1-phosphor">P1 Phosphor</option>
    </select>
  </label>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Theme, ThemeId } from '@/config/Theme'
import { themeService } from '@/config/ThemeService'

export default defineComponent({
  computed: {
    activeThemeId(): ThemeId {
      return themeService.state.activeTheme.id
    },
  },

  methods: {
    changeTheme(event: Event): void {
      if (!(event.currentTarget instanceof HTMLSelectElement)) {
        return
      }

      switch (event.currentTarget.value) {
        case ThemeId.P1Phosphor:
          themeService.activate(Theme.p1Phosphor())
          break
        case ThemeId.Mambo:
          themeService.activate(Theme.mambo())
          break
      }
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
