---
title: Cohesión y acoplamiento
description: Imagina que tenemos una aplicación desarrollada con Laravel que permite registrar usuarios. La API recibe
  un nombre y un correo electrónico. El controlador valida la petición, crea un modelo de Eloquent y almacena el momento
  del registro como un Unix timestamp. Es poco código, se entiende rápidamente y cumple su objetivo...
created_at: 2026-07-30
cover_url: /images/blog/2026-07-30-cohesion-y-acoplamiento.png
cover_alt: Imagen de portada del artículo "Cohesión y acoplamiento" muestra un esquema con una serie de engranajes
  que encajan entre si con el título del artículo escrito encima.
---

# {{ frontmatter.title }}

{{ frontmatter.description }}

<img :src="frontmatter.cover_url" :alt="frontmatter.cover_alt">

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class RegisterUserController
{
    public function __invoke(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string'],
            'email' => ['required', 'email'],
        ]);

        $user = User::query()->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'registered_at' => time(),
        ]);

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'registeredAt' => date(DATE_ATOM, $user->registered_at),
        ], 201);
    }
}
```

Un tiempo después decidimos cambiar la forma en la que se almacena `registered_at`. En lugar de guardar un Unix
timestamp, queremos almacenar la fecha utilizando el formato ISO 8601. **Desde el punto de vista del negocio no ha
cambiado nada**.

Un usuario sigue teniendo una fecha de registro. La API continúa recibiendo los mismos datos y puede seguir devolviendo
exactamente la misma respuesta. Sin embargo, el cambio nos obliga a modificar el controlador.

También tendremos que revisar el modelo de Eloquent, sus casts, la serialización y probablemente varias pruebas que no
pretendían comprobar el formato utilizado en la base de datos.

**Una decisión puramente técnica se ha propagado por diferentes partes de la aplicación**. ¿Por qué un cambio en la
representación de una fecha obliga a modificar código al que esa decisión no debería concernir? Para mí, esta pregunta
resume bastante bien los conceptos de cohesión y acoplamiento.

## Cohesión

**La cohesión está formada por elementos que están relacionados entre sí y que, por lo tanto, tiene sentido que cambien
juntos**. Cuando cambia lo que conforma un usuario dentro de nuestro negocio, es razonable que cambie la entidad `User`.

También es razonable que cambien los repositorios de usuarios, porque su responsabilidad es almacenar y recuperar
objetos `User`. Necesitan conocerlos, construirlos y adaptar su persistencia a aquello que representan. `User` y
`UserRepository` tienen responsabilidades diferentes, pero existe cohesión entre ellos. El repositorio existe alrededor
del concepto de usuario. Si cambia ese concepto, se espera que los repositorios cambien con él.

La cohesión no está limitada al interior de una clase. Puede existir entre métodos, objetos, clases o módulos completos.
Tampoco depende de que esos elementos estén físicamente juntos. Podemos colocar las entidades en una carpeta, los
repositorios en otra y los casos de uso en una tercera. Eso no elimina las relaciones que existen entre ellos.

La arquitectura no está en el árbol de carpetas. Está en la forma en la que colaboran los componentes y en las
dependencias que existen entre ellos. Dos proyectos pueden tener exactamente la misma estructura de directorios y
arquitecturas completamente distintas.

## Acoplamiento

**El acoplamiento es el grado de dependencia que existe entre distintos elementos**. En sentido estricto, siempre que un
componente utiliza otro existe acoplamiento.

Un caso de uso depende de las entidades, repositorios y servicios que necesita para alcanzar su objetivo. Si cambia el
contrato de uno de esos componentes, es posible que el caso de uso tenga que cambiar también. Eso no tiene por qué ser
malo.

Cuando decimos que una clase "está acoplada", normalmente nos estamos refiriendo a la parte no deseada de esa
dependencia: cambios externos que influyen en el diseño interno de un componente al que no deberían afectar.

La responsabilidad de `UserRepository` es almacenar y recuperar usuarios. Es coherente que cambie cuando cambia `User`.
Sin embargo, `User` no debería cambiar porque hemos sustituido Eloquent, migrado a otro motor de base de datos o
decidido almacenar una fecha de otra manera. Esas decisiones no pertenecen al dominio.

Lo que conforma un usuario para nuestro negocio debería mantenerse igual mientras el negocio no haya cambiado. Una
pregunta que utilizo para detectar este tipo de acoplamiento es:

> ¿Este cambio viene de mi negocio o de una dependencia que estoy utilizando?

La dependencia puede ser un framework, una librería, una base de datos, un servicio externo o incluso nuestra propia
API. Si una decisión externa obliga a modificar nuestro dominio, probablemente hemos permitido que esa dependencia
atraviese una frontera que no debería haber cruzado.

## Cohesión y acoplamiento no son opuestos

Una de las frases más repetidas al hablar de diseño de software es:

> Alta cohesión y bajo acoplamiento.

Me parece un excelente objetivo general para un proyecto, pero puede interpretarse de una forma demasiado simplista. La
cohesión y el acoplamiento son atributos diferentes. No son los extremos de una misma escala.

Dos componentes pueden tener simultáneamente mucha cohesión y un acoplamiento muy elevado. Un caso de uso está acoplado
a cada una de las partes que utiliza. Si cambia una de esas partes, puede ser completamente razonable que el caso de uso
tenga que adaptarse. Todos esos componentes colaboran para alcanzar el mismo objetivo. Existe cohesión entre ellos y su
acoplamiento es deseable.

El problema aparece especialmente cuando el acoplamiento es alto y la cohesión es baja.

| Cohesión | Acoplamiento | Interpretación                                                        |
| -------- | ------------ | --------------------------------------------------------------------- |
| Alta     | Bajo         | El objetivo general entre las clases y módulos de un proyecto         |
| Alta     | Alto         | Puede ser deseable entre componentes estrechamente relacionados       |
| Baja     | Bajo         | Elementos independientes o extremadamente sencillos                   |
| Baja     | Alto         | Muchas dependencias entre elementos sin una relación conceptual clara |

A nivel general queremos que nuestras clases y módulos sean cohesivos y estén poco acoplados entre sí.

Pero, al observar dos componentes concretos, un acoplamiento elevado puede ser perfectamente razonable si también existe
una cohesión elevada.

## El problema no es Laravel

Volvamos al controlador inicial. El problema no es que utilice Laravel ni que trabaje con Eloquent.

Los frameworks solucionan problemas reales. Permiten prototipar rápidamente y ofrecen herramientas maduras para
necesidades habituales como el enrutado, la validación, la persistencia o la gestión de colas.

**El problema es que nuestro controlador está realizando demasiadas tareas**:

- Obtiene los datos de una petición HTTP.
- Valida esos datos.
- Ejecuta el registro del usuario.
- Decide cómo se almacena.
- Conoce el formato de la fecha en la base de datos.
- Construye la respuesta HTTP.

Una misma clase está mezclando la interfaz HTTP, la aplicación, el dominio y la persistencia.

De hecho, estamos omitiendo el dominio por completo. Nuestro usuario no es un concepto propio de la aplicación: es
simplemente el modelo que nos proporciona el ORM. El controlador tiene poca cohesión porque reúne tareas diferentes.

Al mismo tiempo, presenta un acoplamiento muy elevado porque conoce Laravel, HTTP, Eloquent y la estructura de la tabla
`users`. Cada una de esas partes puede cambiar por motivos distintos.

- Si cambia el formato de la petición, cambia el controlador.
- Si cambia el proceso de registro, cambia el controlador.
- Si cambia la representación de la fecha en la base de datos, cambia el controlador.
- Si cambia la respuesta HTTP, vuelve a cambiar el controlador.

**La clase se ha convertido en un punto de encuentro para cambios que no están relacionados**.

## El coste aparece cuando algo cambia

Mientras la aplicación es pequeña y sus requisitos permanecen estables, el diseño inicial puede parecer suficiente. El
problema se hace visible cuando necesitamos modificarlo.

En nuestro ejemplo, la fecha de registro se almacenaba inicialmente como un entero:

```text
1785338400
```

Ahora queremos almacenarla como ISO 8601:

```text
2026-07-29T15:00:00+02:00
```

El significado de la fecha no ha cambiado. Solo hemos modificado su representación en persistencia. Aun así, el
controlador necesita dejar de utilizar `time()` y debe conocer ahora el nuevo formato.

Las pruebas del controlador también cambiarán si esperaban un valor entero o si preparaban directamente un modelo de
Eloquent con esa representación.

Otras partes que utilicen `registered_at` pueden necesitar adaptarse también. El detalle de infraestructura se ha
filtrado por la aplicación.

Este tipo de diseño suele producir otras señales:

- Una operación sencilla resulta difícil de probar.
- Las pruebas necesitan preparar demasiadas dependencias.
- El mismo código aparece repetido en distintos controladores.
- Una pequeña modificación obliga a recorrer demasiados archivos.
- Una clase importa elementos pertenecientes a contextos completamente diferentes.
- Cambiar una herramienta externa obliga a modificar reglas internas.

Cuando algo es difícil de probar, normalmente tiene demasiadas responsabilidades, demasiado acoplamiento o ambas cosas.

**Las pruebas no crean el problema. Lo hacen visible**.

## Refactorizar progresivamente

Mejorar este diseño no exige rehacer toda la aplicación de una sola vez.

Podemos avanzar de forma progresiva, procurando que cada pieza nueva que introducimos ya tenga unas fronteras correctas.
En este caso comenzaría por separar el dominio y la persistencia.

Si extrajésemos primero un caso de uso que siguiera utilizando Eloquent directamente, únicamente estaríamos moviendo el
acoplamiento desde el controlador hacia una clase nueva.

### Representar el usuario en el dominio

Primero podemos crear una entidad `User` que represente lo que es un usuario para nuestro negocio.

```php
<?php

