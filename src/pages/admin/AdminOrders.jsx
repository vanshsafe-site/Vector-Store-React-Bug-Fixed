import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import AdminHeader from '../../components/AdminHeader'
import NoIndex from '../../components/NoIndex'
import StatusBadge from '../../components/StatusBadge'

const statuses = ['Pending', 'Accepted', 'Dispatched', 'Delivered']

export default function AdminOrders() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    loadOrders()
  }, [])

  async function loadOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      return
    }
    setOrders(data)
  }

  async function updateOrderStatus(orderId, newStatus) {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)

    if (error) {
      console.error(error)
      alert(error.message)
      return
    }
    loadOrders()
  }

  return (
    <>
      <NoIndex title="Manage Orders | Vector Store" />
      <AdminHeader />

      <section className="page-header">
        <h1>Order Management</h1>
        <p>View and update customer orders.</p>
      </section>

      <section className="dashboard-section">
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Business</th>
              <th>Contact</th>
              <th>Products</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              let items = order.items
              if (typeof items === 'string') {
                try {
                  items = JSON.parse(items)
                } catch {
                  items = []
                }
              }

              return (
                <tr key={order.id}>
                  <td data-label="ID">{order.id}</td>
                  <td data-label="Business">{order.business_name}</td>
                  <td data-label="Contact">
                    <strong>{order.contact_person}</strong>
                    <br />
                    📞 {order.phone || 'No phone'}
                    <br />
                    ✉️ {order.email || 'No email'}
                  </td>
                  <td data-label="Products">
                    {items && items.length
                      ? items.map((item, i) => (
                          <div key={i}>
                            {item.name} × {item.quantity}
                          </div>
                        ))
                      : 'No items'}
                  </td>
                  <td data-label="Total">₹{order.total}</td>
                  <td data-label="Status">
                    <StatusBadge status={order.status} />
                  </td>
                  <td data-label="Date">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td data-label="Action">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </>
  )
}
