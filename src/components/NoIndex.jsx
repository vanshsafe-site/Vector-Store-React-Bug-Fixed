import { Helmet } from 'react-helmet-async'

// Keeps internal/admin routes out of search engine indexes.
export default function NoIndex({ title = 'Admin | Vector Store' }) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
  )
}
