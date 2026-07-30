<template>
  <div class="blog-list__container">
    <BlogCard
      v-for="post of posts"
      :key="post.url"
      :post="post"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { type Post } from '@/pages/blog/blog.data'
import BlogCard from '@/components/BlogList/BlogCard.vue'

export default defineComponent({
  components: { BlogCard },

  props: {
    posts: {
      required: true,
      type: Array as PropType<Post[]>,
    },
  },
})
</script>

<style lang="scss">
.blog-list {
  &__container {
    @apply my-8 grid gap-8;

    @screen sm {
      grid-template-columns: repeat(auto-fit, minmax(theme('spacing.80'), 1fr));
    }
  }
}
</style>
