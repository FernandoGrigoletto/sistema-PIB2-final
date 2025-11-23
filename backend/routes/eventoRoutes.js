import { Router } from 'express';
import eventosController from '../controllers/eventosController.js';
import multer from 'multer';
import path from 'path';
import { authenticate } from '../middlewares/auth.js'; // CORRIGIDO: era verifyToken
import { checkRole } from '../middlewares/roleMiddleware.js';

// Configuração de Upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
const router = Router();

// Rotas Públicas (Qualquer um vê)
router.get('/', eventosController.getAll);
router.get('/:id', eventosController.getById);

// Rotas Protegidas (Apenas Admin/Operador cria ou altera)
// OBS: O authenticate vem antes para garantir que tem usuário logado
router.post('/', authenticate, checkRole(['admin', 'operador']), upload.single('arquivo'), eventosController.create);
router.put('/:id', authenticate, checkRole(['admin', 'operador']), upload.single('arquivo'), eventosController.update);
router.delete('/:id', authenticate, checkRole(['admin', 'operador']), eventosController.delete);

export default router;