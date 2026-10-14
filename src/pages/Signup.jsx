import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Alert, Button, Field, Input } from '../components/ui'
import { AuthShell } from './Login'

export function RoleToggle({ role, onChange }) {
  const opt = (value, title, text) => (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`rounded-xl border p-3 text-left transition ${
        role === value ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500/20' : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <span className="block text-sm font-semibold text-slate-900">{title}</span>
      <span className="block text-xs text-slate-500">{text}</span>
    </button>
  )
  return (
    <div className="grid grid-cols-2 gap-3">
      {opt('candidate', 'Sou estudante', 'Quero encontrar estágio')}
      {opt('company', 'Sou empresa', 'Quero contratar estagiários')}
    </div>
  )
}

export default function Signup() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [role, setRole] = useState(params.get('tipo') === 'empresa' ? 'company' : 'candidate')
  const [form, setForm] = useState({ full_name: '', company_name: '', email: '', password: '' })
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  async function submit(e) {
    e.preventDefault()
    if (!consent) return setError('É preciso aceitar os termos de uso para continuar.')
    setBusy(true)
    setError('')
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          role,
          full_name: form.full_name.trim(),
          ...(role === 'company' && { company_name: form.company_name.trim() }),
        },
      },
    })
    setBusy(false)
    if (error) return setError(error.message.includes('already registered') ? 'Este e-mail já está cadastrado.' : error.message)
    if (data.session) navigate(role === 'company' ? '/empresa' : '/candidato/perfil')
    else setDone(true)
  }

  if (done) {
    return (
      <AuthShell title="Confirme seu e-mail">
        <p className="text-sm text-slate-600">
          Enviamos um link de confirmação para <strong>{form.email}</strong>. Depois de confirmar, é só{' '}
          <Link to="/entrar" className="font-semibold text-indigo-600 hover:underline">entrar</Link>.
        </p>
      </AuthShell>
    )
  }

  return (
    <AuthShell title="Criar conta" subtitle="Leva menos de um minuto.">
      <form onSubmit={submit} className="space-y-4">
        {error && <Alert>{error}</Alert>}
        <RoleToggle role={role} onChange={setRole} />
        <Field label={role === 'company' ? 'Seu nome (recrutador)' : 'Nome completo'}>
          <Input required value={form.full_name} onChange={set('full_name')} autoComplete="name" />
        </Field>
        {role === 'company' && (
          <Field label="Nome da empresa">
            <Input required value={form.company_name} onChange={set('company_name')} autoComplete="organization" />
          </Field>
        )}
        <Field label="E-mail">
          <Input type="email" required value={form.email} onChange={set('email')} autoComplete="email" />
        </Field>
        <Field label="Senha" hint="Mínimo de 6 caracteres.">
          <Input type="password" required minLength={6} value={form.password} onChange={set('password')} autoComplete="new-password" />
        </Field>
        <label className="flex items-start gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 size-4 rounded border-slate-300 accent-indigo-600" />
          <span>
            Li e aceito os termos de uso e autorizo o tratamento dos meus dados
            {role === 'candidate' ? ' acadêmicos' : ''} para fins de recomendação, conforme a LGPD.
          </span>
        </label>
        <Button type="submit" className="w-full" loading={busy}>Criar conta</Button>
        <p className="text-center text-sm text-slate-500">
          Já tem conta? <Link to="/entrar" className="font-semibold text-indigo-600 hover:underline">Entrar</Link>
        </p>
      </form>
    </AuthShell>
  )
}
