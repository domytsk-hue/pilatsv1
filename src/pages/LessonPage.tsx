import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { BUNNY_LIBRARY_ID, findLesson } from '../config'
import { useApp } from '../lib/app-state'
import { logView } from '../lib/store'

export function LessonPage() {
  const { id = '' } = useParams()
  const found = findLesson(id)
  const { student, progress, setCompleted, setRating } = useApp()
  const nav = useNavigate()
  const box = useRef<HTMLDivElement>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [hover, setHover] = useState(0)
  // El video de Bunny solo se carga cuando la alumna toca play (portada propia hasta entonces).
  const [playing, setPlaying] = useState<string | null>(null)

  useEffect(() => { if (student && found) logView(student.phone, found.lesson.id) }, [student, found?.lesson.id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!found) return <Navigate to="/" replace />
  const { lesson, next } = found
  const state = progress[lesson.id]
  const done = !!state?.completed
  const rating = state?.rating ?? 0
  const src = lesson.video
    ? `https://iframe.mediadelivery.net/embed/${BUNNY_LIBRARY_ID}/${lesson.video}?autoplay=true&preload=true&responsive=true`
    : ''
  const isPlaying = playing === lesson.id

  function fullscreen() {
    setPlaying(lesson.id)
    if (box.current?.requestFullscreen) box.current.requestFullscreen().catch(() => {})
  }
  function reload() {
    setPlaying(lesson.id)
    setReloadKey((k) => k + 1)
  }

  return (
    <article className="lesson">
      <div className="crumbs">
        <button className="btn btn-ghost" onClick={() => nav(-1)}>← Regresar</button>
        <span className="muted small"><Link to="/">Mi panel</Link> / Módulo {lesson.module.number}</span>
      </div>
      <h1>{lesson.title}</h1>

      <div className="player" ref={box}>
        {src && isPlaying ? (
          <iframe key={reloadKey} src={src} title={lesson.title}
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen />
        ) : (
          <button className="cover" onClick={() => src && setPlaying(lesson.id)} disabled={!src}
                  aria-label={src ? `Reproducir ${lesson.title}` : 'Video disponible muy pronto'}>
            <img src={`/thumbs/${lesson.id}.jpg`} alt="" />
            {src ? (
              <span className="play big" aria-hidden>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z" /></svg>
              </span>
            ) : (
              <span className="soon">Video disponible muy pronto</span>
            )}
          </button>
        )}
      </div>

      <div className="actions">
        <button className="btn btn-outline" onClick={fullscreen} disabled={!src}>Ver en pantalla completa</button>
        <button className="btn btn-outline" onClick={reload} disabled={!src}>Recargar video</button>
      </div>

      <div className="actions">
        <button className={`btn ${done ? 'btn-done' : 'btn-primary'}`} onClick={() => setCompleted(lesson.id, !done)}>
          {done ? '✓ ¡Clase completada!' : 'Marcar clase como completada'}
        </button>
        {next && <Link className="btn btn-outline" to={`/clase/${next.id}`}>Siguiente clase →</Link>}
      </div>

      <div className="rate">
        <p className="eyebrow">CALIFICA ESTA CLASE</p>
        <div className="stars" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} aria-label={`${n} estrellas`}
                    className={(hover || rating) >= n ? 'on' : ''}
                    onMouseEnter={() => setHover(n)} onClick={() => setRating(lesson.id, n)}>★</button>
          ))}
        </div>
        {rating > 0 && <p className="muted small">¡Gracias por calificar tu clase!</p>}
      </div>
    </article>
  )
}
