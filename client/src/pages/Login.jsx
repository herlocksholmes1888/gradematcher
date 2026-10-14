import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../lib/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    if (!email.trim() || !senha) {
      setMensagem("Preencha o e-mail e a senha para continuar.");
      return;
    }

    setLoading(true);
    setMensagem("");
    try {
      const { user } = await login({ email, password: senha });
      const role = user?.user_metadata?.role;
      navigate(role === "company" ? "/empresa" : "/usuario");
    } catch (err) {
      setMensagem(err.message || "Não foi possível entrar. Verifique seus dados.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-layout page-width">
      <div className="auth-aside">
        <div className="eyebrow"><span className="status-dot" /> ÁREA SEGURA</div>
        <h1>Bom ter você <span>de volta.</span></h1>
        <p>Entre com seus dados para acessar o GradeMatcher.</p>
        <div className="aside-note"><span>⌁</span><div><strong>Conectado ao Supabase</strong><p>Autenticação real via Supabase Auth.</p></div></div>
      </div>
      <div className="form-card">
        <div className="form-heading"><div className="form-icon">↗</div><h2>Entrar na conta</h2><p>Informe seus dados de acesso abaixo.</p></div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">E-mail</label>
          <input id="email" type="email" placeholder="voce@exemplo.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required />
          <div className="label-row"><label htmlFor="senha">Senha</label></div>
          <input id="senha" type="password" placeholder="Digite sua senha" value={senha} onChange={e => setSenha(e.target.value)} autoComplete="current-password" required />
          <button className="button button-primary submit-button" type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"} <span>→</span>
          </button>
          {mensagem && <p className="form-message" role="status">{mensagem}</p>}
        </form>
        <p className="form-switch">Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link></p>
        <p className="back-home"><Link to="/">← Voltar para o início</Link></p>
      </div>
    </section>
  );
}
