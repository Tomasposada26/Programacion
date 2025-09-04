// Cambio mínimo para limpiar historial
// --- DEPENDENCIAS Y MODELOS ---
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

// --- CONFIGURACIÓN APP ---
const app = express();
app.use(cors({
  origin: 'https://aura-qivl.onrender.com',
  credentials: true
}));
app.use(express.json());

// --- ENDPOINT INTERESADOS ---
// POST /api/interesados
app.post('/api/interesados', async (req, res) => {
  const { correo } = req.body;
  if (!correo) return res.status(400).json({ error: 'Correo requerido' });
  try {
    let existente = await Interesado.findOne({ correo });
    if (existente) {
      // Enviar correo de agradecimiento aunque ya esté suscrito
      await transporter.sendMail({
        from: 'Aura <aurainstacms@gmail.com>',
        to: correo,
        subject: '¡Gracias por tu interés en Aura!',
        html: `<div style="background:#f4f6fb;padding:0;margin:0;font-family:sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:40px auto;background:#fff;border-radius:16px;box-shadow:0 2px 12px #0001;overflow:hidden;">
            <tr>
              <td style="background:#188fd9;padding:32px 0;text-align:center;">
                <h1 style="color:#fff;font-size:2.1em;margin:0;font-weight:800;letter-spacing:2px;">Aura</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 32px 16px 32px;">
                <p style="font-size:1.1em;color:#222;margin:0 0 12px 0;">¡Gracias por tu interés!</p>
                <p style="font-size:1.1em;color:#222;margin:0 0 18px 0;">Ya tienes una suscripción activa a las novedades de Aura.</p>
              </td>
            </tr>
            <tr>
              <td style="background:#f4f6fb;padding:18px 32px;text-align:center;color:#888;font-size:0.98em;border-top:1px solid #eee;">
                Saludos,<br>El equipo de Aura
              </td>
            </tr>
          </table>
        </div>`
      });
      return res.status(200).json({ ok: false, message: 'Ya tienes una suscripción activa.' });
    }
    const nuevo = new Interesado({ correo });
    await nuevo.save();
    await transporter.sendMail({
      from: 'Aura <aurainstacms@gmail.com>',
      to: correo,
      subject: '¡Gracias por tu interés en Aura!',
      html: `<div style="background:#f4f6fb;padding:0;margin:0;font-family:sans-serif;">
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
      </div>`
    });
    res.json({ ok: true, message: '¡Suscripción exitosa!' });
  } catch (err) {
    console.error('Error al registrar interesado:', err);
    res.status(500).json({ error: 'No se pudo registrar el interesado' });
  }
});

// --- CONEXIÓN MONGODB ---
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/aura');
mongoose.connection.on('connected', () => {
  console.log('Conectado a MongoDB Atlas');
});
mongoose.connection.on('error', (err) => {
  console.error('Error de conexión a MongoDB:', err);
});

// --- NODEMAILER ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'aurainstacms@gmail.com',
    pass: process.env.EMAIL_PASS || 'haqd tzxe jxnl njgr',
  },
});

// --- UTILS ---
const JWT_SECRET = process.env.JWT_SECRET || 'mi_super_secreto';
function generarCodigo() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
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




// --- ENDPOINTS USUARIO ---
// Cambiar contraseña (MongoDB)

