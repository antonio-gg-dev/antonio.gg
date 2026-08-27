import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

export const boardSize = 20
export const foodCount = 5
const baseSpeed = 400
const accelerationTicks = 2
const highScoreKey = 'antonio.gg.snake'
const initialHighScore = 1120
const baseFoodScore = 100
const comboMultiplier = 1.1
const scoreStep = 5
const speedScoreUnit = 1000
const speedScoreLimit = 50000
const speedSteps = 32
const speedStep = 10
const minimumSpeed = 80
const scoreLoss = 5
const scoreInterval = 1000
const scoreFeedbackDuration = 1000
const directionBufferSize = 2

export enum Direction {
  Up = 'up',
  Right = 'right',
  Down = 'down',
  Left = 'left',
}

export enum Fruit {
  Lemon = 'lemon',
  Tomato = 'tomato',
  Apple = 'apple',
}

export interface Cell {
  x: number
  y: number
}

export interface Food extends Cell {
  fruit: Fruit
}

export interface SnakeGame {
  snake: Cell[]
  food: Food[]
  direction: Direction
  score: number
  maxScore: number
  combo: number
  comboFruit?: Fruit
  gameOver: boolean
}

export interface ScoreFeedback extends Cell {
  fruit: Fruit
  points: number
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
  highScore: Ref<number>
  scoreFeedback: Ref<ScoreFeedback | undefined>
  changeGameDirection: (direction: Direction) => void
  startDirection: (direction: Direction) => void
  stopDirection: (direction: Direction) => void
  togglePause: () => void
  exitGame: () => void
}

export function createGame(): SnakeGame {
  const snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
    { x: 7, y: 10 },
    { x: 6, y: 10 },
  ]

  return {
    snake,
    food: createFood(snake, []),
    direction: Direction.Right,
    score: 0,
    maxScore: 0,
    combo: 0,
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
  const eatenFood = game.food.find((food) => sameCell(nextHead, food))
  const ateFood = eatenFood !== undefined
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

  const combo = eatenFood === undefined ? game.combo : eatenFood.fruit === game.comboFruit ? game.combo + 1 : 1
  const score = ateFood ? game.score + calculateFoodScore(combo) : game.score

  return {
    ...game,
    snake: nextSnake,
    food: ateFood
      ? createFood(
          nextSnake,
          game.food.filter((food) => !sameCell(nextHead, food)),
        )
      : game.food,
    score,
    maxScore: Math.max(game.maxScore, score),
    combo,
    comboFruit: eatenFood?.fruit ?? game.comboFruit,
  }
}

