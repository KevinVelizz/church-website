# Etapa 2 — Limpiar el proyecto y crear la estructura de carpetas

En la Etapa 1 creaste el proyecto con Vite. Vite te deja una página de ejemplo (el contador, los logos, los enlaces a la documentación). Esa página sirve para comprobar que todo funciona, pero no es nuestra. En esta etapa la quitamos y dejamos el terreno preparado para construir el sitio.

No aparece ningún concepto nuevo de React todavía. Lo importante acá es entender **qué archivo hace qué** y **por qué ordenamos las carpetas así**.

## 1. Qué se borró y por qué

| Archivo | Por qué se va |
| --- | --- |
| `src/assets/hero.png`, `react.svg`, `vite.svg` | Eran las imágenes de la página de ejemplo. |
| `public/icons.svg` | Íconos de los enlaces de ejemplo (GitHub, Discord...). |
| Todo el contenido de `src/App.css` | Eran estilos del contador y de la página de ejemplo. |
| Todo el contenido de `src/index.css` | Colores y tamaños pensados para la plantilla de Vite. |

`public/favicon.svg` (el ícono de la pestaña) queda por ahora. Lo cambiamos cuando tengamos el logo de la iglesia.

## 2. `index.html`

Ubicación: en la raíz del proyecto. Cambiaron dos líneas:

```html
<html lang="es">
...
<title>Nuestra Iglesia</title>
```

- `lang="es"` le dice al navegador y a los lectores de pantalla que el contenido está en español. Un lector de pantalla usa este dato para elegir la pronunciación. Es la primera mejora de accesibilidad del proyecto y cuesta una palabra.
- `<title>` es el texto que aparece en la pestaña del navegador y en los resultados de Google.

Recordá de la Etapa 1: este es el **único** archivo HTML del sitio. React dibuja todo adentro de `<div id="root"></div>`.

## 3. `src/App.tsx`

```tsx
import './App.css'

function App() {
  return (
    <main className="en-construccion">
      <h1>Nuestra Iglesia</h1>
      <p>Sitio en construcción.</p>
    </main>
  )
}

export default App
```

Parte por parte:

- `import './App.css'` carga los estilos de este componente. No importamos ninguna variable, solo le decimos a Vite "incluí este CSS".
- `function App() { ... }` es un **componente**: una función común de JavaScript cuyo nombre empieza con mayúscula y que devuelve lo que se tiene que ver en pantalla.
- Lo que está dentro del `return` es **JSX** (en archivos `.tsx`). Parece HTML, pero es JavaScript. Por eso algunas cosas cambian de nombre: en HTML se escribe `class`, en JSX se escribe `className`, porque `class` ya es una palabra reservada de JavaScript.
- `<main>` es una etiqueta semántica: indica que ahí está el contenido principal de la página. Más adelante el Header va a ir antes y el Footer después.
- `export default App` permite que otro archivo lo use. `main.tsx` hace `import App from './App.tsx'` y lo dibuja.

Fijate lo que **desapareció**: `useState` y el contador. Todavía no necesitamos estado, así que no lo usamos. Vuelve en la Etapa 3, cuando el menú del celular tenga que abrirse y cerrarse.

Este contenido es temporal. Solo sirve para ver algo en pantalla mientras armamos las piezas reales.

## 4. `src/index.css` — estilos globales

Este archivo lo importa `main.tsx`, así que se aplica a **todo** el sitio. Tiene tres partes.

**Variables CSS** (también llamadas *custom properties*):

```css
:root {
  --color-primario: #1f3a5f;
  --color-acento: #b8862f;
  --fuente-titulos: Georgia, 'Times New Roman', serif;
  --ancho-maximo: 1100px;
}
```

`:root` es el elemento `<html>`. Lo que se define ahí se puede usar en cualquier otro CSS con `var(--color-primario)`. La ventaja: si mañana la iglesia quiere otro color, se cambia en **un solo lugar** y se actualiza todo el sitio.

La paleta es sobria a propósito: un azul profundo para títulos, un dorado apagado como acento y un fondo crema en vez de blanco puro. Se puede cambiar cuando quieras.

**Reset mínimo:**

```css
*, *::before, *::after {
  box-sizing: border-box;
}
```

