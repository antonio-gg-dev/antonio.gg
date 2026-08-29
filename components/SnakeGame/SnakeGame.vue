<template>
  <section
    class="snake__container"
    aria-label="Snake game"
    lang="en-us"
    @contextmenu.prevent
  >
    <div
      class="snake__screen"
      :style="{ '--score-height': `${scoreHeight}px` }"
      @pointerdown.prevent="handleScreenPointerdown"
      @pointermove.prevent="handleScreenPointermove"
      @pointerup="handleScreenPointerup"
      @pointercancel="handleScreenPointercancel"
    >
      <p
        ref="scoreElement"
        class="snake__score"
      >
        <span class="snake__score-current">
          <span
            class="snake__score-combo"
            :class="comboFood !== undefined ? `snake__score-combo--${comboFood}` : undefined"
            aria-hidden="true"
          ></span
          >&nbsp;
          <span class="snake__score-label snake__score-label--short">S</span>
          <span class="snake__score-label snake__score-label--long">Score</span>:
          {{ score.toLocaleString('en-US') }}
        </span>
        <span>
          <span class="snake__score-label snake__score-label--short">HS</span>
          <span class="snake__score-label snake__score-label--long">High Score</span>:
          {{ highScore.toLocaleString('en-US') }}
        </span>
      </p>

      <div
        v-if="phase === Phase.Title"
        class="snake__title"
      >
        <h2>Snake</h2>
        <p class="snake__instructions snake__instructions--keyboard">
          Press <strong>any</strong> key to start<br />
          Press <strong>Space</strong> to pause<br />
          Press <strong>Esc</strong> to exit
        </p>
        <p class="snake__instructions snake__instructions--touch">
          Press <strong>any</strong> button to start<br />
          Press&nbsp;<PauseIcon aria-hidden="true" />&nbsp;to pause<br />
          Press&nbsp;<CloseIcon aria-hidden="true" />&nbsp;to exit
        </p>
      </div>

      <template v-else>
        <div class="snake__board">
          <div
            v-for="cell in cells"
            :key="cell.key"
            class="snake__cell"
            :class="cell.className"
          ></div>
          <span
            v-if="scoreFeedback !== undefined"
            class="snake__score-feedback"
            :class="`snake__score-feedback--${scoreFeedback.type}`"
            :style="{
              left: `${(scoreFeedback.x + 0.5) * 5}%`,
              top: `${(scoreFeedback.y + 0.5) * 5}%`,
            }"
          >
            +{{ scoreFeedback.points.toLocaleString('en-US') }}
          </span>
          <div
            v-if="phase === Phase.Paused"
            class="snake__overlay"
          >
            <h2 class="snake__overlay-title snake__overlay-title--paused">Pause</h2>
            <p class="snake__instructions snake__instructions--keyboard">Press <strong>any</strong> key to resume</p>
            <p class="snake__instructions snake__instructions--touch">Press <strong>any</strong> button to resume</p>
          </div>
          <div
            v-else-if="phase === Phase.GameOver"
            class="snake__overlay"
          >
            <h2
              class="snake__overlay-title snake__overlay-title--game-over"
              :class="{ 'snake__overlay-title--high-score': score >= highScore }"
            >
              Game Over
            </h2>
            <p
              v-if="score >= highScore"
              class="snake__high-score"
            >
              New High Score: {{ score.toLocaleString('en-US') }}
            </p>
            <p class="snake__instructions snake__instructions--keyboard">
              Press <strong>any</strong> key to return to main menu
            </p>
            <p class="snake__instructions snake__instructions--touch">
              Press <strong>any</strong> button to return to main menu
            </p>
          </div>
        </div>
      </template>
    </div>

    <div class="snake__controls">
      <button
        class="snake__control snake__control--up"
        :disabled="!active"
        type="button"
        aria-label="Move up"
        @pointerdown.prevent="startDirection(Direction.Up)"
        @pointerup="stopDirection(Direction.Up)"
        @pointercancel="stopDirection(Direction.Up)"
        @pointerleave="stopDirection(Direction.Up)"
      >
        <ArrowUpIcon aria-hidden="true" />
      </button>
      <button
        class="snake__control snake__control--left"
        :disabled="!active"
        type="button"
        aria-label="Move left"
        @pointerdown.prevent="startDirection(Direction.Left)"
        @pointerup="stopDirection(Direction.Left)"
        @pointercancel="stopDirection(Direction.Left)"
        @pointerleave="stopDirection(Direction.Left)"
      >
        <ArrowLeftIcon aria-hidden="true" />
      </button>
      <button
        class="snake__control snake__control--down"
        :disabled="!active"
        type="button"
        aria-label="Move down"
        @pointerdown.prevent="startDirection(Direction.Down)"
        @pointerup="stopDirection(Direction.Down)"
        @pointercancel="stopDirection(Direction.Down)"
        @pointerleave="stopDirection(Direction.Down)"
      >
        <ArrowDownIcon aria-hidden="true" />
      </button>
      <button
        class="snake__control snake__control--right"
        :disabled="!active"
        type="button"
        aria-label="Move right"
        @pointerdown.prevent="startDirection(Direction.Right)"
        @pointerup="stopDirection(Direction.Right)"
        @pointercancel="stopDirection(Direction.Right)"
        @pointerleave="stopDirection(Direction.Right)"
      >
        <ArrowRightIcon aria-hidden="true" />
      </button>
      <button
        class="snake__control snake__control--pause"
        :class="{ 'snake__control--hidden': phase !== Phase.Playing && phase !== Phase.Paused }"
        type="button"
        :aria-label="phase === Phase.Paused ? 'Resume game' : 'Pause game'"
        :disabled="!active || (phase !== Phase.Playing && phase !== Phase.Paused)"
        @click="$emit('pause')"
      >
        <PausedIcon
          v-if="phase === Phase.Paused"
          aria-hidden="true"
        />
        <PauseIcon
          v-else
          aria-hidden="true"
        />
      </button>
      <button
        class="snake__control snake__control--exit"
        :class="{ 'snake__control--hidden': phase !== Phase.Title }"
        type="button"
        aria-label="Exit game"
        :disabled="!active || phase !== Phase.Title"
        @click="$emit('exit')"
      >
        <CloseIcon aria-hidden="true" />
      </button>
      <button
        class="snake__control snake__control--menu"
        :class="{ 'snake__control--hidden': phase !== Phase.GameOver }"
        type="button"
        aria-label="Open menu"
        :disabled="!active || phase !== Phase.GameOver"
        @click="$emit('menu')"
      >
        <MenuIcon aria-hidden="true" />
      </button>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import CloseIcon from '@/components/Icons/CloseIcon.vue'
