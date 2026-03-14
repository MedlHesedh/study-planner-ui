'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, BookOpen } from 'lucide-react'

interface WeeklyStatsProps {
  hoursThisWeek: number
  modulesThisWeek: number
}

export function WeeklyStats({ hoursThisWeek, modulesThisWeek }: WeeklyStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Weekly Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Study Hours</p>
                <p className="text-2xl font-bold">{hoursThisWeek}h</p>
              </div>
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Modules</p>
                <p className="text-2xl font-bold">{modulesThisWeek}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
