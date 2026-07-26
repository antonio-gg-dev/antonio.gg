<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
  >
    <polygon
      fill="currentColor"
      points="16 20 16 22 15 22 15 23 3 23 3 22 2 22 2 6 3 6 3 5 6 5 6 20 16 20"
    />
    <path
      fill="currentColor"
      d="m16,7V1h-8v1h-1v16h1v1h13v-1h1V7h-6Zm4,10h-11V3h5v6h6v8Z"
    />
    <polygon
      fill="currentColor"
      points="22 5 22 6 17 6 17 1 18 1 18 2 19 2 19 3 20 3 20 4 21 4 21 5 22 5"
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
