---
title: Snake
command: [snake]
command_public: true
command_description: Play the classic Snake game.
route_history_prompt: false
---

<SnakeGame
:food="game.food"
:high-score="highScore"
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

const { exitGame, game, highScore, phase, scoreFeedback, startDirection, stopDirection, togglePause } = useSnakeGame()
</script>
