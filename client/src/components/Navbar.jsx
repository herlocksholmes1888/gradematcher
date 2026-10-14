import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { logout } from "../lib/auth";
import "../css/navbar.css";

function Navbar() {

    const [search, setSearch] = useState("");
    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setUser(data.session?.user ?? null);
        });

        const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.subscription.unsubscribe();
    }, []);

    function handleSearch(event) {

        event.preventDefault();

        if (search.trim() === "") {
            return;
        }

        navigate(`/busca?q=${encodeURIComponent(search)}`);
    }

    async function handleLogout() {
        await logout();
        navigate("/");
    }

    const isCompany = user?.user_metadata?.role === "company";

    return (

        <nav className="navbar">

            <div className="navbar-container">

                {/* LOGO */}

                <Link
                    to="/"
                    className="logo"
                >
                    Gradematcher
                </Link>


                {/* BARRA DE PESQUISA */}

                <form
                    className="search-form"
                    onSubmit={handleSearch}
                >

                    <input
                        type="text"
                        placeholder="Pesquisar usuário, empresa ou vaga..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                    />

                    <button type="submit">
                        🔎
                    </button>

                </form>


                {/* MENU */}

                <div className="nav-links">

                    <Link to={isCompany ? "/empresa" : "/usuario"}>
                        {isCompany ? "Empresa" : "Usuário"}
                    </Link>

                    <Link to="/vaga">
                        Vaga
                    </Link>

                    <Link to="/vagas-recomendadas">
                        Vagas recomendadas
                    </Link>

                    <Link to="/notas">
                        Notas
                    </Link>

                    <Link to="/curriculo">
                        Currículo
                    </Link>

                </div>

                {/* CONTA */}

                <div className="nav-auth">

                    {user ? (
                        <button type="button" className="nav-logout" onClick={handleLogout}>
                            Sair
                        </button>
                    ) : (
                        <>
                            <Link to="/login">
                                Entrar
                            </Link>

                            <Link to="/cadastro">
                                Criar conta
                            </Link>
                        </>
                    )}

                </div>

            </div>

        </nav>

    );
}

export default Navbar;
