import { Router } from 'express';
// CORRIGIDO: Importando as funções com os nomes que estão no seu controlador
import { getAllFluxos, addFluxo, updateFluxo, deleteFluxo } from '../controllers/fluxoController.js';
import { authenticate } from '../middlewares/auth.js'; // CORRIGIDO: era verifyToken
import { checkRole } from '../middlewares/roleMiddleware.js';

const router = Router();

// 1. Verifica se está logado
router.use(authenticate);

// 2. Verifica se é admin ou operador para TODAS as rotas abaixo
router.use(checkRole(['admin', 'operador']));

router.get("/", getAllFluxos);
router.post("/", addFluxo);
router.put("/:id", updateFluxo);
router.delete("/:id", deleteFluxo);

export default router;
