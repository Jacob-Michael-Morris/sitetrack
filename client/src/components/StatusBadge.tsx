import '../pages/CSS/StatusBadge.css'

interface StatusBadgeProps {
  value: string | null | undefined
}

function StatusBadge({
  value
}: StatusBadgeProps) {
  const displayValue = value || 'N/A'

  const normalizedValue =
    displayValue.toLowerCase().trim()

  let badgeType = 'default'

  if (
    [
      'available',
      'active',
      'passed',
      'good',
      'completed',
      'closed',
      'resolved',
      'current'
    ].includes(normalizedValue)
  ) {
    badgeType = 'success'
  } else if (
    [
      'warning',
      'maintenance',
      'open',
      'fair',
      'needs repair',
      'medium',
      'due today'
    ].includes(normalizedValue)
  ) {
    badgeType = 'warning'
  } else if (
    [
      'out of service',
      'damaged',
      'failed',
      'high',
      'critical',
      'overdue'
    ].includes(normalizedValue)
  ) {
    badgeType = 'danger'
  } else if (
    [
      'checked out',
      'info',
      'low'
    ].includes(normalizedValue)
  ) {
    badgeType = 'info'
  } else if (
    [
      'inactive',
      'returned',
      'transferred',
      'not scheduled',
      'no inspection'
    ].includes(normalizedValue)
  ) {
    badgeType = 'muted'
  }

  return (
    <span
      className={`status-badge status-badge-${badgeType}`}
    >
      {displayValue}
    </span>
  )
}

export default StatusBadge