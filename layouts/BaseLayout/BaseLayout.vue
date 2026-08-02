<template>
  <div class="layout__viewport">
    <div
      id="layout-surface"
      class="layout__surface"
    >
      <RouteHistory />
    </div>
    <Scrollbar target-id="layout-surface" />
    <ScrollToBottomButton target-id="layout-surface" />
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
import ScrollToBottomButton from '@/components/ScrollToBottomButton/ScrollToBottomButton.vue'
import Scrollbar from '@/components/Scrollbar/Scrollbar.vue'
import { appearanceService } from '@/config/AppearanceService'

export default defineComponent({
  components: {
    RouteHistory,
    ScrollToBottomButton,
    Scrollbar,
  },

  mounted() {
    appearanceService.start()
  },

  beforeUnmount() {
    appearanceService.stop()
  },
})
</script>

<style lang="scss">
.layout {
  &__viewport {
    @apply container fixed inset-x-0 top-0 h-dvh overflow-hidden rounded-3xl bg-background px-0;
    filter: url('#crt-displacement');

    &::before,
    &::after {
      @apply pointer-events-none absolute inset-0 z-crt-overlay rounded-3xl;
      content: '';
    }

    &::before {
      background-image: repeating-linear-gradient(
        to bottom,
        theme('colors.bezel/0.18') 0 0.06rem,
        transparent 0.12rem 0.18rem,
        theme('colors.bezel/0.18') 0.24rem
      );

      html[data-effect-scanlines='false'] & {
        @apply hidden;
      }
    }

    &::after {
      @apply hidden;
      background-image: linear-gradient(to bottom, transparent, theme('colors.bezel/0.12') 50%, transparent);
      background-position: 0 -12dvh;
      background-size: 100% 12dvh;
      background-repeat: no-repeat;

      html[data-effect-sweep='true'] & {
        @apply block;
        animation: crt-screen-sweep 8s linear infinite;
      }
    }

    html[data-effect-curvature='false'] & {
      @apply rounded-none;
      filter: none;

      &::before,
      &::after {
        @apply rounded-none;
      }
    }
  }

  &__surface {
    @apply h-full overflow-y-auto overflow-x-hidden scroll-auto px-2;
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

      &::before,
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
    background-position: 0 -12dvh;
  }

  18.75%,
  100% {
    background-position: 0 112dvh;
  }
}
</style>
