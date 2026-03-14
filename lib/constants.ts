export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  STUDY_PLANNER: '/study-planner',
  SUBJECTS: '/subjects',
  MODULES: '/modules',
  CALENDAR: '/calendar',
  FOCUS_MODE: '/focus-mode',
  SETTINGS: '/settings',
}

export const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: 'bg-blue-100 text-blue-700 border-blue-300',
  Science: 'bg-green-100 text-green-700 border-green-300',
  History: 'bg-amber-100 text-amber-700 border-amber-300',
  English: 'bg-purple-100 text-purple-700 border-purple-300',
  Programming: 'bg-slate-100 text-slate-700 border-slate-300',
  'Foreign Language': 'bg-rose-100 text-rose-700 border-rose-300',
  Art: 'bg-pink-100 text-pink-700 border-pink-300',
  Music: 'bg-cyan-100 text-cyan-700 border-cyan-300',
  default: 'bg-slate-100 text-slate-700 border-slate-300',
}

export const SUBJECT_CHART_COLORS: Record<string, string> = {
  Mathematics: '#3B82F6',
  Science: '#10B981',
  History: '#F59E0B',
  English: '#A855F7',
  Programming: '#64748B',
  'Foreign Language': '#F43F5E',
  Art: '#EC4899',
  Music: '#06B6D4',
  default: '#94A3B8',
}

export const AVAILABLE_SUBJECTS = [
  'Mathematics',
  'Science',
  'History',
  'English',
  'Programming',
  'Foreign Language',
  'Art',
  'Music',
]

export const STUDY_STATUS_COLORS: Record<string, string> = {
  'Not Started': 'bg-slate-100 text-slate-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  'Completed': 'bg-green-100 text-green-700',
  'Skipped': 'bg-red-100 text-red-700',
}

export const POMODORO_WORK_MINUTES = 25
export const POMODORO_BREAK_MINUTES = 5
export const POMODORO_LONG_BREAK_MINUTES = 15
export const POMODORO_SESSIONS_UNTIL_LONG_BREAK = 4
