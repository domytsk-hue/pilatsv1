// ─────────────────────────────────────────────────────────────
//  Todo lo editable del curso está aquí: marca, checkout y clases.
//  Para cada clase, pega el ID del video de YouTube (no listado):
//  https://youtu.be/AbCdEf12345  →  youtube: 'AbCdEf12345'
// ─────────────────────────────────────────────────────────────

export const BRAND = {
  instructor: 'Ximena Robles',
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

export type Lesson = { id: string; title: string; youtube: string }
export type Module = { id: string; number: number; title: string; lessons: Lesson[] }

// [día, ID del video de YouTube]
const DESAFIO_YT: [string, string][] = [
  ['01', ''],
  ['02', ''],
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

const desafio: Lesson[] = DESAFIO_YT.map(([n, youtube]) => ({ id: `desafio-${n}`, title: `Desafío Día ${n}`, youtube }))

export const MODULES: Module[] = [
  { id: 'desafio', number: 1, title: 'Desafío', lessons: desafio },
  {
    id: 'estiramientos', number: 2, title: 'Estiramientos',
    lessons: [
      { id: 'estiramiento-01', title: 'Estiramiento 01', youtube: '' },
      { id: 'estiramiento-02', title: 'Estiramiento 02', youtube: '' },
      { id: 'estiramiento-03', title: 'Estiramiento 03', youtube: '' },
    ],
  },
  {
    id: 'fortalecimiento', number: 3, title: 'Fortalecimiento',
    lessons: [
      { id: 'fortalecimiento-01', title: 'Fortalecimiento 01', youtube: '' },
      { id: 'fortalecimiento-02', title: 'Fortalecimiento 02', youtube: '' },
      { id: 'fortalecimiento-03', title: 'Fortalecimiento 03', youtube: '' },
    ],
  },
]

export const ALL_LESSONS = MODULES.flatMap((m) => m.lessons.map((l) => ({ ...l, module: m })))
export const TOTAL_LESSONS = ALL_LESSONS.length

export function findLesson(id: string) {
  const i = ALL_LESSONS.findIndex((l) => l.id === id)
  return i < 0 ? null : { lesson: ALL_LESSONS[i], next: ALL_LESSONS[i + 1] ?? null }
}
