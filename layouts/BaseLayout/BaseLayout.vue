<template>
  <div class="layout__container">
    <NavBar
      :open="isMenuOpen"
      @open="openMenu"
      @close="closeMenu"
    />

    <Content />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NavBar from '@/components/NavBar/NavBar.vue'
import { Content } from 'vitepress'

export default defineComponent({
  components: {
    // eslint-disable-next-line vue/no-reserved-component-names
    Content,
    NavBar,
  },

  data() {
    return {
      isMenuOpen: false,
    }
  },

  mounted() {
    document.addEventListener('scroll', function () {
      const bodyStyles = document.body.style
      const rotation = `${(Math.floor(window.scrollY * 0.01) % 36) * 10}deg`
      const property = '--rotation'

      if (bodyStyles.getPropertyValue(property) !== rotation) {
        bodyStyles.setProperty(property, rotation)
      }
    })
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
  &__container {
    @apply container;
  }
}
</style>
