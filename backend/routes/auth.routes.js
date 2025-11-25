import { Router } from 'express';
import { getMe, Login, Logout, Register, ForgotPassword } from '../controllers/authcontroller.js';
// Importar os middlewares
import { authenticate } from '../middlewares/auth.js';
import { checkRole } from '../middlewares/roleMiddleware.js';

const router = Router();

router.post('/login', Login);
router.post('/logout', Logout);
router.post('/forgot-password', ForgotPassword);

// ALTERAÇÃO AQUI: Rota de registro agora exige autenticação e papel de 'admin'
router.post('/register', authenticate, checkRole(['admin']), Register);

router.get('/me', authenticate, getMe);

export default router;