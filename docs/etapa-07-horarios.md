# Etapa 7 — Horarios de reuniones

La sección de horarios del Inicio, que había quedado reservada, ahora muestra las reuniones agrupadas por día y marca cuál es hoy.

Los datos no son nuevos: `data/schedules.ts` existe desde la Etapa 3 y ya lo usa el Footer. Lo interesante de esta etapa es ver **el mismo array mostrado de dos formas distintas**.

Conceptos de esta etapa:

- Array de objetos, `.map()` y `key`, ahora a fondo.
- Transformar datos antes de mostrarlos (agrupar).
- `.find()` y el bucle `for...of`.
- Un `.map()` dentro de otro.
- Cuándo un componente recibe props y cuándo no.
- Grid que se acomoda solo, sin media queries.
- La etiqueta `<time>`.

Archivos nuevos:

```
src/
  utils/schedules.ts            Agrupar por día y saber qué día es hoy
  components/
    Schedule.tsx + Schedule.css El componente
```

Y cambió `pages/Home.tsx`.

---

## 1. Repaso: los datos

`src/data/schedules.ts` (sin cambios):

```ts
export type Horario = {
  id: number
  dia: string
  hora: string
  nombre: string
}

export const horarios: Horario[] = [
  { id: 1, dia: 'Domingo', hora: '10:00', nombre: 'Reunión general' },
  { id: 2, dia: 'Domingo', hora: '18:00', nombre: 'Reunión general' },
  { id: 3, dia: 'Miércoles', hora: '20:00', nombre: 'Reunión de oración' },
  { id: 4, dia: 'Viernes', hora: '20:00', nombre: 'Jóvenes' },
]
```

### Qué es un array de objetos

Son dos estructuras combinadas:

- Un **objeto** `{ }` agrupa datos relacionados bajo un nombre cada uno. `{ dia: 'Domingo', hora: '10:00' }` describe **una** reunión. A cada dato se accede con un punto: `horario.dia`.
- Un **array** `[ ]` es una lista ordenada. Cada elemento tiene una posición que empieza en 0: `horarios[0]` es la primera reunión.

Juntos forman una **tabla**: cada objeto es una fila y cada propiedad es una columna.

| id | dia | hora | nombre |
| --- | --- | --- | --- |
| 1 | Domingo | 10:00 | Reunión general |
| 2 | Domingo | 18:00 | Reunión general |
| 3 | Miércoles | 20:00 | Reunión de oración |
| 4 | Viernes | 20:00 | Jóvenes |

Es la misma forma que tiene una tabla de una base de datos. Por eso, cuando más adelante los datos vengan de un backend, van a llegar con esta misma estructura y los componentes no van a necesitar cambios.

### Por qué no escribirlos directamente en el TSX

Comparalo con la alternativa:

```tsx
<li>Domingo 10:00 hs — Reunión general</li>
<li>Domingo 18:00 hs — Reunión general</li>
<li>Miércoles 20:00 hs — Reunión de oración</li>
<li>Viernes 20:00 hs — Jóvenes</li>
```

Funciona, pero:

- Para cambiar un horario hay que buscarlo en el Footer **y** en el Inicio **y** en Contacto.
- Si cambia el diseño, hay que retocar cada línea.
- No se puede ordenar, filtrar ni agrupar.

Con el array, el dato vive en un solo lugar y el diseño en otro.

---

## 2. El problema: los datos no tienen la forma que queremos mostrar

El array tiene **cuatro** filas, pero queremos **tres** tarjetas, una por día:

```
Domingo            Miércoles              Viernes
10:00 Reunión      20:00 Oración          20:00 Jóvenes
18:00 Reunión
```

Un `.map()` directo daría cuatro tarjetas, con "Domingo" repetido. Antes de dibujar hay que **transformar** los datos: de una lista plana a una lista de días, cada uno con sus reuniones.

Esto pasa todo el tiempo: los datos se guardan de la forma más simple y se les da forma al momento de mostrarlos.

## 3. `src/utils/schedules.ts`

