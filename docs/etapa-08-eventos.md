# Etapa 8 — Eventos

La página de Eventos deja de estar vacía: muestra los próximos eventos en tarjetas y, más abajo, los que ya pasaron. La separación se hace sola comparando cada fecha con la de hoy.

Conceptos nuevos de esta etapa:

- Pasar un **objeto entero** como prop.
- Props opcionales con valor por defecto.
- Props booleanas abreviadas (`pasado` en vez de `pasado={true}`).
- Cada copia de un componente tiene **su propio estado**.
- `.filter()` y `.sort()`.
- Comparar fechas, y una trampa de `new Date('2026-10-24')`.
- Mostrar fechas en español con `toLocaleDateString`.
- Mostrar un mensaje cuando una lista está vacía.
- `<article>`, `<dl>` y `alt` en imágenes.

Archivos nuevos:

```
public/images/eventos/        Cinco imágenes provisorias (.svg)
src/
  data/events.ts              Los eventos
  utils/events.ts             Filtrar, ordenar y formatear fechas
  components/
    EventCard.tsx + .css      La tarjeta de un evento
  pages/
    Eventos.tsx + .css        La página
```

---

## 1. `src/data/events.ts`

```ts
// Eventos de ejemplo. Reemplazalos por los reales.
// La fecha va siempre con el formato "AAAA-MM-DD".

export type Evento = {
  id: number
  titulo: string
  fecha: string
  hora: string
  lugar: string
  descripcion: string
  // Datos extra que se muestran con el botón "Más información"
  masInformacion: string
  imagen: string
  // Texto alternativo. Vacío si la imagen es solo decorativa.
  imagenAlt: string
}

export const eventos: Evento[] = [
  {
    id: 1,
    titulo: 'Noche de alabanza',
    fecha: '2026-10-24',
    hora: '20:00',
    lugar: 'Templo principal',
    descripcion:
      'Una noche para cantar, orar y dar gracias a Dios juntos como iglesia.',
    masInformacion:
      'Entrada libre. Al terminar compartimos un café en el salón. Si querés sumarte al equipo de música, acercate a hablar con los líderes.',
    imagen: '/images/eventos/alabanza.svg',
    imagenAlt: '',
  },
  // ... cuatro más
]
```

Hay cinco eventos **de ejemplo**: tres futuros (octubre, noviembre y diciembre de 2026) y dos pasados (agosto y septiembre). Están inventados para que se vean las dos secciones; reemplazalos por los reales.

Los campos son los que pediste, más dos:

- `masInformacion`: el texto que aparece con el botón "Más información".
- `imagenAlt`: el texto alternativo de la imagen (punto 6.5).

### Por qué la fecha es un texto con formato `AAAA-MM-DD`

Podríamos haber guardado `fecha: new Date(2026, 9, 24)`. Pero un texto como `'2026-10-24'`:

- Se lee fácil: el mes 10 es octubre, sin la trampa de `getMonth()`.
- Es el formato estándar internacional (ISO 8601). Es el que usan las bases de datos y las APIs, así que cuando los eventos vengan de un backend van a llegar así.
- Ordenado alfabéticamente, queda ordenado por fecha (año, después mes, después día).

Se guarda como texto y se convierte en `Date` solo cuando hay que hacer cuentas.

---

## 2. `src/utils/events.ts`: la lógica de fechas

Toda la lógica vive acá, fuera del JSX, como pediste.

```ts
import type { Evento } from '../data/events'

// Convierte "2026-10-24" en una fecha a las 00:00 del calendario local.
// Ojo: new Date('2026-10-24') la interpreta en hora UTC, y en Argentina
// eso cae el día anterior a las 21:00.
export function crearFechaLocal(fechaTexto: string): Date {
  const [anio, mes, dia] = fechaTexto.split('-').map(Number)

  return new Date(anio, mes - 1, dia)
}

// Hoy a las 00:00. Así un evento de hoy cuenta como próximo todo el día.
function obtenerInicioDelDia(fecha: Date): Date {
  return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate())
}

export function esProximo(evento: Evento, hoy: Date = new Date()): boolean {
  return crearFechaLocal(evento.fecha) >= obtenerInicioDelDia(hoy)
}

function compararPorFecha(a: Evento, b: Evento): number {
  return crearFechaLocal(a.fecha).getTime() - crearFechaLocal(b.fecha).getTime()
}

// Los que todavía no pasaron, del más cercano al más lejano.
export function obtenerProximosEventos(
  eventos: Evento[],
  hoy: Date = new Date(),
): Evento[] {
  return eventos
    .filter((evento) => esProximo(evento, hoy))
    .sort(compararPorFecha)
}

// Los que ya pasaron, del más reciente al más antiguo.
export function obtenerEventosAnteriores(
  eventos: Evento[],
  hoy: Date = new Date(),
): Evento[] {
  return eventos
    .filter((evento) => !esProximo(evento, hoy))
    .sort((a, b) => compararPorFecha(b, a))
}

// "sábado, 24 de octubre de 2026"
export function formatearFecha(fechaTexto: string): string {
  return crearFechaLocal(fechaTexto).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
```

