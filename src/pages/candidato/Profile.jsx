import { useEffect, useState } from 'react'
import { supabase, findOrCreateByName } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import { fetchCandidate } from '../../lib/queries'
import { STATES } from '../../lib/format'
import { Container } from '../../components/Layout'
import { Alert, Button, Card, Field, Input, PageHeader, PageLoader, Select, Textarea } from '../../components/ui'

export default function CandidateProfile() {
  const { profile, refreshProfile } = useAuth()
  const [form, setForm] = useState(null)
  const [catalog, setCatalog] = useState({ institutions: [], courses: [] })
  const [msg, setMsg] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    ;(async () => {
      const [{ candidate }, { data: institutions }, { data: courses }] = await Promise.all([
        fetchCandidate(profile.id),
        supabase.from('institutions').select('id, name').order('name'),
        supabase.from('courses').select('id, name').order('name'),
      ])
      setCatalog({ institutions: institutions ?? [], courses: courses ?? [] })
      setForm({
        full_name: profile.full_name ?? '',
        phone: profile.phone ?? '',
        city: profile.city ?? '',
        state: profile.state ?? '',
        institution: candidate?.curricula?.institutions?.name ?? '',
        course: candidate?.curricula?.courses?.name ?? '',
        expected_graduation: candidate?.expected_graduation?.slice(0, 7) ?? '',
        gpa: candidate?.gpa ?? '',
        bio: candidate?.bio ?? '',
        linkedin_url: candidate?.linkedin_url ?? '',
        resume_url: candidate?.resume_url ?? '',
        _exists: !!candidate,
      })
    })()
  }, [profile])

  if (!form) return <PageLoader />
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  async function resolveCurriculum() {
    if (!form.institution.trim() || !form.course.trim()) return null
    const inst = await findOrCreateByName('institutions', form.institution)
    const course = await findOrCreateByName('courses', form.course)
    const { data: existing } = await supabase
      .from('curricula')
      .select('id')
      .eq('institution_id', inst.id)
      .eq('course_id', course.id)
      .limit(1)
      .maybeSingle()
    if (existing) return existing.id
    const { data, error } = await supabase
      .from('curricula')
      .insert({ institution_id: inst.id, course_id: course.id })
      .select('id')
      .single()
    if (error) throw error
    return data.id
  }

  async function save(e) {
    e.preventDefault()
    setBusy(true)
    setMsg(null)
    try {
      const curriculum_id = await resolveCurriculum()
      const { error: pErr } = await supabase
        .from('profiles')
        .update({ full_name: form.full_name.trim(), phone: form.phone || null, city: form.city || null, state: form.state || null, updated_at: new Date().toISOString() })
        .eq('id', profile.id)
      if (pErr) throw pErr
      const row = {
        id: profile.id,
        curriculum_id,
        expected_graduation: form.expected_graduation ? `${form.expected_graduation}-01` : null,
        gpa: form.gpa === '' ? null : Number(form.gpa),
        bio: form.bio || null,
        linkedin_url: form.linkedin_url || null,
        resume_url: form.resume_url || null,
        updated_at: new Date().toISOString(),
      }
      const { error: cErr } = form._exists
        ? await supabase.from('candidates').update(row).eq('id', profile.id)
        : await supabase.from('candidates').insert(row)
      if (cErr) throw cErr
      setForm({ ...form, _exists: true })
      await refreshProfile()
      setMsg({ tone: 'green', text: 'Perfil salvo.' })
    } catch (err) {
      setMsg({ tone: 'red', text: err.message })
    }
    setBusy(false)
  }

  return (
    <Container className="max-w-3xl">
      <PageHeader title="Meu perfil" subtitle="Essas informações ficam visíveis apenas para as empresas às quais você se candidatar." />
      <form onSubmit={save} className="space-y-6">
        {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}

        <Card className="p-6">
          <h2 className="mb-4 font-bold text-slate-900">Dados pessoais</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nome completo" className="sm:col-span-2">
              <Input required value={form.full_name} onChange={set('full_name')} />
            </Field>
            <Field label="Telefone">
              <Input value={form.phone} onChange={set('phone')} placeholder="(13) 90000-0000" />
            </Field>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Cidade" className="col-span-2">
                <Input value={form.city} onChange={set('city')} />
              </Field>
              <Field label="UF">
                <Select value={form.state} onChange={set('state')}>
                  <option value="">—</option>
                  {STATES.map((s) => <option key={s}>{s}</option>)}
                </Select>
              </Field>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-bold text-slate-900">Formação</h2>
          <p className="mb-4 text-sm text-slate-500">Sua faculdade e curso definem a grade de disciplinas do seu histórico.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Faculdade / universidade" hint="Escolha da lista ou digite uma nova.">
              <Input list="institutions" value={form.institution} onChange={set('institution')} />
              <datalist id="institutions">{catalog.institutions.map((i) => <option key={i.id} value={i.name} />)}</datalist>
            </Field>
            <Field label="Curso">
              <Input list="courses" value={form.course} onChange={set('course')} />
              <datalist id="courses">{catalog.courses.map((c) => <option key={c.id} value={c.name} />)}</datalist>
            </Field>
            <Field label="Previsão de conclusão">
              <Input type="month" value={form.expected_graduation} onChange={set('expected_graduation')} />
            </Field>
            <Field label="Coeficiente de rendimento (0–10)" hint="Usado quando a vaga não define áreas de conhecimento.">
              <Input type="number" min="0" max="10" step="0.01" value={form.gpa} onChange={set('gpa')} />
            </Field>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 font-bold text-slate-900">Sobre você</h2>
          <div className="grid gap-4">
            <Field label="Bio" hint="Interesses, projetos pessoais, o que você quer aprender no estágio.">
              <Textarea value={form.bio} onChange={set('bio')} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="LinkedIn">
                <Input type="url" value={form.linkedin_url} onChange={set('linkedin_url')} placeholder="https://linkedin.com/in/…" />
              </Field>
              <Field label="Currículo (link)">
                <Input type="url" value={form.resume_url} onChange={set('resume_url')} placeholder="https://…" />
              </Field>
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" loading={busy}>Salvar perfil</Button>
        </div>
      </form>
    </Container>
  )
}
