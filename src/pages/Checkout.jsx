import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabaseClient'
import { useCart } from '../context/CartContext'
import Header from '../components/Header'

export default function Checkout() {
  const { cart, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    businessName: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    gst: '',
  })
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)

    const order = {
      business_name: form.businessName,
      contact_person: form.contactPerson,
      phone: form.phone,
      email: form.email,
      address: form.address,
      gst: form.gst,
      items: cart,
      total,
      status: 'Pending',
    }

    const { error } = await supabase.from('orders').insert([order])

    setSubmitting(false)

    if (error) {
      console.error('FULL ERROR:', error)
      alert(error.message)
      return
    }

    clearCart()
    navigate('/order-success')
  }

  return (
    <>
      <Helmet>
        <title>Checkout | Vector Store</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Header />
      <section className="page-header">
        <h1>Checkout</h1>
      </section>

      <section className="checkout-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Pharmacy / Business Name</label>
            <input name="businessName" value={form.businessName} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Contact Person</label>
            <input name="contactPerson" value={form.contactPerson} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Delivery Address</label>
            <textarea name="address" rows="4" value={form.address} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>GST Number (Optional)</label>
            <input name="gst" value={form.gst} onChange={handleChange} />
          </div>

          <div className="order-summary">
            <h2>Order Summary</h2>
            <div id="checkoutItems">
              {cart.map((item) => (
                <div className="checkout-item" key={item.id}>
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <h3>Total: ₹{total}</h3>
          </div>

          <button type="submit" disabled={submitting || cart.length === 0}>
            {submitting ? 'Processing…' : 'Place Order'}
          </button>
        </form>
      </section>
    </>
  )
}
