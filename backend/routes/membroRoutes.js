import { Router } from 'express';
import { getAllMembros, createMembro, updateMembro, deleteMembro } from '../controllers/membroController.js';
import { authenticate } from '../middlewares/auth.js';
import { checkRole } from '../middlewares/roleMiddleware.js';

const router = Router();

// Todas as rotas de membros são protegidas (precisa estar logado)
// Apenas 'admin' e 'operador' podem gerenciar membros
router.use(authenticate); 
router.use(checkRole(['admin', 'operador']));

router.get('/', getAllMembros);
router.post('/', createMembro);
router.put('/:id', updateMembro);
router.delete('/:id', deleteMembro);

export default router;
