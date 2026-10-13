import React from "react";
import "../css/job.css";

function JobPage() {

    return (
        <main className="job-page">

            <header>

                <h1>
                    Desenvolvedor Front-End
                </h1>

                <h2>
                    Empresa XY
                </h2>

                <p>
                    📍 Santos - SP
                </p>

                <p>
                    💰 R$ 3.000 - R$ 4.500
                </p>

                <p>
                    🕐 CLT
                </p>

                <button>
                    CANDIDATAR-SE
                </button>

            </header>


            <section>

                <h2>
                    Descrição da vaga
                </h2>

                <p>
                    Procuramos um desenvolvedor
                    Front-End para fazer parte
                    da nossa equipe.
                </p>

            </section>


            <section>

                <h2>
                    Requisitos
                </h2>

                <ul>
                    <li>JavaScript</li>
                    <li>React</li>
                    <li>HTML</li>
                    <li>CSS</li>
                    <li>Git</li>
                </ul>

            </section>


            <section>

                <h2>
                    Benefícios
                </h2>

                <ul>
                    <li>Vale-refeição</li>
                    <li>Vale-transporte</li>
                    <li>Plano de saúde</li>
                </ul>

            </section>

        </main>
    );
}

export default JobPage;