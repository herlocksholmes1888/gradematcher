
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import { APPLICATION_STATUS, date } from '../../lib/format'
import { Container } from '../../components/Layout'
import { CompanyAvatar } from '../../components/JobCard'
import {
  Badge,
  Button,
  Card,
  EmptyState,
  PageHeader,
  PageLoader,
} from '../../components/ui'

const STEPS = ['pending', 'under_review', 'recommended', 'accepted']

function Progress({ status }) {
  if (status === 'rejected' || status === 'withdrawn') return null

  const idx = STEPS.indexOf(status)

  return (
    <ol className="mt-4 grid grid-cols-4 gap-1.5">
      {STEPS.map((step, index) => {
        const completed = index <= idx

        return (
          <li key={step}>
            <div
              className="h-1.5 rounded-full transition-colors"
              style={{
                backgroundColor: completed
                  ? 'var(--primary-color)'
                  : 'var(--surface-secondary)',
              }}
            />

            <span
              className="mt-1 block text-[11px]"
              style={{
                color: completed
                  ? 'var(--text-primary)'
                  : 'var(--text-muted)',
              }}
            >
              {APPLICATION_STATUS[step].label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

export default function CandidateApplications() {
  const { profile } = useAuth()
  const [apps, setApps] = useState(null)
  const [withdrawing, setWithdrawing] = useState(null)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!profile?.id) {
      setApps([])
      return
    }

    const { data, error: loadError } = await supabase
      .from('applications')
      .select(
        '*, jobs(id, title, status, companies(company_name, logo_url))',
      )
      .eq('candidate_id', profile.id)
      .order('applied_at', { ascending: false })

    if (loadError) {
      setError('Não foi possível carregar suas candidaturas. Tente novamente.')
      setApps([])
      return
    }

    setError('')
    setApps(data ?? [])
  }, [profile?.id])

  useEffect(() => {
    load()
  }, [load])

  async function withdraw(id) {
    const confirmed = window.confirm(
      'Desistir desta candidatura? Essa ação não pode ser desfeita.',
    )

    if (!confirmed) return

    setWithdrawing(id)
    setError('')

    const { error: withdrawError } = await supabase
      .from('applications')
      .update({ status: 'withdrawn' })
      .eq('id', id)
      .eq('candidate_id', profile.id)

    if (withdrawError) {
      setError('Não foi possível cancelar a candidatura. Tente novamente.')
      setWithdrawing(null)
      return
    }

    await load()
    setWithdrawing(null)
  }

  if (!apps) return <PageLoader />

  return (
    <Container>
      <div
        className="min-h-[70vh] rounded-2xl transition-colors"
        style={{
          backgroundColor: 'var(--page-bg)',
          color: 'var(--text-primary)',
        }}
      >
        <PageHeader
          title="Minhas candidaturas"
          subtitle="Acompanhe em que etapa está cada processo seletivo."
        />

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-xl border p-4 text-sm"
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

        {apps.length === 0 ? (
          <EmptyState
            title="Você ainda não se candidatou"
            action={
              <Button to="/candidato">
                Ver vagas recomendadas
              </Button>
            }
          >
            Quando você se candidatar, o andamento aparecerá aqui.
          </EmptyState>
        ) : (
          <div className="space-y-4">
            {apps.map((application) => {
              const status = APPLICATION_STATUS[application.status]
              const canWithdraw = [
                'pending',
                'under_review',
                'recommended',
              ].includes(application.status)

              return (
                <Card
                  key={application.id}
                  className="p-5 transition-colors"
                >
                  <div className="flex flex-wrap items-start gap-4">
                    <CompanyAvatar
                      name={application.jobs?.companies?.company_name}
                      url={application.jobs?.companies?.logo_url}
                    />

                    <div className="min-w-0 flex-1">
                      {application.jobs ? (
                        <Link
                          to={`/vagas/${application.jobs.id}`}
                          className="font-semibold transition-colors hover:underline"
                          style={{ color: 'var(--primary-color)' }}
                        >
                          {application.jobs.title}
                        </Link>
                      ) : (
                        <span
                          className="font-semibold"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          Vaga encerrada
                        </span>
                      )}

                      <p
                        className="mt-1 text-sm"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {application.jobs?.companies?.company_name ?? '—'}
                        {' · '}
                        enviada em {date(application.applied_at)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {application.is_recommended && (
                        <Badge tone="lime">
                          Perfil recomendado
                        </Badge>
                      )}

                      {status ? (
                        <Badge tone={status.tone}>
                          {status.label}
                        </Badge>
                      ) : (
                        <Badge>
                          Status desconhecido
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Progress status={application.status} />

                  {application.status === 'rejected' && (
                    <p
                      className="mt-3 text-sm"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      A empresa seguiu com outros candidatos desta vez.
                      Obrigado por participar!
                    </p>
                  )}

                  {canWithdraw && (
                    <div className="mt-4 flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={withdrawing === application.id}
                        onClick={() => withdraw(application.id)}
                      >
                        {withdrawing === application.id
                          ? 'Cancelando...'
                          : 'Desistir'}
                      </Button>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </Container>
  )
}
