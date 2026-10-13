# Etapa 5 — La página de Inicio y el Hero

El Inicio deja de ser un título suelto y pasa a tener su sección principal (el *Hero*), una bienvenida y el lugar reservado para los horarios.

Conceptos nuevos de esta etapa:

- **Props**: pasarle datos a un componente.
- Destructuring de props y cómo se les pone tipo.
- `children`: pasarle contenido adentro a un componente propio.
- Estilos en línea con `style`.
- Imágenes desde `public/images/`.
- Enlaces a una sección de la misma página (anclas).
- Clases CSS reutilizables y tamaños fluidos con `clamp()`.

Qué cambió:

```
public/images/hero.svg        Imagen de fondo provisoria
src/
  index.css                   Clases reutilizables: contenedor, seccion, boton
  App.css                     El <main> ya no limita el ancho
  components/
    Hero.tsx  + Hero.css      Componente nuevo
  pages/
    Home.tsx  + Home.css      La página de Inicio
    (las demás páginas)       Ahora usan la clase "contenedor"
```

---

## 1. Un cambio de estructura: quién controla el ancho

Hasta la etapa anterior, el `<main>` de `App.tsx` tenía un ancho máximo y márgenes. Todas las páginas quedaban centradas dentro de esa caja.

El Hero necesita otra cosa: su imagen de fondo tiene que ir **de borde a borde** de la pantalla. Si el `<main>` limita el ancho, es imposible.

Solución: el `<main>` deja de limitar, y cada sección decide si quiere ocupar todo el ancho o centrarse.

`src/App.css` quedó así:

```css
.app-principal {
  flex: 1;
}
```

Y en `src/index.css` hay una clase nueva que hace el trabajo de centrar:

```css
.contenedor {
  width: 100%;
  max-width: var(--ancho-maximo);
  margin: 0 auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}
```

Cualquier elemento con `className="contenedor"` queda centrado, con un ancho máximo de 1100px y un margen lateral para que el texto no toque los bordes en el celular.

Por eso las otras páginas cambiaron una línea. Antes devolvían un Fragment; ahora:

```tsx
function Nosotros() {
  return (
    <div className="contenedor pagina">
      <h1>Nosotros</h1>
      <p>Acá vamos a contar quiénes somos.</p>
    </div>
  )
}
```

En la etapa anterior dije que el Fragment evitaba un `div` innecesario. Sigue siendo cierto: la diferencia es que este `div` **sí tiene una función** (centrar el contenido). La regla no es "nunca uses div", es "no agregues elementos que no hacen nada".

### Clases reutilizables

En `index.css` también se agregaron `.pagina`, `.seccion` y los botones. Son estilos que se van a repetir en todo el sitio, así que viven en el CSS global en vez de copiarse en cada componente:

```css
.seccion {
  padding-top: 3.5rem;
  padding-bottom: 3.5rem;
}

.boton {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  font-weight: bold;
  text-decoration: none;
  border: 2px solid transparent;
  border-radius: var(--radio);
}

.boton-primario {
  background: var(--color-acento);
  color: #1c1608;
}

.boton-secundario {
  border-color: #ffffff;
  color: #ffffff;
}
```

Un elemento puede tener varias clases separadas por espacio: `className="boton boton-primario"` toma la forma de `.boton` y los colores de `.boton-primario`. Así se combinan piezas en vez de reescribir todo.

Criterio para decidir dónde va un estilo: si es de **un** componente, en su `.css`. Si se usa en **muchos** lugares, en `index.css`.

---

## 2. `src/components/Hero.tsx`

```tsx
import type { ReactNode } from 'react'
import './Hero.css'

type HeroProps = {
  titulo: string
  frase: string
  descripcion: string
  imagen: string
  children?: ReactNode
}

function Hero({ titulo, frase, descripcion, imagen, children }: HeroProps) {
  return (
    <section className="hero" style={{ backgroundImage: `url(${imagen})` }}>
      <div className="hero-contenido contenedor">
        <p className="hero-nombre">{titulo}</p>
        <h1 className="hero-frase">{frase}</h1>
        <p className="hero-descripcion">{descripcion}</p>
        <div className="hero-acciones">{children}</div>
      </div>
    </section>
  )
}

export default Hero
```

