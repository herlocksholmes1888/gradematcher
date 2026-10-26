
import { Link } from 'react-router-dom'
import { nota } from '../lib/format'

const cx = (...c) => c.filter(Boolean).join(' ')

const BUTTON = {
  primary:
    'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700',
  secondary:
    'border border-[var(--input-border)] bg-[var(--surface-bg)] text-[var(--text-primary)] shadow-xs hover:bg-[var(--surface-hover)]',
  ghost:
    'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]',
  danger:
    'border border-[var(--danger-color)]/40 bg-[var(--surface-bg)] text-[var(--danger-color)] hover:bg-[var(--surface-hover)]',
  accent:
    'bg-lime-300 text-theme-primary shadow-sm hover:bg-lime-200',
}

export function Button({
  variant = 'primary',
  size = 'md',
  to,
  className,
  loading,
  children,
  ...props
}) {
  const cls = cx(
    'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50',
    size === 'sm'
      ? 'px-3 py-1.5 text-sm'
      : size === 'lg'
        ? 'px-5 py-3 text-base'
        : 'px-4 py-2 text-sm',
    BUTTON[variant] ?? BUTTON.primary,
    className,
  )

  if (to) {
    return (
      <Link to={to} className={cls} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <button
      className={cls}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Spinner className="size-4" />}
      {children}
    </button>
  )
}

export function Spinner({ className = 'size-6' }) {
  return (
    <svg
      className={cx('animate-spin text-current', className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeOpacity=".25"
        strokeWidth="4"
      />
      <path
        d="M22 12a10 10 0 0 0-10-10"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function PageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-[var(--primary-color)]">
      <Spinner className="size-8" />
    </div>
  )
}

export function Field({ label, hint, error, children, className }) {
  return (
    <label className={cx('block', className)}>
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
          {label}
        </span>
      )}

      {children}

      {error ? (
        <span className="mt-1 block text-xs text-[var(--danger-color)]">
          {error}
        </span>
      ) : hint ? (
        <span className="mt-1 block text-xs text-[var(--text-muted)]">
          {hint}
        </span>
      ) : null}
    </label>
  )
}

export const Input = (p) => (
  <input {...p} className={cx('input', p.className)} />
)

export const Textarea = (p) => (
  <textarea rows={4} {...p} className={cx('input', p.className)} />
)

export const Select = ({ children, ...p }) => (
  <select {...p} className={cx('input pr-8', p.className)}>
    {children}
  </select>
)

export function Card({ className, children, ...p }) {
  return (
    <div
      className={cx(
        'rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] text-[var(--text-primary)] shadow-xs',
        className,
      )}
      {...p}
    >
      {children}
    </div>
  )
}

const TONES = {
  slate:
    'bg-[var(--surface-secondary)] text-[var(--text-secondary)]',
  green:
    'bg-emerald-100 text-emerald-800 ring-emerald-600/20 dark:bg-emerald-950 dark:text-emerald-300',
  red:
    'bg-red-100 text-red-800 ring-red-600/20 dark:bg-red-950 dark:text-red-300',
  amber:
    'bg-amber-100 text-amber-900 ring-amber-600/20 dark:bg-amber-950 dark:text-amber-300',
  indigo:
    'bg-indigo-100 text-indigo-800 ring-indigo-600/20 dark:bg-indigo-950 dark:text-indigo-300',
  lime:
    'bg-lime-100 text-lime-900 ring-lime-600/20 dark:bg-lime-950 dark:text-lime-300',
}

export function Badge({ tone = 'slate', children, className }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ring-transparent',
        TONES[tone] ?? TONES.slate,
        className,
      )}
    >
      {children}
    </span>
  )
}

export function Alert({ tone = 'red', children }) {
  const tones = {
    red: 'border-red-300 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-200',
    amber:
      'border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200',
    green:
      'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
    indigo:
      'border-indigo-300 bg-indigo-50 text-indigo-950 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-200',
  }

  return (
    <div
      className={cx(
        'rounded-lg border px-4 py-3 text-sm',
        tones[tone] ?? tones.red,
      )}
    >
      {children}
    </div>
  )
}

export function EmptyState({ title, children, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--surface-bg)] px-6 py-12 text-center">
      <p className="font-semibold text-[var(--text-primary)]">{title}</p>

      {children && (
        <p className="mx-auto mt-1 max-w-md text-sm text-[var(--text-secondary)]">
          {children}
        </p>
      )}

      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {subtitle}
          </p>
        )}
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

export function ScoreRing({ score, threshold = 7, size = 56 }) {
  const pct = score == null ? 0 : Math.max(0, Math.min(1, score / 10))
  const r = 22
  const c = 2 * Math.PI * r

  const colors = {
    green: 'var(--success-color)',
    amber: '#d97706',
    red: 'var(--danger-color)',
    slate: 'var(--text-muted)',
  }

  const color = colors[scoreTone(score, threshold)]

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      title="Score de compatibilidade (0–10)"
    >
      <svg viewBox="0 0 50 50" className="size-full -rotate-90">
        <circle
          cx="25"
          cy="25"
          r={r}
          fill="none"
          stroke="var(--border-color)"
          strokeWidth="5"
        />

        <circle
          cx="25"
          cy="25"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
        />
      </svg>

      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[var(--text-primary)]">
        {score == null ? '—' : nota(score)}
      </span>
    </div>
  )
}

export function MatchBreakdown({ breakdown }) {
  if (!breakdown?.length) return null

  return (
    <ul className="space-y-2.5">
      {breakdown.map((b) => (
        <li key={b.skillId}>
          <div className="mb-1 flex items-center justify-between gap-2 text-sm">
            <span className="font-medium text-[var(--text-primary)]">
              {b.name}{' '}
              <span className="text-xs font-normal text-[var(--text-muted)]">
                peso {b.weight}
              </span>
            </span>

            <span
              className={cx(
                'font-semibold',
                b.grade == null
                  ? 'text-[var(--text-muted)]'
                  : 'text-[var(--text-primary)]',
              )}
            >
              {b.grade == null ? 'sem nota' : nota(b.grade)}
            </span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-[var(--surface-secondary)]">
            <div
              className="h-full rounded-full bg-[var(--primary-color)]"
              style={{ width: `${((b.grade ?? 0) / 10) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

export function Stat({ label, value, hint }) {
  return (
    <Card className="p-5">
      <p className="text-sm font-medium text-[var(--text-secondary)]">
        {label}
      </p>

      <p className="mt-1 text-3xl font-bold tracking-tight text-[var(--text-primary)]">
        {value}
      </p>

      {hint && (
        <p className="mt-1 text-xs text-[var(--text-muted)]">{hint}</p>
      )}
    </Card>
  )
}
