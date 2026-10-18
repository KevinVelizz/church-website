// Eventos de ejemplo. Reemplazalos por los reales.
// La fecha va siempre con el formato "AAAA-MM-DD".

export type Evento = {
  id: number
  titulo: string
  fecha: string
  hora: string
  lugar: string
  descripcion: string
  // Datos extra que se muestran con el botón "Más información"
  masInformacion: string
  imagen: string
  // Texto alternativo. Vacío si la imagen es solo decorativa.
  imagenAlt: string
}

export const eventos: Evento[] = [
  {
    id: 1,
    titulo: 'Noche de alabanza',
    fecha: '2026-10-24',
    hora: '20:00',
    lugar: 'Templo principal',
    descripcion:
      'Una noche para cantar, orar y dar gracias a Dios juntos como iglesia.',
    masInformacion:
      'Entrada libre. Al terminar compartimos un café en el salón. Si querés sumarte al equipo de música, acercate a hablar con los líderes.',
    imagen: '/images/eventos/alabanza.svg',
    imagenAlt: '',
  },
  {
    id: 2,
    titulo: 'Retiro de jóvenes',
    fecha: '2026-11-14',
    hora: '09:00',
    lugar: 'Campamento Los Pinos',
    descripcion:
      'Un fin de semana de encuentro, reflexión y amistad para jóvenes de 15 a 25 años.',
    masInformacion:
      'Salida desde la iglesia el sábado a las 9:00 y regreso el domingo a las 18:00. Cupos limitados: inscribite con los líderes de jóvenes.',
    imagen: '/images/eventos/retiro.svg',
    imagenAlt: '',
  },
  {
    id: 3,
    titulo: 'Cena de Navidad',
    fecha: '2026-12-19',
    hora: '21:00',
    lugar: 'Salón de la iglesia',
    descripcion:
      'Celebramos el nacimiento de Jesús con una cena compartida para toda la familia.',
    masInformacion:
      'Cada familia trae un plato para compartir. Va a haber actividades para los chicos.',
    imagen: '/images/eventos/navidad.svg',
    imagenAlt: '',
  },
  {
    id: 4,
    titulo: 'Jornada de servicio',
    fecha: '2026-09-26',
    hora: '10:00',
    lugar: 'Plaza del barrio',
    descripcion:
      'Pintamos los juegos de la plaza y compartimos una merienda con los vecinos.',
    masInformacion:
      'Gracias a todos los que participaron. Se repintaron los juegos y se plantaron diez árboles.',
    imagen: '/images/eventos/servicio.svg',
    imagenAlt: '',
  },
  {
    id: 5,
    titulo: 'Bautismos',
    fecha: '2026-08-30',
    hora: '11:00',
    lugar: 'Templo principal',
    descripcion:
      'Celebramos junto a seis personas que decidieron bautizarse y hacer pública su fe.',
    masInformacion:
      'Si querés bautizarte, el próximo curso de preparación empieza en marzo.',
    imagen: '/images/eventos/bautismos.svg',
    imagenAlt: '',
  },
]
