import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import NoIndex from '../../components/NoIndex'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setSubmitting(false)

    if (error) {
      console.error(error)
      alert('Login failed: ' + error.message)
      return
    }

    navigate('/admin/dashboard')
  }

  return (
    <>
      <NoIndex title="Admin Login | Vector Store" />
      <header>
        <div className="logo">
          <span className="desktop-logo">Vector Store Admin</span>
          <span className="mobile-logo">VS Admin</span>
        </div>
      </header>

      <section className="page-header">
        <h1>Admin Login</h1>
        <p>Login to manage products and orders</p>
      </section>

      <section className="dashboard-section">
        <form className="admin-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={submitting}>
            {submitting ? 'Processing…' : 'Login'}
          </button>
        </form>
      </section>
    </>
  )
}
