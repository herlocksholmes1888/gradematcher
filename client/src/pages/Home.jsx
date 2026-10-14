import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="hero page-width">
      <div className="hero-copy">
        <div className="eyebrow"><span className="status-dot" /> VAGAS DE ESTÁGIO POR AFINIDADE ACADÊMICA</div>
        <h1>Sua próxima vaga de estágio <span>combina com suas notas.</span></h1>
        <p className="hero-description">
          O GradeMatcher conecta candidatos a vagas de estágio com base no curso,
          na faculdade e nas disciplinas em que eles se destacam — e ajuda empresas
          a encontrar quem já tem a base certa para a vaga.
        </p>
        <div className="hero-actions">
          <Link className="button button-primary" to="/cadastro">Criar minha conta <span>→</span></Link>
          <Link className="button button-secondary" to="/login">Já tenho uma conta</Link>
        </div>
        <div className="trust-row">
          <div className="trust-icon">✓</div>
          <p><strong>Recomendação por notas</strong><br /><span>Candidaturas priorizadas pela afinidade real com a vaga.</span></p>
        </div>
      </div>

      <div className="hero-visual">
        <div className="orb orb-one" />
        <div className="orb orb-two" />
        <div className="identity-card">
          <div className="card-top"><span className="mini-logo">G</span><span className="card-label">GRADEMATCHER</span><span className="card-menu">•••</span></div>
          <div className="fingerprint">
            <svg viewBox="0 0 180 180" role="img" aria-label="Ilustração de combinação entre candidato e vaga">
              <g fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round">
                <path d="M90 22C53 22 27 50 27 85" />
                <path d="M90 35C61 35 40 57 40 85c0 20-4 36-12 50" />
                <path d="M90 48C68 48 53 64 53 85c0 32-6 49-17 64" />
                <path d="M90 61C76 61 66 71 66 85c0 39-8 59-19 72" />
                <path d="M90 22c37 0 63 28 63 63 0 36-5 62-18 83" />
                <path d="M90 35c29 0 50 22 50 50 0 32-4 53-15 73" />
                <path d="M90 48c22 0 37 16 37 37 0 29-3 47-11 64" />
                <path d="M90 61c14 0 24 10 24 24 0 25-2 41-7 55" />
                <path d="M90 74c7 0 11 5 11 11 0 19-1 31-3 42" />
                <path d="M78 87c0 24-2 41-7 57" />
                <path d="M90 87c0 18-1 32-2 44" />
              </g>
            </svg>
          </div>
          <div className="scan-line" />
          <div className="card-bottom"><div><span className="tiny-muted">STATUS DA CANDIDATURA</span><strong><i className="status-dot" /> Recomendado para a vaga</strong></div><span className="shield">◇</span></div>
        </div>
        <div className="floating-tag tag-top"><span className="tag-check">✓</span><div><strong>Notas</strong><small>Por disciplina e área</small></div></div>
        <div className="floating-tag tag-bottom"><span className="tag-lock">⌑</span><div><strong>Vagas</strong><small>Filtradas por curso</small></div></div>
      </div>
    </section>
  );
}