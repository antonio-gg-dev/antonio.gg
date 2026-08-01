---
title: Modulcaster
command: ['projects open modulcaster.3d']
author: Antonio
tags: [3d-print, guitarra, musica]
description: Guitarra eléctrica modular impresa en 3D, con un núcleo reutilizable y piezas intercambiables que permiten
  cambiar por completo su aspecto sin construir otro instrumento.
created_at: 2023-03-12
cover_url: /images/projects/modulcaster-stratocaster.png
cover_alt: Esquema 3D de las piezas de una guitarra eléctrica Modulcaster inspirada en la Stratocaster, con un núcleo
  negro y piezas modulares blancas y rojas con un estilo hueco que solo define el perfil característico de la
  Stratocaster
---

# {{ frontmatter.title }}

{{ frontmatter.description }}

<img :src="frontmatter.cover_url" :alt="frontmatter.cover_alt">

Modulcaster nació después de descubrir la [Prusacaster][prusacaster] y ver la cantidad de personas que estaban creando
sus propias versiones. No quería limitarme a imprimir una guitarra con un diseño concreto, sino experimentar con una
base que cualquiera pudiera personalizar y reutilizar. La idea era poder imprimir varios estilos sin tener que comprar y
montar una guitarra completa para cada uno.

Empecé por una [versión inspirada en la Stratocaster][modulcaster-stratocaster], mi diseño de guitarra favorito, y más
adelante desarrollé una [versión inspirada en la Les Paul][modulcaster-les-paul], probablemente una de las siluetas más
reconocibles de una guitarra eléctrica. Aunque visualmente son muy diferentes, ambas utilizan exactamente el mismo
núcleo.

Ese núcleo, que en mis impresiones mantuve de color negro, contiene todos los elementos funcionales de la guitarra: el
puente, las pastillas y una pequeña extensión para los potenciómetros, el selector de pastillas y el conector jack.
Alrededor se atornillan las piezas intercambiables, cuya única función es definir la forma y la estética del
instrumento.

Ambas versiones están diseñadas para reutilizar los componentes de un Harley Benton Electric Guitar Kit T-Style. Se
aprovechan el mástil, la electrónica, las pastillas, el puente y el resto de las piezas del kit, el único elemento que
se sustituye es el cuerpo de madera.

<img
  src="/images/projects/modulcaster-les-paul.png"
  alt="
    Esquema 3D de las piezas de una guitarra eléctrica Modulcaster inspirada en la Les Paul, con un núcleo negro y
    piezas modulares en azul, el cuerpo es parcialmente hueco a excepción de un espiral que soporta el perímetro de
    la característica forma de la Les Paul
">

Durante la impresión del núcleo es necesario realizar varias pausas para introducir las tuercas que quedarán atrapadas
en su interior. Las piezas decorativas incluyen pequeños orificios por los que se introducen los tornillos que las
sujetan al núcleo. Utilicé tornillos con una cabeza especialmente ancha para repartir mejor la presión y mantener las
piezas firmemente colocadas.

Como las piezas intercambiables son demasiado grandes para imprimirse de una sola vez en una Prusa MK3S+, también están
divididas en varias secciones. Estas secciones se pegan entre sí, ya que nunca necesitarán volver a separarse. De esta
forma, el diseño combina uniones permanentes mediante adhesivo con uniones temporales mediante tornillos. Cambiar una
personalización completa requiere solamente unos minutos.

El principal reto fue conseguir que la guitarra fuera realmente personalizable sin comprometer su resistencia. El
núcleo debía funcionar como una estructura independiente y soportar permanentemente la tensión de las cuerdas, mientras
que las piezas exteriores tenían que poder retirarse sin afectar a la electrónica ni al ajuste del instrumento.

La orientación de impresión del núcleo es especialmente importante. Debe imprimirse de lado para que las capas queden
colocadas en la dirección que mejor resiste la tensión de las cuerdas. Una orientación incorrecta podría facilitar la
aparición de grietas con el paso del tiempo. Casi todas las piezas están diseñadas para imprimirse sin soportes, aunque
en algunas zonas del núcleo es recomendable añadirlos debido precisamente a esta orientación.

La guitarra completa requirió más de cien horas de impresión en una Prusa MK3S+ y aproximadamente 1,5 kg de filamento.
En una impresora moderna, especialmente utilizando una boquilla o un sistema de impresión más rápido, ese tiempo se
podría reducir considerablemente.

<img
  src="/images/projects/modulcaster-printed.png"
  alt="
    Fotografías de las guitarras ya impresas en 3D sobre el suelo apoyadas en vertical sobre una pared blanca, a la
    izquierda la Stratocaster y a la derecha la Les Paul, ambas con el mismo esquema de colores que en los diseños
    originales, tienen el mastil y las perillas color negro y el golpeador de color blanco
">