export function useSnakeGame(): SnakeGameController {
  const phase = ref<Phase>(Phase.Title)
  const game = ref(createGame())
  const highScore = ref(initialHighScore)
  const scoreFeedback = ref<ScoreFeedback>()
  let interval: number | undefined
  let scoreTimer: number | undefined
  let scoreFeedbackTimer: number | undefined
  let pendingDirections: Direction[] = []
  let heldDirection: Direction | undefined
  let heldTicks = 0
  let isAccelerating = false

  function loadHighScore(): void {
    const storedValue = window.localStorage.getItem(highScoreKey)
    let storedHighScore: unknown

    try {
      storedHighScore = storedValue === null ? undefined : JSON.parse(storedValue).highScore
    } catch {
      storedHighScore = undefined
    }

    if (typeof storedHighScore === 'number' && Number.isFinite(storedHighScore) && storedHighScore >= 0) {
      highScore.value = storedHighScore
    } else {
      window.localStorage.setItem(highScoreKey, JSON.stringify({ highScore: highScore.value }))
    }
  }

  function saveHighScore(score: number): void {
    if (score > highScore.value) {
      highScore.value = score
      window.localStorage.setItem(highScoreKey, JSON.stringify({ highScore: highScore.value }))
    }
  }

  function startGame(): void {
    game.value = createGame()
    phase.value = Phase.Playing
    clearScoreFeedback()
    pendingDirections = []
    heldDirection = undefined
    heldTicks = 0
    isAccelerating = false
    startTimer()
    startScoreTimer()
  }

  function startTimer(): void {
    stopTimer()
    const speed = calculateSpeed(game.value.maxScore)
    const effectiveSpeed = isAccelerating ? speed / 2 : speed

    interval = window.setTimeout(moveGame, effectiveSpeed)
  }

  function moveGame(): void {
    const pendingDirection = pendingDirections.shift()

    if (pendingDirection !== undefined) {
      game.value = changeDirection(game.value, pendingDirection)
    }

    const previousFood = game.value.food
    const previousScore = game.value.score
    game.value = move(game.value)

    if (heldDirection === game.value.direction) {
      heldTicks += 1
      isAccelerating = heldTicks >= accelerationTicks
    } else {
      heldTicks = 0
      isAccelerating = false
    }

    const eatenFood = previousFood.find((food) => !game.value.food.some((currentFood) => sameCell(food, currentFood)))

    if (eatenFood !== undefined) {
      showScoreFeedback(eatenFood, game.value.score - previousScore)
    }

    if (game.value.gameOver) {
      phase.value = Phase.GameOver
      saveHighScore(game.value.score)
      stopTimer()
      stopScoreTimer()
    } else {
      startTimer()
    }
  }

  function stopTimer(): void {
    if (interval !== undefined) {
      window.clearTimeout(interval)
      interval = undefined
    }
  }

  function startScoreTimer(): void {
    stopScoreTimer()
    scoreTimer = window.setInterval(() => {
      game.value.score = Math.max(0, game.value.score - scoreLoss)
    }, scoreInterval)
  }

  function stopScoreTimer(): void {
    if (scoreTimer !== undefined) {
      window.clearInterval(scoreTimer)
      scoreTimer = undefined
    }
  }

  function showScoreFeedback(food: Food, points: number): void {
    clearScoreFeedback()
    scoreFeedback.value = { x: food.x, y: food.y, fruit: food.fruit, points }
    scoreFeedbackTimer = window.setTimeout(clearScoreFeedback, scoreFeedbackDuration)
  }

  function clearScoreFeedback(): void {
    scoreFeedback.value = undefined

    if (scoreFeedbackTimer !== undefined) {
      window.clearTimeout(scoreFeedbackTimer)
      scoreFeedbackTimer = undefined
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

    const currentDirection = pendingDirections.at(-1) ?? game.value.direction

    if (
      pendingDirections.length < directionBufferSize &&
      !isOpposite(currentDirection, direction) &&
      currentDirection !== direction
    ) {
      pendingDirections.push(direction)
    }
  }

  function startDirection(direction: Direction): void {
    if (phase.value !== Phase.Playing) {
      changeGameDirection(direction)
      return
    }

    const currentDirection = pendingDirections.at(-1) ?? game.value.direction

    if (isOpposite(currentDirection, direction)) {
      return
    }

    if (currentDirection === direction) {
      if (heldDirection !== direction) {
        heldDirection = direction
        heldTicks = 0
        isAccelerating = false
      }
      return
    }

    changeGameDirection(direction)
    heldDirection = direction
    heldTicks = 0
    isAccelerating = false
  }

  function stopDirection(direction: Direction): void {
    if (heldDirection === direction) {
      heldDirection = undefined
      heldTicks = 0
      isAccelerating = false
    }
  }

  function togglePause(): void {
    if (phase.value === Phase.Playing) {
      phase.value = Phase.Paused
      stopTimer()
      stopScoreTimer()
      heldTicks = 0
      isAccelerating = false
    } else if (phase.value === Phase.Paused) {
      phase.value = Phase.Playing
      startTimer()
      startScoreTimer()
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
    loadHighScore()
    dispatchRouteHistoryEvent({ action: 'clear', preserveCurrentRoute: true })
    dispatchRouteHistoryEvent({ action: 'set-prompt-visible', visible: false })
    window.addEventListener('keydown', handleKeydown)
    window.addEventListener('keyup', handleKeyup)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown)
    window.removeEventListener('keyup', handleKeyup)
    stopTimer()
    stopScoreTimer()
    clearScoreFeedback()
  })

  return {
    phase,
    game,
    highScore,
    scoreFeedback,
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

function createFood(snake: Cell[], food: Food[]): Food[] {
  const nextFood = [...food]

  while (nextFood.length < foodCount) {
    const availableCell = findAvailableFoodCell(snake, nextFood)

    if (availableCell === undefined) {
      break
    }

    nextFood.push({ ...availableCell, ...randomFruit() })
  }

  return nextFood
}

function randomFruit(): Pick<Food, 'fruit'> {
  const fruits = Object.values(Fruit)
  const fruit = fruits[Math.floor(Math.random() * fruits.length)] ?? Fruit.Lemon

  return { fruit }
}

function findAvailableFoodCell(snake: Cell[], food: Cell[]): Cell | undefined {
  const availableCells: Cell[] = []

  for (let y = 0; y < boardSize; y += 1) {
    for (let x = 0; x < boardSize; x += 1) {
      const cell = { x, y }

      if (!snake.some((snakeCell) => sameCell(snakeCell, cell)) && !food.some((foodCell) => sameCell(foodCell, cell))) {
        availableCells.push(cell)
      }
    }
  }

  return availableCells[Math.floor(Math.random() * availableCells.length)]
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

function calculateFoodScore(combo: number): number {
  return Math.round((baseFoodScore * Math.pow(comboMultiplier, combo - 1)) / scoreStep) * scoreStep
}

function calculateSpeed(maxScore: number): number {
  const steps = Math.min(
    speedSteps,
    Math.floor((speedSteps * Math.log(1 + maxScore / speedScoreUnit)) / Math.log(1 + speedScoreLimit / speedScoreUnit)),
  )

  return Math.max(minimumSpeed, baseSpeed - steps * speedStep)
}
