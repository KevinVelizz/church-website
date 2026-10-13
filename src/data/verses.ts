// Versículos elegidos a mano: cada uno se entiende solo, sin leer lo anterior.
// Texto: Reina-Valera 1909 (dominio público). Revisalos contra la Biblia que
// usa la iglesia antes de publicar el sitio.

export type Categoria =
  | 'confianza'
  | 'paz'
  | 'fortaleza'
  | 'amor'
  | 'guia'
  | 'esperanza'

export type Versiculo = {
  id: number
  libro: string
  capitulo: number
  versiculo: string
  texto: string
  categoria: Categoria
  // Versículos del pasaje completo, para "Leer contexto" (ej: "1-6")
  pasaje: string
  // Breve explicación de qué trata el pasaje
  contexto: string
}

export const versiculos: Versiculo[] = [
  {
    id: 1,
    libro: 'Salmos',
    capitulo: 23,
    versiculo: '1',
    texto: 'Jehová es mi pastor; nada me faltará.',
    categoria: 'confianza',
    pasaje: '1-6',
    contexto:
      'David compara a Dios con un pastor que guía, alimenta y protege a sus ovejas, incluso en los momentos más oscuros.',
  },
  {
    id: 2,
    libro: 'Filipenses',
    capitulo: 4,
    versiculo: '6',
    texto:
      'Por nada estéis afanosos; sino sean notorias vuestras peticiones delante de Dios en toda oración y ruego, con hacimiento de gracias.',
    categoria: 'paz',
    pasaje: '4-9',
    contexto:
      'Pablo escribe desde la cárcel y anima a la iglesia a alegrarse, a orar en lugar de preocuparse y a recibir la paz de Dios.',
  },
  {
    id: 3,
    libro: 'Isaías',
    capitulo: 41,
    versiculo: '10',
    texto:
      'No temas, que yo soy contigo; no desmayes, que yo soy tu Dios que te esfuerzo: siempre te ayudaré, siempre te sustentaré con la diestra de mi justicia.',
    categoria: 'fortaleza',
    pasaje: '8-13',
    contexto:
      'Dios le habla a su pueblo en un tiempo de temor y le recuerda que lo eligió, que no lo abandonó y que lo sostiene de la mano.',
  },
  {
    id: 4,
    libro: 'Juan',
    capitulo: 3,
    versiculo: '16',
    texto:
      'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.',
    categoria: 'amor',
    pasaje: '14-21',
    contexto:
      'Jesús conversa de noche con Nicodemo y le explica que Dios envió a su Hijo para salvar al mundo, no para condenarlo.',
  },
  {
    id: 5,
    libro: 'Proverbios',
    capitulo: 3,
    versiculo: '5',
    texto: 'Fíate de Jehová de todo tu corazón, y no estribes en tu prudencia.',
    categoria: 'guia',
    pasaje: '1-8',
    contexto:
      'Un padre aconseja a su hijo que confíe en Dios en todas sus decisiones, y le promete que Él enderezará sus caminos.',
  },
  {
    id: 6,
    libro: 'Mateo',
    capitulo: 11,
    versiculo: '28',
    texto:
      'Venid a mí todos los que estáis trabajados y cargados, que yo os haré descansar.',
    categoria: 'paz',
    pasaje: '25-30',
    contexto:
      'Jesús invita a los cansados a acercarse a Él y a aprender de Él, que es manso y humilde de corazón.',
  },
  {
    id: 7,
    libro: 'Josué',
    capitulo: 1,
    versiculo: '9',
    texto:
      'Mira que te mando que te esfuerces y seas valiente: no temas ni desmayes, porque Jehová tu Dios será contigo en donde quiera que fueres.',
    categoria: 'fortaleza',
    pasaje: '1-9',
    contexto:
      'Después de la muerte de Moisés, Dios le encarga a Josué guiar al pueblo y le asegura que estará con él.',
  },
  {
    id: 8,
    libro: 'Salmos',
    capitulo: 46,
    versiculo: '1',
    texto:
      'Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones.',
    categoria: 'confianza',
    pasaje: '1-11',
    contexto:
      'Un canto de confianza: aunque la tierra tiemble y las naciones se agiten, Dios está en medio de su pueblo.',
  },
  {
    id: 9,
    libro: 'Romanos',
    capitulo: 8,
    versiculo: '28',
    texto:
      'Y sabemos que a los que a Dios aman, todas las cosas les ayudan a bien, es a saber, a los que conforme al propósito son llamados.',
    categoria: 'esperanza',
    pasaje: '28-39',
    contexto:
      'Pablo afirma que Dios obra en todas las circunstancias y que nada puede separarnos de su amor.',
  },
  {
    id: 10,
    libro: 'Filipenses',
    capitulo: 4,
    versiculo: '13',
    texto: 'Todo lo puedo en Cristo que me fortalece.',
    categoria: 'fortaleza',
    pasaje: '10-13',
    contexto:
      'Pablo cuenta que aprendió a estar contento tanto en la abundancia como en la necesidad, porque su fuerza viene de Cristo.',
  },
  {
    id: 11,
    libro: 'Salmos',
    capitulo: 119,
    versiculo: '105',
    texto: 'Lámpara es a mis pies tu palabra, y lumbrera a mi camino.',
    categoria: 'guia',
    pasaje: '105-112',
    contexto:
      'El salmista expresa su amor por la palabra de Dios, que lo orienta paso a paso aun en medio de la aflicción.',
  },
  {
    id: 12,
    libro: 'Jeremías',
    capitulo: 29,
    versiculo: '11',
    texto:
      'Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.',
    categoria: 'esperanza',
    pasaje: '10-14',
    contexto:
      'Dios le escribe a su pueblo, que está lejos de su tierra, y le promete que no lo olvidó y que lo va a restaurar.',
  },
  {
    id: 13,
    libro: 'Lamentaciones',
    capitulo: 3,
    versiculo: '22-23',
    texto:
      'Es por la misericordia de Jehová que no somos consumidos, porque nunca decayeron sus misericordias. Nuevas son cada mañana; grande es tu fidelidad.',
    categoria: 'esperanza',
    pasaje: '19-26',
    contexto:
      'En medio del dolor por la ciudad destruida, el autor recuerda la fidelidad de Dios y vuelve a tener esperanza.',
  },
  {
    id: 14,
    libro: 'Juan',
    capitulo: 14,
    versiculo: '27',
    texto:
      'La paz os dejo, mi paz os doy: no como el mundo la da, yo os la doy. No se turbe vuestro corazón, ni tenga miedo.',
    categoria: 'paz',
    pasaje: '25-31',
    contexto:
      'Jesús se despide de sus discípulos antes de la cruz, les promete el Espíritu Santo y les deja su paz.',
  },
]
