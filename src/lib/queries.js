import { supabase } from './supabase'

export const JOB_SELECT =
  '*, companies(company_name, logo_url, city, state, verified, industry), job_skills(skill_id, weight, skills(name)), job_courses(course_id, courses(name))'

// Perfil acadêmico do candidato logado: grade curricular + notas com a skill de cada disciplina.
export async function fetchCandidate(userId) {
  const [{ data: candidate }, { data: grades }] = await Promise.all([
    supabase
      .from('candidates')
      .select('*, curricula(id, name, institutions(id, name), courses(id, name))')
      .eq('id', userId)
      .maybeSingle(),
    supabase
      .from('candidate_grades')
      .select('id, grade, semester, subject_id, subjects(id, name, skill_id, skills(name))')
      .eq('candidate_id', userId),
  ])
  return { candidate, grades: grades ?? [] }
}

export async function fetchOpenJobs() {
  const { data, error } = await supabase
    .from('jobs')
    .select(JOB_SELECT)
    .eq('status', 'open')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}
