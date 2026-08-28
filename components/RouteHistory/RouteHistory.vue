<template>
  <div
    ref="container"
    class="route-history__container"
    @route-history-command="handleRouteHistoryCommand"
  >
    <template
      v-for="item in timeline"
      :key="item.key"
    >
      <RouteHistoryEntry
        v-if="item.type === 'route'"
        :entry="item.entry"
        :current="item.entry.id === currentEntryId"
      />
      <div
        v-else-if="item.type === 'command'"
        class="route-history__terminal-line"
      >
        <span class="route-history__prompt-label">
          <span class="route-history__prompt-user">guest@antonio.gg</span>:<span class="route-history__prompt-path">{{
            item.shellPath
          }}</span
          >$
        </span>
        <span class="route-history__terminal-command">{{ item.command }}</span>
      </div>
      <div
        v-else-if="item.type === 'hint'"
        class="route-history__terminal-line route-history__terminal-hint"
        role="note"
      >
        Escribe
        <a
          class="route-history__terminal-hint-link"
          href="/help"
          ><code>help</code></a
        >
        para ver los comandos disponibles.
      </div>
      <div
        v-else
        class="route-history__terminal-line route-history__terminal-error"
        role="status"
      >
        {{ item.message }}
      </div>
    </template>
    <CommandPrompt
      v-if="promptVisible"
      ref="commandPrompt"
      :commands="commands"
      :path="currentPath"
      @execute="executeCommand"
      @typing="handleCommandTyping"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, shallowReactive, shallowRef } from 'vue'
import { dataSymbol, type Router, type VitePressData } from 'vitepress'
import {
  commandNotFoundMessage,
  formatShellPath,
  normalizeCommand,
  type CommandDefinition,
} from '@/components/CommandPrompt/Command'
import CommandPrompt from '@/components/CommandPrompt/CommandPrompt.vue'
import { data as commands } from '@/pages/commands.data'
import { getNavigationOrigin } from './NavigationOrigin'
import RouteHistoryEntry from './RouteHistoryEntry.vue'
import { routeHistoryRouterSymbol } from './RouteHistoryInjection'
import type { RouteHistoryItem } from './RouteHistoryItem'
import type { RouteHistoryTimelineItem } from './RouteHistoryTimelineItem'

const idReferenceAttributes = [
  'aria-controls',
  'aria-describedby',
  'aria-labelledby',
  'for',
  'form',
  'headers',
  'list',
]