import MenuIcon from '@/components/Icons/MenuIcon.vue'
import PauseIcon from '@/components/Icons/PauseIcon.vue'
import PausedIcon from '@/components/Icons/PausedIcon.vue'
import ArrowDownIcon from '@/components/Icons/ArrowDownIcon.vue'
import ArrowLeftIcon from '@/components/Icons/ArrowLeftIcon.vue'
import ArrowRightIcon from '@/components/Icons/ArrowRightIcon.vue'
import ArrowUpIcon from '@/components/Icons/ArrowUpIcon.vue'
import { boardSize, Direction, Phase, type Cell, type FoodCell, type FoodType, type ScoreFeedback } from './snakeGame'

export default defineComponent({
  name: 'SnakeGame',

  components: {
    ArrowDownIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    ArrowUpIcon,
    CloseIcon,
    MenuIcon,
    PauseIcon,
    PausedIcon,
  },

  props: {
    active: {
      default: true,
      type: Boolean,
    },
    phase: {
      required: true,
      type: String as PropType<Phase>,
    },
    snake: {
      required: true,
      type: Array as PropType<Cell[]>,
    },
    direction: {
      required: true,
      type: String as PropType<Direction>,
    },
    comboFood: {
      default: undefined,
      type: String as PropType<FoodType | undefined>,
    },
    food: {
      required: true,
      type: Array as PropType<FoodCell[]>,
    },
    score: {
      required: true,
      type: Number,
    },
    highScore: {
      required: true,
      type: Number,
    },
    scoreFeedback: {
      default: undefined,
      type: Object as PropType<ScoreFeedback | undefined>,
    },
  },

  emits: [
    'direction-start',
    'direction-end',
    'pause',
    'menu',
    'exit',
  ],

  data() {
    return {
      Direction,
      Phase,
      scoreHeight: 0,
      scoreObserver: null as ResizeObserver | null,
      touchStartX: 0,
      touchStartY: 0,
      touchDirection: undefined as Direction | undefined,
      touchPointerId: undefined as number | undefined,
      touchStartedInPlaying: false,
    }
  },

  computed: {
    cells(): Array<{ key: number; className: string; isHead: boolean }> {
      return Array.from({ length: boardSize * boardSize }, (_, index) => {
        const cell = { x: index % boardSize, y: Math.floor(index / boardSize) }
        const isSnake = this.snake.some((snakeCell) => sameCell(snakeCell, cell))
        const isHead = this.snake[0] !== undefined && sameCell(this.snake[0], cell)
        const food = this.food.find((foodCell) => sameCell(foodCell, cell))

        return {
          key: index,
          className: isSnake ? 'snake__snake' : food !== undefined ? `snake__food snake__food--${food.type}` : '',
          isHead,
        }
      })
    },
  },

  mounted() {
    this.scoreObserver = new ResizeObserver(() => {
      this.updateScoreHeight()
    })
    this.updateScoreHeight()

    const scoreElement = this.$refs.scoreElement
    if (scoreElement instanceof HTMLElement) {
      this.scoreObserver.observe(scoreElement)
    }
  },

  beforeUnmount() {
    this.scoreObserver?.disconnect()
  },

  methods: {
    startDirection(direction: Direction): void {
      if (!this.active) {
        return
      }

      this.$emit('direction-start', direction)
    },

    stopDirection(direction: Direction): void {
      if (!this.active) {
        return
      }

      this.$emit('direction-end', direction)
    },

    updateScoreHeight(): void {
      const scoreElement = this.$refs.scoreElement
      if (scoreElement instanceof HTMLElement) {
        this.scoreHeight = scoreElement.offsetHeight
      }
    },

    handleScreenPointerdown(event: PointerEvent): void {
      if (!this.active || event.pointerType !== 'touch') {
        return
      }

      this.touchStartX = event.clientX
      this.touchStartY = event.clientY
      this.touchPointerId = event.pointerId
      this.touchStartedInPlaying = this.phase === Phase.Playing

      if (this.touchStartedInPlaying) {
        this.touchDirection = this.direction
        this.$emit('direction-start', this.direction)
      } else {
        this.touchDirection = undefined
        this.$emit('direction-start', this.direction)
      }

      const board = event.currentTarget
      if (board instanceof HTMLElement) {
        board.setPointerCapture(event.pointerId)
      }
    },

    handleScreenPointermove(event: PointerEvent): void {
      if (
        event.pointerType !== 'touch' ||
        this.touchPointerId !== event.pointerId ||
        !this.touchStartedInPlaying ||
        this.touchDirection === undefined
      ) {
        return
      }

      const deltaX = event.clientX - this.touchStartX
      const deltaY = event.clientY - this.touchStartY
      const swipeThreshold = 24

      if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < swipeThreshold || Math.abs(deltaX) === Math.abs(deltaY)) {
        return
      }

      const direction =
        Math.abs(deltaX) > Math.abs(deltaY)
          ? deltaX > 0
            ? Direction.Right
            : Direction.Left
          : deltaY > 0
            ? Direction.Down
            : Direction.Up

      if (direction === this.touchDirection) {
        return
      }

      this.$emit('direction-end', this.touchDirection)
      this.$emit('direction-start', direction)
      this.touchDirection = direction
    },

    handleScreenPointerup(event: PointerEvent): void {
      this.finishScreenPointer(event)
    },

    handleScreenPointercancel(event: PointerEvent): void {
      this.finishScreenPointer(event)
    },

    finishScreenPointer(event: PointerEvent): void {
      if (event.pointerType !== 'touch' || this.touchPointerId !== event.pointerId) {
        return
      }

      if (this.touchDirection !== undefined) {
        this.$emit('direction-end', this.touchDirection)
      }

      const screen = event.currentTarget
      if (screen instanceof HTMLElement && screen.hasPointerCapture(event.pointerId)) {
        screen.releasePointerCapture(event.pointerId)
      }

      this.touchDirection = undefined
      this.touchPointerId = undefined
      this.touchStartedInPlaying = false
    },
  },
})

