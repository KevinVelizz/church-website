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
