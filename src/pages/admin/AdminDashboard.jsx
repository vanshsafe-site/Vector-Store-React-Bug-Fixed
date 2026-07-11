import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import AdminHeader from '../../components/AdminHeader'
import NoIndex from '../../components/NoIndex'
import { Link } from 'react-router-dom'

export default function AdminDashboard() {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    setLoading(true)

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    const { data: productData, error: productError } = await supabase
      .from('products')
      .select('*')

    if (orderError) console.error(orderError)
    if (productError) console.error(productError)

    setOrders(orderData || [])
    setProducts(productData || [])
    setLoading(false)
  }

  const revenue = orders.reduce((sum, o) => sum + Number(o.total), 0)
  const pending = orders.filter((o) => o.status === 'Pending').length
  const lowStock = products.filter((p) => p.stock < 10)
  const recent = orders.slice(0, 5)

  return (
    <>
      <NoIndex title="Admin Dashboard | Vector Store" />
      <AdminHeader />

      <section className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back. Here's what's happening in your store.</p>
      </section>

      <section className="dashboard">
        <div className="stat-card">
          <h2>{loading ? '0' : orders.length}</h2>
          <p>Total Orders</p>
        </div>
        <div className="stat-card">
          <h2>{loading ? '0' : pending}</h2>
          <p>Pending Orders</p>
        </div>
        <div className="stat-card">
          <h2>{loading ? '0' : products.length}</h2>
          <p>Products</p>
        </div>
        <div className="stat-card">
          <h2>₹{loading ? '0' : revenue}</h2>
          <p>Revenue</p>
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions">
          <Link to="/admin/products"><button>Add Product</button></Link>
          <Link to="/admin/orders"><button>View Orders</button></Link>
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Recent Orders</h2>
        <div id="recentOrders">
          {recent.map((order) => (
            <div className="admin-product-card" key={order.id}>
              <h3>{order.business_name}</h3>
              <p>₹{order.total}</p>
              <p>Status: {order.status}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Low Stock Alerts</h2>
        <div id="lowStockProducts">
          {lowStock.map((product) => (
            <div className="admin-product-card" key={product.id}>
              <h3>{product.name}</h3>
              <p>Only {product.stock} units remaining</p>
            </div>
          ))}
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Store Overview</h2>
        <div className="admin-product-card">
          <p>
            Vector Store is currently managing <strong>{products.length}</strong> products and{' '}
            <strong>{orders.length}</strong> orders.
          </p>
          <br />
          <p>Use the Products section to manage inventory and the Orders section to process incoming orders.</p>
        </div>
      </section>
    </>
  )
}
