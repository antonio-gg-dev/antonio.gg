<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
  >
    <rect
      fill="currentColor"
      x="1"
      y="11"
      width="22"
      height="2"
    />
    <rect
      fill="currentColor"
      x="1"
      y="19"
      width="22"
      height="2"
    />
    <rect
      fill="currentColor"
      x="1"
      y="3"
      width="22"
      height="2"
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
