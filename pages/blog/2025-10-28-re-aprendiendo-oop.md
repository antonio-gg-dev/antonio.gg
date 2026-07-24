---
title: Re-aprendiendo OOP
description: 'Esta charla nació de una conversación con un café de por medio. Hablando de nuestros años de estudio,
  recordé que a mí la Programación Orientada a Objetos me costó de aprender. No tardamos en darnos cuenta de que es algo
  que nos pasó a todos. De ahí surgió la idea de explicar la OOP de otra forma: con contexto histórico, entendiendo el
  porqué antes que el cómo.'
created_at: 2025-10-28
cover_url: /images/blog/2025-10-28-re-aprendiendo-oop.png
cover_alt: 'Imagen de portada del artículo "Re-aprendiendo OOP: esta vez, bien", con las fotos de Antonio González Gea y
  Emmanuel Valverde Ramos.'
---

# {{ frontmatter.title }}

{{ frontmatter.description }}

<img :src="frontmatter.cover_url" :alt="frontmatter.cover_alt">

Junto a [Manu][x-manu], preparamos esta charla con la intención de redescubrir la Programación Orientada a Objetos
desde sus raíces. No como un conjunto de herramientas o palabras clave, sino como una forma de pensar el diseño de
software.

A lo largo de la presentación recorremos las dos grandes escuelas que dieron forma al paradigma - la de
**Bjarne Stroustrup**, centrada en la estructura, y la de **Alan Kay**, centrada en la comunicación - para entender cómo
sus ideas siguen influyendo hoy en la manera en que escribimos código.

Esta charla no pretende enseñar OOP desde cero ni reemplazar un aprendizaje convencional. Más bien lo complementa,
ofreciendo el **contexto histórico** y las **disciplinas y buenas prácticas** que hay detrás de las herramientas que
usamos a diario. No mostramos cómo aplicarlas en un lenguaje concreto, ya que cada lenguaje tiene sus particularidades
al implementar OOP, aunque incluimos ejemplos variados para ilustrar los conceptos.

<iframe src="https://www.youtube-nocookie.com/embed/FddyS7-crlQ?si=8ZV7BlVeKWee2RVE"
width="100%"
height="504"
frameborder="0"
allowfullscreen ></iframe>

Agradezco especialmente a [Manu][x-manu] por acompañarme en todo el proceso de creación y divulgación de la charla, y a
la comunidad de [Murcia Software Crafters][x-murcia-software-crafters] por ofrecernos el espacio para presentarla.

Os dejo aquí algunos enlaces:

- [Charla en YouTube](https://www.youtube.com/watch?v=FddyS7-crlQ)
- [Slides "Re-aprendiendo OOP"](/talks/re-aprendiendo-oop/re-aprendiendo-oop-por-emmanuel-valverde-y-antonio-gonzalez.pdf)
- [Cheat-sheet de pilares y relaciones](/talks/re-aprendiendo-oop/re-aprendiendo-oop-pilares-y-relaciones.pdf)

Y os invito a quienes la vean a reflexionar sobre cómo enseñamos y aplicamos OOP, y a redescubrir su propósito original: ayudarnos a construir sistemas más simples, sostenibles y comprensibles.

[x-manu]: https://x.com/evrtrabajo
[x-murcia-software-crafters]: https://x.com/murciaswcraft

<script lang="ts" setup>
import { useData } from 'vitepress'

const { frontmatter } = useData()
</script>
