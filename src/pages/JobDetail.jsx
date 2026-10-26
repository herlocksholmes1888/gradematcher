
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { JOB_SELECT } from '../lib/queries'
import { useCandidateData } from '../lib/useCandidateData'
import { isRecommended, DEFAULT_THRESHOLD } from '../lib/match'
import { APPLICATION_STATUS, JOB_STATUS, MODALITY, brl, date, nota, place } from '../lib/format'
import { Container } from '../components/Layout'
import { CompanyAvatar } from '../components/JobCard'
import { Alert, Badge, Button, Card, EmptyState, MatchBreakdown, PageLoader, ScoreRing, Textarea } from '../components/ui'

function Info({ label, value }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="font-semibold text-theme-primary">{value}</dd>
    </div>
  )
}

export default function JobDetail() {
  const { id } = useParams()
  const { user, profile } = useAuth()
  const cand = useCandidateData()
  const [job, setJob] = useState(undefined)
  const [cover, setCover] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    supabase
      .from('jobs')
      .select(JOB_SELECT)
      .eq('id', id)
      .maybeSingle()
      .then(({ data }) => setJob(data))
  }, [id])

  if (job === undefined) return <PageLoader />

  if (!job) {
    return (
      <Container>
        <EmptyState
          title="Vaga não encontrada"
          action={
            <Button to="/vagas" variant="secondary">
              Ver outras vagas
            </Button>
          }
        >
          Ela pode ter sido encerrada ou removida.
        </EmptyState>
      </Container>
    )
  }

  const company = job.companies
  const match = cand.matchFor(job)
  const threshold =
    job.min_gpa != null ? Number(job.min_gpa) : DEFAULT_THRESHOLD
  const application = cand.applicationFor(job.id)
  const deadlinePassed =
    job.application_deadline &&
    new Date(`${job.application_deadline}T23:59:59`) < new Date()
  const hasCurriculum = !!cand.candidate?.curriculum_id

  async function apply() {
    setBusy(true)
    setMsg(null)

    const recommended = isRecommended(match?.score, job.min_gpa)

    const { error } = await supabase.from('applications').insert({
      job_id: job.id,
      candidate_id: profile.id,
      cover_letter: cover.trim() || null,
      is_recommended: recommended,
    })

    setBusy(false)

    if (error) {
      return setMsg({ tone: 'red', text: error.message })
    }

    setMsg({
      tone: 'green',
      text: 'Candidatura enviada! Acompanhe o andamento em “Candidaturas”.',
    })

    cand.reload()
  }

  return (
    <Container>
      <Link
        to="/vagas"
        className="text-sm font-medium text-slate-500 hover:text-theme-primary"
      >
        ← Vagas
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <CompanyAvatar
                name={company?.company_name}
                url={company?.logo_url}
                size="size-14"
              />

              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold tracking-tight text-theme-primary">
                  {job.title}
                </h1>

                <p className="text-slate-500">
                  {company?.company_name}
                  {company?.verified && (
                    <Badge tone="indigo" className="ml-2">
                      Verificada
                    </Badge>
                  )}
                </p>
              </div>

              {job.status !== 'open' && (
                <Badge tone={JOB_STATUS[job.status].tone}>
                  {JOB_STATUS[job.status].label}
                </Badge>
              )}
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-4">
              <Info
                label="Bolsa-auxílio"
                value={`${brl(job.stipend)}/mês`}
              />
              <Info
                label="Modalidade"
                value={MODALITY[job.modality]}
              />
              <Info
                label="Carga horária"
                value={
                  job.workload_hours_per_week
                    ? `${job.workload_hours_per_week}h/semana`
                    : '—'
                }
              />
              <Info
                label="Local"
                value={place(job.city, job.state)}
              />
              <Info
                label="Área"
                value={job.area ?? '—'}
              />
              <Info
                label="Inscrições até"
                value={date(job.application_deadline)}
              />
              <Info
                label="Nota mínima"
                value={job.min_gpa != null ? nota(job.min_gpa) : '—'}
              />
            </dl>
          </Card>

          <Card className="space-y-6 p-6">
            <section>
              <h2 className="font-bold text-theme-primary">
                Sobre a vaga
              </h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">
                {job.description}
              </p>
            </section>

            {job.requirements && (
              <section>
                <h2 className="font-bold text-theme-primary">
                  O que esperamos
                </h2>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">
                  {job.requirements}
                </p>
              </section>
            )}

            {job.benefits && (
              <section>
                <h2 className="font-bold text-theme-primary">
                  Benefícios
                </h2>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">
                  {job.benefits}
                </p>
              </section>
            )}

            {job.job_courses?.length > 0 && (
              <section>
                <h2 className="font-bold text-theme-primary">
                  Cursos elegíveis
                </h2>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {job.job_courses.map((c) => (
                    <Badge key={c.course_id}>
                      {c.courses?.name}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            {company?.industry && (
              <p className="text-xs text-slate-500">
                Setor da empresa: {company.industry}
              </p>
            )}
          </Card>
        </div>

        {/* Lateral: compatibilidade e candidatura */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="font-bold text-theme-primary">
              Compatibilidade
            </h2>

            {cand.enabled ? (
              <>
                <div className="mt-4 flex items-center gap-4">
                  <ScoreRing
                    score={match?.score}
                    threshold={threshold}
                    size={72}
                  />

                  <p className="text-sm text-slate-600">
                    {match?.score == null
                      ? 'Cadastre seu histórico para ver seu score.'
                      : isRecommended(match.score, job.min_gpa)
                        ? 'Seu desempenho atende ao perfil desta vaga.'
                        : `A referência desta vaga é ${nota(threshold)}.`}
                  </p>
                </div>

                {match?.basis === 'skills' ? (
                  <div className="mt-5">
                    <p className="mb-3 text-xs text-slate-500">
                      Média ponderada das suas notas nas áreas que a empresa priorizou:
                    </p>

                    <MatchBreakdown breakdown={match.breakdown} />

                    {match.coverage < 1 && (
                      <p className="mt-4 text-xs text-amber-700">
                        Áreas sem nota contam como zero.{' '}
                        <Link
                          to="/candidato/historico"
                          className="font-semibold underline"
                        >
                          Complete seu histórico
                        </Link>.
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="mt-4 text-xs text-slate-500">
                    Esta vaga não definiu áreas de conhecimento; usamos seu coeficiente de rendimento.
                  </p>
                )}
              </>
            ) : (
              <div className="mt-3">
                <p className="text-sm text-slate-600">
                  Áreas que a empresa priorizou:
                </p>

                <ul className="mt-3 space-y-1.5">
                  {[...(job.job_skills ?? [])]
                    .sort((a, b) => b.weight - a.weight)
                    .map((s) => (
                      <li
                        key={s.skill_id}
                        className="flex justify-between text-sm"
                      >
                        <span>{s.skills?.name}</span>
                        <span className="text-slate-400">
                          {'●'.repeat(s.weight)}
                          {'○'.repeat(5 - s.weight)}
                        </span>
                      </li>
                    ))}

                  {!job.job_skills?.length && (
                    <li className="text-sm text-slate-400">
                      Nenhuma área definida.
                    </li>
                  )}
                </ul>
              </div>
            )}
          </Card>

          <Card className="p-6">
            {msg && (
              <div className="mb-4">
                <Alert tone={msg.tone}>{msg.text}</Alert>
              </div>
            )}

            {!user ? (
              <>
                <p className="text-sm text-slate-600">
                  Entre como estudante para ver seu score e se candidatar.
                </p>

                <div className="mt-4 flex gap-2">
                  <Button
                    to="/entrar"
                    state={{ from: { pathname: `/vagas/${job.id}` } }}
                    className="flex-1"
                  >
                    Entrar
                  </Button>

                  <Button
                    to="/cadastro?tipo=candidato"
                    variant="secondary"
                    className="flex-1"
                  >
                    Criar conta
                  </Button>
                </div>
              </>
            ) : profile?.role === 'company' ? (
              <p className="text-sm text-slate-500">
                Você está logado como empresa.
              </p>
            ) : application ? (
              <div className="space-y-3">
                <p className="text-sm text-slate-600">
                  Você já se candidatou a esta vaga.
                </p>

                <Badge tone={APPLICATION_STATUS[application.status].tone}>
                  {APPLICATION_STATUS[application.status].label}
                </Badge>

                <Button
                  to="/candidato/candidaturas"
                  variant="secondary"
                  className="w-full"
                >
                  Ver candidaturas
                </Button>
              </div>
            ) : job.status !== 'open' || deadlinePassed ? (
              <p className="text-sm text-slate-500">
                As inscrições para esta vaga estão encerradas.
              </p>
            ) : (
              <div className="space-y-3">
                {!hasCurriculum && (
                  <Alert tone="amber">
                    Informe sua faculdade e curso no{' '}
                    <Link
                      to="/candidato/perfil"
                      className="font-semibold underline"
                    >
                      perfil
                    </Link>{' '}
                    para que a empresa veja seu histórico.
                  </Alert>
                )}

                <label className="block text-sm font-medium text-slate-700">
                  Mensagem para a empresa{' '}
                  <span className="font-normal text-slate-400">
                    (opcional)
                  </span>

                  <Textarea
                    className="mt-1.5"
                    rows={4}
                    value={cover}
                    onChange={(e) => setCover(e.target.value)}
                    placeholder="Conte por que essa vaga combina com você…"
                  />
                </label>

                <Button
                  className="w-full"
                  onClick={apply}
                  loading={busy}
                >
                  Candidatar-me
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </Container>
  )
}
