import type { Evento } from '../data/events'

// Convierte "2026-10-24" en una fecha a las 00:00 del calendario local.
// Ojo: new Date('2026-10-24') la interpreta en hora UTC, y en Argentina
// eso cae el día anterior a las 21:00.
export function crearFechaLocal(fechaTexto: string): Date {
  const [anio, mes, dia] = fechaTexto.split('-').map(Number)

  return new Date(anio, mes - 1, dia)
}

// Hoy a las 00:00. Así un evento de hoy cuenta como próximo todo el día.
function obtenerInicioDelDia(fecha: Date): Date {
  return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate())
}

export function esProximo(evento: Evento, hoy: Date = new Date()): boolean {
  return crearFechaLocal(evento.fecha) >= obtenerInicioDelDia(hoy)
}

function compararPorFecha(a: Evento, b: Evento): number {
  return crearFechaLocal(a.fecha).getTime() - crearFechaLocal(b.fecha).getTime()
}

// Los que todavía no pasaron, del más cercano al más lejano.
export function obtenerProximosEventos(
  eventos: Evento[],
  hoy: Date = new Date(),
): Evento[] {
  return eventos
    .filter((evento) => esProximo(evento, hoy))
    .sort(compararPorFecha)
}

// Los que ya pasaron, del más reciente al más antiguo.
export function obtenerEventosAnteriores(
  eventos: Evento[],
  hoy: Date = new Date(),
): Evento[] {
  return eventos
    .filter((evento) => !esProximo(evento, hoy))
    .sort((a, b) => compararPorFecha(b, a))
}

// "sábado, 24 de octubre de 2026"
export function formatearFecha(fechaTexto: string): string {
  return crearFechaLocal(fechaTexto).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
