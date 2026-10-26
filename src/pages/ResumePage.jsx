import { useState } from "react";
import "../css/resume.css";
import { ThemeToggle } from "../components/ThemeToggle";

function ResumePage() {

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        city: "",
        objective: "",
        education: "",
        experience: "",
        skills: "",
        languages: ""
    });


    function handleChange(event) {

        const { name, value } = event.target;

        setForm({
            ...form,
            [name]: value
        });

    }


    function handleSubmit(event) {

        event.preventDefault();

        console.log(form);

        alert("Currículo salvo!");

    }


    return (

        <main className="resume-page">

            <form
                className="resume-container"
                onSubmit={handleSubmit}
            >

                <h1>
                    Meu currículo
                </h1>

                <p className="resume-description">
                    Preencha suas informações profissionais
                    para criar seu currículo.
                </p>


                <section className="resume-section">

                    <h2>
                        Informações pessoais
                    </h2>


                    <div className="form-group">

                        <label>
                            Nome
                        </label>

                        <input
                            type="text"
                            name="name"
                            placeholder="Seu nome completo"
                            value={form.name}
                            onChange={handleChange}
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="seu@email.com"
                            value={form.email}
                            onChange={handleChange}
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Telefone
                        </label>

                        <input
                            type="text"
                            name="phone"
                            placeholder="(13) 99999-9999"
                            value={form.phone}
                            onChange={handleChange}
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Cidade
                        </label>

                        <input
                            type="text"
                            name="city"
                            placeholder="Santos - SP"
                            value={form.city}
                            onChange={handleChange}
                        />

                    </div>

                </section>


                <section className="resume-section">

                    <h2>
                        Objetivo profissional
                    </h2>

                    <div className="form-group">

                        <label>
                            Objetivo
                        </label>

                        <textarea
                            name="objective"
                            placeholder="Descreva seu objetivo profissional"
                            value={form.objective}
                            onChange={handleChange}
                        />

                    </div>

                </section>


                <section className="resume-section">

                    <h2>
                        Formação
                    </h2>

                    <div className="form-group">

                        <label>
                            Formação acadêmica
                        </label>

                        <textarea
                            name="education"
                            placeholder="Ex: Ciência da Computação - Universidade XYZ"
                            value={form.education}
                            onChange={handleChange}
                        />

                    </div>

                </section>


                <section className="resume-section">

                    <h2>
                        Experiência profissional
                    </h2>

                    <div className="form-group">

                        <label>
                            Experiências
                        </label>

                        <textarea
                            name="experience"
                            placeholder="Descreva suas experiências profissionais"
                            value={form.experience}
                            onChange={handleChange}
                        />

                    </div>

                </section>


                <section className="resume-section">

                    <h2>
                        Habilidades
                    </h2>

                    <div className="form-group">

                        <label>
                            Habilidades
                        </label>

                        <input
                            type="text"
                            name="skills"
                            placeholder="React, JavaScript, Java, SQL..."
                            value={form.skills}
                            onChange={handleChange}
                        />

                    </div>

                </section>


                <section className="resume-section">

                    <h2>
                        Idiomas
                    </h2>

                    <div className="form-group">

                        <label>
                            Idiomas
                        </label>

                        <input
                            type="text"
                            name="languages"
                            placeholder="Português, Inglês..."
                            value={form.languages}
                            onChange={handleChange}
                        />

                    </div>

                </section>


                <button
                    type="submit"
                    className="save-resume"
                >
                    Salvar currículo
                </button>

            </form>

        </main>

    );
}

export default ResumePage;