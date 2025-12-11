import jwt from 'jsonwebtoken';
import db from '../config/database.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// Login
export async function Login(req, res) {
    const { email, password } = req.body;
    
    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
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

        // Parse das permissões (se existirem)
        let permissions = {};
        try {
            permissions = user.permissions ? JSON.parse(user.permissions) : {};
        } catch (e) {
            permissions = {};
        }

        return res.json({ 
            success: true,
            user: { 
                id: user.id, 
                nome: user.nome, 
                email: user.email, 
                role: user.role,
                permissions: permissions 
            } 
        });

    } catch (error) {
        console.error("Erro no Login:", error);
        return res.status(500).json({ error: 'Erro no servidor' });
    }
}

// Cadastro (Atualizado para aceitar Role e Permissões)
export async function Register(req, res) {
    const { nome, email, password, role, permissions } = req.body;

    if (!nome || !email || !password) {
        return res.status(400).json({ error: 'Preencha todos os campos obrigatórios' });
    }

    try {
        const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Este email já está cadastrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Define o papel (padrão 'membro' se não vier nada)
        const userRole = role || 'membro';
        
        // Prepara as permissões como JSON string
        const permissionsString = permissions ? JSON.stringify(permissions) : '{}';

        await db.execute(
            'INSERT INTO users (nome, email, password, role, permissions) VALUES (?, ?, ?, ?, ?)',
            [nome, email, hashedPassword, userRole, permissionsString]
        );

        return res.status(201).json({ success: true, message: 'Usuário cadastrado com sucesso!' });

    } catch (error) {
        console.error("Erro no Cadastro:", error);
        return res.status(500).json({ error: 'Erro ao cadastrar usuário' });
    }
}

// Obter Usuário Atual
export async function getMe(req, res) {
    try {
        // Agora busca também a coluna permissions
        const [rows] = await db.execute('SELECT id, nome, email, role, permissions FROM users WHERE id = ?', [req.user.sub]);
        const user = rows[0];

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        try {
            user.permissions = user.permissions ? JSON.parse(user.permissions) : {};
        } catch (e) {
            user.permissions = {};
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

// ForgotPassword
export async function ForgotPassword(req, res) {
    const { email } = req.body;
    try {
        const [user] = await db.execute('SELECT id, nome FROM users WHERE email = ?', [email]);
        if (user.length === 0) return res.json({ success: true, message: 'Se o e-mail existir, você receberá um link.' });
        
        const token = crypto.randomBytes(20).toString('hex');
        const now = new Date();
        now.setHours(now.getHours() + 1);
        
        await db.execute('UPDATE users SET reset_token = ?, reset_expires = ? WHERE id = ?', [token, now, user[0].id]);
        
        const resetLink = `http://localhost:5173/reset-password/${token}`;
        console.log(`Link: ${resetLink}`);
        
        return res.json({ success: true, message: 'Link de recuperação enviado (verifique o console).' });
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao processar solicitação.' });
    }
}

// --- AQUI ESTÁ A FUNÇÃO QUE FALTAVA ---
// Listar todos os utilizadores (Necessário para a rota /users)
export async function getAllUsers(req, res) {
    try {
        // Incluindo role e permissions na listagem
        const [users] = await db.execute('SELECT id, nome, email, role, permissions FROM users');
        
        // Opcional: fazer parse das permissões para cada usuário antes de enviar
        const usersFormatted = users.map(user => {
            try {
                user.permissions = user.permissions ? JSON.parse(user.permissions) : {};
            } catch (e) {
                user.permissions = {};
            }
            return user;
        });

        return res.json(usersFormatted);
    } catch (error) {
        console.error("Erro ao listar usuários:", error);
        return res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
}