import type { RouteHistoryItem } from './RouteHistoryItem'

export type RouteHistoryTimelineItem = RouteTimelineItem | CommandTimelineItem | ErrorTimelineItem

interface RouteTimelineItem {
  key: string
  type: 'route'
  entry: RouteHistoryItem
}

interface CommandTimelineItem {
  key: string
  type: 'command'
  command: string
  shellPath: string
}

interface ErrorTimelineItem {
  key: string
  type: 'error'
  message: string
}
