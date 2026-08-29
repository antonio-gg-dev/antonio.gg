---
title: Qué debería contener un `.gitignore`
command: ['blog open que-deberia-contener-un-gitignore.md']
author: Antonio
tags: [git, organización, software]
description: El .gitignore se ha convertido muchas veces en un cajón de sastre donde terminan configuraciones de IDEs,
  sistemas operativos y herramientas personales que no forman parte del proyecto. En este artículo propongo separar las
  exclusiones compartidas de las personales usando .gitignore, .git/info/exclude y ~/.config/git/ignore.
created_at: 2026-08-31
cover_url: /images/blog/2026-08-31-que-deberia-contener-un-gitignore.png
cover_alt: Imagen de portada del artículo "Qué debería contener un .gitignore". Muestra los textos .gitignore,
  .gitignore.local y ~/.gitignore en distintos colores.
---

# {{ frontmatter.title }}

{{ frontmatter.description }}

<img :src="frontmatter.cover_url" :alt="frontmatter.cover_alt">

Crea un proyecto con prácticamente cualquier framework moderno y abre su `.gitignore`. Es bastante probable que
encuentres algo parecido a esto:

```text
node_modules/
vendor/
dist/
.env

.idea/
.vscode/
.DS_Store
Thumbs.db
.cursor/
.codex/
```

A primera vista no parece haber ningún problema. Son archivos que normalmente no queremos subir al repositorio y el
`.gitignore` sirve precisamente para ignorar archivos. Pero hay una diferencia importante entre las primeras líneas y
las últimas.

`node_modules`, `vendor`, `dist` o `.env` existen como consecuencia del proyecto y de cómo hemos decidido desarrollarlo.
`.idea`, `.vscode`, `.DS_Store` o `.cursor`, en cambio, existen como consecuencia de las herramientas y el sistema que
utiliza un desarrollador concreto.

¿Por qué debería un proyecto saber que yo utilizo PhpStorm, WebStorm, VS Code, macOS, Windows, Cursor o cualquier otra
herramienta?

## El `.gitignore` como cajón de sastre

Con el tiempo hemos convertido el `.gitignore` en el lugar donde colocar cualquier archivo que no queremos ver en
`git status`.

Aparece un directorio nuevo (`.idea/`). Lo añadimos al `.gitignore`. Otro desarrollador utiliza VS Code (`.vscode/`).
También al `.gitignore`. Después aparecen nuevas herramientas (`.cursor/` y `.codex/`). Y volvemos a hacer exactamente
lo mismo.

Es cómodo, funciona y evita que esos archivos terminen accidentalmente en un commit. Por eso la práctica se ha extendido
hasta convertirse prácticamente en un estándar. **El problema es que rara vez nos preguntamos si esa regla pertenece
realmente al proyecto**.

Un `.gitignore` puede terminar convirtiéndose en una pequeña colección de todas las herramientas, editores y sistemas
operativos que algún desarrollador ha utilizado alguna vez. Y cada nueva herramienta tiene muchas posibilidades de
añadir una línea más...

## ¿Quién debería decidir ignorar un archivo?

Para mí, la pregunta importante no es qué extensión tiene un archivo ni qué herramienta lo genera. La pregunta es:

> ¿Esta regla pertenece al proyecto o a mi forma personal de trabajar con él?

Si todos los desarrolladores necesitan tomar la misma decisión sobre un archivo, tiene sentido que esa decisión forme
parte del proyecto. Si la decisión depende de las herramientas que utilizo yo, debería formar parte de mi entorno.

Por ejemplo:

| Archivo         | Responsabilidad |
| --------------- | --------------- |
| `node_modules/` | Proyecto        |
| `vendor/`       | Proyecto        |
| `dist/`         | Proyecto        |
| `.env`          | Proyecto        |
| `.idea/`        | Desarrollador   |
| `.vscode/`      | Desarrollador   |
| `.DS_Store`     | Desarrollador   |
| `Thumbs.db`     | Desarrollador   |
| `.cursor/`      | Desarrollador   |

`.env` es un ejemplo interesante. Cada desarrollador tendrá normalmente su propio archivo, pero que ese archivo no deba
versionarse es una política compartida del proyecto. Por eso tiene sentido incluirlo en `.gitignore` y versionar, por
ejemplo, un `.env.example`.

No estamos clasificando archivos según quién los crea, sino según **quién debería ser responsable de decidir qué hacer
con ellos**.

