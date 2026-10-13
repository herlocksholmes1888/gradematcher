import "../css/recommended-jobs.css";

function RecommendedJobs() {

    const jobs = [
        {
            id: 1,
            title: "Desenvolvedor Front-End",
            company: "Empresa XYZ",
            location: "Santos - SP",
            salary: "R$ 3.000 - R$ 4.500",
            skills: ["React", "JavaScript", "HTML", "CSS"]
        },
        {
            id: 2,
            title: "Desenvolvedor Java",
            company: "Empresa ABC",
            location: "São Paulo - SP",
            salary: "R$ 4.000 - R$ 6.000",
            skills: ["Java", "Spring", "SQL"]
        },
        {
            id: 3,
            title: "Desenvolvedor Back-End",
            company: "Tech Santos",
            location: "Santos - SP",
            salary: "R$ 3.500 - R$ 5.000",
            skills: ["Node.js", "JavaScript", "MongoDB"]
        }
    ];

    return (
        <main className="recommended-page">

            <section className="welcome">

                <h1>
                    Bem Vindo, João! 👋
                </h1>

                <p>
                    Encontramos algumas vagas que podem
                    combinar com o seu perfil.
                </p>

            </section>


            <section className="recommended-section">

                <h2>
                    Vagas recomendadas
                </h2>

                <div className="jobs-list">

                    {jobs.map((job) => (

                        <article
                            className="recommended-job"
                            key={job.id}
                        >

                            <div className="job-information">

                                <h3>
                                    {job.title}
                                </h3>

                                <p className="company">
                                    🏢 {job.company}
                                </p>

                                <p>
                                    📍 {job.location}
                                </p>

                                <p>
                                    💰 {job.salary}
                                </p>

                                <div className="job-skills">

                                    {job.skills.map((skill) => (
                                        <span key={skill}>
                                            {skill}
                                        </span>
                                    ))}

                                </div>

                            </div>


                            <div className="job-actions">

                                <button className="btn-secondary">
                                    Ver vaga
                                </button>

                                <button className="btn-primary">
                                    Candidatar-se
                                </button>

                            </div>

                        </article>

                    ))}

                </div>

            </section>

        </main>
    );
}

export default RecommendedJobs;