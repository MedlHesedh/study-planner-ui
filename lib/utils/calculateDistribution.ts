import { Module, ScheduleItem } from '../types/study'
import { addDays, isWeekend } from 'date-fns'

export interface DistributionInput {
  modules: Omit<Module, 'id' | 'planId' | 'status' | 'scheduledDate' | 'completionDate'>[]
  studyHoursPerDay: number
  hoursPerModule: number
  startDate: Date
  excludeWeekends: boolean
}

export function calculateDistribution(input: DistributionInput): ScheduleItem[] {
  const {
    modules,
    studyHoursPerDay,
    hoursPerModule,
    startDate,
    excludeWeekends,
  } = input

  const modulesPerDay = Math.floor(studyHoursPerDay / hoursPerModule)
  const schedule: ScheduleItem[] = []

  let moduleIndex = 0
  let currentDate = new Date(startDate)

  while (moduleIndex < modules.length) {
    // Skip weekends if requested
    if (excludeWeekends && isWeekend(currentDate)) {
      currentDate = addDays(currentDate, 1)
      continue
    }

    // Get modules for this day
    const endIndex = Math.min(moduleIndex + modulesPerDay, modules.length)
    const dayModulesData = modules.slice(moduleIndex, endIndex)

    // Create module objects with scheduled dates
    const dayModules: Module[] = dayModulesData.map((mod, idx) => ({
      ...mod,
      id: `module-${moduleIndex + idx}-${Date.now()}`,
      planId: '', // Will be set later
      status: 'Not Started' as const,
      scheduledDate: currentDate.toISOString().split('T')[0],
    }))

    const totalHours = dayModules.length * hoursPerModule

    schedule.push({
      date: currentDate.toISOString().split('T')[0],
      modules: dayModules,
      totalHours,
    })

    moduleIndex = endIndex
    currentDate = addDays(currentDate, 1)
  }

  return schedule
}

export function calculateEndDate(
  startDate: Date,
  modules: Omit<Module, 'id' | 'planId' | 'status' | 'scheduledDate' | 'completionDate'>[],
  studyHoursPerDay: number,
  hoursPerModule: number,
  excludeWeekends: boolean
): Date {
  const schedule = calculateDistribution({
    modules,
    studyHoursPerDay,
    hoursPerModule,
    startDate,
    excludeWeekends,
  })

  if (schedule.length === 0) return startDate

  const lastScheduleDate = schedule[schedule.length - 1].date
  return new Date(lastScheduleDate)
}
