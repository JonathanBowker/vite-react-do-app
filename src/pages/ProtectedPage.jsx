import { useAuth } from '../auth/useAuth'

export default function ProtectedPage() {
  const { session } = useAuth()
  return (
    <div style={{ padding: 24 }}>
      <h1>Protected</h1>
      <p>
        You’re signed in as <code>{session?.user?.email}</code>
      </p>
    </div>
  )
}
