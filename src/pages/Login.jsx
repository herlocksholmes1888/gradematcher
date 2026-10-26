
import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { Alert, Button, Card, Field, Input } from '../components/ui'
import ThemeToggle from '../components/ThemeToggle.jsx'

export function AuthShell({ title, subtitle, children }) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col px-4 py-12 md:py-20">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {subtitle}
            </p>
          )}
        </div>

        <ThemeToggle />
      </div>

      <Card className="p-5 sm:p-6">
        {children}
      </Card>
    </div>
  )
}

export function homeFor(profile) {
  if (!profile) return '/bem-vindo'

  return profile.role === 'company' ? '/empresa' : '/candidato'
}

export default function Login() {
  const { user, profile, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (!loading && user && profile) {
    return (
      <Navigate
        to={location.state?.from?.pathname ?? homeFor(profile)}
        replace
      />
    )
  }

  async function submit(event) {
    event.preventDefault()

    setBusy(true)
    setError('')

    try {
      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })

      if (loginError) {
        setError(
          loginError.message === 'Invalid login credentials'
            ? 'E-mail ou senha incorretos.'
            : loginError.message === 'Email not confirmed'
              ? 'Confirme seu e-mail antes de entrar.'
              : loginError.message
        )

        return
      }

      navigate(
        location.state?.from?.pathname ?? '/bem-vindo',
        { replace: true }
      )
    } catch {
      setError('Não foi possível entrar. Tente novamente.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthShell
      title="Entrar"
      subtitle="Acesse sua conta de estudante ou empresa."
    >
      <form onSubmit={submit} className="space-y-5">
        {error && <Alert>{error}</Alert>}

        <Field label="E-mail">
          <Input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="seu@email.com"
          />
        </Field>

        <Field label="Senha">
          <Input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Digite sua senha"
          />
        </Field>

        <Button
          type="submit"
          className="w-full"
          loading={busy}
          disabled={busy}
        >
          Entrar
        </Button>

        <p className="text-center text-sm text-[var(--text-secondary)]">
          Ainda não tem conta?{' '}
          <Link
            to="/cadastro"
            className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Criar conta
          </Link>
        </p>
      </form>
    </AuthShell>
  )
}
