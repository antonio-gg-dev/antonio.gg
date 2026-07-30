<template>
  <div class="layout__viewport">
    <div
      id="layout-surface"
      class="layout__surface"
    >
      <RouteHistory />
    </div>
    <Scrollbar target-id="layout-surface" />
  </div>

  <svg
    class="layout__filter"
    aria-hidden="true"
  >
    <defs>
      <filter
        id="crt-displacement"
        x="-5%"
        y="-5%"
        width="110%"
        height="110%"
        color-interpolation-filters="sRGB"
      >
        <feImage
          href="/images/crt-displacement-map.png"
          preserveAspectRatio="none"
          result="displacement-map"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="displacement-map"
          scale="40"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </defs>
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import RouteHistory from '@/components/RouteHistory/RouteHistory.vue'
import Scrollbar from '@/components/Scrollbar/Scrollbar.vue'

export default defineComponent({
  components: {
    RouteHistory,
    Scrollbar,
  },
})
</script>

<style lang="scss">
.layout {
  &__viewport {
    @apply container fixed inset-x-0 top-0 h-dvh overflow-hidden rounded-3xl bg-background px-0;
    filter: url('#crt-displacement');

    &::after {
      @apply pointer-events-none absolute inset-0 z-crt-overlay rounded-3xl;
      animation: crt-screen-sweep 8s linear infinite;
      background-image: linear-gradient(to bottom, transparent, theme('colors.bezel/0.12') 50%, transparent),
        repeating-linear-gradient(
          to bottom,
          theme('colors.bezel/0.18') 0 0.06rem,
          transparent 0.12rem 0.18rem,
          theme('colors.bezel/0.18') 0.24rem
        );
      background-position:
        0 -12dvh,
        0 0;
      background-size:
        100% 12dvh,
        100% 100%;
      background-repeat: no-repeat, repeat;
      content: '';
    }

    @media (prefers-reduced-motion: reduce) {
      &::after {
        animation: none;
      }
    }
  }

  &__surface {
    @apply h-full overflow-y-auto overflow-x-hidden px-2;
    scrollbar-width: none;

    @screen md {
      @apply px-4;
    }

    @screen xl {
      @apply px-8;
    }

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__filter {
    @apply pointer-events-none absolute h-0 w-0;
  }

  @media print {
    &__viewport {
      @apply static h-auto max-w-none overflow-visible;
      filter: none;

      &::after {
        @apply hidden;
      }
    }

    &__surface {
      @apply h-auto overflow-visible;
    }

    &__filter {
      @apply hidden;
    }
  }
}

@keyframes crt-screen-sweep {
  0% {
    background-position:
      0 -12dvh,
      0 0;
  }

  18.75%,
  100% {
    background-position:
      0 112dvh,
      0 0;
  }
}
</style>
