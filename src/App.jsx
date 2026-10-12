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