### 2.1 Props: datos que entran al componente

El Header y el Footer no recibían nada: buscaban sus datos solos, importándolos. El Hero es distinto. No sabe qué texto va a mostrar: **se lo dicen desde afuera**.

Esos datos que se le pasan a un componente se llaman **props** (de *properties*). Se escriben igual que los atributos de HTML:

```tsx
<Hero
  titulo="Nuestra Iglesia"
  frase="Un lugar para encontrarte con Dios"
  descripcion="..."
  imagen="/images/hero.svg"
/>
```

Pensalo como una función con parámetros, porque es exactamente eso. React junta todos los atributos en un objeto y se lo pasa a la función:

```js
Hero({
  titulo: 'Nuestra Iglesia',
  frase: 'Un lugar para encontrarte con Dios',
  descripcion: '...',
  imagen: '/images/hero.svg',
})
```

**¿Para qué sirve?** Para reutilizar. El mismo Hero puede usarse en "Nosotros" con otro título y otra imagen, sin tocar el componente. Un componente sin props muestra siempre lo mismo; con props es una plantilla.

### 2.2 El tipo de las props

```tsx
type HeroProps = {
  titulo: string
  frase: string
  descripcion: string
  imagen: string
  children?: ReactNode
}
```

Es un `type` como los de la Etapa 3, pero describe qué props acepta el componente. La costumbre es llamarlo `NombreDelComponenteProps`.

Con esto TypeScript te avisa si te olvidás una prop obligatoria, si escribís mal el nombre o si pasás un número donde va un texto. Probalo: borrá `frase="..."` en `Home.tsx` y mirá el error.

El signo `?` en `children?` significa **opcional**: se puede usar el Hero sin pasarle nada adentro.

### 2.3 Destructuring de props

```tsx
function Hero({ titulo, frase, descripcion, imagen, children }: HeroProps) {
```

Sin destructuring sería:

```tsx
function Hero(props: HeroProps) {
  return <h1>{props.frase}</h1>
}
```

Funciona igual, pero hay que escribir `props.` todo el tiempo. Las llaves en el parámetro sacan cada propiedad del objeto y la convierten en una variable. Es el mismo destructuring de `useState`, pero con llaves porque acá es un objeto y allá era un array.

`: HeroProps` indica de qué tipo es ese objeto.

### 2.4 Las props son de solo lectura

Un componente **no debe modificar sus props**. Las recibe y las muestra. Si algo tiene que cambiar con el tiempo, es estado (`useState`), y vive en el componente que es dueño de ese dato.

Los datos en React bajan en una sola dirección: del componente padre (`Home`) al hijo (`Hero`).

### 2.5 `children`: lo que va adentro

En la etapa anterior vimos que `<BrowserRouter>` recibía contenido adentro. Ahora hacemos lo mismo con un componente nuestro.

`children` es una prop especial: React la completa automáticamente con lo que escribas **entre la apertura y el cierre** del componente.

```tsx
<Hero titulo="..." frase="..." descripcion="..." imagen="...">
  <Link to="/nosotros" className="boton boton-primario">
    Conocé nuestra iglesia
  </Link>
  <a href="#horarios" className="boton boton-secundario">
    Ver horarios
  </a>
</Hero>
```

Los dos botones llegan al Hero como `children`, y el Hero decide dónde ponerlos:

```tsx
<div className="hero-acciones">{children}</div>
```

**¿Por qué no pasar los botones como props de texto?** Porque el Hero no tiene por qué saber cuántos botones hay ni a dónde llevan. Hoy son dos; en otra página puede ser uno, o ninguno. Con `children`, el Hero se ocupa del aspecto y quien lo usa decide el contenido.

`ReactNode` es el tipo que significa "cualquier cosa que React puede dibujar": texto, elementos, varios elementos, o nada. Se importa con `import type` porque solo existe para TypeScript y no genera código.

Regla práctica:

- Datos simples (un texto, un número, una dirección de imagen): **props comunes**.
- Un bloque de contenido que puede variar: **`children`**.

### 2.6 `style`: estilos en línea

```tsx
<section className="hero" style={{ backgroundImage: `url(${imagen})` }}>
```

