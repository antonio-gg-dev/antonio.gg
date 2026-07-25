<template>
  <div class="compact-social-links__list">
    <a
      v-if="linkedInHandle"
      class="compact-social-links__link"
      :href="`https://www.linkedin.com/in/${linkedInHandle}/`"
      target="_blank"
      title="LinkedIn"
      aria-label="LinkedIn"
    >
      <LinkedInIcon
        class="compact-social-links__icon"
        aria-hidden="true"
      />
    </a>

    <a
      v-if="xHandle"
      class="compact-social-links__link"
      :href="`https://x.com/${xHandle}`"
      target="_blank"
      title="X"
      aria-label="X"
    >
      <XIcon
        class="compact-social-links__icon"
        aria-hidden="true"
      />
    </a>

    <a
      v-if="gitHubHandle"
      class="compact-social-links__link"
      :href="`https://github.com/${gitHubHandle}`"
      target="_blank"
      title="GitHub"
      aria-label="GitHub"
    >
      <GitHubIcon
        class="compact-social-links__icon"
        aria-hidden="true"
      />
    </a>

    <a
      v-if="printablesHandle"
      class="compact-social-links__link"
      :href="`https://www.printables.com/@${printablesHandle}`"
      target="_blank"
      title="Printables"
      aria-label="Printables"
    >
      <PrintablesIcon
        class="compact-social-links__icon"
        aria-hidden="true"
      />
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
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
  }

  &__icon {
    @apply m-0 block h-4 align-text-top text-foreground;

    #{$p}__link:hover & {
      @apply text-primary-emphasis;
    }
  }
}
</style>
