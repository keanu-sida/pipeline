import Dexie, { type EntityTable } from 'dexie'
import type { Application } from './types'

const db = new Dexie('PipelineDB') as Dexie & {
  applications: EntityTable<Application, 'id'>
}

db.version(1).stores({
  applications: '++id, company, status, appliedDate, updatedAt',
})

export { db }

export async function addApplication(data: Omit<Application, 'id'>): Promise<number> {
  const id = await db.applications.add(data as Application)
  if (id === undefined) throw new Error('Failed to add application')
  return id
}

export async function updateApplication(id: number, data: Partial<Application>): Promise<void> {
  await db.applications.update(id, { ...data, updatedAt: new Date().toISOString().slice(0, 10) })
}

export async function deleteApplication(id: number): Promise<void> {
  await db.applications.delete(id)
}

export async function exportAll(): Promise<Application[]> {
  return db.applications.toArray()
}

export async function importAll(apps: Application[]): Promise<void> {
  await db.transaction('rw', db.applications, async () => {
    await db.applications.clear()
    await db.applications.bulkPut(apps)
  })
}

export async function clearAll(): Promise<void> {
  await db.applications.clear()
}
