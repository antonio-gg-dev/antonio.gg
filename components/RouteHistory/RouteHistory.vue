<template>
  <div
    ref="container"
    class="route-history__container"
  >
    <RouteHistoryEntry
      v-for="(entry, index) in entries"
      :key="entry.id"
      :entry="entry"
      :current="index === entries.length - 1"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, shallowReactive, shallowRef } from 'vue'
import { dataSymbol, type Router, type VitePressData } from 'vitepress'
import { getNavigationOrigin } from './NavigationOrigin'
import RouteHistoryEntry from './RouteHistoryEntry.vue'
import { routeHistoryRouterSymbol } from './RouteHistoryInjection'
import type { RouteHistoryItem } from './RouteHistoryItem'

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
  components: { RouteHistoryEntry },

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

    return {
      entries: shallowReactive<RouteHistoryItem[]>([createEntry(router.route.path, router.route.component, data, 0)]),
      nextEntryId: 1,
      previousAfterRouteChange: undefined as Router['onAfterRouteChange'],
      documentClickListener: null as ((event: MouseEvent) => void) | null,
    }
  },

  computed: {
    vitePressData(): VitePressData {
      return this.routeHistoryData as VitePressData
    },

    vitePressRouter(): Router {
      return this.routeHistoryRouter as Router
    },
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
  },

  methods: {
    async appendCurrentRoute(to: string): Promise<void> {
      const previousEntry = this.entries.at(-1)

      if (previousEntry !== undefined) {
        archiveEntry(this.getContainer(), previousEntry)
      }

      const entry = createEntry(to, this.vitePressRouter.route.component, this.vitePressData, this.nextEntryId++)
      this.entries.push(entry)

      await this.$nextTick()
      scrollToEntry(this.getContainer(), entry)
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
.route-history {
  &__entry {
    @media print {
      &:not(&--current) {
        @apply hidden;
      }
    }
  }
}
</style>
