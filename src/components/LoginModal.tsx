import { useState, type FormEvent } from 'react'
import { BRAND } from '../config'
import { useApp } from '../lib/app-state'

// Celular a 10 dígitos (formato México), pero acepta cualquier número
// de 8 a 15 dígitos para alumnas de otros países.
function digits(v: string) { return v.replace(/\D/g, '') }

export function LoginModal() {
  const { login } = useApp()
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    const d = digits(phone)
    if (d.length < 8 || d.length > 15) { setError('Escribe un número de celular válido (10 dígitos).'); return }
    setBusy(true); setError('')
    try { await login(d, name.trim()) }
    catch { setError('No pudimos conectarnos. Inténtalo de nuevo en unos segundos.') }
    finally { setBusy(false) }
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="login-title">
      <form className="modal" onSubmit={submit}>
        <span className="badge">{BRAND.badge}</span>
        <h2 id="login-title">{BRAND.welcome}</h2>
        <p className="muted">{BRAND.welcomeText}</p>
        <label className="field">
          <span>TU CELULAR (10 DÍGITOS)</span>
          <input type="tel" inputMode="tel" autoComplete="tel" placeholder="55 1234 5678"
                 value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </label>
        <label className="field">
          <span>TU NOMBRE (OPCIONAL)</span>
          <input type="text" autoComplete="given-name" placeholder="¿Cómo te llamas?"
                 value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? 'Entrando…' : 'Entrar a mis clases'}
        </button>
      </form>
    </div>
  )
}
