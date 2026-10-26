import React from "react";
import { ThemeToggle } from "../components/ThemeToggle";
import "../css/user.css";

function UserPage() {

    return (

        <main className="user-page">

            <section className="profile-header">

                <div className="profile-image">
                    <img
                        src="/img/user.png"
                        alt="Foto do usuário"
                    />
                </div>

                <div className="profile-info">

                    <h1>
                        João da Silva
                    </h1>

                    <h2>
                        Desenvolvedor Full Stack
                    </h2>

                    <p>
                        📍 Santos - SP
                    </p>

                    <p>
                        ✉ joao123@email.com
                    </p>

                </div>

            </section>


            <section className="user-section">

                <h2>
                    Sobre mim
                </h2>

                <p>
                    Sou estudante de Ciência da Computação
                    interessado em desenvolvimento web,
                    programação e tecnologia.
                </p>

            </section>


            <section className="user-section">

                <h2>
                    Habilidades
                </h2>

                <div className="skills-list">

                    <span>HTML</span>
                    <span>CSS</span>
                    <span>JavaScript</span>
                    <span>React</span>
                    <span>Node.js</span>

                </div>

            </section>


            <section className="user-section">

                <h2>
                    Formação
                </h2>

                <div className="experience-item">

                    <h3>
                        Ciência da Computação
                    </h3>

                    <p>
                        Universidade XYZ
                    </p>

                </div>

            </section>


            <section className="user-section">

                <h2>
                    Experiência profissional
                </h2>

                <div className="experience-item">

                    <h3>
                        Desenvolvedor Web
                    </h3>

                    <p>
                        Empresa XYZ
                    </p>

                    <p>
                        Desenvolvimento e manutenção
                        de aplicações web.
                    </p>

                </div>

            </section>

        </main>

    );

}

export default UserPage;