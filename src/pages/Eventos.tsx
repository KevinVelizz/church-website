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
