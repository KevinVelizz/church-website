# Etapa 4 — React Router

Hasta ahora el sitio tenía una sola pantalla. En esta etapa pasa a tener seis páginas, cada una con su dirección, y el menú empieza a funcionar de verdad.

Conceptos nuevos de esta etapa:

- Qué es una SPA y por qué necesitamos un router.
- Instalar una dependencia con npm.
- `BrowserRouter`, `Routes` y `Route`.
- `Link` y `NavLink`, y por qué no usar `<a href>` para navegar dentro del sitio.
- Fragments (`<>...</>`).
- Pasar componentes "adentro" de otros (`children`).
- La ruta comodín para la página 404.

Qué cambió:

```
package.json                  Nueva dependencia: react-router-dom
src/
  main.tsx                    Envuelve la app con BrowserRouter
  App.tsx                     Define las rutas
  components/
    Header.tsx  + Header.css  Usa Link y NavLink; cierra el menú al navegar
    Footer.tsx                Usa Link
  pages/                      (carpeta nueva con contenido)
    Home.tsx
    Nosotros.tsx
    Eventos.tsx
    Publicaciones.tsx
    Oracion.tsx
    Contacto.tsx
    NoEncontrada.tsx
```

---

## 1. El problema que resuelve

Acordate de la Etapa 1: el proyecto tiene **un solo archivo HTML** (`index.html`). React dibuja todo adentro de `<div id="root">`. A este tipo de sitio se le llama **SPA** (*Single Page Application*, aplicación de una sola página).

En un sitio tradicional, cada dirección es un archivo distinto: `/nosotros` carga `nosotros.html`, y el navegador descarga y dibuja todo desde cero.

En una SPA no hay un `nosotros.html`. Entonces alguien tiene que:

1. Mirar la dirección del navegador (`/nosotros`).
2. Decidir qué componente mostrar (`<Nosotros />`).
3. Cambiar la dirección cuando hacés clic en un enlace, **sin recargar la página**.

React no trae esto incluido. React Router es la librería que lo hace.

## 2. Instalación

```bash
npm install react-router-dom
```

Qué hace este comando:

- Descarga la librería a la carpeta `node_modules/`.
- La anota en `package.json`, dentro de `dependencies`:

```json
"dependencies": {
  "react": "^19.2.8",
  "react-dom": "^19.2.8",
  "react-router-dom": "^7.18.4"
}
```

- Actualiza `package-lock.json`, que registra la versión exacta de cada paquete instalado.

Como queda anotada en `package.json`, cualquiera que clone el repo la obtiene con un simple `npm install`. Por eso `node_modules/` no se sube a GitHub: se puede regenerar.

**Yo ya corrí este comando en tu carpeta.** Si trabajás desde otra computadora o volvés a clonar el repo, ejecutá `npm install`.

`dependencies` contra `devDependencies`: las primeras son las que el sitio necesita para funcionar en el navegador (React, el router). Las segundas son herramientas para desarrollar (Vite, TypeScript, ESLint).

## 3. `src/main.tsx`: activar el router

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

Lo nuevo son tres líneas: el `import` y las etiquetas `<BrowserRouter>` que envuelven a `<App />`.

`BrowserRouter` es un componente que no dibuja nada visible. Su trabajo es **vigilar la dirección del navegador** y avisarle a todo lo que tiene adentro cuando cambia. Por eso va bien arriba, envolviendo toda la aplicación: `Routes`, `Link` y `NavLink` solo funcionan si están dentro de un `BrowserRouter`. Si usás un `Link` fuera, React Router da un error.

### Concepto: `children`

Fijate que `<BrowserRouter>` se escribe con apertura y cierre, y tiene algo adentro. Hasta ahora usábamos componentes que se cierran solos (`<Header />`). Un componente también puede **recibir contenido adentro**, igual que un `<div>`. A ese contenido React lo llama `children` (hijos). `StrictMode` hace lo mismo. Más adelante vamos a crear nuestros propios componentes con `children`.

## 4. Las páginas: `src/pages/`

Cada página es un componente común. Por ahora son mínimas; las vamos a ir llenando en las próximas etapas.

`src/pages/Nosotros.tsx`:

```tsx
function Nosotros() {
  return (
    <>
      <h1>Nosotros</h1>
      <p>Acá vamos a contar quiénes somos.</p>
    </>
  )
}

export default Nosotros
```

Las otras cinco (`Home`, `Eventos`, `Publicaciones`, `Oracion`, `Contacto`) son iguales, cambiando el nombre y los textos.

### Concepto: Fragment `<>...</>`

Un componente tiene que devolver **un solo elemento raíz**. Esto no es válido:

```tsx
return (
  <h1>Nosotros</h1>
  <p>Texto</p>
)
```

La solución obvia sería envolver los dos en un `<div>`, pero eso agrega al HTML un `div` que no sirve para nada. El **Fragment** (`<>` y `</>`) agrupa los elementos para cumplir la regla **sin agregar nada** al HTML final.

