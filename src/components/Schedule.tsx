import { horarios } from '../data/schedules'
import { agruparPorDia, obtenerDiaDeHoy } from '../utils/schedules'
import './Schedule.css'

function Schedule() {
  const dias = agruparPorDia(horarios)
  const hoy = obtenerDiaDeHoy()

  return (
    <ul className="horarios">
      {dias.map((grupo) => (
        <li
          key={grupo.dia}
          className={grupo.dia === hoy ? 'horarios-dia horarios-dia-hoy' : 'horarios-dia'}
        >
          <h3 className="horarios-nombre">
            {grupo.dia}
            {grupo.dia === hoy && <span className="horarios-hoy">Hoy</span>}
          </h3>

          <ul className="horarios-reuniones">
            {grupo.reuniones.map((reunion) => (
              <li key={reunion.id} className="horarios-reunion">
                <time dateTime={reunion.hora} className="horarios-hora">
                  {reunion.hora} hs
                </time>
                <span>{reunion.nombre}</span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}

export default Schedule
