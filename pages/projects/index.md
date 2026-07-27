---
command: [projects]
---

# Proyectos

<ProjectList
  :projects="projects"
/>

<script lang="ts" setup>
import { data as projects } from './projects.data.ts'
import ProjectList from '@/components/ProjectList/ProjectList.vue'
</script>
