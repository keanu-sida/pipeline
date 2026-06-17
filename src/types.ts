export const STATUSES = [
  'wishlist',
  'applied',
  'recruiter',
  'technical',
  'onsite',
  'offer',
  'rejected',
  'withdrawn',
] as const

export type ApplicationStatus = (typeof STATUSES)[number]

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  wishlist: 'Wishlist',
  applied: 'Applied',
  recruiter: 'Recruiter Screen',
  technical: 'Technical',
  onsite: 'Onsite / Final',
  offer: 'Offer',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
}

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  wishlist: 'bg-slate-100 text-slate-700 border-slate-200',
  applied: 'bg-sky-50 text-sky-800 border-sky-200',
  recruiter: 'bg-violet-50 text-violet-800 border-violet-200',
  technical: 'bg-amber-50 text-amber-800 border-amber-200',
  onsite: 'bg-orange-50 text-orange-800 border-orange-200',
  offer: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  withdrawn: 'bg-stone-100 text-stone-600 border-stone-200',
}

export const ROLE_TAGS = [
  'general-swe',
  'bio-health',
  'data-engineering',
  'frontend',
  'backend',
  'fullstack',
  'other',
] as const

export type RoleTag = (typeof ROLE_TAGS)[number]

export const TAG_LABELS: Record<RoleTag, string> = {
  'general-swe': 'General SWE',
  'bio-health': 'Bio / Health Tech',
  'data-engineering': 'Data Engineering',
  frontend: 'Frontend',
  backend: 'Backend',
  fullstack: 'Full Stack',
  other: 'Other',
}

export const SOURCES = [
  'linkedin',
  'company-site',
  'referral',
  'job-board',
  'recruiter',
  'other',
] as const

export type ApplicationSource = (typeof SOURCES)[number]

export const SOURCE_LABELS: Record<ApplicationSource, string> = {
  linkedin: 'LinkedIn',
  'company-site': 'Company Site',
  referral: 'Referral',
  'job-board': 'Job Board',
  recruiter: 'Recruiter',
  other: 'Other',
}

export interface Application {
  id?: number
  company: string
  role: string
  status: ApplicationStatus
  tags: RoleTag[]
  source: ApplicationSource
  resumeVersion: string
  coverLetter: boolean
  referralContact: string
  jobUrl: string
  salaryRange: string
  notes: string
  nextAction: string
  nextActionDate: string
  appliedDate: string
  lastContactDate: string
  createdAt: string
  updatedAt: string
}

export type ApplicationInput = Omit<Application, 'id' | 'createdAt' | 'updatedAt'>

export const ACTIVE_STATUSES: ApplicationStatus[] = [
  'wishlist',
  'applied',
  'recruiter',
  'technical',
  'onsite',
  'offer',
]

export const KANBAN_STATUSES: ApplicationStatus[] = [
  'wishlist',
  'applied',
  'recruiter',
  'technical',
  'onsite',
  'offer',
]

export function emptyApplication(): ApplicationInput {
  const today = new Date().toISOString().slice(0, 10)
  return {
    company: '',
    role: '',
    status: 'wishlist',
    tags: [],
    source: 'linkedin',
    resumeVersion: '',
    coverLetter: false,
    referralContact: '',
    jobUrl: '',
    salaryRange: '',
    notes: '',
    nextAction: '',
    nextActionDate: '',
    appliedDate: '',
    lastContactDate: today,
  }
}

export function daysSince(dateStr: string): number | null {
  if (!dateStr) return null
  const date = new Date(dateStr + 'T00:00:00')
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
}

export function isStale(app: Application, thresholdDays = 14): boolean {
  if (app.status === 'rejected' || app.status === 'withdrawn' || app.status === 'offer') {
    return false
  }
  const reference = app.lastContactDate || app.appliedDate || app.createdAt
  const days = daysSince(reference)
  return days !== null && days >= thresholdDays
}
