// Horarios de las reuniones. Son provisorios: reemplazalos por los reales.

export type Horario = {
  id: number
  dia: string
  hora: string
  nombre: string
}

export const horarios: Horario[] = [
  { id: 1, dia: 'Domingo', hora: '10:00', nombre: 'Reunión general' },
  { id: 2, dia: 'Domingo', hora: '18:00', nombre: 'Reunión general' },
  { id: 3, dia: 'Miércoles', hora: '20:00', nombre: 'Reunión de oración' },
  { id: 4, dia: 'Viernes', hora: '20:00', nombre: 'Jóvenes' },
]
