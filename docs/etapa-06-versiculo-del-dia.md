# Etapa 6 — Versículo del día

El Inicio ahora muestra un versículo que cambia solo cada día, con un botón "Leer contexto" que explica de qué trata el pasaje.

Conceptos nuevos de esta etapa:

- Diseñar datos pensando en que van a crecer.
- Tipos unión (`'paz' | 'amor' | ...`).
- El objeto `Date`: fecha actual, año, mes, día.
- Calcular un índice con el resto de una división (`%`).
- Separar la lógica en funciones fuera del componente (`utils/`).
- Dato guardado contra dato calculado.
- Por qué esto **no** necesita `useEffect`.
- Mostrar u ocultar algo con `&&`.
- Array local contra API de Biblia.

Archivos nuevos:

```
src/
  data/verses.ts                 Los versículos
  utils/verseOfTheDay.ts         El cálculo (carpeta nueva)
  components/
    VerseOfTheDay.tsx + .css     El componente
```

Y cambiaron `pages/Home.tsx` (una línea para mostrarlo) e `index.css` (un color nuevo).

---

## 1. Primero la decisión: ¿array local o API?

Antes de escribir código hay que decidir de dónde salen los versículos.

### Opción A: array local

Los versículos están escritos en un archivo del proyecto.

| A favor | En contra |
| --- | --- |
| Funciona siempre, incluso sin internet | Hay que escribirlos a mano |
| Carga instantánea, sin esperas | La cantidad es limitada |
| Control total: elegimos cada versículo | Para agregar uno hay que tocar el código |
| No depende de nadie | Una sola traducción |
| No tiene costo ni límites | |

### Opción B: API externa

El sitio le pide el versículo a un servicio de internet.

| A favor | En contra |
| --- | --- |
| Toda la Biblia disponible | Si el servicio se cae, la sección queda vacía |
| Varias traducciones | Hay que esperar la respuesta (pantalla de carga) |
| Se puede traer el pasaje completo | Suelen tener límites de pedidos por día |
| | Muchas piden una clave (API key) |
| | Depende de internet y de un tercero |

Los problemas de una API, uno por uno:

- **Disponibilidad.** Un servicio gratuito puede caerse, cambiar o cerrar sin aviso. El sitio de la iglesia quedaría con un hueco en la portada.
- **Límites.** Casi todas permiten una cantidad de pedidos por día. Si el sitio tiene muchas visitas, se puede agotar.
- **Claves API.** Es una contraseña que identifica a tu sitio. En una página hecha solo con React (sin servidor), **todo el código llega al navegador del visitante**, así que la clave queda a la vista de cualquiera. Para protegerla hace falta un servidor intermedio, es decir, un backend.
- **Traducciones.** Este es el punto más delicado. Las traducciones más usadas en español (Reina-Valera 1960, NVI, NTV) **tienen derechos de autor**. Que una API las ofrezca no significa que se puedan publicar libremente: cada una tiene sus condiciones. Las que no tienen restricciones son las antiguas, de dominio público.
- **Contenido sin control.** Y lo más importante para este caso: una API de "versículo al azar" puede devolver una genealogía o una frase cortada por la mitad. Justamente lo que pediste evitar.

### Decisión: array local

Para el versículo del día, la API no resuelve ningún problema que tengamos y agrega varios. El requisito central es que los versículos estén **elegidos a mano y tengan sentido solos**, y eso lo da una lista propia.

Donde una API sí tendría sentido es en "Leer contexto", para traer el pasaje completo sin tener que escribirlo. Queda como mejora posible; el diseño de los datos ya lo contempla (punto 2).

### Sobre el texto de los versículos

Usé la **Reina-Valera 1909**, que es de dominio público. Por eso el lenguaje suena algo antiguo ("hacimiento de gracias", "no estribes").

**Importante:** los escribí de memoria. Antes de publicar el sitio, **revisá cada versículo contra una Biblia**. Si la iglesia usa otra traducción y quiere esa en la página, hay que consultar las condiciones de uso de quien la publica.

---

## 2. `src/data/verses.ts`

