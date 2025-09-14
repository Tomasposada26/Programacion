
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
// Tooltip personalizado para hashtags
function CustomHashtagTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#fff', border: '1px solid #d0d7e2', borderRadius: 8, padding: 10, boxShadow: '0 2px 8px #0002' }}>
        <div style={{ fontWeight: 700, color: '#188fd9' }}>{label}</div>
        <div style={{ color: '#232a3b' }}>Usos: <b>{payload[0].value}</b></div>
      </div>
    );
  }
  return null;
}

// Tooltip personalizado para pastel
function CustomPieTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#fff', border: '1px solid #d0d7e2', borderRadius: 8, padding: 10, boxShadow: '0 2px 8px #0002' }}>
        <div style={{ fontWeight: 700, color: payload[0].color }}>{payload[0].name}</div>
        <div style={{ color: '#232a3b' }}>Ofertas: <b>{payload[0].value}</b></div>
      </div>
    );
  }
  return null;
}
// Si luego instalas react-wordcloud puedes importar y usar WordCloud aquí
// import WordCloud from 'react-wordcloud';

const API_BASE = 'https://programacion-gdr0.onrender.com/api/tendencias';
const pieColors = ['#188fd9', '#f7b731', '#20bf6b', '#8854d0', '#eb3b5a'];

