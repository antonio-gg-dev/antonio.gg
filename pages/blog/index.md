---
title: Blog
command: [blog]
command_public: true
command_description: Lista las publicaciones disponibles en mi blog.
---

# Blog ls

<BlogList
  :posts="posts"
/>

<script lang="ts" setup>
import { data as posts } from './blog.data.ts'
import BlogList from '@/components/BlogList/BlogList.vue'
</script>