### 2.1 La trampa de `new Date('2026-10-24')`

Parece lo obvio para convertir el texto en fecha. Pero si lo escribís en la consola del navegador en Argentina, da:

```
Fri Oct 23 2026 21:00:00 GMT-0300
```

**Viernes 23**, no sábado 24. Lo comprobé en tu navegador.

¿Por qué? Cuando JavaScript recibe una fecha **sin hora** en ese formato, la interpreta como medianoche **en hora UTC** (la hora de Greenwich). Argentina está tres horas atrás, así que la medianoche de Greenwich del 24 es acá las 21:00 del 23. El sitio mostraría todos los eventos un día antes, y un evento de hoy aparecería como "pasado".

La solución es armar la fecha a mano, con el constructor que usa la hora **local**:

```ts
const [anio, mes, dia] = fechaTexto.split('-').map(Number)
return new Date(anio, mes - 1, dia)
```

Paso a paso con `'2026-10-24'`:

1. `.split('-')` corta el texto en cada guion: `['2026', '10', '24']`.
2. `.map(Number)` convierte cada pedazo en número: `[2026, 10, 24]`. Es el `.map()` de siempre; `Number` es una función que convierte texto en número, y se la pasamos directamente.
3. `const [anio, mes, dia] = ...` es destructuring de array, como en `useState`.
4. `new Date(2026, 10 - 1, 24)`: el `- 1` es por la trampa de los meses que empiezan en 0.

Resultado: sábado 24 de octubre a las 00:00, hora local.

### 2.2 Comparar fechas

```ts
crearFechaLocal(evento.fecha) >= obtenerInicioDelDia(hoy)
```

Las fechas se pueden comparar con `<`, `>`, `<=` y `>=`. Funciona porque por dentro una fecha es un número (los milisegundos desde 1970), y JavaScript compara esos números.

Lo que **no** funciona es `===`. Dos fechas distintas con el mismo valor son **dos objetos diferentes**, y `===` entre objetos pregunta "¿es el mismo objeto?", no "¿tienen el mismo valor?". Para saber si dos fechas son iguales se comparan los números: `a.getTime() === b.getTime()`.

### 2.3 Por qué "inicio del día"

`new Date()` incluye la hora exacta. Si hoy son las 22:00 y el evento es hoy, `crearFechaLocal` lo ubica a las 00:00, que ya pasó: el evento quedaría como "anterior" mientras todavía está ocurriendo.

`obtenerInicioDelDia` lleva el "hoy" también a las 00:00. Así se comparan **días**, no instantes, y un evento de hoy cuenta como próximo durante todo el día.

### 2.4 `.filter()`

```ts
eventos.filter((evento) => esProximo(evento, hoy))
```

`.filter()` recorre el array y se queda **solo con los elementos para los que la función devuelve `true`**. Devuelve un array nuevo, posiblemente más corto. El original no se toca.

```js
[5, 12, 3, 20].filter((n) => n > 10)   // [12, 20]
```

Para los anteriores se usa la misma función invertida con `!`:

```ts
eventos.filter((evento) => !esProximo(evento, hoy))
```

Así es imposible que un evento quede en las dos listas o en ninguna: la regla está escrita una sola vez, en `esProximo`.

La tabla de la etapa anterior, completa:

| Quiero... | Uso | Devuelve |
| --- | --- | --- |
| Convertir cada elemento | `.map()` | Mismo largo |
| Quedarme con algunos | `.filter()` | Igual o más corto |
| Encontrar uno | `.find()` | Un elemento o `undefined` |
| Ordenar | `.sort()` | El mismo array, ordenado |

### 2.5 `.sort()`

```ts
.sort(compararPorFecha)
```

