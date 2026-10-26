
import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import ThemeToggle from './ThemeToggle'
import logo from '../imgs/favicon_io_S/apple-touch-icon.png'

export function Logo({ light = false }) {
  return (
    <Link
      to="/"
      className="flex shrink-0 items-center gap-2"
      aria-label="GradeMatcher - Página inicial"
    >
      <img
        src={logo}
        alt="GradeMatcher"
        className="size-10 shrink-0 object-contain"
      />

      <span
        className={`text-lg font-extrabold tracking-tight ${
          light ? 'text-white' : 'text-[var(--text-primary)]'
        }`}
      >
        Grade
        <span className="text-[var(--primary-color)]">matcher</span>
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
      isActive
        ? 'bg-[var(--surface-hover)] text-[var(--primary-color)]'
        : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]'
    }`

  async function handleSignOut() {
    await signOut()
    setOpen(false)
    navigate('/')
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--page-bg)] text-[var(--text-primary)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border-color)] bg-[var(--surface-bg)] backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-3 px-4">
          <Logo />

          <nav className="hidden items-center gap-1 md:flex">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={linkCls}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Ações para computador */}
          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />

            {user ? (
              <>
                <span className="max-w-40 truncate text-sm text-[var(--text-secondary)]">
                  {profile?.full_name ?? user.email}
                </span>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/entrar"
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-hover)]"
                >
                  Entrar
                </Link>

                <Link
                  to="/cadastro"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                >
                  Criar conta
                </Link>
              </>
            )}
          </div>

          {/* Ações para celular */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />

            <button
              type="button"
              className="rounded-lg p-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
              onClick={() => setOpen(!open)}
              aria-label={open ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={open}
            >
              <svg
                viewBox="0 0 24 24"
                className="size-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                {open ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Menu móvel */}
        {open && (
          <nav
            className="border-t border-[var(--border-color)] bg-[var(--surface-bg)] px-4 py-3 md:hidden"
            onClick={() => setOpen(false)}
          >
            <div className="flex flex-col gap-1">
              {items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={linkCls}
                >
                  {item.label}
                </NavLink>
              ))}

              {user ? (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="rounded-lg px-3 py-2 text-left text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                >
                  Sair
                </button>
              ) : (
                <>
                  <NavLink to="/entrar" className={linkCls}>
                    Entrar
                  </NavLink>

                  <NavLink to="/cadastro" className={linkCls}>
                    Criar conta
                  </NavLink>
                </>
              )}
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1 bg-[var(--page-bg)] text-[var(--text-primary)]">
        <Outlet />
      </main>

      <footer className="border-t border-[var(--border-color)] bg-[var(--surface-bg)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-[var(--text-secondary)] sm:flex-row sm:justify-between">
          <span>
            GradeMatcher — central de busca de estágio por desempenho acadêmico
          </span>

          <span>
            TCC · Ciência da Computação · UNIP Santos · 2026
          </span>
        </div>
      </footer>
    </div>
  )
}

export function Container({ children, className = '' }) {
  return (
    <div
      className={`mx-auto max-w-6xl px-4 py-8 text-[var(--text-primary)] ${className}`}
    >
      {children}
    </div>
  )
}
