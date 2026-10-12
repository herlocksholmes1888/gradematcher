import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {

    const [search, setSearch] = useState("");

    const navigate = useNavigate();


    function handleSearch(event) {

        event.preventDefault();

        if (search.trim() === "") {
            return;
        }

        navigate(`/busca?q=${encodeURIComponent(search)}`);
    }


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

                    <Link to="/usuario">
                        Usuário
                    </Link>

                    <Link to="/empresa">
                        Empresa
                    </Link>

                    <Link to="/vaga">
                        Vaga
                    </Link>

                </div>

            </div>

        </nav>

    );
}

export default Navbar;