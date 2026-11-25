import { useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { BRAND, MODULES } from '../config'
import { useApp } from '../lib/app-state'

export function Layout({ children }: { children: ReactNode }) {
  const { student, progress, logout } = useApp()
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  useEffect(() => { setOpen(false); window.scrollTo(0, 0) }, [loc.pathname])

  return (
    <div className="shell">
      <div className="top-stack">
      <div className="pay-banner" role="status">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
        <span>Si estás usando la plataforma sin haber realizado tu pago, realízalo para que tu acceso no sea cancelado.</span>
      </div>
      <header className="topbar">
        <button className="icon-btn menu-btn" aria-label="Abrir menú" onClick={() => setOpen(true)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        </button>
        <Link to="/" className="logo">{BRAND.instructor}</Link>
        {student?.name && <span className="hello">¡Hola, {student.name.split(' ')[0]}!</span>}
      </header>
      </div>

      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-head">
          <Link to="/" className="logo">{BRAND.instructor}</Link>
          <button className="icon-btn close-btn" aria-label="Cerrar menú" onClick={() => setOpen(false)}>✕</button>
        </div>
        <NavLink to="/" end className="side-link">Mi panel</NavLink>
        {MODULES.map((m) => (
          <div key={m.id} className="side-module">
            <p className="side-title">MÓDULO {m.number} · {m.title.toUpperCase()}</p>
            {m.lessons.map((l) => (
              <NavLink key={l.id} to={`/clase/${l.id}`} className="side-link">
                <span className={`dot ${progress[l.id]?.completed ? 'done' : ''}`} aria-hidden />
                {l.title}
              </NavLink>
            ))}
          </div>
        ))}
        <button className="side-logout" onClick={logout}>Salir / Cambiar de número</button>
      </aside>
      {open && <div className="scrim" onClick={() => setOpen(false)} />}

      <main className="content">{children}</main>
    </div>
  )
}
