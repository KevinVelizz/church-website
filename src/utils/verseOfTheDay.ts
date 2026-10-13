import { versiculos } from '../data/verses'
import type { Versiculo } from '../data/verses'

const MILISEGUNDOS_POR_DIA = 1000 * 60 * 60 * 24

// Número de día contado desde el 1 de enero de 1970, según el calendario
// local del visitante. Mañana devuelve el número de hoy más uno.
export function obtenerNumeroDeDia(fecha: Date): number {
  const medianoche = Date.UTC(
    fecha.getFullYear(),
    fecha.getMonth(),
    fecha.getDate(),
  )

  return Math.floor(medianoche / MILISEGUNDOS_POR_DIA)
}

export function obtenerVersiculoDelDia(fecha: Date = new Date()): Versiculo {
  const indice = obtenerNumeroDeDia(fecha) % versiculos.length

  return versiculos[indice]
}

// "Salmos 23:1"
export function obtenerReferencia(versiculo: Versiculo): string {
  return `${versiculo.libro} ${versiculo.capitulo}:${versiculo.versiculo}`
}

// "Salmos 23:1-6"
export function obtenerReferenciaDelPasaje(versiculo: Versiculo): string {
  return `${versiculo.libro} ${versiculo.capitulo}:${versiculo.pasaje}`
}
