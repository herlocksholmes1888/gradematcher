import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="hero page-width">
      <div className="hero-copy">
        <div className="eyebrow"><span className="status-dot" /> SISTEMA DE IDENTIFICAÇÃO DIGITAL</div>
        <h1>Segurança começa com uma <span>identidade confiável.</span></h1>
        <p className="hero-description">
          Uma plataforma acadêmica para demonstrar o gerenciamento de usuários
          e o controle de acesso a recursos por meio de uma interface simples e organizada.
        </p>
        <div className="hero-actions">
          <Link className="button button-primary" to="/cadastro">Começar agora <span>→</span></Link>
          <Link className="button button-secondary" to="/login">Já tenho uma conta</Link>
        </div>
        <div className="trust-row">
          <div className="trust-icon">✓</div>
          <p><strong>Acesso organizado</strong><br /><span>Interface pensada para clareza e segurança.</span></p>
        </div>
      </div>

      <div className="hero-visual">
        <div className="orb orb-one" />
        <div className="orb orb-two" />
        <div className="identity-card">
          <div className="card-top"><span className="mini-logo">D</span><span className="card-label">IDENTIDADE DIGITAL</span><span className="card-menu">•••</span></div>
          <div className="fingerprint">
            <svg viewBox="0 0 180 180" role="img" aria-label="Ilustração de impressão digital">
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
          <div className="card-bottom"><div><span className="tiny-muted">STATUS DO SISTEMA</span><strong><i className="status-dot" /> Interface demonstrativa</strong></div><span className="shield">◇</span></div>
        </div>
        <div className="floating-tag tag-top"><span className="tag-check">✓</span><div><strong>Identidade</strong><small>Interface demonstrativa</small></div></div>
        <div className="floating-tag tag-bottom"><span className="tag-lock">⌑</span><div><strong>Controle de acesso</strong><small>Área de demonstração</small></div></div>
      </div>
    </section>
  );
}