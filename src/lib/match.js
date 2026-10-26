// Motor de recomendação (TCC, seção 2.3.1): Média Ponderada Acadêmica.
//   S = Σ(Ni × Pi) ÷ ΣPi
// Ni = nota do candidato na área de conhecimento i (média das disciplinas ligadas àquela skill)
// Pi = peso (1–5) atribuído pela empresa à área i na vaga.
// Áreas sem nota contam como 0, para que a cobertura do histórico pese no score.

export const DEFAULT_THRESHOLD = 7

// grades: [{ grade, subjects: { skill_id } }]  →  Map(skill_id → média)
export function gradesBySkill(grades = []) {
  const acc = new Map()
  for (const g of grades) {
    const skill = g.subjects?.skill_id
    if (!skill) continue
    const cur = acc.get(skill) ?? { sum: 0, n: 0 }
    cur.sum += Number(g.grade)
    cur.n += 1
    acc.set(skill, cur)
  }
  return new Map([...acc].map(([k, v]) => [k, v.sum / v.n]))
}

// jobSkills: [{ skill_id, weight, skills: { name } }]
// Sem áreas definidas na vaga, cai para o coeficiente de rendimento (gpa).
export function computeMatch(jobSkills = [], skillGrades = new Map(), gpa = null) {
  if (!jobSkills.length) {
    return { score: gpa != null ? Number(gpa) : null, breakdown: [], coverage: null, basis: 'gpa' }
  }
  let num = 0
  let den = 0
  let covered = 0
  const breakdown = jobSkills.map((js) => {
    const g = skillGrades.get(js.skill_id)
    if (g != null) covered += 1
    num += (g ?? 0) * js.weight
    den += js.weight
    return { skillId: js.skill_id, name: js.skills?.name ?? '—', weight: js.weight, grade: g ?? null }
  })
  breakdown.sort((a, b) => b.weight - a.weight)
  return { score: den ? num / den : null, breakdown, coverage: covered / jobSkills.length, basis: 'skills' }
}

export function isRecommended(score, minGpa) {
  if (score == null) return false
  return score >= (minGpa != null ? Number(minGpa) : DEFAULT_THRESHOLD)
}
