import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { Alert, Button, Field, Input, PageLoader } from '../components/ui'
import { AuthShell, homeFor } from './Login'
import { RoleToggle } from './Signup'

// Conta autenticada mas sem linha em profiles (ex.: criada fora do site). Completa o cadastro.
export default function Onboarding() {
  const { user, profile, loading, refreshProfile } = useAuth()
  const [role, setRole] = useState('candidate')
  const [fullName, setFullName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/entrar" replace />
  if (profile) return <Navigate to={homeFor(profile)} replace />

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const { error } = await supabase.from('profiles').insert({ id: user.id, role, full_name: fullName.trim() })
    if (!error) {
      if (role === 'candidate') await supabase.from('candidates').insert({ id: user.id })
      else await supabase.from('companies').insert({ id: user.id, company_name: companyName.trim() })
      await refreshProfile()
    } else setError(error.message)
    setBusy(false)
  }

  return (
    <AuthShell title="Complete seu cadastro" subtitle="Conte para nós como você vai usar o Gradematcher.">
      <form onSubmit={submit} className="space-y-4">
        {error && <Alert>{error}</Alert>}
        <RoleToggle role={role} onChange={setRole} />
        <Field label="Seu nome">
          <Input required value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </Field>
        {role === 'company' && (
          <Field label="Nome da empresa">
            <Input required value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          </Field>
        )}
        <Button type="submit" className="w-full" loading={busy}>Continuar</Button>
      </form>
    </AuthShell>
  )
}