```ts
import type { Horario } from '../data/schedules'

export type HorariosDelDia = {
  dia: string
  reuniones: Horario[]
}

const DIAS_DE_LA_SEMANA = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
]

// Junta las reuniones que caen el mismo día, respetando el orden original.
export function agruparPorDia(horarios: Horario[]): HorariosDelDia[] {
  const grupos: HorariosDelDia[] = []

  for (const horario of horarios) {
    const grupo = grupos.find((existente) => existente.dia === horario.dia)

    if (grupo) {
      grupo.reuniones.push(horario)
    } else {
      grupos.push({ dia: horario.dia, reuniones: [horario] })
    }
  }

  return grupos
}

// "Martes", según el calendario del visitante.
export function obtenerDiaDeHoy(fecha: Date = new Date()): string {
  return DIAS_DE_LA_SEMANA[fecha.getDay()]
}
```

### 3.1 La forma nueva

```ts
export type HorariosDelDia = {
  dia: string
  reuniones: Horario[]
}
```

Un objeto que contiene un array de objetos. `agruparPorDia` convierte esto:

```js
[
  { id: 1, dia: 'Domingo', hora: '10:00', ... },
  { id: 2, dia: 'Domingo', hora: '18:00', ... },
  { id: 3, dia: 'Miércoles', hora: '20:00', ... },
  { id: 4, dia: 'Viernes', hora: '20:00', ... },
]
```

en esto:

```js
[
  { dia: 'Domingo',   reuniones: [ {id: 1, ...}, {id: 2, ...} ] },
  { dia: 'Miércoles', reuniones: [ {id: 3, ...} ] },
  { dia: 'Viernes',   reuniones: [ {id: 4, ...} ] },
]
```

### 3.2 `agruparPorDia`, paso a paso

**`for (const horario of horarios)`** recorre el array elemento por elemento. En cada vuelta, `horario` es una reunión. Es la forma clásica de recorrer cuando hay que ir armando algo.

**`.find()`** busca en un array y devuelve **el primer elemento** que cumple la condición, o `undefined` si no hay ninguno:

```ts
const grupo = grupos.find((existente) => existente.dia === horario.dia)
```

Se lee: "de los grupos que ya armé, ¿hay alguno de este mismo día?".

`===` compara si dos valores son iguales. En JavaScript se usa siempre el de tres signos: el de dos (`==`) hace conversiones automáticas que dan sorpresas.

**El `if`:**

```ts
if (grupo) {
  grupo.reuniones.push(horario)
} else {
  grupos.push({ dia: horario.dia, reuniones: [horario] })
}
```

- Si ya existe el grupo de ese día, le sumamos la reunión.
- Si no existe, creamos uno nuevo con esa reunión como primera.

`.push()` agrega un elemento al final de un array.

**Seguilo a mano:**

| Vuelta | Reunión | ¿Existe el grupo? | Qué pasa |
| --- | --- | --- | --- |
| 1 | Domingo 10:00 | No | Se crea "Domingo" con 1 reunión |
| 2 | Domingo 18:00 | Sí | "Domingo" pasa a tener 2 |
| 3 | Miércoles 20:00 | No | Se crea "Miércoles" |
| 4 | Viernes 20:00 | No | Se crea "Viernes" |

Resultado: tres grupos.

### 3.3 `.map()`, `.find()`, `for...of`: cuál usar

| Quiero... | Uso | Devuelve |
| --- | --- | --- |
| Convertir **cada** elemento en otra cosa | `.map()` | Un array del mismo largo |
| Encontrar **un** elemento | `.find()` | Ese elemento o `undefined` |
| Quedarme con **algunos** | `.filter()` | Un array más corto (Etapa 8) |
| Armar algo con lógica propia | `for...of` | Lo que yo construya |

Acá no servía `.map()` porque el resultado no tiene el mismo largo: entran 4 y salen 3.

### 3.4 Una aclaración importante sobre `.push()`

En la Etapa 3 dije que el estado no se modifica directamente. `.push()` **modifica** el array. ¿No es una contradicción?

