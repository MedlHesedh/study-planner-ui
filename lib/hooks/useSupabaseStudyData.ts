'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { StudyPlan, Module, StudySession, Subject } from '@/lib/types/study'

export function useSupabaseStudyData() {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setIsLoading(false)
    }
    getUser()
  }, [supabase])

  // Fetch study plans
  const fetchStudyPlans = useCallback(async () => {
    if (!user) return []
    try {
      const { data, error: err } = await supabase
        .from('study_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (err) throw err
      return data as StudyPlan[]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch study plans')
      return []
    }
  }, [user, supabase])

  // Create study plan
  const createStudyPlan = useCallback(
    async (plan: Omit<StudyPlan, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('No user logged in')
      try {
        const { data, error: err } = await supabase
          .from('study_plans')
          .insert({
            ...plan,
            user_id: user.id,
          })
          .select()
          .single()

        if (err) throw err
        return data as StudyPlan
      } catch (err) {
        throw err instanceof Error ? err : new Error('Failed to create study plan')
      }
    },
    [user, supabase]
  )

  // Create module
  const createModule = useCallback(
    async (module: Omit<Module, 'id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('No user logged in')
      try {
        const { data, error: err } = await supabase
          .from('modules')
          .insert(module)
          .select()
          .single()

        if (err) throw err
        return data as Module
      } catch (err) {
        throw err instanceof Error ? err : new Error('Failed to create module')
      }
    },
    [user, supabase]
  )

  // Fetch modules for study plan
  const fetchModules = useCallback(
    async (studyPlanId: string) => {
      if (!user) return []
      try {
        const { data, error: err } = await supabase
          .from('modules')
          .select('*')
          .eq('study_plan_id', studyPlanId)
          .order('scheduled_date', { ascending: true })

        if (err) throw err
        return data as Module[]
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch modules')
        return []
      }
    },
    [user, supabase]
  )

  // Update module status
  const updateModuleStatus = useCallback(
    async (moduleId: string, status: string) => {
      try {
        const { data, error: err } = await supabase
          .from('modules')
          .update({ status })
          .eq('id', moduleId)
          .select()
          .single()

        if (err) throw err
        return data as Module
      } catch (err) {
        throw err instanceof Error ? err : new Error('Failed to update module')
      }
    },
    [supabase]
  )

  // Create study session
  const createStudySession = useCallback(
    async (session: Omit<StudySession, 'id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('No user logged in')
      try {
        const { data, error: err } = await supabase
          .from('study_sessions')
          .insert({
            ...session,
            user_id: user.id,
          })
          .select()
          .single()

        if (err) throw err
        return data as StudySession
      } catch (err) {
        throw err instanceof Error ? err : new Error('Failed to create study session')
      }
    },
    [user, supabase]
  )

  // Fetch subjects
  const fetchSubjects = useCallback(async () => {
    if (!user) return []
    try {
      const { data, error: err } = await supabase
        .from('subjects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (err) throw err
      return data as Subject[]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch subjects')
      return []
    }
  }, [user, supabase])

  // Create subject
  const createSubject = useCallback(
    async (subject: Omit<Subject, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('No user logged in')
      try {
        const { data, error: err } = await supabase
          .from('subjects')
          .insert({
            ...subject,
            user_id: user.id,
          })
          .select()
          .single()

        if (err) throw err
        return data as Subject
      } catch (err) {
        throw err instanceof Error ? err : new Error('Failed to create subject')
      }
    },
    [user, supabase]
  )

  return {
    user,
    isLoading,
    error,
    fetchStudyPlans,
    createStudyPlan,
    createModule,
    fetchModules,
    updateModuleStatus,
    createStudySession,
    fetchSubjects,
    createSubject,
  }
}
