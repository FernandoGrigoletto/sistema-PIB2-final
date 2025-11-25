import { Router } from 'express';
import oracoesController from '../controllers/oracoesController.js';
// Importar os middlewares de proteção
import { authenticate } from '../middlewares/auth.js';
import { checkRole } from '../middlewares/roleMiddleware.js';

const router = Router();

// GET e POST continuam públicos (qualquer um vê e cria)
router.get('/', oracoesController.getAll);
router.get('/:id', oracoesController.getById);
router.post('/', oracoesController.create);

// PUT e DELETE protegidos (apenas quem tem login pode alterar/apagar)
router.put('/:id', authenticate, checkRole(['admin', 'operador']), oracoesController.update);
router.delete('/:id', authenticate, checkRole(['admin', 'operador']), oracoesController.delete);

export default router;