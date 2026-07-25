<template>
  <div class="social-links__list">
    <a
      v-if="customLink && customLabel && (customIcon || customImage)"
      class="social-links__link"
      :href="customLink"
      target="_blank"
    >
      <component
        :is="customIcon"
        v-if="customIcon"
        class="social-links__icon"
        aria-hidden="true"
      />
      <img
        v-else
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
      <LinkedInIcon
        class="social-links__icon"
        aria-hidden="true"
      />
      LinkedIn
    </a>

    <a
      v-if="xHandle"
      class="social-links__link"
      :href="`https://x.com/${xHandle}`"
      target="_blank"
    >
      <XIcon
        class="social-links__icon"
        aria-hidden="true"
      />
      X
    </a>

    <a
      v-if="gitHubHandle"
      class="social-links__link"
      :href="`https://github.com/${gitHubHandle}`"
      target="_blank"
    >
      <GitHubIcon
        class="social-links__icon"
        aria-hidden="true"
      />
      GitHub
    </a>

    <a
      v-if="printablesHandle"
      class="social-links__link"
      :href="`https://www.printables.com/@${printablesHandle}`"
      target="_blank"
    >
      <PrintablesIcon
        class="social-links__icon"
        aria-hidden="true"
      />
      Printables
    </a>

    <a
      v-if="printablesModelId"
      class="social-links__link"
      :href="`https://www.printables.com/model/${printablesModelId}`"
      target="_blank"
    >
      <PrintablesIcon
        class="social-links__icon"
        aria-hidden="true"
      />
      Printables
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent, type Component, type PropType } from 'vue'
import GitHubIcon from '@/components/Icons/GitHubIcon.vue'
import LinkedInIcon from '@/components/Icons/LinkedInIcon.vue'
import PrintablesIcon from '@/components/Icons/PrintablesIcon.vue'
import XIcon from '@/components/Icons/XIcon.vue'

export default defineComponent({
  components: {
    GitHubIcon,
    LinkedInIcon,
    PrintablesIcon,
    XIcon,
  },

  props: {
    /** URL to a custom link, requires customLabel and either customIcon or customImage too */
    customLink: {
      required: false,
      default: null,
      type: String as PropType<string>,
    },
    /** Component for a custom link, requires customLink and customLabel too */
    customIcon: {
      required: false,
      default: null,
      type: Object as PropType<Component>,
    },
    /** URL to an image for a custom link, requires customLink and customLabel too */
    customImage: {
      required: false,
      default: null,
      type: String as PropType<string>,
    },
    /** Label for a custom link, requires customLink and either customIcon or customImage too */
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
  }

  &__icon {
    @apply m-0 mr-1 inline-block h-4 align-text-top text-foreground;
    vertical-align: -0.125rem;

    #{$p}__link:hover & {
      @apply text-primary-emphasis;
    }
  }
}
</style>
