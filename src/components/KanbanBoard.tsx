import type { Application, ApplicationStatus } from '../types'
import { KANBAN_STATUSES, STATUS_LABELS, isStale } from '../types'
import { TagBadge } from './TagBadge'

interface Props {
  applications: Application[]
  onEdit: (app: Application) => void
  onStatusChange: (id: number, status: ApplicationStatus) => void
}

export function KanbanBoard({ applications, onEdit, onStatusChange }: Props) {
  const grouped = KANBAN_STATUSES.map((status) => ({
    status,
    apps: applications.filter((a) => a.status === status),
  }))

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {grouped.map(({ status, apps }) => (
        <div key={status} className="flex w-72 shrink-0 flex-col">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-stone-700">{STATUS_LABELS[status]}</h3>
            <span className="rounded-full bg-stone-200 px-2 py-0.5 text-xs font-medium text-stone-600">
              {apps.length}
            </span>
          </div>
          <div
            className="flex min-h-[200px] flex-1 flex-col gap-2 rounded-xl border border-dashed border-stone-200 bg-stone-100/50 p-2"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              const id = Number(e.dataTransfer.getData('application/id'))
              if (id) onStatusChange(id, status)
            }}
          >
            {apps.map((app) => (
              <KanbanCard key={app.id} app={app} onEdit={onEdit} />
            ))}
            {apps.length === 0 && (
              <p className="py-8 text-center text-xs text-stone-400">Drop here</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function KanbanCard({ app, onEdit }: { app: Application; onEdit: (app: Application) => void }) {
  const stale = isStale(app)

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('application/id', String(app.id))
      }}
      onClick={() => onEdit(app)}
      className={`cursor-pointer rounded-lg border bg-white p-3 shadow-sm transition-shadow hover:shadow-md ${
        stale ? 'border-amber-300' : 'border-stone-200'
      }`}
    >
      <p className="font-medium text-stone-900">{app.company}</p>
      <p className="mt-0.5 text-sm text-stone-500">{app.role}</p>
      {app.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {app.tags.map((t) => (
            <TagBadge key={t} tag={t} />
          ))}
        </div>
      )}
      {stale && (
        <p className="mt-2 text-xs font-medium text-amber-600">Needs follow-up</p>
      )}
      {app.nextAction && (
        <p className="mt-1 truncate text-xs text-stone-400">{app.nextAction}</p>
      )}
    </div>
  )
}
