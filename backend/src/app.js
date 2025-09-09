// src/app.js
// Configuración central de la app Express
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Regla = require('./models/Regla');
const Usuario = require('./models/Usuario');
const Interesado = require('./models/Interesado');

const app = express();
app.use(express.json());
const corsOptions = require('./config/cors');
app.use(cors(corsOptions));

const interesadoRoutes = require('./routes/interesadoRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const reglaRoutes = require('./routes/reglaRoutes');

const utilRoutes = require('./routes/utilRoutes');
const authRoutes = require('./routes/authRoutes');
const notificacionRoutes = require('./routes/notificacionRoutes');


app.use('/api/interesados', interesadoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/reglas', reglaRoutes);
app.use('/api/util', utilRoutes);
app.use('/api/auth', authRoutes);

app.use('/api/notificaciones', notificacionRoutes);

// Webhook público para Instagram
const webhookRoutes = require('./routes/webhookRoutes');
app.use('/webhook', webhookRoutes);

module.exports = app;
