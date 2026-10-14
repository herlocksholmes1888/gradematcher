import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../lib/auth'
import { fetchOpenJobs } from '../../lib/queries'
import { useCandidateData } from '../../lib/useCandidateData'
import { isRecommended } from '../../lib/match'
import { nota } from '../../lib/format'
import { Container } from '../../components/Layout'
import JobCard from '../../components/JobCard'
import { Button, Card, EmptyState, PageHeader, PageLoader, Stat } from '../../components/ui'

function Checklist({ items }) {
  const pending = items.filter((i) => !i.done)
  if (!pending.length) return null
  return (
    <Card className="mb-8 border-indigo-200 bg-indigo-50/50 p-5">
      <p className="font-semibold text-slate-900">Complete seu perfil para receber recomendações melhores</p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-3">
        {items.map((i) => (
          <li key={i.label}>
            <Link to={i.to} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${i.done ? 'text-slate-400 line-through' : 'bg-white font-medium text-slate-700 ring-1 ring-slate-200 hover:ring-indigo-300'}`}>
              <span className={`flex size-5 items-center justify-center rounded-full text-xs ${i.done ? 'bg-emerald-500 text-white' : 'border border-slate-300'}`}>
                {i.done ? '✓' : ''}
              </span>
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  )
}

export default function CandidateDashboard() {
  const { profile } = useAuth()
  const cand = useCandidateData()
  const [jobs, setJobs] = useState(null)

  useEffect(() => {
    fetchOpenJobs().then(setJobs).catch(() => setJobs([]))
  }, [])

  const ranked = useMemo(
    () =>
      (jobs ?? [])
        .map((job) => ({ job, match: cand.matchFor(job) }))
        .sort((a, b) => (b.match?.score ?? -1) - (a.match?.score ?? -1)),
    [jobs, cand],
  )
  const recommended = ranked.filter((r) => isRecommended(r.match?.score, r.job.min_gpa))
  const others = ranked.filter((r) => !isRecommended(r.match?.score, r.job.min_gpa)).slice(0, 6)

  if (cand.loading || !jobs) return <PageLoader />

  const avg = cand.grades.length ? cand.grades.reduce((s, g) => s + Number(g.grade), 0) / cand.grades.length : null
  const active = cand.applications.filter((a) => !['withdrawn', 'rejected'].includes(a.status)).length
  const firstName = profile.full_name.split(' ')[0]

  return (
    <Container>
      <PageHeader title={`Olá, ${firstName}!`} subtitle="Estas são as vagas que mais combinam com o seu desempenho acadêmico." />

      <Checklist
        items={[
          { label: 'Informar faculdade e curso', to: '/candidato/perfil', done: !!cand.candidate?.curriculum_id },
          { label: 'Cadastrar notas', to: '/candidato/historico', done: cand.grades.length > 0 },
          { label: 'Escrever uma bio', to: '/candidato/perfil', done: !!cand.candidate?.bio },
        ]}
      />

      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <Stat label="Vagas recomendadas" value={recommended.length} hint={`de ${jobs.length} vagas abertas`} />
        <Stat label="Média das disciplinas" value={nota(avg)} hint={`${cand.grades.length} disciplina${cand.grades.length === 1 ? '' : 's'} cadastrada${cand.grades.length === 1 ? '' : 's'}`} />
        <Stat label="Candidaturas ativas" value={active} hint={<Link to="/candidato/candidaturas" className="text-indigo-600 hover:underline">Acompanhar →</Link>} />
      </div>

      <section>
        <h2 className="mb-4 text-lg font-bold text-slate-900">Recomendadas para você</h2>
        {recommended.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommended.map(({ job, match }) => (
              <JobCard key={job.id} job={job} match={match} applied={!!cand.applicationFor(job.id)} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Ainda não há vagas recomendadas"
            action={cand.grades.length ? <Button to="/vagas" variant="secondary">Ver todas as vagas</Button> : <Button to="/candidato/historico">Cadastrar notas</Button>}
          >
            {cand.grades.length
              ? 'Nenhuma vaga aberta atinge a nota de referência com o seu histórico atual. Confira as outras vagas abaixo.'
              : 'Cadastre suas disciplinas e notas para calcularmos sua compatibilidade com cada vaga.'}
          </EmptyState>
        )}
      </section>

      {others.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-1 text-lg font-bold text-slate-900">Outras vagas abertas</h2>
          <p className="mb-4 text-sm text-slate-500">Seu score ainda está abaixo da referência — mas nada impede você de se candidatar.</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map(({ job, match }) => (
              <JobCard key={job.id} job={job} match={match} applied={!!cand.applicationFor(job.id)} />
            ))}
          </div>
        </section>
      )}
    </Container>
  )
}
