const express = require('express');
const oracoesController = require('../controllers/oracoesController.js');


const router = express.Router();

router.get('/',oracoesController.getAll)
router.get('/:id',oracoesController.getById)
router.post('/',oracoesController.create)
router.put('/:id',oracoesController.update)
router.delete('/:id',oracoesController.delete)


module.exports=router