Hay dos pares de llaves, y cada uno significa algo distinto:

- Las de afuera: "esto es JavaScript" (como siempre en JSX).
- Las de adentro: un objeto de JavaScript.

En React, `style` no recibe un texto como en HTML, recibe **un objeto**. Las propiedades se escriben en *camelCase*: `background-image` pasa a ser `backgroundImage`.

`` `url(${imagen})` `` es un template literal (los vimos en el Footer): arma el texto `url(/images/hero.svg)`.

**¿Por qué acá sí usamos `style` y no el archivo CSS?** Porque la imagen es un **dato que viene por props**: cambia según quién use el Hero, y el CSS no puede leer props. Todo lo demás (tamaño, posición, colores) es fijo y está en `Hero.css`.

Regla: lo fijo va en el CSS; solo lo que depende de un dato va en `style`.

### 2.7 Semántica y accesibilidad

- El Hero es un `<section>`: un bloque temático de la página.
- La frase principal es el `<h1>`. Cada página debe tener **un solo `h1`**, que es su título principal. El nombre de la iglesia va en un `<p>` arriba porque visualmente es una etiqueta chica, no el título.
- La imagen de fondo es **decorativa**: no aporta información. Por eso va como fondo en CSS y no como `<img>`. Si fuera una foto que comunica algo (los pastores, un evento), iría en un `<img>` con su texto alternativo `alt`.

---

## 3. `src/components/Hero.css`

```css
.hero {
  position: relative;
  min-height: 70vh;
  display: flex;
  align-items: center;
  background-color: var(--color-primario);
  background-size: cover;
  background-position: center;
  color: #ffffff;
}
```

- `min-height: 70vh`: al menos el 70% del alto de la ventana. Es `min-` y no `height` para que, si el texto ocupa más (en un celular chico), la sección crezca en vez de cortarlo.
- `display: flex` con `align-items: center`: centra el contenido verticalmente.
- `background-size: cover`: la imagen cubre toda la sección sin deformarse, recortando lo que sobre. Es lo que hace responsive a una imagen de fondo.
- `background-position: center`: si hay que recortar, se conserva el centro.
- `background-color`: color de respaldo. Si la imagen tarda o falla, el texto blanco igual se lee.

### La capa oscura

```css
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(13, 26, 48, 0.55);
}

.hero-contenido {
  position: relative;
}
```

Texto blanco sobre una foto es un problema clásico: si la foto tiene zonas claras, no se lee. La solución es poner una capa oscura semitransparente entre la imagen y el texto.

- `::before` es un **pseudo-elemento**: un elemento que crea el CSS, sin tocar el HTML.
- `position: absolute` con `inset: 0` lo estira para cubrir todo el Hero. Funciona porque `.hero` tiene `position: relative`, que lo convierte en el punto de referencia.
- `rgba(..., 0.55)` es un color con 55% de opacidad.
- `.hero-contenido` lleva `position: relative` para quedar **por encima** de la capa.

Esto es accesibilidad: garantiza el contraste sin importar qué foto se use después.

### Tamaño de letra fluido

```css
.hero-frase {
  max-width: 20ch;
  font-size: clamp(2rem, 6vw, 3.5rem);
}
```

`clamp(mínimo, ideal, máximo)` elige un valor entre dos límites:

- Nunca menos de `2rem`.
- Idealmente `6vw` (6% del ancho de la ventana), así que crece con la pantalla.
- Nunca más de `3.5rem`.

El título se adapta solo a cualquier pantalla, sin escribir una media query por tamaño.

`ch` es el ancho de un carácter. `max-width: 20ch` limita el título a unas 20 letras por línea, para que corte prolijo. En la descripción, `55ch` evita líneas demasiado largas, que cansan al leer.

### Los botones

```css
.hero-acciones {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

@media (min-width: 600px) {
  .hero-acciones {
    flex-direction: row;
    justify-content: center;
  }
}
```

Mobile first otra vez: en celular, uno debajo del otro (cómodos para el pulgar); desde 600px, lado a lado.

---

## 4. `src/pages/Home.tsx`

