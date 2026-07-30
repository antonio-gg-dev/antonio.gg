---
title: Por qué usar Inline SVGs
command: ['blog open por-que-usar-inline-svgs.md']
author: Antonio
tags: [frontend, software, svg]
description: Los iconos parecen un detalle menor, pero su formato influye mucho en el rendimiento y la flexibilidad de
  una interfaz. Usar SVGs en línea en lugar de etiquetas img abre la puerta a mejoras reales tanto en velocidad como en
  personalización.
created_at: 2025-11-19
cover_url: /images/blog/2025-11-19-por-que-usar-inline-svgs.png
cover_alt: Imagen de portada del artículo "Por qué usar Inline SVGs" muestra un icono de varita mágica gris insertado
  como img junto a la versión SVG inline recoloreada por partes.
---

# {{ frontmatter.title }}

{{ frontmatter.description }}

<img :src="frontmatter.cover_url" :alt="frontmatter.cover_alt">

## Menos peticiones y mejor rendimiento

Un SVG incrustado forma parte del propio HTML, así que:

- **No genera peticiones HTTP adicionales.** Con `img`, cada icono implica una solicitud al servidor. Con SVG inline,
  todo viaja en el mismo documento HTML.

- **El navegador lo procesa de inmediato.** No hay que esperar a recursos externos, lo que reduce latencias y evita
  microbloqueos cuando la interfaz usa muchos iconos.

- **Menos negociación en el protocolo.** Reducir solicitudes evita aperturas de conexión, cabeceras y validaciones
  innecesarias.

En interfaces con docenas de iconos, esto mantiene la experiencia mucho más fluida.

## Estilado mucho más flexible

Con un SVG en línea, cada parte del gráfico es accesible desde CSS:

- Puede **heredar el color del texto** con `currentColor`.
- Puedes **recolorear secciones concretas** usando variables CSS.
  Yo suelo usar esto para evitar duplicar iconos solo por cambiar un matiz.
- Admite transiciones, cambios de tema, estados hover o incluso animaciones.
- El grosor, opacidad y cualquier propiedad visual se puede ajustar sin generar variantes.

Esto no es posible con `img`, donde el contenido del icono es opaco para el navegador.

## Reutilización sencilla en frameworks modernos

Los SVG inline encajan especialmente bien en frameworks como Vue, React o Angular. Basta con crear **un componente por
icono**, pegando el SVG tal cual dentro del componente. Esto permite:

- Reutilizarlos sin repetir código.
- Aplicar variables CSS, props o clases para controlar colores y estados.
- Integrarlos en el sistema de diseño como cualquier otro componente.

Es una forma limpia de mantener consistencia sin depender de un sistema externo de iconos.

## Accesibilidad

En accesibilidad, `img` y SVG inline ofrecen lo mismo: `alt`, `title`, `role`, `aria-label` y el resto de atributos
funcionan igual. La única diferencia es que el SVG inline permite definir información accesible dentro del propio
gráfico, mientras que `img` depende del elemento contenedor. El resultado final puede ser igual de accesible.

## Compatibilidad sólida

El soporte de SVG inline es completo en todos los navegadores modernos. Se integra sin dependencias, respeta las reglas
del DOM y funciona igual en móvil y escritorio. No necesita loaders ni herramientas de build.

## Pruébalo tu mismo

Si quieres experimentar con el comportamiento del SVG inline, he preparado un ejemplo en **HTML y CSS vanilla**,
sin JavaScript. En el panel de estilos puedes modificar las **variables CSS** (`--rod`, `--tip`, `--sparkles`) y también
el **color del texto** del contenedor para ver cómo el icono se adapta al instante.

- [Puedes probarlo aquí](https://jsfiddle.net/Katarn/L4mgcakw/)

Lo importante del SVG en este ejemplo es que cada tramo del dibujo usa `fill="var(...)"`, lo que permite controlar sus
colores directamente desde CSS sin tocar el propio archivo.

```html
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 640 640"
>
  <path
    fill="var(--rod, currentColor)"
    d="..."
  />
  <path
    fill="var(--tip, currentColor)"
    d="..."
  />
  <path
    fill="var(--sparkles, currentColor)"
    d="..."
  />
</svg>
```

## Conclusión

Usar SVG en línea reduce peticiones, mejora el tiempo de renderizado y ofrece un control total sobre la personalización.
Además, se adapta perfectamente a frameworks modernos creando un componente por icono. Es una mejora sencilla con
impacto real en rendimiento y en coherencia visual.

<script lang="ts" setup>
import { useData } from 'vitepress'

const { frontmatter } = useData()
</script>
