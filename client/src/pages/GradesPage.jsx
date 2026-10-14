import { useState } from "react";
import "../css/grades.css";

function GradesPage() {

    const [subjects, setSubjects] = useState([
        {
            id: 1,
            name: "",
            grade: "",
            weight: ""
        }
    ]);


    function addSubject() {

        setSubjects([
            ...subjects,
            {
                id: Date.now(),
                name: "",
                grade: "",
                weight: ""
            }
        ]);

    }


    function updateSubject(id, field, value) {

        setSubjects(
            subjects.map((subject) =>
                subject.id === id
                    ? {
                        ...subject,
                        [field]: value
                    }
                    : subject
            )
        );

    }


    function calculateAverage() {

        let total = 0;
        let totalWeight = 0;

        subjects.forEach((subject) => {

            const grade = Number(subject.grade);
            const weight = Number(subject.weight);

            if (
                !isNaN(grade) &&
                !isNaN(weight) &&
                weight > 0
            ) {

                total += grade * weight;
                totalWeight += weight;

            }

        });

        if (totalWeight === 0) {
            return "0,00";
        }

        return (total / totalWeight).toFixed(2).replace(".", ",");
    }


    return (

        <main className="grades-page">

            <section className="grades-container">

                <h1>
                    Minhas notas
                </h1>

                <p className="grades-description">
                    Preencha suas notas acadêmicas para
                    melhorar a recomendação de vagas.
                </p>


                <div className="grades-header">

                    <span>
                        Disciplina
                    </span>

                    <span>
                        Nota
                    </span>

                    <span>
                        Peso
                    </span>

                </div>


                {subjects.map((subject) => (

                    <div
                        className="subject-row"
                        key={subject.id}
                    >

                        <input
                            type="text"
                            placeholder="Nome da disciplina"
                            value={subject.name}
                            onChange={(event) =>
                                updateSubject(
                                    subject.id,
                                    "name",
                                    event.target.value
                                )
                            }
                        />

                        <input
                            type="number"
                            placeholder="Nota"
                            min="0"
                            max="10"
                            step="0.1"
                            value={subject.grade}
                            onChange={(event) =>
                                updateSubject(
                                    subject.id,
                                    "grade",
                                    event.target.value
                                )
                            }
                        />

                        <input
                            type="number"
                            placeholder="Peso"
                            min="1"
                            value={subject.weight}
                            onChange={(event) =>
                                updateSubject(
                                    subject.id,
                                    "weight",
                                    event.target.value
                                )
                            }
                        />

                    </div>

                ))}


                <button
                    className="add-subject"
                    onClick={addSubject}
                >
                    + Adicionar disciplina
                </button>


                <div className="average">

                    <strong>
                        Média ponderada:
                    </strong>

                    <span>
                        {calculateAverage()}
                    </span>

                </div>


                <button className="save-grades">
                    Salvar notas
                </button>

            </section>

        </main>

    );
}

export default GradesPage;