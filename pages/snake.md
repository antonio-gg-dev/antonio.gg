---
title: Snake
command: [snake]
command_public: true
command_description: Juega al clásico juego Snake.
route_history_prompt: false
---

<SnakeGame
:food="game.food"
:phase="phase"
:score="game.score"
:snake="game.snake"
@direction="changeGameDirection"
@pause="togglePause"
@exit="exitGame"
/>

<script lang="ts" setup>
import SnakeGame from '@/components/SnakeGame/SnakeGame.vue'
import { useSnakeGame } from '@/components/SnakeGame/snakeGame.ts'

const { changeGameDirection, exitGame, game, phase, togglePause } = useSnakeGame()
</script>
