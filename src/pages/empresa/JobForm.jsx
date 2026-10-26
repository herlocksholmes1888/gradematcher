
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase, findOrCreateByName } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import { ADVANCED_TERMS, MIN_STIPEND, MODALITY, STATES } from '../../lib/format'
import { Container } from '../../components/Layout'
import { Alert, Badge, Button, Card, Field, Input, PageHeader, PageLoader, Select, Textarea } from '../../components/ui'
import { SkillDatalist } from '../candidato/Grades'

const EMPTY = {
  title: '', area: '', description: '', requirements: '', benefits: '',
  modality: 'presencial', workload_hours_per_week: '30', stipend: '', min_gpa: '7',
  city: '', state: 'SP', application_deadline: '', status: 'open',
}

function WeightPicker({ value, onChange }) {
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Peso">
      {[1, 2, 3, 4, 5].map((w) => (
        <button key={w} type="button" onClick={() => onChange(w)} aria-checked={value === w} role="radio"
          className={`size-8 rounded-md text-sm font-semibold transition ${w <= value ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
          {w}
        </button>
      ))}
    </div>
  )
}

export default function JobForm() {
  const { id } = useParams()
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(id ? null : EMPTY)
  const [jobSkills, setJobSkills] = useState([{ name: '', weight: 3 }])
  const [courses, setCourses] = useState([])
  const [courseInput, setCourseInput] = useState('')
  const [catalog, setCatalog] = useState({ skills: [], courses: [] })
  const [errors, setErrors] = useState([])
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    ;(async () => {
      const [{ data: skills }, { data: allCourses }, { data: company }] = await Promise.all([
        supabase.from('skills').select('id, name').order('name'),
        supabase.from('courses').select('id, name').order('name'),
        supabase.from('companies').select('city, state').eq('id', profile.id).maybeSingle(),
      ])
      setCatalog({ skills: skills ?? [], courses: allCourses ?? [] })
      if (!company) return navigate('/empresa', { replace: true })
      if (!id) {
        setForm((f) => ({ ...f, city: company?.city ?? '', state: company?.state ?? 'SP' }))
        return
      }
      const { data: job } = await supabase
        .from('jobs')
        .select('*, job_skills(weight, skills(name)), job_courses(courses(name))')
        .eq('id', id)
        .single()
      const asStr = (v) => (v == null ? '' : String(v))
      setForm({
        ...EMPTY,
        ...Object.fromEntries(Object.keys(EMPTY).map((k) => [k, asStr(job[k])])),
      })
      setJobSkills(job.job_skills.length ? job.job_skills.map((s) => ({ name: s.skills.name, weight: s.weight })) : [{ name: '', weight: 3 }])
      setCourses(job.job_courses.map((c) => c.courses.name))
    })()
  }, [id, profile.id, navigate])

  if (!form) return <PageLoader />
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  function validate() {
    const errs = []
    if (Number(form.stipend) < MIN_STIPEND) errs.push(`A bolsa-auxílio deve ser de no mínimo R$ ${MIN_STIPEND.toLocaleString('pt-BR')}.`)
    const wl = Number(form.workload_hours_per_week)
    if (form.workload_hours_per_week && (wl < 1 || wl > 30)) errs.push('A carga horária de estágio deve ficar entre 1 e 30 horas semanais (Lei 11.788/2008).')
    const text = [form.title, form.description, form.requirements].join(' ')
    const hit = text.match(ADVANCED_TERMS)
    if (hit) errs.push(`Encontramos o termo "${hit[0]}". Vagas no GradeMatcher não podem exigir conhecimento avançado — estágio é formação.`)
    const names = jobSkills.map((s) => s.name.trim().toLowerCase()).filter(Boolean)
    if (!names.length) errs.push('Defina pelo menos uma área de conhecimento para o matching.')
    if (new Set(names).size !== names.length) errs.push('Há áreas de conhecimento repetidas.')
    return errs
  }

  async function save(e) {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (errs.length) return window.scrollTo({ top: 0, behavior: 'smooth' })
    setBusy(true)
    try {
      const row = {
        company_id: profile.id,
        title: form.title.trim(),
        area: form.area.trim() || null,
        description: form.description.trim(),
        requirements: form.requirements.trim() || null,
        benefits: form.benefits.trim() || null,
        modality: form.modality,
        workload_hours_per_week: form.workload_hours_per_week ? Number(form.workload_hours_per_week) : null,
        stipend: Number(form.stipend),
        min_gpa: form.min_gpa === '' ? null : Number(form.min_gpa),
        city: form.city.trim() || null,
        state: form.state || null,
        application_deadline: form.application_deadline || null,
        status: form.status,
        updated_at: new Date().toISOString(),
      }
      const { data: job, error } = id
        ? await supabase.from('jobs').update(row).eq('id', id).select('id').single()
        : await supabase.from('jobs').insert(row).select('id').single()
      if (error) throw error

      const skillRows = await Promise.all(
        jobSkills.filter((s) => s.name.trim()).map(async (s) => ({
          job_id: job.id,
          skill_id: (await findOrCreateByName('skills', s.name)).id,
          weight: s.weight,
        })),
      )
      const courseRows = await Promise.all(
        courses.map(async (name) => ({ job_id: job.id, course_id: (await findOrCreateByName('courses', name)).id })),
      )
      await supabase.from('job_skills').delete().eq('job_id', job.id)
      await supabase.from('job_courses').delete().eq('job_id', job.id)
      const r1 = await supabase.from('job_skills').insert(skillRows)
      if (r1.error) throw r1.error
      if (courseRows.length) {
        const r2 = await supabase.from('job_courses').insert(courseRows)
        if (r2.error) throw r2.error
      }
      navigate('/empresa')
    } catch (err) {
      setErrors([err.message])
      setBusy(false)
    }
  }

  async function remove() {
    if (!confirm('Excluir esta vaga? As candidaturas recebidas também deixarão de aparecer.')) return
    const { error } = await supabase.from('jobs').delete().eq('id', id)
    if (error) return setErrors([error.message])
    navigate('/empresa')
  }

  function addCourse() {
    const n = courseInput.trim()
    if (n && !courses.some((c) => c.toLowerCase() === n.toLowerCase())) setCourses([...courses, n])
    setCourseInput('')
  }

  const totalWeight = jobSkills.reduce((s, x) => s + (x.name.trim() ? x.weight : 0), 0)

  return (
    <Container className="max-w-3xl">
      <PageHeader title={id ? 'Editar vaga' : 'Nova vaga de estágio'} subtitle="Vagas com bolsa a partir de R$ 1.000 e sem exigência de nível avançado." />

      <form onSubmit={save} className="space-y-6">
        {errors.length > 0 && (
          <Alert>
            <ul className="list-inside list-disc space-y-1">{errors.map((e) => <li key={e}>{e}</li>)}</ul>
          </Alert>
        )}

        <Card className="p-6">
          <h2 className="mb-4 font-bold text-theme-primary">Sobre a vaga</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Título" className="sm:col-span-2">
              <Input required value={form.title} onChange={set('title')} placeholder="Ex.: Estágio em Análise de Dados" />
            </Field>
            <Field label="Área">
              <Input value={form.area} onChange={set('area')} placeholder="Ex.: Tecnologia, Marketing…" />
            </Field>
            <Field label="Status">
              <Select value={form.status} onChange={set('status')}>
                <option value="open">Aberta (publicada)</option>
                <option value="draft">Rascunho</option>
                <option value="closed">Encerrada</option>
                <option value="filled">Preenchida</option>
              </Select>
            </Field>
            <Field label="Descrição" className="sm:col-span-2">
              <Textarea required rows={5} value={form.description} onChange={set('description')} placeholder="Atividades, time, o que a pessoa vai aprender…" />
            </Field>
            <Field label="O que esperamos (opcional)" className="sm:col-span-2" hint="Prefira interesse e noções básicas a ferramentas específicas.">
              <Textarea rows={3} value={form.requirements} onChange={set('requirements')} />
            </Field>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-bold text-theme-primary">Áreas de conhecimento e pesos</h2>
          <p className="mb-4 text-sm text-slate-500">
            O score de cada candidato é a média das notas nessas áreas, ponderada pelo peso (1 = desejável, 5 = essencial).
          </p>
          <SkillDatalist id="job-skills" skills={catalog.skills} />
          <div className="space-y-3">
            {jobSkills.map((s, i) => (
              <div key={i} className="flex flex-wrap items-center gap-3">
                <Input list="job-skills" className="min-w-48 flex-1" value={s.name} placeholder="Ex.: Estatística"
                  onChange={(e) => setJobSkills(jobSkills.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} />
                <WeightPicker value={s.weight} onChange={(w) => setJobSkills(jobSkills.map((x, j) => (j === i ? { ...x, weight: w } : x)))} />
                <button type="button" className="text-sm text-slate-400 hover:text-red-600" aria-label="Remover área"
                  onClick={() => setJobSkills(jobSkills.length > 1 ? jobSkills.filter((_, j) => j !== i) : [{ name: '', weight: 3 }])}>
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <Button type="button" variant="secondary" size="sm" onClick={() => setJobSkills([...jobSkills, { name: '', weight: 3 }])}>
              + Adicionar área
            </Button>
            <span className="text-xs text-slate-500">Soma dos pesos: {totalWeight}</span>
          </div>
          <div className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
            <Field label="Nota de referência (0–10)" hint="Candidatos com score igual ou maior são destacados como recomendados.">
              <Input type="number" min="0" max="10" step="0.1" value={form.min_gpa} onChange={set('min_gpa')} />
            </Field>
            <div>
              <Field label="Cursos elegíveis (opcional)">
                <div className="flex gap-2">
                  <Input list="all-courses" value={courseInput} onChange={(e) => setCourseInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCourse() } }} placeholder="Ex.: Ciência da Computação" />
                  <Button type="button" variant="secondary" onClick={addCourse}>Incluir</Button>
                </div>
              </Field>
              <datalist id="all-courses">{catalog.courses.map((c) => <option key={c.id} value={c.name} />)}</datalist>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {courses.map((c) => (
                  <Badge key={c} tone="indigo">
                    {c}
                    <button type="button" onClick={() => setCourses(courses.filter((x) => x !== c))} className="ml-0.5 hover:text-red-600" aria-label={`Remover ${c}`}>×</button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 font-bold text-theme-primary">Condições</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Bolsa-auxílio (R$/mês)" hint={`Mínimo de R$ ${MIN_STIPEND.toLocaleString('pt-BR')}.`}>
              <Input required type="number" min={MIN_STIPEND} step="50" value={form.stipend} onChange={set('stipend')} />
            </Field>
            <Field label="Horas por semana" hint="Até 30h (Lei do Estágio).">
              <Input type="number" min="1" max="30" value={form.workload_hours_per_week} onChange={set('workload_hours_per_week')} />
            </Field>
            <Field label="Modalidade">
              <Select value={form.modality} onChange={set('modality')}>
                {Object.entries(MODALITY).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </Select>
            </Field>
            <Field label="Cidade">
              <Input value={form.city} onChange={set('city')} />
            </Field>
            <Field label="UF">
              <Select value={form.state} onChange={set('state')}>
                <option value="">—</option>
                {STATES.map((s) => <option key={s}>{s}</option>)}
              </Select>
            </Field>
            <Field label="Inscrições até">
              <Input type="date" value={form.application_deadline} onChange={set('application_deadline')} />
            </Field>
            <Field label="Benefícios" className="sm:col-span-3">
              <Textarea rows={2} value={form.benefits} onChange={set('benefits')} placeholder="Vale-transporte, vale-refeição, auxílio home office…" />
            </Field>
          </div>
        </Card>

        <div className="flex flex-wrap justify-between gap-3">
          {id ? <Button type="button" variant="danger" onClick={remove}>Excluir vaga</Button> : <span />}
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={() => navigate('/empresa')}>Cancelar</Button>
            <Button type="submit" loading={busy}>{id ? 'Salvar alterações' : form.status === 'open' ? 'Publicar vaga' : 'Salvar'}</Button>
          </div>
        </div>
      </form>
    </Container>
  )
}
