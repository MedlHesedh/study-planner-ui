'use client'

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { StudyPlan, Module, StudySession } from '../types/study'
import { getFromLocalStorage, saveToLocalStorage } from '../utils/localStorage'

export interface StudyPlanContextType {
  plans: StudyPlan[]
  modules: Module[]
  sessions: StudySession[]
  activeSessionId: string | null

  // Plan operations
  createPlan: (plan: StudyPlan) => void
  updatePlan: (plan: StudyPlan) => void
  deletePlan: (planId: string) => void
  getPlanById: (planId: string) => StudyPlan | undefined

  // Module operations
  addModules: (modules: Module[]) => void
  updateModule: (module: Module) => void
  deleteModule: (moduleId: string) => void
  getModulesByPlan: (planId: string) => Module[]

  // Session operations
  createSession: (session: StudySession) => void
  updateSession: (session: StudySession) => void
  deleteSession: (sessionId: string) => void
  getSessionsByModule: (moduleId: string) => StudySession[]

  // Helper operations
  setActiveSession: (sessionId: string | null) => void
  clearAllData: () => void
}

const StudyPlanContext = createContext<StudyPlanContextType | undefined>(undefined)

export function StudyPlanProvider({ children }: { children: ReactNode }) {
  const [plans, setPlans] = useState<StudyPlan[]>([])
  const [modules, setModules] = useState<Module[]>([])
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const savedPlans = getFromLocalStorage<StudyPlan[]>('studyPlans', [])
    const savedModules = getFromLocalStorage<Module[]>('studyModules', [])
    const savedSessions = getFromLocalStorage<StudySession[]>('studySessions', [])

    setPlans(savedPlans)
    setModules(savedModules)
    setSessions(savedSessions)
    setIsHydrated(true)
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (!isHydrated) return
    saveToLocalStorage('studyPlans', plans)
  }, [plans, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    saveToLocalStorage('studyModules', modules)
  }, [modules, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    saveToLocalStorage('studySessions', sessions)
  }, [sessions, isHydrated])

  const createPlan = useCallback((plan: StudyPlan) => {
    setPlans((prev) => [...prev, plan])
  }, [])

  const updatePlan = useCallback((plan: StudyPlan) => {
    setPlans((prev) => prev.map((p) => (p.id === plan.id ? plan : p)))
  }, [])

  const deletePlan = useCallback((planId: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== planId))
    setModules((prev) => prev.filter((m) => m.planId !== planId))
  }, [])

  const getPlanById = useCallback(
    (planId: string) => {
      return plans.find((p) => p.id === planId)
    },
    [plans]
  )

  const addModules = useCallback((newModules: Module[]) => {
    setModules((prev) => [...prev, ...newModules])
  }, [])

  const updateModule = useCallback((module: Module) => {
    setModules((prev) => prev.map((m) => (m.id === module.id ? module : m)))
  }, [])

  const deleteModule = useCallback((moduleId: string) => {
    setModules((prev) => prev.filter((m) => m.id !== moduleId))
    setSessions((prev) => prev.filter((s) => s.moduleId !== moduleId))
  }, [])

  const getModulesByPlan = useCallback(
    (planId: string) => {
      return modules.filter((m) => m.planId === planId)
    },
    [modules]
  )

  const createSession = useCallback((session: StudySession) => {
    setSessions((prev) => [...prev, session])
  }, [])

  const updateSession = useCallback((session: StudySession) => {
    setSessions((prev) => prev.map((s) => (s.id === session.id ? session : s)))
  }, [])

  const deleteSession = useCallback((sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId))
  }, [])

  const getSessionsByModule = useCallback(
    (moduleId: string) => {
      return sessions.filter((s) => s.moduleId === moduleId)
    },
    [sessions]
  )

  const handleSetActiveSession = useCallback((sessionId: string | null) => {
    setActiveSessionId(sessionId)
  }, [])

  const clearAllData = useCallback(() => {
    setPlans([])
    setModules([])
    setSessions([])
    setActiveSessionId(null)
  }, [])

  const value: StudyPlanContextType = {
    plans,
    modules,
    sessions,
    activeSessionId,
    createPlan,
    updatePlan,
    deletePlan,
    getPlanById,
    addModules,
    updateModule,
    deleteModule,
    getModulesByPlan,
    createSession,
    updateSession,
    deleteSession,
    getSessionsByModule,
    setActiveSession: handleSetActiveSession,
    clearAllData,
  }

  return (
    <StudyPlanContext.Provider value={value}>
      {children}
    </StudyPlanContext.Provider>
  )
}

export function useStudyPlanStore() {
  const context = useContext(StudyPlanContext)
  if (!context) {
    throw new Error('useStudyPlanStore must be used within StudyPlanProvider')
  }
  return context
}
