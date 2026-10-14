import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { computeMatch, gradesBySkill, isRecommended, DEFAULT_THRESHOLD } from '../../lib/match'
import { APPLICATION_STATUS, JOB_STATUS, date, nota, place } from '../../lib/format'
import { Container } from '../../components/Layout'
import { Badge, Button, Card, EmptyState, MatchBreakdown, PageHeader, PageLoader, ScoreRing, Select } from '../../components/ui'

const APPLICANT_SELECT = `*, candidates(
  id, gpa, bio, linkedin_url, resume_url, expected_graduation,
  profiles(full_name, phone, city, state, avatar_url),
  curricula(institutions(name), courses(name)),
  candidate_grades(grade, subjects(name, skill_id))
)`

const COMPANY_ACTIONS = ['pending', 'under_review', 'recommended', 'accepted', 'rejected']

function Applicant({ app, rank, blind, threshold, onStatus }) {
  const [open, setOpen] = useState(false)
  const c = app.candidates
  const p = c?.profiles
  const name = blind ? `Candidato #${rank}` : p?.full_name ?? 'Candidato'
  const st = APPLICATION_STATUS[app.status]

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center gap-4">
        <span className="w-6 text-center text-sm font-bold text-slate-400">{rank}</span>
        <ScoreRing score={app.match.score} threshold={threshold} />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-900">{name}</p>
          <p className="truncate text-sm text-slate-500">
            {[c?.curricula?.courses?.name, c?.curricula?.institutions?.name].filter(Boolean).join(' · ') || 'Formação não informada'}
          </p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {isRecommended(app.match.score, threshold) && <Badge tone="lime">Acima da referência</Badge>}
            {app.match.coverage != null && app.match.coverage < 1 && (
              <Badge tone="amber">Histórico cobre {Math.round(app.match.coverage * 100)}% das áreas</Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {app.status === 'withdrawn' ? (
            <Badge>{st.label}</Badge>
          ) : (
            <Select value={app.status} onChange={(e) => onStatus(app, e.target.value)} className="w-40" aria-label="Etapa">
              {COMPANY_ACTIONS.map((s) => <option key={s} value={s}>{APPLICATION_STATUS[s].label}</option>)}
            </Select>
          )}
          <Button variant="ghost" size="sm" onClick={() => setOpen(!open)}>{open ? 'Fechar' : 'Detalhes'}</Button>
        </div>
      </div>

      {open && (
        <div className="mt-5 grid gap-6 border-t border-slate-100 pt-5 md:grid-cols-2">
          <div>
            <h3 className="mb-3 text-sm font-bold text-slate-900">Composição do score</h3>
            {app.match.basis === 'skills' ? (
              <MatchBreakdown breakdown={app.match.breakdown} />
            ) : (
              <p className="text-sm text-slate-500">Coeficiente de rendimento: {nota(c?.gpa)}</p>
            )}
            <h3 className="mb-2 mt-6 text-sm font-bold text-slate-900">Disciplinas cursadas</h3>
            {c?.candidate_grades?.length ? (
              <ul className="max-h-56 space-y-1 overflow-y-auto pr-2 text-sm">
                {c.candidate_grades.map((g, i) => (
                  <li key={i} className="flex justify-between gap-2">
                    <span className="text-slate-600">{g.subjects?.name}</span>
                    <span className="font-semibold">{nota(g.grade)}</span>
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-slate-400">Nenhuma nota cadastrada.</p>}
          </div>
          <div className="space-y-4 text-sm">
            {app.cover_letter && (
              <div>
                <h3 className="mb-1 font-bold text-slate-900">Mensagem</h3>
                <p className="whitespace-pre-line text-slate-600">{app.cover_letter}</p>
              </div>
            )}
            {c?.bio && (
              <div>
                <h3 className="mb-1 font-bold text-slate-900">Sobre</h3>
                <p className="whitespace-pre-line text-slate-600">{c.bio}</p>
              </div>
            )}
            <dl className="grid grid-cols-2 gap-3">
              <div><dt className="text-xs text-slate-500">Coeficiente</dt><dd className="font-semibold">{nota(c?.gpa)}</dd></div>
              <div><dt className="text-xs text-slate-500">Conclusão prevista</dt><dd className="font-semibold">{c?.expected_graduation ? date(c.expected_graduation).slice(3) : '—'}</dd></div>
              <div><dt className="text-xs text-slate-500">Candidatura</dt><dd className="font-semibold">{date(app.applied_at)}</dd></div>
              {!blind && <div><dt className="text-xs text-slate-500">Local</dt><dd className="font-semibold">{place(p?.city, p?.state)}</dd></div>}
            </dl>
            {blind ? (
              <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">Contatos ocultos no modo às cegas.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {p?.phone && <Badge>{p.phone}</Badge>}
                {c?.linkedin_url && <a href={c.linkedin_url} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">LinkedIn ↗</a>}
                {c?.resume_url && <a href={c.resume_url} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">Currículo ↗</a>}
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}

export default function JobApplicants() {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [apps, setApps] = useState(null)
  const [filter, setFilter] = useState('active')
  const [blind, setBlind] = useState(false)

  const load = useCallback(async () => {
    const [{ data: j }, { data: a }] = await Promise.all([
      supabase.from('jobs').select('*, job_skills(skill_id, weight, skills(name))').eq('id', id).single(),
      supabase.from('applications').select(APPLICANT_SELECT).eq('job_id', id),
    ])
    setJob(j)
    setApps(a ?? [])
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  const ranked = useMemo(() => {
    if (!job || !apps) return []
    return apps
      .map((a) => ({
        ...a,
        match: computeMatch(job.job_skills, gradesBySkill(a.candidates?.candidate_grades), a.candidates?.gpa),
      }))
      .sort((x, y) => (y.match.score ?? -1) - (x.match.score ?? -1))
  }, [job, apps])

  async function onStatus(app, status) {
    const threshold = job.min_gpa
    await supabase
      .from('applications')
      .update({ status, reviewed_at: new Date().toISOString(), is_recommended: isRecommended(app.match.score, threshold) })
      .eq('id', app.id)
    load()
  }

  if (!job || !apps) return <PageLoader />
  const threshold = job.min_gpa != null ? Number(job.min_gpa) : DEFAULT_THRESHOLD
  const visible = ranked.filter((a) =>
    filter === 'all' ? true : filter === 'active' ? !['withdrawn', 'rejected'].includes(a.status) : a.status === filter,
  )

  return (
    <Container>
      <Link to="/empresa" className="text-sm font-medium text-slate-500 hover:text-slate-900">← Painel</Link>
      <div className="mt-4">
        <PageHeader
          title={job.title}
          subtitle={`${ranked.length} candidatura${ranked.length === 1 ? '' : 's'} · ordenadas pelo score de compatibilidade · referência ${nota(threshold)}`}
          actions={
            <>
              <Badge tone={JOB_STATUS[job.status].tone} className="self-center">{JOB_STATUS[job.status].label}</Badge>
              <Button variant="secondary" size="sm" to={`/empresa/vagas/${job.id}/editar`}>Editar vaga</Button>
            </>
          }
        />
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {[['active', 'Em andamento'], ['pending', 'Novas'], ['recommended', 'Recomendadas'], ['accepted', 'Aprovadas'], ['all', 'Todas']].map(([k, label]) => (
            <button key={k} onClick={() => setFilter(k)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium ${filter === k ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'}`}>
              {label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600" title="Oculta nome e contatos para reduzir vieses na triagem.">
          <input type="checkbox" checked={blind} onChange={(e) => setBlind(e.target.checked)} className="size-4 accent-indigo-600" />
          Triagem às cegas
        </label>
      </div>

      {job.job_skills.length > 0 && (
        <p className="mb-5 text-sm text-slate-500">
          Áreas avaliadas: {job.job_skills.map((s) => `${s.skills?.name} (peso ${s.weight})`).join(' · ')}
        </p>
      )}

      {visible.length === 0 ? (
        <EmptyState title={ranked.length ? 'Nenhuma candidatura neste filtro' : 'Nenhuma candidatura ainda'}>
          {ranked.length ? 'Escolha outro filtro acima.' : job.status === 'open' ? 'Assim que estudantes se candidatarem, eles aparecem aqui já ranqueados.' : 'Publique a vaga para começar a receber candidaturas.'}
        </EmptyState>
      ) : (
        <div className="space-y-3">
          {visible.map((a) => (
            <Applicant key={a.id} app={a} rank={ranked.indexOf(a) + 1} blind={blind} threshold={threshold} onStatus={onStatus} />
          ))}
        </div>
      )}
    </Container>
  )
}
