import jwt from 'jsonwebtoken';

// Usuários mocados (em um sistema real, viriam do banco de dados)
const USERS = [
    { id: 1, email: 'admin@site.com', password: '123', role: 'admin' },
    { id: 2, email: 'user@site.com', password: '123', role: 'operador' }
];

export async function Login(req, res) {
    const { email, password } = req.body;
    
    // Encontra usuário
    const user = USERS.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Gera o token
    const token = jwt.sign(
        { sub: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d', issuer: 'myapp' }
    );

    // Define o cookie
    res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 1 dia
    });

    return res.json({ 
        success: true,
        user: { id: user.id, email: user.email, role: user.role } 
    });
}

export async function getMe(req, res) {
    // req.user vem do middleware authenticate
    const user = USERS.find(u => u.id === req.user.sub);

    if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    return res.json({
        id: user.id,
        email: user.email,
        role: user.role
    });
}

export async function Logout(req, res) {
    res.clearCookie('auth_token');
    return res.json({ success: true, message: 'Logout realizado' });
}