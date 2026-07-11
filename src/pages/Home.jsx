import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabaseClient'
import Header from '../components/Header'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    setLoading(true)
    const { data, error } = await supabase.from('products').select('*')
    if (error) {
      console.error(error)
    } else {
      setProducts(data)
    }
    setLoading(false)
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Helmet>
        <title>Vector Store | Udbhav Pharmaceuticals — Wholesale Pharmacy Supplies</title>
        <meta
          name="description"
          content="Browse wholesale medicines and pharmacy supplies from Udbhav Pharmaceuticals. Fast, reliable and affordable B2B ordering for pharmacies and medical stores."
        />
        <link rel="canonical" href="https://www.vectorstore.example.com/" />
        {!loading && products.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              itemListElement: products.slice(0, 20).map((p, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                item: {
                  '@type': 'Product',
                  name: p.name,
                  category: p.category || undefined,
                  offers: {
                    '@type': 'Offer',
                    price: p.price,
                    priceCurrency: 'INR',
                    availability:
                      p.stock > 0
                        ? 'https://schema.org/InStock'
                        : 'https://schema.org/OutOfStock',
                  },
                },
              })),
            })}
          </script>
        )}
      </Helmet>
      <Header />
      <section className="hero">
        <h1>Udbhav Pharmaceuticals</h1>
        <p>Firm of H.C.C. | Fast, reliable and affordable medical supplies.</p>

        <div className="search-card">
          <div className="search-field">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
            <input
              id="searchInput"
              type="text"
              placeholder="Search medicines, brands, categories…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                className="search-clear"
                onClick={() => setSearch('')}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {!loading && search && (
            <p className="search-meta">
              <strong>{filtered.length}</strong>{' '}
              {filtered.length === 1 ? 'result' : 'results'} for "{search}"
            </p>
          )}
        </div>
      </section>
      <section className="products" id="productContainer">
        {loading &&
          Array.from({ length: 8 }).map((_, i) => (
            <div className="product-card skeleton-card" key={i}>
              <div className="skeleton-block skeleton-image" />
              <div className="skeleton-block skeleton-line" style={{ width: '80%' }} />
              <div className="skeleton-block skeleton-line" style={{ width: '40%' }} />
              <div className="skeleton-block skeleton-line" style={{ width: '55%' }} />
              <div className="skeleton-block skeleton-btn" />
            </div>
          ))}

        {!loading && filtered.length === 0 && (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
              <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <h3>No products found</h3>
            <p>Try a different search term or clear the search box.</p>
          </div>
        )}

        {!loading &&
          filtered.map((product) => <ProductCard key={product.id} product={product} />)}
      </section>
    </>
  )
}
