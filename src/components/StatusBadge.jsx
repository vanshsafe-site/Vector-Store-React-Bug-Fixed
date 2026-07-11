const statusMap = {
  pending: { cls: 'status-pending', icon: '⏳' },
  accepted: { cls: 'status-accepted', icon: '✓' },
  confirmed: { cls: 'status-accepted', icon: '✓' },
  rejected: { cls: 'status-rejected', icon: '✗' },
  cancelled: { cls: 'status-rejected', icon: '✗' },
  dispatched: { cls: 'status-accepted', icon: '🚚' },
  delivered: { cls: 'status-delivered', icon: '📦' },
}

export default function StatusBadge({ status }) {
  const key = (status || '').toLowerCase()
  const info = statusMap[key] || { cls: '', icon: '' }
  return (
    <span className={`status-badge ${info.cls}`}>
      {info.icon} {status}
    </span>
  )
}