export default defineComponent({
  components: {
    CommandPrompt,
    RouteHistoryEntry,
  },

  inject: {
    routeHistoryData: {
      from: dataSymbol,
    },
    routeHistoryRouter: {
      from: routeHistoryRouterSymbol,
    },
  },

  data() {
    const data = this.routeHistoryData as VitePressData
    const router = this.routeHistoryRouter as Router
    const initialEntry = createEntry(router.route.path, router.route.component, data, 0)

    return {
      commands: commands as CommandDefinition[],
      entries: shallowReactive<RouteHistoryItem[]>([initialEntry]),
      nextEntryId: 1,
      nextTimelineId: 1,
      promptVisible: data.frontmatter.value.route_history_prompt !== false,
      previousAfterRouteChange: undefined as Router['onAfterRouteChange'],
      documentClickListener: null as ((event: MouseEvent) => void) | null,
      routeHistoryListener: null as ((event: Event) => void) | null,
      timeline: shallowReactive<RouteHistoryTimelineItem[]>([
        {
          key: `route-${initialEntry.id}`,
          type: 'route',
          entry: initialEntry,
        },
        {
          key: 'hint-help',
          type: 'hint',
        },
      ]),
    }
  },

  computed: {
    currentEntryId(): number {
      return this.entries.at(-1)?.id ?? 0
    },

    currentPath(): string {
      return this.entries.at(-1)?.path ?? this.vitePressRouter.route.path
    },

    vitePressData(): VitePressData {
      return this.routeHistoryData as VitePressData
    },

    vitePressRouter(): Router {
      return this.routeHistoryRouter as Router
    },
  },

  created() {
    if (typeof window !== 'undefined') {
      this.routeHistoryListener = (event: Event) => {
        this.handleRouteHistoryEvent(event)
      }
      window.addEventListener('route-history', this.routeHistoryListener)
    }
  },

  mounted() {
    const initialEntry = this.entries[0]
    initialEntry.path = `${window.location.pathname}${window.location.search}`
    initialEntry.hash = window.location.hash
    initialEntry.data.hash.value = window.location.hash

    this.previousAfterRouteChange = this.vitePressRouter.onAfterRouteChange
    this.vitePressRouter.onAfterRouteChange = async (to: string) => {
      await this.previousAfterRouteChange?.(to)
      await this.appendCurrentRoute(to)
    }

    this.documentClickListener = (event: MouseEvent) => {
      this.handleDocumentClick(event)
    }
    window.addEventListener('click', this.documentClickListener)

    this.$watch(
      () => this.vitePressData.hash.value,
      (hash) => {
        this.updateCurrentHash(hash)
      },
    )

    this.$watch(
      () => this.vitePressRouter.route.data,
      async () => {
        await this.updateCurrentDataSnapshot()
      },
    )
  },

  beforeUnmount() {
    this.vitePressRouter.onAfterRouteChange = this.previousAfterRouteChange

    if (this.documentClickListener !== null) {
      window.removeEventListener('click', this.documentClickListener)
    }
    if (this.routeHistoryListener !== null) {
      window.removeEventListener('route-history', this.routeHistoryListener)
    }
  },

  methods: {
    async appendCurrentRoute(to: string): Promise<void> {
      const previousEntry = this.entries.at(-1)

      if (previousEntry !== undefined) {
        archiveEntry(this.getContainer(), previousEntry)
      }

      const entry = createEntry(to, this.vitePressRouter.route.component, this.vitePressData, this.nextEntryId++)
      this.entries.push(entry)
      this.timeline.push({
        key: `route-${entry.id}`,
        type: 'route',
        entry,
      })

      await this.$nextTick()
      scrollToEntry(this.getContainer(), entry)
    },

    executeCommand(rawCommand: string): void {
      const command = rawCommand.trim()
      const definition = this.commands.find(
        (registeredCommand) => normalizeCommand(registeredCommand.command) === normalizeCommand(command),
      )

      this.timeline.push({
        key: `terminal-${this.nextTimelineId++}`,
        type: 'command',
        command: rawCommand,
        shellPath: formatShellPath(this.currentPath),
      })

      if (definition === undefined) {
        this.timeline.push({
          key: `terminal-${this.nextTimelineId++}`,
          type: 'error',
          message: commandNotFoundMessage,
        })

        void this.$nextTick(() => {
          this.focusCommandPrompt()
          this.scrollToCommandPrompt()
        })

        return
      }

      if (definition.type === 'clear') {
        this.clearHistory()

        return
      }

      this.blurCommandPrompt()
      this.vitePressRouter.go(definition.url).catch((error: unknown) => {
        console.error(error)
      })
    },

    clearHistory(preserveCurrentRoute = false): void {
      const currentEntry = this.entries.at(-1)

      this.timeline.splice(0)

      if (preserveCurrentRoute && currentEntry !== undefined) {
        this.entries.splice(0, this.entries.length, currentEntry)
        this.timeline.push({
          key: `route-${currentEntry.id}`,
          type: 'route',
          entry: currentEntry,
        })
      } else if (currentEntry !== undefined) {
        this.entries.splice(0, this.entries.length, currentEntry)
      }

      void this.$nextTick(() => {
        this.focusCommandPrompt()
        this.scrollToCommandPrompt()
      })
    },

    blurCommandPrompt(): void {
      const commandPrompt = this.$refs.commandPrompt as { blur?: () => void } | undefined
      commandPrompt?.blur?.()
    },

    focusCommandPrompt(): void {
      const commandPrompt = this.$refs.commandPrompt as { focus?: () => void } | undefined
      commandPrompt?.focus?.()
    },

    handleDocumentClick(event: MouseEvent): void {
      if (
        event.button !== 0 ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.metaKey ||
        !(event.target instanceof Element)
      ) {
        return
      }

      const link = event.target.closest<HTMLAnchorElement>('a')

      if (link === null) {
        return
      }

      const archivedEntryId = link.dataset.routeHistoryEntry
      const archivedAnchor = link.dataset.routeHistoryAnchor

      if (
        archivedEntryId !== undefined &&
        archivedEntryId !== '' &&
        archivedAnchor !== undefined &&
        archivedAnchor !== ''
      ) {
        event.preventDefault()
        scrollToArchivedAnchor(this.getContainer(), archivedEntryId, archivedAnchor)

        return
      }

      if (link.hasAttribute('download') || link.hasAttribute('target')) {
        return
      }

      const href = link.getAttribute('href')

      if (href === null || href === '') {
        return
      }

      const targetUrl = new URL(href, link.baseURI)
      const navigationOrigin = getNavigationOrigin(event)

      if (navigationOrigin === null) {
        return
      }

      const originUrl = new URL(navigationOrigin)

      if (
        targetUrl.origin !== originUrl.origin ||
        targetUrl.pathname !== originUrl.pathname ||
        targetUrl.search !== originUrl.search ||
        targetUrl.hash !== ''
      ) {
        return
      }

      event.preventDefault()
      this.vitePressRouter.go(`${targetUrl.pathname}${targetUrl.search}`).catch((error: unknown) => {
        console.error(error)
      })
    },

    handleRouteHistoryCommand(event: Event): void {
      if (event instanceof CustomEvent && typeof event.detail === 'string') {
        this.executeCommand(event.detail)
      }
    },

    handleCommandTyping(): void {
      void this.$nextTick(() => {
        this.scrollToCommandPrompt()
      })
    },

    handleRouteHistoryEvent(event: Event): void {
      if (!(event instanceof CustomEvent) || typeof event.detail !== 'object' || event.detail === null) {
        return
      }

      const detail = event.detail as { action?: string; preserveCurrentRoute?: boolean; visible?: boolean }

      if (detail.action === 'clear') {
        this.clearHistory(detail.preserveCurrentRoute === true)
      } else if (detail.action === 'set-prompt-visible' && typeof detail.visible === 'boolean') {
        this.promptVisible = detail.visible
      } else if (detail.action === 'scroll-to-bottom') {
        void this.$nextTick(() => {
          this.scrollToBottom()
        })
      }
    },

    updateCurrentHash(hash: string): void {
      const currentEntry = this.entries.at(-1)

      if (currentEntry !== undefined) {
        currentEntry.hash = hash
        currentEntry.data.hash.value = hash
      }
    },

    async updateCurrentDataSnapshot(): Promise<void> {
      await this.$nextTick()

      const currentEntry = this.entries.at(-1)

      if (
        currentEntry !== undefined &&
        new URL(currentEntry.path, 'http://antonio.gg').pathname === this.vitePressRouter.route.path
      ) {
        updateDataSnapshot(currentEntry.data, this.vitePressData)
      }
    },

    getContainer(): HTMLElement | null {
      const container = this.$refs.container

      return container instanceof HTMLElement ? container : null
    },

    scrollToCommandPrompt(): void {
      const commandPrompt = this.$refs.commandPrompt as { $el?: unknown } | undefined

      if (commandPrompt?.$el instanceof HTMLElement) {
        scrollToElement(commandPrompt.$el)
      }
    },

    scrollToBottom(): void {
      const scrollContainer = document.querySelector<HTMLElement>('.layout__surface')

      if (scrollContainer === null) {
        window.scrollTo(0, document.documentElement.scrollHeight)

        return
      }

      scrollContainer.scrollTop = scrollContainer.scrollHeight
    },
  },
})

