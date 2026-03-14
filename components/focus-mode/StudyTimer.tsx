'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Clock, Play, Pause, RotateCcw, SkipForward } from 'lucide-react'
import { POMODORO_WORK_MINUTES, POMODORO_BREAK_MINUTES } from '@/lib/constants'

interface StudyTimerProps {
  moduleName?: string
  moduleSubject?: string
}

type TimerMode = 'work' | 'break'

export function StudyTimer({ moduleName = 'Study Session', moduleSubject }: StudyTimerProps) {
  const [mode, setMode] = useState<TimerMode>('work')
  const [isRunning, setIsRunning] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(POMODORO_WORK_MINUTES * 60)
  const [sessionsCompleted, setSessionsCompleted] = useState(0)

  const totalTime = mode === 'work' ? POMODORO_WORK_MINUTES * 60 : POMODORO_BREAK_MINUTES * 60
  const progress = ((totalTime - timeRemaining) / totalTime) * 100

  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1)
      }, 1000)
    } else if (timeRemaining === 0 && isRunning) {
      // Timer finished
      handleTimerComplete()
    }

    return () => clearInterval(interval)
  }, [isRunning, timeRemaining])

  const handleTimerComplete = useCallback(() => {
    if (mode === 'work') {
      setSessionsCompleted((prev) => prev + 1)
      setMode('break')
      setTimeRemaining(POMODORO_BREAK_MINUTES * 60)
      setIsRunning(false)

      // Play notification sound
      playNotification()
    } else {
      setMode('work')
      setTimeRemaining(POMODORO_WORK_MINUTES * 60)
      setIsRunning(false)
      playNotification()
    }
  }, [mode])

  const playNotification = () => {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = 800
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  }

  const handlePlayPause = () => {
    setIsRunning(!isRunning)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTimeRemaining(mode === 'work' ? POMODORO_WORK_MINUTES * 60 : POMODORO_BREAK_MINUTES * 60)
  }

  const handleSkip = () => {
    setTimeRemaining(0)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Pomodoro Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Module Info */}
        <div className="bg-accent/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Current Session</p>
          <h3 className="text-lg font-semibold">{moduleName}</h3>
          {moduleSubject && <p className="text-sm text-muted-foreground">{moduleSubject}</p>}
        </div>

        {/* Timer Display */}
        <div className="space-y-4">
          {/* Mode Badge */}
          <div className="flex items-center justify-center">
            <div
              className={`px-4 py-2 rounded-lg font-semibold ${
                mode === 'work'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100'
                  : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100'
              }`}
            >
              {mode === 'work' ? '⏱️ Work Time' : '☕ Break Time'}
            </div>
          </div>

          {/* Time Display */}
          <div className="text-center">
            <div className="text-7xl font-bold font-mono mb-2">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <p className="text-muted-foreground">
              {mode === 'work' ? `Focus for ${POMODORO_WORK_MINUTES} minutes` : `Rest for ${POMODORO_BREAK_MINUTES} minutes`}
            </p>
          </div>

          {/* Progress Bar */}
          <Progress value={progress} className="h-2" />
        </div>

        {/* Controls */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={handlePlayPause}
            className="gap-2"
            variant={isRunning ? 'default' : 'outline'}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Start
              </>
            )}
          </Button>

          <Button onClick={handleReset} variant="outline" className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>

          <Button onClick={handleSkip} variant="outline" className="gap-2">
            <SkipForward className="w-4 h-4" />
            Skip
          </Button>
        </div>

        {/* Sessions Completed */}
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-600 dark:text-blue-400">Sessions Completed</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
              {sessionsCompleted}
            </div>
            <p className="text-sm text-muted-foreground">
              {sessionsCompleted === 1 ? 'session' : 'sessions'} completed
            </p>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <p className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-2">
            💡 Pomodoro Tips
          </p>
          <ul className="text-xs text-amber-800 dark:text-amber-200 space-y-1">
            <li>• Focus completely during work sessions</li>
            <li>• Take a proper break between sessions</li>
            <li>• After 4 sessions, take a longer break</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
