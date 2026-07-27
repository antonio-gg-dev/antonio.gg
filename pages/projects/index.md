---
command: [projects]
command_public: true
command_description: Muestra un listado con los proyectos en los que he participado.
---

# Proyectos

<ProjectList
  :projects="projects"
/>

<script lang="ts" setup>
import { data as projects } from './projects.data.ts'
import ProjectList from '@/components/ProjectList/ProjectList.vue'
</script>
