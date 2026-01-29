import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'

function getRedirectTo() {
  // Must be allowed in Supabase Auth settings (URL Configuration).
  return new URL('/auth/callback', window.location.origin).toString()
}

const RESEND_COOLDOWN_MS = 60_000
const AUTH_METHOD = {
  magicLink: 'magic_link',
  password: 'password',
}

function cn(...parts) {
  return parts.filter(Boolean).join(' ')
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [method, setMethod] = useState(AUTH_METHOD.password)
  const [showPassword, setShowPassword] = useState(false)
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
    <div className="min-h-[100svh] w-screen bg-slate-100">
      <div className="grid min-h-[100svh] w-full grid-cols-1 lg:grid-cols-12">
        <div className="flex items-center justify-center bg-slate-100 px-6 py-10 text-slate-900 lg:col-span-5">
          <div className="w-full max-w-md lg:w-3/5 lg:max-w-none lg:translate-x-20">
            <div className="relative mb-7">
              <Link
                to={nextPath}
                className="inline-flex h-14 w-14 items-center justify-center text-slate-400 hover:text-slate-600 lg:absolute lg:-left-10 lg:top-1/2 lg:-translate-y-1/2"
                aria-label="Back"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-16 w-16"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </Link>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Sign in</h1>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMethod(AUTH_METHOD.password)}
                    disabled={busy}
                    className={cn(
                      'flex-1 rounded-xl border px-4 py-2 text-sm font-medium',
                      method === AUTH_METHOD.password
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-white text-slate-900 hover:bg-slate-50',
                    )}
                  >
                    Password
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod(AUTH_METHOD.magicLink)}
                    disabled={busy}
                    className={cn(
                      'flex-1 rounded-xl border px-4 py-2 text-sm font-medium',
                      method === AUTH_METHOD.magicLink
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-white text-slate-900 hover:bg-slate-50',
                    )}
                  >
                    Magic link
                  </button>
                </div>
                <p className="text-sm text-slate-500">
                  {method === AUTH_METHOD.password
                    ? 'Sign in with your email and password.'
                    : 'We’ll email you a one-time sign-in link (existing users only).'}
                </p>
              </div>

              <form onSubmit={signIn} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">
                    Email <span className="text-pink-600">*</span>
                  </label>
                  <input
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-slate-400"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={busy}
                    required
                  />
                </div>

                {method === AUTH_METHOD.password ? (
                  <div className="space-y-1.5">
                    <div className="flex items-baseline justify-between gap-4">
                      <label className="text-sm font-medium">
                        Password <span className="text-pink-600">*</span>
                      </label>
                      <button
                        className="text-sm text-slate-500 underline decoration-slate-300 underline-offset-4 hover:text-slate-700"
                        type="button"
                        onClick={forgotPassword}
                        disabled={busy}
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pr-10 text-sm outline-none placeholder:text-slate-400 focus:border-slate-400"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={busy}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        disabled={busy}
                        className="absolute inset-y-0 right-0 inline-flex items-center px-3 text-slate-400 hover:text-slate-600"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          {showPassword ? (
                            <>
                              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                              <circle cx="12" cy="12" r="3" />
                            </>
                          ) : (
                            <>
                              <path d="M10.3 5.2A9.8 9.8 0 0 1 12 5c6.5 0 10 7 10 7a17.2 17.2 0 0 1-3.2 4.3" />
                              <path d="M6.6 6.6A16 16 0 0 0 2 12s3.5 7 10 7c1.1 0 2.1-.2 3.1-.5" />
                              <path d="M14.1 14.1A3 3 0 0 1 9.9 9.9" />
                              <path d="M3 3l18 18" />
                            </>
                          )}
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : null}

                <button
                  className={cn(
                    'w-full rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-sm',
                    'bg-gradient-to-r from-fuchsia-500 to-indigo-500 hover:from-fuchsia-400 hover:to-indigo-400',
                    'disabled:cursor-not-allowed disabled:opacity-60',
                  )}
                  type="submit"
                  disabled={busy || (method === AUTH_METHOD.magicLink && inCooldown)}
                >
                  {busy
                    ? 'Working…'
                    : method === AUTH_METHOD.magicLink
                      ? inCooldown
                        ? `Try again in ${cooldownSeconds}s`
                        : 'Send magic link'
                      : 'Sign in'}
                </button>
              </form>

              {status.message ? (
                <div
                  className={cn(
                    'rounded-xl border px-3 py-2 text-sm',
                    status.state === 'error'
                      ? 'border-red-200 bg-red-50 text-red-800'
                      : 'border-emerald-200 bg-emerald-50 text-emerald-800',
                  )}
                >
                  {status.message}
                </div>
              ) : null}

              {!isSupabaseConfigured ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                  Supabase not configured. Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>.
                </div>
              ) : null}

              <div className="flex items-center gap-3 py-2">
                <div className="h-px flex-1 bg-slate-200" />
                <div className="text-xs uppercase tracking-wider text-slate-400">or</div>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  disabled
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 opacity-60"
                  title="Google sign-in not configured"
                >
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-200">
                    G
                  </span>
                  Continue with Google
                </button>

                <button
                  type="button"
                  disabled
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 opacity-60"
                  title="SSO not configured"
                >
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-200">
                    🔑
                  </span>
                  Continue with SSO
                </button>

                <button
                  type="button"
                  onClick={() => setMethod((m) => (m === AUTH_METHOD.password ? AUTH_METHOD.magicLink : AUTH_METHOD.password))}
                  disabled={busy}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                >
                  See other options
                </button>
              </div>

              <div className="pt-2 text-center text-sm text-slate-500">
                Don’t have an account? <span className="text-slate-400">Ask an admin to invite you.</span>
              </div>

              <div className="pt-2 text-center">
                <button
                  className="text-sm text-slate-500 underline decoration-slate-300 underline-offset-4 hover:text-slate-700"
                  type="button"
                  onClick={signOut}
                  disabled={busy}
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative hidden overflow-hidden lg:col-span-7 lg:block">
          <div className="absolute inset-0 bg-[#1b1446]" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#22185a] via-[#1b1446] to-[#150f3a] opacity-95" />
          <div className="absolute -bottom-28 -right-28 h-[520px] w-[520px] rounded-full bg-[#8b5cf6]/25 blur-3xl" />
          <div className="absolute -bottom-10 -right-10 h-[360px] w-[360px] rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div className="absolute -top-28 right-16 h-[420px] w-[420px] rounded-full bg-indigo-400/10 blur-3xl" />

          <div className="relative flex h-full min-h-[100svh] flex-col p-12 text-white">
            <div className="flex items-center justify-end">
              <div className="text-3xl font-semibold tracking-tight">IBOM</div>
            </div>

            <div className="flex flex-1 items-center justify-center">
              <div className="max-w-2xl text-center">
                <div className="text-6xl font-bold leading-[1.05] tracking-tight">
                  Connect apps
                  <br />
                  <span className="text-[#d66bff]">#withMake</span>
                </div>
                <p className="mx-auto mt-8 max-w-xl text-lg text-white/70">
                  From tasks and workflows to apps and systems, build and automate anything in one powerful visual
                  platform.
                </p>
                <p className="mx-auto mt-10 max-w-xl text-base text-white/60">Trusted by 500 000+ Makers | Free forever</p>
              </div>
            </div>

            <div className="text-xs text-white/30">© {new Date().getFullYear()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