```tsx
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import { iglesia } from '../data/site'
import './Home.css'

const pilares = [
  {
    titulo: 'Conocer a Dios',
    texto: 'Nos reunimos para adorar, orar y aprender de la Biblia.',
  },
  {
    titulo: 'Crecer en comunidad',
    texto: 'Caminamos juntos, acompañándonos en cada etapa de la vida.',
  },
  {
    titulo: 'Compartir la fe',
    texto: 'Servimos a nuestra ciudad con hechos y con palabras.',
  },
]

function Home() {
  return (
    <>
      <Hero
        titulo={iglesia.nombre}
        frase="Un lugar para encontrarte con Dios"
        descripcion={iglesia.descripcion}
        imagen="/images/hero.svg"
      >
        <Link to="/nosotros" className="boton boton-primario">
          Conocé nuestra iglesia
        </Link>
        <a href="#horarios" className="boton boton-secundario">
          Ver horarios
        </a>
      </Hero>

      <section className="contenedor seccion">
        <h2 className="home-titulo">Bienvenidos</h2>
        <p className="home-intro">
          Seas quien seas y vengas de donde vengas, acá tenés un lugar. Te
          invitamos a conocernos y a ser parte.
        </p>

        <ul className="home-pilares">
          {pilares.map((pilar) => (
            <li key={pilar.titulo} className="home-pilar">
              <h3>{pilar.titulo}</h3>
              <p>{pilar.texto}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="horarios" className="contenedor seccion home-horarios">
        <h2 className="home-titulo">Horarios de reuniones</h2>
        <p className="home-intro">Esta sección se completa en la Etapa 7.</p>
      </section>
    </>
  )
}

export default Home
```

### 4.1 Dos formas de pasar una prop

```tsx
titulo={iglesia.nombre}
frase="Un lugar para encontrarte con Dios"
```

- Con **comillas**: un texto fijo.
- Con **llaves**: cualquier valor de JavaScript (una variable, un número, un cálculo).

### 4.2 El Fragment vuelve

Home devuelve tres secciones hermanas. Acá sí corresponde el Fragment: el Hero tiene que ir de borde a borde, así que **no** podemos envolver todo en un `contenedor`. Cada sección decide por su cuenta: el Hero ocupa todo el ancho y las otras dos usan `contenedor`.

### 4.3 `Link` y `<a>` en el mismo lugar

Los dos botones parecen iguales pero son distintos, y es un buen repaso de la regla de la Etapa 4:

- **"Conocé nuestra iglesia"** lleva a otra página del sitio: `<Link to="/nosotros">`.
- **"Ver horarios"** lleva a otra parte **de la misma página**: `<a href="#horarios">`.

Un `href` que empieza con `#` es un **ancla**: le dice al navegador "desplazate hasta el elemento que tiene ese `id`". Coincide con `<section id="horarios">`. No hay recarga ni cambio de página, así que alcanza con un `<a>` común.

Dos detalles de CSS acompañan esto:

```css
/* index.css */
html {
  scroll-behavior: smooth;
}

/* Home.css */
.home-horarios {
  scroll-margin-top: 4rem;
}
```

- `scroll-behavior: smooth` hace que el desplazamiento sea animado en vez de un salto.
- `scroll-margin-top` deja un espacio arriba al llegar. Sin esto, el Header fijo taparía el título de la sección.

Los horarios van en el Inicio (y no en una página aparte), como quedó decidido en la etapa anterior. La sección está vacía a propósito: la completamos en la Etapa 7.

### 4.4 Los tres pilares

Es el patrón de siempre: array de objetos + `.map()` + `key`. El array `pilares` está **en el mismo archivo**, arriba del componente, y no en `data/`.

¿Por qué? Porque solo lo usa esta página y es texto de presentación, no contenido que un administrador vaya a cargar. Criterio: a `data/` va lo que se comparte entre componentes o lo que algún día vendrá de una base de datos (eventos, publicaciones, horarios). Lo que es propio de una sola página puede quedarse en ella.

Está **fuera** de la función `Home` porque no cambia nunca: no hace falta volver a crearlo cada vez que el componente se dibuja.

No lleva `type` escrito: TypeScript lo deduce solo.

Los textos son provisorios; cambialos por los de la iglesia.

