export const APPLICATION_STATUS = {
  pending: { label: 'Enviada', tone: 'slate' },
  under_review: { label: 'Em análise', tone: 'amber' },
  recommended: { label: 'Recomendada', tone: 'indigo' },
  accepted: { label: 'Aprovada', tone: 'green' },
  rejected: { label: 'Não selecionada', tone: 'red' },
  withdrawn: { label: 'Desistência', tone: 'slate' },
}

export const JOB_STATUS = {
  draft: { label: 'Rascunho', tone: 'slate' },
  open: { label: 'Aberta', tone: 'green' },
  closed: { label: 'Encerrada', tone: 'red' },
  filled: { label: 'Preenchida', tone: 'indigo' },
}

export const MODALITY = { presencial: 'Presencial', remoto: 'Remoto', hibrido: 'Híbrido' }

// Regras do TCC (1.1.2): bolsa mínima de R$ 1.000 e nenhuma exigência de conhecimento avançado.
export const MIN_STIPEND = 1000
export const ADVANCED_TERMS = /avan[çc]ad|expert|especialista|s[êe]nior|fluente|profici[êe]ncia/i

export const STATES = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']

export const SKILL_SUGGESTIONS = [
  'Lógica de Programação', 'Estruturas de Dados', 'Banco de Dados', 'Engenharia de Software',
  'Desenvolvimento Web', 'Redes de Computadores', 'Cibersegurança', 'Estatística',
  'Ciência de Dados', 'Inteligência Artificial', 'Cálculo', 'Matemática Discreta',
  'Sistemas Operacionais', 'UX/UI Design', 'Gestão de Projetos', 'Comunicação',
]

export const brl = (v) =>
  v == null ? '—' : Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

export const date = (v) =>
  v ? new Date(v.length === 10 ? `${v}T12:00:00` : v).toLocaleDateString('pt-BR') : '—'

export const nota = (v) =>
  v == null ? '—' : Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

export const place = (city, state) => [city, state].filter(Boolean).join(' / ') || '—'
