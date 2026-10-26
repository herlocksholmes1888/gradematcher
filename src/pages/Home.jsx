
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

  const panel =
    profile?.role === 'company'
      ? '/empresa'
      : profile?.role === 'candidate'
        ? '/candidato'
        : null

  const num = EXAMPLE.reduce((s, e) => s + e.grade * e.weight, 0)
  const den = EXAMPLE.reduce((s, e) => s + e.weight, 0)
  const score = (num / den).toFixed(2).replace('.', ',')

  return (
    <>
      {/* Hero: mantém o visual escuro original */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="pointer-events-none absolute -top-40 right-0 size-[36rem] rounded-full bg-indigo-600/30 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-20 md:grid-cols-2 md:items-center md:py-28">
          <div>
            <span className="inline-flex rounded-full bg-lime-300/10 px-3 py-1 text-xs font-semibold text-lime-300 ring-1 ring-lime-300/30">
              Estágio por desempenho acadêmico
            </span>

            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
              Suas notas mostram do que você é capaz.
            </h1>

            <p className="mt-5 max-w-lg text-lg text-slate-300">
              O GradeMatcher conecta estudantes a vagas de estágio usando o
              histórico acadêmico — não a experiência que você ainda não teve.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {panel ? (
                <Button to={panel} variant="accent" size="lg">
                  Ir para o meu painel
                </Button>
              ) : (
                <>
                  <Button
                    to="/cadastro?tipo=candidato"
                    variant="accent"
                    size="lg"
                  >
                    Sou estudante
                  </Button>

                  <Button
                    to="/cadastro?tipo=empresa"
                    size="lg"
                    className="border border-white/20 bg-white/10 text-white hover:bg-white/20"
                  >
                    Sou empresa
                  </Button>
                </>
              )}

              <Link
                to="/vagas"
                className="self-center rounded-lg px-2 py-2 text-sm font-semibold text-slate-300 transition-colors hover:text-white"
              >
                Ver vagas abertas →
              </Link>
            </div>
          </div>

          {/* Exemplo de compatibilidade */}
          <div className="rounded-2xl border border-white/10 bg-[var(--surface-bg)] p-6 text-[var(--text-primary)] shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                  Exemplo de vaga
                </p>

                <p className="mt-1 font-bold text-[var(--text-primary)]">
                  Estágio em Desenvolvimento Back-end
                </p>
              </div>

              <span className="shrink-0 rounded-xl bg-emerald-100 px-3 py-2 text-center dark:bg-emerald-950">
                <span className="block text-2xl font-extrabold text-emerald-800 dark:text-emerald-300">
                  {(num / den).toFixed(1).replace('.', ',')}
                </span>

                <span className="block text-[10px] font-semibold uppercase text-emerald-800 dark:text-emerald-300">
                  score
                </span>
              </span>
            </div>

            <ul className="mt-5 space-y-3">
              {EXAMPLE.map((e) => (
                <li key={e.name}>
                  <div className="mb-1 flex justify-between gap-3 text-sm">
                    <span className="font-medium text-[var(--text-primary)]">
                      {e.name}{' '}
                      <span className="text-xs font-normal text-[var(--text-muted)]">
                        peso {e.weight}
                      </span>
                    </span>

                    <span className="font-semibold text-[var(--text-primary)]">
                      {e.grade.toFixed(1).replace('.', ',')}
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-[var(--surface-secondary)]">
                    <div
                      className="h-full rounded-full bg-[var(--primary-color)]"
                      style={{ width: `${e.grade * 10}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-5 overflow-x-auto rounded-lg bg-[var(--surface-secondary)] px-3 py-2 font-mono text-xs text-[var(--text-secondary)]">
              S = Σ(Nᵢ × Pᵢ) ÷ ΣPᵢ = {num.toFixed(1).replace('.', ',')} ÷ {den} = {score}
            </p>
          </div>
        </div>
      </section>

      {/* Princípios */}
      <section className="bg-[var(--page-bg)] text-[var(--text-primary)]">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="text-center text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Estágio justo, por princípio
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-center text-[var(--text-secondary)]">
            Regras que valem para todas as vagas, pensadas a partir de uma
            pesquisa com 77 estudantes da Baixada Santista.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {PRINCIPLES.map((p, i) => (
              <div
                key={p.title}
                className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] p-6 transition-colors"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-indigo-600 font-bold text-lime-200">
                  {i + 1}
                </span>

                <h3 className="mt-4 font-bold text-[var(--text-primary)]">
                  {p.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {p.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Para quem */}
      <section className="border-y border-[var(--border-color)] bg-[var(--surface-bg)] text-[var(--text-primary)]">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[var(--primary-color)]">
              Para estudantes
            </p>

            <h3 className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
              Cadastre seu histórico, receba vagas compatíveis
            </h3>

            <ul className="mt-5 space-y-3 text-[var(--text-secondary)]">
              <li>
                <span className="font-bold text-[var(--success-color)]">✓</span>{' '}
                Informe disciplinas e notas uma única vez
              </li>
              <li>
                <span className="font-bold text-[var(--success-color)]">✓</span>{' '}
                Veja um score de compatibilidade para cada vaga — e o porquê dele
              </li>
              <li>
                <span className="font-bold text-[var(--success-color)]">✓</span>{' '}
                Acompanhe o status de todas as candidaturas em um só lugar
              </li>
            </ul>

            <Button
              to="/cadastro?tipo=candidato"
              className="mt-6"
            >
              Criar perfil de estudante
            </Button>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[var(--primary-color)]">
              Para empresas
            </p>

            <h3 className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
              Defina as áreas que importam e receba candidatos ranqueados
            </h3>

            <ul className="mt-5 space-y-3 text-[var(--text-secondary)]">
              <li>
                <span className="font-bold text-[var(--success-color)]">✓</span>{' '}
                Atribua pesos de 1 a 5 às áreas de conhecimento da vaga
              </li>
              <li>
                <span className="font-bold text-[var(--success-color)]">✓</span>{' '}
                Compare candidatos de faculdades diferentes na mesma régua
              </li>
              <li>
                <span className="font-bold text-[var(--success-color)]">✓</span>{' '}
                Avance, recomende ou dê retorno com um clique
              </li>
            </ul>

            <Button
              to="/cadastro?tipo=empresa"
              variant="secondary"
              className="mt-6"
            >
              Publicar uma vaga
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
