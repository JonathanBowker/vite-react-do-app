import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { supabase } from '../lib/supabaseClient'

export default function PortalPage() {
  const { session } = useAuth()
  const navigate = useNavigate()

  async function signOut() {
    await supabase?.auth.signOut()
    navigate('/login', { replace: true })
  }

  const user = session?.user

  return (
    <div style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ marginBottom: 6 }}>Portal</h1>
          <div style={{ opacity: 0.8 }}>
            Signed in as <code>{user?.email}</code>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'underline' }}>
            Home
          </Link>
          <button onClick={signOut}>Sign out</button>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 16,
          marginTop: 20,
        }}
      >
        <section style={{ border: '1px solid rgba(255,255,255,0.18)', borderRadius: 12, padding: 16 }}>
          <h2 style={{ marginTop: 0 }}>Account</h2>
          <div style={{ display: 'grid', gap: 6 }}>
            <div>
              <span style={{ opacity: 0.75 }}>User ID:</span> <code>{user?.id}</code>
            </div>
            {user?.created_at ? (
              <div>
                <span style={{ opacity: 0.75 }}>Created:</span>{' '}
                <code>{new Date(user.created_at).toISOString()}</code>
              </div>
            ) : null}
            {user?.last_sign_in_at ? (
              <div>
                <span style={{ opacity: 0.75 }}>Last sign-in:</span>{' '}
                <code>{new Date(user.last_sign_in_at).toISOString()}</code>
              </div>
            ) : null}
          </div>
        </section>

        <section style={{ border: '1px solid rgba(255,255,255,0.18)', borderRadius: 12, padding: 16 }}>
          <h2 style={{ marginTop: 0 }}>Quick links</h2>
          <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 8 }}>
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

        <section style={{ border: '1px solid rgba(255,255,255,0.18)', borderRadius: 12, padding: 16 }}>
          <h2 style={{ marginTop: 0 }}>Status</h2>
          <div style={{ display: 'grid', gap: 8 }}>
            <div>
              <span style={{ opacity: 0.75 }}>Session:</span> <code>active</code>
            </div>
            <div>
              <span style={{ opacity: 0.75 }}>Access token:</span> <code>{session?.access_token ? 'present' : 'missing'}</code>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

