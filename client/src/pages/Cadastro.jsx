import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUpCandidate, signUpCompany } from "../lib/auth";

export default function Cadastro() {
  const [accountType, setAccountType] = useState("candidate");
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const [candidato, setCandidato] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmacao: "",
    instituicao: "",
    curso: "",
  });

  const [empresa, setEmpresa] = useState({
    responsavel: "",
    email: "",
    senha: "",
    confirmacao: "",
    nomeEmpresa: "",
    cnpj: "",
  });

  const form = accountType === "candidate" ? candidato : empresa;
  const setForm = accountType === "candidate" ? setCandidato : setEmpresa;

  function updateField(field) {
    return (event) => setForm({ ...form, [field]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErro("");
    setMensagem("");

    if (form.senha.length < 8) {
      setErro("A senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (form.senha !== form.confirmacao) {
      setErro("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      let result;
      if (accountType === "candidate") {
        result = await signUpCandidate({
          fullName: candidato.nome,
          email: candidato.email,
          password: candidato.senha,
          institutionName: candidato.instituicao,
          courseName: candidato.curso,
        });
      } else {
        result = await signUpCompany({
          contactName: empresa.responsavel,
          email: empresa.email,
          password: empresa.senha,
          companyName: empresa.nomeEmpresa,
          cnpj: empresa.cnpj,
        });
      }

      if (result.session) {
        navigate(accountType === "candidate" ? "/usuario" : "/empresa");
      } else {
        setMensagem(
          "Cadastro criado! Verifique seu e-mail para confirmar a conta antes de entrar."
        );
      }
    } catch (err) {
      setErro(err.message || "Não foi possível concluir o cadastro.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-layout page-width signup-layout">
      <div className="auth-aside">
        <div className="eyebrow"><span className="status-dot" /> CRIE SEU ACESSO</div>
        <h1>Sua jornada começa <span>por aqui.</span></h1>
        <p>Crie sua conta no GradeMatcher como candidato ou empresa.</p>
        <div className="feature-list">
          <div><span>01</span><p><strong>Escolha o tipo de conta</strong><small>Candidato buscando estágio ou empresa contratando.</small></p></div>
          <div><span>02</span><p><strong>Dados essenciais</strong><small>Só o necessário para começar.</small></p></div>
          <div><span>03</span><p><strong>Conectado ao Supabase</strong><small>Conta real, pronta para uso.</small></p></div>
        </div>
      </div>
      <div className="form-card">
        <div className="form-heading"><div className="form-icon">＋</div><h2>Criar uma conta</h2><p>Escolha o tipo de conta e preencha os campos.</p></div>

        <div className="account-type-toggle" role="radiogroup" aria-label="Tipo de conta">
          <button
            type="button"
            className={`button ${accountType === "candidate" ? "button-primary" : "button-secondary"}`}
            aria-pressed={accountType === "candidate"}
            onClick={() => setAccountType("candidate")}
          >
            Sou candidato
          </button>
          <button
            type="button"
            className={`button ${accountType === "company" ? "button-primary" : "button-secondary"}`}
            aria-pressed={accountType === "company"}
            onClick={() => setAccountType("company")}
          >
            Sou empresa
          </button>
        </div>

        {accountType === "candidate" ? (
          <form onSubmit={handleSubmit}>
            <label htmlFor="nome">Nome completo</label>
            <input id="nome" type="text" placeholder="Digite seu nome" value={candidato.nome} onChange={updateField("nome")} autoComplete="name" required />

            <label htmlFor="instituicao">Faculdade</label>
            <input id="instituicao" type="text" placeholder="Ex.: Universidade Exemplo" value={candidato.instituicao} onChange={updateField("instituicao")} required />

            <label htmlFor="curso">Curso</label>
            <input id="curso" type="text" placeholder="Ex.: Ciência da Computação" value={candidato.curso} onChange={updateField("curso")} required />

            <label htmlFor="cad-email">E-mail</label>
            <input id="cad-email" type="email" placeholder="voce@exemplo.com" value={candidato.email} onChange={updateField("email")} autoComplete="email" required />

            <label htmlFor="cad-senha">Senha</label>
            <input id="cad-senha" type="password" placeholder="Mínimo de 8 caracteres" value={candidato.senha} onChange={updateField("senha")} autoComplete="new-password" minLength={8} required />

            <label htmlFor="confirmacao">Confirmar senha</label>
            <input id="confirmacao" type="password" placeholder="Digite a senha novamente" value={candidato.confirmacao} onChange={updateField("confirmacao")} autoComplete="new-password" required />

            <button className="button button-primary submit-button" type="submit" disabled={loading}>
              {loading ? "Criando conta..." : "Criar conta"} <span>→</span>
            </button>
            {erro && <p className="form-message" role="alert">{erro}</p>}
            {mensagem && <p className="form-message" role="status">{mensagem}</p>}
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <label htmlFor="responsavel">Nome do responsável</label>
            <input id="responsavel" type="text" placeholder="Quem está criando a conta" value={empresa.responsavel} onChange={updateField("responsavel")} autoComplete="name" required />

            <label htmlFor="nomeEmpresa">Nome da empresa</label>
            <input id="nomeEmpresa" type="text" placeholder="Ex.: TechSecure Ltda" value={empresa.nomeEmpresa} onChange={updateField("nomeEmpresa")} required />

            <label htmlFor="cnpj">CNPJ</label>
            <input id="cnpj" type="text" placeholder="00.000.000/0000-00" value={empresa.cnpj} onChange={updateField("cnpj")} required />

            <label htmlFor="emp-email">E-mail</label>
            <input id="emp-email" type="email" placeholder="contato@empresa.com" value={empresa.email} onChange={updateField("email")} autoComplete="email" required />

            <label htmlFor="emp-senha">Senha</label>
            <input id="emp-senha" type="password" placeholder="Mínimo de 8 caracteres" value={empresa.senha} onChange={updateField("senha")} autoComplete="new-password" minLength={8} required />

            <label htmlFor="emp-confirmacao">Confirmar senha</label>
            <input id="emp-confirmacao" type="password" placeholder="Digite a senha novamente" value={empresa.confirmacao} onChange={updateField("confirmacao")} autoComplete="new-password" required />

            <button className="button button-primary submit-button" type="submit" disabled={loading}>
              {loading ? "Criando conta..." : "Criar conta"} <span>→</span>
            </button>
            {erro && <p className="form-message" role="alert">{erro}</p>}
            {mensagem && <p className="form-message" role="status">{mensagem}</p>}
          </form>
        )}

        <p className="form-switch">Já tem uma conta? <Link to="/login">Fazer login</Link></p>
        <p className="back-home"><Link to="/">← Voltar para o início</Link></p>
      </div>
    </section>
  );
}
