import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { supabase } from './supabase'

const AuthContext = createContext(null)

// Garante que o usuário autenticado tenha linha em profiles (+ candidates).
// Os dados vêm do user_metadata gravado no cadastro, já que o banco não tem trigger para isso.
async function ensureProfile(user) {
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
  if (profile) return profile

  const meta = user.user_metadata ?? {}
  if (!meta.role || !meta.full_name) return null

  const { data: created, error } = await supabase
    .from('profiles')
    .insert({ id: user.id, role: meta.role, full_name: meta.full_name })
    .select()
    .single()
  if (error) throw error

  if (meta.role === 'candidate') {
    await supabase.from('candidates').insert({ id: user.id })
  } else if (meta.role === 'company' && meta.company_name) {
    await supabase.from('companies').insert({ id: user.id, company_name: meta.company_name })
  }
  return created
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadedFor = useRef(null)

  const loadProfile = useCallback(async (sess, { force = false } = {}) => {
    if (!sess?.user) {
      loadedFor.current = null
      setProfile(null)
      return
    }
    // Eventos SIGNED_IN repetidos (ex.: ao voltar para a aba) não devem recarregar a tela.
    if (!force && loadedFor.current === sess.user.id) return
    const first = loadedFor.current !== sess.user.id
    if (first) setLoading(true)
    try {
      setProfile(await ensureProfile(sess.user))
      loadedFor.current = sess.user.id
    } catch (e) {
      console.error(e)
      setProfile(null)
    } finally {
      if (first) setLoading(false)
    }
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session)
      await loadProfile(data.session)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((event, sess) => {
      setSession(sess)
      if (event === 'SIGNED_IN' && sess?.user.id !== loadedFor.current) setLoading(true)
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        // adiado para fora do callback, como recomenda o supabase-js
        setTimeout(() => loadProfile(sess), 0)
      }
    })
    return () => sub.subscription.unsubscribe()
  }, [loadProfile])

  const value = {
    session,
    user: session?.user ?? null,
    profile,
    loading,
    refreshProfile: () => loadProfile(session, { force: true }),
    signOut: () => supabase.auth.signOut(),
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
