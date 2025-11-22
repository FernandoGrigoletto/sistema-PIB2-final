import express, { json } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv

// Importar rotas
import eventosRoutes from './routes/eventoRoutes.js';
import oracaoRoutes from './routes/oracaoRoutes.js';
import fluxoRoutes from './routes/fluxoRoutes.js'; 
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = 3000;

// Configuração do CORS
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// Middlewares
app.use(json());
app.use(cookieParser());

// Rotas da API
app.use('/api/oracoes', oracaoRoutes);
app.use('/api/eventos', eventosRoutes);
app.use('/api/fluxo', fluxoRoutes);
app.use('/api/auth', authRoutes);

// Rota teste
app.get('/', (req, res) => {
    res.send('API do sistema funcionando');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