`.sort()` ordena un array. Recibe una función que compara **dos elementos** (`a` y `b`) y devuelve un número:

- **Negativo**: `a` va antes que `b`.
- **Positivo**: `b` va antes que `a`.
- **Cero**: da igual.

```ts
function compararPorFecha(a: Evento, b: Evento): number {
  return crearFechaLocal(a.fecha).getTime() - crearFechaLocal(b.fecha).getTime()
}
```

Restar las dos fechas en milisegundos da exactamente eso: si `a` es anterior, el resultado es negativo y `a` va primero. Orden ascendente: del más cercano al más lejano.

Para los anteriores queremos lo contrario (el más reciente arriba), así que invertimos los argumentos: `compararPorFecha(b, a)`.

**Cuidado:** a diferencia de `.map()` y `.filter()`, `.sort()` **modifica** el array sobre el que se llama. Acá no hay problema porque lo llamamos sobre el resultado de `.filter()`, que es un array nuevo. Si quisieras ordenar `eventos` directamente, primero hay que copiarlo: `[...eventos].sort(...)`. Si no, estarías alterando los datos originales que usa el resto del sitio.

### 2.6 Encadenar métodos

```ts
return eventos
  .filter(...)
  .sort(...)
```

Cada método devuelve un array, así que se le puede aplicar el siguiente. Se lee de arriba hacia abajo como una receta: "de los eventos, quedate con los próximos, y ordenalos".

### 2.7 `toLocaleDateString`: fechas en español

```ts
crearFechaLocal(fechaTexto).toLocaleDateString('es-AR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})
```

Convierte una fecha en texto según las costumbres de un idioma y país.

- `'es-AR'`: español de Argentina.
- El objeto dice qué partes mostrar y cómo. `'long'` es la palabra completa ("sábado", "octubre"); `'numeric'`, el número.

Resultado: `"sábado, 24 de octubre de 2026"`.

No hace falta escribir a mano un array con los nombres de los meses: el navegador ya los sabe en cada idioma. Probá cambiar `'es-AR'` por `'en-US'` y vas a ver `"Saturday, October 24, 2026"`.

### 2.8 Funciones exportadas y funciones internas

`obtenerInicioDelDia` y `compararPorFecha` no tienen `export`. Son piezas internas que solo usan las otras funciones del archivo. Sin `export`, nadie de afuera puede depender de ellas, y se pueden cambiar sin miedo a romper otra parte del sitio.

---

## 3. `src/components/EventCard.tsx`

```tsx
import { useState } from 'react'
import type { Evento } from '../data/events'
import { formatearFecha } from '../utils/events'
import './EventCard.css'

type EventCardProps = {
  evento: Evento
  pasado?: boolean
}

function EventCard({ evento, pasado = false }: EventCardProps) {
  const [infoVisible, setInfoVisible] = useState(false)

  const idInfo = `evento-${evento.id}-info`

  return (
    <article className={pasado ? 'evento evento-pasado' : 'evento'}>
      <img
        className="evento-imagen"
        src={evento.imagen}
        alt={evento.imagenAlt}
        loading="lazy"
      />

      <div className="evento-cuerpo">
        <h3 className="evento-titulo">{evento.titulo}</h3>

        <dl className="evento-datos">
          <div>
            <dt>Fecha</dt>
            <dd>
              <time dateTime={evento.fecha}>{formatearFecha(evento.fecha)}</time>
            </dd>
          </div>
          <div>
            <dt>Hora</dt>
            <dd>{evento.hora} hs</dd>
          </div>
          <div>
            <dt>Lugar</dt>
            <dd>{evento.lugar}</dd>
          </div>
        </dl>

        <p className="evento-descripcion">{evento.descripcion}</p>

        <button
          type="button"
          className="evento-boton"
          aria-expanded={infoVisible}
          aria-controls={idInfo}
          onClick={() => setInfoVisible(!infoVisible)}
        >
          {infoVisible ? 'Menos información' : 'Más información'}
        </button>

        {infoVisible && (
          <p id={idInfo} className="evento-info">
            {evento.masInformacion}
          </p>
        )}
      </div>
    </article>
  )
}

export default EventCard
```

### 3.1 Un objeto entero como prop

El Hero recibía cada dato por separado (`titulo`, `frase`, `imagen`...). EventCard recibe **el evento completo**:

```tsx
<EventCard evento={evento} />
```

¿Cuándo conviene cada forma?