declare(strict_types=1);

namespace App\Domain\User;

use DateTimeImmutable;

final readonly class User
{
    public function __construct(
        public string $id,
        public string $name,
        public string $email,
        public DateTimeImmutable $registeredAt,
    ) {}
}
```

Para el dominio, `registeredAt` es una fecha. No es un Unix timestamp ni una cadena ISO 8601. Es un `DateTimeImmutable`.

La entidad no conoce Eloquent, las columnas de una tabla ni la forma en la que se serializará el valor. Mientras el
significado de la fecha no cambie para el negocio, esta clase no necesita modificarse.

### Definir el repositorio

Después podemos definir el contrato necesario para almacenar usuarios.

```php
<?php

declare(strict_types=1);

namespace App\Domain\User;

interface UserRepository
{
    public function save(User $user): void;
}
```

El contrato pertenece al interior de nuestra aplicación. La infraestructura será la encargada de adaptarse a él, no al
contrario.

En este punto el controlador podría continuar orquestando temporalmente el proceso, pero ya no necesitaría conocer cómo
se almacena el usuario.

La refactorización todavía no habría terminado, aunque habríamos creado una frontera útil.

### Transformar entre dominio e infraestructura

La implementación del repositorio puede seguir utilizando las herramientas que ofrece Laravel. En este ejemplo
utilizamos su query builder para acceder a la base de datos sin introducir otro modelo de usuario proporcionado por el
ORM.

```php
<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Database;

