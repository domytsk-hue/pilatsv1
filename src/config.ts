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
  ['01', '77d0ce31-4e71-48f3-8acc-6b154e829b27'],
  ['02', 'efe288d8-45bd-4a23-8376-80968ec0bfad'],
  ['03', '76bf557a-e7dc-4639-890e-005123ba001d'],
  ['04', 'd2024579-f69a-47d8-a47b-9febb1ec3b94'],
  ['05', 'dbfca398-122b-44f2-b3cb-7a0bc16267ff'],
  ['06', '53232dba-2462-47c2-9eeb-c510a0305ed6'],
  ['07', 'e1106c72-8bab-44d7-b295-067e813d8f7a'],
  ['08', '302c5af7-7d69-4967-aefd-90f84ebed3c8'],
  ['09', '9cf42001-2000-4fe7-89b1-baf93343d66b'],
  ['10', 'ad1d03e3-e689-4a68-baae-1da57cadfbfb'],
  ['11', 'cb2c3df6-95cc-40e9-b91e-f315b0caab42'],
  ['12', '70367bf6-d458-402e-abbe-3fd5182cb182'],
  ['13', '4db935ff-9637-4cdc-8bf4-688949044169'],
  ['14', ''],
  ['15', '8842b830-97c9-4037-8b19-d6e793032514'],
  ['16', '726e1b09-4061-4600-b84b-f75510230120'],
  ['17', 'fe2adbaa-6eb5-482b-8056-d9cf62fd17ff'],
  ['18', 'ed5537b6-571e-4540-b917-c3e0bcdf3c57'],
  ['19', '39886fb4-c21d-4f7a-be32-51d00012e741'],
  ['20', 'c8715314-8c19-4f2a-b84e-195b55386014'],
  ['21', 'c45c793d-8f91-441b-9ecc-1a8566d21935'],
  ['22', 'cf37b87f-cf5f-4abe-aa70-15a8d47d8628'],
  ['23', '3f7c951d-5305-4324-80c2-9f9fd751a81b'],
  ['24', 'caedd634-5f72-4860-bb2b-93fa7f94b5e5'],
]

const desafio: Lesson[] = DESAFIO_VIDEOS.map(([n, video]) => ({ id: `desafio-${n}`, title: `Desafío Día ${n}`, video }))

export const MODULES: Module[] = [
  { id: 'desafio', number: 1, title: 'Desafío', lessons: desafio },
  {
    id: 'estiramientos', number: 2, title: 'Estiramientos',
    lessons: [
      { id: 'estiramiento-01', title: 'Estiramiento 01', video: '0aee00f8-26b8-4bc0-a109-d118383a0ae7' },
      { id: 'estiramiento-02', title: 'Estiramiento 02', video: 'eeab5eb4-6381-4a56-9a54-8505341a225d' },
      { id: 'estiramiento-03', title: 'Estiramiento 03', video: '2da5d387-be76-4515-a321-82ddd2c68c10' },
    ],
  },
  {
    id: 'fortalecimiento', number: 3, title: 'Fortalecimiento',
    lessons: [
      { id: 'fortalecimiento-01', title: 'Fortalecimiento 01', video: '0c3d2e6d-0c4b-43b4-a8ff-488e7120248f' },
      { id: 'fortalecimiento-02', title: 'Fortalecimiento 02', video: '20aab317-b726-4543-8e87-85552024681f' },
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
