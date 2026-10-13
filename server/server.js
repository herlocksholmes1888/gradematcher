import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conectar ao banco de dados
connectDB();

// Rotas
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);

// Rota teste
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando corretamente!' });
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro no servidor' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
