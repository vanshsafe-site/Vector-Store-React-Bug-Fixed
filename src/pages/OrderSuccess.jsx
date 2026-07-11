import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export default function OrderSuccess() {
  return (
    <section className="order-success" style={{ textAlign: 'center' }}>
      <Helmet>
        <title>Order Placed | Vector Store</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <div className="order-success-icon">✓</div>
      <h1>Order Placed Successfully</h1>
      <p>Thank you for choosing Vector Store. Our team will confirm your order shortly.</p>
      <Link to="/">
        <button>Continue Shopping</button>
      </Link>
    </section>
  )
}
