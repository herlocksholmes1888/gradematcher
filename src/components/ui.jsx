import { Link } from 'react-router-dom'
import { nota } from '../lib/format'

const cx = (...c) => c.filter(Boolean).join(' ')

const BUTTON = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm',
  secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 shadow-xs',
  ghost: 'text-slate-600 hover:bg-slate-100',
  danger: 'bg-white text-red-600 border border-red-200 hover:bg-red-50',
  accent: 'bg-lime-300 text-slate-900 hover:bg-lime-200 shadow-sm',
}

export function Button({ variant = 'primary', size = 'md', to, className, loading, children, ...props }) {
  const cls = cx(
    'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none',
    size === 'sm' ? 'px-3 py-1.5 text-sm' : size === 'lg' ? 'px-5 py-3 text-base' : 'px-4 py-2 text-sm',
    BUTTON[variant],
    className,
  )
  if (to) return <Link to={to} className={cls} {...props}>{children}</Link>
  return (
    <button className={cls} disabled={loading || props.disabled} {...props}>
      {loading && <Spinner className="size-4" />}
      {children}
    </button>
  )
}

export function Spinner({ className = 'size-6' }) {
  return (
    <svg className={cx('animate-spin text-current', className)} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity=".25" strokeWidth="4" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

export function PageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-indigo-600">
      <Spinner className="size-8" />
    </div>
  )
}

export function Field({ label, hint, error, children, className }) {
  return (
    <label className={cx('block', className)}>
      {label && <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>}
      {children}
      {error ? (
        <span className="mt-1 block text-xs text-red-600">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-xs text-slate-500">{hint}</span>
      ) : null}
    </label>
  )
}

export const Input = (p) => <input {...p} className={cx('input', p.className)} />
export const Textarea = (p) => <textarea rows={4} {...p} className={cx('input', p.className)} />
export const Select = ({ children, ...p }) => (
  <select {...p} className={cx('input pr-8', p.className)}>{children}</select>
)

export function Card({ className, children, ...p }) {
  return (
    <div className={cx('rounded-2xl border border-slate-200 bg-white shadow-xs', className)} {...p}>
      {children}
    </div>
  )
}

const TONES = {
  slate: 'bg-slate-100 text-slate-700',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  red: 'bg-red-50 text-red-700 ring-red-600/20',
  amber: 'bg-amber-50 text-amber-800 ring-amber-600/20',
  indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
  lime: 'bg-lime-100 text-lime-800 ring-lime-600/20',
}

export function Badge({ tone = 'slate', children, className }) {
  return (
    <span className={cx('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ring-transparent', TONES[tone], className)}>
      {children}
    </span>
  )
}

export function Alert({ tone = 'red', children }) {
  const t = {
    red: 'border-red-200 bg-red-50 text-red-800',
    amber: 'border-amber-200 bg-amber-50 text-amber-900',
    green: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    indigo: 'border-indigo-200 bg-indigo-50 text-indigo-900',
  }[tone]
  return <div className={cx('rounded-lg border px-4 py-3 text-sm', t)}>{children}</div>
}

export function EmptyState({ title, children, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <p className="font-semibold text-slate-900">{title}</p>
      {children && <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">{children}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

export function scoreTone(score, threshold = 7) {
  if (score == null) return 'slate'
  if (score >= threshold) return 'green'
  if (score >= threshold - 2) return 'amber'
  return 'red'
}

// Anel com o score de compatibilidade (0–10).
export function ScoreRing({ score, threshold = 7, size = 56 }) {
  const pct = score == null ? 0 : Math.max(0, Math.min(1, score / 10))
  const r = 22
  const c = 2 * Math.PI * r
  const color = { green: '#059669', amber: '#d97706', red: '#dc2626', slate: '#94a3b8' }[scoreTone(score, threshold)]
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} title="Score de compatibilidade (0–10)">
      <svg viewBox="0 0 50 50" className="size-full -rotate-90">
        <circle cx="25" cy="25" r={r} fill="none" stroke="#e2e8f0" strokeWidth="5" />
        <circle cx="25" cy="25" r={r} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - pct)} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-900">
        {score == null ? '—' : nota(score)}
      </span>
    </div>
  )
}

// Barra com a contribuição de cada área de conhecimento no score (transparência – LGPD, TCC 2.4.3).
export function MatchBreakdown({ breakdown }) {
  if (!breakdown?.length) return null
  return (
    <ul className="space-y-2.5">
      {breakdown.map((b) => (
        <li key={b.skillId}>
          <div className="mb-1 flex items-center justify-between gap-2 text-sm">
            <span className="font-medium text-slate-700">
              {b.name} <span className="text-xs font-normal text-slate-400">peso {b.weight}</span>
            </span>
            <span className={cx('font-semibold', b.grade == null ? 'text-slate-400' : 'text-slate-900')}>
              {b.grade == null ? 'sem nota' : nota(b.grade)}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-indigo-500" style={{ width: `${((b.grade ?? 0) / 10) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  )
}

export function Stat({ label, value, hint }) {
  return (
    <Card className="p-5">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </Card>
  )
}