```ts
export type Categoria =
  | 'confianza'
  | 'paz'
  | 'fortaleza'
  | 'amor'
  | 'guia'
  | 'esperanza'

export type Versiculo = {
  id: number
  libro: string
  capitulo: number
  versiculo: string
  texto: string
  categoria: Categoria
  // Versículos del pasaje completo, para "Leer contexto" (ej: "1-6")
  pasaje: string
  // Breve explicación de qué trata el pasaje
  contexto: string
}

export const versiculos: Versiculo[] = [
  {
    id: 1,
    libro: 'Salmos',
    capitulo: 23,
    versiculo: '1',
    texto: 'Jehová es mi pastor; nada me faltará.',
    categoria: 'confianza',
    pasaje: '1-6',
    contexto:
      'David compara a Dios con un pastor que guía, alimenta y protege a sus ovejas, incluso en los momentos más oscuros.',
  },
  // ... 13 más
]
```

Hay 14 versículos. El archivo completo está en el proyecto.

### Por qué los campos están separados

Lo más simple hubiera sido `{ referencia: 'Salmos 23:1', texto: '...' }`. Pero guardar `libro`, `capitulo` y `versiculo` por separado permite cosas que con un solo texto serían difíciles:

- Armar "Salmos 23:1" **y también** "Salmos 23:1-6" con los mismos datos.
- Más adelante, filtrar por libro o por categoría.
- Si algún día se conecta una API, pedirle exactamente ese libro y capítulo.

Regla general de diseño de datos: **guardá las piezas más chicas; unirlas es fácil, separarlas no.**

### ¿Por qué `capitulo` es número y `versiculo` es texto?

El capítulo siempre es un número. El versículo no: mirá Lamentaciones `'22-23'`, que abarca dos. Como a veces es un rango, tiene que ser texto.

### Tipo unión

```ts
export type Categoria =
  | 'confianza'
  | 'paz'
  | 'fortaleza'
  | 'amor'
  | 'guia'
  | 'esperanza'
```

La barra `|` se lee "o". Este tipo dice: una categoría es **exactamente uno de estos seis textos**, y ningún otro.

Si fuera `categoria: string`, podrías escribir `'pas'` por error y nadie lo notaría. Con el tipo unión, el editor lo marca y además te ofrece las opciones al escribir. Probalo: cambiá una categoría por `'alegria'` y mirá el error.

Las categorías todavía no se muestran en pantalla. Están porque pediste que el diseño pueda crecer: más adelante sirven para filtrar o para elegir versículos según la ocasión.

### `pasaje` y `contexto`

- `pasaje: '1-6'` es el rango del pasaje completo. Con eso se arma "Salmos 23:1-6".
- `contexto` es una explicación breve, escrita por mí, de qué trata ese pasaje. Revisalas y ajustalas con el criterio de la iglesia.

Hoy "Leer contexto" muestra la referencia ampliada y esa explicación. **No** muestra el texto de los seis versículos: escribir de memoria 14 pasajes enteros era pedir errores. Para sumarlo después hay dos caminos, y ninguno obliga a rehacer lo que ya está: agregar un campo `textoPasaje` a cada objeto, o traerlo de una API usando `libro`, `capitulo` y `pasaje`.

### Qué hace que un versículo sirva para esta lista

El criterio con el que los elegí, para cuando agregues más:

1. **Se entiende solo**, sin haber leído lo anterior.
2. **Es una oración completa.** No empieza con "Y", "Porque él", "Entonces dijo".
3. **Dice algo a quien lo lee hoy**: una promesa, un consuelo, una invitación.
4. **No cambia de sentido fuera de contexto.**

Para agregar uno: copiá un objeto, cambiá los datos y ponele el `id` siguiente. No hay que tocar nada más: el cálculo usa `versiculos.length`, así que se adapta solo.

---

## 3. `src/utils/verseOfTheDay.ts`: el cálculo

```ts
import { versiculos } from '../data/verses'
import type { Versiculo } from '../data/verses'

const MILISEGUNDOS_POR_DIA = 1000 * 60 * 60 * 24

// Número de día contado desde el 1 de enero de 1970, según el calendario
// local del visitante. Mañana devuelve el número de hoy más uno.
export function obtenerNumeroDeDia(fecha: Date): number {
  const medianoche = Date.UTC(
    fecha.getFullYear(),
    fecha.getMonth(),
    fecha.getDate(),
  )

  return Math.floor(medianoche / MILISEGUNDOS_POR_DIA)
}

export function obtenerVersiculoDelDia(fecha: Date = new Date()): Versiculo {
  const indice = obtenerNumeroDeDia(fecha) % versiculos.length

  return versiculos[indice]
}

// "Salmos 23:1"
export function obtenerReferencia(versiculo: Versiculo): string {
  return `${versiculo.libro} ${versiculo.capitulo}:${versiculo.versiculo}`
}

// "Salmos 23:1-6"
export function obtenerReferenciaDelPasaje(versiculo: Versiculo): string {
  return `${versiculo.libro} ${versiculo.capitulo}:${versiculo.pasaje}`
}
```

