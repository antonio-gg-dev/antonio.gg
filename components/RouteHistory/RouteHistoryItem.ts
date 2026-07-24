import type { Component } from 'vue'
import type { VitePressData } from 'vitepress'

export interface RouteHistoryItem {
  id: number
  path: string
  hash: string
  component: Component | null
  data: VitePressData
}
