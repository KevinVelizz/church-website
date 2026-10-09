# Etapa 3 — Header y Footer

En esta etapa aparecen los primeros componentes propios. Son dos piezas que se ven en todas las páginas: el encabezado con el menú y el pie con los datos de la iglesia.

Conceptos nuevos de esta etapa:

- Crear un componente en su propio archivo y reutilizarlo.
- `import` y `export` entre archivos.
- Tipos de TypeScript (`type`).
- Mostrar valores de JavaScript dentro del JSX con `{ }`.
- Recorrer un array con `.map()` y la prop `key`.
- `useState`, el primer estado del proyecto.
- CSS *mobile first* con media queries, Flexbox y Grid.

Archivos nuevos:

```
src/
  data/
    site.ts          Datos generales: nombre, contacto, enlaces, redes
    schedules.ts     Horarios de las reuniones
  components/
    Header.tsx  + Header.css
    Footer.tsx  + Footer.css
```

Y cambiaron `src/App.tsx` y `src/App.css`.

---

## 1. Los datos primero: `src/data/site.ts`

Antes de dibujar nada, guardamos la información en un lugar aparte.

```ts
export type EnlaceNavegacion = {
  texto: string
  ruta: string
}

export type RedSocial = {
  nombre: string
  url: string
}

export const iglesia = {
  nombre: 'Nuestra Iglesia',
  descripcion:
    'Un lugar para conocer a Dios, crecer en comunidad y compartir la fe.',
  direccion: 'Calle Ejemplo 123, Ciudad',
  telefono: '+54 11 0000-0000',
  email: 'contacto@ejemplo.com',
}

export const enlacesNavegacion: EnlaceNavegacion[] = [
  { texto: 'Inicio', ruta: '/' },
  { texto: 'Nosotros', ruta: '/nosotros' },
  { texto: 'Eventos', ruta: '/eventos' },
  { texto: 'Publicaciones', ruta: '/publicaciones' },
  { texto: 'Oración', ruta: '/oracion' },
  { texto: 'Contacto', ruta: '/contacto' },
]

export const redesSociales: RedSocial[] = [
  { nombre: 'Instagram', url: 'https://www.instagram.com/' },
  { nombre: 'Facebook', url: 'https://www.facebook.com/' },
  { nombre: 'YouTube', url: 'https://www.youtube.com/' },
]
```

**Todos estos datos son de ejemplo.** La dirección, el teléfono, el email y las redes hay que reemplazarlos por los reales. Lo bueno es que se cambian acá y se actualizan en el Header y en el Footer a la vez.

### ¿Por qué un archivo `.ts` y no `.tsx`?

`.tsx` es para archivos que contienen JSX (etiquetas). Este archivo solo tiene datos, así que alcanza con `.ts`.

### `export`

Por defecto, lo que se declara en un archivo solo existe en ese archivo. `export` lo hace visible para que otro archivo pueda importarlo:

```ts
import { iglesia, enlacesNavegacion } from '../data/site'
```

Hay dos formas de exportar:

- **Con nombre** (`export const iglesia`): se importa entre llaves y con ese mismo nombre. Un archivo puede tener varias.
- **Por defecto** (`export default Header`): una sola por archivo, se importa sin llaves. Es la costumbre para componentes.

### `type`: describir la forma de un objeto

```ts
export type EnlaceNavegacion = {
  texto: string
  ruta: string
}
```

Esto es TypeScript. No genera nada en el navegador: es una descripción que dice "un enlace de navegación tiene un `texto` y una `ruta`, y los dos son texto".

`EnlaceNavegacion[]` significa "un array de enlaces". Si en algún elemento te olvidás la `ruta` o escribís `rutta`, el editor lo marca en rojo **antes** de que abras el navegador. Probalo: borrá una `ruta` y mirá el error.

`iglesia` no necesita un `type` escrito a mano: TypeScript lo deduce solo mirando el objeto. A eso se le llama *inferencia*.

### Array de objetos

