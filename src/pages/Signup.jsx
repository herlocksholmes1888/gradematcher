import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Alert, Button, Field, Input } from '../components/ui'
import { AuthShell } from './Login'

export function RoleToggle({ role, onChange }) {
  const opt = (value, title, text) => {
    const selected = role === value

    return (
      <button
        key={value}
        type="button"
        onClick={() => onChange(value)}
        aria-pressed={selected}
        className={[
          'rounded-xl border p-3 text-left transition-colors',
          'focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-[var(--focus-ring)]',
          selected
            ? 'border-[var(--primary-color)] bg-[var(--surface-secondary)] ring-2 ring-[var(--focus-ring)]'
            : 'border-[var(--border-color)] bg-[var(--surface-bg)] hover:bg-[var(--surface-hover)]',
        ].join(' ')}
      >
        <span className="block text-sm font-semibold text-[var(--text-primary)]">
          {title}
        </span>

        <span className="mt-1 block text-xs text-[var(--text-secondary)]">
          {text}
        </span>
      </button>
    )
  }

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

  const [role, setRole] = useState(
    params.get('tipo') === 'empresa' ? 'company' : 'candidate',
  )

  const [form, setForm] = useState({
    full_name: '',
    company_name: '',
    email: '',
    password: '',
  })

  const [consent, setConsent] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)

  const set = (key) => (e) => {
    setForm((previous) => ({
      ...previous,
      [key]: e.target.value,
    }))
  }

  async function submit(e) {
    e.preventDefault()

    if (!consent) {
      setError('É preciso aceitar os termos de uso para continuar.')
      return
    }

    setBusy(true)
    setError('')

    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: {
          data: {
            role,
            full_name: form.full_name.trim(),
            ...(role === 'company' && {
              company_name: form.company_name.trim(),
            }),
          },
        },
      })

      if (signupError) {
        setError(
          signupError.message.toLowerCase().includes('already registered')
            ? 'Este e-mail já está cadastrado.'
            : signupError.message,
        )
        return
      }

      if (data.session) {
        navigate(role === 'company' ? '/empresa' : '/candidato/perfil')
      } else {
        setDone(true)
      }
    } catch {
      setError('Não foi possível criar sua conta. Tente novamente.')
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    return (
      <AuthShell title="Confirme seu e-mail">
        <div className="space-y-4 text-sm text-[var(--text-secondary)]">
          <p>
            Enviamos um link de confirmação para{' '}
            <strong className="break-all text-[var(--text-primary)]">
              {form.email}
            </strong>
            .
          </p>

          <p>
            Depois de confirmar seu endereço, você poderá{' '}
            <Link
              to="/entrar"
              className="font-semibold text-[var(--primary-color)] hover:underline"
            >
              entrar na sua conta
            </Link>
            .
          </p>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Criar conta"
      subtitle="Leva menos de um minuto."
    >
      <form onSubmit={submit} className="space-y-4">
        {error && <Alert>{error}</Alert>}

        <RoleToggle role={role} onChange={setRole} />

        <Field
          label={
            role === 'company'
              ? 'Seu nome (recrutador)'
              : 'Nome completo'
          }
        >
          <Input
            required
            value={form.full_name}
            onChange={set('full_name')}
            autoComplete="name"
          />
        </Field>

        {role === 'company' && (
          <Field label="Nome da empresa">
            <Input
              required
              value={form.company_name}
              onChange={set('company_name')}
              autoComplete="organization"
            />
          </Field>
        )}

        <Field label="E-mail">
          <Input
            type="email"
            required
            value={form.email}
            onChange={set('email')}
            autoComplete="email"
          />
        </Field>

        <Field label="Senha" hint="Mínimo de 6 caracteres.">
          <Input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={set('password')}
            autoComplete="new-password"
          />
        </Field>

        <label className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 size-4 shrink-0 rounded accent-indigo-600"
          />

          <span>
            Li e aceito os termos de uso e autorizo o tratamento dos meus dados
            {role === 'candidate' ? ' acadêmicos' : ''} para fins de
            recomendação, conforme a LGPD.
          </span>
        </label>

        <Button
          type="submit"
          className="w-full"
          loading={busy}
          disabled={busy}
        >
          Criar conta
        </Button>

        <p className="text-center text-sm text-[var(--text-secondary)]">
          Já tem conta?{' '}
          <Link
            to="/entrar"
            className="font-semibold text-[var(--primary-color)] hover:underline"
          >
            Entrar
          </Link>
        </p>
      </form>
    </AuthShell>
  )
}