No, por dónde se usa. `grupos` es un array que la función **acaba de crear** y que nadie más conoce todavía. Modificar algo propio y recién creado no tiene problema. Lo que no se debe modificar es lo que pertenece a otro: el estado de React, las props, o el array `horarios` original.

De hecho, la función no toca `horarios`: lo lee y arma algo nuevo. Eso se llama **función pura**: con la misma entrada da siempre la misma salida y no altera nada de afuera. Son las más fáciles de entender y de probar.

### 3.5 `obtenerDiaDeHoy`

```ts
export function obtenerDiaDeHoy(fecha: Date = new Date()): string {
  return DIAS_DE_LA_SEMANA[fecha.getDay()]
}
```

`getDay()` devuelve el día de la semana como número: 0 es domingo, 1 lunes, hasta 6 sábado. Ese número se usa como **posición** en el array de nombres. Por eso el array empieza en `'Domingo'`.

Cuidado con dos métodos de nombre parecido:

- `getDay()` → día de la **semana** (0 a 6).
- `getDate()` → día del **mes** (1 a 31).

Igual que en la etapa anterior, el parámetro con valor por defecto permite probar la función con cualquier fecha.

Para que la comparación funcione, el día en `schedules.ts` tiene que estar escrito **igual** que en `DIAS_DE_LA_SEMANA`, con mayúscula y tilde: `'Miércoles'`, no `'miercoles'`.

---

## 4. `src/components/Schedule.tsx`

```tsx
import { horarios } from '../data/schedules'
import { agruparPorDia, obtenerDiaDeHoy } from '../utils/schedules'
import './Schedule.css'

function Schedule() {
  const dias = agruparPorDia(horarios)
  const hoy = obtenerDiaDeHoy()

  return (
    <ul className="horarios">
      {dias.map((grupo) => (
        <li
          key={grupo.dia}
          className={grupo.dia === hoy ? 'horarios-dia horarios-dia-hoy' : 'horarios-dia'}
        >
          <h3 className="horarios-nombre">
            {grupo.dia}
            {grupo.dia === hoy && <span className="horarios-hoy">Hoy</span>}
          </h3>

          <ul className="horarios-reuniones">
            {grupo.reuniones.map((reunion) => (
              <li key={reunion.id} className="horarios-reunion">
                <time dateTime={reunion.hora} className="horarios-hora">
                  {reunion.hora} hs
                </time>
                <span>{reunion.nombre}</span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}

export default Schedule
```

### 4.1 Preparar antes, dibujar después

```tsx
const dias = agruparPorDia(horarios)
const hoy = obtenerDiaDeHoy()
```

Las cuentas se hacen **antes** del `return`, y el JSX solo muestra el resultado. Ni `dias` ni `hoy` son estado: se calculan. No hay `useState` ni `useEffect` en este componente.

### 4.2 Cómo React convierte un array en elementos

Vale la pena mirarlo en cámara lenta:

```tsx
{dias.map((grupo) => (
  <li key={grupo.dia}>...</li>
))}
```

1. `dias` es un array de 3 objetos.
2. `.map()` llama a la función una vez por cada uno. Cada llamada devuelve un `<li>`.
3. El resultado es un array de 3 elementos `<li>`.
4. Las llaves `{ }` le entregan ese array a React.
5. React sabe dibujar un array de elementos: los pone uno tras otro.

**JSX no tiene bucles propios.** No existe una etiqueta "repetir". Se usa `.map()` porque JSX es JavaScript, y `.map()` es la forma de JavaScript de convertir una lista en otra. Dentro de las llaves solo puede ir algo que **devuelva un valor**; por eso sirve `.map()` y no un `for`, que no devuelve nada.

### 4.3 Un `.map()` dentro de otro

```tsx
{dias.map((grupo) => (
  <li key={grupo.dia}>
    ...
    {grupo.reuniones.map((reunion) => (
      <li key={reunion.id}>...</li>
    ))}
  </li>
))}
```

El de afuera recorre los días. Por cada día, el de adentro recorre **las reuniones de ese día**. Es la estructura del dato reflejada en el JSX: un array con arrays adentro se dibuja con un `.map()` con otro adentro.

