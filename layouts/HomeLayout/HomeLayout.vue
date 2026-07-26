<template>
  <div class="home-layout__container">
    <img
      class="home-layout__profile"
      src="/images/profile.jpg"
      alt="Imagen de perfil de Antonio Gonzalez Gea"
    />
    <div class="home-layout__content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({})
</script>

<style lang="scss">
@use '@/styles/mixins/crt';

.home-layout {
  &__container {
    @apply grid content-center gap-8;
    min-height: calc(100vh - theme('spacing.10'));

    @screen lg {
      grid-template-columns: auto 1fr;
    }
  }

  &__profile {
    @include crt.shadow(theme('colors.neutral.DEFAULT'));
    @apply w-52 justify-self-center rounded-full;

    @screen lg {
      @apply w-40;
    }

    @screen xl {
      @apply w-52;
    }
  }

  &__content {
  }
}
</style>