function sameCell(first: Cell, second: Cell): boolean {
  return first.x === second.x && first.y === second.y
}
</script>

<style lang="scss">
@use '@/styles/mixins/crt';

.snake {
  &__container {
    @apply flex h-dvh w-full flex-col content-center items-center justify-center gap-2 overflow-hidden py-2;

    @media (pointer: coarse) {
      @apply justify-between;
    }

    @media (orientation: landscape) {
      @apply flex-row;
    }

    @screen md {
      @apply py-4;
    }

    @screen xl {
      @apply py-8;
    }
  }

  &__screen {
    @apply w-full border-2 border-neutral;
    @include crt.shadow(theme('colors.neutral.DEFAULT'));
    touch-action: none;

    @media (orientation: landscape) {
      @apply flex h-full w-fit flex-col;
    }
  }

  &__title,
  &__board {
    @include crt.shadow(theme('colors.neutral.DEFAULT'));

    @media (orientation: landscape) {
      @apply h-auto min-h-0 w-auto;
      height: calc(100% - var(--score-height));
    }
  }

  &__title {
    @apply flex aspect-square w-full flex-col items-center justify-center gap-2 p-2;
  }

  &__title h2 {
    @apply m-0 text-3xl text-success;
  }

  &__instructions {
    @apply m-0 text-center text-foreground;
  }

  &__instructions svg {
    @apply mb-0.5 inline-block h-4;
  }

  &__high-score {
    @apply m-0 text-lg font-bold text-foreground;
  }

  &__instructions--touch {
    @apply hidden;

    @media (pointer: coarse) {
      @apply block;
    }
  }

  &__instructions--keyboard {
    @media (pointer: coarse) {
      @apply hidden;
    }
  }

  &__score {
    @apply m-0 flex shrink-0 justify-between whitespace-nowrap bg-neutral pb-2;
  }

  &__score-current {
    @apply inline-flex items-center gap-1;
  }

  &__score-combo {
    @apply inline-block h-4 w-4 bg-background;
    @include crt.shadow(theme('colors.neutral.DEFAULT'));

    &--lemon {
      @apply bg-warning;
      @include crt.shadow(theme('colors.warning.DEFAULT'));

      [data-theme='p1-phosphor'] & {
        background: repeating-linear-gradient(
          to right,
          var(--color-warning) 0 20%,
          var(--color-warning-emphasis) 20% 40%
        );
      }
    }

    &--tomato {
      @apply bg-danger;
      @include crt.shadow(theme('colors.danger.DEFAULT'));

      [data-theme='p1-phosphor'] & {
        background: repeating-linear-gradient(
          to bottom,
          var(--color-danger-emphasis) 0 20%,
          var(--color-danger) 20% 40%
        );
      }
    }

    &--apple {
      @apply bg-success;
      @include crt.shadow(theme('colors.success.DEFAULT'));
    }

    &--strawberry {
      @apply bg-foreground;
      @include crt.shadow(theme('colors.foreground'));

      [data-theme='p1-phosphor'] & {
        @apply bg-success-emphasis;
      }
    }
  }

  &__score-label--long {
    @apply hidden;

    @screen sm {
      @apply inline;
    }
  }

  &__score-label--short {
    @screen sm {
      @apply hidden;
    }
  }

  &__score-feedback {
    @apply pointer-events-none absolute z-snake-score-feedback -translate-x-1/2 -translate-y-1/2 whitespace-nowrap;

    &--lemon {
      @apply text-warning;
    }

    &--tomato {
      @apply text-danger;
    }

    &--apple {
      @apply text-success;
    }

    &--strawberry {
      @apply text-foreground;
    }
  }

  &__board {
    @apply relative grid aspect-square w-full;
    grid-template-columns: repeat(20, minmax(0, 1fr));
  }

  &__cell {
    @apply aspect-square;
  }

  &__snake {
    @apply bg-accent;
    @include crt.shadow-no-aberration(theme('colors.accent.DEFAULT'));

    [data-theme='p1-phosphor'] & {
      @apply bg-foreground;
      @include crt.shadow-no-aberration(theme('colors.foreground'));
    }
  }

  &__food {
    @apply m-[10%];

    &--lemon {
      @apply bg-warning;
      @include crt.shadow(theme('colors.warning.DEFAULT'));

      [data-theme='p1-phosphor'] & {
        background: repeating-linear-gradient(
          to right,
          var(--color-warning) 0 20%,
          var(--color-warning-emphasis) 20% 40%
        );
      }
    }

    &--tomato {
      @apply bg-danger;
      @include crt.shadow(theme('colors.danger.DEFAULT'));

      [data-theme='p1-phosphor'] & {
        background: repeating-linear-gradient(
          to bottom,
          var(--color-danger-emphasis) 0 20%,
          var(--color-danger) 20% 40%
        );
      }
    }

    &--apple {
      @apply bg-success;
      @include crt.shadow(theme('colors.success.DEFAULT'));
    }

    &--strawberry {
      @apply bg-foreground;
      @include crt.shadow(theme('colors.foreground'));
      animation: snake-strawberry-blink 0.4s steps(1, end) infinite;

      [data-theme='p1-phosphor'] & {
        @apply bg-success-emphasis;
      }

      @keyframes snake-strawberry-blink {
        50% {
          @apply opacity-50;
        }
      }
    }
  }

  &__overlay {
    @apply absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/90;
  }

  &__overlay-title {
    @apply m-0 text-3xl;

    &--paused {
      @apply text-primary;
    }

    &--game-over {
      @apply text-danger;
    }

    &--high-score {
      @apply text-success;
    }
  }

  &__controls {
    @apply hidden h-fit w-full grid-cols-5 gap-2;
    grid-template-areas:
      'pause  .     up    .      .'
      '.      left  down  right  .';

    @media (pointer: coarse) {
      @apply grid;
    }

    @media (orientation: landscape) {
      @apply grid-cols-3;
      grid-template-areas:
        'pause  up    .'
        'left   down  right';
    }
  }

  &__control {
    @apply flex aspect-square w-full items-center justify-center border border-neutral bg-neutral p-3 text-foreground;

    &--up {
      grid-area: up;
    }

    &--left {
      grid-area: left;
    }

    &--down {
      grid-area: down;
    }

    &--right {
      grid-area: right;
    }

    &--pause,
    &--exit,
    &--menu {
      grid-area: pause;
    }

    &--hidden {
      visibility: hidden;
    }
  }

  &__controls svg {
    @apply w-full;
  }
}
</style>
