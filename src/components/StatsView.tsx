import type { Application } from '../types'
import { ACTIVE_STATUSES, STATUS_LABELS, TAG_LABELS, SOURCE_LABELS, isStale } from '../types'

interface Props {
  applications: Application[]
}

export function StatsView({ applications }: Props) {
  const total = applications.length
  const active = applications.filter((a) => ACTIVE_STATUSES.includes(a.status))
  const offers = applications.filter((a) => a.status === 'offer').length
  const rejected = applications.filter((a) => a.status === 'rejected').length
  const stale = applications.filter((a) => isStale(a))
  const responseRate =
    total > 0
      ? Math.round(
          (applications.filter((a) => !['wishlist', 'applied'].includes(a.status) || a.status === 'rejected').length /
            Math.max(applications.filter((a) => a.status !== 'wishlist').length, 1)) *
            100,
        )
      : 0

  const byStatus = ACTIVE_STATUSES.map((s) => ({
    status: s,
    count: applications.filter((a) => a.status === s).length,
  }))

  const byTag = Object.keys(TAG_LABELS).map((tag) => ({
    tag,
    label: TAG_LABELS[tag as keyof typeof TAG_LABELS],
    count: applications.filter((a) => a.tags.includes(tag as Application['tags'][number])).length,
  })).filter((t) => t.count > 0)

  const bySource = Object.keys(SOURCE_LABELS).map((source) => ({
    source,
    label: SOURCE_LABELS[source as keyof typeof SOURCE_LABELS],
    count: applications.filter((a) => a.source === source).length,
  })).filter((s) => s.count > 0)

  const byResume = [...new Set(applications.map((a) => a.resumeVersion).filter(Boolean))].map((version) => ({
    version,
    count: applications.filter((a) => a.resumeVersion === version).length,
    responses: applications.filter(
      (a) => a.resumeVersion === version && !['wishlist', 'applied'].includes(a.status),
    ).length,
  }))

  if (total === 0) {
    return (
      <div className="rounded-xl border border-dashed border-stone-300 bg-white py-16 text-center">
        <p className="text-stone-500">Add applications to see your pipeline stats.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Applications" value={total} />
        <StatCard label="Active Pipeline" value={active.length} />
        <StatCard label="Offers" value={offers} accent="emerald" />
        <StatCard label="Needs Follow-up" value={stale.length} accent={stale.length > 0 ? 'amber' : undefined} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="By Status">
          <BarChart
            items={byStatus.map((s) => ({
              label: STATUS_LABELS[s.status],
              count: s.count,
            }))}
          />
        </Panel>

        {byTag.length > 0 && (
          <Panel title="By Role Type">
            <BarChart items={byTag.map((t) => ({ label: t.label, count: t.count }))} />
          </Panel>
        )}

        {bySource.length > 0 && (
          <Panel title="By Source">
            <BarChart items={bySource.map((s) => ({ label: s.label, count: s.count }))} />
          </Panel>
        )}

        {byResume.length > 0 && (
          <Panel title="Resume Versions">
            <div className="space-y-3">
              {byResume.map((r) => (
                <div key={r.version} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-stone-700">{r.version}</span>
                  <span className="text-stone-500">
                    {r.count} sent · {r.responses} moved past Applied
                  </span>
                </div>
              ))}
            </div>
          </Panel>
        )}
      </div>

      <p className="text-xs text-stone-400">
        Response rate (moved past Applied or rejected): {responseRate}% · Rejected: {rejected}
      </p>
    </div>
  )
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: 'emerald' | 'amber' }) {
  const valueColor =
    accent === 'emerald' ? 'text-emerald-600' : accent === 'amber' ? 'text-amber-600' : 'text-stone-900'
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5">
      <p className="text-sm text-stone-500">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${valueColor}`}>{value}</p>
    </div>
  )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5">
      <h3 className="mb-4 font-semibold text-stone-800">{title}</h3>
      {children}
    </div>
  )
}

function BarChart({ items }: { items: { label: string; count: number }[] }) {
  const max = Math.max(...items.map((i) => i.count), 1)
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="w-28 shrink-0 truncate text-sm text-stone-600">{item.label}</span>
          <div className="flex-1">
            <div className="h-2 overflow-hidden rounded-full bg-stone-100">
              <div
                className="h-full rounded-full bg-brand-600 transition-all"
                style={{ width: `${(item.count / max) * 100}%` }}
              />
            </div>
          </div>
          <span className="w-6 text-right text-sm font-medium text-stone-700">{item.count}</span>
        </div>
      ))}
    </div>
  )
}
