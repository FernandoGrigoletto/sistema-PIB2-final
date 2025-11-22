const jwt = require('jsonwebtoken');

const USERS = [
    { id: 1, email: 'admin@site.com', password: '123', role: 'admin' },
    { id: 2, email: 'user@site.com', password: '123', role: 'operador' }
];

async function Login(req, res) {
    const { email, password } = req.body;
    const user = USERS.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
        { sub: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN, issuer: 'myapp' }
    );

    res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 
    });

    return res.json({ user: { id: user.id, email: user.email, role: user.role } });
}

async function getMe(req, res) {
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


module.exports = {
    Login,
    getMe
};