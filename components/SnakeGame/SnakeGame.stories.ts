import { type Meta, type StoryObj } from '@storybook/vue3'
import SnakeGame from './SnakeGame.vue'
import { Direction, FoodType, Phase } from './snakeGame'

const game = {
  snake: [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
    { x: 7, y: 10 },
    { x: 6, y: 10 },
  ],
  food: [
    { x: 14, y: 10, type: FoodType.Tomato },
    { x: 3, y: 3, type: FoodType.Apple },
    { x: 16, y: 4, type: FoodType.Lemon },
    { x: 4, y: 16, type: FoodType.Tomato },
    { x: 17, y: 17, type: FoodType.Apple },
  ],
  highScore: 151120,
}

const meta = {
  title: 'SnakeGame',
  component: SnakeGame,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SnakeGame>

export default meta

type Story = StoryObj<typeof SnakeGame>

export const Title: Story = {
  args: {
    direction: Direction.Right,
    phase: Phase.Title,
    ...game,
    score: 0,
  },
}

export const Playing: Story = {
  args: {
    direction: Direction.Right,
    phase: Phase.Playing,
    ...game,
    comboFood: FoodType.Tomato,
    score: 3,
  },
}

export const PlayingWithStrawberry: Story = {
  args: {
    direction: Direction.Right,
    phase: Phase.Playing,
    ...game,
    food: [
      { x: 14, y: 10, type: FoodType.Tomato },
      { x: 3, y: 3, type: FoodType.Apple },
      { x: 16, y: 4, type: FoodType.Lemon },
      { x: 4, y: 16, type: FoodType.Tomato },
      { x: 10, y: 4, type: FoodType.Strawberry },
    ],
    score: 3,
  },
}

export const Paused: Story = {
  args: {
    direction: Direction.Right,
    phase: Phase.Paused,
    ...game,
    score: 3,
  },
}

export const GameOver: Story = {
  args: {
    direction: Direction.Right,
    phase: Phase.GameOver,
    ...game,
    score: 3,
  },
}

export const GameOverHighScore: Story = {
  args: {
    direction: Direction.Right,
    phase: Phase.GameOver,
    ...game,
    score: 151120,
    highScore: 151120,
  },
}
