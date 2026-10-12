import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";

export default function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/" aria-label="DigitalID página inicial">
          <span className="brand-mark">D</span>
          <span>Digital<span className="brand-light">ID</span></span>
        </Link>
        <nav className="navigation">
          <Link to="/">Início</Link>
          <Link to="/login">Entrar</Link>
          <Link className="nav-cta" to="/cadastro">Criar conta</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <footer className="footer">
        <span>DigitalID — Projeto acadêmico</span>
        <span>Identificação e controle de acesso</span>
      </footer>
    </div>
  );
}