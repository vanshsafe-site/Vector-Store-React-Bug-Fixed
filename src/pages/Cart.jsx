import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useCart } from '../context/CartContext'
import Header from '../components/Header'

export default function Cart() {
  const { cart, increaseQty, decreaseQty, removeItem, total } = useCart()
  const navigate = useNavigate()

  return (
    <>
      <Helmet>
        <title>Your Cart | Vector Store</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Header />
      <section className="page-header">
        <h1>Your Cart</h1>
      </section>

      <section className="cart-container" id="cartContainer">
        {cart.length === 0 && (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3h2l.4 2M7 13h10l3.6-8H5.4M7 13L5.4 5M7 13l-1.6 3H18M9 21a1 1 0 100-2 1 1 0 000 2zM18 21a1 1 0 100-2 1 1 0 000 2z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h3>Your cart is empty</h3>
            <p>Browse our catalog and add products to get started.</p>
            <Link to="/"><button className="empty-state-btn">Browse Products</button></Link>
          </div>
        )}
        {cart.map((item) => (
          <div className="cart-item" key={item.id}>
            <div className="cart-info">
              <h3>{item.name}</h3>
              <p>₹{item.price}</p>
            </div>
            <div className="cart-controls">
              <button className="qty-btn" onClick={() => decreaseQty(item.id)}>-</button>
              <span>{item.quantity}</span>
              <button className="qty-btn" onClick={() => increaseQty(item.id)}>+</button>
              <button className="remove-btn" onClick={() => removeItem(item.id)}>Remove</button>
            </div>
          </div>
        ))}
      </section>

      <section className="cart-summary">
        <h2>Total: ₹{total}</h2>
        <button
          id="checkoutBtn"
          disabled={cart.length === 0}
          onClick={() => navigate('/checkout')}
        >
          Proceed To Checkout
        </button>
      </section>
    </>
  )
}
