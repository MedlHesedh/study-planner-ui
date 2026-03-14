'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScheduleItem } from '@/lib/types/study'
import { formatDateShort, getDayName } from '@/lib/utils/dateHelpers'
import { SUBJECT_COLORS } from '@/lib/constants'

interface SchedulePreviewProps {
  schedule: ScheduleItem[]
}

export function SchedulePreview({ schedule }: SchedulePreviewProps) {
  if (schedule.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Schedule Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No schedule generated yet</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule Preview</CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          {schedule.length} study days planned
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {schedule.map((day) => (
            <div
              key={day.date}
              className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold">{getDayName(day.date)}</p>
                  <p className="text-sm text-muted-foreground">{formatDateShort(day.date)}</p>
                </div>
                <Badge variant="secondary">{day.totalHours}h</Badge>
              </div>

              <div className="space-y-2">
                {day.modules.map((module) => (
                  <div
                    key={module.id}
                    className={`flex items-center justify-between p-2 rounded border ${
                      SUBJECT_COLORS[module.subject] || SUBJECT_COLORS.default
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium">{module.name}</p>
                      <p className="text-xs">{module.subject}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {module.hoursRequired}h
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Total Days</p>
              <p className="text-2xl font-bold">{schedule.length}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Hours</p>
              <p className="text-2xl font-bold">
                {schedule.reduce((sum, day) => sum + day.totalHours, 0)}h
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Modules</p>
              <p className="text-2xl font-bold">
                {schedule.reduce((sum, day) => sum + day.modules.length, 0)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
