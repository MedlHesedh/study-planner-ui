'use client'

import { Module } from '@/lib/types/study'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, CheckCircle2 } from 'lucide-react'
import { SUBJECT_COLORS } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface TodaysSessionsProps {
  modules: Module[]
}

export function TodaysSessions({ modules }: TodaysSessionsProps) {
  const completedCount = modules.filter((m) => m.status === 'Completed').length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Today&apos;s Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        {modules.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No modules scheduled for today</p>
            <p className="text-sm">Create a study plan to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {modules.map((module) => (
              <div
                key={module.id}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-lg border transition-colors',
                  module.status === 'Completed'
                    ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
                    : module.status === 'In Progress'
                      ? 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800'
                      : 'bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800'
                )}
              >
                <div className="flex-1">
                  <p className="font-medium">{module.name}</p>
                  <p className="text-xs text-muted-foreground">{module.subject}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={cn(
                      'text-xs',
                      SUBJECT_COLORS[module.subject] || SUBJECT_COLORS.default
                    )}
                  >
                    {module.hoursRequired}h
                  </Badge>
                  {module.status === 'Completed' ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            ))}
            <div className="mt-4 pt-4 border-t flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold">
                {completedCount}/{modules.length} completed
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
