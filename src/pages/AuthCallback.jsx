import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'
import CopyrightNotice from '../components/CopyrightNotice'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [message, setMessage] = useState('Finishing sign-in…')

  useEffect(() => {
    let active = true

    async function run() {
      try {
        if (!isSupabaseConfigured || !supabase) {
          setMessage('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
          return
        }

        const { data, error } = await supabase.auth.getSession()
        if (error) throw error

        if (!data.session) {
          setMessage('No session found. The link may have expired. Try again.')
          return
        }

        if (!active) return
        navigate('/', { replace: true })
      } catch (err) {
        setMessage(err?.message || 'Sign-in failed.')
      }
    }

    run()
    return () => {
      active = false
    }
  }, [navigate])

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1>Signing you in</h1>
      <p>{message}</p>

      <footer className="mt-10 border-t border-slate-800 pt-6">
        <CopyrightNotice className="text-xs text-slate-400" />
      </footer>
    </div>
  )
}
