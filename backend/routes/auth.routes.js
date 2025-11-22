import { Router } from 'express';
import { getMe, Login, Logout, Register } from '../controllers/authcontroller.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.post('/login', Login);
router.post('/logout', Logout);
router.post('/register', Register); // Nova rota
router.get('/me', authenticate, getMe);

export default router;