### 3.1 Una carpeta nueva: `utils/`

Esta carpeta no estaba en el plan original. La agrego porque estas funciones no son datos (`data/`) ni dibujan nada (`components/`): son **lógica pura**. Reciben algo, devuelven algo, y no saben que React existe.

Separarlas tiene tres ventajas:

- El componente queda corto y se lee de un vistazo.
- Se pueden probar solas, sin abrir el navegador.
- Se pueden reutilizar (la página de Eventos también va a trabajar con fechas).

Era uno de tus pedidos: no dejar lógica complicada dentro del JSX.

### 3.2 El objeto `Date`

`Date` es la herramienta de JavaScript para trabajar con fechas.

```js
const ahora = new Date()      // este instante exacto

ahora.getFullYear()           // 2026
ahora.getMonth()              // 9   ← ¡octubre!
ahora.getDate()               // 13  (día del mes)
ahora.getDay()                // 2   (día de la semana: 0 = domingo)
```

**La trampa clásica:** `getMonth()` cuenta los meses **desde 0**. Enero es 0 y diciembre es 11. El día del mes, en cambio, empieza en 1. Es una rareza histórica del lenguaje que hay que recordar.

Por dentro, una fecha es **un número**: los milisegundos que pasaron desde el 1 de enero de 1970. Eso permite hacer cuentas con fechas.

Un detalle clave: `new Date()` usa el reloj **de la computadora o el celular del visitante**, no el de un servidor. Así que el versículo cambia a la medianoche de cada persona, esté donde esté.

### 3.3 La idea: convertir el día en una posición del array

El objetivo es que cada día corresponda a un versículo:

```
día 1 → versiculos[0]
día 2 → versiculos[1]
...
día 14 → versiculos[13]
día 15 → versiculos[0]    ← vuelve a empezar
```

Para eso hacen falta dos cosas: un **número que aumente de a uno cada día** y una forma de **volver al principio** al llegar al final.

### 3.4 El operador `%` (resto)

`%` devuelve **el resto de una división entera**.

```js
7 % 3    // 1   (7 entre 3 da 2 y sobra 1)
14 % 14  // 0   (no sobra nada)
15 % 14  // 1
```

Su propiedad útil: `n % 14` **siempre da un número entre 0 y 13**, sin importar qué tan grande sea `n`. Y esas son justo las posiciones válidas de un array de 14 elementos.

```
 0 % 14 = 0
 1 % 14 = 1
...
13 % 14 = 13
14 % 14 = 0     ← vuelve a empezar solo
15 % 14 = 1
```

Es como un reloj: después del 12 viene el 1. Por eso el código usa `versiculos.length` en vez de escribir `14`: si agregás versículos, el ciclo se ajusta sin tocar nada.

### 3.5 ¿Qué número usamos? Día del año contra días corridos

Tu ejemplo usaba el **día del año** (1 de enero = 1, 31 de diciembre = 365). Funciona, pero tiene un defecto: el contador vuelve a 1 cada año nuevo.

Con 14 versículos:

```
31 de diciembre → día 365 → 365 % 14 = 1
 1 de enero     → día 1   →   1 % 14 = 1    ← ¡el mismo versículo dos días seguidos!
```

Solo andaría perfecto si 365 fuera múltiplo de la cantidad de versículos, y eso cambia cada vez que agregás uno.

**La mejora:** en lugar de contar desde el 1 de enero de este año, contamos los días desde una fecha fija que nunca se reinicia. Así el contador sube de a uno para siempre y el ciclo no se corta. Lo comprobé recorriendo 800 días seguidos, incluido el cambio de año: el número siempre aumenta exactamente en uno.

### 3.6 `obtenerNumeroDeDia`, paso a paso

```ts
export function obtenerNumeroDeDia(fecha: Date): number {
  const medianoche = Date.UTC(
    fecha.getFullYear(),
    fecha.getMonth(),
    fecha.getDate(),
  )

  return Math.floor(medianoche / MILISEGUNDOS_POR_DIA)
}
```