// Obtener datos de usuario (MongoDB)
app.get('/api/usuario/info', async (req, res) => {
  const { usuario } = req.query;
  if (!usuario) return res.status(400).json({ error: 'Falta el parámetro usuario' });
  try {
    const user = await Usuario.findOne({ $or: [{ usuario }, { correo: usuario }] });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
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

// Actualizar nombre y apellidos (MongoDB)
app.post('/api/usuario/update', async (req, res) => {
  const { nombre, apellidos, correo } = req.body;
  if (!nombre || !apellidos || !correo) {
    return res.status(400).json({ error: 'Faltan datos' });
  }
  try {
    const user = await Usuario.findOne({ correo });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    user.nombre = nombre;
    user.apellidos = apellidos;
    await user.save();
    res.json({ ok: true });
  } catch (err) {
    console.error('Error al actualizar usuario:', err);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// --- CRUD REGLAS AUTOMÁTICAS ---
app.post('/api/reglas', async (req, res) => {
  try {
    const nueva = new Regla(req.body);
    await nueva.save();
    res.status(201).json(nueva);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/reglas/:id/duplicar', async (req, res) => {
  try {
    const original = await Regla.findById(req.params.id);
    if (!original) return res.status(404).json({ error: 'Regla no encontrada' });
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

app.get('/api/reglas', async (req, res) => {
  try {
    const reglas = await Regla.find();
    res.json(reglas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/reglas/:id', async (req, res) => {
  try {
    const regla = await Regla.findById(req.params.id);
    if (!regla) return res.status(404).json({ error: 'Regla no encontrada' });
    res.json(regla);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/reglas/:id', async (req, res) => {
  try {
    const update = {};
    if (typeof req.body.respuestaAutomatica === 'string') {
      update.respuestaAutomatica = req.body.respuestaAutomatica;
    }
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

app.delete('/api/reglas/:id', async (req, res) => {
  try {
    const reglaEliminada = await Regla.findByIdAndDelete(req.params.id);
    if (!reglaEliminada) return res.status(404).json({ error: 'Regla no encontrada' });
    res.json({ mensaje: 'Regla eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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

// --- RECUPERACIÓN DE CONTRASEÑA ---
// Solicitar recuperación: genera y envía código
app.post('/api/recovery/request', async (req, res) => {
  const { correo } = req.body;
  if (!correo) return res.status(400).json({ error: 'Correo requerido' });
  try {
    const user = await Usuario.findOne({ correo });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    const codigo = generarCodigo();
    user.codigo_recuperacion = codigo;
    user.codigo_recuperacion_enviado = new Date();
    await user.save();
    await transporter.sendMail({
      from: 'Aura <aurainstacms@gmail.com>',
      to: correo,
      subject: 'Recupera tu acceso a Aura: Código de recuperación',
      html: `
        <div style="background:#f4f6fb;padding:0;margin:0;font-family:sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:40px auto;background:#fff;border-radius:18px;box-shadow:0 2px 16px #0002;overflow:hidden;">
            <tr>
              <td style="background:#188fd9;padding:36px 0;text-align:center;">
                <img src="https://aura-frontend-tomasposada26.vercel.app/logo192.png" alt="Aura" width="64" height="64" style="margin-bottom:12px;border-radius:12px;" />
                <h1 style="color:#fff;font-size:2.2em;margin:0;font-weight:900;letter-spacing:2px;">Recupera tu acceso a Aura</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 36px 18px 36px;">
                <p style="font-size:1.15em;color:#222;margin:0 0 16px 0;">Hola,</p>
                <p style="font-size:1.1em;color:#222;margin:0 0 18px 0;">Recibimos una solicitud para restablecer la contraseña de tu cuenta en <b>Aura</b>. Si fuiste tú, utiliza el siguiente código para continuar con el proceso:</p>
                <div style="background:#f4f6fb;border-radius:14px;padding:24px 0;margin:0 0 18px 0;text-align:center;">
                  <span style="display:inline-block;font-size:2.3em;letter-spacing:12px;font-weight:900;color:#6366f1;font-family:monospace;background:#fff;padding:14px 36px;border-radius:10px;border:2px solid #6366f1;box-shadow:0 2px 8px #6366f133;">${codigo}</span>
                </div>
                <p style="font-size:1em;color:#444;margin:0 0 12px 0;">Este código es válido por los próximos <b>10 minutos</b>. Si no solicitaste este cambio, puedes ignorar este correo y tu contraseña seguirá siendo la misma.</p>
                <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
                <p style="font-size:1.05em;color:#222;margin:0 0 10px 0;"><b>¿Necesitas ayuda?</b></p>
                <p style="font-size:1em;color:#444;margin:0 0 18px 0;">Nuestro equipo está disponible para ayudarte en cualquier momento. Responde a este correo o escríbenos a <a href="mailto:soporte@aura.com" style="color:#188fd9;">soporte@aura.com</a>.</p>
                <p style="font-size:1em;color:#6366f1;margin:0 0 12px 0;font-weight:600;">¡Gracias por confiar en Aura!</p>
              </td>
            </tr>
            <tr>
              <td style="background:#f4f6fb;padding:20px 36px;text-align:center;color:#888;font-size:1em;border-top:1px solid #eee;">
                <div style="margin-bottom:6px;">El equipo de Aura</div>
                <div style="font-size:0.98em;">Automatización y gestión inteligente de redes sociales</div>
                <div style="margin-top:8px;">
                  <a href="https://aura-frontend-tomasposada26.vercel.app" style="color:#188fd9;text-decoration:none;font-weight:600;">Visita nuestra web</a>
                </div>
              </td>
            </tr>
          </table>
        </div>
      `
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('Error al solicitar recuperación:', err);
    res.status(500).json({ error: 'Error al solicitar recuperación' });
  }
});

// Verificar código de recuperación
app.post('/api/recovery/verify', async (req, res) => {
  const { correo, codigo } = req.body;
  if (!correo || !codigo) return res.status(400).json({ error: 'Faltan datos' });
  try {
    const user = await Usuario.findOne({ correo });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    if (user.codigo_recuperacion !== codigo) return res.status(400).json({ error: 'Código incorrecto' });
    res.json({ ok: true });
  } catch (err) {
    console.error('Error al verificar código de recuperación:', err);
    res.status(500).json({ error: 'Error al verificar código' });
  }
});

// Cambiar contraseña con código válido
app.post('/api/recovery/reset', async (req, res) => {
  const { correo, codigo, password, repeat } = req.body;
  if (!correo || !codigo || !password || !repeat) return res.status(400).json({ error: 'Faltan datos' });
  if (password !== repeat) return res.status(400).json({ error: 'Las contraseñas no coinciden.' });
  const isSecure = password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password);
  if (!isSecure) return res.status(400).json({ error: 'La contraseña no cumple con los requisitos de seguridad.' });
  try {
    const user = await Usuario.findOne({ correo });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    if (user.codigo_recuperacion !== codigo) return res.status(400).json({ error: 'Código incorrecto' });
    const hash = await bcrypt.hash(password, 10);
    user.contrasena = hash;
    user.codigo_recuperacion = null;
    user.codigo_recuperacion_enviado = null;
    await user.save();
    res.json({ ok: true });
  } catch (err) {
    console.error('Error al cambiar la contraseña:', err);
    res.status(500).json({ error: 'Error al cambiar la contraseña' });
  }
});



// --- ENDPOINTS DE VERIFICACIÓN Y RECUPERACIÓN ---
// Reenviar código de verificación
app.post('/api/reenviar-verificacion', async (req, res) => {
  const { correo } = req.body;
  if (!correo) {
    return res.status(400).json({ error: 'Correo requerido' });
  }
  try {
    const user = await Usuario.findOne({ correo });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    if (user.verificado) {
      return res.status(400).json({ error: 'La cuenta ya está verificada' });
    }
    const codigo = generarCodigo();
    user.codigo_verificacion = codigo;
    user.codigo_verificacion_enviado = new Date();
    await user.save();
    await transporter.sendMail({
      from: 'Aura <aurainstacms@gmail.com>',
      to: correo,
      subject: 'Tu nuevo código de verificación para Aura',
      html: `<div style="background:#f4f6fb;padding:0;margin:0;font-family:sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:40px auto;background:#fff;border-radius:16px;box-shadow:0 2px 12px #0001;overflow:hidden;">
          <tr>
            <td style="background:#6366f1;padding:32px 0;text-align:center;">
              <h1 style="color:#fff;font-size:2.1em;margin:0;font-weight:800;letter-spacing:2px;">Reenvío de código</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 32px 16px 32px;">
              <p style="font-size:1.1em;color:#222;margin:0 0 12px 0;">Hola <b>${user.nombre}</b>,</p>
              <p style="font-size:1.1em;color:#222;margin:0 0 18px 0;">Has solicitado un nuevo código de verificación para tu cuenta en <b>Aura</b>. Utiliza el siguiente código para continuar con la verificación:</p>
              <div style="background:#f4f6fb;border-radius:12px;padding:24px 0;margin:0 0 18px 0;text-align:center;">
                <span style="display:inline-block;font-size:2.2em;letter-spacing:12px;font-weight:900;color:#6366f1;font-family:monospace;background:#fff;padding:12px 32px;border-radius:8px;border:2px solid #6366f1;box-shadow:0 2px 8px #6366f133;">${codigo}</span>
              </div>
              <p style="font-size:1em;color:#444;margin:0 0 12px 0;">Este código es válido por los próximos <b>10 minutos</b>.<br>Si no solicitaste este reenvío, puedes ignorar este correo.</p>
              <p style="font-size:1em;color:#6366f1;font-weight:600;margin:0 0 12px 0;">¡Gracias por confiar en Aura!</p>
            </td>
          </tr>
          <tr>
            <td style="background:#f4f6fb;padding:18px 32px;text-align:center;color:#888;font-size:0.98em;border-top:1px solid #eee;">
              Saludos,<br>El equipo de Aura
            </td>
          </tr>
        </table>
      </div>`
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('Error al reenviar verificación:', err);
    res.status(500).json({ error: 'Error al reenviar el correo de verificación' });
  }
});


// --- ENDPOINTS DE LOGIN/REGISTRO ---
// Login
app.post('/api/login', async (req, res) => {
  console.log('POST /api/login body:', req.body);
  const { usuario, contrasena } = req.body;
  if (!usuario || !contrasena) {
    return res.status(400).json({ error: 'Faltan datos' });
  }
  try {
    const user = await Usuario.findOne({ $or: [{ usuario }, { correo: usuario }] });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    if (!user.verificado) {
      return res.status(403).json({ error: 'Cuenta no verificada' });
    }
    const match = await bcrypt.compare(contrasena, user.contrasena);
    if (!match) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }
    user.ultima_conexion = new Date();
    await user.save();
    const token = jwt.sign({ id: user._id, usuario: user.usuario, correo: user.correo }, JWT_SECRET, { expiresIn: '2h' });
    res.json({
      ok: true,
      token,
      usuario: user.usuario,
      correo: user.correo,
      ultimaConexion: user.ultima_conexion
    });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error en el login' });
  }
});

// Registro
app.post('/api/registro', async (req, res) => {
  const { nombre, apellidos, usuario, correo, contrasena } = req.body;
  if (!nombre || !apellidos || !usuario || !correo || !contrasena) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }
  try {
    const existe = await Usuario.findOne({ $or: [{ usuario }, { correo }] });
    if (existe) return res.status(409).json({ error: 'Usuario o correo ya registrado' });
    const hash = await bcrypt.hash(contrasena, 10);
    const codigo = generarCodigo();
    const nuevoUsuario = new Usuario({
      nombre,
      apellidos,
      usuario,
      correo,
      contrasena: hash,
      verificado: false,
      codigo_verificacion: codigo,
      codigo_verificacion_enviado: new Date()
    });
    await nuevoUsuario.save();
    await transporter.sendMail({
      from: 'Aura <aurainstacms@gmail.com>',
      to: correo,
      subject: 'Verifica tu cuenta en Aura',
      html: `<div style="background:#f4f6fb;padding:0;margin:0;font-family:sans-serif;">
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
      </div>`
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({ error: 'Error en el registro' });
  }
});

// Verificar código de recuperación

// Verificar código de registro y activar cuenta
app.post('/api/verificar', async (req, res) => {
  const { correo, codigo } = req.body;
  if (!correo || !codigo) return res.status(400).json({ error: 'Faltan datos' });
  try {
    const user = await Usuario.findOne({ correo });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    if (user.verificado) return res.status(400).json({ error: 'La cuenta ya está verificada' });
    if (user.codigo_verificacion !== codigo) return res.status(400).json({ error: 'Código incorrecto' });
    // Verificar cuenta
    user.verificado = true;
    user.codigo_verificacion = null;
    user.codigo_verificacion_enviado = null;
    await user.save();
    res.json({ ok: true });
  } catch (err) {
    console.error('Error al verificar la cuenta:', err);
    res.status(500).json({ error: 'Error al verificar la cuenta' });
  }
});

// --- DEMO/UTILIDADES ---
app.get('/api/hola', (req, res) => {
  res.json({ mensaje: '¡Hola desde el backend de Aura!' });
});

app.get('/api/mongo', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.json({ mongo: 'Conexión exitosa a MongoDB' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- INICIAR SERVIDOR ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor backend de Aura escuchando en puerto ${PORT}`);
});