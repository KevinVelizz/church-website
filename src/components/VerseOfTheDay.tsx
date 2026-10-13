import { useState } from 'react'
import {
  obtenerReferencia,
  obtenerReferenciaDelPasaje,
  obtenerVersiculoDelDia,
} from '../utils/verseOfTheDay'
import './VerseOfTheDay.css'

function VerseOfTheDay() {
  const [contextoVisible, setContextoVisible] = useState(false)

  const versiculo = obtenerVersiculoDelDia()

  return (
    <section className="versiculo" aria-labelledby="versiculo-titulo">
      <div className="contenedor seccion">
        <h2 id="versiculo-titulo" className="versiculo-titulo">
          Versículo del día
        </h2>

        <figure className="versiculo-cita">
          <blockquote>
            <p>{versiculo.texto}</p>
          </blockquote>
          <figcaption>{obtenerReferencia(versiculo)}</figcaption>
        </figure>

        <button
          type="button"
          className="versiculo-boton"
          aria-expanded={contextoVisible}
          aria-controls="versiculo-contexto"
          onClick={() => setContextoVisible(!contextoVisible)}
        >
          {contextoVisible ? 'Ocultar contexto' : 'Leer contexto'}
        </button>

        {contextoVisible && (
          <div id="versiculo-contexto" className="versiculo-contexto">
            <h3>{obtenerReferenciaDelPasaje(versiculo)}</h3>
            <p>{versiculo.contexto}</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default VerseOfTheDay
