import jwt from 'jsonwebtoken';
import db from '../config/database.js'; // Importar conexão com o banco

// Login usando banco de dados
export async function Login(req, res) {
    const { email, password } = req.body;
    
    try {
        // Buscar usuário no banco
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
        const user = rows[0];

        if (!user) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        // Gerar Token
        const token = jwt.sign(
            { sub: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1d', issuer: 'myapp' }
        );

        // Definir Cookie
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

// Novo: Cadastro de Usuário
export async function Register(req, res) {
    const { nome, email, password } = req.body;

    if (!nome || !email || !password) {
        return res.status(400).json({ error: 'Preencha todos os campos' });
    }

    try {
        // Verificar se email já existe
        const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Este email já está cadastrado' });
        }

        // Inserir novo usuário (role padrão: membro)
        const [result] = await db.execute(
            'INSERT INTO users (nome, email, password, role) VALUES (?, ?, ?, ?)',
            [nome, email, password, 'membro']
        );

        return res.status(201).json({ success: true, message: 'Usuário cadastrado com sucesso!' });

    } catch (error) {
        return res.status(500).json({ error: 'Erro ao cadastrar: ' + error.message });
    }
}

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

export async function Logout(req, res) {
    res.clearCookie('auth_token');
    return res.json({ success: true, message: 'Logout realizado' });
}