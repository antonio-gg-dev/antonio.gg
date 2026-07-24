<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="markdown-wrapper__container">
    <div
      class="markdown-wrapper__result"
      v-html="result"
    />

    <div
      class="markdown-wrapper__code"
      v-html="code"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import MarkdownIt from 'markdown-it'
import { getHighlighter } from 'shikiji'

export default defineComponent({
  props: {
    template: {
      required: true,
      type: String as PropType<string>,
    },
  },
  data() {
    return {
      markdownIt: null as null | MarkdownIt,
      shikiji: null as null | Awaited<ReturnType<typeof getHighlighter>>,
    }
  },
  computed: {
    result() {
      if (this.markdownIt === null) {
        return ''
      }

      return this.markdownIt.render(this.template)
    },
    code() {
      if (this.shikiji === null) {
        return ''
      }

      return this.shikiji.codeToHtml(this.template, {
        lang: 'md',
        theme: 'github-dark',
      })
    },
  },
  created() {
    this.markdownIt = new MarkdownIt()

    getHighlighter({
      themes: ['github-dark'],
      langs: ['md'],
    })
      .then((shikiji) => {
        this.shikiji = shikiji
      })
      .catch(() => {})
  },
})
</script>

<style lang="scss">
.markdown-wrapper {
  &__container {
    @apply -m-4 grid min-h-screen grid-rows-2;

    @screen lg {
      @apply grid-cols-2 grid-rows-1;
    }
  }

  &__result {
    @apply p-4;
  }

  &__code {
    @apply overflow-x-scroll bg-background/75 p-4;

    pre {
      background: none !important;
      font-size: 16px;
    }
  }
}
</style>
