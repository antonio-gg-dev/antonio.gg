import type { RouteHistoryItem } from '@/components/RouteHistory/RouteHistoryItem'

export type RouteHistoryTimelineItem = RouteTimelineItem | CommandTimelineItem | HintTimelineItem | ErrorTimelineItem

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

interface HintTimelineItem {
  key: string
  type: 'hint'
}

interface ErrorTimelineItem {
  key: string
  type: 'error'
  message: string
}