use App\Domain\User\User;
use App\Domain\User\UserRepository;
use Illuminate\Support\Facades\DB;

final readonly class DatabaseUserRepository implements UserRepository
{
    public function __construct(
        private UserTransformer $transformer,
    ) {}

    public function save(User $user): void
    {
        DB::table('users')->insert(
            $this->transformer->toDatabase($user),
        );
    }
}
```

El transformer se encarga de traducir entre el dominio y una representación concreta de infraestructura.

```php
<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Database;

use App\Domain\User\User;
use DateTimeImmutable;
use stdClass;

final class UserTransformer
{
    public function toDatabase(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'registered_at' => $user->registeredAt->format(DATE_ATOM),
        ];
    }

    public function fromDatabase(stdClass $user): User
    {
        return new User(
            id: $user->id,
            name: $user->name,
            email: $user->email,
            registeredAt: new DateTimeImmutable($user->registered_at),
        );
    }
}
```

El transformer pertenece a infraestructura porque conoce las dos representaciones:

- El objeto utilizado por el dominio.
- El formato concreto utilizado por la persistencia.

Si `registered_at` vuelve a almacenarse como Unix timestamp, el dominio no necesita cambiar. Solo cambia la traducción:

```php
<?php

declare(strict_types=1);

namespace App\Infrastructure\Persistence\Database;

