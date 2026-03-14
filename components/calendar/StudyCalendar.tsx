'use client'

import { useState } from 'react'
import {
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Module } from '@/lib/types/study'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { SUBJECT_COLORS } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface StudyCalendarProps {
  modules: Module[]
  onModuleClick?: (module: Module) => void
}

export function StudyCalendar({ modules, onModuleClick }: StudyCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const getModulesForDate = (date: Date): Module[] => {
    const dateString = date.toISOString().split('T')[0]
    return modules.filter((m) => m.scheduledDate === dateString)
  }

  const weeks: Date[][] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Study Calendar</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handlePrevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-48 text-center">
              {format(currentDate, 'MMMM yyyy')}
            </span>
            <Button variant="ghost" size="sm" onClick={handleNextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center font-semibold text-sm p-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="space-y-1">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="grid grid-cols-7 gap-1">
              {week.map((date) => {
                const dayModules = getModulesForDate(date)
                const isCurrentMonth = isSameMonth(date, monthStart)
                const isTodayDate = isToday(date)

                return (
                  <div
                    key={date.toString()}
                    className={cn(
                      'p-2 rounded-lg border min-h-24 cursor-pointer transition-colors',
                      !isCurrentMonth && 'bg-muted/50 text-muted-foreground',
                      isCurrentMonth && 'bg-background hover:bg-accent/50',
                      isTodayDate && 'border-primary bg-primary/5'
                    )}
                  >
                    <p className={cn('text-xs font-semibold mb-1', isTodayDate && 'text-primary')}>
                      {format(date, 'd')}
                    </p>

                    <div className="space-y-1 text-xs">
                      {dayModules.length > 0 ? (
                        <>
                          {dayModules.slice(0, 2).map((module) => (
                            <div
                              key={module.id}
                              onClick={() => onModuleClick?.(module)}
                              className={cn(
                                'p-1 rounded text-white truncate cursor-pointer hover:opacity-90',
                                module.status === 'Completed'
                                  ? 'bg-green-500'
                                  : module.status === 'In Progress'
                                    ? 'bg-blue-500'
                                    : module.status === 'Skipped'
                                      ? 'bg-red-500'
                                      : 'bg-slate-400'
                              )}
                              title={module.name}
                            >
                              {module.name}
                            </div>
                          ))}
                          {dayModules.length > 2 && (
                            <p className="text-muted-foreground">+{dayModules.length - 2} more</p>
                          )}
                        </>
                      ) : (
                        <p className="text-muted-foreground">-</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-border flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-slate-400" />
            <span className="text-muted-foreground">Not Started</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500" />
            <span className="text-muted-foreground">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500" />
            <span className="text-muted-foreground">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-500" />
            <span className="text-muted-foreground">Skipped</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
