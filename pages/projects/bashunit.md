---
title: bashunit
description: Framework de testing para scripts de Bash sencillo y eficiente, se centra en el developer experience con
  una sintaxis clara y un enfoque minimalista.
created_at: 2023-09-04
cover_url: /images/projects/bashunit.png
cover_alt: Imagen de portada de bashunit constituida por su logo y escrito a su derecha bashunit, centrados sobre un
  fondo casi blanco, el logotipo es un cuadrado redondeado de un gris oscuro ocupado casi en su totalidad por una
  pequeña serpiente enroscada de color blanco, la serpiente tiene dos pequeños cuernos de color verde manzana sobre sus
  ojos
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<img :src="$frontmatter.cover_url" :alt="$frontmatter.cover_alt">

El proyecto **bashunit** nació de la mano de [Chema][x-chema] con el objetivo de testar unos scripts de Bash que
había creado de manera sencilla. El equipo de TypedDevs rápidamente reconoció el potencial de la herramienta y se
embarcó en una investigación sobre el estado actual del testing en Bash. Fruto de este análisis, se decidió desarrollar
una herramienta moderna, actualizada y de fácil uso.

<SocialLinks
  custom-link="https://bashunit.typeddevs.com/"
  custom-image="/images/projects/bashunit.svg"
  custom-label="Documentación"
  x-handle="bashunit"
  git-hub-handle="TypedDevs/bashunit"
/>

**bashunit** destaca por su enfoque en la experiencia del desarrollador, proporcionando una interfaz intuitiva y un
conjunto de funcionalidades que facilitan la escritura y ejecución de pruebas. Esto incluye la ejecución de tests
individuales o en grupo, reportes detallados de resultados y una integración sencilla con entornos de desarrollo y
sistemas de CI/CD.

En la documentación se enfatiza el uso de ejemplos prácticos, mostrando cómo **bashunit** puede ser aplicado en
situaciones reales de desarrollo. Además, la comunidad juega un papel crucial, con una activa participación en GitHub
y un constante intercambio de ideas y mejoras a través de la plataforma y redes sociales como X.

En mi rol en el desarrollo de **bashunit**, he tenido la oportunidad de aplicar mi experiencia como desarrollador Full
Stack para influir significativamente en la arquitectura y diseño del framework. Mi enfoque se ha centrado en asegurar
que **bashunit** sea robusto, escalable y fácilmente integrable, características que considero esenciales para cualquier
herramienta moderna de desarrollo.

Para concluir, quiero expresar mi agradecimiento especial a [Manu][x-manu], entre otros colaboradores, por su
contribución activa y valiosa a **bashunit**. Su dedicación y habilidades han sido fundamentales en el desarrollo y
mejora continua del framework.

[x-chema]: https://x.com/Chemaclass
[x-manu]: https://x.com/evrtrabajo

<script lang="ts" setup>
import SocialLinks from '@/components/SocialLinks/SocialLinks.vue'
</script>
