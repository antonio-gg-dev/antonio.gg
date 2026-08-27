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
:combo-food="game.comboFood"
:phase="phase"
:score="game.score"
:score-feedback="scoreFeedback"
:snake="game.snake"
@direction-start="startDirection"
@direction-end="stopDirection"
@pause="togglePause"
@menu="returnToMenu"
@exit="exitGame"
/>

<script lang="ts" setup>
import SnakeGame from '@/components/SnakeGame/SnakeGame.vue'
import { useSnakeGame } from '@/components/SnakeGame/snakeGame.ts'

const { exitGame, game, highScore, phase, returnToMenu, scoreFeedback, startDirection, stopDirection, togglePause } = useSnakeGame()
</script>