## Git ya contempla esta separación

Esta distinción no requiere inventar ningún mecanismo adicional. Git dispone de diferentes niveles para definir
exclusiones y su propia documentación distingue sus responsabilidades.

- Para reglas compartidas por todos los desarrolladores tenemos `.gitignore`
- Para reglas personales que únicamente necesitamos en un repositorio concreto tenemos `.git/info/exclude`
- Y para reglas personales que queremos aplicar en todos nuestros repositorios tenemos `~/.config/git/ignore`

La propia documentación de Git pone como ejemplo para el ignore global los archivos temporales o backups generados por
el editor elegido por el usuario.

Podemos resumirlo así:

```text
¿Todos los desarrolladores deberían ignorarlo?
├── Sí → .gitignore
└── No
    ├── ¿Quiero ignorarlo en todos mis repositorios?
    │   └── Sí → ~/.config/git/ignore
    └── ¿Solo quiero ignorarlo en este repositorio?
        └── Sí → .git/info/exclude
```

## El ignore global

Git utiliza por defecto `~/.config/git/ignore`

Ahí podemos colocar todo aquello relacionado con nuestro entorno habitual de desarrollo. Por ejemplo:

```text
.idea/
.vscode/
.DS_Store
Thumbs.db
.cursor/
```

A partir de ese momento no necesitamos volver a añadir estas reglas en cada proyecto. Si utilizamos PhpStorm, ignoramos
`.idea`. Trabajamos en macOS, ignoramos `.DS_Store`. Una sola vez cada cosa, no una vez por repositorio.

### Mi configuración personal

Personalmente prefiero tener este archivo directamente en:

```text
~/.gitignore
```

No ofrece ninguna ventaja funcional. Simplemente me resulta más fácil de recordar y localizar. Git permite cambiar la
ubicación mediante `core.excludesFile`:

```bash
touch ~/.gitignore
git config --global core.excludesFile ~/.gitignore
```

Podemos comprobar la configuración con:

```bash
git config --global --get core.excludesFile
```

Esta es únicamente mi preferencia. Si no tenemos ningún motivo para cambiarlo, `~/.config/git/ignore` es la ubicación
nativa y no necesita configuración adicional.

## Exclusiones personales para un proyecto

Hay otro caso que un ignore global no resuelve. Imaginemos que estamos trabajando en un repositorio y queremos crear
algunos archivos auxiliares:

```text
notes.md
scratch/
local-tools/
```

No deberían formar parte del proyecto, pero tampoco tiene sentido ignorarlos en todos nuestros repositorios. Para esto
Git proporciona: `.git/info/exclude`

Funciona utilizando las mismas reglas que un `.gitignore`, pero su contenido permanece dentro de la carpeta `.git` de
ese repositorio y por tanto no se versiona.

Git lo describe precisamente como el lugar para archivos auxiliares específicos del workflow de un usuario en un
repositorio concreto. Podríamos tener estos archivos ahí sin modificar absolutamente nada del proyecto pero, evitando
ignorarlos accidentalmente en todos los proyectos que trabajemos.

### Mi `.gitignore.local`

El único inconveniente que encuentro a `.git/info/exclude` es puramente práctico: está escondido dentro de la carpeta
`.git`. Por comodidad suelo crear un enlace simbólico desde la raíz:

```bash
echo '/.gitignore.local' >> .git/info/exclude
ln -s .git/info/exclude .gitignore.local
```

Así termino teniendo dos archivos en la raiz del proyecto, `.gitignore` y `.gitignore.local`. El primero contiene las
reglas del proyecto. El segundo contiene las mías.

`.gitignore.local` no es ninguna funcionalidad especial de Git. Es simplemente un enlace simbólico a
`.git/info/exclude`. Git seguirá leyendo `.git/info/exclude` de forma nativa; el enlace únicamente me permite tenerlo
más a mano.

## Las plantillas no deberían decidir por nosotros

