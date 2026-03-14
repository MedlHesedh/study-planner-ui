'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X, Plus } from 'lucide-react'
import { AVAILABLE_SUBJECTS } from '@/lib/constants'

export interface ModuleInput {
  id: string
  name: string
  subject: string
  hoursRequired: number
}

interface ModuleListInputProps {
  modules: ModuleInput[]
  onModulesChange: (modules: ModuleInput[]) => void
}

export function ModuleListInput({ modules, onModulesChange }: ModuleListInputProps) {
  const [newModuleName, setNewModuleName] = useState('')
  const [newModuleSubject, setNewModuleSubject] = useState('')
  const [newModuleHours, setNewModuleHours] = useState('')

  const handleAddModule = () => {
    if (!newModuleName.trim() || !newModuleSubject || !newModuleHours) {
      return
    }

    const newModule: ModuleInput = {
      id: `temp-${Date.now()}`,
      name: newModuleName.trim(),
      subject: newModuleSubject,
      hoursRequired: parseFloat(newModuleHours),
    }

    onModulesChange([...modules, newModule])
    setNewModuleName('')
    setNewModuleSubject('')
    setNewModuleHours('')
  }

  const handleRemoveModule = (id: string) => {
    onModulesChange(modules.filter((m) => m.id !== id))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Study Modules</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Module List */}
        {modules.length > 0 && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {modules.map((module) => (
              <div
                key={module.id}
                className="flex items-center justify-between gap-4 p-3 bg-accent/50 rounded-lg border border-border"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{module.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {module.subject} • {module.hoursRequired}h
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveModule(module.id)}
                  className="p-1 hover:bg-destructive/10 text-destructive rounded transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Module Form */}
        <div className="border-t border-border pt-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Module name"
              value={newModuleName}
              onChange={(e) => setNewModuleName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleAddModule()
              }}
            />
            <Select value={newModuleSubject} onValueChange={setNewModuleSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_SUBJECTS.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Hours (e.g., 2)"
              step="0.5"
              min="0.5"
              value={newModuleHours}
              onChange={(e) => setNewModuleHours(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleAddModule()
              }}
              className="w-full"
            />
            <Button
              onClick={handleAddModule}
              disabled={!newModuleName.trim() || !newModuleSubject || !newModuleHours}
              size="sm"
            >
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </div>
        </div>

        {/* Summary */}
        {modules.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded p-3 text-sm">
            <p className="text-blue-900 dark:text-blue-100">
              <strong>{modules.length}</strong> modules,{' '}
              <strong>{modules.reduce((sum, m) => sum + m.hoursRequired, 0)}h</strong> total
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
