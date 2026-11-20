// ─────────────────────────────────────────────────────────────
//  Todo lo editable del curso está aquí: marca, checkout y clases.
//  Los videos están en Bunny Stream. Para cada clase, pega el Video ID
//  (GUID) que aparece en Bunny → Stream → tu video:
//  1a2b3c4d-1111-2222-3333-444455556666  →  video: '1a2b3c4d-1111-2222-3333-444455556666'
// ─────────────────────────────────────────────────────────────

export const BRAND = {
  instructor: 'Daniela Fuentes',
  courseTitle: 'Pilates en Casa',
  tagline: 'Tu cuerpo fuerte, tu mente en calma. Todo desde tu casa.',
  badge: 'PILATES EN CASA',
  welcome: '¡Bienvenida, hermosa!',
  welcomeText: 'Escribe tu número de celular para entrar a tus clases y guardar tu avance.',
}

export const CHECKOUT = {
  // Deja url vacío ('') para ocultar el aviso de pago.
  url: import.meta.env.VITE_CHECKOUT_URL ?? '',
  label: 'PAGO PENDIENTE',
  text: 'Completa tu pago para conservar el acceso a todas tus clases.',
  button: 'Completar mi pago',
  note: 'Paga únicamente a través del enlace oficial que aparece aquí.',
}

// Video Library ID de Bunny Stream (público; la API Key nunca va aquí).
export const BUNNY_LIBRARY_ID = '815437'

export type Lesson = { id: string; title: string; video: string }
export type Module = { id: string; number: number; title: string; lessons: Lesson[] }

// [día, Video ID de Bunny Stream]
const DESAFIO_VIDEOS: [string, string][] = [
  ['01', ''],
  ['02', 'efe288d8-45bd-4a23-8376-80968ec0bfad'],
  ['03', ''],
  ['04', ''],
  ['05', ''],
  ['06', ''],
  ['07', ''],
  ['08', ''],
  ['09', ''],
  ['10', ''],
  ['11', ''],
  ['12', ''],
  ['13', ''],
  ['14', ''],
  ['15', ''],
  ['16', ''],
  ['17', ''],
  ['18', ''],
  ['19', ''],
  ['20', ''],
  ['21', ''],
  ['22', ''],
  ['23', ''],
  ['24', ''],
]

const desafio: Lesson[] = DESAFIO_VIDEOS.map(([n, video]) => ({ id: `desafio-${n}`, title: `Desafío Día ${n}`, video }))

export const MODULES: Module[] = [
  { id: 'desafio', number: 1, title: 'Desafío', lessons: desafio },
  {
    id: 'estiramientos', number: 2, title: 'Estiramientos',
    lessons: [
      { id: 'estiramiento-01', title: 'Estiramiento 01', video: '' },
      { id: 'estiramiento-02', title: 'Estiramiento 02', video: '' },
      { id: 'estiramiento-03', title: 'Estiramiento 03', video: '' },
    ],
  },
  {
    id: 'fortalecimiento', number: 3, title: 'Fortalecimiento',
    lessons: [
      { id: 'fortalecimiento-01', title: 'Fortalecimiento 01', video: '' },
      { id: 'fortalecimiento-02', title: 'Fortalecimiento 02', video: '' },
      { id: 'fortalecimiento-03', title: 'Fortalecimiento 03', video: '87a628f3-5eae-44ce-9b10-711c58dfe1a5' },
    ],
  },
]

export const ALL_LESSONS = MODULES.flatMap((m) => m.lessons.map((l) => ({ ...l, module: m })))
export const TOTAL_LESSONS = ALL_LESSONS.length

export function findLesson(id: string) {
  const i = ALL_LESSONS.findIndex((l) => l.id === id)
  return i < 0 ? null : { lesson: ALL_LESSONS[i], next: ALL_LESSONS[i + 1] ?? null }
}
