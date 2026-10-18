import { useState } from 'react'
import type { Evento } from '../data/events'
import { formatearFecha } from '../utils/events'
import './EventCard.css'

type EventCardProps = {
  evento: Evento
  pasado?: boolean
}

function EventCard({ evento, pasado = false }: EventCardProps) {
  const [infoVisible, setInfoVisible] = useState(false)

  const idInfo = `evento-${evento.id}-info`

  return (
    <article className={pasado ? 'evento evento-pasado' : 'evento'}>
      <img
        className="evento-imagen"
        src={evento.imagen}
        alt={evento.imagenAlt}
        loading="lazy"
      />

      <div className="evento-cuerpo">
        <h3 className="evento-titulo">{evento.titulo}</h3>

        <dl className="evento-datos">
          <div>
            <dt>Fecha</dt>
            <dd>
              <time dateTime={evento.fecha}>{formatearFecha(evento.fecha)}</time>
            </dd>
          </div>
          <div>
            <dt>Hora</dt>
            <dd>{evento.hora} hs</dd>
          </div>
          <div>
            <dt>Lugar</dt>
            <dd>{evento.lugar}</dd>
          </div>
        </dl>

        <p className="evento-descripcion">{evento.descripcion}</p>

        <button
          type="button"
          className="evento-boton"
          aria-expanded={infoVisible}
          aria-controls={idInfo}
          onClick={() => setInfoVisible(!infoVisible)}
        >
          {infoVisible ? 'Menos información' : 'Más información'}
        </button>

        {infoVisible && (
          <p id={idInfo} className="evento-info">
            {evento.masInformacion}
          </p>
        )}
      </div>
    </article>
  )
}

export default EventCard
