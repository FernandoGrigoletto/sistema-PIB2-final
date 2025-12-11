import express, { json } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

import eventosRoutes from './routes/eventoRoutes.js';
import oracaoRoutes from './routes/oracaoRoutes.js';
import fluxoRoutes from './routes/fluxoRoutes.js'; 
import authRoutes from './routes/auth.routes.js'; 
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import userRoutes from './routes/userRoutes.js';
import membrosRoutes from './routes/membrosRoutes.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
    console.log('Pasta uploads criada com sucesso!');
}

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
app.use('/api/membros', membrosRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/', (req, res) => res.send('API Online 🚀'));
app.use('/api/users', userRoutes);
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});