'use client'

import { useMemo } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useStudyPlanStore } from '@/lib/providers/StudyPlanProvider'
import { AVAILABLE_SUBJECTS, SUBJECT_CHART_COLORS } from '@/lib/constants'
import { Progress } from '@/components/ui/progress'

export default function SubjectsPage() {
  const { modules } = useStudyPlanStore()

  const subjectStats = useMemo(() => {
    const stats: Record<string, { total: number; completed: number; hours: number }> = {}

    // Initialize all subjects
    AVAILABLE_SUBJECTS.forEach((subject) => {
      stats[subject] = { total: 0, completed: 0, hours: 0 }
    })

    // Aggregate module data
    modules.forEach((module) => {
      if (!stats[module.subject]) {
        stats[module.subject] = { total: 0, completed: 0, hours: 0 }
      }
      stats[module.subject].total += 1
      stats[module.subject].hours += module.hoursRequired
      if (module.status === 'Completed') {
        stats[module.subject].completed += 1
      }
    })

    // Filter out subjects with no modules
    return Object.entries(stats)
      .filter(([_, stat]) => stat.total > 0)
      .map(([subject, stat]) => ({
        subject,
        ...stat,
        percentage: Math.round((stat.completed / stat.total) * 100),
        color: SUBJECT_CHART_COLORS[subject] || SUBJECT_CHART_COLORS.default,
      }))
      .sort((a, b) => b.hours - a.hours)
  }, [modules])

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Subjects</h1>
          <p className="text-muted-foreground">
            Track your progress by subject
          </p>
        </div>

        {subjectStats.length === 0 ? (
          <div className="border border-dashed border-border rounded-lg p-12 text-center">
            <h3 className="text-lg font-semibold mb-2">No modules yet</h3>
            <p className="text-muted-foreground">
              Create a study plan to see subject progress
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjectStats.map((stat) => (
              <Card key={stat.subject}>
                <CardHeader>
                  <CardTitle className="text-lg">{stat.subject}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-accent/50 rounded p-2 text-center">
                      <p className="text-muted-foreground text-xs">Modules</p>
                      <p className="font-semibold">{stat.total}</p>
                    </div>
                    <div className="bg-accent/50 rounded p-2 text-center">
                      <p className="text-muted-foreground text-xs">Hours</p>
                      <p className="font-semibold">{stat.hours}h</p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">Progress</p>
                      <p className="text-sm text-muted-foreground">{stat.percentage}%</p>
                    </div>
                    <Progress value={stat.percentage} className="h-2" />
                  </div>

                  {/* Completion Info */}
                  <p className="text-xs text-muted-foreground text-center">
                    {stat.completed} of {stat.total} modules completed
                  </p>
                </CardContent>
              </Card>
        ))}
      </div>
    </MainLayout>
  )
}
