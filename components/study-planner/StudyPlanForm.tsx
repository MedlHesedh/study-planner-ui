'use client'

import { useState, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ModuleListInput, ModuleInput } from './ModuleListInput'
import { SchedulePreview } from './SchedulePreview'
import { calculateDistribution, calculateEndDate } from '@/lib/utils/calculateDistribution'
import { AVAILABLE_SUBJECTS } from '@/lib/constants'
import { useStudyPlanStore } from '@/lib/hooks/useStudyPlanStore'
import { StudyPlan, Module, ScheduleItem } from '@/lib/types/study'
import { toISODateString } from '@/lib/utils/dateHelpers'
import { useRouter } from 'next/navigation'

export function StudyPlanForm() {
  const router = useRouter()
  const { createPlan, addModules } = useStudyPlanStore()

  // Form state
  const [planName, setPlanName] = useState('')
  const [subject, setSubject] = useState('')
  const [startDate, setStartDate] = useState(toISODateString(new Date()))
  const [studyHoursPerDay, setStudyHoursPerDay] = useState('2')
  const [hoursPerModule, setHoursPerModule] = useState('1')
  const [excludeWeekends, setExcludeWeekends] = useState(true)
  const [enableTimer, setEnableTimer] = useState(true)
  const [autoReschedule, setAutoReschedule] = useState(true)
  const [modules, setModules] = useState<ModuleInput[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const schedule = useMemo(() => {
    if (
      modules.length === 0 ||
      !startDate ||
      !studyHoursPerDay ||
      !hoursPerModule ||
      !subject
    ) {
      return []
    }

    return calculateDistribution({
      modules: modules.map((m) => ({
        name: m.name,
        subject: m.subject,
        hoursRequired: m.hoursRequired,
        notes: '',
      })),
      studyHoursPerDay: parseFloat(studyHoursPerDay),
      hoursPerModule: parseFloat(hoursPerModule),
      startDate: new Date(startDate),
      excludeWeekends,
    })
  }, [modules, startDate, studyHoursPerDay, hoursPerModule, subject, excludeWeekends])

  const endDate = useMemo(() => {
    if (modules.length === 0 || !startDate) return toISODateString(new Date())

    return toISODateString(
      calculateEndDate(
        new Date(startDate),
        modules.map((m) => ({
          name: m.name,
          subject: m.subject,
          hoursRequired: m.hoursRequired,
          notes: '',
        })),
        parseFloat(studyHoursPerDay),
        parseFloat(hoursPerModule),
        excludeWeekends
      )
    )
  }, [modules, startDate, studyHoursPerDay, hoursPerModule, excludeWeekends])

  const handleSubmit = useCallback(async () => {
    if (!planName.trim() || !subject || modules.length === 0) {
      return
    }

    setIsSubmitting(true)

    try {
      const planId = `plan-${Date.now()}`
      const now = new Date().toISOString()

      // Create the study plan
      const plan: StudyPlan = {
        id: planId,
        name: planName.trim(),
        subject,
        startDate,
        endDate,
        studyHoursPerDay: parseFloat(studyHoursPerDay),
        hoursPerModule: parseFloat(hoursPerModule),
        excludeWeekends,
        enableTimer,
        autoReschedule,
        createdAt: now,
        updatedAt: now,
      }

      // Create modules from schedule
      const planModules: Module[] = schedule.flatMap((day) =>
        day.modules.map((mod) => ({
          ...mod,
          id: `module-${planId}-${Date.now()}-${Math.random()}`,
          planId,
          status: 'Not Started' as const,
          scheduledDate: day.date,
        }))
      )

      // Save to store
      createPlan(plan)
      addModules(planModules)

      // Redirect to calendar
      router.push('/calendar')
    } finally {
      setIsSubmitting(false)
    }
  }, [
    planName,
    subject,
    modules,
    startDate,
    endDate,
    studyHoursPerDay,
    hoursPerModule,
    excludeWeekends,
    enableTimer,
    autoReschedule,
    schedule,
    createPlan,
    addModules,
    router,
  ])

  const isFormValid = planName.trim() && subject && modules.length > 0

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Study Plan Details</CardTitle>
          <CardDescription>Set up your study plan and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Plan Name</label>
              <Input
                placeholder="e.g., Spring Semester 2024"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Main Subject</label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_SUBJECTS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Start Date</label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Study Hours Per Day</label>
              <Input
                type="number"
                placeholder="2"
                step="0.5"
                min="0.5"
                value={studyHoursPerDay}
                onChange={(e) => setStudyHoursPerDay(e.target.value)}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Hours Per Module</label>
              <Input
                type="number"
                placeholder="1"
                step="0.5"
                min="0.5"
                value={hoursPerModule}
                onChange={(e) => setHoursPerModule(e.target.value)}
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <Checkbox
                id="excludeWeekends"
                checked={excludeWeekends}
                onCheckedChange={(checked) => setExcludeWeekends(checked as boolean)}
              />
              <label htmlFor="excludeWeekends" className="text-sm font-medium cursor-pointer">
                Exclude weekends
              </label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="enableTimer"
                checked={enableTimer}
                onCheckedChange={(checked) => setEnableTimer(checked as boolean)}
              />
              <label htmlFor="enableTimer" className="text-sm font-medium cursor-pointer">
                Enable Pomodoro timer
              </label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="autoReschedule"
                checked={autoReschedule}
                onCheckedChange={(checked) => setAutoReschedule(checked as boolean)}
              />
              <label htmlFor="autoReschedule" className="text-sm font-medium cursor-pointer">
                Auto-reschedule skipped modules
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modules */}
      <ModuleListInput modules={modules} onModulesChange={setModules} />

      {/* Schedule Preview */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SchedulePreview schedule={schedule} />
        </div>

        {/* Summary Card */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground">Study Duration</p>
              <p className="text-sm font-medium">{schedule.length} days</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">End Date</p>
              <p className="text-sm font-medium">{endDate}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Total Hours</p>
              <p className="text-sm font-medium">
                {schedule.reduce((sum, day) => sum + day.totalHours, 0)}h
              </p>
            </div>

            <div className="pt-4 border-t border-border">
              <Button
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Creating...' : 'Create Study Plan'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
