// src/routes/reglaRoutes.js
const express = require('express');
const router = express.Router();
const reglaController = require('../controllers/reglaController');

router.post('/', reglaController.create);
router.post('/:id/duplicar', reglaController.duplicate);
router.get('/', reglaController.getAll);
router.get('/:id', reglaController.getById);
router.put('/:id', reglaController.update);
router.delete('/:id', reglaController.delete);
router.patch('/:id/estado', reglaController.updateEstado);

module.exports = router;
