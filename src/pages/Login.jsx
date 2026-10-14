import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { Alert, Button, Card, Field, Input } from '../components/ui'

export function AuthShell({ title, subtitle, children }) {
  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-12 md:py-20">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      <Card className="mt-6 p-6">{children}</Card>
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

  if (!loading && user && profile) return <Navigate to={location.state?.from?.pathname ?? homeFor(profile)} replace />

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (error) {
      setError(error.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' :
        error.message === 'Email not confirmed' ? 'Confirme seu e-mail antes de entrar.' : error.message)
      return
    }
    navigate(location.state?.from?.pathname ?? '/bem-vindo', { replace: true })
  }

  return (
    <AuthShell title="Entrar" subtitle="Acesse sua conta de estudante ou empresa.">
      <form onSubmit={submit} className="space-y-4">
        {error && <Alert>{error}</Alert>}
        <Field label="E-mail">
          <Input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Senha">
          <Input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        <Button type="submit" className="w-full" loading={busy}>Entrar</Button>
        <p className="text-center text-sm text-slate-500">
          Ainda não tem conta? <Link to="/cadastro" className="font-semibold text-indigo-600 hover:underline">Criar conta</Link>
        </p>
      </form>
    </AuthShell>
  )
}
