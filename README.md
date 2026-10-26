# Gradematcher

> Projeto de conclusão de curso — Ciência da Computação, 2026.

O **Gradematcher** conecta candidatos e empresas a partir do histórico acadêmico. Candidatos cadastram seu perfil, curso, grade curricular e notas; empresas publicam vagas com cursos e habilidades desejados; a aplicação cruza essas informações para encontrar o melhor encaixe entre as partes. Seu principal objetivo é fazer com que alunos se conectem a oportunidades não-exploratórias, e tenham a oportunidade de concluir seus estudos com experiência no mercado de trabalho. 

## Sumário

- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e execução](#instalação-e-execução)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [API](#api)
- [Autor](#autor)
- [Licença](#licença)

## Funcionalidades

- Cadastro e login de usuários (candidatos e empresas)
- Perfil de candidato: data prevista de formatura, CRA/GPA, bio, currículo e LinkedIn
- Perfil de empresa: razão/nome, CNPJ, site, setor, descrição, logo e localização
- Publicação de vagas com cursos e habilidades associados
- Candidaturas a vagas
- Cruzamento entre notas/disciplinas do candidato e requisitos da vaga

## Tecnologias

| Camada | Tecnologia |
| --- | --- |
| Backend | Node.js, Express |
| Banco de dados e autenticação | Supabase (PostgreSQL) |
| Frontend | _a preencher (ex.: React)_ |

## Estrutura do repositório

```
gradematcher/
├── client/          # Aplicação frontend
├── server/          # API em Node.js + Express
├── src/             # Código-fonte compartilhado / frontend
├── graphify-out/    # Saídas geradas (grafo do código)
└── README.md
```

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- npm (ou yarn/pnpm)
- Um projeto no [Supabase](https://supabase.com/) com as tabelas acima criadas

## Instalação e execução

```bash
# 1. Clone o repositório
git clone https://github.com/herlocksholmes1888/gradematcher.git
cd gradematcher
```

### Backend

```bash
cd server
npm install
cp .env.example .env   # preencha as variáveis (veja abaixo)
npm run dev            # ou: npm start
```

### Frontend

```bash
cd client
npm install
npm run dev            # ou: npm start
```

## Variáveis de ambiente

Crie um arquivo `.env` em `server/`:

```env
PORT=3000
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anon
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role
JWT_SECRET=um-segredo-forte
```

> ⚠️ Nunca faça commit do `.env`. A `SUPABASE_SERVICE_ROLE_KEY` dá acesso total ao banco e deve ficar apenas no servidor.

## API

Os endpoints são em português. Exemplo da base de autenticação:

| Método | Rota | Descrição |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Cria um novo usuário (candidato ou empresa) |
| `POST` | `/api/auth/login` | Autentica e retorna o token de acesso |
| `GET` | `/api/profile` | Retorna o perfil do usuário autenticado |

### Exemplo de requisição

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario@exemplo.com", "senha": "123456"}'
```

## Autor

**Andrey Sousa** - [github.com/AndreyKing1](https://github.com/AndreyKing1)
**Cristopher Martins** - [github.com/Cristopher-S-E](https://github.com/Cristopher-S-E)
**Luan Martins** - [github.com/LuanMBasilio](https://github.com/LuanMBasilio)
**Luisa Frugoli** — [github.com/herlocksholmes1888](https://github.com/herlocksholmes1888)

Trabalho de Conclusão de Curso — Ciência da Computação, 2026. Grupo orientado pelo Prof. Dr. José Augusto Theodoro Pazetti.