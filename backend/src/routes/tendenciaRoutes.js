const express = require('express');
const router = express.Router();
const tendenciaController = require('../controllers/tendenciaController');

// Tendencias
router.get('/hashtags', tendenciaController.getHashtags);
router.get('/ofertas-por-dia', tendenciaController.getOfertasPorDia);
router.get('/sectores', tendenciaController.getSectores);
router.get('/ciudades', tendenciaController.getCiudades);
// Mock para poblar datos de prueba
router.post('/mock', tendenciaController.mockPopulate);

module.exports = router;
