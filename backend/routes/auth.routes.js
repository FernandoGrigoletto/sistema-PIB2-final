import { Router } from 'express';
// O erro acontecia aqui porque o getAllUsers não existia no controller
import { getMe, Login, Logout, Register, ForgotPassword, getAllUsers } from '../controllers/authcontroller.js';
import { authenticate } from '../middlewares/auth.js';
import { checkRole } from '../middlewares/roleMiddleware.js';

const router = Router();

router.post('/login', Login);
router.post('/logout', Logout);
router.post('/forgot-password', ForgotPassword);

// Rotas Protegidas (Apenas Admin)
router.post('/register', authenticate, checkRole(['admin']), Register);
router.get('/users', authenticate, checkRole(['admin']), getAllUsers); // <--- Adicione esta linha se não existir

router.get('/me', authenticate, getMe);

export default router;