function createEntry(
  to: string,
  component: RouteHistoryItem['component'],
  data: VitePressData,
  id: number,
): RouteHistoryItem {
  const url = new URL(to, 'http://antonio.gg')

  return {
    id,
    path: `${url.pathname}${url.search}`,
    hash: url.hash,
    component,
    data: createDataSnapshot(data, url.hash),
  }
}

function createDataSnapshot(data: VitePressData, hash: string): VitePressData {
  return {
    site: shallowRef(data.site.value),
    theme: shallowRef(data.theme.value),
    page: shallowRef(data.page.value),
    frontmatter: shallowRef(data.frontmatter.value),
    params: shallowRef(data.params.value),
    title: ref(data.title.value),
    description: ref(data.description.value),
    lang: ref(data.lang.value),
    dir: ref(data.dir.value),
    localeIndex: ref(data.localeIndex.value),
    isDark: data.isDark,
    hash: ref(hash),
  }
}

function updateDataSnapshot(snapshot: VitePressData, data: VitePressData): void {
  snapshot.site.value = data.site.value
  snapshot.theme.value = data.theme.value
  snapshot.page.value = data.page.value
  snapshot.frontmatter.value = data.frontmatter.value
  snapshot.params.value = data.params.value
  snapshot.title.value = data.title.value
  snapshot.description.value = data.description.value
  snapshot.lang.value = data.lang.value
  snapshot.dir.value = data.dir.value
  snapshot.localeIndex.value = data.localeIndex.value
}

