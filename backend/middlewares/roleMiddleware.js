// backend/middlewares/roleMiddleware.js
export function checkRole(allowedRoles) {
    return (req, res, next) => {
        // O req.user é preenchido pelo middleware de autenticação (auth.js)
        // Supondo que req.user tenha { id, role }
        
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: 'Acesso negado. Você não tem permissão para realizar esta ação.' 
            });
        }
        
        next();
    };
}