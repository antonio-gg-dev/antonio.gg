<template>
  <div class="project-list__container">
    <ProjectCard
      v-for="project of projects"
      :key="project.url"
      :project="project"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { type Project } from '@/pages/projects/projects.data'
import ProjectCard from '@/components/ProjectList/ProjectCard.vue'

export default defineComponent({
  components: { ProjectCard },

  props: {
    projects: {
      required: true,
      type: Array as PropType<Project[]>,
    },
  },
})
</script>

<style lang="scss">
.project-list {
  &__container {
    @apply my-8 grid gap-8;

    @screen sm {
      grid-template-columns: repeat(auto-fit, minmax(theme('spacing.80'), 1fr));
    }
  }
}
</style>
