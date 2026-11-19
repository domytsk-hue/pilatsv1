import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ALL_LESSONS, TOTAL_LESSONS } from '../config'
import { loadProgress, register, saveLesson, session, type Progress, type Student } from './store'

type State = {
  student: Student | null
  progress: Progress
  done: number
  percent: number
  login: (phone: string, name: string) => Promise<void>
  logout: () => void
  setCompleted: (lessonId: string, completed: boolean) => Promise<void>
  setRating: (lessonId: string, rating: number) => Promise<void>
  nextPending: () => string
}

const Ctx = createContext<State | null>(null)

export function AppState({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<Student | null>(() => session.get())
  const [progress, setProgress] = useState<Progress>({})

  useEffect(() => {
    if (student) loadProgress(student.phone).then(setProgress)
    else setProgress({})
  }, [student])

  const login = useCallback(async (phone: string, name: string) => {
    setStudent(await register(phone, name))
  }, [])
  const logout = useCallback(() => { session.clear(); setStudent(null) }, [])
  const setCompleted = useCallback(async (id: string, completed: boolean) => {
    if (student) setProgress({ ...(await saveLesson(student.phone, id, { completed })) })
  }, [student])
  const setRating = useCallback(async (id: string, rating: number) => {
    if (student) setProgress({ ...(await saveLesson(student.phone, id, { rating })) })
  }, [student])

  const done = ALL_LESSONS.filter((l) => progress[l.id]?.completed).length
  const nextPending = useCallback(
    () => (ALL_LESSONS.find((l) => !progress[l.id]?.completed) ?? ALL_LESSONS[0]).id,
    [progress],
  )

  const value = useMemo(() => ({
    student, progress, done, percent: Math.round((done / TOTAL_LESSONS) * 100),
    login, logout, setCompleted, setRating, nextPending,
  }), [student, progress, done, login, logout, setCompleted, setRating, nextPending])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useApp fuera de AppState')
  return v
}
