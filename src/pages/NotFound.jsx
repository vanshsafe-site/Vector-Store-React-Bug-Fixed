import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>Page Not Found | Udbhav Pharmaceuticals</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '2rem',
          gap: '1rem',
        }}
      >
        <div
          style={{
            fontSize: '5rem',
            fontWeight: '800',
            color: 'var(--primary, #0F4C81)',
            lineHeight: 1,
          }}
        >
          404
        </div>
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Page Not Found</h1>
        <p style={{ color: 'var(--text-secondary, #666)', maxWidth: '360px' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <button style={{ marginTop: '0.5rem' }}>Back to Home</button>
        </Link>
      </section>
    </>
  )
}
