import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase, findOrCreateByName } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import { fetchCandidate } from '../../lib/queries'
import { SKILL_SUGGESTIONS, nota } from '../../lib/format'
import { Container } from '../../components/Layout'
import { Alert, Badge, Button, Card, EmptyState, Field, Input, PageHeader, PageLoader } from '../../components/ui'

export function SkillDatalist({ id, skills }) {
  const names = [...new Set([...skills.map((s) => s.name), ...SKILL_SUGGESTIONS])].sort((a, b) => a.localeCompare(b, 'pt-BR'))
  return <datalist id={id}>{names.map((n) => <option key={n} value={n} />)}</datalist>
}

function GradeInput({ value, onSave }) {
  const [v, setV] = useState(value ?? '')
  useEffect(() => setV(value ?? ''), [value])
  const dirty = String(v) !== String(value ?? '')
  return (
    <div className="flex items-center gap-2">
      <Input type="number" min="0" max="10" step="0.1" value={v} onChange={(e) => setV(e.target.value)} className="w-20 text-right" aria-label="Nota" />
      {dirty && v !== '' && (
        <Button size="sm" type="button" onClick={() => onSave(Number(v))}>Salvar</Button>
      )}
    </div>
  )
}

export default function CandidateGrades() {
  const { profile } = useAuth()
  const [data, setData] = useState(null)
  const [skills, setSkills] = useState([])
  const [form, setForm] = useState({ name: '', skill: '', grade: '', semester: '' })
  const [msg, setMsg] = useState(null)
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    const { candidate, grades } = await fetchCandidate(profile.id)
    let subjects = []
    if (candidate?.curriculum_id) {
      const { data } = await supabase
        .from('subjects')
        .select('id, name, skill_id, skills(name)')
        .eq('curriculum_id', candidate.curriculum_id)
        .order('name')
      subjects = data ?? []
    }
    const { data: sk } = await supabase.from('skills').select('id, name').order('name')
    setSkills(sk ?? [])
    setData({ candidate, grades, subjects })
  }, [profile.id])

  useEffect(() => {
    load()
  }, [load])

  const gradeBySubject = useMemo(() => new Map((data?.grades ?? []).map((g) => [g.subject_id, g])), [data])

  if (!data) return <PageLoader />

  const { candidate, grades, subjects } = data
  const avg = grades.length ? grades.reduce((s, g) => s + Number(g.grade), 0) / grades.length : null

  async function saveGrade(subjectId, grade, semester = null) {
    if (grade < 0 || grade > 10 || Number.isNaN(grade)) throw new Error('A nota deve estar entre 0 e 10.')
    const existing = gradeBySubject.get(subjectId)
    const { error } = existing
      ? await supabase.from('candidate_grades').update({ grade, updated_at: new Date().toISOString() }).eq('id', existing.id)
      : await supabase.from('candidate_grades').insert({ candidate_id: profile.id, subject_id: subjectId, grade, semester })
    if (error) throw error
  }

  async function handleInline(subjectId, grade) {
    setMsg(null)
    try {
      await saveGrade(subjectId, grade)
      await load()
    } catch (e) {
      setMsg({ tone: 'red', text: e.message })
    }
  }

  async function removeGrade(id) {
    await supabase.from('candidate_grades').delete().eq('id', id)
    load()
  }

  async function addSubject(e) {
    e.preventDefault()
    setBusy(true)
    setMsg(null)
    try {
      const skill = form.skill.trim() ? await findOrCreateByName('skills', form.skill) : null
      // Reaproveita a disciplina se já existir nesta grade.
      let subject = subjects.find((s) => s.name.toLowerCase() === form.name.trim().toLowerCase())
      if (!subject) {
        const { data, error } = await supabase
          .from('subjects')
          .insert({ name: form.name.trim(), curriculum_id: candidate.curriculum_id, skill_id: skill?.id ?? null })
          .select()
          .single()
        if (error) throw error
        subject = data
      }
      await saveGrade(subject.id, Number(form.grade), form.semester.trim() || null)
      setForm({ name: '', skill: form.skill, grade: '', semester: form.semester })
      await load()
    } catch (err) {
      setMsg({ tone: 'red', text: err.message })
    }
    setBusy(false)
  }

  async function useAvgAsGpa() {
    await supabase.from('candidates').update({ gpa: Number(avg.toFixed(2)) }).eq('id', profile.id)
    setMsg({ tone: 'green', text: `Coeficiente atualizado para ${nota(avg)}.` })
    load()
  }

  if (!candidate?.curriculum_id) {
    return (
      <Container className="max-w-3xl">
        <PageHeader title="Histórico acadêmico" />
        <EmptyState title="Informe sua faculdade e curso primeiro" action={<Button to="/candidato/perfil">Ir para o perfil</Button>}>
          As disciplinas são organizadas pela grade curricular do seu curso na sua instituição.
        </EmptyState>
      </Container>
    )
  }

  const cur = candidate.curricula
  return (
    <Container className="max-w-4xl">
      <PageHeader
        title="Histórico acadêmico"
        subtitle={`${cur?.courses?.name ?? 'Curso'} · ${cur?.institutions?.name ?? 'Instituição'}`}
        actions={
          avg != null && Number(candidate.gpa) !== Number(avg.toFixed(2)) && (
            <Button variant="secondary" size="sm" onClick={useAvgAsGpa}>Usar média {nota(avg)} como coeficiente</Button>
          )
        }
      />

      {msg && <div className="mb-4"><Alert tone={msg.tone}>{msg.text}</Alert></div>}

      <Card className="mb-6 p-6">
        <h2 className="font-bold text-slate-900">Adicionar disciplina</h2>
        <p className="mb-4 text-sm text-slate-500">
          Ligue cada disciplina a uma <strong>área de conhecimento</strong> — é por ela que comparamos você com as vagas,
          mesmo que o nome da matéria mude de uma faculdade para outra.
        </p>
        <form onSubmit={addSubject} className="grid gap-3 sm:grid-cols-12 sm:items-end">
          <Field label="Disciplina" className="sm:col-span-4">
            <Input required list="subjects-list" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex.: Banco de Dados II" />
            <datalist id="subjects-list">{subjects.map((s) => <option key={s.id} value={s.name} />)}</datalist>
          </Field>
          <Field label="Área de conhecimento" className="sm:col-span-4">
            <Input list="skills-list" value={form.skill} onChange={(e) => setForm({ ...form, skill: e.target.value })} placeholder="Ex.: Banco de Dados" />
            <SkillDatalist id="skills-list" skills={skills} />
          </Field>
          <Field label="Nota" className="sm:col-span-1">
            <Input required type="number" min="0" max="10" step="0.1" value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} />
          </Field>
          <Field label="Semestre" className="sm:col-span-1">
            <Input value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })} placeholder="2025/2" />
          </Field>
          <Button type="submit" loading={busy} className="sm:col-span-2">Adicionar</Button>
        </form>
      </Card>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="font-bold text-slate-900">Disciplinas da grade</h2>
          <span className="text-sm text-slate-500">Média: <strong className="text-slate-900">{nota(avg)}</strong></span>
        </div>
        {subjects.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-slate-500">Nenhuma disciplina cadastrada nesta grade ainda.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {subjects.map((s) => {
              const g = gradeBySubject.get(s.id)
              return (
                <li key={s.id} className="flex flex-wrap items-center gap-3 px-6 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900">{s.name}</p>
                    <p className="text-xs text-slate-500">
                      {s.skills?.name ? <Badge tone="indigo">{s.skills.name}</Badge> : <span className="text-amber-700">Sem área — não conta no matching</span>}
                      {g?.semester && <span className="ml-2">{g.semester}</span>}
                    </p>
                  </div>
                  <GradeInput value={g?.grade} onSave={(v) => handleInline(s.id, v)} />
                  {g && (
                    <button type="button" onClick={() => removeGrade(g.id)} className="text-xs font-medium text-slate-400 hover:text-red-600">
                      Remover
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </Card>
    </Container>
  )
}