`enlacesNavegacion` es un **array** (una lista ordenada, entre `[ ]`) donde cada elemento es un **objeto** (un grupo de datos con nombre, entre `{ }`). Es la estructura que más vas a usar en este proyecto: horarios, versículos, eventos y publicaciones van a tener esta misma forma.

## 2. `src/data/schedules.ts`

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

Este archivo estaba previsto para la Etapa 7, pero el Footer ya necesita mostrar los horarios, así que lo creamos ahora. En la Etapa 7 lo reutilizamos tal cual para la sección de horarios. Es un buen ejemplo de por qué conviene separar los datos: **una sola fuente, dos lugares que la muestran**.

Cada horario tiene un `id`. Enseguida vemos para qué.

---

## 3. `src/components/Header.tsx`

```tsx
import { useState } from 'react'
import { enlacesNavegacion, iglesia } from '../data/site'
import './Header.css'

function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  function alternarMenu() {
    setMenuAbierto(!menuAbierto)
  }

  return (
    <header className="header">
      <div className="header-contenido">
        <a href="/" className="header-marca">
          {iglesia.nombre}
        </a>

        <button
          type="button"
          className="header-boton-menu"
          aria-expanded={menuAbierto}
          aria-controls="menu-principal"
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          onClick={alternarMenu}
        >
          <span className="header-boton-linea"></span>
          <span className="header-boton-linea"></span>
          <span className="header-boton-linea"></span>
        </button>

        <nav
          id="menu-principal"
          className={menuAbierto ? 'header-nav header-nav-abierto' : 'header-nav'}
          aria-label="Principal"
        >
          <ul className="header-lista">
            {enlacesNavegacion.map((enlace) => (
              <li key={enlace.ruta}>
                <a href={enlace.ruta} className="header-enlace">
                  {enlace.texto}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
```

### 3.1 Las llaves `{ }` en JSX

```tsx
<a href="/" className="header-marca">
  {iglesia.nombre}
</a>
```

Dentro del JSX, las llaves significan "esto es JavaScript, calculá el valor y ponelo acá". `{iglesia.nombre}` se reemplaza por `Nuestra Iglesia`. Sirve tanto para el contenido como para los atributos (`href={enlace.ruta}`).

### 3.2 `.map()`: de datos a elementos

```tsx
{enlacesNavegacion.map((enlace) => (
  <li key={enlace.ruta}>
    <a href={enlace.ruta} className="header-enlace">
      {enlace.texto}
    </a>
  </li>
))}
```

`.map()` es un método de los arrays. Recorre el array, le aplica una función a cada elemento y devuelve **un array nuevo** con los resultados.

Ejemplo sin React:

```js
[1, 2, 3].map((numero) => numero * 2)   // [2, 4, 6]
```

Acá hacemos lo mismo, pero en vez de devolver números devolvemos elementos `<li>`. Entra un array de 6 objetos, sale un array de 6 `<li>`, y React sabe dibujar un array de elementos uno debajo del otro.

`(enlace) => ( ... )` es una **arrow function** (función flecha): una forma corta de escribir una función. `enlace` es el nombre que elegimos para "el elemento que toca en esta vuelta". Es equivalente a:

```js
function (enlace) {
  return ( ... )
}
```

La ventaja práctica: para agregar una página al menú no se toca el Header. Se agrega una línea en `site.ts`.

### 3.3 ¿Por qué `key`?

Cuando React dibuja una lista, necesita poder distinguir cada elemento de los demás. Si mañana la lista cambia (se agrega uno, se reordena, se borra otro), con la `key` React sabe exactamente cuál cambió y actualiza solo ese, en lugar de rehacer todo.

Reglas:

- Tiene que ser **única entre hermanos** de la misma lista.
- Tiene que ser **estable**: el mismo elemento debe tener siempre la misma key.

Por eso usamos `enlace.ruta` (no hay dos páginas con la misma ruta) y, en los horarios, `horario.id`. En los horarios no podíamos usar `dia`, porque "Domingo" aparece dos veces. Para eso existe el `id`.

