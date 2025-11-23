import jwt from 'jsonwebtoken';
import db from '../config/database.js';
import crypto from 'crypto';

// Login
export async function Login(req, res) {
    const { email, password } = req.body;
    
    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
        const user = rows[0];

        if (!user) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const token = jwt.sign(
            { sub: user.id, role: user.role },
            process.env.JWT_SECRET || 'secreta',
            { expiresIn: process.env.JWT_EXPIRES_IN || '1d', issuer: 'myapp' }
        );

        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.json({ 
            success: true,
            user: { id: user.id, nome: user.nome, email: user.email, role: user.role } 
        });

    } catch (error) {
        return res.status(500).json({ error: 'Erro no servidor: ' + error.message });
    }
}

// Cadastro
export async function Register(req, res) {
    const { nome, email, password } = req.body;

    if (!nome || !email || !password) {
        return res.status(400).json({ error: 'Preencha todos os campos' });
    }

    try {
        const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Este email já está cadastrado' });
        }

        await db.execute(
            'INSERT INTO users (nome, email, password, role) VALUES (?, ?, ?, ?)',
            [nome, email, password, 'membro']
        );

        return res.status(201).json({ success: true, message: 'Usuário cadastrado com sucesso!' });

    } catch (error) {
        return res.status(500).json({ error: 'Erro ao cadastrar: ' + error.message });
    }
}

// Obter Usuário Atual
export async function getMe(req, res) {
    try {
        const [rows] = await db.execute('SELECT id, nome, email, role FROM users WHERE id = ?', [req.user.sub]);
        const user = rows[0];

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        return res.json(user);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// Logout
export async function Logout(req, res) {
    res.clearCookie('auth_token');
    return res.json({ success: true, message: 'Logout realizado' });
}

// Esqueci a Senha
export async function ForgotPassword(req, res) {
    const { email } = req.body;

    try {
        const [user] = await db.execute('SELECT id, nome FROM users WHERE email = ?', [email]);

        if (user.length === 0) {
            return res.json({ success: true, message: 'Se o e-mail existir, você receberá um link.' });
        }

        const token = crypto.randomBytes(20).toString('hex');
        const now = new Date();
        now.setHours(now.getHours() + 1);

        await db.execute(
            'UPDATE users SET reset_token = ?, reset_expires = ? WHERE id = ?',
            [token, now, user[0].id]
        );

        const resetLink = `http://localhost:5173/reset-password/${token}`;
        
        console.log("==================================================");
        console.log("📧 EMAIL DE RECUPERAÇÃO (SIMULADO):");
        console.log(`Para: ${email}`);
        console.log(`Link: ${resetLink}`);
        console.log("==================================================");

        return res.json({ success: true, message: 'Link de recuperação enviado (verifique o console).' });

    } catch (error) {
        return res.status(500).json({ error: 'Erro ao processar solicitação.' });
    }
}