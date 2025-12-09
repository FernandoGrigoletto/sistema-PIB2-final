const express = require("express");
const membrosController = require("../controllers/membrosController");

const router = express.Router();

// Rotas crud

router.get("/", membrosController.getAll);

router.get("/:id", membrosController.getById);

router.post("/", membrosController.create);

router.put("/:id", membrosController.update);

router.delete("/:id", membrosController.delete);

// validar cpf existente

router.get("/check-cpf", membrosController.checkCpf);

// rota especifica para atualizar status

router.patch("/:id/status", membrosController.updateStatus);

module.exports = router;