use App\Domain\User\User;
use DateTimeImmutable;
use stdClass;

final class UserTransformer
{
    public function toDatabase(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'registered_at' => $user->registeredAt->getTimestamp(),
        ];
    }

    public function fromDatabase(stdClass $user): User
    {
        return new User(
            id: $user->id,
            name: $user->name,
            email: $user->email,
            registeredAt: (new DateTimeImmutable())->setTimestamp(
                $user->registered_at,
            ),
        );
    }
}
```

Unix timestamp, ISO 8601 o cualquier otra representación son decisiones de infraestructura. La fecha de registro sigue
siendo la misma para el dominio.

### Extraer el caso de uso

Una vez aislada la persistencia, podemos extraer el proceso de registro. El caso de uso pertenece a la capa de
aplicación y trabaja con DTOs de entrada y salida.

```php
<?php

declare(strict_types=1);

namespace App\Application\RegisterUser;

final readonly class RegisterUserInput
{
    public function __construct(
        public string $name,
        public string $email,
    ) {}
}
```

```php
<?php

declare(strict_types=1);

namespace App\Application\RegisterUser;

use App\Domain\User\User;

final readonly class RegisterUserOutput
{
    public function __construct(
        public User $user,
    ) {}
}
```

El caso de uso orquesta el dominio para alcanzar un objetivo concreto.

```php
<?php

declare(strict_types=1);

namespace App\Application\RegisterUser;

use App\Domain\User\User;
use App\Domain\User\UserRepository;
use DateTimeImmutable;
use Illuminate\Support\Str;

final readonly class RegisterUser
{
    public function __construct(
        private UserRepository $repository,
    ) {}

    public function execute(RegisterUserInput $input): RegisterUserOutput
    {
        $user = new User(
            id: Str::uuid()->__toString(),
            name: $input->name,
            email: $input->email,
            registeredAt: new DateTimeImmutable(),
        );

        $this->repository->save($user);

        return new RegisterUserOutput($user);
    }
}
```

El caso de uso está acoplado al DTO, a la entidad y al repositorio. Eso es deseable. Todos esos componentes colaboran
para registrar un usuario. Si cambia el proceso de registro, es razonable que algunas de estas piezas tengan que cambiar
juntas. Existe cohesión entre ellas.

### Reducir el controlador

Finalmente, el controlador puede limitarse a traducir entre HTTP y aplicación.

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Application\RegisterUser\RegisterUser;
use App\Application\RegisterUser\RegisterUserInput;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final readonly class RegisterUserController
{
    public function __construct(
        private RegisterUser $useCase,
    ) {}

    public function __invoke(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string'],
            'email' => ['required', 'email'],
        ]);

        $output = $this->useCase->execute(
            new RegisterUserInput(
                name: $data['name'],
                email: $data['email'],
            ),
        );

        return new JsonResponse([
            'id' => $output->user->id,
            'name' => $output->user->name,
            'email' => $output->user->email,
            'registeredAt' => $output->user->registeredAt->format(DATE_ATOM),
        ], 201);
    }
}
```

