<template>
  <div class="layout__viewport">
    <div class="layout__surface">
      <RouteHistory />
    </div>
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

export default defineComponent({
  components: {
    RouteHistory,
  },
})
</script>

<style lang="scss">
.layout {
  &__viewport {
    @apply fixed inset-0 overflow-hidden rounded-3xl bg-background p-4;
    filter: url('#crt-displacement');
  }

  &__surface {
    @apply h-dvh overflow-y-auto overflow-x-hidden;
  }

  &__filter {
    @apply pointer-events-none absolute h-0 w-0;
  }

  @media print {
    &__viewport {
      @apply static overflow-visible;
      filter: none;
    }

    &__surface {
      @apply h-auto overflow-visible p-0;
    }

    &__filter {
      @apply hidden;
    }
  }
}
</style>
