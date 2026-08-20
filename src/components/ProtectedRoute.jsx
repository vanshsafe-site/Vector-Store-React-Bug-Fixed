import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()

  if (loading) return <p style={{ textAlign: 'center', padding: '40px' }}>Loading…</p>
  if (!session) return <Navigate to="/admin/login" replace />

  return children
}
