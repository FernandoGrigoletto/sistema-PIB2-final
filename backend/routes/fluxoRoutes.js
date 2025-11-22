const express = require("express");
const router = express.Router();
const fluxoController = require("../controllers/fluxoController.js");

// Listar todos os registros
router.get("/", fluxoController.getAllFluxos);

// Adicionar novo registro
router.post("/", fluxoController.addFluxo);

// Atualizar registro
router.put("/:id", fluxoController.updateFluxo);

// Excluir registro
router.delete("/:id", fluxoController.deleteFluxo);

module.exports = router;
