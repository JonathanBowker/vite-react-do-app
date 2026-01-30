import { useAuth } from '../auth/useAuth'
import CopyrightNotice from '../components/CopyrightNotice'

export default function ProtectedPage() {
  const { session } = useAuth()
  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1>Protected</h1>
      <p>
        You’re signed in as <code>{session?.user?.email}</code>
      </p>

      <footer className="mt-10 border-t border-slate-800 pt-6">
        <CopyrightNotice className="text-xs text-slate-400" />
      </footer>
    </div>
  )
}
