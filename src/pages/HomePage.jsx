import { Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { supabase } from '../lib/supabaseClient'

export default function HomePage() {
  const { session, loading } = useAuth()

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>React + Magic Link Auth</h1>

      {loading ? (
        <p>Loading…</p>
      ) : session ? (
        <>
          <p>
            Signed in as <code>{session.user.email}</code>
          </p>
          <button onClick={signOut}>Sign out</button>
        </>
      ) : (
        <>
          <p>You’re not signed in.</p>
          <Link to="/login">Go to login</Link>
        </>
      )}

      <p style={{ marginTop: 16 }}>
        Protected page: <Link to="/protected">/protected</Link>
      </p>
    </div>
  )
}
