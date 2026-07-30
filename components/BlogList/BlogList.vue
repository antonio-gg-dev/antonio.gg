<template>
  <div class="blog-list">
    <p>total {{ posts.length }} artículos</p>

    <BlogCard
      v-for="post of posts"
      :key="post.url"
      :post="post"
      :compact="compact"
    />

    <RandomHint
      :hints="{
        'compact-short': 2.5,
        'compact-long': 2.5,
      }"
    >
      Para leer un artículo, escribe <code>blog open nombre-del-artículo.md</code>.
      <template #compact-short>
        Si quieres ver este listado de forma más compacta, escribe <code>blog -c</code>.
      </template>
      <template #compact-long>
        Si quieres ver este listado de forma más compacta, escribe <code>blog --compact</code>.
      </template>
    </RandomHint>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { type Post } from '@/pages/blog/blog.data'
import BlogCard from '@/components/BlogList/BlogCard.vue'
import RandomHint from '@/components/RandomHint/RandomHint.vue'

export default defineComponent({
  components: {
    BlogCard,
    RandomHint,
  },

  props: {
    posts: {
      required: true,
      type: Array as PropType<Post[]>,
    },
    compact: {
      type: Boolean,
      default: false,
    },
  },
})
</script>
