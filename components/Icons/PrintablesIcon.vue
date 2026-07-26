<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M11 1h2v1h2v1h2v1h2v1h1v10h-2v1h-2v1h-2v1h-2v-8h-1V9H9V8H7V7H5V6H4V5h1V4h2V3h2V2h2z"
    />
    <path
      fill="currentColor"
      d="M12 19v-1h-1v-1H9v-1H7v-1H5v-1H4v9h1v-1h2v-1h2v-1h2v-1z"
    />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({})
</script>

<style lang="scss" scoped>
@use '@/styles/mixins/crt';

svg {
  @include crt.icon;
}
</style>
