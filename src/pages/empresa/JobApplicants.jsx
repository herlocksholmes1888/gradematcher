
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import {
  computeMatch,
  gradesBySkill,
  isRecommended,
  DEFAULT_THRESHOLD,
} from '../../lib/match'
import {
  APPLICATION_STATUS,
  JOB_STATUS,
  date,
  nota,
  place,
} from '../../lib/format'
import { Container } from '../../components/Layout'
import {
  Alert,
  Badge,
  Button,
  Card,
  EmptyState,
  MatchBreakdown,
  PageHeader,
  PageLoader,
  ScoreRing,
  Select,
} from '../../components/ui'

const APPLICANT_SELECT = `*, candidates(
  id, gpa, bio, linkedin_url, resume_url, expected_graduation,
  profiles(full_name, phone, city, state, avatar_url),
  curricula(institutions(name), courses(name)),
  candidate_grades(grade, subjects(name, skill_id))
)`

const COMPANY_ACTIONS = [
  'pending',
  'under_review',
  'recommended',
  'accepted',
  'rejected',
]

function Applicant({
  app,
  rank,
  blind,
  threshold,
  onStatus,
  updating,
}) {
  const [open, setOpen] = useState(false)
  const c = app.candidates
  const p = c?.profiles
  const name = blind ? `Candidato #${rank}` : p?.full_name ?? 'Candidato'
  const status = APPLICATION_STATUS[app.status]

  return (
    <Card className="p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <span className="w-6 text-center text-sm font-bold text-[var(--text-muted)]">
          {rank}
        </span>

        <ScoreRing score={app.match.score} threshold={threshold} />

        <div className="min-w-0 flex-1">
          <p className="break-words font-semibold text-[var(--text-primary)]">
            {name}
          </p>

          <p className="truncate text-sm text-[var(--text-secondary)]">
            {[
              c?.curricula?.courses?.name,
              c?.curricula?.institutions?.name,
            ]
              .filter(Boolean)
              .join(' · ') || 'Formação não informada'}
          </p>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {isRecommended(app.match.score, threshold) && (
              <Badge tone="lime">Acima da referência</Badge>
            )}

            {app.match.coverage != null && app.match.coverage < 1 && (
              <Badge tone="amber">
                Histórico cobre {Math.round(app.match.coverage * 100)}% das áreas
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {app.status === 'withdrawn' ? (
            <Badge>{status?.label ?? app.status}</Badge>
          ) : (
            <Select
              value={app.status}
              onChange={(value) => onStatus(app, value)}
              className="w-40"
              aria-label="Etapa da candidatura"
              disabled={updating}
            >
              {COMPANY_ACTIONS.map((item) => (
                <option key={item} value={item}>
                  {APPLICATION_STATUS[item]?.label ?? item}
                </option>
              ))}
            </Select>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen((current) => !current)}
          >
            {open ? 'Fechar' : 'Detalhes'}
          </Button>
        </div>
      </div>

      {open && (
        <div className="mt-5 grid gap-6 border-t border-[var(--surface-secondary)] pt-5 md:grid-cols-2">
          <div>
            <h3 className="mb-3 text-sm font-bold text-[var(--text-primary)]">
              Composição do score
            </h3>

            {app.match.basis === 'skills' ? (
              <MatchBreakdown breakdown={app.match.breakdown} />
            ) : (
              <p className="text-sm text-[var(--text-secondary)]">
                Coeficiente de rendimento: {nota(c?.gpa)}
              </p>
            )}

            <h3 className="mb-2 mt-6 text-sm font-bold text-[var(--text-primary)]">
              Disciplinas cursadas
            </h3>

            {c?.candidate_grades?.length ? (
              <ul className="max-h-56 space-y-1 overflow-y-auto pr-2 text-sm">
                {c.candidate_grades.map((grade, index) => (
                  <li
                    key={`${grade.subjects?.name ?? 'disciplina'}-${index}`}
                    className="flex justify-between gap-3"
                  >
                    <span className="text-[var(--text-secondary)]">
                      {grade.subjects?.name ?? 'Disciplina não informada'}
                    </span>
                    <span className="font-semibold text-[var(--text-primary)]">
                      {nota(grade.grade)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[var(--text-muted)]">
                Nenhuma nota cadastrada.
              </p>
            )}
          </div>

          <div className="space-y-4 text-sm">
            {app.cover_letter && (
              <div>
                <h3 className="mb-1 font-bold text-[var(--text-primary)]">
                  Mensagem
                </h3>
                <p className="whitespace-pre-line text-[var(--text-secondary)]">
                  {app.cover_letter}
                </p>
              </div>
            )}

            {c?.bio && (
              <div>
                <h3 className="mb-1 font-bold text-[var(--text-primary)]">
                  Sobre
                </h3>
                <p className="whitespace-pre-line text-[var(--text-secondary)]">
                  {c.bio}
                </p>
              </div>
            )}

            <dl className="grid grid-cols-2 gap-3">
              <div>
                <dt className="text-xs text-[var(--text-muted)]">
                  Coeficiente
                </dt>
                <dd className="font-semibold text-[var(--text-primary)]">
                  {nota(c?.gpa)}
                </dd>
              </div>

              <div>
                <dt className="text-xs text-[var(--text-muted)]">
                  Conclusão prevista
                </dt>
                <dd className="font-semibold text-[var(--text-primary)]">
                  {c?.expected_graduation
                    ? date(c.expected_graduation).slice(3)
                    : '—'}
                </dd>
              </div>

              <div>
                <dt className="text-xs text-[var(--text-muted)]">
                  Candidatura
                </dt>
                <dd className="font-semibold text-[var(--text-primary)]">
                  {date(app.applied_at)}
                </dd>
              </div>

              {!blind && (
                <>
                  <div>
                    <dt className="text-xs text-[var(--text-muted)]">
                      Local
                    </dt>
                    <dd className="font-semibold text-[var(--text-primary)]">
                      {place(p?.city, p?.state)}
                    </dd>
                  </div>

                  {p?.phone && (
                    <div>
                      <dt className="text-xs text-[var(--text-muted)]">
                        Contato
                      </dt>
                      <dd className="font-semibold text-[var(--text-primary)]">
                        {p.phone}
                      </dd>
                    </div>
                  )}
                </>
              )}
            </dl>

            {blind ? (
              <p className="rounded-lg bg-[var(--surface-secondary)] px-3 py-2 text-xs text-[var(--text-secondary)]">
                Contatos ocultos no modo às cegas.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {c?.linkedin_url && (
                  <a
                    href={c.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    LinkedIn ↗
                  </a>
                )}

                {c?.resume_url && (
                  <a
                    href={c.resume_url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    Currículo ↗
                  </a>
                )}
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
  const [loadError, setLoadError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  const load = useCallback(async () => {
    setLoadError('')

    try {
      const [jobResult, appsResult] = await Promise.all([
        supabase
          .from('jobs')
          .select('*, job_skills(skill_id, weight, skills(name))')
          .eq('id', id)
          .single(),

        supabase
          .from('applications')
          .select(APPLICANT_SELECT)
          .eq('job_id', id),
      ])

      if (jobResult.error) throw jobResult.error
      if (appsResult.error) throw appsResult.error

      setJob(jobResult.data)
      setApps(appsResult.data ?? [])
    } catch (error) {
      setLoadError(
        error.message || 'Não foi possível carregar as candidaturas.'
      )
    }
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  const ranked = useMemo(() => {
    if (!job || !apps) return []

    return apps
      .map((application) => ({
        ...application,
        match: computeMatch(
          job.job_skills ?? [],
          gradesBySkill(application.candidates?.candidate_grades),
          application.candidates?.gpa
        ),
      }))
      .sort(
        (a, b) =>
          (b.match.score ?? -1) - (a.match.score ?? -1)
      )
  }, [job, apps])

  async function onStatus(app, status) {
    setUpdatingId(app.id)
    setLoadError('')

    try {
      const threshold =
        job.min_gpa != null
          ? Number(job.min_gpa)
          : DEFAULT_THRESHOLD

      const { error } = await supabase
        .from('applications')
        .update({
          status,
          reviewed_at: new Date().toISOString(),
          is_recommended: isRecommended(app.match.score, threshold),
        })
        .eq('id', app.id)

      if (error) throw error

      await load()
    } catch (error) {
      setLoadError(
        error.message || 'Não foi possível atualizar a candidatura.'
      )
    } finally {
      setUpdatingId(null)
    }
  }

  if (!job || !apps) {
    if (loadError) {
      return (
        <Container className="py-6">
          <Alert>{loadError}</Alert>
          <div className="mt-4">
            <Button onClick={load}>Tentar novamente</Button>
          </div>
        </Container>
      )
    }

    return <PageLoader />
  }

  const threshold =
    job.min_gpa != null
      ? Number(job.min_gpa)
      : DEFAULT_THRESHOLD

  const visible = ranked.filter((application) =>
    filter === 'all'
      ? true
      : filter === 'active'
        ? !['withdrawn', 'rejected'].includes(application.status)
        : application.status === filter
  )

  const filters = [
    ['active', 'Em andamento'],
    ['pending', 'Novas'],
    ['recommended', 'Recomendadas'],
    ['accepted', 'Aprovadas'],
    ['all', 'Todas'],
  ]

  return (
    <Container className="min-w-0">
      <Link
        to="/empresa"
        className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      >
        ← Painel
      </Link>

      {loadError && (
        <div className="mt-4">
          <Alert>{loadError}</Alert>
        </div>
      )}

      <div className="mt-4">
        <PageHeader
          title={job.title}
          subtitle={`${ranked.length} ${
            ranked.length === 1 ? 'candidatura' : 'candidaturas'
          } · ordenadas pelo score de compatibilidade · referência ${nota(threshold)}`}
          actions={
            <>
              <Badge
                tone={JOB_STATUS[job.status]?.tone}
                className="self-center"
              >
                {JOB_STATUS[job.status]?.label ?? job.status}
              </Badge>

              <Button
                variant="secondary"
                size="sm"
                to={`/empresa/vagas/${job.id}/editar`}
              >
                Editar vaga
              </Button>
            </>
          }
        />
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {filters.map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              aria-pressed={filter === key}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                filter === key
                  ? 'border-indigo-600 bg-indigo-600 text-white'
                  : 'border-[var(--surface-secondary)] bg-[var(--surface-bg)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <label
          className="flex cursor-pointer items-center gap-2 text-sm text-[var(--text-secondary)]"
          title="Oculta nomes e contatos para reduzir vieses na triagem."
        >
          <input
            type="checkbox"
            checked={blind}
            onChange={(event) => setBlind(event.target.checked)}
            className="size-4 accent-indigo-600"
          />
          Triagem às cegas
        </label>
      </div>

      {(job.job_skills ?? []).length > 0 && (
        <p className="mb-5 text-sm text-[var(--text-secondary)]">
          Áreas avaliadas:{' '}
          {job.job_skills
            .map(
              (skill) =>
                `${skill.skills?.name ?? 'Área não informada'} (peso ${skill.weight})`
            )
            .join(' · ')}
        </p>
      )}

      {visible.length === 0 ? (
        <EmptyState
          title={
            ranked.length
              ? 'Nenhuma candidatura neste filtro'
              : 'Nenhuma candidatura ainda'
          }
        >
          {ranked.length
            ? 'Escolha outro filtro acima.'
            : job.status === 'open'
              ? 'Assim que estudantes se candidatarem, eles aparecerão aqui, ordenados por compatibilidade.'
              : 'Publique a vaga para começar a receber candidaturas.'}
        </EmptyState>
      ) : (
        <div className="space-y-3">
          {visible.map((application) => (
            <Applicant
              key={application.id}
              app={application}
              rank={ranked.indexOf(application) + 1}
              blind={blind}
              threshold={threshold}
              onStatus={onStatus}
              updating={updatingId === application.id}
            />
          ))}
        </div>
      )}
    </Container>
  )
}
