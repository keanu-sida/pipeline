import { useState } from 'react'
import type { Application, ApplicationInput } from '../types'
import {
  ROLE_TAGS,
  SOURCES,
  STATUSES,
  SOURCE_LABELS,
  STATUS_LABELS,
  TAG_LABELS,
  emptyApplication,
} from '../types'

interface Props {
  initial?: Application
  onSave: (data: ApplicationInput) => void
  onCancel: () => void
}

export function ApplicationForm({ initial, onSave, onCancel }: Props) {
  const [form, setForm] = useState<ApplicationInput>(() => {
    if (initial) {
      const { id: _id, ...rest } = initial
      return rest
    }
    return emptyApplication()
  })

  const set = <K extends keyof ApplicationInput>(key: K, value: ApplicationInput[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const toggleTag = (tag: (typeof ROLE_TAGS)[number]) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.company.trim() || !form.role.trim()) return
    onSave(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Company *">
          <input
            required
            value={form.company}
            onChange={(e) => set('company', e.target.value)}
            className={inputClass}
            placeholder="Acme Corp"
          />
        </Field>
        <Field label="Role *">
          <input
            required
            value={form.role}
            onChange={(e) => set('role', e.target.value)}
            className={inputClass}
            placeholder="Junior Software Engineer"
          />
        </Field>
        <Field label="Status">
          <select value={form.status} onChange={(e) => set('status', e.target.value as Application['status'])} className={inputClass}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </Field>
        <Field label="Source">
          <select value={form.source} onChange={(e) => set('source', e.target.value as Application['source'])} className={inputClass}>
            {SOURCES.map((s) => (
              <option key={s} value={s}>{SOURCE_LABELS[s]}</option>
            ))}
          </select>
        </Field>
        <Field label="Applied Date">
          <input type="date" value={form.appliedDate} onChange={(e) => set('appliedDate', e.target.value)} className={inputClass} />
        </Field>
        <Field label="Last Contact">
          <input type="date" value={form.lastContactDate} onChange={(e) => set('lastContactDate', e.target.value)} className={inputClass} />
        </Field>
        <Field label="Resume Version">
          <input value={form.resumeVersion} onChange={(e) => set('resumeVersion', e.target.value)} className={inputClass} placeholder="backend-v2" />
        </Field>
        <Field label="Salary Range">
          <input value={form.salaryRange} onChange={(e) => set('salaryRange', e.target.value)} className={inputClass} placeholder="$70k–$90k" />
        </Field>
        <Field label="Job URL" className="sm:col-span-2">
          <input type="url" value={form.jobUrl} onChange={(e) => set('jobUrl', e.target.value)} className={inputClass} placeholder="https://..." />
        </Field>
        <Field label="Referral Contact">
          <input value={form.referralContact} onChange={(e) => set('referralContact', e.target.value)} className={inputClass} placeholder="Name (relationship)" />
        </Field>
        <Field label="Next Action Date">
          <input type="date" value={form.nextActionDate} onChange={(e) => set('nextActionDate', e.target.value)} className={inputClass} />
        </Field>
        <Field label="Next Action" className="sm:col-span-2">
          <input value={form.nextAction} onChange={(e) => set('nextAction', e.target.value)} className={inputClass} placeholder="Follow up with recruiter" />
        </Field>
        <Field label="Notes" className="sm:col-span-2">
          <textarea
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
            rows={3}
            className={inputClass}
            placeholder="Tech stack, interview format, prep notes..."
          />
        </Field>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-stone-700">Role Tags</p>
        <div className="flex flex-wrap gap-2">
          {ROLE_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                form.tags.includes(tag)
                  ? 'border-brand-600 bg-brand-50 text-brand-800'
                  : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
              }`}
            >
              {TAG_LABELS[tag]}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-stone-700">
        <input
          type="checkbox"
          checked={form.coverLetter}
          onChange={(e) => set('coverLetter', e.target.checked)}
          className="rounded border-stone-300 text-brand-600 focus:ring-brand-500"
        />
        Sent cover letter
      </label>

      <div className="flex justify-end gap-3 border-t border-stone-200 pt-4">
        <button type="button" onClick={onCancel} className="rounded-lg px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100">
          Cancel
        </button>
        <button type="submit" className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800">
          {initial ? 'Save Changes' : 'Add Application'}
        </button>
      </div>
    </form>
  )
}

function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-sm font-medium text-stone-700">{label}</span>
      {children}
    </label>
  )
}

const inputClass =
  'w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20'