1. `getFullYear()`, `getMonth()` y `getDate()` sacan el año, mes y día **del calendario del visitante**. Se descarta la hora: a las 8 de la mañana o a las 11 de la noche, el resultado es el mismo.
2. `Date.UTC(año, mes, día)` devuelve los milisegundos desde 1970 hasta la medianoche de ese día.
3. Dividir por `MILISEGUNDOS_POR_DIA` convierte milisegundos en días.
4. `Math.floor` redondea hacia abajo para quedarnos con un entero.

El resultado es un número grande (hoy ronda los 20.700) que mañana vale uno más.

**¿Por qué `Date.UTC` y no restar dos fechas directamente?** Por el horario de verano. En los países que cambian la hora, hay un día al año de 23 horas y otro de 25. Si uno resta fechas y divide por 24 horas, esos días la cuenta da con decimales y el resultado puede saltearse o repetir un día. `Date.UTC` trabaja con un calendario que no tiene cambios de hora, así que todos los días miden exactamente 24 horas.

**`MILISEGUNDOS_POR_DIA`** está escrito como `1000 * 60 * 60 * 24` y no como `86400000` para que se entienda de dónde sale: milisegundos por segundo, segundos por minuto, minutos por hora, horas por día. El nombre en mayúsculas es la costumbre para valores fijos que no cambian nunca.

### 3.7 `obtenerVersiculoDelDia`

```ts
export function obtenerVersiculoDelDia(fecha: Date = new Date()): Versiculo {
  const indice = obtenerNumeroDeDia(fecha) % versiculos.length

  return versiculos[indice]
}
```

Dos líneas: calcular la posición y devolver ese versículo.

`fecha: Date = new Date()` es un **parámetro con valor por defecto**. Si se llama a la función sin nada, usa la fecha de hoy. Si se le pasa una fecha, usa esa:

```ts
obtenerVersiculoDelDia()                          // el de hoy
obtenerVersiculoDelDia(new Date(2026, 11, 25))    // el del 25 de diciembre
```

(El mes es `11` por la trampa del punto 3.2.)

Eso permite **probar** la función con cualquier fecha sin esperar a que pase el día. Si adentro dijera `new Date()` fijo, no habría forma de comprobar qué va a salir mañana.

`: Versiculo` después del paréntesis es el **tipo de retorno**: declara qué devuelve la función.

### 3.8 Dato guardado contra dato calculado

```ts
export function obtenerReferencia(versiculo: Versiculo): string {
  return `${versiculo.libro} ${versiculo.capitulo}:${versiculo.versiculo}`
}
```

Tu ejemplo incluía un campo `referencia: 'Salmos 23:1'` en cada objeto. No lo puse, a propósito: esa información **ya está** en `libro`, `capitulo` y `versiculo`. Guardarla otra vez sería repetir.

El riesgo de repetir datos es que se desincronicen: alguien corrige el capítulo, se olvida de la referencia, y el sitio muestra dos cosas distintas.

**Si un dato se puede calcular a partir de otros, no se guarda: se calcula.** Es la misma idea que vimos con el estado en el Footer.

---

## 4. `src/components/VerseOfTheDay.tsx`

```tsx
import { useState } from 'react'
import {
  obtenerReferencia,
  obtenerReferenciaDelPasaje,
  obtenerVersiculoDelDia,
} from '../utils/verseOfTheDay'
import './VerseOfTheDay.css'

function VerseOfTheDay() {
  const [contextoVisible, setContextoVisible] = useState(false)

  const versiculo = obtenerVersiculoDelDia()

  return (
    <section className="versiculo" aria-labelledby="versiculo-titulo">
      <div className="contenedor seccion">
        <h2 id="versiculo-titulo" className="versiculo-titulo">
          Versículo del día
        </h2>

        <figure className="versiculo-cita">
          <blockquote>
            <p>{versiculo.texto}</p>
          </blockquote>
          <figcaption>{obtenerReferencia(versiculo)}</figcaption>
        </figure>

        <button
          type="button"
          className="versiculo-boton"
          aria-expanded={contextoVisible}
          aria-controls="versiculo-contexto"
          onClick={() => setContextoVisible(!contextoVisible)}
        >
          {contextoVisible ? 'Ocultar contexto' : 'Leer contexto'}
        </button>

        {contextoVisible && (
          <div id="versiculo-contexto" className="versiculo-contexto">
            <h3>{obtenerReferenciaDelPasaje(versiculo)}</h3>
            <p>{versiculo.contexto}</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default VerseOfTheDay
```

Como la lógica está en `utils/`, el componente solo se ocupa de mostrar.

### 4.1 Qué es estado acá y qué no

