import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from 'react';
import Navbar from "./components/Navbar";

import UserPage from "./pages/UserPage";
import CompanyPage from "./pages/CompanyPage";
import JobPage from "./pages/JobPage";
import SearchPage from "./pages/SearchPage";

import RecommendedJobs from "./pages/RecommendedJobs";
import GradesPage from "./pages/GradesPage";
import ResumePage from "./pages/ResumePage";


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

function App() {

    return (

        <BrowserRouter>

            <Navbar />

            <Routes>

                <Route
                    path="/usuario"
                    element={<UserPage />}
                />

                <Route
                    path="/empresa"
                    element={<CompanyPage />}
                />

                <Route
                    path="/vaga"
                    element={<JobPage />}
                />

                <Route
                    path="/busca"
                    element={<SearchPage />}
                />


                {/* NOVAS TELAS */}

                <Route
                    path="/vagas-recomendadas"
                    element={<RecommendedJobs />}
                />

                <Route
                    path="/notas"
                    element={<GradesPage />}
                />

                <Route
                    path="/curriculo"
                    element={<ResumePage />}
                />

            </Routes>

        </BrowserRouter>

    );
}

export default App;