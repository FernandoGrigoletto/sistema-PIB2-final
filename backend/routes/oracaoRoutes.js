import { Router } from 'express';
import oracoesController from '../controllers/oracoesController.js';

const router = Router();

router.get('/', oracoesController.getAll);
router.get('/:id', oracoesController.getById);
router.post('/', oracoesController.create);
router.put('/:id', oracoesController.update);
router.delete('/:id', oracoesController.delete);

export default router;