Acá además tiene sentido por otra razón: el `<main>` ya está en `App.tsx`, así que la página solo aporta su contenido.

### ¿Página o componente?

Técnicamente son lo mismo: funciones que devuelven JSX. La diferencia es de organización. En `pages/` va lo que corresponde a una dirección. En `components/` van las piezas que las páginas usan.

## 5. `src/App.tsx`: las rutas

```tsx
import { Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import Contacto from './pages/Contacto'
import Eventos from './pages/Eventos'
import Home from './pages/Home'
import NoEncontrada from './pages/NoEncontrada'
import Nosotros from './pages/Nosotros'
import Oracion from './pages/Oracion'
import Publicaciones from './pages/Publicaciones'
import './App.css'

function App() {
  return (
    <div className="app">
      <Header />

      <main className="app-principal">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/publicaciones" element={<Publicaciones />} />
          <Route path="/oracion" element={<Oracion />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App
```

### `Route`: una regla

```tsx
<Route path="/nosotros" element={<Nosotros />} />
```

Se lee: "cuando la dirección sea `/nosotros`, mostrá el componente `<Nosotros />`".

- `path` es la dirección.
- `element` es lo que se dibuja. Va entre llaves porque le pasamos un elemento JSX.

### `Routes`: el que elige

`<Routes>` mira la dirección actual, recorre sus `<Route>` y muestra **solo la que coincide**. Funciona como un `switch`: de todas las opciones, se dibuja una.

### Lo importante: dónde están ubicados

`<Header />` y `<Footer />` están **fuera** de `<Routes>`. Por eso no cambian al navegar: lo único que se reemplaza es lo que está dentro del `<main>`. Así se cumple el requisito de que el Header y el Footer aparezcan en todas las páginas, sin repetirlos en cada una.

### La ruta comodín

```tsx
<Route path="*" element={<NoEncontrada />} />
```

El `*` significa "cualquier otra dirección". Si alguien escribe `/cualquier-cosa`, en vez de una pantalla vacía ve una página de error amable. Es lo que se conoce como página 404.

### No hace falta `/horarios`

En el plan quedó abierta la posibilidad de una página aparte para los horarios. Mi recomendación es **no crearla**: son cuatro líneas de información, y van a estar en el Inicio (Etapa 7), en el Footer y en Contacto. Una página entera para eso obliga a un clic más sin aportar nada. Si más adelante la iglesia suma muchas actividades, se agrega con una línea en `site.ts` y otra acá.

## 6. `Link`: navegar sin recargar

`src/pages/NoEncontrada.tsx` muestra el uso más simple:

```tsx
import { Link } from 'react-router-dom'

function NoEncontrada() {
  return (
    <>
      <h1>Página no encontrada</h1>
      <p>La dirección que buscás no existe.</p>
      <Link to="/">Volver al inicio</Link>
    </>
  )
}

export default NoEncontrada
```

`<Link to="/nosotros">` reemplaza a `<a href="/nosotros">`. Cambia `href` por `to`.

### ¿Por qué no `<a href>`?

| | `<a href="/nosotros">` | `<Link to="/nosotros">` |
| --- | --- | --- |
| Qué hace el navegador | Pide la página al servidor de nuevo | Nada: no hay pedido |
| JavaScript | Se descarga y arranca otra vez | Sigue corriendo |
| Estado (`useState`) | Se pierde todo | Se conserva |
| Qué se redibuja | Toda la página | Solo lo que cambió |
| Velocidad | Lenta, con parpadeo | Instantánea |

Con `<a>`, cada clic es como cerrar el sitio y volver a abrirlo. Con `<Link>`, React Router intercepta el clic, cambia la dirección en la barra del navegador y `<Routes>` muestra el componente nuevo. Nada se recarga.

Lo interesante es que, en el HTML final, `<Link>` **sigue siendo un `<a>`**. Por eso funciona todo lo esperable: clic derecho y "abrir en pestaña nueva", navegación con teclado, lectores de pantalla, y los buscadores lo reconocen como enlace. Lo único que cambia es qué pasa al hacer clic.

**Regla práctica:**

- Enlace a otra página **de nuestro sitio**: `<Link>`.
- Enlace a **otro sitio** (Instagram, YouTube), `tel:` o `mailto:`: `<a href>`.

Por eso en el Footer los enlaces rápidos pasaron a `<Link>`, pero las redes sociales, el teléfono y el email siguen siendo `<a>`.

Los botones atrás y adelante del navegador también funcionan: React Router usa el historial del navegador.

## 7. `NavLink`: saber en qué página estás

En `src/components/Header.tsx`, los enlaces del menú ahora son así:

```tsx
import { Link, NavLink } from 'react-router-dom'

...

<Link to="/" className="header-marca" onClick={cerrarMenu}>
  {iglesia.nombre}
</Link>

...

{enlacesNavegacion.map((enlace) => (
  <li key={enlace.ruta}>
    <NavLink
      to={enlace.ruta}
      className="header-enlace"
      onClick={cerrarMenu}
    >
      {enlace.texto}
    </NavLink>
  </li>
))}
```

