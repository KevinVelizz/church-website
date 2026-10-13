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