- **Datos sueltos** cuando el componente es genérico y los datos pueden venir de cualquier lado (el Hero muestra títulos que no tienen nada que ver entre sí).
- **El objeto entero** cuando el componente existe para mostrar **un tipo de cosa** concreto. EventCard siempre muestra un `Evento`. Pasarle siete props por separado sería largo y repetitivo, y si mañana se agrega un campo al evento, habría que agregar una prop más.

El tipo de la prop es `Evento`, el mismo que definimos en `data/events.ts`. Se importa con `import type`. Así, si alguien le pasa un objeto al que le falta la fecha, TypeScript lo marca.

### 3.2 Prop opcional con valor por defecto

```tsx
type EventCardProps = {
  evento: Evento
  pasado?: boolean
}

function EventCard({ evento, pasado = false }: EventCardProps) {
```

- El `?` en el tipo dice que `pasado` es opcional.
- El `= false` en el destructuring dice qué valor toma si no se pasa.

Es la misma idea que los parámetros con valor por defecto de las funciones de `utils/`, aplicada a props.

### 3.3 Cada tarjeta tiene su propio estado

```tsx
const [infoVisible, setInfoVisible] = useState(false)
```

Esto es lo más importante de la etapa. En la página hay cinco tarjetas. Si abrís "Más información" en una, **las otras cuatro siguen cerradas**.

Cada vez que React dibuja un `<EventCard />`, crea una **copia independiente** del componente, con su propio estado. Escribís la función una vez, pero cada uso tiene su propia memoria. Es como un formulario impreso: el modelo es uno solo, pero cada persona completa su copia.

Por eso el estado va **dentro** de la tarjeta y no en la página. Si estuviera en `Eventos.tsx`, un solo `infoVisible` abriría y cerraría todas a la vez.

Regla: el estado vive en el componente más cercano que lo necesita.

### 3.4 Un `id` único por tarjeta

```tsx
const idInfo = `evento-${evento.id}-info`
```

`aria-controls` tiene que apuntar al `id` del bloque que el botón despliega. En el versículo había un solo bloque, así que el id podía ser fijo. Acá hay cinco tarjetas en la misma página, y un `id` **no se puede repetir** en un documento HTML. Lo armamos con el id del evento: `evento-1-info`, `evento-2-info`, etc.

### 3.5 `<article>`

Cada tarjeta es un `<article>`: un bloque de contenido **que tiene sentido por sí solo**, aunque lo saques de la página. Un evento, una noticia o una publicación son buenos ejemplos. Los lectores de pantalla permiten saltar de artículo en artículo.

Diferencia con `<section>`: una sección es una parte de algo más grande (los "Próximos eventos" son una parte de la página). Un artículo es independiente.

### 3.6 `<dl>`: una lista de datos

```tsx
<dl>
  <div>
    <dt>Fecha</dt>
    <dd>...</dd>
  </div>
</dl>
```

`<dl>` es una **lista de descripciones**: pares de nombre (`<dt>`) y valor (`<dd>`). Es la etiqueta justa para "Fecha: sábado 24", "Hora: 20:00". Un lector de pantalla anuncia la relación entre cada etiqueta y su valor. El `<div>` que envuelve cada par está permitido y facilita ponerlos en fila con CSS.

### 3.7 La imagen y su `alt`

```tsx
<img
  className="evento-imagen"
  src={evento.imagen}
  alt={evento.imagenAlt}
  loading="lazy"
/>
```

**`alt` es obligatorio** en toda imagen. Es lo que lee un lector de pantalla y lo que se muestra si la imagen no carga. Hay dos casos:

- **La imagen comunica algo**: `alt` describe lo que se ve. Por ejemplo, con una foto real: `"Jóvenes sentados en ronda alrededor de un fogón"`.
- **La imagen es decorativa** y no agrega información al texto que la acompaña: `alt=""` (vacío). El lector de pantalla la saltea.

Vacío no es lo mismo que ausente. Si no ponés `alt`, el lector de pantalla puede leer el nombre del archivo: "alabanza punto svg". Con `alt=""` sabe que tiene que ignorarla.

Las imágenes de ejemplo son ilustraciones decorativas (una nota musical, unas montañas), por eso tienen `imagenAlt: ''`. **Cuando pongas fotos reales, completá `imagenAlt`** con una descripción breve.

