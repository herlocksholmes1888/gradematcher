import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import { JOB_STATUS, MODALITY, brl, date } from '../../lib/format'
import { Container } from '../../components/Layout'
import { Badge, Button, Card, EmptyState, PageHeader, PageLoader, Stat } from '../../components/ui'

export default function CompanyDashboard() {
  const { profile } = useAuth()
  const [state, setState] = useState(null)

  const load = useCallback(async () => {
    const [{ data: company }, { data: jobs }] = await Promise.all([
      supabase.from('companies').select('*').eq('id', profile.id).maybeSingle(),
      supabase
        .from('jobs')
        .select('*, job_skills(weight, skills(name)), applications(id, status, is_recommended)')
        .eq('company_id', profile.id)
        .order('created_at', { ascending: false }),
    ])
    setState({ company, jobs: jobs ?? [] })
  }, [profile.id])

  useEffect(() => {
    load()
  }, [load])

  async function setStatus(job, status) {
    await supabase.from('jobs').update({ status, updated_at: new Date().toISOString() }).eq('id', job.id)
    load()
  }

  if (!state) return <PageLoader />
  const { company, jobs } = state

  if (!company) {
    return (
      <Container className="max-w-2xl">
        <EmptyState title="Cadastre os dados da sua empresa" action={<Button to="/empresa/perfil">Completar cadastro</Button>}>
          Antes de publicar vagas, precisamos saber o nome e alguns dados da empresa.
        </EmptyState>
      </Container>
    )
  }

  const apps = jobs.flatMap((j) => j.applications ?? []).filter((a) => a.status !== 'withdrawn')
  const open = jobs.filter((j) => j.status === 'open').length

  return (
    <Container>
      <PageHeader
        title={company.company_name}
        subtitle="Gerencie suas vagas de estágio e acompanhe os candidatos ranqueados por desempenho acadêmico."
        actions={<Button to="/empresa/vagas/nova">+ Nova vaga</Button>}
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Vagas abertas" value={open} hint={`${jobs.length} no total`} />
        <Stat label="Candidaturas" value={apps.length} />
        <Stat label="Aguardando análise" value={apps.filter((a) => a.status === 'pending').length} />
        <Stat label="Acima da nota de referência" value={apps.filter((a) => a.is_recommended).length} />
      </div>

      {jobs.length === 0 ? (
        <EmptyState title="Nenhuma vaga publicada ainda" action={<Button to="/empresa/vagas/nova">Publicar primeira vaga</Button>}>
          Defina as áreas de conhecimento mais importantes e receba candidatos ordenados por compatibilidade.
        </EmptyState>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Vaga</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Candidatos</th>
                  <th className="px-5 py-3">Bolsa</th>
                  <th className="px-5 py-3">Prazo</th>
                  <th className="px-5 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((j) => {
                  const active = (j.applications ?? []).filter((a) => a.status !== 'withdrawn')
                  const pending = active.filter((a) => a.status === 'pending').length
                  return (
                    <tr key={j.id} className="hover:bg-slate-50/60">
                      <td className="px-5 py-4">
                        <Link to={`/empresa/vagas/${j.id}`} className="font-semibold text-slate-900 hover:text-indigo-700">{j.title}</Link>
                        <p className="text-xs text-slate-500">{[j.area, MODALITY[j.modality]].filter(Boolean).join(' · ')}</p>
                      </td>
                      <td className="px-5 py-4"><Badge tone={JOB_STATUS[j.status].tone}>{JOB_STATUS[j.status].label}</Badge></td>
                      <td className="px-5 py-4 text-right">
                        <span className="font-semibold text-slate-900">{active.length}</span>
                        {pending > 0 && <span className="ml-1.5 rounded-full bg-amber-100 px-1.5 text-xs font-semibold text-amber-800">{pending} novo{pending > 1 ? 's' : ''}</span>}
                      </td>
                      <td className="px-5 py-4">{brl(j.stipend)}</td>
                      <td className="px-5 py-4">{date(j.application_deadline)}</td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1.5">
                          <Button size="sm" variant="secondary" to={`/empresa/vagas/${j.id}`}>Candidatos</Button>
                          <Button size="sm" variant="ghost" to={`/empresa/vagas/${j.id}/editar`}>Editar</Button>
                          {j.status === 'draft' && <Button size="sm" variant="ghost" onClick={() => setStatus(j, 'open')}>Publicar</Button>}
                          {j.status === 'open' && <Button size="sm" variant="ghost" onClick={() => setStatus(j, 'closed')}>Encerrar</Button>}
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
    </Container>
  )
}
