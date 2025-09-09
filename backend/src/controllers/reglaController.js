// src/controllers/reglaController.js
const Regla = require('../models/Regla');

const reglaController = {
  async create(req, res) {
    try {
      const nueva = new Regla(req.body);
      await nueva.save();
      res.status(201).json(nueva);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async duplicate(req, res) {
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
  },
  async getAll(req, res) {
    try {
      const reglas = await Regla.find();
      res.json(reglas);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async getById(req, res) {
    try {
      const regla = await Regla.findById(req.params.id);
      if (!regla) return res.status(404).json({ error: 'Regla no encontrada' });
      res.json(regla);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async update(req, res) {
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
  },
  async delete(req, res) {
    try {
      const reglaEliminada = await Regla.findByIdAndDelete(req.params.id);
      if (!reglaEliminada) return res.status(404).json({ error: 'Regla no encontrada' });
      res.json({ mensaje: 'Regla eliminada' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async updateEstado(req, res) {
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
  }
};

module.exports = reglaController;
