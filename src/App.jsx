import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from './lib/auth'
import Layout from './components/Layout'
import { PageLoader } from './components/ui'

import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Onboarding from './pages/Onboarding'
import Jobs from './pages/Jobs'
import JobDetail from './pages/JobDetail'

import CandidateDashboard from './pages/candidato/Dashboard'
import CandidateApplications from './pages/candidato/Applications'
import CandidateGrades from './pages/candidato/Grades'
import CandidateProfile from './pages/candidato/Profile'

import CompanyDashboard from './pages/empresa/Dashboard'
import JobForm from './pages/empresa/JobForm'
import JobApplicants from './pages/empresa/JobApplicants'
import CompanyProfile from './pages/empresa/Profile'

function RequireRole({ role, children }) {
  const { user, profile, loading } = useAuth()
  const location = useLocation()
  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/entrar" state={{ from: location }} replace />
  if (!profile) return <Navigate to="/bem-vindo" replace />
  if (profile.role !== role) return <Navigate to={profile.role === 'company' ? '/empresa' : '/candidato'} replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="entrar" element={<Login />} />
        <Route path="cadastro" element={<Signup />} />
        <Route path="bem-vindo" element={<Onboarding />} />
        <Route path="vagas" element={<Jobs />} />
        <Route path="vagas/:id" element={<JobDetail />} />

        <Route path="candidato" element={<RequireRole role="candidate"><CandidateDashboard /></RequireRole>} />
        <Route path="candidato/candidaturas" element={<RequireRole role="candidate"><CandidateApplications /></RequireRole>} />
        <Route path="candidato/historico" element={<RequireRole role="candidate"><CandidateGrades /></RequireRole>} />
        <Route path="candidato/perfil" element={<RequireRole role="candidate"><CandidateProfile /></RequireRole>} />

        <Route path="empresa" element={<RequireRole role="company"><CompanyDashboard /></RequireRole>} />
        <Route path="empresa/vagas/nova" element={<RequireRole role="company"><JobForm /></RequireRole>} />
        <Route path="empresa/vagas/:id/editar" element={<RequireRole role="company"><JobForm /></RequireRole>} />
        <Route path="empresa/vagas/:id" element={<RequireRole role="company"><JobApplicants /></RequireRole>} />
        <Route path="empresa/perfil" element={<RequireRole role="company"><CompanyProfile /></RequireRole>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