Existen repositorios como [`github/gitignore`](https://github.com/github/gitignore/) que proporcionan plantillas para
multitud de lenguajes, frameworks, herramientas, editores y sistemas operativos.

Son recursos útiles, pero no deberían sustituir la decisión de qué necesita realmente nuestro proyecto.

De hecho, el propio repositorio de GitHub separa sus plantillas generales de una carpeta `Global` destinada
específicamente a editores, herramientas y sistemas operativos, recomendando utilizar esas reglas como configuración
global cuando corresponda.

Sin embargo, es habitual crear un proyecto nuevo con cualquier framework y recibir directamente un `.gitignore` que
incluye reglas para varios IDEs, sistemas operativos y herramientas que quizá ninguno de sus desarrolladores utilice.

Después copiamos esas reglas al siguiente proyecto. Y al siguiente. Hasta que dejamos de plantearnos por qué están ahí.
Incluso los boilerplates de los frameworks las incluyen.

Los desarrolladores somos bastante cómodos para estas cosas. Si aparece algo molesto en `git status`, añadirlo al
`.gitignore` es la solución inmediata. Pero que algo sea cómodo no significa que sea responsabilidad del proyecto.

## Un IDE puede formar parte del proyecto

Esto tampoco significa que `.idea` o `.vscode` deban estar siempre fuera del repositorio. Un equipo puede decidir
utilizar una herramienta concreta y compartir parte de su configuración.

Por ejemplo, puede decidir versionar tareas, configuraciones de debugging o extensiones recomendadas para VS Code porque
forman parte del entorno de desarrollo que el equipo quiere ofrecer.

En ese momento la situación cambia. Ya no estamos hablando de:

> Yo utilizo VS Code.

Estamos hablando de:

> El equipo utiliza VS Code y el proyecto proporciona una configuración para VS Code.

La herramienta sigue siendo externa, pero compartir esa configuración es ahora una decisión intencional del proyecto. Lo
importante no es establecer una lista universal de archivos permitidos y prohibidos. Lo importante es saber **por qué
están ahí**.

## Los agentes están repitiendo el mismo problema

**La llegada de los agentes de programación ha hecho todavía más visible este problema**.

Ahora encontramos archivos y directorios como en TODOS los proyectos:

```text
.cursor/
.codex/
CLAUDE.md
AGENTS.md
```

Y podemos caer fácilmente en la misma dinámica que seguimos durante años con los IDEs y sistemas operativos. Pero otra
vez, el nombre del archivo no determina dónde debería estar.

`AGENTS.md`, por ejemplo, es un formato abierto pensado para proporcionar a los agentes información compartida sobre un
proyecto: comandos, arquitectura, convenciones o instrucciones de desarrollo.

Si un proyecto utiliza agentes y quiere proporcionar estas instrucciones a cualquiera que trabaje en él `AGENTS.md`
forma parte del proyecto y debería versionarse.

Sin embargo, imaginemos que contribuimos a un proyecto open source que no utiliza agentes y creamos nuestro propio
`AGENTS.md` para trabajar cómodamente con él.

Ese archivo no pertenece al proyecto. Pertenece a nuestro workflow dentro de ese repositorio, así que podemos añadirlo
a `.git/info/exclude`. Exactamente el mismo archivo puede tener responsabilidades distintas dependiendo del contexto.

## Adaptar el proyecto a nuestra herramienta

También podemos encontrarnos con proyectos que ya proporcionan instrucciones para agentes mediante un formato común como
`AGENTS.md`, mientras nuestra herramienta espera otro archivo.

Claude Code, por ejemplo, utiliza `CLAUDE.md` para proporcionar instrucciones de proyecto. Anthropic diferencia además
entre instrucciones compartidas del proyecto y preferencias personales del usuario.

Si el proyecto ha decidido utilizar `AGENTS.md`, no considero necesario añadir un segundo documento únicamente porque yo
haya decidido utilizar Claude.

Podemos adaptar nuestro entorno:

```bash
ln -s AGENTS.md CLAUDE.md
```

Y añadir `/CLAUDE.md` a nuestro `.git/info/exclude`.

De esta forma:

```text
AGENTS.md → responsabilidad del proyecto
CLAUDE.md → adaptación de mi herramienta
```

El proyecto publica su documentación una vez y cada desarrollador adapta sus herramientas cuando lo necesita.

Las herramientas que soportan `AGENTS.md` pueden utilizar enlaces simbólicos como mecanismo de compatibilidad con
nombres anteriores, por lo que este tipo de adaptación encaja bien con ese enfoque.

Naturalmente, si el equipo decide oficialmente soportar Claude y mantener un `CLAUDE.md`, entonces vuelve a ser una
decisión del proyecto y tendrá sentido versionarlo.

## Proyectos open source con muchos contribuidores

Hay un argumento razonable a favor de añadir reglas al `.gitignore` como `.idea/`, `.vscode/` o `.DS_Store` a proyectos
open source con cientos o miles de contribuidores. Hacerlo evita ruido y reduce la posibilidad de recibir
accidentalmente archivos personales en pull requests. Es una decisión pragmática que puedo entender.

Pero conviene diferenciar entre **proteger defensivamente un repositorio** y determinar de quién es realmente la
responsabilidad.

Que un proyecto ignore `.DS_Store` para evitar errores de sus contribuidores no convierte `.DS_Store` en algo
relacionado con el proyecto.

**Sigue siendo un archivo generado por el sistema de un desarrollador concreto**.

Para mí, **cada desarrollador debería ser responsable de configurar correctamente su entorno y comprobar qué archivos
está aportando antes de realizar un commit**.

Un repositorio puede decidir protegerse de esos errores por comodidad, especialmente cuando recibe contribuciones de
mucha gente, pero **esa excepción pragmática no debería convertirse automáticamente en la configuración por defecto de
todos nuestros proyectos**.

## Limpiar un `.gitignore` existente

Aplicar esta separación a un proyecto existente suele ser bastante sencillo. Podemos empezar revisando su `.gitignore`
y después clasificamos cada entrada preguntándonos si representa una decisión del proyecto o de nuestro entorno.

Por ejemplo, podríamos pasar de:

```text
node_modules/
dist/
.env
.idea/
.vscode/
.DS_Store
.cursor/
```

A:

```text
node_modules/
dist/
.env
```

Y mover los que correspondan a nuestro ignore global:

```text
.vscode/
.DS_Store
.cursor/
```

Si hay alguna exclusión únicamente necesaria para ese repositorio, la movemos a `.git/info/exclude`.

No necesitamos cambiar nada más.

## Ignorar no significa dejar de versionar

Hay una diferencia importante entre un archivo ignorado y un archivo que Git ya está siguiendo.

Añadir una regla a cualquier ignore no afecta a archivos que ya están versionados. Git lo especifica explícitamente en
su documentación.

Si hemos decidido que un archivo que actualmente forma parte del repositorio ya no debería estar versionado, tendremos
primero que eliminarlo del índice:

```bash
git rm --cached path/to/file
```

Si es un directorio:

```bash
git rm --cached -r path/to/directory
```

Después podremos ignorarlo.

Esto es importante porque dejar de versionar algo sí modifica el repositorio y debe ser una decisión compartida. No
deberíamos ejecutar `git rm --cached` simplemente porque personalmente no queremos ver un archivo que el proyecto ha
decidido mantener.

## Saber por qué se está ignorando algo

Cuando utilizamos distintos niveles de exclusión puede resultar difícil saber qué regla está afectando a un archivo. Git
proporciona:

```bash
git check-ignore -v path/to/file
```

El comando nos muestra tanto la regla que ha coincidido como el archivo del que procede. Esto permite saber rápidamente
si una exclusión viene del `.gitignore` del repositorio, de nuestro `.git/info/exclude` local para ese repositorio o de
nuestro `~/.config/git/ignore` global.

## Mantener las responsabilidades separadas

El `.gitignore` no debería ser una colección de todos los archivos que algún desarrollador podría querer ignorar.
Debería representar las decisiones de exclusión que pertenecen al proyecto. Git ya nos proporciona herramientas para
separar las demás responsabilidades:

```text
.gitignore
    → decisiones compartidas del proyecto

.git/info/exclude
    → decisiones personales para un repositorio concreto

~/.config/git/ignore
    → decisiones personales para todos los repositorios
```

Podemos utilizar otra ubicación o crear accesos más cómodos, como `~/.gitignore` o mi `.gitignore.local`, pero la
separación conceptual sigue siendo la misma.

Las herramientas que utilizamos cambian continuamente. Antes fueron Vim, Eclipse, IntelliJ o VS Code. Ahora también son
Cursor, Codex, Claude y otros agentes. Dentro de unos años seguramente utilizaremos otras.

**Nuestros repositorios no necesitan conservar un inventario de todas ellas**.

**Si una configuración pertenece al proyecto, debería formar parte de él**.

**Si pertenece a cómo hemos decidido trabajar nosotros, la responsabilidad de ignorarlo también debería ser nuestra**.

<script lang="ts" setup>
import { useData } from 'vitepress'

const { frontmatter } = useData()
</script>
