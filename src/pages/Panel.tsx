import { Link, useNavigate } from 'react-router-dom'
import { BRAND, CHECKOUT, MODULES, TOTAL_LESSONS } from '../config'
import { useApp } from '../lib/app-state'

export function Panel() {
  const { progress, done, percent, nextPending } = useApp()
  const nav = useNavigate()

  return (
    <>
      <section className="hero">
        <span className="badge light">{BRAND.instructor.toUpperCase()}</span>
        <h1>{BRAND.courseTitle}</h1>
        <p>{BRAND.tagline}</p>
      </section>

      <p className="eyebrow">MI PANEL</p>
      <div className="progress-line">
        <span className="eyebrow">TU AVANCE</span>
        <div className="bar"><div style={{ width: `${percent}%` }} /></div>
        <span className="muted small">{percent}% · {done} de {TOTAL_LESSONS} clases completadas</span>
      </div>

      <div className="cards">
        <div className="card progress-card">
          <p className="eyebrow">CLASES COMPLETADAS</p>
          <p className="big">{done} <span>de {TOTAL_LESSONS} completadas</span></p>
          <button className="btn btn-primary" onClick={() => nav(`/clase/${nextPending()}`)}>
            {done === 0 ? '¡Empezar ahora!' : done === TOTAL_LESSONS ? 'Repasar mis clases' : 'Continuar donde me quedé'}
          </button>
        </div>

        {CHECKOUT.url && (
          <div className="card pay-card">
            <p className="eyebrow gold">{CHECKOUT.label}</p>
            <p>{CHECKOUT.text}</p>
            <a className="btn btn-gold" href={CHECKOUT.url} target="_blank" rel="noopener noreferrer">{CHECKOUT.button}</a>
            <p className="muted small">{CHECKOUT.note}</p>
          </div>
        )}
      </div>

      {MODULES.map((m) => {
        const c = m.lessons.filter((l) => progress[l.id]?.completed).length
        return (
          <section key={m.id} className="module">
            <div className="module-head">
              <h2><span className="eyebrow">MÓDULO {m.number}</span>{m.title}</h2>
              <span className="muted small">{c}/{m.lessons.length}</span>
            </div>
            <div className="lesson-grid">
              {m.lessons.map((l, i) => (
                <Link key={l.id} to={`/clase/${l.id}`} className={`lesson-card ${progress[l.id]?.completed ? 'done' : ''}`}>
                  <span className="thumb">
                    <img src={`/thumbs/${l.id}.jpg`} alt="" loading="lazy" width="640" height="360" />
                    <span className="play" aria-hidden>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z" /></svg>
                    </span>
                    {progress[l.id]?.completed && <span className="check" aria-label="Completada">✓</span>}
                  </span>
                  <span className="meta">
                    <span className="label">CLASE {String(i + 1).padStart(2, '0')}</span>
                    <span className="t">{l.title}</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )
      })}
    </>
  )
}
