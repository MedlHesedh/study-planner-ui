'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { StudyTimer } from '@/components/focus-mode/StudyTimer'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useStudyPlanStore } from '@/lib/providers/StudyPlanProvider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Module } from '@/lib/types/study'
import { isSameDayDate, toISODateString } from '@/lib/utils/dateHelpers'

export default function FocusModePage() {
  const { modules } = useStudyPlanStore()
  const [selectedModuleId, setSelectedModuleId] = useState<string>('')

  const today = toISODateString(new Date())
  const todayModules = modules.filter((m) => isSameDayDate(m.scheduledDate, today))

  const selectedModule = modules.find((m) => m.id === selectedModuleId)

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Focus Mode</h1>
          <p className="text-muted-foreground">
            Use the Pomodoro timer to maintain focus and track your study sessions
          </p>
        </div>

        {todayModules.length === 0 ? (
          <div className="border border-dashed border-border rounded-lg p-12 text-center">
            <h3 className="text-lg font-semibold mb-2">No modules scheduled for today</h3>
            <p className="text-muted-foreground mb-6">
              You can still use the timer for general study sessions
            </p>
          </div>
        ) : (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Today&apos;s Modules</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedModuleId} onValueChange={setSelectedModuleId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a module to study" />
                </SelectTrigger>
                <SelectContent>
                  {todayModules.map((module) => (
                    <SelectItem key={module.id} value={module.id}>
                      {module.name} ({module.hoursRequired}h - {module.subject})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        )}

        {/* Timer */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <StudyTimer
              moduleName={selectedModule?.name}
              moduleSubject={selectedModule?.subject}
            />
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Today&apos;s Modules</p>
                  <p className="text-3xl font-bold">{todayModules.length}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Total Hours</p>
                  <p className="text-3xl font-bold">
                    {todayModules.reduce((sum, m) => sum + m.hoursRequired, 0)}h
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-3xl font-bold">
                    {todayModules.filter((m) => m.status === 'Completed').length}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Study Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  The Pomodoro Technique is a time management method using a timer to break work into focused intervals.
                </p>
                <div className="space-y-2">
                  <p className="font-semibold">Process:</p>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li>Choose a task</li>
                    <li>Work for 25 minutes</li>
                    <li>Take a 5-minute break</li>
                    <li>Repeat</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
