<template>
  <div class="navbar-menu__menu-items">
    <button
      class="navbar-menu__close-menu"
      aria-label="Cerrar menú"
      @click="$emit('close')"
    >
      <CloseIcon
        class="navbar-menu__icon"
        aria-hidden="true"
      />
    </button>

    <div class="navbar-menu__separator navbar-menu__separator--mobile-only"></div>

    <a
      class="navbar-menu__link navbar-menu__link--mobile-only"
      href="/"
      @click="$emit('close')"
    >
      Inicio
    </a>
    <a
      class="navbar-menu__link"
      href="/blog/"
      @click="$emit('close')"
    >
      Blog
    </a>
    <a
      class="navbar-menu__link"
      href="/projects/"
      @click="$emit('close')"
    >
      Proyectos
    </a>

    <div class="navbar-menu__separator"></div>

    <CompactSocialLinks
      class="navbar-menu__social-links"
      linked-in-handle="agg-dev"
      x-handle="antonio_gg_dev"
      git-hub-handle="antonio-gg-dev"
      printables-handle="Katarn"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CompactSocialLinks from '@/components/CompactSocialLinks/CompactSocialLinks.vue'
import CloseIcon from '@/components/Icons/CloseIcon.vue'

export default defineComponent({
  components: {
    CloseIcon,
    CompactSocialLinks,
  },

  emits: { close: () => true },
})
</script>

<style scoped lang="scss">
.navbar-menu {
  &__close-menu {
    @apply ml-auto h-10 opacity-75;

    &:hover {
      @apply opacity-100;
    }

    @screen md {
      @apply hidden;
    }
  }

  &__icon {
    @apply m-0 block h-6 text-foreground;
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

  &__separator {
    @apply flex-grow;

    &--mobile-only {
      @apply hidden;

      @screen md {
        @apply block;
      }
    }
  }
}
</style>