Por defecto, si a una caja le ponés `width: 200px` y `padding: 20px`, termina midiendo 240px. Con `border-box` mide 200px y el padding queda adentro. Hace que los tamaños sean predecibles y evita muchos problemas de responsive.

**Estilos base** para `body`, títulos, párrafos, imágenes y enlaces. Dos detalles:

- `font-size: 1rem`: `rem` es una unidad relativa al tamaño de letra que el usuario configuró en su navegador. Si alguien necesita letra más grande, el sitio lo respeta. Con `px` fijos no pasa.
- `img { max-width: 100%; height: auto; }`: ninguna imagen se va a salir de su contenedor en un celular. Es la base de las imágenes responsive.

## 5. `src/App.css`

```css
.en-construccion {
  max-width: var(--ancho-maximo);
  margin: 0 auto;
  padding: 4rem 1.5rem;
  text-align: center;
}
```

Acá se ve una variable en uso: `var(--ancho-maximo)`. `margin: 0 auto` centra el bloque horizontalmente.

### Cómo vamos a organizar el CSS

Hay tres formas habituales:

1. **Todo en un CSS global.** Simple al principio, pero el archivo crece hasta volverse difícil de mantener.
2. **Un CSS por componente** (`Header.tsx` + `Header.css`). Cada componente importa su propio archivo.
3. **CSS Modules** (`Header.module.css`). Igual que la anterior, pero las clases quedan aisladas automáticamente y no pueden chocar entre componentes.

Vamos a usar la **opción 2**: `index.css` para lo global y un `.css` al lado de cada componente. Es la más fácil de entender. Tiene una trampa que conviene conocer: aunque el archivo esté al lado del componente, sus clases siguen siendo globales. Si dos componentes usan `.titulo`, se pisan. Lo evitamos poniendo el nombre del componente como prefijo (`.header-menu`, `.footer-titulo`).

## 6. La estructura de carpetas

```
src/
  components/   Piezas reutilizables: Header, Footer, EventCard...
  pages/        Una página por ruta: Home, Nosotros, Eventos...
  data/         Datos: horarios, versículos, eventos, publicaciones
  App.tsx
  main.tsx
  index.css
public/
  images/       Fotos del sitio
docs/           Las explicaciones de cada etapa (como esta)
```

La idea detrás de la separación:

- **`components/`** responde a "¿cómo se ve esta pieza?". Son bloques que se usan en más de un lugar o que conviene aislar.
- **`pages/`** responde a "¿qué hay en esta dirección?". Cada página arma su contenido combinando componentes.
- **`data/`** responde a "¿qué información mostramos?". Separar los datos de la presentación es lo que más adelante va a permitir reemplazar un array local por una base de datos sin tocar los componentes.

### ¿Qué son los archivos `.gitkeep`?

Git guarda archivos, no carpetas. Una carpeta vacía no se sube al repositorio. `.gitkeep` es un archivo vacío que se pone solo para que la carpeta exista en GitHub. No es nada especial de Git, es una costumbre. Cuando cada carpeta tenga su primer archivo real, lo borramos.

### `public/` contra `src/assets/`

- Lo que está en `public/` se sirve tal cual. `public/images/templo.jpg` se usa como `<img src="/images/templo.jpg" />`.
- Lo que está en `src/assets/` se importa desde el código y Vite lo procesa.

Para este proyecto usamos `public/images/`: es más directo y, cuando las fotos vengan de un panel de administración, también van a ser simples direcciones.

## 7. Cómo probarlo

```bash
npm run dev
```

Abrí `http://localhost:5173`. Tenés que ver:

- Fondo color crema.
- El título **Nuestra Iglesia** centrado, en azul oscuro y con letra serif.
- Debajo, en gris, "Sitio en construcción."
- En la pestaña del navegador, el texto "Nuestra Iglesia".

Prueba para entender las variables: abrí `src/index.css`, cambiá `--color-primario` por `#7a1f1f` y guardá. El título cambia de color sin recargar la página (eso es el *Hot Module Replacement* de Vite). Después volvé a dejarlo como estaba.

Para detener el servidor: `Ctrl + C` en la terminal.

## 8. Lo que viene

**Etapa 3 — Header y Footer.** Los primeros componentes propios, el primer `useState` (menú hamburguesa) y el primer array recorrido con `.map()` (los enlaces del menú).
