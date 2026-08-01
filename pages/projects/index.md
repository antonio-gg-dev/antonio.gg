---
title: Proyectos
command: [projects, 'projects --compact', 'projects -c']
command_urls:
  'projects --compact': /projects/?compact
  'projects -c': /projects/?compact
command_public: true
command_description: Lista los proyectos en los que he participado.
---

# Proyectos ls

<ProjectList
  :projects="projects"
  :compact="compact"
/>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { data as projects } from './projects.data.ts'
import ProjectList from '@/components/ProjectList/ProjectList.vue'

const compact = ref(false)

onMounted(() => {
  compact.value = new URLSearchParams(window.location.search).has('compact')
})
</script>
