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
    <div
      v-else
      class="route-history__terminal-line route-history__terminal-error"
      role="status"
    >
      {{ commandNotFoundMessage }}
    </div>
  </div>
</template>

<script lang="ts">
import { dataSymbol } from 'vitepress'
import { defineComponent, type PropType } from 'vue'
import { commandNotFoundMessage } from '@/components/CommandPrompt/Command'
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

  data() {
    return {
      commandNotFoundMessage,
    }
  },
})
</script>
