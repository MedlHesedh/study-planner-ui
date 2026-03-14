'use client'

import { MainLayout } from '@/components/layout/MainLayout'
import { StudyPlanForm } from '@/components/study-planner/StudyPlanForm'

export default function StudyPlannerPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Create Study Plan</h1>
          <p className="text-muted-foreground">
            Set up your study goals and let us auto-distribute your modules across days
          </p>
        </div>

        <StudyPlanForm />
      </div>
    </MainLayout>
  )
}
