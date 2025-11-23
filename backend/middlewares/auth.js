import jwt from 'jsonwebtoken';

export function authenticate(req, res, next) { 
    const token = req.cookies.auth_token;
    if (!token) return res.status(401).json({ error: 'Token ausente' });

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'secreta', { issuer: 'myapp' });
        req.user = payload;
        return next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido' });
    }
}