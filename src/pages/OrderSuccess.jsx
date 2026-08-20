import { Link } from 'react-router-dom'
import NoIndex from '../components/NoIndex'

export default function OrderSuccess() {
  return (
    <section className="order-success" style={{ textAlign: 'center' }}>
      <NoIndex title="Order Placed | Udbhav Pharmaceuticals" />
      <div className="order-success-icon">✓</div>
      <h1>Order Placed Successfully</h1>
      <p>Thank you for choosing Udbhav Pharmaceuticals. Our team will confirm your order shortly.</p>
      <Link to="/">
        <button>Continue Shopping</button>
      </Link>
    </section>
  )
}