function archiveEntry(container: HTMLElement | null, entry: RouteHistoryItem): void {
  const entryElement = findEntryElement(container, entry.id)

  if (entryElement === null) {
    return
  }

  const idPrefix = createIdPrefix(entry.id)
  const ids = new Set(Array.from(entryElement.querySelectorAll<HTMLElement>('[id]')).map((element) => element.id))

  entryElement.querySelectorAll<HTMLElement>('[id]').forEach((element) => {
    element.id = `${idPrefix}${element.id}`
  })

  idReferenceAttributes.forEach((attribute) => {
    entryElement.querySelectorAll<HTMLElement>(`[${attribute}]`).forEach((element) => {
      const references = element.getAttribute(attribute)?.split(/\s+/) ?? []
      const namespacedReferences = references.map((reference) =>
        ids.has(reference) ? `${idPrefix}${reference}` : reference,
      )

      element.setAttribute(attribute, namespacedReferences.join(' '))
    })
  })

  entryElement.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    const anchor = link.getAttribute('href')?.slice(1)

    if (anchor === undefined || anchor === '') {
      return
    }

    link.dataset.routeHistoryEntry = entry.id.toString()
    link.dataset.routeHistoryAnchor = anchor
    link.href = `${entry.path}#${anchor}`
    link.target = '_self'
  })
}

function scrollToEntry(container: HTMLElement | null, entry: RouteHistoryItem): void {
  const entryElement = findEntryElement(container, entry.id)

  if (entryElement === null) {
    return
  }

  const decodedHash = decodeHash(entry.hash)
  const hashTarget =
    decodedHash !== ''
      ? Array.from(entryElement.querySelectorAll<HTMLElement>('[id]')).find((element) => element.id === decodedHash)
      : null

  scrollToElement(hashTarget ?? entryElement)
}

function scrollToArchivedAnchor(container: HTMLElement | null, entryId: string, anchor: string): void {
  const entryElement = container?.querySelector<HTMLElement>(`[data-route-history-id="${entryId}"]`)
  const targetId = `${createIdPrefix(Number(entryId))}${decodeHash(`#${anchor}`)}`
  const target = Array.from(entryElement?.querySelectorAll<HTMLElement>('[id]') ?? []).find(
    (element) => element.id === targetId,
  )

  if (target !== undefined) {
    scrollToElement(target)
  }
}

function scrollToElement(element: HTMLElement): void {
  const scrollContainer = document.querySelector<HTMLElement>('.layout__surface')

  if (scrollContainer === null) {
    const top = window.scrollY + element.getBoundingClientRect().top
    window.scrollTo(0, top)

    return
  }

  const top =
    scrollContainer.scrollTop + element.getBoundingClientRect().top - scrollContainer.getBoundingClientRect().top

  scrollContainer.scrollTo(0, top)
}

function findEntryElement(container: HTMLElement | null, entryId: number): HTMLElement | null {
  return container?.querySelector<HTMLElement>(`[data-route-history-id="${entryId}"]`) ?? null
}

function createIdPrefix(entryId: number): string {
  return `route-history-${entryId}--`
}

function decodeHash(hash: string): string {
  if (hash === '') {
    return ''
  }

  try {
    return decodeURIComponent(hash.slice(1))
  } catch {
    return hash.slice(1)
  }
}
</script>

<style lang="scss">
@use '@/styles/mixins/crt';

.route-history {
  &__terminal-line {
    @apply my-8 break-words;

    @media print {
      @apply hidden;
    }
  }

  &__terminal-command {
    @apply whitespace-pre-wrap;
  }

  &__terminal-hint {
    @apply text-info;
  }

  &__terminal-hint-link {
    @apply text-foreground;

    &:focus,
    &:hover {
      @apply text-primary-emphasis;
    }
  }

  &__terminal-error {
    @apply text-danger-emphasis;
  }

  &__prompt-label {
    @apply shrink-0;
  }

  &__prompt-user {
    @apply text-success-emphasis;
  }

  &__prompt-path {
    @apply text-primary-emphasis;
  }

  &__prompt-command {
    @apply text-foreground;
  }

  &__prompt-draft {
    @apply whitespace-pre-wrap;
  }

  &__prompt-cursor {
    @include crt.shadow(theme('colors.foreground'));
    @apply inline-block h-4 w-2.5 bg-foreground;
    transform: translateY(0.1em);
    animation: route-history-cursor-blink 1s steps(1, end) infinite;

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }

    html[data-effect-flicker='true'] & {
      animation:
        route-history-cursor-blink 1s steps(1, end) infinite,
        crt-shadow-glow 4s linear infinite;
    }
  }

  &__keyboard-bridge {
    @apply pointer-events-none fixed bottom-0 right-0 h-px w-px opacity-0;
  }

  &__entry {
    @media print {
      &:not(&--current) {
        @apply hidden;
      }
    }
  }
}

@keyframes route-history-cursor-blink {
  0%,
  49% {
    opacity: 1;
  }

  50%,
  100% {
    opacity: 0;
  }
}
</style>
