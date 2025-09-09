// Rutas para endpoints utilitarios y demo
const express = require('express');
const router = express.Router();
const utilController = require('../controllers/utilController');

router.get('/hola', utilController.hola);
router.get('/mongo', utilController.mongo);

module.exports = router;
