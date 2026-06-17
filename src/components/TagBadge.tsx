import type { RoleTag } from '../types'
import { TAG_LABELS } from '../types'

export function TagBadge({ tag }: { tag: RoleTag }) {
  return (
    <span className="inline-flex rounded-md bg-stone-100 px-1.5 py-0.5 text-xs font-medium text-stone-600">
      {TAG_LABELS[tag]}
    </span>
  )
}
