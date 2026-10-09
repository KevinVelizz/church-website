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
