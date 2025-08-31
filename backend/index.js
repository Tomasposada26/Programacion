// Importar el modelo de reglas automáticas
const Regla = require('./models/Regla');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Endpoint para cambiar la contraseña después de verificar el código
app.post('/api/recovery/reset', async (req, res) => {
  const { email, password, repeat } = req.body;
  if (!email || !password || !repeat) return res.status(400).json({ error: 'Faltan datos' });
  // Validación de seguridad
  const isSecure = password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password);
  if (!isSecure) return res.status(400).json({ error: 'La contraseña no cumple con los requisitos de seguridad.' });
  if (password !== repeat) return res.status(400).json({ error: 'Las contraseñas no coinciden.' });
  try {
    const user = await pool.query('SELECT id FROM usuario WHERE correo=$1', [email]);
    if (user.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    const hash = await bcrypt.hash(password, 10);
    await pool.query('UPDATE usuario SET contrasena=$1, codigo_recuperacion=NULL, codigo_recuperacion_enviado=NULL WHERE correo=$2', [hash, email]);
    res.json({ ok: true });
  } catch (err) {
    console.error('Error al cambiar la contraseña:', err);
    res.status(500).json({ error: 'Error al cambiar la contraseña' });
  }
});

// Endpoint para obtener datos reales del usuario por username o correo
app.get('/api/usuario/info', async (req, res) => {
  const { usuario } = req.query;
  if (!usuario) return res.status(400).json({ error: 'Falta el parámetro usuario' });
  try {
    const result = await pool.query('SELECT nombre, apellidos, usuario, correo, ultima_conexion FROM usuario WHERE usuario=$1 OR correo=$1', [usuario]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    // Renombrar campos para frontend
    const user = result.rows[0];
    res.json({
      nombre: user.nombre,
      apellidos: user.apellidos,
      username: user.usuario,
      email: user.correo,
      ultimaConexion: user.ultima_conexion
    });
  } catch (err) {
    console.error('Error al obtener usuario:', err);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});
// Endpoint para actualizar nombre y apellidos del usuario
app.post('/api/usuario/update', async (req, res) => {
  const { nombre, apellidos, correo } = req.body;
  if (!nombre || !apellidos || !correo) {
    return res.status(400).json({ error: 'Faltan datos' });
  }
  try {
    await pool.query('UPDATE usuario SET nombre=$1, apellidos=$2 WHERE correo=$3', [nombre, apellidos, correo]);
    res.json({ ok: true });
  } catch (err) {
    console.error('Error al actualizar usuario:', err);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// --- CRUD reglas automáticas (MongoDB) ---
// Crear una nueva regla
app.post('/api/reglas', async (req, res) => {
  console.log('Petición recibida en /api/reglas:', req.body);
  try {
    const nueva = new Regla(req.body);
    await nueva.save();
    res.status(201).json(nueva);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Duplicar una regla por ID
app.post('/api/reglas/:id/duplicar', async (req, res) => {
  try {
    const original = await Regla.findById(req.params.id);
    if (!original) return res.status(404).json({ error: 'Regla no encontrada' });
    // Crear copia sin _id ni timestamps
    const copia = original.toObject();
    delete copia._id;
    delete copia.createdAt;
    delete copia.updatedAt;
    const nueva = new Regla(copia);
    await nueva.save();
    res.status(201).json(nueva);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Obtener todas las reglas
app.get('/api/reglas', async (req, res) => {
  try {
    const reglas = await Regla.find();
    res.json(reglas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener una regla por ID
app.get('/api/reglas/:id', async (req, res) => {
  try {
    const regla = await Regla.findById(req.params.id);
    if (!regla) return res.status(404).json({ error: 'Regla no encontrada' });
    res.json(regla);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar una regla por ID
app.put('/api/reglas/:id', async (req, res) => {
  try {
    // Permitir actualizar solo el mensaje de respuesta si solo ese campo viene
    const update = {};
    if (typeof req.body.respuestaAutomatica === 'string') {
      update.respuestaAutomatica = req.body.respuestaAutomatica;
    }
    // Permitir otros campos si se envían
    Object.assign(update, req.body);
    const reglaActualizada = await Regla.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );
    if (!reglaActualizada) return res.status(404).json({ error: 'Regla no encontrada' });
    res.json(reglaActualizada);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar una regla por ID
app.delete('/api/reglas/:id', async (req, res) => {
  try {
    const reglaEliminada = await Regla.findByIdAndDelete(req.params.id);
    if (!reglaEliminada) return res.status(404).json({ error: 'Regla no encontrada' });
    res.json({ mensaje: 'Regla eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Cambiar el estado de una regla (activa/inactiva)
app.patch('/api/reglas/:id/estado', async (req, res) => {
  const { estado } = req.body;
  if (!['activa', 'inactiva'].includes(estado)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }
  try {
    const regla = await Regla.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true, runValidators: true }
    );
    if (!regla) return res.status(404).json({ error: 'Regla no encontrada' });
    res.json(regla);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// --- Fin CRUD reglas automáticas ---

// Endpoint para registrar interesados en la newsletter
app.post('/api/interesados', async (req, res) => {
  // ...existing code...
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: 'Correo inválido' });
  }
  try {
    // Crear tabla si no existe (solo la primera vez)
    await pool.query(`CREATE TABLE IF NOT EXISTS interesados (
      id SERIAL PRIMARY KEY,
      email VARCHAR(120) UNIQUE NOT NULL,
      fecha TIMESTAMP DEFAULT NOW()
    )`);
    // Insertar correo si no existe
    await pool.query('INSERT INTO interesados (email) VALUES ($1) ON CONFLICT DO NOTHING', [email]);
    // Enviar correo de confirmación
    await transporter.sendMail({
      from: 'Aura <aurainstacms@gmail.com>',
      to: email,
      subject: '¡Gracias por tu interés en Aura!',
      html: `
<div style="background:#f4f6fb;padding:0;margin:0;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:40px auto;background:#fff;border-radius:16px;box-shadow:0 2px 12px #0001;overflow:hidden;">
    <tr>
  <td style="background:#188fd9;padding:32px 0;text-align:center;">
        <h1 style="color:#fff;font-size:2.1em;margin:0;font-weight:800;letter-spacing:2px;">Aura</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:32px 32px 16px 32px;">
        <p style="font-size:1.1em;color:#222;margin:0 0 12px 0;">¡Gracias por suscribirte!</p>
        <p style="font-size:1.1em;color:#222;margin:0 0 18px 0;">Pronto recibirás novedades y recursos exclusivos sobre automatización y Aura.</p>
      </td>
    </tr>
    <tr>
      <td style="background:#f4f6fb;padding:18px 32px;text-align:center;color:#888;font-size:0.98em;border-top:1px solid #eee;">
        Saludos,<br>El equipo de Aura
      </td>
    </tr>
  </table>
</div>
`
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('Error al registrar interesado:', err);
    res.status(500).json({ error: 'No se pudo registrar tu interés.' });
  }
});

const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'aura',
  password: process.env.PG_PASSWORD || '0626',
  port: process.env.PG_PORT ? parseInt(process.env.PG_PORT) : 5432,
  ssl: { rejectUnauthorized: false }
});

pool.connect()
  .then(() => {
    console.log('Conectado a PostgreSQL');
  })
  .catch(err => {
    console.error('Error de conexión a PostgreSQL:', err);
  });

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/aura');

mongoose.connection.on('connected', () => {
  console.log('Conectado a MongoDB Atlas');
});
mongoose.connection.on('error', (err) => {
  console.error('Error de conexión a MongoDB:', err);
});

// Configuración de nodemailer para Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'aurainstacms@gmail.com',
    pass: process.env.EMAIL_PASS || 'haqd tzxe jxnl njgr', // Contraseña de aplicación
  },
});

// Secreto JWT
const JWT_SECRET = process.env.JWT_SECRET || 'mi_super_secreto';

// Generar código de verificación de 6 dígitos
function generarCodigo() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Middleware para verificar JWT
function authMiddleware(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth) return res.status(401).json({ error: 'Token requerido' });
  const token = auth.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token inválido' });
    req.user = decoded;
    next();
  });
}

// Endpoint para reenviar código de verificación (para cuentas no verificadas)
app.post('/api/reenviar-verificacion', async (req, res) => {
  const { correo } = req.body;
  if (!correo) {
    return res.status(400).json({ error: 'Correo requerido' });
  }
  try {
    // Buscar usuario
    const userResult = await pool.query('SELECT * FROM usuario WHERE correo=$1', [correo]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const user = userResult.rows[0];
    if (user.verificado) {
      return res.status(400).json({ error: 'La cuenta ya está verificada' });
    }
    // Generar nuevo código y timestamp
    const codigo = generarCodigo();
    const now = new Date();
    await pool.query('UPDATE usuario SET codigo_verificacion=$1, codigo_verificacion_enviado=$2 WHERE correo=$3', [codigo, now, correo]);
    // Enviar correo igual que en registro
    await transporter.sendMail({
      from: 'Aura <aurainstacms@gmail.com>',
      to: correo,
      subject: 'Verifica tu cuenta en Aura',
      html: `
<div style="background:#f4f6fb;padding:0;margin:0;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:40px auto;background:#fff;border-radius:16px;box-shadow:0 2px 12px #0001;overflow:hidden;">
    <tr>
  <td style="background:#188fd9;padding:32px 0;text-align:center;">
        <h1 style="color:#fff;font-size:2.1em;margin:0;font-weight:800;letter-spacing:2px;">Bienvenido a Aura</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:32px 32px 16px 32px;">
        <p style="font-size:1.1em;color:#222;margin:0 0 12px 0;">Hola <b>${user.nombre}</b>,</p>
        <p style="font-size:1.1em;color:#222;margin:0 0 18px 0;">¡Gracias por unirte a <b>Aura</b>! Para confirmar tu cuenta y mantenerla segura, utiliza el siguiente código de verificación:</p>
        <div style="background:#f4f6fb;border-radius:12px;padding:24px 0;margin:0 0 18px 0;text-align:center;">
          <span style="display:inline-block;font-size:2.2em;letter-spacing:12px;font-weight:900;color:#6366f1;font-family:monospace;background:#fff;padding:12px 32px;border-radius:8px;border:2px solid #6366f1;box-shadow:0 2px 8px #6366f133;">${codigo}</span>
        </div>
        <p style="font-size:1em;color:#444;margin:0 0 12px 0;">Este código es válido por los próximos <b>10 minutos</b>.<br>Si no solicitaste esta verificación, puedes ignorar este correo.</p>
        <p style="font-size:1em;color:#6366f1;font-weight:600;margin:0 0 12px 0;">Bienvenido a la comunidad Aura ✨</p>
      </td>
    </tr>
    <tr>
      <td style="background:#f4f6fb;padding:18px 32px;text-align:center;color:#888;font-size:0.98em;border-top:1px solid #eee;">
        Saludos,<br>El equipo de Aura
      </td>
    </tr>
  </table>
</div>
`
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('Error al reenviar verificación:', err);
    res.status(500).json({ error: 'Error al reenviar el correo de verificación' });
  }
});

// Endpoint para reenviar código de recuperación de contraseña
app.post('/api/reenviar-codigo', async (req, res) => {
  const { correo } = req.body;
  if (!correo) {
    return res.status(400).json({ error: 'Correo requerido' });
  }
  try {
    // Buscar usuario
    const userResult = await pool.query('SELECT * FROM usuario WHERE correo=$1', [correo]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const user = userResult.rows[0];
    // Generar nuevo código y timestamp para recuperación
    const codigo = generarCodigo();
    const now = new Date();
    await pool.query('UPDATE usuario SET codigo_recuperacion=$1, codigo_recuperacion_enviado=$2 WHERE correo=$3', [codigo, now, correo]);
    // Enviar correo de recuperación
    await transporter.sendMail({
      from: 'Aura <aurainstacms@gmail.com>',
      to: correo,
      subject: 'Nuevo código de recuperación',
      html: `
<div style="background:#f4f6fb;padding:0;margin:0;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:40px auto;background:#fff;border-radius:16px;box-shadow:0 2px 12px #0001;overflow:hidden;">
    <tr>
  <td style="background:#188fd9;padding:32px 0;text-align:center;">
        <h1 style="color:#fff;font-size:2.1em;margin:0;font-weight:800;letter-spacing:2px;">Recupera tu acceso</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:32px 32px 16px 32px;">
        <p style="font-size:1.1em;color:#222;margin:0 0 18px 0;">Tu nuevo código de recuperación es:</p>
        <div style="background:#f4f6fb;border-radius:12px;padding:24px 0;margin:0 0 18px 0;text-align:center;">
          <span style="display:inline-block;font-size:2.2em;letter-spacing:12px;font-weight:900;color:#6366f1;font-family:monospace;background:#fff;padding:12px 32px;border-radius:8px;border:2px solid #6366f1;box-shadow:0 2px 8px #6366f133;">${codigo}</span>
        </div>
        <p style="font-size:1em;color:#444;margin:0 0 12px 0;">Si no solicitaste este código, puedes ignorar este correo.</p>
      </td>
    </tr>
    <tr>
      <td style="background:#f4f6fb;padding:18px 32px;text-align:center;color:#888;font-size:0.98em;border-top:1px solid #eee;">
        Saludos,<br>El equipo de Aura
      </td>
    </tr>
  </table>
</div>
`
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('Error al reenviar código de recuperación:', err);
    res.status(500).json({ error: 'Error al reenviar el código de recuperación' });
  }
});

// Endpoint de login
app.post('/api/login', async (req, res) => {
  const { usuario, contrasena } = req.body;
  if (!usuario || !contrasena) {
    return res.status(400).json({ error: 'Faltan datos' });
  }
  try {
    // Buscar usuario por correo o usuario
    const result = await pool.query('SELECT * FROM usuario WHERE usuario=$1 OR correo=$1', [usuario]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const user = result.rows[0];
    if (!user.verificado) {
      // Solo responde con error, NO envía correo aquí
      return res.status(403).json({ error: 'Cuenta no verificada' });
    }
    const match = await bcrypt.compare(contrasena, user.contrasena);
    if (!match) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }
    // Actualizar ultima_conexion y obtener el valor actualizado
    const updateResult = await pool.query('UPDATE usuario SET ultima_conexion = NOW() WHERE id = $1 RETURNING ultima_conexion', [user.id]);
    const ultimaConexion = updateResult.rows[0]?.ultima_conexion;
    // Generar token JWT válido por 2 horas
    const token = jwt.sign({ id: user.id, usuario: user.usuario, correo: user.correo }, JWT_SECRET, { expiresIn: '2h' });
    res.json({
      ok: true,
      token,
      usuario: user.usuario,
      correo: user.correo,
      ultimaConexion
    });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error en el login' });
  }
});

// Ejemplo de ruta protegida
app.get('/api/perfil', authMiddleware, async (req, res) => {
  res.json({ usuario: req.user.usuario, correo: req.user.correo });
});

// Endpoint de registro
app.post('/api/registro', async (req, res) => {
  const { nombre, apellidos, usuario, correo, contrasena } = req.body;
  if (!nombre || !apellidos || !usuario || !correo || !contrasena) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }
  try {
    // Validar si ya existe usuario/correo
    const existe = await pool.query('SELECT id FROM usuario WHERE usuario=$1 OR correo=$2', [usuario, correo]);
    if (existe.rows.length > 0) {
      return res.status(409).json({ error: 'Usuario o correo ya registrado' });
    }
    // Hash de contraseña
    const hash = await bcrypt.hash(contrasena, 10);
    const codigo = generarCodigo();
    // Insertar usuario no verificado y guardar hora de envío
    const now = new Date();
    await pool.query(
      'INSERT INTO usuario (nombre, apellidos, usuario, correo, contrasena, verificado, codigo_verificacion, codigo_verificacion_enviado) VALUES ($1,$2,$3,$4,$5,false,$6,$7)',
      [nombre, apellidos, usuario, correo, hash, codigo, now]
    );
  // Enviar correo personalizado
  await transporter.sendMail({
      from: 'Aura <aurainstacms@gmail.com>',
      to: correo,
      subject: 'Verifica tu cuenta en Aura',
      html: `
<div style="background:#f4f6fb;padding:0;margin:0;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:40px auto;background:#fff;border-radius:16px;box-shadow:0 2px 12px #0001;overflow:hidden;">
    <tr>
  <td style="background:#188fd9;padding:32px 0;text-align:center;">
        <h1 style="color:#fff;font-size:2.1em;margin:0;font-weight:800;letter-spacing:2px;">Bienvenido a Aura</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:32px 32px 16px 32px;">
        <p style="font-size:1.1em;color:#222;margin:0 0 12px 0;">Hola <b>${nombre}</b>,</p>
        <p style="font-size:1.1em;color:#222;margin:0 0 18px 0;">¡Gracias por unirte a <b>Aura</b>! Para confirmar tu cuenta y mantenerla segura, utiliza el siguiente código de verificación:</p>
        <div style="background:#f4f6fb;border-radius:12px;padding:24px 0;margin:0 0 18px 0;text-align:center;">
          <span style="display:inline-block;font-size:2.2em;letter-spacing:12px;font-weight:900;color:#6366f1;font-family:monospace;background:#fff;padding:12px 32px;border-radius:8px;border:2px solid #6366f1;box-shadow:0 2px 8px #6366f133;">${codigo}</span>
        </div>
        <p style="font-size:1em;color:#444;margin:0 0 12px 0;">Este código es válido por los próximos <b>10 minutos</b>.<br>Si no solicitaste esta verificación, puedes ignorar este correo.</p>
        <p style="font-size:1em;color:#6366f1;font-weight:600;margin:0 0 12px 0;">Bienvenido a la comunidad Aura ✨</p>
      </td>
    </tr>
    <tr>
      <td style="background:#f4f6fb;padding:18px 32px;text-align:center;color:#888;font-size:0.98em;border-top:1px solid #eee;">
        Saludos,<br>El equipo de Aura
      </td>
    </tr>
  </table>
</div>
`
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({ error: 'Error en el registro' });
  }
});

// Endpoint para verificar código
app.post('/api/verificar', async (req, res) => {
  const { correo, codigo } = req.body;
  if (!correo || !codigo) {
    return res.status(400).json({ error: 'Faltan datos' });
  }
  try {
    const user = await pool.query('SELECT id, verificado, codigo_verificacion, codigo_verificacion_enviado FROM usuario WHERE correo=$1', [correo]);
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    if (user.rows[0].verificado) {
      return res.status(400).json({ error: 'Usuario ya verificado' });
    }
    if (user.rows[0].codigo_verificacion !== codigo) {
      return res.status(401).json({ error: 'Código incorrecto' });
    }
    // Validar tiempo de 10 minutos
    const enviado = user.rows[0].codigo_verificacion_enviado;
    if (!enviado) {
      return res.status(400).json({ error: 'No se encontró la hora de envío del código' });
    }
    const ahora = new Date();
    const enviadoDate = new Date(enviado);
    const diffMs = ahora - enviadoDate;
    if (diffMs > 10 * 60 * 1000) {
      return res.status(400).json({ error: 'El código ha expirado. Solicita uno nuevo.' });
    }
    await pool.query('UPDATE usuario SET verificado=true, codigo_verificacion=NULL, codigo_verificacion_enviado=NULL WHERE correo=$1', [correo]);
    res.json({ ok: true });
  } catch (err) {
    console.error('Error en verificación:', err);
    res.status(500).json({ error: 'Error al verificar' });
  }
});

// Endpoint para enviar código de recuperación de contraseña
app.post('/api/recovery', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Correo requerido' });
  try {
    const user = await pool.query('SELECT id, nombre FROM usuario WHERE correo=$1', [email]);
    if (user.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    const codigo = generarCodigo();
    const now = new Date();
    await pool.query('UPDATE usuario SET codigo_recuperacion=$1, codigo_recuperacion_enviado=$2 WHERE correo=$3', [codigo, now, email]);
    await transporter.sendMail({
      from: 'Aura <aurainstacms@gmail.com>',
      to: email,
      subject: 'Restablece tu contraseña en Aura',
      html: `
<div style="background:#f4f6fb;padding:0;margin:0;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:40px auto;background:#fff;border-radius:16px;box-shadow:0 2px 12px #0001;overflow:hidden;">
    <tr>
  <td style="background:#188fd9;padding:32px 0;text-align:center;">
        <h1 style="color:#fff;font-size:2.1em;margin:0;font-weight:800;letter-spacing:2px;">Restablece tu contraseña</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:32px 32px 16px 32px;">
        <p style="font-size:1.1em;color:#222;margin:0 0 12px 0;">Hola <b>${user.rows[0].nombre}</b>,</p>
        <p style="font-size:1.1em;color:#222;margin:0 0 18px 0;">Recibimos una solicitud para restablecer tu contraseña en Aura.<br>Utiliza el siguiente código para continuar con el proceso:</p>
        <div style="background:#f4f6fb;border-radius:12px;padding:24px 0;margin:0 0 18px 0;text-align:center;">
          <span style="display:inline-block;font-size:2.2em;letter-spacing:12px;font-weight:900;color:#6366f1;font-family:monospace;background:#fff;padding:12px 32px;border-radius:8px;border:2px solid #6366f1;box-shadow:0 2px 8px #6366f133;">${codigo}</span>
        </div>
        <p style="font-size:1em;color:#444;margin:0 0 12px 0;">Este código es válido por los próximos <b>10 minutos</b>.<br>Si no solicitaste este restablecimiento, puedes ignorar este correo.</p>
      </td>
    </tr>
    <tr>
      <td style="background:#f4f6fb;padding:18px 32px;text-align:center;color:#888;font-size:0.98em;border-top:1px solid #eee;">
        Saludos,<br>El equipo de Aura
      </td>
    </tr>
  </table>
</div>
`
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('Error en recovery:', err);
    res.status(500).json({ error: 'Error al enviar el código de recuperación' });
  }
});

// Endpoint para verificar código de recuperación
app.post('/api/recovery/verify', async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: 'Faltan datos' });
  try {
    const user = await pool.query('SELECT codigo_recuperacion FROM usuario WHERE correo=$1', [email]);
    if (user.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    if (user.rows[0].codigo_recuperacion !== code) return res.status(400).json({ error: 'Código incorrecto' });
    res.json({ ok: true });
  } catch (err) {
    console.error('Error en recovery verify:', err);
    res.status(500).json({ error: 'Error al verificar el código' });
  }
});

// Hello World para frontend
app.get('/api/hola', (req, res) => {
  res.json({ mensaje: '¡Hola desde el backend de Aura!' });
});

// Prueba conexión PostgreSQL
app.get('/api/postgres', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ postgres: result.rows[0] });
  } catch (err) {
    console.error('Error de conexión a PostgreSQL:', err);
    res.status(500).json({ error: err.message });
  }
});

// Prueba conexión MongoDB
app.get('/api/mongo', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.json({ mongo: 'Conexión exitosa a MongoDB' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor backend de Aura escuchando en puerto ${PORT}`);
});