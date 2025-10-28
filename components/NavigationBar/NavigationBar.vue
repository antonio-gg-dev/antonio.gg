<template>
  <nav class="navigation-bar__background">
    <div class="navigation-bar__container">
      <a
        class="navigation-bar__home-link"
        href="/"
        title="Ir a inicio"
      >
        <img
          class="navigation-bar__image"
          src="/images/profile.jpg"
          alt="Imagen de perfil de Antonio Gonzalez Gea"
        />

        antonio.gg
      </a>

      <div class="navigation-bar__separator"></div>

      <a href="/projects/"> Proyectos </a>
      <a href="/blog/"> Blog </a>

      <div class="navigation-bar__separator navigation-bar__separator--xs-hidden"></div>

      <CompactSocialLinks
        class="navigation-bar__social-links"
        linked-in-handle="agg-dev"
        x-handle="antonio_gg_dev"
        git-hub-handle="antonio-gg-dev"
        printables-handle="Katarn"
      />
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CompactSocialLinks from '@/components/CompactSocialLinks/CompactSocialLinks.vue'

export default defineComponent({
  components: { CompactSocialLinks },
})
</script>

<style lang="scss">
.navigation-bar {
  $p: &;

  &__background {
    @apply fixed inset-x-0 top-0 z-navigation-bar bg-black/50 backdrop-blur-sm;

    @media print {
      @apply hidden;
    }
  }

  &__container {
    @apply container flex items-center gap-4 py-1;
  }

  &__home-link {
    @apply flex items-center gap-4;
  }

  &__image {
    @apply m-0 h-8 rounded-full transition-opacity;

    #{$p}__home-link:hover & {
      @apply opacity-75;
    }
  }

  &__separator {
    @apply flex-grow;

    &--xs-hidden {
      @apply hidden;

      @screen sm {
        @apply block;
      }
    }
  }

  &__social-links {
    @apply -mr-2 hidden flex-nowrap;

    @screen sm {
      @apply flex;
    }
  }
}
</style>
