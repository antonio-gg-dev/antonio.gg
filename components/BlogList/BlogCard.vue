<template>
  <a
    class="blog-card__card"
    :href="post.url"
  >
    <img
      class="blog-card__cover"
      :src="post.coverUrl"
      :alt="post.coverAlt"
    />
    <h2 class="blog-card__title">
      {{ post.title }}
    </h2>
    <p class="blog-card__description">
      {{ post.description }}
    </p>
  </a>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { type Post } from '@/pages/blog/blog.data'

export default defineComponent({
  props: {
    post: {
      required: true,
      type: Object as PropType<Post>,
    },
  },
})
</script>

<style lang="scss">
@use '@/styles/mixins/crt';

.blog-card {
  &__card {
    @include crt.shadow(theme('colors.neutral.DEFAULT'));
    @apply bg-neutral text-foreground;

    &:hover,
    &:focus {
      @include crt.shadow(theme('colors.background'));
      @apply bg-background;
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
