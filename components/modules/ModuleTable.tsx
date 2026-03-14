'use client'

import { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Module } from '@/lib/types/study'
import { formatDateDisplay } from '@/lib/utils/dateHelpers'
import { STUDY_STATUS_COLORS, AVAILABLE_SUBJECTS } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface ModuleTableProps {
  modules: Module[]
  onStatusChange: (module: Module, newStatus: string) => void
}

type SortField = 'name' | 'subject' | 'status' | 'date' | 'hours'

export function ModuleTable({ modules, onStatusChange }: ModuleTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterSubject, setFilterSubject] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [sortField, setSortField] = useState<SortField>('date')

  const filteredAndSorted = useMemo(() => {
    let result = [...modules]

    // Filter by search
    if (searchQuery) {
      result = result.filter((m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by subject
    if (filterSubject) {
      result = result.filter((m) => m.subject === filterSubject)
    }

    // Filter by status
    if (filterStatus) {
      result = result.filter((m) => m.status === filterStatus)
    }

    // Sort
    result.sort((a, b) => {
      switch (sortField) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'subject':
          return a.subject.localeCompare(b.subject)
        case 'status':
          return a.status.localeCompare(b.status)
        case 'date':
          return a.scheduledDate.localeCompare(b.scheduledDate)
        case 'hours':
          return a.hoursRequired - b.hoursRequired
        default:
          return 0
      }
    })

    return result
  }, [modules, searchQuery, filterSubject, filterStatus, sortField])

  const stats = useMemo(() => {
    return {
      total: modules.length,
      completed: modules.filter((m) => m.status === 'Completed').length,
      inProgress: modules.filter((m) => m.status === 'In Progress').length,
      notStarted: modules.filter((m) => m.status === 'Not Started').length,
      skipped: modules.filter((m) => m.status === 'Skipped').length,
    }
  }, [modules])

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-5 gap-2">
        <div className="bg-card border border-border rounded-lg p-3 text-center">
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
        <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-green-700 dark:text-green-400">{stats.completed}</p>
          <p className="text-xs text-green-600 dark:text-green-500">Completed</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{stats.inProgress}</p>
          <p className="text-xs text-blue-600 dark:text-blue-500">In Progress</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-slate-700 dark:text-slate-400">
            {stats.notStarted}
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-500">Not Started</p>
        </div>
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-red-700 dark:text-red-400">{stats.skipped}</p>
          <p className="text-xs text-red-600 dark:text-red-500">Skipped</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 p-4 bg-accent/50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input
            placeholder="Search modules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <Select value={filterSubject} onValueChange={setFilterSubject}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All subjects</SelectItem>
              {AVAILABLE_SUBJECTS.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All statuses</SelectItem>
              <SelectItem value="Not Started">Not Started</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Skipped">Skipped</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortField} onValueChange={(val) => setSortField(val as SortField)}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="subject">Subject</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="hours">Hours</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Module</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>Scheduled Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No modules found
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSorted.map((module) => (
                <TableRow key={module.id} className="hover:bg-accent/50">
                  <TableCell>
                    <div>
                      <p className="font-medium">{module.name}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{module.subject}</Badge>
                  </TableCell>
                  <TableCell>{module.hoursRequired}h</TableCell>
                  <TableCell>{formatDateDisplay(module.scheduledDate)}</TableCell>
                  <TableCell>
                    <Badge className={cn(STUDY_STATUS_COLORS[module.status])}>
                      {module.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Select
                      value={module.status}
                      onValueChange={(newStatus) => onStatusChange(module, newStatus)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Not Started">Not Started</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Skipped">Skipped</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
