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

      <button
        class="navigation-bar__open-menu"
        @click="open = true"
      >
        <img
          class="navigation-bar__icon"
          src="/images/menu.svg"
          alt="Abrir menú"
        />
      </button>

      <div
        :class="{
          'navigation-bar__backdrop': true,
          'navigation-bar__backdrop--open': open,
        }"
        @click="open = false"
      >
        <div
          class="navigation-bar__menu"
          @click.stop
        >
          <button
            class="navigation-bar__close-menu"
            @click="open = false"
          >
            <img
              class="navigation-bar__icon"
              src="/images/close.svg"
              alt="Abrir menú"
            />
          </button>

          <div class="navigation-bar__separator navigation-bar__separator--mobile-only"></div>

          <a
            class="navigation-bar__link navigation-bar__link--mobile-only"
            href="/"
            @click="open = false"
          >
            Inicio
          </a>
          <a
            class="navigation-bar__link"
            href="/blog/"
            @click="open = false"
          >
            Blog
          </a>
          <a
            class="navigation-bar__link"
            href="/projects/"
            @click="open = false"
          >
            Proyectos
          </a>

          <div class="navigation-bar__separator"></div>

          <CompactSocialLinks
            class="navigation-bar__social-links"
            linked-in-handle="agg-dev"
            x-handle="antonio_gg_dev"
            git-hub-handle="antonio-gg-dev"
            printables-handle="Katarn"
          />
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CompactSocialLinks from '@/components/CompactSocialLinks/CompactSocialLinks.vue'

export default defineComponent({
  components: { CompactSocialLinks },

  data() {
    return {
      open: false,
    }
  },
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
    @apply container flex items-center gap-4;
  }

  &__home-link {
    @apply flex h-10 shrink-0 items-center gap-4;
  }

  &__image {
    @apply m-0 h-8 rounded-full transition-opacity;

    #{$p}__home-link:hover & {
      @apply opacity-75;
    }
  }

  &__separator {
    @apply flex-grow;

    &--mobile-only {
      @apply hidden;

      @screen md {
        @apply block;
      }
    }
  }

  &__backdrop {
    @apply absolute inset-0 right-0 hidden h-screen cursor-pointer;

    &--open {
      @apply block;
    }

    @screen md {
      @apply static block h-auto w-full flex-grow;
    }
  }

  &__menu {
    @apply ml-auto flex h-screen w-fit cursor-auto flex-col bg-black/75 px-8;

    @screen md {
      @apply m-0 h-auto w-full flex-row gap-4 bg-transparent p-0;
    }
  }

  &__open-menu {
    @apply ml-auto h-10 opacity-75 transition-opacity;

    &:hover {
      @apply opacity-100;
    }

    @screen md {
      @apply hidden;
    }
  }

  &__close-menu {
    @apply ml-auto h-10 opacity-75 transition-opacity;

    &:hover {
      @apply opacity-100;
    }

    @screen md {
      @apply hidden;
    }
  }

  &__icon {
    @apply m-0 block h-6 w-6 object-contain object-center;
  }

  &__link {
    @apply flex h-10 items-center;

    &--mobile-only {
      @screen md {
        @apply hidden;
      }
    }
  }

  &__social-links {
    @apply h-10 w-full items-center justify-between;

    @screen md {
      @apply -mr-2 flex w-fit flex-nowrap;
    }
  }
}
</style>
