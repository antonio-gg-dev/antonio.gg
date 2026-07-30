<template>
  <a
    :class="{
      'blog-card__card': true,
      'blog-card__card--compact': compact,
    }"
    :href="post.url"
  >
    <span class="blog-card__file-name">{{ post.fileName }}</span>
    <span class="blog-card__author">{{ post.author }}</span>
    <span
      class="blog-card__word-count"
      :title="approximateWordCountTitle"
    >
      ~{{ approximateWordCount }}k
    </span>
    <time
      class="blog-card__date"
      :datetime="createdAtDate"
    >
      <span>{{ createdAtYear }}</span>
      <span>{{ createdAtMonth }}</span>
      <span>{{ createdAtDay }}</span>
    </time>
    <img
      v-if="!compact"
      class="blog-card__cover"
      :src="post.coverUrl"
      :alt="post.coverAlt"
    />
    <div
      v-if="!compact"
      class="blog-card__content"
    >
      <h2 class="blog-card__title">
        {{ post.title }}
      </h2>
      <p class="blog-card__description">
        {{ post.description }}
      </p>
      <ul
        class="blog-card__tags"
        aria-label="Etiquetas"
      >
        <li
          v-for="tag of post.tags"
          :key="tag"
          class="blog-card__tag"
        >
          <HashTag :tag="tag" />
        </li>
      </ul>
    </div>
  </a>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { type Post } from '@/pages/blog/blog.data'
import HashTag from '@/components/HashTag/HashTag.vue'

export default defineComponent({
  components: { HashTag },

  props: {
    post: {
      required: true,
      type: Object as PropType<Post>,
    },
    compact: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    createdAt(): Date {
      return new Date(this.post.createdAt)
    },

    createdAtDate(): string {
      return this.createdAt.toISOString().slice(0, 10)
    },

    approximateWordCount(): string {
      return new Intl.NumberFormat('es-ES', {
        maximumFractionDigits: 1,
      }).format(this.roundedWordCount / 1000)
    },

    approximateWordCountTitle(): string {
      return `~${this.roundedWordCount} palabras`
    },

    roundedWordCount(): number {
      return Math.round(this.post.wordCount / 100) * 100
    },

    createdAtYear(): string {
      return String(this.createdAt.getUTCFullYear())
    },

    createdAtMonth(): string {
      return this.createdAt
        .toLocaleDateString('es-ES', {
          month: 'short',
          timeZone: 'UTC',
        })
        .replace('.', '')
    },

    createdAtDay(): string {
      return String(this.createdAt.getUTCDate())
    },
  },
})
</script>

<style lang="scss">
@use '@/styles/mixins/crt';

.blog-card {
  $p: &;

  &__card {
    @apply -ml-2 grid items-baseline gap-x-4 gap-y-2 p-2 text-foreground no-underline;
    grid-template-columns: 5fr 4fr 7fr;
    grid-template-areas:
      'file-name  file-name   file-name'
      'author     word-count  date'
      'cover      cover       cover'
      'content    content     content';

    @screen md {
      @apply -ml-4 px-4;
    }

    @screen lg {
      grid-template-columns: 5fr 4fr 7fr 24fr;
      grid-template-areas:
        'author  word-count  date   file-name'
        'cover   cover       cover  content';
    }

    @screen xl {
      grid-template-columns: 5fr 4fr 7fr 34fr;
    }

    @screen 2xl {
      grid-template-columns: 5fr 4fr 7fr 44fr;
    }

    &--compact {
      @apply py-0;
      grid-template-areas:
        'file-name  file-name   file-name'
        'author     word-count  date';

      @screen lg {
        grid-template-areas: 'author  word-count  date  file-name';
      }
    }

    &:hover,
    &:focus {
      @apply bg-neutral text-primary-emphasis;
      @include crt.shadow(theme('colors.primary.emphasis'));
    }
  }

  &__file-name {
    @apply text-info;
    grid-area: file-name;
  }

  &__author {
    grid-area: author;
  }

  &__word-count {
    @apply text-right;
    grid-area: word-count;
  }

  &__date {
    @apply grid gap-3 justify-self-end text-right;
    grid-template-columns: 4ch 3ch 2ch;
    grid-area: date;
  }

  &__cover {
    @apply m-0 w-full;
    grid-area: cover;
  }

  &__content {
    @apply grid min-w-0 gap-2 self-start;
    grid-area: content;
  }

  &__title {
    @apply m-0 text-xl;
  }

  &__description {
    @apply m-0 font-normal text-neutral-emphasis;

    #{$p}__card:hover & {
      @apply text-primary-emphasis;
    }
  }

  &__tags {
    @apply m-0 flex flex-wrap gap-2;
  }

  &__tag {
    @apply m-0 p-0;

    &::before {
      content: none;
    }
  }
}
</style>
