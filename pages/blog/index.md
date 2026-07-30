---
title: Blog
command: [blog, 'blog --compact', 'blog -c']
command_urls:
  'blog --compact': /blog/?compact
  'blog -c': /blog/?compact
command_public: true
command_description: Lista las publicaciones disponibles en mi blog.
---

# Blog ls

<BlogList
  :posts="posts"
  :compact="compact"
/>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { data as posts } from './blog.data.ts'
import BlogList from '@/components/BlogList/BlogList.vue'

const compact = ref(false)

onMounted(() => {
  compact.value = new URLSearchParams(window.location.search).has('compact')
})
</script>
