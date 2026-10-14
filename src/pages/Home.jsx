import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { Button } from '../components/ui'

const PRINCIPLES = [
  {
    title: 'Bolsa mínima de R$ 1.000',
    text: 'Toda vaga publicada garante uma bolsa-auxílio que cobre transporte, contas básicas e alimentação.',
  },
  {
    title: 'Sem exigência de nível avançado',
    text: 'Estágio é formação. Vagas que pedem domínio avançado de ferramentas não são aceitas na plataforma.',
  },
  {
    title: 'Um só lugar para procurar',
    text: 'Vagas de diferentes áreas centralizadas em um perfil único — sem recriar currículo em cada site.',
  },
]

const EXAMPLE = [
  { name: 'Banco de Dados', weight: 5, grade: 9.0 },
  { name: 'Estruturas de Dados', weight: 4, grade: 8.0 },
  { name: 'Lógica de Programação', weight: 3, grade: 7.5 },
]

export default function Home() {
  const { profile } = useAuth()
  const panel = profile?.role === 'company' ? '/empresa' : profile?.role === 'candidate' ? '/candidato' : null
  const num = EXAMPLE.reduce((s, e) => s + e.grade * e.weight, 0)
  const den = EXAMPLE.reduce((s, e) => s + e.weight, 0)

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="pointer-events-none absolute -top-40 right-0 size-[36rem] rounded-full bg-indigo-600/30 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-20 md:grid-cols-2 md:py-28">
          <div>
            <span className="inline-flex rounded-full bg-lime-300/10 px-3 py-1 text-xs font-semibold text-lime-300 ring-1 ring-lime-300/30">
              Estágio por desempenho acadêmico
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
              Suas notas mostram do que você é capaz.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-slate-300">
              O Gradematcher conecta estudantes a vagas de estágio usando o histórico acadêmico — não a experiência que você ainda não teve.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {panel ? (
                <Button to={panel} variant="accent" size="lg">Ir para o meu painel</Button>
              ) : (
                <>
                  <Button to="/cadastro?tipo=candidato" variant="accent" size="lg">Sou estudante</Button>
                  <Button to="/cadastro?tipo=empresa" size="lg" className="bg-white/10 hover:bg-white/20">Sou empresa</Button>
                </>
              )}
              <Link to="/vagas" className="self-center px-2 text-sm font-semibold text-slate-300 hover:text-white">
                Ver vagas abertas →
              </Link>
            </div>
          </div>

          {/* Exemplo de matching */}
          <div className="rounded-2xl bg-white p-6 text-slate-800 shadow-2xl ring-1 ring-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Exemplo de vaga</p>
                <p className="font-bold text-slate-900">Estágio em Desenvolvimento Back-end</p>
              </div>
              <span className="rounded-xl bg-emerald-50 px-3 py-2 text-center">
                <span className="block text-2xl font-extrabold text-emerald-700">{(num / den).toFixed(1).replace('.', ',')}</span>
                <span className="block text-[10px] font-semibold uppercase text-emerald-700">score</span>
              </span>
            </div>
            <ul className="mt-5 space-y-3">
              {EXAMPLE.map((e) => (
                <li key={e.name}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium">{e.name} <span className="text-xs text-slate-400">peso {e.weight}</span></span>
                    <span className="font-semibold">{e.grade.toFixed(1).replace('.', ',')}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-indigo-500" style={{ width: `${e.grade * 10}%` }} />
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-5 rounded-lg bg-slate-50 px-3 py-2 font-mono text-xs text-slate-600">
              S = Σ(Nᵢ × Pᵢ) ÷ ΣPᵢ = {num.toFixed(1)} ÷ {den} = {(num / den).toFixed(2)}
            </p>
          </div>
        </div>
      </section>

      {/* Princípios */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">Estágio justo, por princípio</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-500">
          Regras que valem para todas as vagas, pensadas a partir de uma pesquisa com 77 estudantes da Baixada Santista.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PRINCIPLES.map((p, i) => (
            <div key={p.title} className="rounded-2xl border border-slate-200 bg-white p-6">
              <span className="flex size-10 items-center justify-center rounded-xl bg-indigo-600 font-bold text-lime-200">{i + 1}</span>
              <h3 className="mt-4 font-bold text-slate-900">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Para quem */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Para estudantes</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">Cadastre seu histórico, receba vagas compatíveis</h3>
            <ul className="mt-5 space-y-3 text-slate-600">
              <li>✓ Informe disciplinas e notas uma única vez</li>
              <li>✓ Veja um score de compatibilidade para cada vaga — e o porquê dele</li>
              <li>✓ Acompanhe o status de todas as candidaturas em um só lugar</li>
            </ul>
            <Button to="/cadastro?tipo=candidato" className="mt-6">Criar perfil de estudante</Button>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Para empresas</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">Defina as áreas que importam e receba candidatos ranqueados</h3>
            <ul className="mt-5 space-y-3 text-slate-600">
              <li>✓ Atribua pesos de 1 a 5 às áreas de conhecimento da vaga</li>
              <li>✓ Compare candidatos de faculdades diferentes na mesma régua</li>
              <li>✓ Avance, recomende ou dê retorno com um clique</li>
            </ul>
            <Button to="/cadastro?tipo=empresa" variant="secondary" className="mt-6">Publicar uma vaga</Button>
          </div>
        </div>
      </section>
    </>
  )
}
