import { Router } from 'express';
import userController from '../controllers/userController.js';
import { authenticate } from '../middlewares/auth.js';
import { checkRole } from '../middlewares/roleMiddleware.js';

const router = Router();

// Todas as rotas abaixo exigem Login E permissão de ADMIN
router.use(authenticate);
router.use(checkRole(['admin']));

router.get('/', userController.getAll);
router.post('/', userController.create);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);

export default router;