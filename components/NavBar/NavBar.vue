<template>
  <nav class="navbar__background">
    <div class="navbar__container">
      <a
        class="navbar__home-link"
        href="/"
        title="Ir a inicio"
      >
        <img
          class="navbar__image"
          src="/images/profile.jpg"
          alt="Imagen de perfil de Antonio Gonzalez Gea"
        />

        antonio.gg
      </a>

      <button
        class="navbar__open-menu"
        aria-label="Abrir menú"
        @click="$emit('open')"
      >
        <MenuIcon
          class="navbar__icon"
          aria-hidden="true"
        />
      </button>

      <NavBarMenu
        class="navbar__menu-desktop"
        @close="$emit('close')"
      />
    </div>
  </nav>

  <Teleport to="body">
    <div
      :class="{
        navbar__backdrop: true,
        'navbar__backdrop--open': open,
      }"
      @click="$emit('close')"
    >
      <div
        class="navbar__menu-mobile-background"
        @click.stop
      >
        <NavBarMenu
          class="navbar__menu-mobile"
          @close="$emit('close')"
        />
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import MenuIcon from '@/components/Icons/MenuIcon.vue'
import NavBarMenu from '@/components/NavBar/NavBarMenu.vue'

export default defineComponent({
  components: {
    MenuIcon,
    NavBarMenu,
  },

  props: {
    open: {
      required: true,
      type: Boolean as PropType<boolean>,
    },
  },

  emits: {
    close: () => true,
    open: () => true,
  },
})
</script>

<style lang="scss">
.navbar {
  $p: &;

  &__background {
    @apply fixed inset-x-0 top-0 z-navbar bg-background;

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

  &__backdrop {
    @apply fixed inset-0 z-menu hidden cursor-pointer;

    &--open {
      @apply block;
    }

    @screen md {
      @apply static block h-auto w-full flex-grow;
    }
  }

  &__menu-mobile-background {
    @apply ml-auto h-screen w-fit cursor-auto bg-background;
    animation: fade-menu-container 0.3s ease-in-out;

    @keyframes fade-menu-container {
      from {
        translate: 100% 0;
      }
      to {
        translate: 0 0;
      }
    }

    @screen md {
      @apply hidden;
    }
  }

  &__menu-mobile {
    @apply flex h-dvh flex-col px-8;
  }

  &__menu-desktop {
    @apply hidden;

    @screen md {
      @apply flex h-auto w-full flex-row gap-4 p-0;
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

  &__icon {
    @apply m-0 block h-6 text-foreground;
  }
}
</style>