export default function TendenciasPanel() {
  // Filtros
  const [ciudad, setCiudad] = useState('Todas');
  const [sector, setSector] = useState('Todos');
  const [fecha, setFecha] = useState({ desde: '', hasta: '' });
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  // Datos
  const [hashtags, setHashtags] = useState([]);
  const [ofertas, setOfertas] = useState([]);
  const [publicacionesPorDia, setPublicacionesPorDia] = useState([]);
  const [sectoresPie, setSectoresPie] = useState([]);

  // Opciones simuladas
  const ciudades = ['Todas', 'Bogotá', 'Medellín', 'Cali', 'Barranquilla'];
  const sectores = ['Todos', 'Tecnología', 'Salud', 'Educación', 'Finanzas', 'Manufactura'];

  // Fetch de datos

  const fetchTendencias = async () => {
    setLoading(true);
    try {
      // Query params para filtros
      const params = [];
      if (fecha.desde) params.push(`desde=${fecha.desde}`);
      if (fecha.hasta) params.push(`hasta=${fecha.hasta}`);
      if (ciudad && ciudad !== 'Todas') params.push(`ciudad=${encodeURIComponent(ciudad)}`);
      if (sector && sector !== 'Todos') params.push(`sector=${encodeURIComponent(sector)}`);
      const query = params.length ? `?${params.join('&')}` : '';

      // Hashtags
      const resHash = await fetch(`${API_BASE}/hashtags${query}`);
      const hashtagsData = await resHash.json();
      setHashtags(hashtagsData.map(h => ({ text: h.hashtag, value: h.count })));

      // Ofertas por día
      const resDia = await fetch(`${API_BASE}/ofertas-por-dia${query}`);
      const diaData = await resDia.json();
      setPublicacionesPorDia(diaData.map(d => ({ fecha: d.fecha.slice(0, 10), ofertas: d.total })));

      // Sectores
      const resSec = await fetch(`${API_BASE}/sectores${query}`);
      const secData = await resSec.json();
      setSectoresPie(secData.map(s => ({ name: s.sector, value: s.count })));

      // Ofertas recientes (mock: reconstruir desde sectores y días)
      setOfertas([
        { titulo: 'Desarrollador Fullstack', ciudad: 'Bogotá', empresa: 'TechCol', fecha: '2025-09-12', sector: 'Tecnología' },
        { titulo: 'Analista de Datos', ciudad: 'Medellín', empresa: 'DataCorp', fecha: '2025-09-11', sector: 'Tecnología' },
        { titulo: 'Diseñador UX/UI', ciudad: 'Cali', empresa: 'Creativa', fecha: '2025-09-10', sector: 'Tecnología' },
        { titulo: 'Gerente de Proyectos', ciudad: 'Barranquilla', empresa: 'Proyectos SAS', fecha: '2025-09-09', sector: 'Finanzas' },
        { titulo: 'Enfermero/a', ciudad: 'Bogotá', empresa: 'SaludTotal', fecha: '2025-09-08', sector: 'Salud' },
        { titulo: 'Profesor de Inglés', ciudad: 'Cali', empresa: 'Colegio ABC', fecha: '2025-09-07', sector: 'Educación' },
        { titulo: 'Operario de Planta', ciudad: 'Medellín', empresa: 'Industrias XYZ', fecha: '2025-09-06', sector: 'Manufactura' },
      ]);

      setLastUpdate(new Date());
    } catch (e) {
      setHashtags([]);
      setOfertas([]);
      setPublicacionesPorDia([]);
      setSectoresPie([]);
    }
    setLoading(false);
  };


  useEffect(() => {
    fetchTendencias();
    // eslint-disable-next-line
  }, [fecha.desde, fecha.hasta, ciudad, sector]);

  const handleUpdate = () => {
    fetchTendencias();
  };

  // ...existing code...
  return (
    <div style={{ padding: 32, maxWidth: 1200, margin: '0 auto' }}>
      {/* Barra de actualización */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 12 }}>
        <button onClick={handleUpdate} disabled={loading} style={{ background: '#188fd9', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', marginRight: 18, transition: 'background 0.2s' }}>
          {loading ? 'Actualizando...' : 'Actualizar datos'}
        </button>
        <span style={{ color: '#888', fontSize: 14 }}>
          Última actualización: {lastUpdate.toLocaleString('es-CO', { hour12: false })}
        </span>
      </div>
      <h2 style={{ fontWeight: 800, fontSize: 32, color: '#188fd9', marginBottom: 24 }}>
        Tendencias Laborales en Colombia
      </h2>
      {/* Filtros */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 32, flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
          <label style={{ fontWeight: 600, marginRight: 8 }}>Ciudad:</label>
          <select value={ciudad} onChange={e => setCiudad(e.target.value)} style={{ padding: 6, borderRadius: 6, border: '1px solid #d0d7e2' }}>
            {ciudades.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 600, marginRight: 8 }}>Sector:</label>
          <select value={sector} onChange={e => setSector(e.target.value)} style={{ padding: 6, borderRadius: 6, border: '1px solid #d0d7e2' }}>
            {sectores.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 600, marginRight: 8 }}>Desde:</label>
          <input type="date" value={fecha.desde} onChange={e => setFecha(f => ({ ...f, desde: e.target.value }))} style={{ padding: 6, borderRadius: 6, border: '1px solid #d0d7e2' }} />
        </div>
        <div>
          <label style={{ fontWeight: 600, marginRight: 8 }}>Hasta:</label>
          <input type="date" value={fecha.hasta} onChange={e => setFecha(f => ({ ...f, hasta: e.target.value }))} style={{ padding: 6, borderRadius: 6, border: '1px solid #d0d7e2' }} />
        </div>
      </div>

      {/* KPIs y gráficas adicionales */}
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 32 }}>
        {/* KPI: Total ofertas */}
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #0001', padding: 24, minWidth: 180, flex: 1 }}>
          <div style={{ fontSize: 15, color: '#888', marginBottom: 6 }}>Ofertas activas</div>
          <div style={{ fontWeight: 800, fontSize: 32, color: '#188fd9' }}>{ofertas.length}</div>
        </div>
        {/* KPI: Hashtag más popular */}
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #0001', padding: 24, minWidth: 180, flex: 1 }}>
          <div style={{ fontSize: 15, color: '#888', marginBottom: 6 }}>Hashtag más popular</div>
          <div style={{ fontWeight: 800, fontSize: 24, color: '#232a3b' }}>
            {Array.isArray(hashtags) && hashtags.length > 0 && hashtags[0].text ? hashtags[0].text : 'N/A'}
          </div>
        </div>
        {/* KPI: Variación semanal (mock) */}
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #0001', padding: 24, minWidth: 180, flex: 1 }}>
          <div style={{ fontSize: 15, color: '#888', marginBottom: 6 }}>Variación semanal</div>
          <div style={{ fontWeight: 800, fontSize: 24, color: '#20bf6b' }}>+8%</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        {/* Gráfica de barras de hashtags */}
        <div style={{ flex: 2, minWidth: 350, background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #0001', padding: 24 }}>
          <h3 style={{ color: '#232a3b', fontWeight: 700, marginBottom: 12 }}># Hashtags más usados</h3>
          {Array.isArray(hashtags) && hashtags.length > 0 && hashtags[0].text !== undefined ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hashtags} layout="vertical" margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" hide />
                <YAxis dataKey="text" type="category" width={120} />
                <Tooltip content={<CustomHashtagTooltip />} />
                <Bar dataKey="value" fill="#188fd9" radius={[0, 8, 8, 0]} barSize={28} isAnimationActive animationDuration={900} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ color: '#bbb', fontStyle: 'italic', textAlign: 'center', marginTop: 40 }}>
              No hay datos de hashtags para mostrar.
            </div>
          )}
        </div>
        {/* Gráfico de líneas: publicaciones por día */}
        <div style={{ flex: 1, minWidth: 320, background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #0001', padding: 24 }}>
          <h3 style={{ color: '#232a3b', fontWeight: 700, marginBottom: 12 }}>Publicaciones de ofertas (últimos días)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={publicacionesPorDia} margin={{ left: 0, right: 0, top: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" fontSize={12} />
              <YAxis allowDecimals={false} fontSize={12} />
              <Tooltip formatter={v => [`${v} ofertas`, 'Publicaciones']} />
              <Line type="monotone" dataKey="ofertas" stroke="#188fd9" strokeWidth={3} dot={{ r: 5 }} isAnimationActive animationDuration={900} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Gráfico de pastel: distribución por sector */}
        <div style={{ flex: 1, minWidth: 320, background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #0001', padding: 24 }}>
          <h3 style={{ color: '#232a3b', fontWeight: 700, marginBottom: 12 }}>Distribución por sector</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={sectoresPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label isAnimationActive animationDuration={900}>
                {sectoresPie.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={pieColors[i % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Ofertas recientes */}
        <div style={{ flex: 1, minWidth: 320, background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #0001', padding: 24 }}>
          <h3 style={{ color: '#232a3b', fontWeight: 700, marginBottom: 12 }}>Ofertas recientes</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {ofertas.map((of, i) => (
              <li key={i} style={{ marginBottom: 18, paddingBottom: 10, borderBottom: '1px solid #e0e7ef' }}>
                <div style={{ fontWeight: 700, color: '#188fd9', fontSize: 18 }}>{of.titulo}</div>
                <div style={{ color: '#232a3b', fontSize: 15 }}>{of.empresa} - {of.ciudad}</div>
                <div style={{ color: '#888', fontSize: 13 }}>{of.fecha} | <span style={{ color: '#20bf6b' }}>{of.sector}</span></div>
              </li>
            ))}
          </ul>
        </div>
        {/* Nube de palabras eliminada por eliminación de react-wordcloud */}
        {/* Aquí puedes agregar otra visualización o dejar el espacio vacío */}
        {/* Mapa de calor (placeholder) */}
        <div style={{ flex: 1, minWidth: 320, background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #0001', padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ color: '#232a3b', fontWeight: 700, marginBottom: 12 }}>Mapa de calor por ciudad</h3>
          <div style={{ width: '100%', height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontStyle: 'italic', fontSize: 18, border: '1px dashed #d0d7e2', borderRadius: 8 }}>
            (Próximamente: mapa interactivo de Colombia)
          </div>
        </div>
      </div>
    </div>
  );
}
