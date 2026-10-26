
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import { JOB_STATUS, MODALITY, brl, date } from '../../lib/format'
import { Container } from '../../components/Layout'
import {
  Badge,
  Button,
  Card,
  EmptyState,
  PageHeader,
  PageLoader,
  Stat,
} from '../../components/ui'

export default function CompanyDashboard() {
  const { profile } = useAuth()
  const [state, setState] = useState(null)
  const [error, setError] = useState('')
  const [updatingJob, setUpdatingJob] = useState(null)

  const load = useCallback(async () => {
    if (!profile?.id) {
      setState({ company: null, jobs: [] })
      return
    }

    const [
      { data: company, error: companyError },
      { data: jobs, error: jobsError },
    ] = await Promise.all([
      supabase
        .from('companies')
        .select('*')
        .eq('id', profile.id)
        .maybeSingle(),

      supabase
        .from('jobs')
        .select(
          '*, job_skills(weight, skills(name)), applications(id, status, is_recommended)',
        )
        .eq('company_id', profile.id)
        .order('created_at', { ascending: false }),
    ])

    if (companyError || jobsError) {
      setError('Não foi possível carregar os dados da empresa. Tente novamente.')
      setState({ company: company ?? null, jobs: jobs ?? [] })
      return
    }

    setError('')
    setState({ company, jobs: jobs ?? [] })
  }, [profile?.id])

  useEffect(() => {
    load()
  }, [load])

  async function setStatus(job, status) {
    setUpdatingJob(job.id)
    setError('')

    const { error: updateError } = await supabase
      .from('jobs')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', job.id)
      .eq('company_id', profile.id)

    if (updateError) {
      setError('Não foi possível atualizar o status da vaga.')
      setUpdatingJob(null)
      return
    }

    await load()
    setUpdatingJob(null)
  }

  if (!state) return <PageLoader />

  const { company, jobs } = state

  if (!company) {
    return (
      <Container className="max-w-2xl">
        <EmptyState
          title="Cadastre os dados da sua empresa"
          action={
            <Button to="/empresa/perfil">
              Completar cadastro
            </Button>
          }
        >
          Antes de publicar vagas, precisamos saber o nome e alguns dados da
          empresa.
        </EmptyState>
      </Container>
    )
  }

  const apps = jobs
    .flatMap((job) => job.applications ?? [])
    .filter((application) => application.status !== 'withdrawn')

  const open = jobs.filter((job) => job.status === 'open').length

  const pendingCount = apps.filter(
    (application) => application.status === 'pending',
  ).length

  const recommendedCount = apps.filter(
    (application) => application.is_recommended,
  ).length

  const tableTextStyle = {
    color: 'var(--text-primary)',
  }

  const secondaryTextStyle = {
    color: 'var(--text-secondary)',
  }

  return (
    <Container>
      <div
        className="min-h-[70vh] transition-colors"
        style={{
          backgroundColor: 'var(--page-bg)',
          color: 'var(--text-primary)',
        }}
      >
        <PageHeader
          title={company.company_name}
          subtitle="Gerencie suas vagas de estágio e acompanhe os candidatos ranqueados por desempenho acadêmico."
          actions={<Button to="/empresa/vagas/nova">+ Nova vaga</Button>}
        />

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border p-4 text-sm"
            style={{
              backgroundColor: 'var(--surface-bg)',
              borderColor: 'var(--danger-color)',
              color: 'var(--danger-color)',
            }}
          >
            <p>{error}</p>
            <button
              type="button"
              onClick={load}
              className="mt-2 font-semibold underline underline-offset-2"
            >
              Tentar novamente
            </button>
          </div>
        )}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="Vagas abertas"
            value={open}
            hint={`${jobs.length} no total`}
          />

          <Stat
            label="Candidaturas"
            value={apps.length}
          />

          <Stat
            label="Aguardando análise"
            value={pendingCount}
          />

          <Stat
            label="Acima da nota de referência"
            value={recommendedCount}
          />
        </div>

        {jobs.length === 0 ? (
          <EmptyState
            title="Nenhuma vaga publicada ainda"
            action={
              <Button to="/empresa/vagas/nova">
                Publicar primeira vaga
              </Button>
            }
          >
            Defina as áreas de conhecimento mais importantes e receba candidatos
            ordenados por compatibilidade.
          </EmptyState>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table
                className="w-full min-w-[720px] text-sm"
                style={tableTextStyle}
              >
                <thead
                  className="text-left text-xs font-semibold uppercase tracking-wide"
                  style={{
                    backgroundColor: 'var(--surface-secondary)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <tr>
                    <th className="px-5 py-3">Vaga</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Candidatos</th>
                    <th className="px-5 py-3">Bolsa</th>
                    <th className="px-5 py-3">Prazo</th>
                    <th className="px-5 py-3 text-right">Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {jobs.map((job) => {
                    const active = (job.applications ?? []).filter(
                      (application) => application.status !== 'withdrawn',
                    )

                    const pending = active.filter(
                      (application) => application.status === 'pending',
                    ).length

                    const status = JOB_STATUS[job.status]
                    const busy = updatingJob === job.id

                    return (
                      <tr
                        key={job.id}
                        className="border-t transition-colors hover:bg-[var(--surface-hover)]"
                        style={{ borderColor: 'var(--border-color)' }}
                      >
                        <td className="px-5 py-4">
                          <Link
                            to={`/empresa/vagas/${job.id}`}
                            className="font-semibold hover:underline"
                            style={{ color: 'var(--primary-color)' }}
                          >
                            {job.title}
                          </Link>

                          <p
                            className="mt-1 text-xs"
                            style={secondaryTextStyle}
                          >
                            {[job.area, MODALITY[job.modality]]
                              .filter(Boolean)
                              .join(' · ')}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          {status ? (
                            <Badge tone={status.tone}>
                              {status.label}
                            </Badge>
                          ) : (
                            <Badge>Status desconhecido</Badge>
                          )}
                        </td>

                        <td
                          className="px-5 py-4 text-right"
                          style={tableTextStyle}
                        >
                          <span
                            className="font-semibold"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            {active.length}
                          </span>

                          {pending > 0 && (
                            <span
                              className="ml-1.5 inline-block rounded-full px-1.5 text-xs font-semibold"
                              style={{
                                backgroundColor: 'var(--surface-secondary)',
                                color: 'var(--text-primary)',
                              }}
                            >
                              {pending} novo{pending > 1 ? 's' : ''}
                            </span>
                          )}
                        </td>

                        <td
                          className="px-5 py-4"
                          style={tableTextStyle}
                        >
                          {brl(job.stipend)}
                        </td>

                        <td
                          className="px-5 py-4"
                          style={tableTextStyle}
                        >
                          {date(job.application_deadline)}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="secondary"
                              to={`/empresa/vagas/${job.id}`}
                            >
                              Candidatos
                            </Button>

                            <Button
                              size="sm"
                              variant="ghost"
                              to={`/empresa/vagas/${job.id}/editar`}
                            >
                              Editar
                            </Button>

                            {job.status === 'draft' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                disabled={busy}
                                onClick={() => setStatus(job, 'open')}
                              >
                                {busy ? 'Salvando...' : 'Publicar'}
                              </Button>
                            )}

                            {job.status === 'open' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                disabled={busy}
                                onClick={() => setStatus(job, 'closed')}
                              >
                                {busy ? 'Salvando...' : 'Encerrar'}
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </Container>
  )
}
