import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'

export function Logo({ light = false }) {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-600">
        <svg viewBox="0 0 32 32" className="size-5" aria-hidden>
          <path d="M8 17l5 5 11-12" stroke="#d9f99d" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className={`text-lg font-extrabold tracking-tight ${light ? 'text-white' : 'text-slate-900'}`}>
        Grade<span className="text-indigo-600">matcher</span>
      </span>
    </Link>
  )
}

const NAV = {
  candidate: [
    { to: '/candidato', label: 'Recomendadas', end: true },
    { to: '/vagas', label: 'Todas as vagas' },
    { to: '/candidato/candidaturas', label: 'Candidaturas' },
    { to: '/candidato/historico', label: 'Histórico' },
    { to: '/candidato/perfil', label: 'Perfil' },
  ],
  company: [
    { to: '/empresa', label: 'Painel', end: true },
    { to: '/empresa/vagas/nova', label: 'Nova vaga' },
    { to: '/empresa/perfil', label: 'Empresa' },
  ],
  guest: [{ to: '/vagas', label: 'Vagas' }],
}

export default function Layout() {
  const { profile, signOut, user } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const items = NAV[profile?.role ?? 'guest']

  const linkCls = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            {items.map((i) => (
              <NavLink key={i.to} to={i.to} end={i.end} className={linkCls}>{i.label}</NavLink>
            ))}
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <>
                <span className="max-w-40 truncate text-sm text-slate-500">{profile?.full_name ?? user.email}</span>
                <button onClick={handleSignOut} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link to="/entrar" className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Entrar</Link>
                <Link to="/cadastro" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Criar conta</Link>
              </>
            )}
          </div>
          <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
        {open && (
          <nav className="border-t border-slate-200 px-4 py-3 md:hidden" onClick={() => setOpen(false)}>
            <div className="flex flex-col gap-1">
              {items.map((i) => (
                <NavLink key={i.to} to={i.to} end={i.end} className={linkCls}>{i.label}</NavLink>
              ))}
              {user ? (
                <button onClick={handleSignOut} className="rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-600 hover:bg-slate-100">Sair</button>
              ) : (
                <>
                  <NavLink to="/entrar" className={linkCls}>Entrar</NavLink>
                  <NavLink to="/cadastro" className={linkCls}>Criar conta</NavLink>
                </>
              )}
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:justify-between">
          <span>Gradematcher — central de busca de estágio por desempenho acadêmico</span>
          <span>TCC · Ciência da Computação · UNIP Santos · 2026</span>
        </div>
      </footer>
    </div>
  )
}

export function Container({ children, className = '' }) {
  return <div className={`mx-auto max-w-6xl px-4 py-8 ${className}`}>{children}</div>
}
