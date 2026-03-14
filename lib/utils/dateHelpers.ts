import {
  format,
  parse,
  differenceInDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isToday,
  isSameDay,
  parseISO,
} from 'date-fns'

export function formatDateDisplay(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'MMM dd, yyyy')
}

export function formatDateShort(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'MMM dd')
}

export function formatMonthYear(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'MMMM yyyy')
}

export function getDayName(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'EEEE')
}

export function getShortDayName(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'EEE')
}

export function isTodayDate(date: string | Date): boolean {
  const d = typeof date === 'string' ? parseISO(date) : date
  return isToday(d)
}

export function isSameDayDate(date1: string | Date, date2: string | Date): boolean {
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2
  return isSameDay(d1, d2)
}

export function getWeekDays(date: string | Date): Date[] {
  const d = typeof date === 'string' ? parseISO(date) : date
  const week = eachDayOfInterval({
    start: startOfWeek(d),
    end: endOfWeek(d),
  })
  return week
}

export function getDateRange(startDate: string | Date, endDate: string | Date): Date[] {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate
  return eachDayOfInterval({ start, end })
}

export function parseDate(dateString: string): Date {
  return parseISO(dateString)
}

export function toISODateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function getDaysDifference(date1: string | Date, date2: string | Date): number {
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2
  return differenceInDays(d2, d1)
}
