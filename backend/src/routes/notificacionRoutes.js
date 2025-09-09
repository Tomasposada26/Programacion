const express = require('express');
const router = express.Router();
const notificacionController = require('../controllers/notificacionController');


// POST /api/notificaciones/guardar
router.post('/guardar', notificacionController.guardarNotificaciones);

// GET /api/notificaciones?userId=usuario
router.get('/', notificacionController.obtenerNotificaciones);

module.exports = router;
