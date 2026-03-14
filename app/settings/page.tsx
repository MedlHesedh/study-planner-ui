'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useStudyPlanStore } from '@/lib/hooks/useStudyPlanStore'
import { AlertCircle } from 'lucide-react'

export default function SettingsPage() {
  const { clearAllData, plans, modules } = useStudyPlanStore()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)

  const handleClearAllData = () => {
    if (confirm('Are you sure? This will delete all study plans and modules.')) {
      clearAllData()
      setShowDeleteConfirm(false)
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your preferences and data</p>
        </div>

        {/* Display Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Display Settings</CardTitle>
            <CardDescription>Customize your experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">Enable dark theme</p>
              </div>
              <Checkbox checked={darkMode} onCheckedChange={(checked) => setDarkMode(checked as boolean)} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Enable timer notifications and reminders
                </p>
              </div>
              <Checkbox
                checked={notifications}
                onCheckedChange={(checked) => setNotifications(checked as boolean)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Data & Storage</CardTitle>
            <CardDescription>Manage your study data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium mb-2">Current Data</p>
              <div className="grid grid-cols-2 gap-4 p-3 bg-accent/50 rounded-lg text-sm">
                <div>
                  <p className="text-muted-foreground">Study Plans</p>
                  <p className="font-semibold">{plans.length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Modules</p>
                  <p className="font-semibold">{modules.length}</p>
                </div>
              </div>
            </div>

            <div>
              <p className="font-medium mb-2">Export/Import</p>
              <p className="text-sm text-muted-foreground mb-3">
                Data is stored locally on your device. Use your browser&apos;s developer tools to access
                localStorage if needed.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="w-5 h-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>These actions cannot be undone</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full"
            >
              Clear All Data
            </Button>

            {showDeleteConfirm && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg space-y-3">
                <p className="text-sm font-semibold text-red-900 dark:text-red-100">
                  Are you sure you want to delete all your data?
                </p>
                <p className="text-xs text-red-800 dark:text-red-200">
                  This will permanently delete all study plans, modules, and sessions.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleClearAllData}
                  >
                    Yes, Delete Everything
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>StudyFlow v1.0</p>
            <p>An intelligent study planner built with Next.js and React</p>
            <p>© 2024 StudyFlow. All rights reserved.</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
