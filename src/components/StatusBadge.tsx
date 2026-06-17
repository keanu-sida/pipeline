import type { ApplicationStatus } from '../types'
import { STATUS_COLORS, STATUS_LABELS } from '../types'

interface Props {
  status: ApplicationStatus
  size?: 'sm' | 'md'
}

export function StatusBadge({ status, size = 'sm' }: Props) {
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1'
  return (
    <span className={`inline-flex rounded-full border font-medium ${sizeClass} ${STATUS_COLORS[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}
