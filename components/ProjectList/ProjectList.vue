<template>
  <div class="project-list">
    <p>total {{ projects.length }} proyectos</p>

    <ProjectCard
      v-for="project of projects"
      :key="project.url"
      :project="project"
      :compact="compact"
    />

    <RandomHint
      :hints="{
        'compact-short': 2.5,
        'compact-long': 2.5,
      }"
    >
      Para abrir un proyecto, escribe <code>projects open nombre-del-proyecto</code>.
      <template #compact-short>
        Si quieres ver este listado de forma más compacta, escribe <code>projects -c</code>.
      </template>
      <template #compact-long>
        Si quieres ver este listado de forma más compacta, escribe <code>projects --compact</code>.
      </template>
    </RandomHint>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { type Project } from '@/pages/projects/projects.data'
import ProjectCard from '@/components/ProjectList/ProjectCard.vue'
import RandomHint from '@/components/RandomHint/RandomHint.vue'

export default defineComponent({
  components: {
    ProjectCard,
    RandomHint,
  },

  props: {
    projects: {
      required: true,
      type: Array as PropType<Project[]>,
    },
    compact: {
      type: Boolean,
      default: false,
    },
  },
})
</script>
