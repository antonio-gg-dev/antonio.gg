import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

export const boardSize = 20
const normalSpeed = 175
const fastSpeed = 100

export enum Direction {
  Up = 'up',
  Right = 'right',
  Down = 'down',
  Left = 'left',
}

export interface Cell {
  x: number
  y: number
}

export interface SnakeGame {
  snake: Cell[]
  food: Cell
  direction: Direction
  score: number
  gameOver: boolean
}

export enum Phase {
  Title = 'title',
  Playing = 'playing',
  Paused = 'paused',
  GameOver = 'game-over',
}

export interface SnakeGameController {
  phase: Ref<Phase>
  game: Ref<SnakeGame>
  changeGameDirection: (direction: Direction) => void
  startDirection: (direction: Direction) => void
  stopDirection: (direction: Direction) => void
  togglePause: () => void
  exitGame: () => void
}

export function createGame(): SnakeGame {
  return {
    snake: [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
      { x: 7, y: 10 },
      { x: 6, y: 10 },
    ],
    food: { x: 14, y: 10 },
    direction: Direction.Right,
    score: 0,
    gameOver: false,
  }
}

export function changeDirection(game: SnakeGame, direction: Direction): SnakeGame {
  if (isOpposite(game.direction, direction)) {
    return game
  }

  return { ...game, direction }
}

export function move(game: SnakeGame): SnakeGame {
  if (game.gameOver) {
    return game
  }

  const head = game.snake[0]

  if (head === undefined) {
    return game
  }

  const nextHead = {
    x: head.x + (game.direction === Direction.Right ? 1 : game.direction === Direction.Left ? -1 : 0),
    y: head.y + (game.direction === Direction.Down ? 1 : game.direction === Direction.Up ? -1 : 0),
  }
  const ateFood = sameCell(nextHead, game.food)
  const nextSnake = [
    nextHead,
    ...game.snake,
  ]

  if (!ateFood) {
    nextSnake.pop()
  }

  if (isWall(nextHead) || hasCollision(nextHead, nextSnake.slice(1))) {
    return { ...game, gameOver: true }
  }

  return {
    ...game,
    snake: nextSnake,
    food: ateFood ? createFood(nextSnake) : game.food,
    score: ateFood ? game.score + 1 : game.score,
  }
}

