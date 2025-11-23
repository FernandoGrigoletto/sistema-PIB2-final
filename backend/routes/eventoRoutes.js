import { Router } from 'express';
import eventosController from '../controllers/eventosController.js';

const router = Router();

router.get('/', eventosController.getAll);
router.get('/:id', eventosController.getById);
router.post('/', eventosController.create);
router.put('/:id', eventosController.update);
router.delete('/:id', eventosController.delete);

export default router;