```tsx
const [contextoVisible, setContextoVisible] = useState(false)

const versiculo = obtenerVersiculoDelDia()
```

Estas dos líneas muestran la diferencia más importante de la etapa.

- `contextoVisible` **es estado**: cambia cuando el usuario toca el botón, y React tiene que recordarlo y volver a dibujar.
- `versiculo` **no es estado**: es una variable común. Se calcula a partir de la fecha cada vez que el componente se dibuja. Nadie lo "cambia".

La pregunta para decidir: **¿este valor cambia por algo que pasa en la pantalla, o se puede calcular?** Si se puede calcular, es una variable común.

### 4.2 Por qué NO hay `useEffect`

Es muy común ver esto en internet:

```tsx
// ❌ Innecesario
const [versiculo, setVersiculo] = useState(null)

useEffect(() => {
  setVersiculo(obtenerVersiculoDelDia())
}, [])
```

Funciona, pero hace trabajo de más:

1. Dibuja el componente **vacío** (el versículo todavía es `null`).
2. Después de dibujar, ejecuta el efecto y guarda el versículo.
3. Dibuja **otra vez**, ahora con el versículo.

Dos dibujos en vez de uno, un instante en blanco, y además hay que manejar el caso `null`. Todo para obtener un valor que se podía calcular en una línea.

**¿Para qué sirve entonces `useEffect`?** Para **sincronizar el componente con algo que está fuera de React**: pedir datos a un servidor, suscribirse a un evento del navegador, arrancar un temporizador. Cosas que no se pueden resolver durante el dibujo porque tardan o porque tocan algo externo.

Calcular un índice con una división no es nada de eso.

**Regla:** si podés obtener el valor con una cuenta a partir de lo que ya tenés (props, estado, la fecha), calculalo directamente. `useEffect` es para hablar con el mundo exterior.

**¿Cuándo sí lo usaríamos acá?** Si los versículos vinieran de una API. Sería algo así (solo para que veas la forma, no está en el proyecto):

```tsx
const [versiculo, setVersiculo] = useState<Versiculo | null>(null)

useEffect(() => {
  fetch('https://alguna-api/versiculo-del-dia')
    .then((respuesta) => respuesta.json())
    .then((datos) => setVersiculo(datos))
}, [])
```

Ahí sí: el dato tarda en llegar y viene de afuera. Lo vemos en detalle en la Etapa 15.

**Un límite honesto de nuestra solución:** si alguien deja la pestaña abierta y pasa la medianoche, sigue viendo el versículo de ayer hasta que recargue o cambie de página. Para un sitio así es totalmente aceptable. Resolverlo requeriría un temporizador, y ese sí sería un caso legítimo de `useEffect`.

### 4.3 Función flecha en el `onClick`

```tsx
onClick={() => setContextoVisible(!contextoVisible)}
```

En el Header habíamos creado una función con nombre (`alternarMenu`). Acá la escribimos directamente en el lugar. Las dos formas son válidas; cuando es una sola línea que se usa una vez, escribirla en el lugar es más corto.

Fijate que sigue habiendo una función: `() => ...`. Si escribieras `onClick={setContextoVisible(!contextoVisible)}`, sin la flecha, se ejecutaría al dibujar y no al hacer clic.

### 4.4 Mostrar algo solo si se cumple una condición: `&&`

```tsx
{contextoVisible && (
  <div id="versiculo-contexto" className="versiculo-contexto">
    ...
  </div>
)}
```

Se lee: "si `contextoVisible` es verdadero, **entonces** dibujá esto". Si es falso, React no dibuja nada.

Comparalo con las dos formas anteriores:

| Necesito... | Uso | Ejemplo |
| --- | --- | --- |
| Mostrar una cosa **u otra** | Ternario `? :` | El texto del botón |
| Mostrar algo **o nada** | `&&` | El bloque de contexto |

En el Header ocultábamos el menú con una clase CSS (el menú seguía existiendo en la página, solo que invisible). Acá el bloque **directamente no existe** en el HTML hasta que se abre. Las dos técnicas son válidas. En el menú convenía el CSS porque en pantallas grandes debe verse siempre; acá el contenido es puramente opcional.

Cuidado con `&&` y los números: `{cantidad && <p>...</p>}` con `cantidad` en 0 dibuja un "0" en pantalla. Con valores `true`/`false`, como acá, no hay problema.

### 4.5 HTML semántico para una cita