Mi guitarra está impresa completamente en <abbr title="Ácido poliláctico plus">PLA+</abbr>, un material suficientemente
rígido para mantener la estructura. Para las partes cosméticas,
<abbr title="Tereftalato de polietileno modificado con glicol">PETG</abbr> o
<abbr title="Acrilonitrilo butadieno estireno">ABS</abbr> pueden ofrecer una mayor resistencia al calor, la luz solar y
el paso del tiempo. El núcleo también podría imprimirse con materiales técnicos como
<abbr title="Poliamida 11">PA11</abbr> o <abbr title="Policarbonato reforzado con fibra de carbono">PC-CF</abbr> para
conseguir una pieza más resistente y duradera.

Debido al tamaño del proyecto y a la cantidad de material que consumía cada impresión, no podía permitirme realizar
varios prototipos completos. Diseñé el modelo evitando mecanismos innecesarios o soluciones que pudieran introducir
demasiada incertidumbre. Antes de imprimir la guitarra definitiva preparé pequeñas secciones de prueba para comprobar
las uniones con tornillos, los alojamientos de la electrónica y los puntos donde las diferentes piezas tenían que
encajar.

El resultado fue correcto en el primer prototipo completo. Tengo una única guitarra funcional y dos juegos de
personalización, uno con forma de Stratocaster y otro de Les Paul. El cambio entre ambos no modifica su sonido ni su
funcionamiento, pero transforma completamente su apariencia.

Como instrumento, Modulcaster es más ligera que una guitarra convencional con cuerpo de madera. Su sonido depende
principalmente de los componentes del kit de Harley Benton: no es una guitarra de gama alta, pero tampoco suena mal y
resulta completamente funcional. Aprendí a tocar un poco durante mi adolescencia, aunque con los años he perdido casi
toda la práctica. Actualmente mi Modulcaster funciona más como pieza decorativa que como instrumento de uso habitual.

Personalmente sigo prefiriendo la versión Stratocaster, pero la Les Paul ha sido, con diferencia, la que más ha llamado
la atención de la comunidad. En el momento de escribir esta página, ambas acumulan juntas más de 1.700 descargas y más
de 600 "me gusta". Por número de descargas, solo quedan por detrás de mi papelera para la puerta del coche entre mis
diseños publicados.

La parte más interesante del proyecto ha sido comprobar que la idea podía servir realmente como una base para otras
personas. Un usuario diseñó una preciosa reinterpretación de cuerpo hueco inspirada en las
[guitarras de jazz][modulcaster-jazz] y los violines. Otro modificó la Les Paul incorporando la
[topografía del Everest][modulcaster-everest] para crear un regalo personal para su padre. Ambos proyectos llevaron
Modulcaster mucho más lejos de lo que yo había imaginado.

<img
  src="/images/projects/modulcaster-community.png"
  alt="
    A la izquierda una fotografía de una modificación de la Les Paul, que en lugar del espiral, presenta la topografía
    del Himalaya, el perfil de la guitarra es negro como el mastil mientras que el golpeador es blanco, el relieve de la
    topografía está además en un gradiente de color donde se muestra en rojo las zonas mas altas pasando por naranja y
    amarillo hasta el verde para las zonas mas bajas. A la derecha el diseño 3D de una modificación de la misma Les Paul
    que en lugar de la espiral del diseño original tiene detalles que recuerdan al cuerpo de un violín o una guitarra
    de jazz, el cuerpo está en color dorado e incluye un golpeador especial que también recuerda a ese estilo jazz de
    color blanco.
">

Para mí, el proyecto está terminado. Podría diseñar nuevas personalizaciones en el futuro, pero mantendría el núcleo
actual para no romper la compatibilidad con las guitarras y piezas que ya han sido impresas.

Los modelos pueden descargarse gratuitamente desde Printables, tanto la [versión Stratocaster][modulcaster-stratocaster]
como la [versión Les Paul][modulcaster-les-paul], y están publicados bajo una licencia Creative Commons CC BY-NC-SA 4.0.
Esto permite compartirlos y crear nuevas versiones a partir de ellos, siempre que se reconozca la autoría, se mantenga
la misma licencia y no se utilicen comercialmente.

Modulcaster es uno de los objetos más grandes que he diseñado e impreso, pero su tamaño no es lo que más me satisface.
Lo importante es haber creado un sistema que otras personas pueden adaptar a sus gustos. Diseñar una guitarra está bien,
diseñar una base con la que otras personas puedan crear muchas guitarras diferentes es bastante más interesante.

[prusacaster]: https://www.printables.com/model/398795
[modulcaster-stratocaster]: https://www.printables.com/model/421668
[modulcaster-les-paul]: https://www.printables.com/model/442944
[modulcaster-jazz]: https://www.printables.com/model/734265
[modulcaster-everest]: https://www.printables.com/make/2285217

<script lang="ts" setup>
import { useData } from 'vitepress'
import SocialLinks from '@/components/SocialLinks/SocialLinks.vue'

const { frontmatter } = useData()
</script>
