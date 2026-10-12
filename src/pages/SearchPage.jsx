import { useSearchParams } from "react-router-dom";

function SearchPage() {

    const [searchParams] = useSearchParams();

    const search = searchParams.get("q");


    return (

        <main className="search-page">

            <h1>
                Resultados da pesquisa
            </h1>

            <p>
                Você pesquisou por:
            </p>

            <h2>
                "{search}"
            </h2>


            <section>

                <h3>
                    👤 Usuários
                </h3>

                <p>
                    Resultados de usuários aparecerão aqui.
                </p>

            </section>


            <section>

                <h3>
                    🏢 Empresas
                </h3>

                <p>
                    Resultados de empresas aparecerão aqui.
                </p>

            </section>


            <section>

                <h3>
                    💼 Vagas
                </h3>

                <p>
                    Resultados de vagas aparecerão aqui.
                </p>

            </section>

        </main>

    );

}

export default SearchPage;