`NavLink` es un `Link` con un extra: **sabe si su dirección es la actual**. Cuando coincide, hace dos cosas solo:

1. Le agrega la clase `active` al enlace.
2. Le agrega el atributo `aria-current="page"`, que le avisa a los lectores de pantalla "esta es la página en la que estás".

En `Header.css` solo hubo que agregar el estilo para esa clase:

```css
.header-enlace.active {
  color: var(--color-primario);
  font-weight: bold;
}
```

`.header-enlace.active` (pegado, sin espacio) significa "un elemento que tiene **las dos** clases a la vez".

Usamos `NavLink` en el menú porque ahí sirve resaltar dónde estás. El nombre de la iglesia y los enlaces del Footer usan `Link` común, porque no necesitan resaltarse.

### Cerrar el menú al navegar

```tsx
function cerrarMenu() {
  setMenuAbierto(false)
}
```

Esto es consecuencia directa de no recargar la página. Antes, al hacer clic en un enlace todo se recargaba y el menú volvía a estar cerrado. Ahora el Header **no se vuelve a crear** al navegar, así que su estado se conserva: si el menú estaba abierto, seguiría abierto tapando la página nueva. Por eso lo cerramos a mano con `onClick={cerrarMenu}`.

Es un buen ejemplo de la fila "Estado" de la tabla anterior: el estado sobrevive a la navegación, para bien y para mal.

`alternarMenu` (invierte) queda para el botón hamburguesa; `cerrarMenu` (siempre cierra) para los enlaces.

## 8. Rutas dinámicas (adelanto)

Todas las rutas de hoy son fijas. En la Etapa 9 vamos a necesitar una página por cada publicación, y no podemos escribir una `<Route>` para cada una. Para eso existen las **rutas dinámicas**:

```tsx
<Route path="/publicaciones/:id" element={<PublicacionDetalle />} />
```

Los dos puntos indican que `id` es una **variable**. Esa única regla sirve para `/publicaciones/1`, `/publicaciones/2`, etc., y dentro del componente se lee el valor con un hook llamado `useParams`. Lo vemos con detalle cuando llegue el momento; por ahora alcanza con saber que existe.

## 9. Un detalle para cuando se publique el sitio

En tu computadora, si escribís `http://localhost:5173/eventos` directamente o apretás F5 estando en esa página, funciona. Vite sabe que tiene que devolver siempre `index.html`.

En un hosting real, el servidor va a buscar un archivo llamado `eventos` y, como no existe, puede responder con un error 404 propio. La solución es configurar el hosting para que **todas las direcciones devuelvan `index.html`**. Netlify, Vercel y similares lo resuelven con una línea de configuración. No hay que hacer nada ahora; lo dejo anotado para cuando publiquemos.

---

## 10. Cómo probarlo

Si el servidor estaba corriendo desde antes de instalar React Router, detenelo con `Ctrl + C` y volvé a iniciarlo:

```bash
npm run dev
```

Qué tenés que ver en `http://localhost:5173`:

- La página de inicio con el título "Bienvenidos".
- En el menú, **Inicio** resaltado en azul y negrita.
- Al hacer clic en **Eventos**: la dirección cambia a `/eventos`, el título pasa a "Eventos", y **Eventos** queda resaltado en lugar de Inicio.
- El cambio es instantáneo, sin el parpadeo de la etapa anterior.

**Experimentos para entender**

1. **Comprobar que no se recarga.** Abrí las herramientas con `F12`, pestaña *Network* (Red). Navegá entre páginas: no aparece ningún pedido nuevo. Ahora apretá `F5`: aparece una lista entera. Esa es la diferencia entre navegar con `Link` y recargar.
2. **Ver la diferencia con `<a>`.** En `NoEncontrada.tsx`, cambiá `<Link to="/">` por `<a href="/">`, entrá a `/cualquier-cosa` y hacé clic. Vas a ver el parpadeo y los pedidos en *Network*. Volvé a dejar el `Link`.
3. **Página 404.** Escribí `http://localhost:5173/no-existe` en la barra de direcciones.
4. **Botón atrás.** Navegá por tres páginas y usá las flechas atrás y adelante del navegador.
5. **Inspeccionar `NavLink`.** Clic derecho sobre un enlace del menú, *Inspeccionar*. Vas a ver un `<a>` común y, en el de la página actual, `class="header-enlace active"` y `aria-current="page"`.
6. **Menú en celular.** En vista de dispositivo (`Ctrl + Shift + M`), abrí el menú y tocá un enlace: cambia la página y el menú se cierra solo. Probá sacar `onClick={cerrarMenu}` del `NavLink` para ver qué pasa sin eso, y volvé a ponerlo.

## 11. Lo que viene

**Etapa 5 — Home.** Armamos la página de inicio con su sección principal (Hero): imagen de fondo, frase, descripción y los dos botones. Ahí aparecen las **props**, la forma de pasarle datos a un componente, y vemos cómo usar imágenes desde `public/images/`.
