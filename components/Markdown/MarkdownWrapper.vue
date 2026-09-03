<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="markdown-wrapper__container">
    <div
      class="markdown-wrapper__result"
      v-html="result"
    />

    <ScrollableContent class="markdown-wrapper__code-scroll">
      <div
        class="markdown-wrapper__code"
        v-html="code"
      />
    </ScrollableContent>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import MarkdownIt, { type MarkdownIt as MarkdownItInstance } from 'markdown-it'
import { createHighlighter } from 'shiki'
import { createShikiTheme, shikiThemeName } from '@/config/ShikiTheme'
import ScrollableContent from '@/components/Scrollbar/ScrollableContent.vue'

export default defineComponent({
  components: {
    ScrollableContent,
  },

  props: {
    template: {
      required: true,
      type: String as PropType<string>,
    },
  },
  data() {
    return {
      markdownIt: null as MarkdownItInstance | null,
      highlighter: null as null | Awaited<ReturnType<typeof createHighlighter>>,
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
      if (this.highlighter === null) {
        return ''
      }

      return this.highlighter.codeToHtml(this.template, {
        lang: 'md',
        theme: shikiThemeName,
      })
    },
  },
  created() {
    this.markdownIt = new MarkdownIt()

    createHighlighter({
      themes: [createShikiTheme()],
      langs: ['md'],
    })
      .then((highlighter) => {
        this.highlighter = highlighter
      })
      .catch(() => {})
  },
})
</script>

<style lang="scss">
@use '@/styles/mixins/crt';

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
    @include crt.shadow(theme('colors.neutral.DEFAULT'));
    @apply min-w-max bg-neutral p-4;

    pre {
      background: none !important;
      font-size: 16px;
    }
  }

  &__code-scroll {
    @apply min-w-0 bg-neutral;
  }
}
</style>
