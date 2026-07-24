---
title: Gacela Project
description: Framework PHP que facilita el desarrollo de aplicaciones modulares, destacando por su claridad, facilidad
  de uso y mejora en la mantenibilidad del código.
created_at: 2021-09-13
cover_url: /images/projects/gacela-project.png
cover_alt: Imagen de portada de Gacela Project constituida por su logo y escrito a su derecha en la parte inferior
  Gacela, todo sobre un fondo blanco, el logotipo es una simplificación de una gacela de origami donde los bordes de
  esta están resaltados en un color azulado oscuro, las letras Gacela están en el mismo color
---

# {{ frontmatter.title }}

{{ frontmatter.description }}

<img :src="frontmatter.cover_url" :alt="frontmatter.cover_alt">

Gacela Project es un framework PHP para proyectos modulares, fue creado por [Chema][x-chema] y [Jesus][x-jesus].
Inspirado en Spryker, Gacela une robustez y claridad, facilitando el desarrollo de aplicaciones backend. Su enfoque
modular mejora la mantenibilidad y eficiencia del código.

<SocialLinks
  custom-link="https://gacela-project.com/"
  custom-image="/images/projects/gacela-project.svg"
  custom-label="Documentación"
  x-handle="gacela_project"
  git-hub-handle="gacela-project"
/>

Además, Gacela es compatible con frameworks PHP modernos como Laravel y Symfony. Esta flexibilidad permite integrarlo
fácilmente en proyectos existentes, proporcionando una herramienta eficiente para el desarrollo modular en PHP.

Mi colaboración en Gacela comenzó con contribuciones ocasionales, pero se intensificó tras la integración de mi proyecto
personal [Chico Framework][chico-framework] en el ecosistema de Gacela. Esta fusión marcó un punto de inflexión en mi
implicación con el proyecto, llevándome a trabajar más estrechamente en su desarrollo.

Gacela Router, que surgió como un fork de Chico Router, demuestra el impacto positivo del minimalismo y eficiencia en el
desarrollo de software. Trabajé en la mejora de sus funcionalidades, arquitectura y tests, integrando los valores y
enfoques de Chico en el contexto más amplio de Gacela.

Finalmente, enfrenté el desafío de mejorar la fiabilidad de los tests en Gacela mediante la implementación de Mutation
Testing. Utilizando Infection, un framework de mutation testing para PHP, comencé por el router, extendiendo esta
metodología al resto de los módulos de Gacela. Este proceso no solo mejoró la calidad del código, sino que también
reforzó la robustez de nuestros tests.

[x-chema]: https://x.com/Chemaclass
[x-jesus]: https://x.com/JesusValera96
[chico-framework]: https://github.com/antonio-gg-dev/chico-framework

<script lang="ts" setup>
import { useData } from 'vitepress'
import SocialLinks from '@/components/SocialLinks/SocialLinks.vue'

const { frontmatter } = useData()
</script>