Evitá usar la posición en el array como key (`map((item, i) => <li key={i}>`): si la lista se reordena, la posición cambia y React se confunde. Si te olvidás la `key`, React avisa con una advertencia en la consola del navegador.

### 3.4 `useState`: el menú se abre y se cierra

En el celular el menú está oculto hasta que se toca el botón. El componente necesita **recordar** si el menú está abierto o cerrado. Ese dato que cambia con el tiempo y afecta lo que se ve se llama **estado**.

```tsx
const [menuAbierto, setMenuAbierto] = useState(false)
```

- `useState` es una función de React (un *hook*). Se importa arriba: `import { useState } from 'react'`.
- El `false` entre paréntesis es el **valor inicial**: el menú empieza cerrado.
- Devuelve un array con dos cosas:
  1. `menuAbierto`: el valor actual.
  2. `setMenuAbierto`: la función para cambiarlo.
- Los corchetes del lado izquierdo son **destructuring**: una forma corta de sacar las dos cosas del array y ponerles nombre. Los nombres los elegimos nosotros; la costumbre es `algo` y `setAlgo`.

```tsx
function alternarMenu() {
  setMenuAbierto(!menuAbierto)
}
```

`!` significa "lo contrario". Si estaba en `false` pasa a `true`, y al revés.

**Qué pasa cuando tocás el botón:**

1. `onClick={alternarMenu}` ejecuta la función.
2. `setMenuAbierto(true)` le avisa a React que el estado cambió.
3. React **vuelve a ejecutar** la función `Header` completa, ahora con `menuAbierto` en `true`.
4. El JSX resultante tiene otra clase en el `<nav>`, y React actualiza solo eso en la página.

Ese ciclo (cambia el estado, se vuelve a dibujar) es la idea central de React.

**¿Por qué no modificar la variable directamente?** Si escribieras `menuAbierto = true`, el valor cambiaría pero React no se enteraría, así que no volvería a dibujar y en pantalla no pasaría nada. La única manera de avisarle es usar la función `set...`. (Además, `const` ni siquiera te deja reasignarla.)

Un detalle: se escribe `onClick={alternarMenu}`, **sin paréntesis**. Le pasamos la función para que React la llame cuando haya un clic. Con paréntesis (`alternarMenu()`) se ejecutaría en el momento de dibujar.

### 3.5 Mostrar una cosa u otra: el operador ternario

```tsx
className={menuAbierto ? 'header-nav header-nav-abierto' : 'header-nav'}
```

Se lee: "si `menuAbierto` es verdadero, usá lo primero; si no, lo segundo". Es un `if/else` de una línea, que se puede usar dentro del JSX. El CSS se encarga del resto: la clase `header-nav-abierto` es la que hace visible el menú.

### 3.6 Accesibilidad del botón

- Es un `<button>` de verdad, no un `<div>` con clic. Un botón se puede enfocar con Tab y activar con Enter o Espacio sin que hagamos nada extra.
- `aria-label`: el botón no tiene texto, solo tres rayitas. Esto le da un nombre para quien usa lector de pantalla, y cambia según el estado.
- `aria-expanded`: informa si lo que el botón controla está desplegado o no.
- `aria-controls="menu-principal"`: indica qué elemento controla (coincide con el `id` del `<nav>`).
- `<header>`, `<nav>` y `<ul>` son etiquetas semánticas: le dicen al navegador qué es cada cosa, no solo cómo se ve.

### 3.7 Los enlaces son `<a href>` (por ahora)

Si hacés clic en "Nosotros", la dirección cambia a `/nosotros`, pero **la página se recarga entera** y ves lo mismo, porque todavía no hay otras páginas. Fijate en ese parpadeo: es el problema que resuelve React Router. En la Etapa 4 reemplazamos estos `<a>` por `<Link>` y vas a notar la diferencia.

---

## 4. `src/components/Header.css`

Los puntos importantes (el archivo completo está en el proyecto):

```css
.header {
  position: sticky;
  top: 0;
  z-index: 10;
}
```

