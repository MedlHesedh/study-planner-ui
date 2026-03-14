'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { StudyCalendar } from '@/components/calendar/StudyCalendar'
import { useStudyPlanStore } from '@/lib/hooks/useStudyPlanStore'
import { Module } from '@/lib/types/study'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatDateDisplay } from '@/lib/utils/dateHelpers'

export default function CalendarPage() {
  const { modules, updateModule, plans } = useStudyPlanStore()
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<string>('')

  const filteredModules = selectedPlan
    ? modules.filter((m) => m.planId === selectedPlan)
    : modules

  const handleStatusChange = (newStatus: string) => {
    if (selectedModule) {
      updateModule({
        ...selectedModule,
        status: newStatus as 'Not Started' | 'In Progress' | 'Completed' | 'Skipped',
      })
      setSelectedModule(null)
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Study Calendar</h1>
          <p className="text-muted-foreground">
            Visualize your study schedule and track module completion
          </p>
        </div>

        {/* Filter */}
        {plans.length > 0 && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Filter by plan:</label>
            <Select value={selectedPlan} onValueChange={setSelectedPlan}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All plans" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All plans</SelectItem>
                {plans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <StudyCalendar modules={filteredModules} onModuleClick={setSelectedModule} />
          </div>

          {/* Module Details */}
          <div>
            {selectedModule ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Module Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-semibold">{selectedModule.name}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Subject</p>
                    <p className="font-semibold">{selectedModule.subject}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Hours</p>
                    <p className="font-semibold">{selectedModule.hoursRequired}h</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Scheduled Date</p>
                    <p className="font-semibold">{formatDateDisplay(selectedModule.scheduledDate)}</p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <p className="text-sm text-muted-foreground mb-3">Change Status</p>
                    <div className="space-y-2">
                      <Button
                        onClick={() => handleStatusChange('Not Started')}
                        variant={
                          selectedModule.status === 'Not Started' ? 'default' : 'outline'
                        }
                        className="w-full justify-start"
                      >
                        Not Started
                      </Button>
                      <Button
                        onClick={() => handleStatusChange('In Progress')}
                        variant={
                          selectedModule.status === 'In Progress' ? 'default' : 'outline'
                        }
                        className="w-full justify-start"
                      >
                        In Progress
                      </Button>
                      <Button
                        onClick={() => handleStatusChange('Completed')}
                        variant={
                          selectedModule.status === 'Completed' ? 'default' : 'outline'
                        }
                        className="w-full justify-start"
                      >
                        Completed
                      </Button>
                      <Button
                        onClick={() => handleStatusChange('Skipped')}
                        variant={selectedModule.status === 'Skipped' ? 'default' : 'outline'}
                        className="w-full justify-start"
                      >
                        Skipped
                      </Button>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => setSelectedModule(null)}
                  >
                    Close
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Module Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Click on a module in the calendar to view details
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
