import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Si las variables de Supabase no están configuradas, todo se guarda en el
// navegador (útil para probar). Con Supabase, el progreso sigue a la alumna
// en cualquier dispositivo y los teléfonos quedan registrados.
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
// Clave publishable (sb_publishable_...). VITE_SUPABASE_ANON_KEY sigue funcionando
// como respaldo para proyectos que todavía usan la clave anon antigua.
const key = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY) as string | undefined
const sb: SupabaseClient | null = url && key ? createClient(url, key) : null

export type Student = { phone: string; name: string }
export type Progress = Record<string, { completed: boolean; rating: number | null }>

const SESSION = 'pec.session'
const local = (phone: string) => `pec.progress.${phone}`

function read<T>(k: string, fallback: T): T {
  try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : fallback } catch { return fallback }
}
function write(k: string, v: unknown) {
  try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* sin almacenamiento */ }
}

export const session = {
  get: () => read<Student | null>(SESSION, null),
  set: (s: Student) => write(SESSION, s),
  clear: () => { try { localStorage.removeItem(SESSION) } catch { /* nada */ } },
}

export async function register(phone: string, name: string): Promise<Student> {
  if (sb) {
    const { error } = await sb.rpc('registrar_alumna', { p_phone: phone, p_name: name || null })
    if (error) throw error
  }
  const s = { phone, name }
  session.set(s)
  return s
}

export async function loadProgress(phone: string): Promise<Progress> {
  const cached = read<Progress>(local(phone), {})
  if (!sb) return cached
  const { data, error } = await sb.rpc('mi_progreso', { p_phone: phone })
  if (error || !data) return cached
  const p: Progress = {}
  for (const r of data as { lesson_id: string; completed: boolean; rating: number | null }[]) {
    p[r.lesson_id] = { completed: r.completed, rating: r.rating }
  }
  write(local(phone), p)
  return p
}

export async function saveLesson(phone: string, lessonId: string, patch: { completed?: boolean; rating?: number }) {
  const p = read<Progress>(local(phone), {})
  const cur = p[lessonId] ?? { completed: false, rating: null }
  p[lessonId] = { completed: patch.completed ?? cur.completed, rating: patch.rating ?? cur.rating }
  write(local(phone), p)
  if (sb) {
    await sb.rpc('guardar_clase', {
      p_phone: phone, p_lesson: lessonId,
      p_completed: patch.completed ?? null, p_rating: patch.rating ?? null,
    })
  }
  return p
}

export async function logView(phone: string, lessonId: string) {
  if (sb) await sb.rpc('registrar_vista', { p_phone: phone, p_lesson: lessonId })
}
