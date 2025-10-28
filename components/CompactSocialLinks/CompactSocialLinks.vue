<template>
  <div class="compact-social-links__list">
    <a
      v-if="linkedInHandle"
      class="compact-social-links__link"
      :href="`https://www.linkedin.com/in/${linkedInHandle}/`"
      target="_blank"
      title="LinkedIn"
    >
      <img
        class="compact-social-links__icon"
        src="/images/linkedin.svg"
        alt="LinkedIn"
      />
    </a>

    <a
      v-if="xHandle"
      class="compact-social-links__link"
      :href="`https://x.com/${xHandle}`"
      target="_blank"
      title="X"
    >
      <img
        class="compact-social-links__icon"
        src="/images/x.svg"
        alt="X"
      />
    </a>

    <a
      v-if="gitHubHandle"
      class="compact-social-links__link"
      :href="`https://github.com/${gitHubHandle}`"
      target="_blank"
      title="GitHub"
    >
      <img
        class="compact-social-links__icon"
        src="/images/github.svg"
        alt="GitHub"
      />
    </a>

    <a
      v-if="printablesHandle"
      class="compact-social-links__link"
      :href="`https://www.printables.com/@${printablesHandle}`"
      target="_blank"
      title="Printables"
    >
      <img
        class="compact-social-links__icon"
        src="/images/printables.svg"
        alt="Printables"
      />
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

export default defineComponent({
  props: {
    /** Handle (last part of a custom URL) of a LinkedIn account */
    linkedInHandle: {
      required: false,
      default: null,
      type: String as PropType<string>,
    },
    /** Handle of a X account, without the @ */
    xHandle: {
      required: false,
      default: null,
      type: String as PropType<string>,
    },
    /** Handle of a GitHub user */
    gitHubHandle: {
      required: false,
      default: null,
      type: String as PropType<string>,
    },
    /** Handle of a Printables account, without the @ */
    printablesHandle: {
      required: false,
      default: null,
      type: String as PropType<string>,
    },
  },
})
</script>

<style lang="scss">
.compact-social-links {
  $p: &;

  &__list {
    @apply flex w-fit flex-wrap;
  }

  &__link {
    @apply p-2;

    &::after {
      display: none !important;
    }
  }

  &__icon {
    @apply m-0 block h-4 w-4 object-contain object-center align-text-top opacity-75 transition-opacity;

    #{$p}__link:hover & {
      @apply opacity-100;
    }
  }
}
</style>
