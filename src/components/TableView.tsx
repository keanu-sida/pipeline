import type { Application } from '../types'
import { SOURCE_LABELS, daysSince, isStale } from '../types'
import { StatusBadge } from './StatusBadge'
import { TagBadge } from './TagBadge'

interface Props {
  applications: Application[]
  onEdit: (app: Application) => void
  onDelete: (id: number) => void
}

export function TableView({ applications, onEdit, onDelete }: Props) {
  const sorted = [...applications].sort((a, b) => {
    const da = a.appliedDate || a.createdAt
    const db = b.appliedDate || b.createdAt
    return db.localeCompare(da)
  })

  if (sorted.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-stone-300 bg-white py-16 text-center">
        <p className="text-stone-500">No applications yet. Add your first one to get started.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-stone-200 bg-stone-50 text-xs font-medium uppercase tracking-wide text-stone-500">
            <th className="px-4 py-3">Company</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Tags</th>
            <th className="px-4 py-3">Source</th>
            <th className="px-4 py-3">Applied</th>
            <th className="px-4 py-3">Days</th>
            <th className="px-4 py-3">Resume</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {sorted.map((app) => {
            const ref = app.lastContactDate || app.appliedDate || app.createdAt
            const days = daysSince(ref)
            const stale = isStale(app)
            return (
              <tr
                key={app.id}
                className={`hover:bg-stone-50 ${stale ? 'bg-amber-50/40' : ''}`}
              >
                <td className="px-4 py-3 font-medium text-stone-900">
                  {app.jobUrl ? (
                    <a href={app.jobUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand-700 hover:underline">
                      {app.company}
                    </a>
                  ) : (
                    app.company
                  )}
                </td>
                <td className="px-4 py-3 text-stone-600">{app.role}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={app.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {app.tags.map((t) => (
                      <TagBadge key={t} tag={t} />
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-stone-500">{SOURCE_LABELS[app.source]}</td>
                <td className="px-4 py-3 text-stone-500">{app.appliedDate || '—'}</td>
                <td className={`px-4 py-3 ${stale ? 'font-medium text-amber-600' : 'text-stone-500'}`}>
                  {days !== null ? `${days}d` : '—'}
                </td>
                <td className="px-4 py-3 text-stone-500">{app.resumeVersion || '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button
                      onClick={() => onEdit(app)}
                      className="rounded px-2 py-1 text-xs font-medium text-brand-700 hover:bg-brand-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => app.id && onDelete(app.id)}
                      className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