`loading="lazy"` le dice al navegador que no descargue la imagen hasta que esté por aparecer en pantalla. En una página con muchas tarjetas, la carga inicial es más rápida.

---

## 4. `EventCard.css`: imágenes que no se deforman

```css
.evento-imagen {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}
```

Las fotos reales van a tener tamaños distintos: unas horizontales, otras verticales. Sin esto, cada tarjeta tendría una imagen de distinto alto.

- `aspect-ratio: 16 / 9` fija la **proporción** del recuadro: siempre 16 de ancho por 9 de alto, sea cual sea el ancho de la tarjeta.
- `object-fit: cover` hace que la imagen **llene** el recuadro sin estirarse, recortando lo que sobre. Es el equivalente de `background-size: cover` del Hero, pero para un `<img>`.

### Tarjetas de igual alto con el botón abajo

```css
.evento {
  display: flex;
  flex-direction: column;
}

.evento-cuerpo {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.evento-descripcion {
  flex: 1;
}
```

En una grilla, todas las tarjetas de una fila tienen el mismo alto. Pero si una descripción es más corta, su botón quedaría más arriba que los otros. Con `flex: 1`, la descripción ocupa el espacio que sobra y empuja el botón al fondo. Así los botones quedan alineados.

### Eventos pasados

```css
.evento-pasado .evento-imagen {
  filter: grayscale(1);
  opacity: 0.7;
}
```

Se leen como ".evento-imagen que está **dentro** de un .evento-pasado" (con espacio entre las clases). `grayscale(1)` pasa la imagen a blanco y negro. Es una señal visual de que el evento ya ocurrió, sin dejar de mostrarlo.

---

## 5. `src/pages/Eventos.tsx`

```tsx
import EventCard from '../components/EventCard'
import { eventos } from '../data/events'
import {
  obtenerEventosAnteriores,
  obtenerProximosEventos,
} from '../utils/events'
import './Eventos.css'

function Eventos() {
  const proximos = obtenerProximosEventos(eventos)
  const anteriores = obtenerEventosAnteriores(eventos)

  return (
    <div className="contenedor pagina">
      <h1>Eventos</h1>
      <p className="eventos-intro">
        Actividades especiales para compartir en comunidad. ¡Estás invitado!
      </p>

      <section className="eventos-seccion" aria-labelledby="proximos-titulo">
        <h2 id="proximos-titulo">Próximos eventos</h2>

        {proximos.length > 0 ? (
          <div className="eventos-grilla">
            {proximos.map((evento) => (
              <EventCard key={evento.id} evento={evento} />
            ))}
          </div>
        ) : (
          <p>Por ahora no hay eventos programados. ¡Volvé pronto!</p>
        )}
      </section>

      {anteriores.length > 0 && (
        <section className="eventos-seccion" aria-labelledby="anteriores-titulo">
          <h2 id="anteriores-titulo">Eventos anteriores</h2>

          <div className="eventos-grilla">
            {anteriores.map((evento) => (
              <EventCard key={evento.id} evento={evento} pasado />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default Eventos
```

### 5.1 La página solo organiza

Las dos primeras líneas hacen todo el trabajo pesado llamando a `utils/`. El JSX queda limpio: no hay ni una comparación de fechas adentro.

### 5.2 Prop booleana abreviada

```tsx
<EventCard key={evento.id} evento={evento} pasado />
```

Escribir `pasado` solo es lo mismo que `pasado={true}`. Es como los atributos de HTML del estilo `<input disabled>`. En los próximos no se escribe, así que toma el valor por defecto: `false`.

### 5.3 `key` va en el componente

`key={evento.id}` se pone en `<EventCard>`, que es el elemento que devuelve el `.map()`. No adentro de EventCard, sobre el `<article>`.

Detalle: `key` **no llega** como prop al componente. Es de uso exclusivo de React. Si EventCard necesitara el id, ya lo tiene en `evento.id`.

### 5.4 ¿Y si no hay eventos?

```tsx
{proximos.length > 0 ? (
  <div className="eventos-grilla">...</div>
) : (
  <p>Por ahora no hay eventos programados. ¡Volvé pronto!</p>
)}
```

Siempre hay que pensar qué pasa cuando una lista está vacía. Sin esto, cuando pasen todos los eventos cargados la página mostraría el título "Próximos eventos" y nada debajo, como si estuviera rota.

- Para los próximos usamos el **ternario**: grilla o mensaje.
- Para los anteriores usamos `&&`: si no hay ninguno, no tiene sentido mostrar la sección. Mostrar o nada.

