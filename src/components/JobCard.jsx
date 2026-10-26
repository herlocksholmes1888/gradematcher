
import { Link } from 'react-router-dom'
import { Badge, Card, ScoreRing } from './ui'
import { MODALITY, brl, place } from '../lib/format'

export function CompanyAvatar({ name, url, size = 'size-11' }) {
  if (url) return <img src={url} alt="" className={`${size} shrink-0 rounded-xl object-cover ring-1 ring-slate-200`} />
  const initials = (name ?? '?').split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
  return (
    <span className={`${size} flex shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-sm font-bold text-indigo-700`}>
      {initials}
    </span>
  )
}

export default function JobCard({ job, match, applied }) {
  const company = job.companies
  const threshold = job.min_gpa != null ? Number(job.min_gpa) : 7
  return (
    <Link to={`/vagas/${job.id}`} className="group block">
      <Card className="flex h-full flex-col p-5 transition hover:border-indigo-300 hover:shadow-md">
        <div className="flex items-start gap-3">
          <CompanyAvatar name={company?.company_name} url={company?.logo_url} />
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-theme-primary group-hover:text-indigo-700">{job.title}</h3>
            <p className="truncate text-sm text-slate-500">{company?.company_name ?? 'Empresa'}</p>
          </div>
          {match && <ScoreRing score={match.score} threshold={threshold} size={52} />}
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          <Badge tone="indigo">{MODALITY[job.modality]}</Badge>
          {job.area && <Badge>{job.area}</Badge>}
          {job.workload_hours_per_week && <Badge>{job.workload_hours_per_week}h/sem</Badge>}
          {applied && <Badge tone="green">Candidatura enviada</Badge>}
        </div>

        {job.job_skills?.length > 0 && (
          <p className="mt-3 line-clamp-1 text-xs text-slate-500">
            Áreas: {job.job_skills.map((s) => s.skills?.name).filter(Boolean).join(' · ')}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <div>
            <p className="text-xs text-slate-500">Bolsa-auxílio</p>
            <p className="font-bold text-theme-primary">
              {brl(job.stipend)}
              <span className="text-xs font-normal text-slate-500">/mês</span>
            </p>
          </div>
          <p className="text-right text-xs text-slate-500">{place(job.city, job.state)}</p>
        </div>
      </Card>
    </Link>
  )
}
