import React from "react";
import "../css/company.css";
import { ThemeToggle } from '../../components/ThemeToggle'

function CompanyPage() {

    return (
        <main className="company-page">

            <header className="company-header">

                <img
                    src="/img/company.png"
                    alt="Logo da empresa"
                />

                <div>

                    <h1>Empresa XY</h1>

                    <p>
                        Tecnologia e Desenvolvimento
                    </p>

                    <p>
                        📍 Santos - SP
                    </p>

                </div>

            </header>


            <section className="company-about">

                <h2>Sobre a empresa</h2>

                <p>
                    Somos uma empresa especializada
                    em desenvolvimento de software.
                </p>

            </section>


            <section className="company-jobs">

                <h2>Vagas disponíveis</h2>

                <article className="job-card">

                    <h3>
                        Desenvolvedor Front-End
                    </h3>

                    <p>
                        React • JavaScript
                    </p>

                    <p>
                        📍 Santos - SP
                    </p>

                    <button>
                        Ver vaga
                    </button>

                </article>


                <article className="job-card">

                    <h3>
                        Desenvolvedor Back-End
                    </h3>

                    <p>
                        Node.js • SQL
                    </p>

                    <p>
                        🏠 Remoto
                    </p>

                    <button>
                        Ver vaga
                    </button>

                </article>

            </section>

        </main>
    );
}

export default CompanyPage;