`sticky` deja el Header pegado arriba mientras se hace scroll, para que el menú esté siempre a mano.

```css
.header-contenido {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
}
```

**Flexbox** acomoda elementos en una fila. `space-between` manda el nombre a la izquierda y el botón a la derecha. `flex-wrap: wrap` permite que el menú, que ocupa el 100% del ancho, baje a una segunda línea cuando se abre.

### Mobile first

```css
/* Sin media query: así se ve en celular */
.header-nav {
  display: none;
  width: 100%;
}

.header-nav-abierto {
  display: block;
}

/* Desde 768px: tablets y computadoras */
@media (min-width: 768px) {
  .header-boton-menu {
    display: none;
  }

  .header-nav {
    display: block;
    width: auto;
  }

  .header-lista {
    display: flex;
    gap: 1.5rem;
  }
}
```

Los estilos "sueltos" son los del celular. La **media query** `@media (min-width: 768px)` dice: "cuando la pantalla mida 768px o más, aplicá además esto". Ahí ocultamos el botón hamburguesa y mostramos el menú siempre, en fila.

Se escribe primero el celular porque es el caso más simple (todo apilado) y se va agregando complejidad a medida que hay espacio. Al revés, uno termina deshaciendo estilos de escritorio.

El botón mide `2.75rem` (unos 44px), que es el tamaño mínimo recomendado para tocar cómodamente con el dedo.

---

## 5. `src/components/Footer.tsx`

```tsx
import { horarios } from '../data/schedules'
import { enlacesNavegacion, iglesia, redesSociales } from '../data/site'
import './Footer.css'

function Footer() {
  const anioActual = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-contenido">
        <section className="footer-columna">
          <h2 className="footer-nombre">{iglesia.nombre}</h2>
          <p>{iglesia.descripcion}</p>
        </section>

        <section className="footer-columna">
          <h3 className="footer-titulo">Horarios</h3>
          <ul className="footer-lista">
            {horarios.map((horario) => (
              <li key={horario.id}>
                {horario.dia} {horario.hora} hs · {horario.nombre}
              </li>
            ))}
          </ul>
        </section>

        <section className="footer-columna">
          <h3 className="footer-titulo">Contacto</h3>
          <address className="footer-direccion">
            <p>{iglesia.direccion}</p>
            <p>
              <a href={`tel:${iglesia.telefono}`}>{iglesia.telefono}</a>
            </p>
            <p>
              <a href={`mailto:${iglesia.email}`}>{iglesia.email}</a>
            </p>
          </address>
        </section>

        <section className="footer-columna">
          <h3 className="footer-titulo">Enlaces</h3>
          <ul className="footer-lista">
            {enlacesNavegacion.map((enlace) => (
              <li key={enlace.ruta}>
                <a href={enlace.ruta}>{enlace.texto}</a>
              </li>
            ))}
          </ul>
        </section>

        <section className="footer-columna">
          <h3 className="footer-titulo">Redes sociales</h3>
          <ul className="footer-lista">
            {redesSociales.map((red) => (
              <li key={red.nombre}>
                <a href={red.url} target="_blank" rel="noreferrer">
                  {red.nombre}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <p className="footer-copyright">
        © {anioActual} {iglesia.nombre}. Todos los derechos reservados.
      </p>
    </footer>
  )
}

export default Footer
```

Es el mismo patrón que el Header, repetido tres veces: un array y un `.map()`. Lo nuevo:

- **No usa `useState`.** Nada en el Footer cambia mientras lo mirás, así que no necesita estado. Regla general: si un valor se puede calcular directamente, no es estado.
- `new Date().getFullYear()` crea un objeto con la fecha de hoy y le pide el año. Así el copyright nunca queda desactualizado. `Date` vuelve con más detalle en la Etapa 6 (versículo del día).
- `` `tel:${iglesia.telefono}` `` es un **template literal**: un texto entre comillas invertidas donde `${ }` inserta un valor. El resultado es `tel:+54 11 0000-0000`. Un enlace `tel:` abre el marcador en el celular y `mailto:` abre el programa de correo.
- `<address>` es la etiqueta semántica para datos de contacto.
- `target="_blank"` abre las redes en otra pestaña (son sitios externos; no queremos que el visitante se vaya del nuestro). `rel="noreferrer"` es una medida de seguridad y privacidad que conviene poner siempre junto a `_blank`.

