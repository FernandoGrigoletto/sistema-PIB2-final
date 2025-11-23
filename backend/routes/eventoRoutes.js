import { Router } from 'express';
import eventosController from '../controllers/eventosController.js';
import multer from 'multer';
import path from 'path';

// Configuração de Upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // A pasta 'backend/uploads' DEVE existir
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
const router = Router();

router.get('/', eventosController.getAll);
router.get('/:id', eventosController.getById);

// IMPORTANTE: Adicione upload.single('arquivo') aqui
router.post('/', upload.single('arquivo'), eventosController.create);
router.put('/:id', upload.single('arquivo'), eventosController.update);
router.delete('/:id', eventosController.delete);

export default router;