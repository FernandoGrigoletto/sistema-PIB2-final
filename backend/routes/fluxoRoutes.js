import { Router } from 'express';
import { getAllFluxos, addFluxo, updateFluxo, deleteFluxo } from '../controllers/fluxoController.js';

const router = Router();

router.get("/", getAllFluxos);
router.post("/", addFluxo);
router.put("/:id", updateFluxo);
router.delete("/:id", deleteFluxo);

export default router;