El controlador sigue estando acoplado a Laravel y HTTP. Debe estarlo, porque esa es su responsabilidad. No necesitamos
eliminar todo el acoplamiento. Necesitamos colocarlo donde corresponde.

Si en el futuro queremos registrar usuarios desde un comando, podemos crear otro adaptador de entrada que transforme sus
argumentos en un `RegisterUserInput`.

El mismo caso de uso podrá ejecutarse sin conocer si la entrada procede de HTTP, una consola, una cola o una prueba
automatizada.

## Repetir el cambio después de la refactorización

Volvamos a cambiar el formato de `registered_at`. Antes se almacenaba como Unix timestamp y ahora queremos utilizar
ISO 8601.

Después de la refactorización tendremos que modificar:

- La migración de la base de datos.
- El transformer de persistencia.
- Las pruebas específicas de esa infraestructura.

No necesitamos modificar:

- La entidad `User`.
- El caso de uso `RegisterUser`.
- Sus DTOs.
- El controlador.
- La respuesta de la API.
- Las pruebas del dominio o de aplicación.

El cambio se ha quedado en el lugar al que pertenece. Esto no significa que esas clases nunca vayan a cambiar.

Si el negocio decidiera que la fecha de registro debe ser opcional, que se puede modificar o que determina nuevas
reglas, entonces sí tendría sentido cambiar el dominio y los casos de uso relacionados.

En ese escenario, todos esos elementos cambiarían porque ha cambiado el mismo concepto. Eso es cohesión.

## Desacoplar también tiene un coste

La solución refactorizada tiene muchas más piezas que el controlador inicial. Hemos creado una entidad, un adaptador con
su contrato y su implementación, un transformer y un caso de uso con dos DTOs.

Cada una de esas abstracciones añade código y aumenta la cantidad de conceptos que el equipo necesita conocer y
mantener. El desacoplamiento no es gratuito.

Para un prototipo que sabemos que se va a desechar, puede ser razonable aceptar un acoplamiento elevado para avanzar
rápidamente. Combatir cualquier dependencia sin analizar el contexto puede añadir más complejidad de la que elimina.

Para mí, luchar contra el acoplamiento tiene mucho más valor en proyectos a largo plazo. En ellos, el sistema
evolucionará durante años y la deuda técnica terminará acumulándose.

Tampoco creo que sea necesario envolver automáticamente cada herramienta externa. Una dependencia puede aceptarse
directamente cuando cumple tres requisitos:

- Es confiable.
- Es estable.
- Resuelve un problema real.

