import { Router } from 'express';
import { 
    getAllMembros, 
    createMembro, 
    updateMembro, 
    deleteMembro 
} from '../controllers/membrosController.js';
import { authenticate } from '../middlewares/auth.js';
import { checkRole } from '../middlewares/roleMiddleware.js';

const router = Router();


router.get('/', authenticate, getAllMembros);
router.post('/', authenticate, createMembro);
router.put('/:id', authenticate, updateMembro);
router.delete('/:id', authenticate, checkRole(['admin']), deleteMembro); // Exemplo: só admin deleta

export default router;
