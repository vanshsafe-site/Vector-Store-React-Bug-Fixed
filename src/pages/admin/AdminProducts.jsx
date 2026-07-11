import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import AdminHeader from '../../components/AdminHeader'
import NoIndex from '../../components/NoIndex'

const emptyForm = {
  id: '',
  name: '',
  description: '',
  price: '',
  stock: '',
  category: '',
  image_url: '',
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [uploadStatus, setUploadStatus] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    const { data, error } = await supabase.from('products').select('*').order('id')
    if (error) {
      console.error('Failed to load products:', error)
      return
    }
    setProducts(data)
  }

  function handleChange(e) {
    const { id, value } = e.target
    setForm({ ...form, [id]: value })
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0]
    if (!file) return

    setImageFile(file)
    setPreview(URL.createObjectURL(file))
    setUploadStatus('Uploading…')

    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, file)

    if (uploadError) {
      console.error(uploadError)
      setUploadStatus('Upload failed: ' + uploadError.message)
      return
    }

    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName)

    setForm((f) => ({ ...f, image_url: publicUrlData.publicUrl }))
    setUploadStatus('Uploaded ✓')
  }

  function resetForm() {
    setForm(emptyForm)
    setImageFile(null)
    setPreview('')
    setUploadStatus('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)

    const product = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
      category: form.category,
      image_url: form.image_url,
    }

    let error
    if (form.id) {
      ;({ error } = await supabase.from('products').update(product).eq('id', form.id))
    } else {
      ;({ error } = await supabase.from('products').insert([product]))
    }

    setSubmitting(false)

    if (error) {
      console.error(error)
      alert(error.message)
      return
    }

    resetForm()
    loadProducts()
  }

  function editProduct(product) {
    setForm({
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      category: product.category || '',
      image_url: product.image_url || '',
    })
    setPreview(product.image_url || '')
    setUploadStatus('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function deleteProduct(id) {
    if (!confirm('Delete this product?')) return

    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) {
      console.error(error)
      alert(error.message)
      return
    }
    loadProducts()
  }

  return (
    <>
      <NoIndex title="Manage Products | Vector Store" />
      <AdminHeader />

      <section className="page-header">
        <h1>Product Management</h1>
      </section>

      <section className="product-form-section">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <textarea
            id="description"
            placeholder="Description"
            rows="4"
            value={form.description}
            onChange={handleChange}
          />
          <input
            type="number"
            id="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            id="stock"
            placeholder="Stock Quantity"
            value={form.stock}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            id="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
          />

          <div className="image-upload-field">
            <label htmlFor="productImageFile">Product Image</label>
            <input type="file" id="productImageFile" accept="image/*" onChange={handleImageUpload} />
            {preview && (
              <img
                src={preview}
                style={{ display: 'block', maxWidth: '150px', marginTop: '8px', borderRadius: '8px' }}
              />
            )}
            <span style={{ display: 'block', fontSize: '0.85em', marginTop: '4px' }}>
              {uploadStatus}
            </span>
          </div>

          <button type="submit" disabled={submitting}>
            {submitting ? 'Processing…' : 'Save Product'}
          </button>
        </form>
      </section>

      <section className="products-table">
        {products.map((product) => (
          <div className="admin-product-card" key={product.id}>
            <h3>{product.name}</h3>
            <p>{product.description || ''}</p>
            <p>₹{product.price}</p>
            <p>Stock: {product.stock}</p>
            <p>{product.stock > 0 ? 'In Stock' : 'Out Of Stock'}</p>
            <div className="admin-product-actions">
              <button className="edit-btn" onClick={() => editProduct(product)}>Edit</button>
              <button className="delete-btn" onClick={() => deleteProduct(product.id)}>Delete</button>
            </div>
          </div>
        ))}
      </section>
    </>
  )
}
