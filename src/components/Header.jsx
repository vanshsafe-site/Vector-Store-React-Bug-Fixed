import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Header() {
  const location = useLocation()
  const isActive = (path) => (location.pathname === path ? 'active-link' : '')
  const { cart } = useCart()
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header>
      <div className="logo">
        <span className="desktop-logo">Vector Store</span>
        <span className="mobile-logo">VS</span>
      </div>
      <nav>
        <Link to="/" className={isActive('/')}>Products</Link>
        <Link to="/cart" className={`cart-link ${isActive('/cart')}`}>
          Cart
          {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
        </Link>
      </nav>
    </header>
  )
}
