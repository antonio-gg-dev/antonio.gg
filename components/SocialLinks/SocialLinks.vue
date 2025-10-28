<template>
  <div class="social-links__list">
    <a
      v-if="customLink && customImage && customLabel"
      class="social-links__link"
      :href="customLink"
      target="_blank"
    >
      <img
        class="social-links__icon"
        :src="customImage"
        :alt="customLabel"
      />
      {{ customLabel }}
    </a>

    <a
      v-if="linkedInHandle"
      class="social-links__link"
      :href="`https://www.linkedin.com/in/${linkedInHandle}/`"
      target="_blank"
    >
      <img
        class="social-links__icon"
        src="/images/linkedin.svg"
        alt="LinkedIn"
      />
      LinkedIn
    </a>

    <a
      v-if="xHandle"
      class="social-links__link"
      :href="`https://x.com/${xHandle}`"
      target="_blank"
    >
      <img
        class="social-links__icon"
        src="/images/x.svg"
        alt="X"
      />
      X
    </a>

    <a
      v-if="gitHubHandle"
      class="social-links__link"
      :href="`https://github.com/${gitHubHandle}`"
      target="_blank"
    >
      <img
        class="social-links__icon"
        src="/images/github.svg"
        alt="GitHub"
      />
      GitHub
    </a>

    <a
      v-if="printablesHandle"
      class="social-links__link"
      :href="`https://www.printables.com/@${printablesHandle}`"
      target="_blank"
    >
      <img
        class="social-links__icon"
        src="/images/printables.svg"
        alt="Printables"
      />
      Printables
    </a>

    <a
      v-if="printablesModelId"
      class="social-links__link"
      :href="`https://www.printables.com/model/${printablesModelId}`"
      target="_blank"
    >
      <img
        class="social-links__icon"
        src="/images/printables.svg"
        alt="Printables"
      />
      Printables
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

export default defineComponent({
  props: {
    /** URL to a custom link, requires customImage and customLabel too */
    customLink: {
      required: false,
      default: null,
      type: String as PropType<string>,
    },
    /** URL to a image for a custom link, requires customLink and customLabel too */
    customImage: {
      required: false,
      default: null,
      type: String as PropType<string>,
    },
    /** Label for a custom link, requires customLink and customImage too */
    customLabel: {
      required: false,
      default: null,
      type: String as PropType<string>,
    },
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
    /** Handle of a GitHub user/project, compatible with user and user/project handles */
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
    /** ID of a Printables model */
    printablesModelId: {
      required: false,
      default: null,
      type: Number as PropType<number>,
    },
  },
})
</script>

<style lang="scss">
.social-links {
  $p: &;

  &__list {
    @apply mb-8 flex w-full flex-wrap justify-around gap-x-4 gap-y-2;
  }

  &__link {
    @apply px-2;

    &::after {
      display: none !important;
    }
  }

  &__icon {
    @apply m-0 mr-1 inline-block h-4 align-text-top opacity-75 transition-opacity;
    vertical-align: -0.125rem;

    #{$p}__link:hover & {
      @apply opacity-100;
    }
  }
}
</style>
