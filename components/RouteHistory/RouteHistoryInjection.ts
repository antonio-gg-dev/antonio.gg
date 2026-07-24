import type { InjectionKey } from 'vue'
import type { Router } from 'vitepress'

export const routeHistoryRouterSymbol: InjectionKey<Router> = Symbol('route-history-router')
