---
title: ¿Necesito un `nvm` para PHP?
command: ['blog open necesito-un-nvm-para-php.md']
author: Antonio
tags: [php, docker, desarrollo]
description: Cambiar la versión de PHP puede ser suficiente para un proyecto pequeño, pero no siempre define el entorno
  que la aplicación necesita. Esta es mi experiencia pasando de un pequeño pvm a Docker.
created_at: 2026-09-29
cover_url: /images/blog/2026-09-29-necesito-un-nvm-para-php.png
cover_alt: Ilustración de un terminal con varias versiones de PHP conectado mediante un puente a varios contenedores.
---

# {{ frontmatter.title }}

{{ frontmatter.description }}

<img :src="frontmatter.cover_url" :alt="frontmatter.cover_alt">

En algún momento casi todos terminamos con más de una versión de un mismo lenguaje instalada en el ordenador. Un
proyecto necesita una versión antigua, otro acaba de actualizarse y el siguiente todavía no funciona con ninguna de las
dos.

En el ecosistema de Node.js existe una solución bastante conocida: `nvm`, Node Version Manager. En PHP no hay una
herramienta con exactamente la misma presencia y experiencia, así que hace unos años me monté una de juguete. La llamé
`pvm`, PHP Version Manager.

El nombre era más ambicioso que el programa. Mi `pvm` no era un gestor de versiones completo. Era un pequeño script que
me ayudaba a ejecutar `update-alternatives` sin tener que recordar el comando. Aun así, me sirvió para entender una
diferencia que hoy me parece más importante que el nombre de la herramienta:

> Cambiar la versión de PHP no es lo mismo que reproducir el entorno de una aplicación.

## Qué problema resuelve `nvm`

`nvm` permite instalar y utilizar diferentes versiones de Node.js desde la cuenta de un usuario. Puedo instalar una
versión concreta, cambiar a otra en la sesión actual y definir una versión por defecto.

```bash
nvm install 20
nvm use 20
node --version
```

También puedo indicar la versión que necesita un proyecto en un archivo `.nvmrc`:

```text
20
```

Después, desde ese proyecto, `nvm use` puede leer el archivo y seleccionar la versión correspondiente. Esto resulta
especialmente útil cuando alterno entre repositorios con ciclos de vida distintos. No tengo que recordar qué versión
usaba cada proyecto ni cambiar manualmente enlaces simbólicos del sistema.

Hay una propiedad importante en este modelo: `nvm` se ocupa principalmente del runtime de Node.js. El proyecto sigue
teniendo que declarar sus dependencias de npm, su configuración y el resto de servicios que necesite. Es una solución
muy buena para un problema concreto.

## Mi `pvm` de juguete

Mi receta para PHP partía de una necesidad parecida. En Ubuntu, la forma habitual de instalar varias versiones consiste
en utilizar un repositorio que proporcione esos paquetes, instalarlas junto con sus extensiones y elegir cuál queda
activa mediante `update-alternatives`.

La parte esencial era parecida a esta:

```bash
sudo update-alternatives --config php
php --version
```

Para no escribirlo cada vez, creaba `~/bin/pvm`:

```bash
#!/bin/bash

sudo update-alternatives --config php
php --version
```

Y le daba permisos de ejecución:

```bash
chmod u+x ~/bin/pvm
```

Eso era todo. `pvm` no descargaba versiones, no entendía un archivo de proyecto y no configuraba extensiones.
Simplemente me ofrecía un nombre fácil de recordar para el mecanismo que ya tenía el sistema.

Como experimento personal era suficiente. Como solución general para un equipo, conviene describirlo con precisión: no
es un equivalente de `nvm`, sino un atajo para cambiar el ejecutable `php` que encuentra la línea de comandos.

### La receta completa

La receta original está pensada para Ubuntu o una distribución parecida, como Linux Mint. El primer paso es añadir un
repositorio que proporcione diferentes versiones de PHP:

```bash
sudo apt install software-properties-common gnupg2
sudo add-apt-repository ppa:ondrej/php
sudo apt update
```

Después puedo instalar cada versión que necesite junto con PHP-FPM, el cliente de línea de comandos y algunas
extensiones habituales. Por ejemplo:

