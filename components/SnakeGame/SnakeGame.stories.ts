import { type Meta, type StoryObj } from '@storybook/vue3'
import SnakeGame from './SnakeGame.vue'
import { Fruit, Phase } from './snakeGame'

const game = {
  snake: [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
    { x: 7, y: 10 },
    { x: 6, y: 10 },
  ],
  food: [
    { x: 14, y: 10, fruit: Fruit.Tomato },
    { x: 3, y: 3, fruit: Fruit.Apple },
    { x: 16, y: 4, fruit: Fruit.Lemon },
    { x: 4, y: 16, fruit: Fruit.Tomato },
    { x: 17, y: 17, fruit: Fruit.Apple },
  ],
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
    phase: Phase.Title,
    ...game,
    score: 0,
  },
}

export const Playing: Story = {
  args: {
    phase: Phase.Playing,
    ...game,
    score: 3,
  },
}

export const Paused: Story = {
  args: {
    phase: Phase.Paused,
    ...game,
    score: 3,
  },
}

export const GameOver: Story = {
  args: {
    phase: Phase.GameOver,
    ...game,
    score: 3,
  },
}
