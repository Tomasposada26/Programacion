const { HashtagTrend, OfertasPorDia, SectorTrend, CiudadTrend } = require('../models/Tendencia');

// GET /api/tendencias/hashtags?desde=YYYY-MM-DD&hasta=YYYY-MM-DD
exports.getHashtags = async (req, res) => {
  try {
    const { desde, hasta } = req.query;
    const filtro = {};
    if (desde && hasta) {
      filtro.fecha = { $gte: new Date(desde), $lte: new Date(hasta) };
    }
    const hashtags = await HashtagTrend.find(filtro).sort({ count: -1 });
    res.json(hashtags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/tendencias/ofertas-por-dia?desde=YYYY-MM-DD&hasta=YYYY-MM-DD
exports.getOfertasPorDia = async (req, res) => {
  try {
    const { desde, hasta } = req.query;
    const filtro = {};
    if (desde && hasta) {
      filtro.fecha = { $gte: new Date(desde), $lte: new Date(hasta) };
    }
    const ofertas = await OfertasPorDia.find(filtro).sort({ fecha: 1 });
    res.json(ofertas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/tendencias/sectores?desde=YYYY-MM-DD&hasta=YYYY-MM-DD
exports.getSectores = async (req, res) => {
  try {
    const { desde, hasta } = req.query;
    const filtro = {};
    if (desde && hasta) {
      filtro.fecha = { $gte: new Date(desde), $lte: new Date(hasta) };
    }
    const sectores = await SectorTrend.find(filtro).sort({ count: -1 });
    res.json(sectores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/tendencias/ciudades?desde=YYYY-MM-DD&hasta=YYYY-MM-DD
exports.getCiudades = async (req, res) => {
  try {
    const { desde, hasta } = req.query;
    const filtro = {};
    if (desde && hasta) {
      filtro.fecha = { $gte: new Date(desde), $lte: new Date(hasta) };
    }
    const ciudades = await CiudadTrend.find(filtro).sort({ count: -1 });
    res.json(ciudades);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/tendencias/mock (para poblar datos de prueba)
exports.mockPopulate = async (req, res) => {
  try {
    // Borra datos previos
    await Promise.all([
      HashtagTrend.deleteMany({}),
      OfertasPorDia.deleteMany({}),
      SectorTrend.deleteMany({}),
      CiudadTrend.deleteMany({}),
    ]);
    // Inserta datos de ejemplo
    await HashtagTrend.insertMany([
      { hashtag: '#empleo', count: 120, fecha: new Date('2025-09-12') },
      { hashtag: '#vacantes', count: 95, fecha: new Date('2025-09-12') },
      { hashtag: '#trabajo', count: 80, fecha: new Date('2025-09-12') },
      { hashtag: '#oportunidadLaboral', count: 60, fecha: new Date('2025-09-12') },
    ]);
    await OfertasPorDia.insertMany([
      { fecha: new Date('2025-09-06'), total: 1 },
      { fecha: new Date('2025-09-07'), total: 1 },
      { fecha: new Date('2025-09-08'), total: 1 },
      { fecha: new Date('2025-09-09'), total: 1 },
      { fecha: new Date('2025-09-10'), total: 1 },
      { fecha: new Date('2025-09-11'), total: 1 },
      { fecha: new Date('2025-09-12'), total: 1 },
    ]);
    await SectorTrend.insertMany([
      { sector: 'Tecnología', count: 3, fecha: new Date('2025-09-12') },
      { sector: 'Finanzas', count: 1, fecha: new Date('2025-09-12') },
      { sector: 'Salud', count: 1, fecha: new Date('2025-09-12') },
      { sector: 'Educación', count: 1, fecha: new Date('2025-09-12') },
      { sector: 'Manufactura', count: 1, fecha: new Date('2025-09-12') },
    ]);
    await CiudadTrend.insertMany([
      { ciudad: 'Bogotá', count: 2, fecha: new Date('2025-09-12') },
      { ciudad: 'Medellín', count: 2, fecha: new Date('2025-09-12') },
      { ciudad: 'Cali', count: 2, fecha: new Date('2025-09-12') },
      { ciudad: 'Barranquilla', count: 1, fecha: new Date('2025-09-12') },
    ]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
