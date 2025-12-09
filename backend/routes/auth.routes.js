import { Router } from 'express';
// 1. ADICIONE 'getAllUsers' NA IMPORTAÇÃO AQUI:
import { getMe, Login, Logout, Register, ForgotPassword, getAllUsers } from '../controllers/authcontroller.js';

import { authenticate } from '../middlewares/auth.js';
import { checkRole } from '../middlewares/roleMiddleware.js';

const router = Router();

router.post('/login', Login);
router.post('/logout', Logout);
router.post('/forgot-password', ForgotPassword);
router.post('/register', authenticate, checkRole(['admin']), Register);
router.get('/me', authenticate, getMe);

// 2. ADICIONE ESTA LINHA NO FINAL (ANTES DO export default):
// Rota para listar usuários (apenas Admin pode ver)
router.get('/users', authenticate, checkRole(['admin']), getAllUsers);

export default router;