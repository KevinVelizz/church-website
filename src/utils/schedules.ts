import type { Horario } from '../data/schedules'

export type HorariosDelDia = {
  dia: string
  reuniones: Horario[]
}

const DIAS_DE_LA_SEMANA = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
]

// Junta las reuniones que caen el mismo día, respetando el orden original.
export function agruparPorDia(horarios: Horario[]): HorariosDelDia[] {
  const grupos: HorariosDelDia[] = []

  for (const horario of horarios) {
    const grupo = grupos.find((existente) => existente.dia === horario.dia)

    if (grupo) {
      grupo.reuniones.push(horario)
    } else {
      grupos.push({ dia: horario.dia, reuniones: [horario] })
    }
  }

  return grupos
}

// "Martes", según el calendario del visitante.
export function obtenerDiaDeHoy(fecha: Date = new Date()): string {
  return DIAS_DE_LA_SEMANA[fecha.getDay()]
}
