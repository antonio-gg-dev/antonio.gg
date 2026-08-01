---
title: Papelera para puerta del coche
command: ['projects open car-door-trash-bin.3d']
author: Antonio
tags: [3d-print, accesorio, coche]
description: Todo empezó con una molestia cotidiana, los pequeños residuos que se acumulan en el coche. Envoltorios,
  tickets, papeles...
created_at: 2022-02-15
cover_url: /images/projects/car-door-trash-bin.jpg
cover_alt: Primer plano de un pequeño cubo de basura negro impreso en 3D, colocado en el hueco de la puerta de un coche.
  El cubo tiene una tapa abatible abierta y una bolsa de plástico en su interior, sujeta por un aro diseñado para
  mantenerla en su sitio
---

# {{ frontmatter.title }}

{{ frontmatter.description }}

<img :src="frontmatter.cover_url" :alt="frontmatter.cover_alt">

Ninguna solución práctica que no colgara, se tambalease o invadiera espacio útil. La mayoría de opciones que encontré
en tiendas eran de tela, poco estéticas o difíciles de adaptar a distintos coches. Así que decidí diseñar la mía.

<SocialLinks
  printables-model-id="133800"
/>

Quería algo que permitiera colocar fácilmente una bolsa pequeña, fuera sencillo de vaciar y no hiciera falta instalar
nada de forma permanente. Me inspiré en los aros de baloncesto y también en los de algunas papeleras, y desarrollé un
sistema en tres partes: un cubo, una tapa con bisagra y un aro que sujeta la bolsa desde arriba, manteniéndola colgando
en su sitio.

Uno de los principales retos fue lograr que el aro tuviera la flexibilidad justa: lo bastante rígido para sujetar la
bolsa, pero con la elasticidad suficiente como para encajarse sin herramientas. Lo mismo ocurrió con la sujeción del
cubo en la puerta del coche, que también aprovecha la flexibilidad del plástico. Y sobre todo, la bisagra.
Inicialmente probé imprimirla completamente en 3D, pero se acababa rompiendo. Acabé rediseñándola para usar tornillos
M3 como eje.

La temperatura dentro de un coche fue otro quebradero de cabeza. PLA quedaba descartado desde el principio. Aunque PETG
puede llegar a funcionar, sé que hay coches en los que incluso eso puede no ser suficiente, así que lo recomendable
es usar materiales como ABS o ASA, que tienen una gran resistencia a deformarse con las altas temperaturas.

Como ocurre con casi todos mis diseños, lo desarrollé de forma paramétrica. Me preocupaba especialmente que pudiera
adaptarse a cualquier coche, así que preparé el modelo para poder ajustar medidas como el ancho y el alto fácilmente.
Subí un par de tamaños al principio, y fui publicando más a medida que la gente me escribía pidiendo versiones para sus
vehículos. Esa relación con la comunidad ha sido una de las partes más bonitas del proceso.

El diseño fue bien recibido desde el principio. Mucha gente lo ha impreso y usado, y muchos comparten sus resultados
con fotos o comentarios, cosa que personalmente me anima un montón. Como diseñador, saber que alguien ha instalado tu
idea en su día a día es una recompensa increíble.

He seguido aprendiendo gracias a este modelo. Nuevas formas de resolver uniones entre piezas, cómo evitar soportes,
cómo optimizar el uso del material o simplificar el montaje. Todos esos aprendizajes se han ido trasladando a diseños
posteriores.

Esta papelera es probablemente la versión final del concepto, aunque también he diseñado una variante distinta pensada
para colocarse en el posavasos del coche. Por ahora, no tengo planes de seguir extendiéndolo. El modelo funciona, la
gente lo usa y no hay nada que me haya hecho pensar en cambiarlo.

Diseñar en 3D no se parece del todo a programar, aunque algo se contagia. El diseño paramétrico, por ejemplo, es una
forma de anticipar que habrá cambios y que conviene hacer el diseño fácil de modificar. Uso Fusion 360, que tiene algo
parecido al control de versiones, pero el proceso de creación es mucho más visual y táctil que escribir código. Diseñas,
imprimes, pruebas, corriges. Y vuelta a empezar.

A quien quiera empezar a diseñar cosas en 3D, le diría que no espere a sabérselo todo. Que empiece con algo sencillo,
como una caja, un recipiente, una funda... Que diseñe algo que le apetezca usar. Que busque solo la información que
necesite en cada paso. Yo aprendí todo así, sin seguir ningún tutorial completo, solo resolviendo dudas a medida que
aparecían. Es un proceso muy directo, y muy gratificante.

Esta papelera no es solo un contenedor para chicles y tickets. Es también un ejemplo de cómo una necesidad pequeña puede
dar pie a una solución útil, replicable y compartida. Y sobre todo, de cómo compartir lo que haces puede tener un
impacto mucho mayor del que imaginas.

<script lang="ts" setup>
import { useData } from 'vitepress'
import SocialLinks from '@/components/SocialLinks/SocialLinks.vue'

const { frontmatter } = useData()
</script>
