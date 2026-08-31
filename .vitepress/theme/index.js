import BaseLayout from '@/layouts/BaseLayout/BaseLayout.vue'
import ClipboardCopyIcon from '@/components/Icons/ClipboardCopyIcon.vue'
import ExternalLinkIcon from '@/components/Icons/ExternalLinkIcon.vue'
import ScrollableContent from '@/components/Scrollbar/ScrollableContent.vue'
import { routeHistoryRouterSymbol } from '@/components/RouteHistory/RouteHistoryInjection'
import '@/styles/index.scss'

/** @type {import('vitepress').Theme} */
const Theme = {
  Layout: BaseLayout,
  enhanceApp({ app, router }) {
    app.component('ClipboardCopyIcon', ClipboardCopyIcon)
    app.component('ExternalLinkIcon', ExternalLinkIcon)
    app.component('ScrollableContent', ScrollableContent)
    app.provide(routeHistoryRouterSymbol, router)
  },
}

export default Theme
