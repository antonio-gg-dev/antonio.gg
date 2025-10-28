# Blog

<ProjectList
  :projects="posts"
/>

<script lang="ts" setup>
import { data as posts } from './blog.data.ts'
import ProjectList from '@/components/ProjectList/ProjectList.vue'
</script>
