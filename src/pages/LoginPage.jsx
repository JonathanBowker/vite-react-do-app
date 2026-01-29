import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import './login.css'

function getRedirectTo() {
  // Must be allowed in Supabase Auth settings (URL Configuration).
  return new URL('/auth/callback', window.location.origin).toString()
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState({ state: 'idle', message: '' })
  const [busy, setBusy] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()

  const nextPath = useMemo(() => {
    const from = location.state?.from?.pathname
    return typeof from === 'string' && from.startsWith('/') ? from : '/'
  }, [location.state])

  async function sendMagicLink(event) {
    event.preventDefault()
    setStatus({ state: 'idle', message: '' })

    if (!email.trim()) {
      setStatus({ state: 'error', message: 'Enter an email address.' })
      return
    }

    setBusy(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: getRedirectTo(),
        },
      })

      if (error) throw error

      setStatus({
        state: 'sent',
        message: 'Check your email for a sign-in link.',
      })
    } catch (err) {
      setStatus({
        state: 'error',
        message: err?.message || 'Failed to send magic link.',
      })
    } finally {
      setBusy(false)
    }
  }

  async function signOut() {
    setBusy(true)
    try {
      await supabase.auth.signOut()
      navigate('/login', { replace: true })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page">
      <div className="card auth-card">
        <h1>Sign in</h1>
        <p className="muted">We’ll email you a magic link.</p>

        <form onSubmit={sendMagicLink} className="form">
          <label className="label">
            Email
            <input
              className="input"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={busy}
              required
            />
          </label>

          <button className="button primary" type="submit" disabled={busy}>
            {busy ? 'Sending…' : 'Send magic link'}
          </button>
        </form>

        {status.message ? (
          <div className={status.state === 'error' ? 'alert error' : 'alert ok'}>{status.message}</div>
        ) : null}

        <div className="footer">
          <button className="button subtle" type="button" onClick={() => navigate(nextPath)} disabled={busy}>
            Continue without signing in
          </button>
          <button className="button subtle" type="button" onClick={signOut} disabled={busy}>
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}