Usar [Carbon](https://carbon.nesbot.com/) en lugar de las herramientas de fechas de PHP, por ejemplo, puede ser una
decisión consciente y razonable.

Un import de Carbon dentro del dominio muestra que existe una dependencia, pero no demuestra automáticamente que el
diseño sea incorrecto. El equipo puede haber estudiado el coste y haber decidido aceptar ese acoplamiento.

Lo importante es que sea una decisión intencional.

## El nivel de abstracción también debe ser cohesivo

Evitar abstracciones innecesarias no significa resolver cada parte del proyecto de una manera diferente. **La
homogeneidad aporta valor**.

Cuando los distintos módulos siguen unas estructuras similares, el equipo puede comprenderlos y modificarlos con menos
esfuerzo. Cada parte nueva se parece a las anteriores y sus responsabilidades resultan más predecibles. El nivel de
abstracción debe evolucionar con el proyecto.

El equipo debería analizar qué decisiones funcionan, detectar cuáles generan fricción y consensuar cómo quiere trabajar.
Algunas mejoras podrán aplicarse de forma retroactiva. Otras se introducirán progresivamente conforme se modifiquen las
partes afectadas.

No existe una arquitectura terminada que pueda diseñarse una vez y permanecer intacta. **La arquitectura también cambia
junto al conocimiento del equipo y del negocio**.

## La repetición no siempre implica cohesión

El código repetido suele ser una señal interesante. Si un comportamiento aparece en varios lugares, puede tener sentido
extraerlo para poder reutilizarlo.

Sin embargo, dos fragmentos pueden parecer iguales hoy y evolucionar por motivos diferentes mañana. Si los unimos
únicamente porque tienen una forma parecida, crearemos una dependencia entre componentes que no tienen cohesión.
Habremos eliminado algunas líneas duplicadas a cambio de aumentar el acoplamiento. Antes de extraer una abstracción
conviene preguntarse:

> ¿Estas partes representan realmente el mismo concepto y deberían cambiar juntas?

**La reutilización aporta valor cuando expresa una relación real. No cuando se limita a esconder código parecido**.

## Cómo revisar un diseño

No existe una métrica capaz de decidir automáticamente dónde termina una responsabilidad o qué dependencias debemos
aceptar. Pero podemos analizar las razones de cambio.

Estas son algunas de las preguntas que suelo hacerme:

- ¿Qué tarea realiza este componente?
- ¿Por qué tendría que cambiar?
- ¿Sus partes cambiarían por el mismo motivo?
- ¿Estos componentes pertenecen al mismo concepto?
- ¿Es razonable que evolucionen juntos?
- ¿Este cambio viene del negocio o de una herramienta externa?
- ¿Podría cambiar la infraestructura sin modificar el dominio?
- ¿Estoy mezclando HTTP, aplicación, dominio y persistencia?
- ¿La dificultad para probarlo revela demasiadas responsabilidades?
- ¿Estoy creando una abstracción real o uniendo código que solo se parece?
- ¿Puedo mejorar esta frontera progresivamente sin rehacer todo el sistema?

Los imports también ofrecen una señal sencilla. Si una entidad del dominio importa Eloquent, una excepción HTTP o una
clase específica de Laravel, existe un acoplamiento con esas herramientas. Puede ser una decisión válida, pero debería
ser una decisión consciente.

## Alta cohesión y bajo acoplamiento

La cohesión y el acoplamiento describen cómo se propagará el cambio por nuestro sistema. La cohesión mantiene
relacionados los componentes que pertenecen al mismo concepto y que es razonable que evolucionen juntos.

El bajo acoplamiento evita que decisiones externas obliguen a modificar partes a las que no conciernen.

No se trata de eliminar todas las dependencias, crear interfaces para cada clase o aplicar arquitectura hexagonal,
DDD o cualquier otro enfoque de manera dogmática. Estas herramientas pueden ayudar, pero no son el objetivo.

El objetivo es diferenciar entre las dependencias que representan nuestro negocio y las que proceden de las herramientas
que hemos elegido. Un buen diseño no consigue que el código deje de cambiar. Consigue que cada cambio llegue únicamente
a los lugares donde tiene sentido.

## El siguiente paso

Aunque hemos separado el dominio de HTTP y la persistencia, `name` y `email` siguen siendo simples cadenas. La petición
comprueba que los datos estén presentes y tengan la forma esperada, pero las reglas que determinan qué es un nombre o un
correo electrónico válido todavía no forman parte de nuestro dominio.

En la segunda parte continuaremos esta refactorización utilizando value objects para representar ambos conceptos. La
interfaz HTTP seguirá ocupándose de validar la entrada que recibe, mientras que el dominio protegerá sus propias
invariantes. Así, si cambian las reglas de un nombre o un correo electrónico válido, el cambio llegará al dominio en
lugar de quedar repartido entre controladores y reglas específicas del framework.

<script lang="ts" setup>
import { useData } from 'vitepress'

const { frontmatter } = useData()
</script>