### 4.4 `key`, ahora con dos niveles

Cada lista tiene su propia `key`:

- Los días usan `grupo.dia`. Después de agrupar, cada día aparece una sola vez, así que es único.
- Las reuniones usan `reunion.id`.

Recordatorio de las reglas:

- Única **entre hermanos**. No hace falta que sea única en toda la página: el `id: 1` de una reunión no choca con nada de otra lista.
- **Estable**: la misma reunión, siempre la misma key.

**¿Para qué la necesita React?** Imaginá que se agrega una reunión el lunes. Sin keys, React compara por posición: "el primero cambió, el segundo cambió, el tercero cambió, y hay uno nuevo", y redibuja todo. Con keys reconoce que Domingo, Miércoles y Viernes son los mismos de antes y solo inserta el nuevo. En listas grandes o con campos de formulario adentro, esa diferencia evita errores visibles.

Fijate dónde va: en el elemento **más externo** que devuelve el `.map()`, no en uno de adentro.

### 4.5 Marcar el día de hoy

```tsx
className={grupo.dia === hoy ? 'horarios-dia horarios-dia-hoy' : 'horarios-dia'}
```

```tsx
{grupo.dia === hoy && <span className="horarios-hoy">Hoy</span>}
```

Las dos herramientas de la etapa anterior, juntas: el ternario elige entre dos clases y el `&&` muestra la etiqueta "Hoy" o nada.

Si hoy no hay reunión, ninguna tarjeta se resalta. Es lo esperado.

### 4.6 La etiqueta `<time>`

```tsx
<time dateTime={reunion.hora}>{reunion.hora} hs</time>
```

`<time>` es la etiqueta semántica para fechas y horas. El texto visible es para las personas ("10:00 hs"). El atributo `dateTime` tiene el valor en formato estándar ("10:00") para buscadores y lectores de pantalla.

En JSX se escribe `dateTime`, con T mayúscula, aunque en HTML es `datetime`. Como con `className`, varios atributos cambian a camelCase.

### 4.7 ¿Por qué `Schedule` no recibe props?

El Hero recibía todo por props. Schedule importa sus datos directamente. ¿Cuál es el criterio?

- El **Hero** es una plantilla genérica: puede mostrar cualquier título e imagen. No tiene sentido que conozca los datos de la iglesia.
- **Schedule** sirve para una sola cosa: los horarios de la iglesia. Siempre son los mismos, en cualquier página.

Si un componente puede mostrar contenidos distintos según dónde se use, recibe props. Si siempre muestra lo mismo, puede ir a buscar sus datos solo.

Como no necesita nada, en la Etapa 12 lo vamos a poder poner en la página de Contacto con una sola línea: `<Schedule />`.

### 4.8 Por qué el título está en `Home` y no en `Schedule`

El componente devuelve solamente la lista. El `<section>`, el título "Horarios de reuniones" y el texto de introducción quedaron en `Home.tsx`.

Así el componente se puede reutilizar en otra página con otro título, o sin título. Si el encabezado estuviera adentro, en Contacto aparecería duplicado o habría que agregar una prop para ocultarlo.

---

## 5. `Schedule.css`: una grilla que se acomoda sola

```css
.horarios {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  gap: 1.5rem;
}
```

En el Footer y en los pilares escribimos media queries para cambiar la cantidad de columnas. Acá hay una técnica distinta: **no hay ninguna media query** y la grilla se adapta igual.

Se lee de adentro hacia afuera:

- `minmax(15rem, 1fr)`: cada columna mide como mínimo `15rem` y, si sobra lugar, crece en partes iguales.
- `repeat(auto-fit, ...)`: "poné tantas columnas como entren".

El navegador hace la cuenta: en un celular entra una columna; en una tablet, dos; en una computadora, tres.

**La ventaja real:** se adapta también a la **cantidad de tarjetas**. Si la iglesia suma una reunión los sábados, pasan a ser cuatro tarjetas y se acomodan solas. Con `repeat(3, 1fr)` fijo habría que retocar el CSS.

