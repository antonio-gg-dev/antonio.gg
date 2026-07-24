---
title: Chess Board Generator
description: Generador de tableros de ajedrez imprimibles, pensado para jugar con piezas también impresas en 3D, usando
  HTML, CSS y JS puro para mantenerlo simple y ligero.
created_at: 2022-03-27
cover_url: /images/projects/chess-board-generator.png
cover_alt: 'Tablero de ajedrez rectangular, formado por casillas alternas en dos tonos sin piezas: un tono oscuro
  cercano a un marrón vino y un tono claro rosado pálido. Es el tablero base utilizado por el proyecto Chess Board
  Generator.'
---

# {{ frontmatter.title }}

{{ frontmatter.description }}

<img :src="frontmatter.cover_url" :alt="frontmatter.cover_alt">

A veces la necesidad más simple merece la solución más simple. Quería un tablero para jugar con piezas impresas en 3D,
y me apetecía experimentar combinando impresión en papel con impresión 3D. Además, era la excusa perfecta para practicar
con código vanilla, explorando cómo manejar HTML, CSS y JavaScript sin depender de librerías externas.

El resultado es Chess Board Generator, un generador de tableros imprimibles de 8×8 que puedes personalizar en colores
y márgenes. La mecánica es sencilla: eliges tus colores, ajustas el borde si quieres y pulsas el botón de imprimir.

<SocialLinks
  custom-link="https://antonio-gg-dev.github.io/chess-board-generator/"
  custom-image="/images/link.svg"
  custom-label="Probar"
  git-hub-handle="https://github.com/antonio-gg-dev/chess-board-generator"
/>

No es un proyecto gigante ni complicado, pero cumple perfectamente su función y sirve como pequeño laboratorio para
experimentar con código vanilla, manipulando el DOM y estilos sin dependencias externas. A veces, lo simple es
suficiente.

<script lang="ts" setup>
import { useData } from 'vitepress'
import SocialLinks from '@/components/SocialLinks/SocialLinks.vue'

const { frontmatter } = useData()
</script>
