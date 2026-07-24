---
title: Huezzle
description: Juego de puzzles diarios, reordena cromáticamente una cuadrícula de colores,
  cada día todo el mundo se enfrentará a un mismo reto que se generará proceduralmente.
created_at: 2023-07-01
cover_url: /images/projects/huezzle.png
cover_alt: Imagen de portada de Huezzle en la que se ve un puzzle resuelto de tonos purpuras y naranjas
  con el texto Huezzle en negro sobre fondo blanco situado en la esquina superior izquierda
---

# {{ frontmatter.title }}

{{ frontmatter.description }}

<img :src="frontmatter.cover_url" :alt="frontmatter.cover_alt">

Huezzle representa un hito personal en mi carrera como desarrollador: es el primer juego que he publicado.
Este juego de puzzles diarios me ha permitido explorar y superar varios retos técnicos y de diseño, especialmente en el
ámbito de los juegos basados en la web.

<SocialLinks
  custom-link="https://huezzle.antonio.gg/"
  custom-image="/images/projects/huezzle.svg"
  custom-label="Jugar"
  x-handle="huezzle"
  git-hub-handle="antonio-gg-dev/Huezzle"
/>

Me he centrado en crear una experiencia de juego fluida y receptiva que funciona a la perfección en múltiples
dispositivos. Uno de los desafíos más significativos fue implementar la funcionalidad de arrastrar y soltar de manera
eficiente y efectiva. Lograr que esta mecánica fuera intuitiva y receptiva en diferentes dispositivos no fue tarea
fácil, pero fue crucial para la jugabilidad y la experiencia del usuario.

El cálculo y la manipulación de colores también presentaron un desafío interesante. Desarrollar un algoritmo que no solo
generara una variedad de colores, sino que también asegurara puzzles solucionables y estéticamente agradables, requirió
una cuidadosa planificación y experimentación.

La generación procedural de puzzles diarios fue otro aspecto fundamental del desarrollo de Huezzle. Quería que cada día
ofreciera un nuevo desafío a los jugadores, manteniendo el juego fresco y emocionante. Implementar esta característica
no solo aumentó la rejugabilidad del juego, sino que también creó una sensación de comunidad, ya que todos los jugadores
se enfrentan al mismo puzzle cada día.

En resumen, el desarrollo de Huezzle ha sido una experiencia increíblemente enriquecedora. Me ha permitido combinar mis
habilidades técnicas con mi creatividad, enfrentándome a retos únicos y aprendiendo constantemente. Estoy orgulloso del
resultado y emocionado por ver cómo los jugadores de todo el mundo disfrutan y se desafían con mi juego.

<script lang="ts" setup>
import { useData } from 'vitepress'
import SocialLinks from '@/components/SocialLinks/SocialLinks.vue'

const { frontmatter } = useData()
</script>
