<template>
  <div class="scrollable-content">
    <div class="scrollable-content__container">
      <div
        ref="target"
        class="scrollable-content__target"
      >
        <slot />
      </div>

      <CustomScrollbar
        v-if="targetElement !== null"
        :variant="contentVariant"
        :orientation="contentOrientation"
        :target-element="targetElement"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CustomScrollbar, {
  CustomScrollbarOrientation,
  CustomScrollbarVariant,
} from '@/components/Scrollbar/CustomScrollbar.vue'

export default defineComponent({
  components: {
    CustomScrollbar,
  },

  data() {
    return {
      targetElement: null as HTMLElement | null,
      contentOrientation: CustomScrollbarOrientation.Horizontal,
      contentVariant: CustomScrollbarVariant.Content,
    }
  },

  mounted() {
    if (this.$refs.target instanceof HTMLElement) {
      this.targetElement = this.$refs.target
    }
  },
})
</script>

<style lang="scss">
.scrollable-content {
  $p: &;

  &__container {
    @apply my-8;

    #{$p}.markdown-wrapper__code-scroll & {
      @apply my-0;
    }
  }

  &__target {
    @apply overflow-x-auto overflow-y-hidden;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    > table,
    > [class*='language-'] {
      @apply my-0 min-w-max;
    }
  }
}
</style>
