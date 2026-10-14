import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import { STATES } from '../../lib/format'
import { Container } from '../../components/Layout'
import { CompanyAvatar } from '../../components/JobCard'
import { Alert, Button, Card, Field, Input, PageHeader, PageLoader, Select, Textarea } from '../../components/ui'

export default function CompanyProfile() {
  const { profile, refreshProfile } = useAuth()
  const [form, setForm] = useState(null)
  const [msg, setMsg] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    supabase.from('companies').select('*').eq('id', profile.id).maybeSingle().then(({ data: c }) => {
      setForm({
        full_name: profile.full_name ?? '',
        phone: profile.phone ?? '',
        company_name: c?.company_name ?? '',
        cnpj: c?.cnpj ?? '',
        website: c?.website ?? '',
        industry: c?.industry ?? '',
        description: c?.description ?? '',
        logo_url: c?.logo_url ?? '',
        city: c?.city ?? '',
        state: c?.state ?? 'SP',
        verified: c?.verified ?? false,
        _exists: !!c,
      })
    })
  }, [profile])

  if (!form) return <PageLoader />
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  async function save(e) {
    e.preventDefault()
    setBusy(true)
    setMsg(null)
    const row = {
      id: profile.id,
      company_name: form.company_name.trim(),
      cnpj: form.cnpj.trim() || null,
      website: form.website.trim() || null,
      industry: form.industry.trim() || null,
      description: form.description.trim() || null,
      logo_url: form.logo_url.trim() || null,
      city: form.city.trim() || null,
      state: form.state || null,
      updated_at: new Date().toISOString(),
    }
    const { error } = form._exists
      ? await supabase.from('companies').update(row).eq('id', profile.id)
      : await supabase.from('companies').insert(row)
    const { error: pErr } = await supabase
      .from('profiles')
      .update({ full_name: form.full_name.trim(), phone: form.phone || null, updated_at: new Date().toISOString() })
      .eq('id', profile.id)
    setBusy(false)
    const err = error ?? pErr
    if (err) return setMsg({ tone: 'red', text: err.code === '23505' ? 'Este CNPJ já está cadastrado.' : err.message })
    setForm({ ...form, _exists: true })
    setMsg({ tone: 'green', text: 'Dados da empresa salvos.' })
    refreshProfile()
  }

  return (
    <Container className="max-w-3xl">
      <PageHeader title="Dados da empresa" subtitle="Essas informações aparecem nas suas vagas." />
      <form onSubmit={save} className="space-y-6">
        {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}

        <Card className="p-6">
          <div className="mb-5 flex items-center gap-4">
            <CompanyAvatar name={form.company_name} url={form.logo_url} size="size-16" />
            <div>
              <p className="font-bold text-slate-900">{form.company_name || 'Sua empresa'}</p>
              <p className="text-sm text-slate-500">{form.verified ? 'Empresa verificada' : 'Verificação pendente'}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nome da empresa" className="sm:col-span-2">
              <Input required value={form.company_name} onChange={set('company_name')} />
            </Field>
            <Field label="CNPJ">
              <Input value={form.cnpj} onChange={set('cnpj')} placeholder="00.000.000/0000-00" />
            </Field>
            <Field label="Setor">
              <Input value={form.industry} onChange={set('industry')} placeholder="Ex.: Tecnologia, Varejo…" />
            </Field>
            <Field label="Site">
              <Input type="url" value={form.website} onChange={set('website')} placeholder="https://" />
            </Field>
            <Field label="URL do logotipo">
              <Input type="url" value={form.logo_url} onChange={set('logo_url')} placeholder="https://…/logo.png" />
            </Field>
            <Field label="Cidade">
              <Input value={form.city} onChange={set('city')} />
            </Field>
            <Field label="UF">
              <Select value={form.state} onChange={set('state')}>
                <option value="">—</option>
                {STATES.map((s) => <option key={s}>{s}</option>)}
              </Select>
            </Field>
            <Field label="Sobre a empresa" className="sm:col-span-2">
              <Textarea value={form.description} onChange={set('description')} />
            </Field>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 font-bold text-slate-900">Responsável pelo recrutamento</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nome">
              <Input required value={form.full_name} onChange={set('full_name')} />
            </Field>
            <Field label="Telefone">
              <Input value={form.phone} onChange={set('phone')} />
            </Field>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" loading={busy}>Salvar</Button>
        </div>
      </form>
    </Container>
  )
}
