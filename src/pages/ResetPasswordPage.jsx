import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'
import CopyrightNotice from '../components/CopyrightNotice'
import './login.css'

function readHashParams() {
  const raw = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash
  return new URLSearchParams(raw)
}

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [status, setStatus] = useState({ state: 'idle', message: '' })

  const hash = useMemo(() => readHashParams(), [])
  const error = hash.get('error')
  const errorCode = hash.get('error_code')
  const errorDescription = hash.get('error_description')

  const hasRecoveryTokens =
    hash.get('type') === 'recovery' && (hash.get('access_token') || hash.get('refresh_token') || hash.get('token'))

  async function setNewPassword(event) {
    event.preventDefault()
    setStatus({ state: 'idle', message: '' })

    if (!isSupabaseConfigured || !supabase) {
      setStatus({
        state: 'error',
        message: 'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
      })
      return
    }

    if (!hasRecoveryTokens) {
      setStatus({
        state: 'error',
        message: 'This reset link is missing recovery tokens. Request a new password reset email and try again.',
      })
      return
    }

    if (!password || password.length < 8) {
      setStatus({ state: 'error', message: 'Password must be at least 8 characters.' })
      return
    }

    if (password !== confirm) {
      setStatus({ state: 'error', message: 'Passwords do not match.' })
      return
    }

    setBusy(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) throw updateError

      setStatus({ state: 'ok', message: 'Password updated. You are now signed in.' })
      setTimeout(() => navigate('/', { replace: true }), 500)
    } catch (err) {
      setStatus({ state: 'error', message: err?.message || 'Failed to update password.' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page">
      <div className="flex w-full flex-col items-center">
        <div className="card auth-card">
          <h1>Reset password</h1>
          <p className="muted">Set a new password for your account.</p>

          {error ? (
            <div className="alert error">
              {errorCode ? <strong>{errorCode}: </strong> : null}
              {errorDescription ? decodeURIComponent(errorDescription) : error}
            </div>
          ) : null}

          <form onSubmit={setNewPassword} className="form">
            <label className="label">
              New password
              <input
                className="input"
                type="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={busy}
                required
              />
            </label>

            <label className="label">
              Confirm password
              <input
                className="input"
                type="password"
                autoComplete="new-password"
                placeholder="Repeat password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                disabled={busy}
                required
              />
            </label>

            <button className="button primary" type="submit" disabled={busy || !hasRecoveryTokens}>
              {busy ? 'Saving…' : 'Set new password'}
            </button>
          </form>

          {status.message ? (
            <div className={status.state === 'error' ? 'alert error' : 'alert ok'}>{status.message}</div>
          ) : null}

          <div className="footer">
            <button className="button subtle" type="button" onClick={() => navigate('/login')} disabled={busy}>
              Back to login
            </button>
            <button className="button subtle" type="button" onClick={() => navigate('/')} disabled={busy}>
              Home
            </button>
          </div>
        </div>

        <CopyrightNotice className="mt-6 text-center text-xs text-slate-400" />
      </div>
    </div>
  )
}
