import { Router } from 'express';
import { getMe, Login, Logout } from '../controllers/authcontroller.js'; // Nome corrigido
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.post('/login', Login); // Alterado para /login ficar explicito (/api/auth/login)
router.post('/logout', Logout);
router.get('/me', authenticate, getMe);

export default router;