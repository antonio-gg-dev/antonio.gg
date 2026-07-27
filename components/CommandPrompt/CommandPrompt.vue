<template>
  <form
    class="route-history__terminal-line"
    @submit.prevent="submitCommand"
  >
    <span
      class="route-history__prompt-label"
      aria-hidden="true"
    >
      <span class="route-history__prompt-user">guest@antonio.gg</span>:<span class="route-history__prompt-path">{{
        shellPath
      }}</span
      >$
    </span>
    <span
      class="route-history__prompt-command"
      aria-hidden="true"
    >
      <span class="route-history__prompt-draft">{{ draft }}</span>
      <span class="route-history__prompt-cursor"></span>
    </span>
    <input
      id="route-history-command"
      ref="keyboardBridge"
      class="route-history__keyboard-bridge"
      type="text"
      :value="draft"
      aria-label="Terminal command"
      autocomplete="off"
      autocapitalize="off"
      enterkeyhint="go"
      inputmode="text"
      spellcheck="false"
      tabindex="-1"
      @input="handleKeyboardBridgeInput"
      @keydown="handleKeyboardBridgeKeydown"
    />
  </form>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { formatShellPath, normalizeCommand, type CommandDefinition } from './Command'

export default defineComponent({
  props: {
    commands: {
      required: true,
      type: Array as PropType<CommandDefinition[]>,
    },
    path: {
      required: true,
      type: String,
    },
  },

  emits: {
    execute(command: string): boolean {
      return command.trim() !== ''
    },
    typing(): boolean {
      return true
    },
  },

  data() {
    return {
      active: false,
      draft: '',
      windowKeydownListener: null as ((event: KeyboardEvent) => void) | null,
      windowPointerdownListener: null as ((event: PointerEvent) => void) | null,
    }
  },

  computed: {
    shellPath(): string {
      return formatShellPath(this.path)
    },
  },

  mounted() {
    this.windowKeydownListener = (event: KeyboardEvent) => {
      this.handleWindowKeydown(event)
    }
    this.windowPointerdownListener = (event: PointerEvent) => {
      this.handleWindowPointerdown(event)
    }

    window.addEventListener('keydown', this.windowKeydownListener)
    window.addEventListener('pointerdown', this.windowPointerdownListener)
  },

  beforeUnmount() {
    if (this.windowKeydownListener !== null) {
      window.removeEventListener('keydown', this.windowKeydownListener)
    }

    if (this.windowPointerdownListener !== null) {
      window.removeEventListener('pointerdown', this.windowPointerdownListener)
    }
  },

  methods: {
    blur(): void {
      this.active = false
      this.getKeyboardBridge()?.blur()
    },

    cancelCommand(): void {
      this.active = false
      this.setDraft('')
      this.getKeyboardBridge()?.blur()
    },

    completeCommand(): void {
      const normalizedDraft = normalizeCommand(this.draft)

      if (normalizedDraft === '') {
        return
      }

      const matchingCommands = this.commands.filter((definition) =>
        normalizeCommand(definition.command).startsWith(normalizedDraft),
      )

      if (matchingCommands.length === 1) {
        this.setDraft(matchingCommands[0].command)
        this.requestScroll()
      }
    },

    focus(): void {
      if (window.matchMedia('(pointer: coarse)').matches) {
        this.focusKeyboardBridge()
      }
    },

    focusKeyboardBridge(): void {
      const keyboardBridge = this.getKeyboardBridge()

      if (keyboardBridge === null) {
        return
      }

      keyboardBridge.focus({ preventScroll: true })
      keyboardBridge.setSelectionRange(keyboardBridge.value.length, keyboardBridge.value.length)
    },

    getKeyboardBridge(): HTMLInputElement | null {
      const keyboardBridge = this.$refs.keyboardBridge

      return keyboardBridge instanceof HTMLInputElement ? keyboardBridge : null
    },

    handleKeyboardBridgeInput(event: Event): void {
      if (!(event.target instanceof HTMLInputElement)) {
        return
      }

      this.active = true
      this.draft = event.target.value
      event.target.setSelectionRange(event.target.value.length, event.target.value.length)
      this.requestScroll()
    },

    handleKeyboardBridgeKeydown(event: KeyboardEvent): void {
      if (event.isComposing || hasCommandShortcut(event)) {
        return
      }

      if (event.key === 'Enter' && this.active) {
        event.preventDefault()
        this.submitCommand()

        return
      }

      if (event.key === 'Tab' && this.active) {
        event.preventDefault()
        this.completeCommand()

        return
      }

      if (event.key === 'Escape' && this.active) {
        event.preventDefault()
        this.cancelCommand()
      }
    },

    handleWindowKeydown(event: KeyboardEvent): void {
      if (
        event.target === this.getKeyboardBridge() ||
        event.isComposing ||
        hasCommandShortcut(event) ||
        isEditableTarget(event.target)
      ) {
        return
      }

      if (event.key === 'Enter' && this.active) {
        event.preventDefault()
        this.submitCommand()

        return
      }

      if (event.key === 'Backspace' && this.active) {
        event.preventDefault()
        this.setDraft(removeLastCharacter(this.draft))
        this.requestScroll()

        return
      }

      if (event.key === 'Tab' && this.active) {
        event.preventDefault()
        this.completeCommand()

        return
      }

      if (event.key === 'Escape' && this.active) {
        event.preventDefault()
        this.cancelCommand()

        return
      }

      if (event.key === 'Dead') {
        this.focusKeyboardBridge()

        return
      }

      if (!isPrintableKey(event) || (!this.active && event.key === ' ' && isInteractiveTarget(event.target))) {
        return
      }

      event.preventDefault()
      this.active = true
      this.setDraft(`${this.draft}${event.key}`)
      this.requestScroll()
    },

    handleWindowPointerdown(event: PointerEvent): void {
      if (event.pointerType !== 'touch' || isInteractiveTarget(event.target)) {
        return
      }

      this.focusKeyboardBridge()
    },

    requestScroll(): void {
      this.$emit('typing')
    },

    setDraft(draft: string): void {
      this.draft = draft

      const keyboardBridge = this.getKeyboardBridge()

      if (keyboardBridge !== null) {
        keyboardBridge.value = draft
        keyboardBridge.setSelectionRange(draft.length, draft.length)
      }
    },

    submitCommand(): void {
      if (this.draft.trim() === '') {
        return
      }

      const command = this.draft
      this.active = false
      this.$emit('execute', command)
      this.setDraft('')
    },
  },
})

function hasCommandShortcut(event: KeyboardEvent): boolean {
  const altGraph = event.getModifierState('AltGraph')

  return event.metaKey || (event.ctrlKey && !altGraph) || (event.altKey && !altGraph)
}

function isEditableTarget(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])') !== null
  )
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    target.closest(
      'a, button, input, textarea, select, option, summary, [contenteditable]:not([contenteditable="false"]), [role="button"], [role="link"]',
    ) !== null
  )
}

function isPrintableKey(event: KeyboardEvent): boolean {
  return event.key.length === 1
}

function removeLastCharacter(value: string): string {
  return Array.from(value).slice(0, -1).join('')
}
</script>