export function useSnakeGame(): SnakeGameController {
  const phase = ref<Phase>(Phase.Title)
  const game = ref(createGame())
  let interval: number | undefined
  let heldDirection: Direction | undefined

  function startGame(): void {
    game.value = createGame()
    phase.value = Phase.Playing
    startTimer()
  }

  function startTimer(speed = normalSpeed): void {
    stopTimer()
    interval = window.setInterval(moveGame, speed)
  }

  function moveGame(): void {
    game.value = move(game.value)

    if (game.value.gameOver) {
      phase.value = Phase.GameOver
      stopTimer()
    }
  }

  function stopTimer(): void {
    if (interval !== undefined) {
      window.clearInterval(interval)
      interval = undefined
    }
  }

  function changeGameDirection(direction: Direction): void {
    if (phase.value === Phase.Title) {
      startGame()
      return
    }

    if (phase.value === Phase.GameOver) {
      phase.value = Phase.Title
      return
    }

    if (phase.value === Phase.Paused) {
      togglePause()
      return
    }

    const nextGame = changeDirection(game.value, direction)

    if (nextGame !== game.value) {
      game.value = nextGame
      moveGame()

      if (!game.value.gameOver) {
        startTimer()
      }
    }
  }

  function startDirection(direction: Direction): void {
    if (phase.value !== Phase.Playing) {
      changeGameDirection(direction)
      return
    }

    if (isOpposite(game.value.direction, direction)) {
      return
    }

    changeGameDirection(direction)
    heldDirection = direction
    startTimer(fastSpeed)
  }

  function stopDirection(direction: Direction): void {
    if (heldDirection === direction) {
      heldDirection = undefined

      if (phase.value === Phase.Playing) {
        startTimer()
      }
    }
  }

  function togglePause(): void {
    if (phase.value === Phase.Playing) {
      phase.value = Phase.Paused
      stopTimer()
    } else if (phase.value === Phase.Paused) {
      phase.value = Phase.Playing
      startTimer()
    }
  }

  function exitGame(): void {
    dispatchRouteHistoryEvent({ action: 'set-prompt-visible', visible: true })
    window.history.back()
  }

  function handleKeydown(event: KeyboardEvent): void {
    if (phase.value === Phase.Title) {
      if (event.key === 'Escape') {
        exitGame()
      } else {
        startGame()
      }
      return
    }

    if (phase.value === Phase.GameOver) {
      phase.value = Phase.Title
      return
    }

    if (phase.value === Phase.Paused) {
      if (event.key === 'Escape') {
        exitGame()
      } else {
        togglePause()
      }
      return
    }

    if (event.key === 'Escape' || event.key === ' ' || event.key.toLowerCase() === 'p') {
      event.preventDefault()
      togglePause()
      return
    }

    const directions: Record<string, Direction> = {
      ArrowUp: Direction.Up,
      w: Direction.Up,
      ArrowRight: Direction.Right,
      d: Direction.Right,
      ArrowDown: Direction.Down,
      s: Direction.Down,
      ArrowLeft: Direction.Left,
      a: Direction.Left,
    }
    const direction = directions[event.key]

    if (direction !== undefined) {
      event.preventDefault()

      if (!event.repeat) {
        startDirection(direction)
      }
    }
  }

  function handleKeyup(event: KeyboardEvent): void {
    const directions: Record<string, Direction> = {
      ArrowUp: Direction.Up,
      w: Direction.Up,
      ArrowRight: Direction.Right,
      d: Direction.Right,
      ArrowDown: Direction.Down,
      s: Direction.Down,
      ArrowLeft: Direction.Left,
      a: Direction.Left,
    }
    const direction = directions[event.key]

    if (direction !== undefined) {
      event.preventDefault()
      stopDirection(direction)
    }
  }

  onMounted(() => {
    dispatchRouteHistoryEvent({ action: 'clear', preserveCurrentRoute: true })
    dispatchRouteHistoryEvent({ action: 'set-prompt-visible', visible: false })
    window.addEventListener('keydown', handleKeydown)
    window.addEventListener('keyup', handleKeyup)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown)
    window.removeEventListener('keyup', handleKeyup)
    stopTimer()
  })

  return {
    phase,
    game,
    changeGameDirection,
    startDirection,
    stopDirection,
    togglePause,
    exitGame,
  }
}

function dispatchRouteHistoryEvent(detail: {
  action: string
  preserveCurrentRoute?: boolean
  visible?: boolean
}): void {
  window.dispatchEvent(new CustomEvent('route-history', { detail }))
}

function createFood(snake: Cell[]): Cell {
  const availableCells: Cell[] = []

  for (let y = 0; y < boardSize; y += 1) {
    for (let x = 0; x < boardSize; x += 1) {
      const cell = { x, y }

      if (!snake.some((snakeCell) => sameCell(snakeCell, cell))) {
        availableCells.push(cell)
      }
    }
  }

  return availableCells[Math.floor(Math.random() * availableCells.length)] ?? { x: 0, y: 0 }
}

function hasCollision(cell: Cell, snake: Cell[]): boolean {
  return snake.some((snakeCell) => sameCell(snakeCell, cell))
}

function isOpposite(first: Direction, second: Direction): boolean {
  return (
    (first === Direction.Up && second === Direction.Down) ||
    (first === Direction.Right && second === Direction.Left) ||
    (first === Direction.Down && second === Direction.Up) ||
    (first === Direction.Left && second === Direction.Right)
  )
}

function isWall(cell: Cell): boolean {
  return cell.x < 0 || cell.x >= boardSize || cell.y < 0 || cell.y >= boardSize
}

function sameCell(first: Cell, second: Cell): boolean {
  return first.x === second.x && first.y === second.y
}