```tsx
<figure className="versiculo-cita">
  <blockquote>
    <p>{versiculo.texto}</p>
  </blockquote>
  <figcaption>{obtenerReferencia(versiculo)}</figcaption>
</figure>
```

- `<blockquote>` es la etiqueta para **una cita textual** de otra fuente.
- `<figure>` agrupa un contenido con su leyenda.
- `<figcaption>` es esa leyenda: de dónde viene la cita.

Un lector de pantalla anuncia que es una cita, y un buscador entiende que ese texto no es nuestro sino citado. Con `<div>` y `<p>` se vería igual, pero no significaría nada.

### 4.6 Accesibilidad

- `aria-labelledby="versiculo-titulo"` conecta la `<section>` con su `<h2>`. Quien navega con lector de pantalla puede saltar entre secciones y escucha "Versículo del día".
- El botón es un `<button>` real, con `aria-expanded` y `aria-controls`, igual que el del menú.
- El texto del botón cambia ("Leer contexto" / "Ocultar contexto"), así que siempre describe lo que va a hacer.

---

## 5. Un color nuevo, por contraste

El título "VERSÍCULO DEL DÍA" va en dorado sobre fondo blanco. El dorado del sitio (`#b8862f`) es lindo para bordes y botones, pero como **texto chico sobre blanco** no tiene contraste suficiente para leerse bien. Por eso agregué una variante más oscura en `index.css`:

```css
--color-acento: #b8862f;
--color-acento-texto: #8a6116;
```

La referencia que se usa es la pauta de accesibilidad WCAG, que pide un contraste mínimo de 4,5 a 1 para texto normal. Las herramientas del navegador lo miden: al inspeccionar un texto y hacer clic en su color, muestran el valor.

Regla práctica: un mismo color puede servir para decorar y no servir para texto.

---

## 6. Usarlo en el Inicio

En `src/pages/Home.tsx` se agregaron dos líneas:

```tsx
import VerseOfTheDay from '../components/VerseOfTheDay'

...

      </Hero>

      <VerseOfTheDay />

      <section className="contenedor seccion">
```

No recibe props: sabe solo qué mostrar. Va justo debajo del Hero porque es contenido que cambia todos los días, y eso le da a la gente un motivo para volver.

---

## 7. Cómo probarlo

```bash
npm run dev
```

En el Inicio, debajo del Hero, tenés que ver una franja blanca con:

- El título chico "VERSÍCULO DEL DÍA" en dorado.
- El versículo en letra grande y, debajo, la referencia.
- El botón "Leer contexto". Al tocarlo aparece un recuadro con la referencia ampliada y la explicación, y el botón pasa a decir "Ocultar contexto".

El 13 de octubre de 2026 corresponde **Mateo 11:28**. El 14, Josué 1:9.

**Experimentos para entender**

1. **Ver el versículo de otro día.** En `VerseOfTheDay.tsx`, cambiá temporalmente:

   ```tsx
   const versiculo = obtenerVersiculoDelDia(new Date(2026, 11, 25))
   ```

   Vas a ver el del 25 de diciembre. Probá con fechas consecutivas y fijate que avanza de a uno. Volvé a dejarlo sin nada entre los paréntesis.

2. **El ciclo.** Probá una fecha y la misma 14 días después: sale el mismo versículo.

3. **Agregar un versículo.** Sumá un objeto con `id: 15` en `verses.ts`. Todo sigue funcionando sin tocar nada más, porque el cálculo usa `versiculos.length`. (Ojo: al cambiar la cantidad, cambia qué versículo cae en cada día.)

4. **TypeScript te cuida.** Escribí `categoria: 'alegria'` en algún versículo, o borrá el campo `pasaje`. El editor marca el error.

5. **Jugar con `Date` en la consola.** Abrí la consola del navegador (`F12`) y escribí:

   ```js
   new Date()
   new Date().getMonth()
   new Date(2026, 0, 1)
   17 % 14
   ```

6. **Ver que el bloque no existe.** Con el contexto cerrado, inspeccioná la sección (`F12`): no hay ningún `versiculo-contexto` en el HTML. Abrilo y mirá cómo aparece.

## 8. Lo que viene

**Etapa 7 — Horarios.** Creamos el componente `Schedule` y completamos la sección del Inicio que quedó reservada. Los datos ya existen (`data/schedules.ts`, lo usa el Footer), así que vas a ver el mismo array mostrado de dos formas distintas. Repasamos `.map()` y `key` con más detalle y agrupamos las reuniones por día.
