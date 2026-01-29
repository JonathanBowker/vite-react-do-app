import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'
import './login.css'

function getRedirectTo() {
  // Must be allowed in Supabase Auth settings (URL Configuration).
  return new URL('/auth/callback', window.location.origin).toString()
}

const RESEND_COOLDOWN_MS = 60_000

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState({ state: 'idle', message: '' })
  const [busy, setBusy] = useState(false)
  const [cooldownUntil, setCooldownUntil] = useState(0)
  const [now, setNow] = useState(() => Date.now())

  const location = useLocation()
  const navigate = useNavigate()

  const nextPath = useMemo(() => {
    const from = location.state?.from?.pathname
    return typeof from === 'string' && from.startsWith('/') ? from : '/'
  }, [location.state])

  const cooldownSeconds = Math.max(0, Math.ceil((cooldownUntil - now) / 1000))
  const inCooldown = cooldownSeconds > 0

  useEffect(() => {
    if (!inCooldown) return
    const intervalId = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(intervalId)
  }, [inCooldown])

  async function sendMagicLink(event) {
    event.preventDefault()
    setStatus({ state: 'idle', message: '' })

    if (!isSupabaseConfigured || !supabase) {
      setStatus({
        state: 'error',
        message: 'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
      })
      return
    }

    if (!email.trim()) {
      setStatus({ state: 'error', message: 'Enter an email address.' })
      return
    }

    if (inCooldown) {
      setStatus({ state: 'error', message: `Please wait ${cooldownSeconds}s before trying again.` })
      return
    }

    setBusy(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: getRedirectTo(),
          shouldCreateUser: false,
        },
      })

      if (error) throw error

      setCooldownUntil(Date.now() + RESEND_COOLDOWN_MS)
      setStatus({
        state: 'sent',
        message: 'Check your email for a sign-in link.',
      })
    } catch (err) {
      const rawMessage = err?.message || 'Failed to send magic link.'
      const lower = rawMessage.toLowerCase()
      const isRateLimit = err?.status === 429 || lower.includes('rate limit') || lower.includes('too many')
      const message = isRateLimit
        ? 'Email rate limit exceeded. Wait a few minutes and try again.'
        : lower.includes('user not found')
          ? 'No account exists for that email. Ask an admin to invite you first.'
          : rawMessage

      if (isRateLimit) {
        setCooldownUntil(Date.now() + RESEND_COOLDOWN_MS)
      }

      setStatus({
        state: 'error',
        message,
      })
    } finally {
      setBusy(false)
    }
  }

  async function signOut() {
    setBusy(true)
    try {
      if (supabase) await supabase.auth.signOut()
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

          <button className="button primary" type="submit" disabled={busy || inCooldown}>
            {busy ? 'Sending…' : inCooldown ? `Try again in ${cooldownSeconds}s` : 'Send magic link'}
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
