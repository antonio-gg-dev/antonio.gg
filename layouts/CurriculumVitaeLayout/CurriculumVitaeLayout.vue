<template>
  <div class="curriculum-vitae-layout__mobile">
    <img
      class="curriculum-vitae-layout__profile"
      src="/images/profile.jpg"
      alt="Imagen de perfil de Antonio Gonzalez Gea"
    />
    <div class="curriculum-vitae-layout__summary">
      <slot name="summary" />
    </div>
    <div class="curriculum-vitae-layout__contact">
      <slot name="contact" />
    </div>
    <div class="curriculum-vitae-layout__experience">
      <slot name="experience" />
    </div>
    <div class="curriculum-vitae-layout__projects">
      <slot name="projects" />
    </div>
    <div class="curriculum-vitae-layout__education">
      <slot name="education" />
    </div>
    <div class="curriculum-vitae-layout__languages">
      <slot name="languages" />
    </div>
    <div class="curriculum-vitae-layout__skills">
      <slot name="skills" />
    </div>
  </div>

  <div class="curriculum-vitae-layout__desktop">
    <div class="curriculum-vitae-layout__sidebar">
      <img
        class="curriculum-vitae-layout__profile"
        src="/images/profile.jpg"
        alt="Imagen de perfil de Antonio Gonzalez Gea"
      />
      <div class="curriculum-vitae-layout__contact">
        <slot name="contact" />
      </div>
      <div class="curriculum-vitae-layout__languages">
        <slot name="languages" />
      </div>
      <div class="curriculum-vitae-layout__skills">
        <slot name="skills" />
      </div>
    </div>
    <div class="curriculum-vitae-layout__content">
      <div class="curriculum-vitae-layout__summary">
        <slot name="summary" />
      </div>
      <div class="curriculum-vitae-layout__experience">
        <slot name="experience" />
      </div>
      <div class="curriculum-vitae-layout__projects">
        <slot name="projects" />
      </div>
      <div class="curriculum-vitae-layout__education">
        <slot name="education" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({})
</script>

<style lang="scss">
.curriculum-vitae-layout {
  &__mobile {
    @screen lg {
      @apply hidden;
    }

    @media print {
      @apply hidden;
    }
  }

  &__desktop {
    @apply hidden;

    @screen lg {
      @apply grid gap-8;
      grid-template-columns: min-content 1fr;
    }

    @media print {
      @apply grid gap-8;
      grid-template-columns: min-content 1fr;
    }
  }

  &__profile {
    @apply mx-auto w-52 justify-self-center rounded-full;

    @screen lg {
      @apply w-40;
    }

    @media print {
      @apply w-40;
    }
  }

  &__summary {
  }

  &__contact {
    li {
      @apply mb-2 whitespace-nowrap pl-0;

      &:first-of-type {
        @apply mb-8;
      }

      &::before {
        @apply hidden;
      }
    }

    a[target='_blank']::after {
      @apply hidden;
    }
  }

  &__experience {
  }

  &__projects {
  }

  &__education {
  }

  &__languages {
    li {
      @apply pl-0;

      &::before {
        @apply hidden;
      }
    }
  }

  &__skills {
    ul {
      @apply flex flex-wrap gap-x-2;
    }

    li {
      @apply bg-black/50 px-1;

      @media print {
        @apply bg-black/5;
      }

      &::before {
        @apply hidden;
      }
    }
  }
}
</style>