### 4.5 `Home.css`: la grilla

```css
.home-pilares {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .home-pilares {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

Una columna en celular, tres desde tablet. Es el mismo Grid del Footer.

---

## 5. La imagen: `public/images/hero.svg`

**De dónde sale:** la dibujé yo para este proyecto. Es un archivo SVG (un dibujo hecho con código): un degradado de cielo al atardecer con unas colinas. No es una foto bajada de internet, así que no tiene ningún problema de derechos. Es **provisoria**.

### Cómo funciona `public/`

Todo lo que está en `public/` se sirve tal cual desde la raíz del sitio:

| Archivo en el proyecto | Dirección en el navegador |
| --- | --- |
| `public/images/hero.svg` | `/images/hero.svg` |
| `public/favicon.svg` | `/favicon.svg` |

Fijate que **`public` no aparece en la dirección**. Por eso en el código se escribe:

```tsx
imagen="/images/hero.svg"
```

La barra inicial es importante: significa "desde la raíz del sitio". Sin ella, la dirección se calcularía relativa a la página actual y fallaría en rutas como `/publicaciones/1`.

### Cómo poner la foto real

1. Guardá la foto en `public/images/`, por ejemplo `hero.jpg`.
2. En `Home.tsx`, cambiá `imagen="/images/hero.svg"` por `imagen="/images/hero.jpg"`.

Recomendaciones para esa foto:

- **Formato horizontal**, de unos 1600 a 2000 píxeles de ancho.
- **Peso menor a 300 KB.** Una foto de celular sin comprimir pesa varios MB y hace lenta la página. Se puede reducir con herramientas gratuitas como Squoosh.
- Formato **JPG** o **WebP** para fotos. SVG es para dibujos e íconos.
- Que sea **propia** o con permiso. Si aparecen personas, con su consentimiento. Si alguna vez usás un banco de imágenes gratuito (Unsplash, Pexels), revisá la licencia.
- Que lo importante no esté justo en el centro, porque ahí va el texto.

---

## 6. Cómo probarlo

```bash
npm run dev
```

En `http://localhost:5173` tenés que ver:

- El Hero ocupando casi toda la pantalla, con el fondo de atardecer de borde a borde.
- Arriba, en dorado y mayúsculas, "NUESTRA IGLESIA". Debajo, la frase grande en blanco, la descripción y dos botones: uno dorado y uno con borde blanco.
- Más abajo, "Bienvenidos" con tres tarjetas.
- Al final, "Horarios de reuniones" con el aviso de que se completa después.

**Probá:**

1. **"Conocé nuestra iglesia"** te lleva a `/nosotros` sin recargar.
2. **"Ver horarios"** baja suavemente hasta la sección. La dirección pasa a terminar en `#horarios`.
3. **Achicá la ventana** despacio: el título se achica de forma continua (`clamp`), los botones pasan a estar uno debajo del otro y las tres tarjetas se apilan.

**Experimentos para entender**

1. **Props.** En `Home.tsx`, cambiá el texto de `frase`. El Hero muestra el nuevo sin tocar `Hero.tsx`.
2. **Reutilización.** En `Nosotros.tsx`, importá el Hero y usalo con otros textos: `<Hero titulo="Nosotros" frase="Nuestra historia" descripcion="..." imagen="/images/hero.svg" />`. Mismo componente, otro contenido. Después sacalo.
3. **`children`.** Borrá uno de los dos botones de adentro del `<Hero>`. Queda uno solo, centrado, sin tocar el componente.
4. **TypeScript.** Borrá la prop `descripcion`. El editor marca el error antes de que abras el navegador.
5. **La capa oscura.** En `Hero.css`, cambiá `0.55` por `0` en `.hero::before`. El texto se lee peor sobre la parte clara. Volvé a dejarlo.

## 7. Lo que viene

**Etapa 6 — Versículo del día.** Creamos `data/verses.ts` con versículos elegidos a mano y el componente `VerseOfTheDay`. Vemos `Date`, cómo calcular el día del año, cómo usar el resto de una división para recorrer el array en ciclo, y por qué esto **no** necesita `useEffect`. También comparo el array local con una API de Biblia.
