
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import { STATES } from '../../lib/format'
import { Container } from '../../components/Layout'
import { CompanyAvatar } from '../../components/JobCard'
import {
  Alert,
  Button,
  Card,
  Field,
  Input,
  PageHeader,
  PageLoader,
  Select,
  Textarea,
} from '../../components/ui'

export default function CompanyProfile() {
  const { profile, refreshProfile } = useAuth()
  const [form, setForm] = useState(null)
  const [msg, setMsg] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!profile?.id) return

    let active = true

    async function loadCompany() {
      const { data: company, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', profile.id)
        .maybeSingle()

      if (!active) return

      if (error) {
        setMsg({
          tone: 'red',
          text: 'Não foi possível carregar os dados da empresa.',
        })

        setForm({
          full_name: profile.full_name ?? '',
          phone: profile.phone ?? '',
          company_name: '',
          cnpj: '',
          website: '',
          industry: '',
          description: '',
          logo_url: '',
          city: '',
          state: 'SP',
          verified: false,
          _exists: false,
          _loadError: true,
        })

        return
      }

      setForm({
        full_name: profile.full_name ?? '',
        phone: profile.phone ?? '',
        company_name: company?.company_name ?? '',
        cnpj: company?.cnpj ?? '',
        website: company?.website ?? '',
        industry: company?.industry ?? '',
        description: company?.description ?? '',
        logo_url: company?.logo_url ?? '',
        city: company?.city ?? '',
        state: company?.state ?? 'SP',
        verified: company?.verified ?? false,
        _exists: Boolean(company),
        _loadError: false,
      })
    }

    loadCompany()

    return () => {
      active = false
    }
  }, [profile])

  if (!form) return <PageLoader />

  const set = (key) => (event) => {
    const value = event.target.value

    setForm((current) => ({
      ...current,
      [key]: value,
    }))
  }

  async function save(event) {
    event.preventDefault()

    if (form._loadError) {
      setMsg({
        tone: 'red',
        text: 'Recarregue a página antes de salvar as alterações.',
      })
      return
    }

    setBusy(true)
    setMsg(null)

    try {
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

      const { error: companyError } = form._exists
        ? await supabase
            .from('companies')
            .update(row)
            .eq('id', profile.id)
        : await supabase.from('companies').insert(row)

      if (companyError) throw companyError

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: form.full_name.trim(),
          phone: form.phone.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id)

      if (profileError) throw profileError

      setForm((current) => ({
        ...current,
        _exists: true,
      }))

      setMsg({
        tone: 'green',
        text: 'Dados da empresa salvos com sucesso.',
      })

      await refreshProfile()
    } catch (error) {
      setMsg({
        tone: 'red',
        text:
          error.code === '23505'
            ? 'Este CNPJ já está cadastrado.'
            : error.message ||
              'Não foi possível salvar os dados da empresa.',
      })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Container className="mx-auto w-full max-w-3xl">
      <PageHeader
        title="Dados da empresa"
        subtitle="Essas informações aparecem nas suas vagas."
      />

      <form onSubmit={save} className="space-y-6">
        {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}

        <Card className="p-5 sm:p-6">
          <div className="mb-6 flex items-center gap-4">
            <CompanyAvatar
              name={form.company_name}
              url={form.logo_url}
              size="size-16"
            />

            <div className="min-w-0">
              <p className="font-bold text-[var(--text-primary)]">
                {form.company_name || 'Sua empresa'}
              </p>

              <p className="text-sm text-[var(--text-secondary)]">
                {form.verified
                  ? 'Empresa verificada'
                  : 'Verificação pendente'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="Nome da empresa"
              className="sm:col-span-2"
            >
              <Input
                required
                value={form.company_name}
                onChange={set('company_name')}
              />
            </Field>

            <Field label="CNPJ">
              <Input
                value={form.cnpj}
                onChange={set('cnpj')}
                placeholder="00.000.000/0000-00"
              />
            </Field>

            <Field label="Setor">
              <Input
                value={form.industry}
                onChange={set('industry')}
                placeholder="Ex.: Tecnologia, Varejo..."
              />
            </Field>

            <Field label="Site">
              <Input
                type="url"
                value={form.website}
                onChange={set('website')}
                placeholder="https://exemplo.com"
              />
            </Field>

            <Field label="URL do logotipo">
              <Input
                type="url"
                value={form.logo_url}
                onChange={set('logo_url')}
                placeholder="https://exemplo.com/logo.png"
              />
            </Field>

            <Field label="Cidade">
              <Input
                value={form.city}
                onChange={set('city')}
              />
            </Field>

            <Field label="UF">
              <Select
                value={form.state}
                onChange={set('state')}
              >
                <option value="">Selecione o estado</option>

                {STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </Select>
            </Field>

            <Field
              label="Sobre a empresa"
              className="sm:col-span-2"
            >
              <Textarea
                value={form.description}
                onChange={set('description')}
              />
            </Field>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <h2 className="mb-5 font-bold text-[var(--text-primary)]">
            Responsável pelo recrutamento
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Nome">
              <Input
                required
                value={form.full_name}
                onChange={set('full_name')}
              />
            </Field>

            <Field label="Telefone">
              <Input
                value={form.phone}
                onChange={set('phone')}
              />
            </Field>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            loading={busy}
            disabled={form._loadError}
          >
            Salvar alterações
          </Button>
        </div>
      </form>
    </Container>
  )
}
