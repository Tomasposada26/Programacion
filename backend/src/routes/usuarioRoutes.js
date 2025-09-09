// src/routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.get('/api/usuario/info', usuarioController.getInfo);

router.post('/api/usuario/update', usuarioController.update);
router.post('/api/usuario/delete', usuarioController.delete);

module.exports = router;