Fijate que la condición es `anteriores.length > 0 &&` y no `anteriores.length &&`. Es la advertencia de la etapa anterior: con un array vacío, `length` vale `0`, y React dibujaría un "0" suelto en la página.

### 5.5 Los títulos

La página tiene un `<h1>` ("Eventos"), cada sección un `<h2>`, y cada tarjeta un `<h3>`. Los niveles de título forman un índice de la página; no se eligen por tamaño de letra sino por jerarquía. Un lector de pantalla permite saltar de título en título.

---

## 6. `Eventos.css`: `auto-fill` en vez de `auto-fit`

```css
.eventos-grilla {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
  gap: 1.5rem;
}
```

En los horarios usamos `auto-fit`. Acá `auto-fill`. La diferencia se ve cuando **hay pocas tarjetas**:

- `auto-fit`: si hay lugar para tres columnas y solo dos tarjetas, las estira para ocupar todo el ancho.
- `auto-fill`: deja la tercera columna vacía, y las tarjetas mantienen su tamaño.

En "Eventos anteriores" hay dos tarjetas. Con `auto-fit` quedarían enormes, con imágenes gigantes. Con `auto-fill` miden lo mismo que las de arriba. En los horarios convenía estirar; acá, mantener el tamaño.

---

## 7. Las imágenes

Están en `public/images/eventos/`. Las dibujé yo como SVG, así que no tienen problemas de derechos: una nota musical, unas montañas con pinos, una estrella, un corazón y ondas de agua. Son **provisorias**.

Para poner fotos reales:

1. Guardalas en `public/images/eventos/`, por ejemplo `retiro-2026.jpg`.
2. En `events.ts`, cambiá `imagen` por `'/images/eventos/retiro-2026.jpg'`.
3. Completá `imagenAlt` con una descripción.

Recomendaciones: horizontales (la tarjeta las muestra en 16:9), de unos 800 píxeles de ancho y menos de 150 KB cada una. Si aparecen personas, con su permiso.

---

## 8. Cómo probarlo

```bash
npm run dev
```

Entrá a **Eventos** desde el menú. Hoy, 18 de octubre de 2026, tenés que ver:

**Próximos eventos**, del más cercano al más lejano:
1. Noche de alabanza — sábado, 24 de octubre de 2026
2. Retiro de jóvenes — sábado, 14 de noviembre de 2026
3. Cena de Navidad — sábado, 19 de diciembre de 2026

**Eventos anteriores**, del más reciente al más antiguo, con la imagen en gris:
1. Jornada de servicio — sábado, 26 de septiembre de 2026
2. Bautismos — domingo, 30 de agosto de 2026

En computadora, tres tarjetas por fila; en celular, una.

Tocá "Más información" en una tarjeta: se abre solo esa.

**Experimentos para entender**

1. **Pasar un evento al pasado.** En `events.ts`, cambiá la fecha de la Noche de alabanza a `'2026-10-01'`. Se muda sola a "Eventos anteriores" y se ubica en el lugar que le corresponde por fecha.
2. **Un evento hoy.** Poné la fecha de hoy en un evento. Aparece en "Próximos" aunque sean las 23:00.
3. **Lista vacía.** Cambiá las tres fechas futuras a fechas de 2025. Aparece el mensaje "Por ahora no hay eventos programados".
4. **La trampa del UTC.** En la consola del navegador (`F12`), escribí `new Date('2026-10-24')` y después `new Date(2026, 9, 24)`. Compará el día.
5. **Otro idioma.** En `formatearFecha`, cambiá `'es-AR'` por `'en-US'` o `'pt-BR'`. Después volvé a dejarlo.
6. **Ver el estado separado.** Abrí "Más información" en dos tarjetas distintas. Cada una recuerda lo suyo.
7. **Ver `.filter()` en acción.** En la consola escribí:

   ```js
   [5, 12, 3, 20].filter((n) => n > 10)
   [5, 12, 3, 20].sort((a, b) => a - b)
   ```

Deshacé los cambios al terminar.

## 9. Lo que viene

**Etapa 9 — Publicaciones.** Creamos `data/posts.ts`, el componente `PostCard` y la página de Publicaciones. Y agregamos la primera **ruta dinámica**: `/publicaciones/:id`, una sola página que sirve para leer cualquier publicación completa, con `useParams` para saber cuál mostrar.
