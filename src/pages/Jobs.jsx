import { useEffect, useMemo, useState } from 'react'
import { Container } from '../components/Layout'
import JobCard from '../components/JobCard'
import { Alert, EmptyState, Input, PageHeader, PageLoader, Select } from '../components/ui'
import { fetchOpenJobs } from '../lib/queries'
import { MODALITY, STATES } from '../lib/format'
import { useCandidateData } from '../lib/useCandidateData'

export default function Jobs() {
  const [jobs, setJobs] = useState(null)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [modality, setModality] = useState('')
  const [uf, setUf] = useState('')
  const [area, setArea] = useState('')
  const [sort, setSort] = useState('recent')
  const cand = useCandidateData()

  useEffect(() => {
    fetchOpenJobs().then(setJobs).catch((e) => setError(e.message))
  }, [])

  useEffect(() => {
    if (cand.enabled) setSort('score')
  }, [cand.enabled])

  const areas = useMemo(() => [...new Set((jobs ?? []).map((j) => j.area).filter(Boolean))].sort(), [jobs])

  const list = useMemo(() => {
    if (!jobs) return []
    const term = q.trim().toLowerCase()
    const rows = jobs
      .filter((j) => !modality || j.modality === modality)
      .filter((j) => !uf || j.state === uf)
      .filter((j) => !area || j.area === area)
      .filter((j) => {
        if (!term) return true
        const hay = [j.title, j.description, j.area, j.companies?.company_name, ...(j.job_skills ?? []).map((s) => s.skills?.name)]
          .join(' ')
          .toLowerCase()
        return hay.includes(term)
      })
      .map((j) => ({ job: j, match: cand.matchFor(j) }))
    if (sort === 'score') rows.sort((a, b) => (b.match?.score ?? -1) - (a.match?.score ?? -1))
    if (sort === 'stipend') rows.sort((a, b) => (b.job.stipend ?? 0) - (a.job.stipend ?? 0))
    return rows
  }, [jobs, q, modality, uf, area, sort, cand])

  return (
    <Container>
      <PageHeader
        title="Vagas de estágio"
        subtitle={cand.enabled ? 'O número em cada vaga é o seu score de compatibilidade, calculado com o seu histórico.' : 'Todas as vagas têm bolsa mínima de R$ 1.000 e não exigem conhecimento avançado.'}
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Input className="lg:col-span-2" placeholder="Buscar por cargo, empresa ou área…" value={q} onChange={(e) => setQ(e.target.value)} />
        <Select value={area} onChange={(e) => setArea(e.target.value)}>
          <option value="">Todas as áreas</option>
          {areas.map((a) => <option key={a}>{a}</option>)}
        </Select>
        <Select value={modality} onChange={(e) => setModality(e.target.value)}>
          <option value="">Qualquer modalidade</option>
          {Object.entries(MODALITY).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </Select>
        <div className="flex gap-3">
          <Select value={uf} onChange={(e) => setUf(e.target.value)} aria-label="Estado">
            <option value="">UF</option>
            {STATES.map((s) => <option key={s}>{s}</option>)}
          </Select>
          <Select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Ordenar">
            {cand.enabled && <option value="score">Maior score</option>}
            <option value="recent">Mais recentes</option>
            <option value="stipend">Maior bolsa</option>
          </Select>
        </div>
      </div>

      {error && <Alert>{error}</Alert>}
      {!jobs && !error ? (
        <PageLoader />
      ) : list.length === 0 ? (
        <EmptyState title="Nenhuma vaga encontrada">
          {jobs?.length ? 'Tente remover alguns filtros.' : 'Ainda não há vagas abertas. Volte em breve!'}
        </EmptyState>
      ) : (
        <>
          <p className="mb-3 text-sm text-slate-500">{list.length} vaga{list.length > 1 ? 's' : ''}</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map(({ job, match }) => (
              <JobCard key={job.id} job={job} match={match} applied={!!cand.applicationFor(job.id)} />
            ))}
          </div>
        </>
      )}
    </Container>
  )
}
