//prueba
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
// Middleware CORS personalizado para asegurar cabeceras en todas las respuestas
// Permite orígenes locales (http://localhost:3000) y de producción (https://programacion-tau.vercel.app)
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://programacion-tau.vercel.app', // Frontend en producción (Vercel)
    'http://localhost:3000',               // Frontend en desarrollo local
    process.env.FRONTEND_URL               // Personalizable por variable de entorno
  ].filter(Boolean);
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
app.use(cors(corsOptions));

const instagramTokenRoutes = require('./routes/instagramTokenRoutes');
app.use('/api/instagram-token', instagramTokenRoutes);
const instagramRoutes = require('./routes/instagramRoutes');
app.use('/api/instagram', instagramRoutes);

const interesadoRoutes = require('./routes/interesadoRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const reglaRoutes = require('./routes/reglaRoutes');

const utilRoutes = require('./routes/utilRoutes');
const authRoutes = require('./routes/authRoutes');


const notificacionRoutes = require('./routes/notificacionRoutes');
const accountRoutes = require('./routes/accountRoutes');
const tendenciaRoutes = require('./routes/tendenciaRoutes');

app.use('/api/interesados', interesadoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/reglas', reglaRoutes);
app.use('/api/util', utilRoutes);
app.use('/api/auth', authRoutes);

app.use('/api/notificaciones', notificacionRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/tendencias', tendenciaRoutes);

// Webhook público para Instagram
const webhookRoutes = require('./routes/webhookRoutes');
app.use('/webhook', webhookRoutes);
//prueba
module.exports = app;