Cuándo usar cada una:

- **`auto-fit` + `minmax`**: tarjetas iguales cuya cantidad puede variar.
- **Media queries**: cuando el diseño cambia de forma (como el menú del Header), no solo de cantidad de columnas.

### Alinear hora y nombre

```css
.horarios-reunion {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
}

.horarios-hora {
  flex-shrink: 0;
  min-width: 4.5rem;
  font-weight: bold;
}
```

- `min-width` hace que todas las horas ocupen el mismo ancho, así los nombres quedan alineados en columna.
- `flex-shrink: 0` impide que la hora se comprima si el nombre es largo.
- `align-items: baseline` alinea los textos por la base de las letras.

---

## 6. `src/pages/Home.tsx`

```tsx
import Schedule from '../components/Schedule'

...

<section id="horarios" className="contenedor seccion home-horarios">
  <h2 className="home-titulo">Horarios de reuniones</h2>
  <p className="home-intro">
    Te esperamos en cualquiera de nuestras reuniones. No hace falta
    avisar: vení como estás.
  </p>

  <Schedule />
</section>
```

Se reemplazó el texto provisorio por el componente. El `id="horarios"` sigue ahí, así que el botón "Ver horarios" del Hero ahora lleva a contenido real.

El texto de introducción es una sugerencia; cambialo por el que quieras.

## 7. Un array, dos presentaciones

Ahora los horarios aparecen en dos lugares:

| | Footer | Inicio |
| --- | --- | --- |
| Formato | Lista simple, una línea por reunión | Tarjetas agrupadas por día |
| Transformación | Ninguna: `.map()` directo | `agruparPorDia` y después `.map()` |
| Datos | `data/schedules.ts` | `data/schedules.ts` |

Los dos leen del mismo archivo. Esa es la razón de separar datos y presentación: **el dato no sabe cómo lo van a mostrar**.

---

## 8. Cómo probarlo

```bash
npm run dev
```

En el Inicio, hacé clic en "Ver horarios" o bajá hasta la sección. Tenés que ver tres tarjetas:

- **Domingo**, con dos reuniones (10:00 y 18:00).
- **Miércoles**, con la de oración.
- **Viernes**, con la de jóvenes.

Si hoy es domingo, miércoles o viernes, esa tarjeta tiene borde dorado y la etiqueta "HOY". Si es otro día, ninguna se resalta.

Achicá la ventana despacio: pasan de tres columnas a dos y a una, sin saltos.

**Experimentos para entender**

1. **Un cambio, dos lugares.** En `schedules.ts`, cambiá la hora del miércoles a `'19:30'`. Se actualiza en el Inicio y en el Footer.
2. **Agregar una reunión.** Sumá `{ id: 5, dia: 'Sábado', hora: '17:00', nombre: 'Adolescentes' }`. Aparece una cuarta tarjeta y la grilla se reacomoda sola.
3. **Ver el agrupamiento.** Sumá `{ id: 6, dia: 'Viernes', hora: '18:00', nombre: 'Niños' }`. No se crea otra tarjeta: se suma a la de Viernes.
4. **Ver la marca de "Hoy".** En `Schedule.tsx`, cambiá temporalmente `const hoy = obtenerDiaDeHoy()` por `const hoy = 'Domingo'`. Después volvé a dejarlo.
5. **Romper la `key`.** Cambiá `key={reunion.id}` por `key={reunion.hora}`, agregá dos reuniones a la misma hora el mismo día y mirá la advertencia en la consola (`F12`). Así se ve por qué la hora no sirve como key.
6. **Mirar la transformación.** Agregá `console.log(dias)` antes del `return` y abrí la consola: vas a ver los tres grupos con sus reuniones adentro. Borralo después.

Sacá las reuniones de prueba al terminar.

## 9. Lo que viene

**Etapa 8 — Eventos.** Creamos `data/events.ts`, el componente `EventCard` (que sí recibe props) y la página de Eventos. Aparece `.filter()` para separar los próximos eventos de los anteriores comparando fechas, y vemos cómo mostrar una fecha en español ("20 de octubre").
