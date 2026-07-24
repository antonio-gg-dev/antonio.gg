import BaseLayout from '@/layouts/BaseLayout/BaseLayout.vue'
import { routeHistoryRouterSymbol } from '@/components/RouteHistory/RouteHistoryInjection'
import '@/styles/index.scss'

/** @type {import('vitepress').Theme} */
const Theme = {
  Layout: BaseLayout,
  enhanceApp({ app, router }) {
    app.provide(routeHistoryRouterSymbol, router)
  },
}

export default Theme
