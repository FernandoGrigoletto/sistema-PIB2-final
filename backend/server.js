import express, { json } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

import eventosRoutes from './routes/eventoRoutes.js';
import oracaoRoutes from './routes/oracaoRoutes.js';
import fluxoRoutes from './routes/fluxoRoutes.js'; 
import authRoutes from './routes/auth.routes.js'; 

const app = express();
const PORT = 3000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(json());
app.use(cookieParser());

app.use('/api/oracoes', oracaoRoutes);
app.use('/api/eventos', eventosRoutes);
app.use('/api/fluxo', fluxoRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.send('API Online 🚀'));

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});