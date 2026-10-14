import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from './supabase'
import { useAuth } from './auth'
import { fetchCandidate } from './queries'
import { computeMatch, gradesBySkill } from './match'

// Dados do candidato logado necessários para calcular matches e saber onde já se candidatou.
// Para visitantes e empresas, retorna `enabled: false` e um matcher nulo.
export function useCandidateData() {
  const { profile } = useAuth()
  const enabled = profile?.role === 'candidate'
  const [state, setState] = useState({ loading: enabled, candidate: null, grades: [], applications: [] })

  const reload = useCallback(async () => {
    if (!enabled) return
    const [{ candidate, grades }, { data: applications }] = await Promise.all([
      fetchCandidate(profile.id),
      supabase.from('applications').select('id, job_id, status').eq('candidate_id', profile.id),
    ])
    setState({ loading: false, candidate, grades, applications: applications ?? [] })
  }, [enabled, profile?.id])

  useEffect(() => {
    reload()
  }, [reload])

  const skillGrades = useMemo(() => gradesBySkill(state.grades), [state.grades])
  const matchFor = useCallback(
    (job) => (enabled ? computeMatch(job.job_skills ?? [], skillGrades, state.candidate?.gpa) : null),
    [enabled, skillGrades, state.candidate?.gpa],
  )
  const applicationFor = useCallback(
    (jobId) => state.applications.find((a) => a.job_id === jobId && a.status !== 'withdrawn'),
    [state.applications],
  )

  return { enabled, ...state, skillGrades, matchFor, applicationFor, reload }
}