```bash
PHP_VERSION=8.2

sudo apt install \
  "php${PHP_VERSION}" \
  "php${PHP_VERSION}-fpm" \
  "php${PHP_VERSION}-cli" \
  "php${PHP_VERSION}-curl" \
  "php${PHP_VERSION}-mbstring" \
  "php${PHP_VERSION}-xml" \
  "php${PHP_VERSION}-zip" \
  "php${PHP_VERSION}-intl" \
  "php${PHP_VERSION}-gd"
```

Para instalar PHP 8.3 repetiría el comando cambiando `PHP_VERSION`. Tener varias versiones instaladas no significa que
todas estén activas a la vez para la CLI. La versión que utilizará `php` se elige después con:

```bash
sudo update-alternatives --config php
```

Y se puede comprobar con:

```bash
php --version
```

Esta receta explica mejor qué había detrás de mi `pvm`: el script no hacía la instalación ni gestionaba versiones por
proyecto. Solo lanzaba el selector y mostraba el resultado.

He dejado los comandos completos y las versiones originales en mi
[gist sobre entornos PHP con varias versiones](https://gist.github.com/antonio-gg-dev/faf67658001f58eb186b34e1b7c67965).
Conviene leerlos como una receta para una máquina concreta, no como una configuración universal: el repositorio, las
versiones disponibles y las extensiones pueden cambiar.

## Cambiar `php` no cambia todo PHP

La diferencia empieza a importar cuando una aplicación necesita algo más que ejecutar un script sencillo.

Al seleccionar otra alternativa puedo cambiar el PHP utilizado desde la CLI. Pero una aplicación web puede estar usando
PHP-FPM detrás de Nginx o Apache. Los workers de una cola y las tareas programadas también pueden ejecutarse en otros
procesos. No basta con comprobar el resultado de `php --version` en mi terminal y asumir que todo el sistema está usando
la misma configuración.

También hay que considerar las extensiones. Una aplicación puede necesitar `pdo_pgsql`, `intl`, `gd` o `zip`, además de
una configuración concreta de `php.ini`. Instalar una versión adicional de PHP suele implicar decidir qué extensiones
acompañan a esa versión y comprobar que sus dependencias nativas están disponibles.

Por eso una guía de este tipo debe tener cuidado con comandos como este:

```bash
sudo apt remove php*
```

Puede ser útil para limpiar una máquina de pruebas, pero es una operación demasiado amplia para recomendarla como paso
normal. Puede eliminar paquetes que utiliza otro proyecto o dejar servicios configurados de una manera inesperada. En
general prefiero instalar la versión que necesito, comprobar las alternativas y retirar paquetes concretos solo cuando
sé exactamente qué estoy eliminando.

La otra limitación es que la máquina sigue siendo la responsable de proporcionar todo lo demás: Composer, las
extensiones, la base de datos, Redis, un servidor web, un servicio de correo o cualquier integración externa. `pvm`
puede resolver el primer elemento de la lista, pero no los demás.

## La pregunta cambia con el proyecto

En un proyecto pequeño quizá solo necesito ejecutar PHP desde la terminal. Si tengo una aplicación que funciona con PHP
8.2 y otra que funciona con PHP 8.4, instalar ambas versiones y cambiar entre ellas puede ser la solución más cómoda.

El problema aparece cuando la pregunta deja de ser:

> ¿Qué versión de PHP quiero ejecutar ahora?

Y pasa a ser:

> ¿Qué necesita esta aplicación para funcionar igual en mi ordenador, en el de otra persona y en CI?

En ese momento la versión de PHP es solo una parte de la respuesta.

## Lo que Docker cambia

Mi experiencia con Docker parte precisamente de esa segunda pregunta. En lugar de tratar PHP como una instalación global
de la máquina, describo un entorno que el proyecto puede construir y ejecutar.

Una imagen puede fijar la versión de PHP, instalar las extensiones necesarias, añadir Composer y copiar la configuración
de PHP. Docker Compose puede conectar ese contenedor con Nginx, PostgreSQL y otros servicios auxiliares.

La aplicación puede terminar teniendo una estructura parecida a esta:

```text
Aplicación
├── nginx
├── php-fpm + extensiones + Composer
├── PostgreSQL
└── servicios auxiliares
```

El código continúa montado como un volumen para poder editarlo desde el IDE. Lo que cambia es el lugar donde se ejecutan
PHP, Composer y los comandos del framework.

Por ejemplo, un `Dockerfile` podría expresar parte de la decisión de esta manera:

```dockerfile
FROM php:8.4-fpm

RUN docker-php-ext-install pdo pdo_pgsql intl gd zip

WORKDIR /appdata/www
```

El ejemplo es deliberadamente pequeño. En un proyecto real también hay que configurar las librerías del sistema, los
permisos, la depuración y los procesos que deban ejecutarse. La ventaja es que esas decisiones dejan de estar únicamente
en mi memoria o en el estado particular de mi ordenador.

## La terminal sigue siendo importante

Utilizar Docker no significa esconder todos los comandos detrás de una interfaz gráfica. En mis proyectos suelo tener
atajos que hacen explícito dónde se ejecuta cada cosa:

```bash
make start
make test
make shell-php
```

El primer comando construye y arranca el entorno. Los tests y Composer se ejecutan dentro del contenedor de PHP. Si
necesito inspeccionar el entorno, entro en el contenedor con un shell.

Esto añade una pequeña capa de comandos respecto a ejecutar `php` directamente en el host, pero también elimina una
fuente habitual de confusión. El PHP utilizado por la aplicación y el PHP utilizado para lanzar los tests son el mismo
PHP del contenedor.

En un entorno más completo, el mismo contenedor puede incluir PHP-FPM, un worker de colas y el proceso de tareas
programadas. No porque sea la única forma correcta de organizarlo, sino porque son procesos que forman parte del entorno
que la aplicación necesita. Compose se encarga de conectarlo con los servicios que viven fuera de PHP.

## `pvm` o Docker

No creo que Docker sea siempre la respuesta. Para un script personal, una kata o una aplicación muy sencilla, `pvm`
puede ser exactamente lo que necesito. Instalar varias versiones y cambiar la alternativa activa es rápido y tiene poca
ceremonia.

Docker empieza a compensar cuando el proyecto tiene más piezas o cuando varias personas tienen que reproducirlo. También
es especialmente útil cuando necesito probar extensiones, workers, tareas programadas y servicios externos sin modificar
la instalación global de mi ordenador.

| Necesidad                                              | Solución que elegiría                            |
| ------------------------------------------------------ | ------------------------------------------------ |
| Ejecutar una versión distinta de PHP en la terminal    | `pvm` o `update-alternatives`                    |
| Trabajar con un proyecto PHP pequeño y aislado         | Entorno local, si sus dependencias son sencillas |
| Fijar PHP, extensiones y Composer                      | Docker                                           |
| Levantar PHP junto con base de datos y otros servicios | Docker Compose                                   |
| Compartir el mismo entorno con el equipo y CI          | Docker                                           |

La comparación tampoco tiene por qué ser excluyente. Puedo mantener PHP instalado localmente para pequeños scripts y
usar Docker para la aplicación principal. Lo importante es saber qué parte del problema está resolviendo cada
herramienta.

## Conclusión

Mi `pvm` nació como un juguete con un nombre demasiado grande para un script de pocas líneas. Aun así, la idea era útil:
tener varias versiones de PHP instaladas y elegir una sin pelearme cada vez con el sistema.

Lo que no hacía era describir el entorno de la aplicación. No fijaba las extensiones, no levantaba PostgreSQL, no
configuraba PHP-FPM ni garantizaba que otra máquina tuviera las mismas librerías.

`nvm` y mi pequeño `pvm` son herramientas para cambiar de runtime. Docker es una herramienta para empaquetar y ejecutar
un entorno de desarrollo más completo.

Por eso ya no plantearía la decisión como “¿qué alternativa existe para PHP?”. La plantearía así:

> Si solo necesito seleccionar un ejecutable, un gestor local puede ser suficiente. Si necesito reproducir una
> aplicación, prefiero describir su entorno y dejar que Docker lo ejecute.

No es una cuestión de elegir la herramienta más grande. Es elegir el nivel de aislamiento y reproducibilidad que
realmente necesita el proyecto.

### Referencias

- [nvm: Node Version Manager](https://github.com/nvm-sh/nvm)
- [Docker: container-supported development](https://docs.docker.com/guides/container-supported-development/)
- [PHP: versiones soportadas](https://www.php.net/supported-versions.php)
- [Gist: PHP multi-version environment](https://gist.github.com/antonio-gg-dev/faf67658001f58eb186b34e1b7c67965)

<script lang="ts" setup>
import { useData } from 'vitepress'

const { frontmatter } = useData()
</script>
