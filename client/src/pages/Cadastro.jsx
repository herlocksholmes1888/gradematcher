import { useState } from "react";
import { Link } from "react-router-dom";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [mensagem, setMensagem] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (senha.length < 8) {
      setMensagem("A senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (senha !== confirmacao) {
      setMensagem("As senhas não coincidem.");
      return;
    }
    setMensagem("Cadastro validado na interface. Para registrar o usuário, conecte um backend.");
  }

  return (
    <section className="auth-layout page-width signup-layout">
      <div className="auth-aside">
        <div className="eyebrow"><span className="status-dot" /> CRIE SEU ACESSO</div>
        <h1>Sua jornada começa <span>por aqui.</span></h1>
        <p>Crie seu perfil na interface demonstrativa e conheça o fluxo de cadastro do sistema.</p>
        <div className="feature-list">
          <div><span>01</span><p><strong>Cadastro simples</strong><small>Dados essenciais em um só lugar.</small></p></div>
          <div><span>02</span><p><strong>Validação de campos</strong><small>Verificações básicas no formulário.</small></p></div>
          <div><span>03</span><p><strong>Estrutura preparada</strong><small>Pronta para futura integração com servidor.</small></p></div>
        </div>
      </div>
      <div className="form-card">
        <div className="form-heading"><div className="form-icon">＋</div><h2>Criar uma conta</h2><p>Preencha os campos para continuar.</p></div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="nome">Nome completo</label>
          <input id="nome" type="text" placeholder="Digite seu nome" value={nome} onChange={e => setNome(e.target.value)} autoComplete="name" required />
          <label htmlFor="cad-email">E-mail</label>
          <input id="cad-email" type="email" placeholder="voce@exemplo.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required />
          <label htmlFor="cad-senha">Senha</label>
          <input id="cad-senha" type="password" placeholder="Mínimo de 8 caracteres" value={senha} onChange={e => setSenha(e.target.value)} autoComplete="new-password" minLength={8} required />
          <label htmlFor="confirmacao">Confirmar senha</label>
          <input id="confirmacao" type="password" placeholder="Digite a senha novamente" value={confirmacao} onChange={e => setConfirmacao(e.target.value)} autoComplete="new-password" required />
          <button className="button button-primary submit-button" type="submit">Criar conta <span>→</span></button>
          {mensagem && <p className="form-message" role="status">{mensagem}</p>}
        </form>
        <p className="form-switch">Já tem uma conta? <Link to="/login">Fazer login</Link></p>
        <p className="back-home"><Link to="/">← Voltar para o início</Link></p>
      </div>
    </section>
  );
}