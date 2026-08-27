<template>
  <section
    class="snake__container"
    aria-label="Juego Snake"
  >
    <div
      class="snake__screen"
      :style="{ '--score-height': `${scoreHeight}px` }"
    >
      <p
        ref="scoreElement"
        class="snake__score"
      >
        Puntuación: {{ score }}
      </p>

      <div
        v-if="phase === Phase.Title"
        class="snake__title"
      >
        <h2>Snake</h2>
      </div>

      <template v-else>
        <div class="snake__board">
          <div
            v-for="cell in cells"
            :key="cell.key"
            class="snake__cell"
            :class="cell.className"
          ></div>
          <div
            v-if="phase === Phase.Paused || phase === Phase.GameOver"
            class="snake__overlay"
          >
            <h2>{{ phase === Phase.Paused ? 'Pausa' : 'Game Over' }}</h2>
            <p>
              {{
                phase === Phase.Paused ? 'Pulsa cualquier tecla para continuar' : 'Pulsa cualquier tecla para volver'
              }}
            </p>
          </div>
        </div>
      </template>
    </div>

    <div class="snake__controls">
      <button
        class="snake__control snake__control--up"
        type="button"
        aria-label="Mover arriba"
        @pointerdown.prevent="startDirection(Direction.Up)"
        @pointerup="stopDirection(Direction.Up)"
        @pointercancel="stopDirection(Direction.Up)"
        @pointerleave="stopDirection(Direction.Up)"
      >
        <ArrowUpIcon aria-hidden="true" />
      </button>
      <button
        class="snake__control snake__control--left"
        type="button"
        aria-label="Mover izquierda"
        @pointerdown.prevent="startDirection(Direction.Left)"
        @pointerup="stopDirection(Direction.Left)"
        @pointercancel="stopDirection(Direction.Left)"
        @pointerleave="stopDirection(Direction.Left)"
      >
        <ArrowLeftIcon aria-hidden="true" />
      </button>
      <button
        class="snake__control snake__control--down"
        type="button"
        aria-label="Mover abajo"
        @pointerdown.prevent="startDirection(Direction.Down)"
        @pointerup="stopDirection(Direction.Down)"
        @pointercancel="stopDirection(Direction.Down)"
        @pointerleave="stopDirection(Direction.Down)"
      >
        <ArrowDownIcon aria-hidden="true" />
      </button>
      <button
        class="snake__control snake__control--right"
        type="button"
        aria-label="Mover derecha"
        @pointerdown.prevent="startDirection(Direction.Right)"
        @pointerup="stopDirection(Direction.Right)"
        @pointercancel="stopDirection(Direction.Right)"
        @pointerleave="stopDirection(Direction.Right)"
      >
        <ArrowRightIcon aria-hidden="true" />
      </button>
      <button
        class="snake__control snake__control--pause"
        :class="{ 'snake__control--hidden': phase !== Phase.Playing }"
        type="button"
        aria-label="Pausar juego"
        :disabled="phase !== Phase.Playing"
        @click="$emit('pause')"
      >
        <PauseIcon aria-hidden="true" />
      </button>
      <button
        class="snake__control snake__control--exit"
        :class="{ 'snake__control--hidden': phase !== Phase.Title && phase !== Phase.Paused }"
        type="button"
        aria-label="Salir del juego"
        :disabled="phase !== Phase.Title && phase !== Phase.Paused"
        @click="$emit('exit')"
      >
        <CloseIcon aria-hidden="true" />
      </button>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import CloseIcon from '@/components/Icons/CloseIcon.vue'
import PauseIcon from '@/components/Icons/PauseIcon.vue'
import ArrowDownIcon from '@/components/Icons/ArrowDownIcon.vue'
import ArrowLeftIcon from '@/components/Icons/ArrowLeftIcon.vue'
import ArrowRightIcon from '@/components/Icons/ArrowRightIcon.vue'
import ArrowUpIcon from '@/components/Icons/ArrowUpIcon.vue'
import { boardSize, Direction, Phase, type Cell, type Food } from './snakeGame'

export default defineComponent({
  name: 'SnakeGame',

  components: {
    ArrowDownIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    ArrowUpIcon,
    CloseIcon,
    PauseIcon,
  },

  props: {
    phase: {
      required: true,
      type: String as PropType<Phase>,
    },
    snake: {
      required: true,
      type: Array as PropType<Cell[]>,
    },
    food: {
      required: true,
      type: Array as PropType<Food[]>,
    },
    score: {
      required: true,
      type: Number,
    },
  },

  emits: [
    'direction-start',
    'direction-end',
    'pause',
    'exit',
  ],

  data() {
    return {
      Direction,
      Phase,
      scoreHeight: 0,
      scoreObserver: null as ResizeObserver | null,
    }
  },

  computed: {
    cells(): Array<{ key: number; className: string }> {
      return Array.from({ length: boardSize * boardSize }, (_, index) => {
        const cell = { x: index % boardSize, y: Math.floor(index / boardSize) }
        const isSnake = this.snake.some((snakeCell) => sameCell(snakeCell, cell))
        const food = this.food.find((foodCell) => sameCell(foodCell, cell))

        return {
          key: index,
          className: isSnake ? 'snake__snake' : food !== undefined ? `snake__food snake__food--${food.fruit}` : '',
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
      this.$emit('direction-start', direction)
    },

    stopDirection(direction: Direction): void {
      this.$emit('direction-end', direction)
    },

    updateScoreHeight(): void {
      const scoreElement = this.$refs.scoreElement
      if (scoreElement instanceof HTMLElement) {
        this.scoreHeight = scoreElement.offsetHeight
      }
    },
  },
})

function sameCell(first: Cell, second: Cell): boolean {
  return first.x === second.x && first.y === second.y
}
</script>

<style lang="scss">
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

    @media (orientation: landscape) {
      @apply flex h-full w-fit flex-col;
    }
  }

  &__title,
  &__board {
    @media (orientation: landscape) {
      @apply h-auto min-h-0 w-auto;
      height: calc(100% - var(--score-height));
    }
  }

  &__title {
    @apply aspect-square w-full;
  }

  &__title h2 {
    @apply m-0 text-3xl text-success;
  }

  &__score {
    @apply m-0 shrink-0 whitespace-nowrap bg-neutral pb-2;
  }

  &__board {
    @apply relative grid aspect-square w-full;
    grid-template-columns: repeat(20, minmax(0, 1fr));
  }

  &__snake,
  &__food {
    @apply aspect-square;
  }

  &__snake {
    @apply bg-accent;
  }

  &__food {
    &--lemon {
      @apply bg-warning;
    }

    &--tomato {
      @apply bg-danger;
    }

    &--apple {
      @apply bg-success;
    }
  }

  &__overlay {
    @apply absolute inset-0 bg-background/90;
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
    &--exit {
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
