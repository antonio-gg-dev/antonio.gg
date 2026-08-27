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
:score-feedback="scoreFeedback"
:snake="game.snake"
@direction-start="startDirection"
@direction-end="stopDirection"
@pause="togglePause"
@exit="exitGame"
/>

<script lang="ts" setup>
import SnakeGame from '@/components/SnakeGame/SnakeGame.vue'
import { useSnakeGame } from '@/components/SnakeGame/snakeGame.ts'

const { exitGame, game, phase, scoreFeedback, startDirection, stopDirection, togglePause } = useSnakeGame()
</script>
