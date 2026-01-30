import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { supabase } from '../lib/supabaseClient'
import CopyrightNotice from '../components/CopyrightNotice'

export default function PortalPage() {
  const { session } = useAuth()
  const navigate = useNavigate()

  async function signOut() {
    await supabase?.auth.signOut()
    navigate('/login', { replace: true })
  }

  const user = session?.user

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Portal</h1>
          <div className="mt-1 text-sm text-slate-300">
            Signed in as <code>{user?.email}</code>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/" className="text-sm underline decoration-slate-500 underline-offset-4">
            Home
          </Link>
          <button
            onClick={signOut}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm hover:bg-slate-800"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <section className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
          <h2 className="text-lg font-medium">Account</h2>
          <div className="mt-3 grid gap-2 text-sm">
            <div>
              <span className="text-slate-400">User ID:</span> <code>{user?.id}</code>
            </div>
            {user?.created_at ? (
              <div>
                <span className="text-slate-400">Created:</span>{' '}
                <code>{new Date(user.created_at).toISOString()}</code>
              </div>
            ) : null}
            {user?.last_sign_in_at ? (
              <div>
                <span className="text-slate-400">Last sign-in:</span>{' '}
                <code>{new Date(user.last_sign_in_at).toISOString()}</code>
              </div>
            ) : null}
          </div>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
          <h2 className="text-lg font-medium">Quick links</h2>
          <ul className="mt-3 grid list-disc gap-2 pl-5 text-sm">
            <li>
              <Link to="/protected">Protected example</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/auth/reset">Reset password</Link>
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
          <h2 className="text-lg font-medium">Status</h2>
          <div className="mt-3 grid gap-2 text-sm">
            <div>
              <span className="text-slate-400">Session:</span> <code>active</code>
            </div>
            <div>
              <span className="text-slate-400">Access token:</span>{' '}
              <code>{session?.access_token ? 'present' : 'missing'}</code>
            </div>
          </div>
        </section>
      </div>

      <footer className="mt-10 border-t border-slate-800 pt-6">
        <CopyrightNotice className="text-xs text-slate-400" />
      </footer>
    </div>
  )
}
