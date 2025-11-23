import { Router } from 'express';
// Adicione ForgotPassword na importação abaixo
import { getMe, Login, Logout, Register, ForgotPassword } from '../controllers/authcontroller.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.post('/login', Login);
router.post('/logout', Logout);
router.post('/register', Register);
router.post('/forgot-password', ForgotPassword); // Nova rota
router.get('/me', authenticate, getMe);

export default router;