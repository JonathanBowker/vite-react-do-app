import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'
import './login.css'

function getRedirectTo() {
  // Must be allowed in Supabase Auth settings (URL Configuration).
  return new URL('/auth/callback', window.location.origin).toString()
}

const RESEND_COOLDOWN_MS = 60_000
const AUTH_METHOD = {
  magicLink: 'magic_link',
  password: 'password',
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [method, setMethod] = useState(AUTH_METHOD.password)
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

  async function signIn(event) {
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

    setBusy(true)
    try {
      if (method === AUTH_METHOD.magicLink) {
        if (inCooldown) {
          setStatus({ state: 'error', message: `Please wait ${cooldownSeconds}s before trying again.` })
          return
        }

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
        return
      }

      if (!password) {
        setStatus({ state: 'error', message: 'Enter a password.' })
        return
      }

      setStatus({
        state: 'ok',
        message: 'Signed in.',
      })
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) throw error

      navigate('/portal', { replace: true })
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

  async function forgotPassword() {
    setStatus({ state: 'idle', message: '' })

    if (!isSupabaseConfigured || !supabase) {
      setStatus({
        state: 'error',
        message: 'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
      })
      return
    }

    if (!email.trim()) {
      setStatus({ state: 'error', message: 'Enter your email first.' })
      return
    }

    setBusy(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: new URL('/auth/reset', window.location.origin).toString(),
      })
      if (error) throw error
      setStatus({ state: 'sent', message: 'If an account exists, a password reset email has been sent.' })
    } catch (err) {
      const rawMessage = err?.message || 'Failed to start password reset.'
      const lower = rawMessage.toLowerCase()
      const isRateLimit = err?.status === 429 || lower.includes('rate limit') || lower.includes('too many')
      setStatus({
        state: 'error',
        message: isRateLimit ? 'Email rate limit exceeded. Wait a few minutes and try again.' : rawMessage,
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
        <p className="muted">Use password or email magic link.</p>

        <div className="tabs">
          <button
            className={method === AUTH_METHOD.password ? 'tab active' : 'tab'}
            type="button"
            onClick={() => setMethod(AUTH_METHOD.password)}
            disabled={busy}
          >
            Password
          </button>
          <button
            className={method === AUTH_METHOD.magicLink ? 'tab active' : 'tab'}
            type="button"
            onClick={() => setMethod(AUTH_METHOD.magicLink)}
            disabled={busy}
          >
            Magic link
          </button>
        </div>

        <form onSubmit={signIn} className="form">
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

          {method === AUTH_METHOD.password ? (
            <label className="label">
              Password
              <input
                className="input"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={busy}
                required
              />
            </label>
          ) : null}

          <button className="button primary" type="submit" disabled={busy || (method === AUTH_METHOD.magicLink && inCooldown)}>
            {busy
              ? 'Working…'
              : method === AUTH_METHOD.magicLink
                ? inCooldown
                  ? `Try again in ${cooldownSeconds}s`
                  : 'Send magic link'
                : 'Sign in'}
          </button>

          {method === AUTH_METHOD.password ? (
            <div className="row">
              <button className="button subtle" type="button" onClick={forgotPassword} disabled={busy}>
                Forgot password?
              </button>
              <span className="muted" style={{ fontSize: 12 }}>
                Password reset sends an email
              </span>
            </div>
          ) : null}
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
