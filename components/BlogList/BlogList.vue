<template>
  <div class="blog-list">
    <p>total {{ posts.length }} {{ articleCountLabel }}</p>

    <BlogCard
      v-for="post of posts"
      :key="post.url"
      :post="post"
    />

    <p
      class="blog-list__hint"
      role="note"
    >
      Para leer un artículo, escribe
      <code class="blog-list__hint-command">blog open nombre-del-artículo.md</code>.
    </p>
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

  computed: {
    articleCountLabel(): string {
      return this.posts.length === 1 ? 'artículo' : 'artículos'
    },
  },
})
</script>

<style lang="scss">
.blog-list {
  &__hint {
    @apply text-info;
  }

  &__hint-command {
    @apply text-foreground;
  }
}
</style>
