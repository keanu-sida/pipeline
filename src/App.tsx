import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, addApplication, updateApplication, deleteApplication } from './db'
import type { Application, ApplicationInput, ApplicationStatus } from './types'
import { ApplicationForm } from './components/ApplicationForm'
import { KanbanBoard } from './components/KanbanBoard'
import { TableView } from './components/TableView'
import { StatsView } from './components/StatsView'
import { DataSettings } from './components/DataSettings'
import { Modal } from './components/Modal'
import { isStale } from './types'

type View = 'kanban' | 'table' | 'stats' | 'settings'

export default function App() {
  const applications = useLiveQuery(() => db.applications.toArray(), []) ?? []
  const [view, setView] = useState<View>('kanban')
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [editing, setEditing] = useState<Application | null>(null)
  const [, setRefresh] = useState(0)

  const staleCount = applications.filter((a) => isStale(a)).length

  const handleAdd = async (data: ApplicationInput) => {
    const today = new Date().toISOString().slice(0, 10)
    await addApplication({ ...data, createdAt: today, updatedAt: today })
    setModal(null)
  }

  const handleEdit = async (data: ApplicationInput) => {
    if (!editing?.id) return
    await updateApplication(editing.id, data)
    setModal(null)
    setEditing(null)
  }

  const handleStatusChange = async (id: number, status: ApplicationStatus) => {
    await updateApplication(id, { status })
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this application?')) return
    await deleteApplication(id)
  }

  const openEdit = (app: Application) => {
    setEditing(app)
    setModal('edit')
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-700">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10M4 18h6" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-stone-900">Pipeline</h1>
              <p className="text-xs text-stone-500">Private job application tracker</p>
            </div>
          </div>
          <button
            onClick={() => { setEditing(null); setModal('add') }}
            className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800"
          >
            + Add Application
          </button>
        </div>
      </header>

      <nav className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl gap-1 px-4 sm:px-6">
          {([
            ['kanban', 'Board'],
            ['table', 'Table'],
            ['stats', 'Stats'],
            ['settings', 'Data & Privacy'],
          ] as const).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={`relative px-4 py-3 text-sm font-medium transition-colors ${
                view === id
                  ? 'text-brand-700'
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              {label}
              {id === 'table' && staleCount > 0 && (
                <span className="ml-1.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-700">
                  {staleCount}
                </span>
              )}
              {view === id && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-brand-600" />
              )}
            </button>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {view === 'kanban' && (
          <KanbanBoard
            applications={applications}
            onEdit={openEdit}
            onStatusChange={handleStatusChange}
          />
        )}
        {view === 'table' && (
          <TableView
            applications={applications}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}
        {view === 'stats' && <StatsView applications={applications} />}
        {view === 'settings' && (
          <DataSettings onImportComplete={() => setRefresh((n) => n + 1)} />
        )}
      </main>

      {modal && (
        <Modal
          title={modal === 'add' ? 'Add Application' : 'Edit Application'}
          onClose={() => { setModal(null); setEditing(null) }}
          wide
        >
          <ApplicationForm
            initial={editing ?? undefined}
            onSave={modal === 'add' ? handleAdd : handleEdit}
            onCancel={() => { setModal(null); setEditing(null) }}
          />
        </Modal>
      )}
    </div>
  )
}
