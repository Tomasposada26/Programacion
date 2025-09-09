// src/routes/interesadoRoutes.js
const express = require('express');
const router = express.Router();
const interesadoController = require('../controllers/interesadoController');

router.post('/subscribe', interesadoController.subscribe);

module.exports = router;
