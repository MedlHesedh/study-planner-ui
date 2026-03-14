'use client'

import { MainLayout } from '@/components/layout/MainLayout'
import { TodaysSessions } from '@/components/dashboard/TodaysSessions'
import { StudyStreak } from '@/components/dashboard/StudyStreak'
import { WeeklyStats } from '@/components/dashboard/WeeklyStats'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useStudyPlanStore } from '@/lib/hooks/useStudyPlanStore'
import { toISODateString, getDateRange } from '@/lib/utils/dateHelpers'
import { useMemo } from 'react'

export default function DashboardPage() {
  const { modules, sessions } = useStudyPlanStore()

  const stats = useMemo(() => {
    const today = new Date()
    const todayString = toISODateString(today)
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay())
    const weekStartString = toISODateString(weekStart)

    // Get today's modules
    const todayModules = modules.filter((m) => m.scheduledDate === todayString)

    // Get this week's modules
    const weekDays = getDateRange(weekStart, today)
    const weekModules = modules.filter((m) => {
      const modDate = new Date(m.scheduledDate)
      return weekDays.some((day) => {
        const dayString = toISODateString(day)
        return m.scheduledDate === dayString
      })
    })

    const hoursThisWeek = weekModules.reduce((sum, m) => sum + m.hoursRequired, 0)

    // Calculate streaks (simplified)
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0

    const completedDates = new Set(
      sessions
        .filter((s) => s.completed)
        .map((s) => s.date)
    )

    // Simple streak calculation
    let checkDate = new Date()
    for (let i = 0; i < 365; i++) {
      const dateString = toISODateString(checkDate)
      if (completedDates.has(dateString)) {
        tempStreak++
        if (i === 0) currentStreak = tempStreak
      } else {
        if (tempStreak > longestStreak) longestStreak = tempStreak
        tempStreak = 0
        if (i > 0) break
      }
      checkDate.setDate(checkDate.getDate() - 1)
    }

    return {
      todayModules,
      hoursThisWeek,
      modulesThisWeek: weekModules.length,
      currentStreak,
      longestStreak: Math.max(longestStreak, tempStreak),
    }
  }, [modules, sessions])

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Keep track of your study progress and stay motivated
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TodaysSessions modules={stats.todayModules} />
          </div>
          <div>
            <StudyStreak
              currentStreak={stats.currentStreak}
              longestStreak={stats.longestStreak}
            />
          </div>
        </div>

        {/* Weekly Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <WeeklyStats
            hoursThisWeek={stats.hoursThisWeek}
            modulesThisWeek={stats.modulesThisWeek}
          />
        </div>

        {/* Empty State */}
        {modules.length === 0 && (
          <div className="border border-dashed border-border rounded-lg p-12 text-center">
            <h3 className="text-lg font-semibold mb-2">No study plans yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first study plan to get started
            </p>
          </div>
        )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
