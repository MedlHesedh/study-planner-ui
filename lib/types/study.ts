export type StudyStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Skipped'

export interface Module {
  id: string
  planId: string
  name: string
  subject: string
  hoursRequired: number
  status: StudyStatus
  scheduledDate: string // ISO date string
  completionDate?: string // ISO date string
  notes?: string
}

export interface StudySession {
  id: string
  moduleId: string
  date: string // ISO date string
  duration: number // in minutes
  completed: boolean
  skipped: boolean
  notes?: string
}

export interface StudyPlan {
  id: string
  name: string
  subject: string
  startDate: string // ISO date string
  endDate: string // ISO date string
  studyHoursPerDay: number
  hoursPerModule: number
  excludeWeekends: boolean
  enableTimer: boolean
  autoReschedule: boolean
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
}

export interface ScheduleItem {
  date: string // ISO date string
  modules: Module[]
  totalHours: number
}

export interface SubjectProgress {
  subject: string
  totalModules: number
  completedModules: number
  totalHours: number
  completedHours: number
  percentComplete: number
  color: string
}

export interface StudyStats {
  totalStudyHours: number
  hoursThisWeek: number
  currentStreak: number
  longestStreak: number
  totalModulesCompleted: number
}
