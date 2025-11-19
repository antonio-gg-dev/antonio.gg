---
title: El índice de índices (Z)
description: 'El z-index es uno de esos detalles que rara vez se piensan al inicio de un proyecto, pero que con el
  tiempo puede convertirse en un caos. Cuando cada componente define su propio valor arbitrario, mantener un orden
  visual coherente entre capas se vuelve una tarea imposible: modales que quedan detrás de menús, tooltips invisibles,
  backdrops que no cubren lo que deberían...'
created_at: 2025-11-10
cover_url: /images/blog/2025-11-10-el-indice-de-indices-z.png
cover_alt: Imagen de portada del artículo "El índice de índices (Z)". Muestra una composición tridimensional de varias
  capas de interfaces web superpuestas, con fotografías y elementos visuales que representan diferentes niveles de
  apilamiento en una página.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

Con el tiempo, he llegado a la conclusión de que la única forma fiable de evitarlo es tener un **índice centralizado de
z-index**, una referencia única que indique de forma explícita qué elementos deben aparecer sobre otros.

<img :src="$frontmatter.cover_url" :alt="$frontmatter.cover_alt">

## La idea: un índice de capas

La técnica consiste en crear un pequeño mapa con todos los elementos que generan capas superpuestas. Cada uno tiene un
nombre semántico que indica a qué componente pertenece y se le asigna automáticamente un valor incremental.
De esta forma, en lugar de tener valores dispersos como `z-index: 50;`, `z-index: 100;` o `z-index: 9999;`, el orden de
las capas se controla desde un solo sitio.

A continuación tres ejemplos con distintos stacks. Una versión simplificada usando **CSS nativo** en la que hay que
definir los valores de forma manual, pero los mantenemos centralizados en un mismo lugar. Y una versión automática tanto
en Sass como en Tailwind, en la que solo hay que indicar el orden de los componentes en una lista y sus valores los
define una función.

::: code-group

```css [CSS nativo]
/* z-index.css */
:root {
  --z-auto: auto;
  --z-action-bar: 1;
  --z-nav-bar-backdrop: 2;
  --z-nav-bar: 3;
  --z-auth-menu-backdrop: 4;
  --z-auth-menu-dropdown: 5;
  --z-gallery-detail-header: 6;
  --z-gallery-selection-action-bar: 7;
  --z-modal-backdrop: 8;
  --z-modal-container: 9;
  --z-cookie-jar: 10;
  --z-gallery-selection-modal-bar: 11;
}

/* uso en cualquier componente */
.action-bar {
  z-index: var(--z-action-bar);
}
```

```scss [Sass]
/* z-index.scss */
$z-index-map: ();

@function generate-z-indexes($negative, $positive) {
  $result: (
    auto: auto,
  );

  @each $name in $negative {
    $i: index($negative, $name);
    $result: map-merge(
      $result,
      (
        $name: -1 * $i,
      )
    );
  }

  @each $name in $positive {
    $i: index($positive, $name);
    $result: map-merge(
      $result,
      (
        $name: $i,
      )
    );
  }

  @return $result;
}

$z-index-map: generate-z-indexes(
  (),
  (
    action-bar,
    nav-bar-backdrop,
    nav-bar,
    auth-menu-backdrop,
    auth-menu-dropdown,
    gallery-detail-header,
    gallery-selection-action-bar,
    modal-backdrop,
    modal-container,
    cookie-jar,
    gallery-selection-modal-bar
  )
);

@function z($name) {
  @return map-get($z-index-map, $name);
}

/* uso en cualquier componente */
.action-bar {
  z-index: z(action-bar);
}
```

```js [Tailwind]
/* tailwind.config.js */
export default {
  theme: {
    zIndex: generateZIndexes(
      [],
      [
        'action-bar',
        'nav-bar-backdrop',
        'nav-bar',
        'auth-menu-backdrop',
        'auth-menu-dropdown',
        'gallery-detail-header',
        'gallery-selection-action-bar',
        'modal-backdrop',
        'modal-container',
        'cookie-jar',
        'gallery-selection-modal-bar',
      ],
    ),
  },
}

function generateZIndexes(negative, positive) {
  const result = { auto: 'auto' }

  negative.forEach((component, i) => {
    result[component] = (-1 - i).toString()
  })

  positive.forEach((component, i) => {
    result[component] = (i + 1).toString()
  })

  return result
}

/* uso en cualquier componente */
.action-bar {
  @apply z-action-bar;
}
```

:::

Cada clave corresponde al nombre del componente (por ejemplo, `modal-backdrop` o `nav-bar`), y su valor se genera de
forma secuencial.

El resultado es un sistema fácil de mantener y completamente trazable: cualquier desarrollador puede ver en un único
punto qué elementos se superponen y en qué orden.

## Organización y convenciones

La estructura del índice depende de la aplicación, pero suelo agrupar elementos que pertenecen a un mismo conjunto: por
ejemplo, los distintos niveles de un modal (`modal-backdrop`, `modal-container`) aparecen juntos para facilitar su
localización. Si un nuevo componente necesita aparecer por encima de otro, simplemente se añade más abajo en la lista,
garantizando que su valor será superior.

En proyectos grandes, esta lista se mantiene como parte de la **disciplina del equipo**: cuando se elimina un elemento
se comprueba que ya no se utilice en ningún componente, si se reordena se añade un **test de regresión visual** que
justifique el cambio.

En mi caso, estos **tests de regresión visual**, se ejecutan con el uso conjunto de **Storybook y Chromatic**,
asegurando que el orden visual correcto se mantiene estable en el tiempo.

## Mantenimiento y coherencia

El índice de z-index funciona de forma similar a un design system, pero aplicado al apilamiento visual.
En equipos maduros, no hace falta imponer linters ni reglas estrictas: basta con acordar las convenciones a través de
**TDRs (Technical Decision Records)** y respetarlas durante el desarrollo.

Aquí cada entrada usa de prefijo el nombre del componente Vue en kebab-case, lo que hace el sistema más
predecible y fácil de rastrear.

## Conclusión

Centralizar los z-index no es una práctica especialmente compleja, pero sí aporta mucho valor a largo plazo en proyectos
con interfaces ricas o múltiples capas superpuestas.

Ya sea con Tailwind, Sass o CSS nativo, la clave está en mantener un orden global y documentado que todos los
desarrolladores entiendan y respeten.
