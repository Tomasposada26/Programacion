// src/routes/reglaRoutes.js
const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const reglaController = require('../controllers/reglaController');


router.post('/', authMiddleware, reglaController.create);
router.post('/:id/duplicar', authMiddleware, reglaController.duplicate);
router.get('/', authMiddleware, reglaController.getAll);
router.get('/:id', authMiddleware, reglaController.getById);
router.put('/:id', authMiddleware, reglaController.update);
router.delete('/:id', authMiddleware, reglaController.delete);
router.patch('/:id/estado', authMiddleware, reglaController.updateEstado);

module.exports = router;
