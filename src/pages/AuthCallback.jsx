import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [message, setMessage] = useState('Finishing sign-in…')

  useEffect(() => {
    let active = true

    async function run() {
      try {
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
    <div style={{ padding: 24 }}>
      <h1>Signing you in</h1>
      <p>{message}</p>
    </div>
  )
}

