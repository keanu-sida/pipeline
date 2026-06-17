import { useRef } from 'react'
import { exportAll, importAll, clearAll } from '../db'
import type { Application } from '../types'

interface Props {
  onImportComplete: () => void
}

export function DataSettings({ onImportComplete }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  const handleExport = async () => {
    const data = await exportAll()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pipeline-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      const data = JSON.parse(text) as Application[]
      if (!Array.isArray(data)) throw new Error('Invalid format')
      const confirmed = window.confirm(
        `Import ${data.length} application(s)? This will replace all current data.`,
      )
      if (!confirmed) return
      await importAll(data)
      onImportComplete()
    } catch {
      alert('Could not import file. Make sure it is a valid Pipeline export.')
    }
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleClear = async () => {
    const confirmed = window.confirm(
      'Delete all applications? This cannot be undone. Export a backup first if you need one.',
    )
    if (!confirmed) return
    await clearAll()
    onImportComplete()
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-lg bg-emerald-100 p-2">
            <svg className="h-5 w-5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-emerald-900">Zero ongoing cost</h3>
            <p className="mt-1 text-sm text-emerald-800/80">
              No database, no auth service, no API keys. Data lives in your browser for free.
              Run locally with <code className="rounded bg-emerald-100 px-1">npm run dev</code> and
              you never pay anything. On your Netlify portfolio it lives at <code className="rounded bg-emerald-100 px-1">/pipeline/</code> and
              only loads when someone visits that page.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-brand-200 bg-brand-50 p-5">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-lg bg-brand-100 p-2">
            <svg className="h-5 w-5 text-brand-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-brand-900">Your data stays private</h3>
            <p className="mt-1 text-sm text-brand-800/80">
              All applications are stored locally in your browser using IndexedDB.
              Nothing is sent to a server. Clearing your browser data will delete your
              applications — use Export to keep a backup.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-5">
        <h3 className="font-semibold text-stone-800">Backup & Restore</h3>
        <p className="mt-1 text-sm text-stone-500">
          Export your data as JSON to back up or move between browsers.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={handleExport}
            className="rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
          >
            Export JSON
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
          >
            Import JSON
          </button>
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
        </div>
      </div>

      <div className="rounded-xl border border-red-200 bg-red-50 p-5">
        <h3 className="font-semibold text-red-900">Danger Zone</h3>
        <p className="mt-1 text-sm text-red-800/80">Permanently delete all applications from this browser.</p>
        <button
          onClick={handleClear}
          className="mt-4 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
        >
          Clear All Data
        </button>
      </div>
    </div>
  )
}
