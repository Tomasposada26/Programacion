const mongoose = require('mongoose');

// Hashtags tendencia
const HashtagTrendSchema = new mongoose.Schema({
  hashtag: { type: String, required: true },
  count: { type: Number, required: true },
  fecha: { type: Date, required: true }, // Día de la tendencia
});

// Ofertas por día
const OfertasPorDiaSchema = new mongoose.Schema({
  fecha: { type: Date, required: true },
  total: { type: Number, required: true },
});

// Distribución por sector
const SectorTrendSchema = new mongoose.Schema({
  sector: { type: String, required: true },
  count: { type: Number, required: true },
  fecha: { type: Date, required: true },
});

// Distribución por ciudad
const CiudadTrendSchema = new mongoose.Schema({
  ciudad: { type: String, required: true },
  count: { type: Number, required: true },
  fecha: { type: Date, required: true },
});

module.exports = {
  HashtagTrend: mongoose.model('HashtagTrend', HashtagTrendSchema),
  OfertasPorDia: mongoose.model('OfertasPorDia', OfertasPorDiaSchema),
  SectorTrend: mongoose.model('SectorTrend', SectorTrendSchema),
  CiudadTrend: mongoose.model('CiudadTrend', CiudadTrendSchema),
};