### `Footer.css`: Grid

```css
.footer-contenido {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 600px) {
  .footer-contenido {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 960px) {
  .footer-contenido {
    grid-template-columns: 2fr 2fr 2fr 1fr 1fr;
  }
}
```

**Grid** arma una grilla de columnas. `fr` es "una fracción del espacio disponible".

- Celular: una columna, todo apilado.
- Tablet: dos columnas iguales.
- Computadora: cinco columnas; las tres primeras, el doble de anchas que las dos últimas.

**¿Flexbox o Grid?** Flexbox para acomodar cosas en **una línea** (el Header). Grid cuando hay **filas y columnas** (el Footer, y más adelante las tarjetas de eventos).

---

## 6. `src/App.tsx`: usar los componentes

```tsx
import Footer from './components/Footer'
import Header from './components/Header'
import './App.css'

function App() {
  return (
    <div className="app">
      <Header />

      <main className="app-principal">
        <h1>Bienvenidos</h1>
        <p>Sitio en construcción.</p>
      </main>

      <Footer />
    </div>
  )
}

export default App
```

Un componente se usa como si fuera una etiqueta HTML: `<Header />`. Por eso el nombre va con mayúscula: así React distingue tus componentes (`<Header />`) de las etiquetas del navegador (`<header>`).

Esto es **reutilizar**: el Header se escribe una vez y se coloca donde haga falta. Como está en `App`, que envuelve a todo, va a aparecer en todas las páginas cuando existan.

La estructura ya es la semántica que queríamos: `header`, `main`, `footer`.

### `App.css`: el Footer siempre abajo

```css
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-principal {
  flex: 1;
}
```

`100vh` es el alto completo de la ventana. Con `flex-direction: column` los tres bloques se apilan, y `flex: 1` hace que el `<main>` ocupe todo el espacio que sobra. Resultado: aunque la página tenga poco contenido, el Footer queda al fondo y no flotando por la mitad.

---

## 7. Cómo probarlo

```bash
npm run dev
```

En `http://localhost:5173` tenés que ver:

**En la computadora**

- Arriba, una barra blanca con "Nuestra Iglesia" a la izquierda y los seis enlaces a la derecha, en fila.
- En el medio, "Bienvenidos / Sitio en construcción."
- Abajo, un pie azul oscuro con cinco columnas y el copyright con el año actual.

**En el celular**

Abrí las herramientas del navegador con `F12` y activá la vista de dispositivos con `Ctrl + Shift + M` (o achicá la ventana).

- Desaparecen los enlaces y aparece el botón con tres rayitas.
- Al tocarlo, el menú se despliega hacia abajo. Al tocarlo otra vez, se cierra.
- El Footer pasa a una sola columna.

**Experimentos para entender**

1. En `site.ts`, agregá `{ texto: 'Horarios', ruta: '/horarios' }` al array. Aparece en el Header **y** en el Footer sin tocar ningún componente. Después sacalo.
2. En `Header.tsx`, cambiá `useState(false)` por `useState(true)`. En celular el menú arranca abierto. Volvé a dejarlo en `false`.
3. Borrá `key={enlace.ruta}`, abrí la consola (`F12`) y leé la advertencia de React. Volvé a ponerlo.
4. Con el teclado: apretá `Tab` varias veces y fijate cómo el foco recorre los enlaces. En vista celular, llegá al botón y apretá `Enter`.

## 8. Lo que viene

**Etapa 4 — React Router.** Instalamos `react-router-dom`, creamos las seis páginas (vacías por ahora), configuramos las rutas y reemplazamos los `<a>` por `<Link>` y `<NavLink>`, que además permite resaltar la página en la que estás.
