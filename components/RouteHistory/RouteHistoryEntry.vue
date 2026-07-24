<template>
  <div
    class="route-history__entry"
    :class="{ 'route-history__entry--current': current }"
    :data-route-history-id="entry.id"
  >
    <component
      :is="entry.component"
      v-if="entry.component"
    />
    <template v-else>404 Page Not Found</template>
  </div>
</template>

<script lang="ts">
import { dataSymbol } from 'vitepress'
import { defineComponent, type PropType } from 'vue'
import type { RouteHistoryItem } from './RouteHistoryItem'

export default defineComponent({
  provide() {
    return {
      [dataSymbol]: this.entry.data,
    }
  },

  props: {
    entry: {
      required: true,
      type: Object as PropType<RouteHistoryItem>,
    },
    current: {
      required: true,
      type: Boolean as PropType<boolean>,
    },
  },
})
</script>
