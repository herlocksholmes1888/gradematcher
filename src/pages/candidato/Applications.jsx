import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import { APPLICATION_STATUS, date } from '../../lib/format'
import { Container } from '../../components/Layout'
import { CompanyAvatar } from '../../components/JobCard'
import { Badge, Button, Card, EmptyState, PageHeader, PageLoader } from '../../components/ui'

const STEPS = ['pending', 'under_review', 'recommended', 'accepted']

function Progress({ status }) {
  if (status === 'rejected' || status === 'withdrawn') return null
  const idx = STEPS.indexOf(status)
  return (
    <ol className="mt-4 grid grid-cols-4 gap-1.5">
      {STEPS.map((s, i) => (
        <li key={s}>
          <div className={`h-1.5 rounded-full ${i <= idx ? 'bg-indigo-500' : 'bg-slate-200'}`} />
          <span className={`mt-1 block text-[11px] ${i <= idx ? 'text-slate-700' : 'text-slate-400'}`}>{APPLICATION_STATUS[s].label}</span>
        </li>
      ))}
    </ol>
  )
}

export default function CandidateApplications() {
  const { profile } = useAuth()
  const [apps, setApps] = useState(null)

  const load = useCallback(async () => {
    const { data } = await supabase
      .from('applications')
      .select('*, jobs(id, title, status, companies(company_name, logo_url))')
      .eq('candidate_id', profile.id)
      .order('applied_at', { ascending: false })
    setApps(data ?? [])
  }, [profile.id])

  useEffect(() => {
    load()
  }, [load])

  async function withdraw(id) {
    if (!confirm('Desistir desta candidatura? Essa ação não pode ser desfeita.')) return
    await supabase.from('applications').update({ status: 'withdrawn' }).eq('id', id)
    load()
  }

  if (!apps) return <PageLoader />

  return (
    <Container>
      <PageHeader title="Minhas candidaturas" subtitle="Acompanhe em que etapa está cada processo seletivo." />
      {apps.length === 0 ? (
        <EmptyState title="Você ainda não se candidatou" action={<Button to="/candidato">Ver vagas recomendadas</Button>}>
          Quando você se candidatar, o andamento aparece aqui.
        </EmptyState>
      ) : (
        <div className="space-y-4">
          {apps.map((a) => {
            const st = APPLICATION_STATUS[a.status]
            const canWithdraw = ['pending', 'under_review', 'recommended'].includes(a.status)
            return (
              <Card key={a.id} className="p-5">
                <div className="flex flex-wrap items-start gap-4">
                  <CompanyAvatar name={a.jobs?.companies?.company_name} url={a.jobs?.companies?.logo_url} />
                  <div className="min-w-0 flex-1">
                    {a.jobs ? (
                      <Link to={`/vagas/${a.jobs.id}`} className="font-semibold text-slate-900 hover:text-indigo-700">{a.jobs.title}</Link>
                    ) : (
                      <span className="font-semibold text-slate-500">Vaga encerrada</span>
                    )}
                    <p className="text-sm text-slate-500">
                      {a.jobs?.companies?.company_name ?? '—'} · enviada em {date(a.applied_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {a.is_recommended && <Badge tone="lime">Perfil recomendado</Badge>}
                    <Badge tone={st.tone}>{st.label}</Badge>
                  </div>
                </div>
                <Progress status={a.status} />
                {a.status === 'rejected' && (
                  <p className="mt-3 text-sm text-slate-500">A empresa seguiu com outros candidatos desta vez. Obrigado por participar!</p>
                )}
                {canWithdraw && (
                  <div className="mt-4 flex justify-end">
                    <Button variant="ghost" size="sm" onClick={() => withdraw(a.id)}>Desistir</Button>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </Container>
  )
}
