<template>
  <div class="layout__container">
    <NavBar
      :open="isMenuOpen"
      @open="openMenu"
      @close="closeMenu"
    />

    <RouteHistory />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NavBar from '@/components/NavBar/NavBar.vue'
import RouteHistory from '@/components/RouteHistory/RouteHistory.vue'

export default defineComponent({
  components: {
    NavBar,
    RouteHistory,
  },

  data() {
    return {
      isMenuOpen: false,
    }
  },

  methods: {
    openMenu() {
      this.isMenuOpen = true
      document.body.classList.add('lock')
    },

    closeMenu() {
      this.isMenuOpen = false
      document.body.classList.remove('lock')
    },
  },
})
</script>

<style lang="scss">
.layout {
}
</style>
