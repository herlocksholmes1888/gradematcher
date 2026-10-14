import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";

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
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />

          <Route path="/usuario" element={<UserPage />} />
          <Route path="/empresa" element={<CompanyPage />} />
          <Route path="/vaga" element={<JobPage />} />
          <Route path="/busca" element={<SearchPage />} />
          <Route path="/vagas-recomendadas" element={<RecommendedJobs />} />
          <Route path="/notas" element={<GradesPage />} />
          <Route path="/curriculo" element={<ResumePage />} />

          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <footer className="footer">
        <span>GradeMatcher — Projeto acadêmico</span>
        <span>Conectando candidatos a estágios por afinidade acadêmica</span>
      </footer>
    </div>
  );
}
