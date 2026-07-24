<template>
  <a
    class="project-card__card"
    :href="project.url"
  >
    <img
      class="project-card__cover"
      :src="project.coverUrl"
      :alt="project.coverAlt"
    />
    <h2 class="project-card__title">
      {{ project.title }}
    </h2>
    <p class="project-card__description">
      {{ project.description }}
    </p>
  </a>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { type Project } from '@/pages/projects/projects.data'

export default defineComponent({
  props: {
    project: {
      required: true,
      type: Object as PropType<Project>,
    },
  },
})
</script>

<style lang="scss">
.project-card {
  &__card {
    @apply bg-bg/25 text-fg backdrop-blur-sm transition-colors;

    &:hover,
    &:focus {
      @apply bg-bg/50;
      font-variation-settings: 'slnt' 0;
    }
  }

  &__cover {
    @apply m-0 w-full;
  }

  &__title {
    @apply mx-8;
  }

  &__description {
    @apply mx-8 font-normal;
  }
}
</style>
