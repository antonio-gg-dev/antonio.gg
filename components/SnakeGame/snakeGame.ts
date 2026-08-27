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
const strawberryProbability = 0.05
const speedScoreUnit = 1000
const speedScoreLimit = 50000
const speedSteps = 32
const speedStep = 10
const minimumSpeed = 80
const scoreLoss = 5
const scoreInterval = 1000
const scoreFeedbackDuration = 1000
const directionBufferSize = 2
const gameOverInputBlockDuration = 2000

export enum Direction {
  Up = 'up',
  Right = 'right',
  Down = 'down',
  Left = 'left',
}

export enum FoodType {
  Lemon = 'lemon',
  Tomato = 'tomato',
  Apple = 'apple',
  Strawberry = 'strawberry',
}

export interface Cell {
  x: number
  y: number
}

export interface FoodCell extends Cell {
  type: FoodType
}

export interface SnakeGame {
  snake: Cell[]
  food: FoodCell[]
  direction: Direction
  score: number
  maxScore: number
  combo: number
  comboFood?: FoodType
  collisionGrace: boolean
  gameOver: boolean
}

export interface ScoreFeedback extends Cell {
  type: FoodType
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
  returnToMenu: () => void
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
    collisionGrace: false,
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
    return game.collisionGrace ? { ...game, gameOver: true } : { ...game, collisionGrace: true }
  }

  const ateStrawberry = eatenFood?.type === FoodType.Strawberry
  const combo =
    eatenFood === undefined ? game.combo : ateStrawberry || eatenFood.type === game.comboFood ? game.combo + 1 : 1
  const comboFood = ateStrawberry ? game.comboFood : eatenFood?.type ?? game.comboFood
  const score = ateFood ? game.score + calculateFoodScore(combo) : game.score
  const nextFood = ateFood
    ? createFood(
        nextSnake,
        game.food.filter((food) => !sameCell(nextHead, food)),
        comboFood,
      )
    : game.food

  return {
    ...game,
    snake: nextSnake,
    food: ateStrawberry && comboFood !== undefined ? nextFood.map((food) => recolorFood(food, comboFood)) : nextFood,
    score,
    maxScore: Math.max(game.maxScore, score),
    combo,
    comboFood,
    collisionGrace: false,
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
  let gameOverInputTimer: number | undefined
  let isGameOverInputBlocked = false

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
      showScoreFeedback(
        eatenFood.type === FoodType.Strawberry && game.value.comboFood !== undefined
          ? { ...eatenFood, type: game.value.comboFood }
          : eatenFood,
        game.value.score - previousScore,
      )
    }

    if (game.value.gameOver) {
      phase.value = Phase.GameOver
      blockGameOverInput()
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

  function showScoreFeedback(food: FoodCell, points: number): void {
    clearScoreFeedback()
    scoreFeedback.value = { x: food.x, y: food.y, type: food.type, points }
    scoreFeedbackTimer = window.setTimeout(clearScoreFeedback, scoreFeedbackDuration)
  }

  function clearScoreFeedback(): void {
    scoreFeedback.value = undefined

    if (scoreFeedbackTimer !== undefined) {
      window.clearTimeout(scoreFeedbackTimer)
      scoreFeedbackTimer = undefined
    }
  }

  function blockGameOverInput(): void {
    isGameOverInputBlocked = true

    if (gameOverInputTimer !== undefined) {
      window.clearTimeout(gameOverInputTimer)
    }

    gameOverInputTimer = window.setTimeout(() => {
      isGameOverInputBlocked = false
      gameOverInputTimer = undefined
    }, gameOverInputBlockDuration)
  }

  function changeGameDirection(direction: Direction): void {
    if (isGameOverInputBlocked) {
      return
    }

    if (phase.value === Phase.Title) {
      startGame()
      return
    }

    if (phase.value === Phase.GameOver) {
      returnToMenu()
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
    if (isGameOverInputBlocked) {
      return
    }

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
    if (isGameOverInputBlocked) {
      return
    }

    if (heldDirection === direction) {
      heldDirection = undefined
      heldTicks = 0
      isAccelerating = false
    }
  }

  function togglePause(): void {
    if (isGameOverInputBlocked) {
      return
    }

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

  function returnToMenu(): void {
    if (isGameOverInputBlocked) {
      return
    }

    phase.value = Phase.Title
  }

  function exitGame(): void {
    if (isGameOverInputBlocked) {
      return
    }

    dispatchRouteHistoryEvent({ action: 'set-prompt-visible', visible: true })

    if (isInternalReferrer()) {
      window.history.back()
    } else {
      window.location.assign('/')
    }
  }

  function handleKeydown(event: KeyboardEvent): void {
    if (isGameOverInputBlocked) {
      event.preventDefault()
      return
    }

    if (phase.value === Phase.Title) {
      if (event.key === 'Escape') {
        exitGame()
      } else {
        startGame()
      }
      return
    }

    if (phase.value === Phase.GameOver) {
      returnToMenu()
      return
    }

    if (phase.value === Phase.Paused) {
      togglePause()
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
    if (isGameOverInputBlocked) {
      event.preventDefault()
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
    if (gameOverInputTimer !== undefined) {
      window.clearTimeout(gameOverInputTimer)
    }
  })

  return {
    phase,
    game,
    highScore,
    scoreFeedback,
    returnToMenu,
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

function isInternalReferrer(): boolean {
  if (document.referrer === '') {
    return false
  }

  return new URL(document.referrer).origin === window.location.origin
}

function createFood(snake: Cell[], food: FoodCell[], comboFood?: FoodType): FoodCell[] {
  const nextFood = [...food]

  while (nextFood.length < foodCount) {
    const availableCell = findAvailableFoodCell(snake, nextFood)

    if (availableCell === undefined) {
      break
    }

    nextFood.push({ ...availableCell, ...randomFood(comboFood) })
  }

  return nextFood
}

function randomFood(comboFood?: FoodType): Pick<FoodCell, 'type'> {
  if (comboFood !== undefined && Math.random() < strawberryProbability) {
    return { type: FoodType.Strawberry }
  }

  const foods = [
    FoodType.Lemon,
    FoodType.Tomato,
    FoodType.Apple,
  ]
  const type = foods[Math.floor(Math.random() * foods.length)] ?? FoodType.Lemon

  return { type }
}

function recolorFood(food: FoodCell, comboFood: FoodType): FoodCell {
  return food.type === FoodType.Strawberry ? food : { ...food, type: comboFood }
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
