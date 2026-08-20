import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminHeader() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const isActive = (path) => (location.pathname === path ? 'active-link' : '')

  async function handleLogout() {
    await logout()
    navigate('/admin/login')
  }

  return (
    <header>
      <div className="logo">
        <span className="desktop-logo">Udbhav Pharmaceuticals Admin</span>
        <span className="mobile-logo">UP Admin</span>
      </div>
      <nav>
        <Link to="/admin/dashboard" className={isActive('/admin/dashboard')}>Dashboard</Link>
        <Link to="/admin/products" className={isActive('/admin/products')}>Products</Link>
        <Link to="/admin/orders" className={isActive('/admin/orders')}>Orders</Link>
        <a href="#" onClick={handleLogout}>Logout</a>
      </nav>
    </header>
  )
}
