'use client'

import { MainLayout } from '@/components/layout/MainLayout'
import { ModuleTable } from '@/components/modules/ModuleTable'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useStudyPlanStore } from '@/lib/providers/StudyPlanProvider'
import { Module } from '@/lib/types/study'

export default function ModulesPage() {
  const { modules, updateModule } = useStudyPlanStore()

  const handleStatusChange = (module: Module, newStatus: string) => {
    updateModule({
      ...module,
      status: newStatus as 'Not Started' | 'In Progress' | 'Completed' | 'Skipped',
    })
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Module Tracker</h1>
          <p className="text-muted-foreground">
            Track the status of all your study modules
          </p>
        </div>

        {modules.length === 0 ? (
          <div className="border border-dashed border-border rounded-lg p-12 text-center">
            <h3 className="text-lg font-semibold mb-2">No modules yet</h3>
            <p className="text-muted-foreground">
              Create a study plan to add modules
            </p>
          </div>
        ) : (
          <ModuleTable modules={modules} onStatusChange={handleStatusChange} />
        )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
