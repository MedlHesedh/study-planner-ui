'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Flame } from 'lucide-react'

interface StudyStreakProps {
  currentStreak: number
  longestStreak: number
}

export function StudyStreak({ currentStreak, longestStreak }: StudyStreakProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Study Streak</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Flame className="w-6 h-6 text-orange-500" />
              <span className="text-4xl font-bold">{currentStreak}</span>
            </div>
            <p className="text-sm text-muted-foreground">Current Streak</p>
          </div>
          <div className="bg-accent/30 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Longest Streak</p>
            <p className="text-2xl font-semibold">{longestStreak} days</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
