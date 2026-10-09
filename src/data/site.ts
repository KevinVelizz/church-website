// Datos generales del sitio. Son provisorios: reemplazalos por los reales.

export type EnlaceNavegacion = {
  texto: string
  ruta: string
}

export type RedSocial = {
  nombre: string
  url: string
}

export const iglesia = {
  nombre: 'Nuestra Iglesia',
  descripcion:
    'Un lugar para conocer a Dios, crecer en comunidad y compartir la fe.',
  direccion: 'Calle Ejemplo 123, Ciudad',
  telefono: '+54 11 0000-0000',
  email: 'contacto@ejemplo.com',
}

export const enlacesNavegacion: EnlaceNavegacion[] = [
  { texto: 'Inicio', ruta: '/' },
  { texto: 'Nosotros', ruta: '/nosotros' },
  { texto: 'Eventos', ruta: '/eventos' },
  { texto: 'Publicaciones', ruta: '/publicaciones' },
  { texto: 'Oración', ruta: '/oracion' },
  { texto: 'Contacto', ruta: '/contacto' },
]

export const redesSociales: RedSocial[] = [
  { nombre: 'Instagram', url: 'https://www.instagram.com/' },
  { nombre: 'Facebook', url: 'https://www.facebook.com/' },
  { nombre: 'YouTube', url: 'https://www.youtube.com/' },
]
