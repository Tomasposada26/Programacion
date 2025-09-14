import MapaCalorColombia from '../components/MapaCalorColombia';

import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, LabelList, Cell } from 'recharts';

// Tooltip personalizado para hashtags (solo muestra datos del hashtag)
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

// Tooltip personalizado para pastel (solo muestra datos del sector)
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

const API_BASE = 'https://programacion-gdr0.onrender.com/api/tendencias';
const pieColors = ['#188fd9', '#f7b731', '#20bf6b', '#8854d0', '#eb3b5a'];

export default function TendenciasPanel() {
  // Generador de ofertas mock
  function generarOfertasMock(cantidad = 100) {
    const titulos = [
      'Desarrollador Fullstack', 'Analista de Datos', 'Diseñador UX/UI', 'Gerente de Proyectos',
      'Enfermero/a', 'Profesor de Inglés', 'Operario de Planta', 'Ingeniero DevOps', 'Psicólogo Organizacional',
      'Vendedor Comercial', 'Contador Público', 'Abogado Corporativo', 'Community Manager', 'Científico de Datos',
      'Técnico de Soporte', 'Médico General', 'Auxiliar Administrativo', 'Jefe de Producción', 'Redactor Creativo',
      'Especialista en Marketing', 'Consultor SAP', 'Arquitecto de Software', 'Recepcionista', 'Diseñador Gráfico',
      'Ingeniero Civil', 'Técnico Electricista', 'Farmacéutico', 'Chef Ejecutivo', 'Barista', 'Camarero/a',
      'Logístico', 'Ingeniero Químico', 'Analista Financiero', 'Scrum Master', 'Tester QA', 'Desarrollador Móvil',
      'Especialista en RRHH', 'Gerente Comercial', 'Director de Arte', 'Product Owner', 'Data Engineer',
      'Especialista en SEO', 'Ingeniero Mecánico', 'Técnico en Redes', 'Fisioterapeuta', 'Nutricionista',
      'Técnico en Mantenimiento', 'Supervisor de Planta', 'Ingeniero Electrónico', 'Técnico Biomédico',
      'Asistente Legal', 'Auxiliar de Enfermería', 'Técnico en Logística', 'Ingeniero Ambiental',
      'Desarrollador Frontend', 'Desarrollador Backend', 'Analista de Seguridad', 'Técnico de Laboratorio',
      'Ingeniero Industrial', 'Técnico en Calidad', 'Jefe de Ventas', 'Especialista en Compras',
      'Técnico en Refrigeración', 'Ingeniero de Sistemas', 'Técnico en Telecomunicaciones', 'Jefe de Recursos Humanos',
      'Especialista en BI', 'Técnico en Automatización', 'Ingeniero de Procesos', 'Técnico en Producción',
      'Especialista en E-commerce', 'Técnico en Salud Ocupacional', 'Ingeniero de Proyectos', 'Técnico en Seguridad',
      'Especialista en Logística', 'Técnico en Inventarios', 'Ingeniero de Alimentos', 'Técnico en Química',
      'Especialista en Capacitación', 'Técnico en Documentación', 'Ingeniero de Campo', 'Técnico en Ensamble',
      'Especialista en Exportaciones', 'Técnico en Importaciones', 'Ingeniero de Planta', 'Técnico en Control de Calidad',
      'Especialista en Producción', 'Técnico en Empaque', 'Ingeniero de Desarrollo', 'Técnico en Pruebas',
      'Especialista en Ventas Digitales', 'Técnico en Marketing Digital', 'Ingeniero de Soporte', 'Técnico en Soporte Técnico',
      'Especialista en Seguridad Informática', 'Técnico en Seguridad Industrial', 'Ingeniero de Mantenimiento', 'Técnico en Mantenimiento Industrial'
    ];
    const empresas = [
      'TechCol', 'DataCorp', 'Creativa', 'Proyectos SAS', 'SaludTotal', 'Colegio ABC', 'Industrias XYZ',
      'Finanzas Plus', 'Educavida', 'ManuCol', 'LogiExpress', 'Farmalab', 'LegalCo', 'Comercializadora Andina',
      'RedesNet', 'BioSalud', 'NutriCol', 'ArteStudio', 'RRHH Global', 'EcomMarket', 'SistemasPro', 'Ambiental S.A.',
      'Quimicor', 'Alimentos del Valle', 'ExportaFácil', 'ImportaYa', 'CampoLab', 'Empaques SAS', 'Ventas Digitales',
      'SoporteTotal', 'SeguridadPro', 'Mantenimiento Express', 'Calidad Global', 'CapacitaYa', 'Documenta', 'PlantaCol',
      'Producción SAS', 'DesarrolloPro', 'PruebasLab', 'VentasOnline', 'Marketing360', 'SoporteIT', 'SeguridadInd',
      'Mantenimiento SAS'
    ];
    const descripciones = [
      'Desarrollo de aplicaciones web y móviles.', 'Análisis de grandes volúmenes de datos.',
      'Diseño de interfaces y experiencia de usuario.', 'Gestión de proyectos financieros.',
      'Atención a pacientes y apoyo clínico.', 'Enseñanza de inglés a estudiantes.',
      'Operación de maquinaria industrial.', 'Soporte técnico a usuarios.', 'Gestión de redes sociales.',
      'Supervisión de procesos de manufactura.', 'Control de calidad en planta.', 'Elaboración de reportes financieros.',
      'Implementación de campañas de marketing.', 'Desarrollo de soluciones en la nube.',
      'Mantenimiento preventivo y correctivo.', 'Gestión de inventarios.', 'Atención al cliente.',
      'Optimización de procesos logísticos.', 'Elaboración de estudios de mercado.', 'Capacitación de personal.'
    ];
    const ciudadesMock = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga', 'Pereira', 'Manizales', 'Santa Marta'];
    const sectoresMock = ['Tecnología', 'Salud', 'Educación', 'Finanzas', 'Manufactura', 'Logística', 'Legal', 'Comercial', 'Marketing', 'Ingeniería', 'Alimentos', 'Química', 'Ambiental'];
    const hoy = new Date();
    const ofertas = [];
    for (let i = 0; i < cantidad; i++) {
      const titulo = titulos[Math.floor(Math.random() * titulos.length)] + ' ' + (i+1);
      const empresa = empresas[Math.floor(Math.random() * empresas.length)];
      const ciudad = ciudadesMock[Math.floor(Math.random() * ciudadesMock.length)];
      const sector = sectoresMock[Math.floor(Math.random() * sectoresMock.length)];
      const descripcion = descripciones[Math.floor(Math.random() * descripciones.length)];
      const fecha = new Date(hoy.getTime() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000); // hasta 60 días atrás
      ofertas.push({
        titulo,
        ciudad,
        empresa,
        fecha: fecha.toISOString().slice(0, 10),
        sector,
        descripcion
      });
    }
    return ofertas;
  }

  // Botón de aplicar filtros (dummy para evitar error)
  const handleAplicarFiltros = () => {};
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState(null);
  // Filtros
  const [ciudad, setCiudad] = useState('Todas');
  const [sector, setSector] = useState('Todos');
  const [fecha, setFecha] = useState({ desde: '', hasta: '' });
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  // Datos
  const [hashtags, setHashtags] = useState([]);
  const [ofertas, setOfertas] = useState([]);
  const [publicacionesPorDia, setPublicacionesPorDia] = useState([]);
  const [sectoresPie, setSectoresPie] = useState([]);
  // Scroll infinito
  const [ofertasPage, setOfertasPage] = useState(1);
  const ofertasPerPage = 7;
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

      // Ofertas recientes (mock masivo y variado)
      setOfertas(generarOfertasMock(200));
      // Simular hashtags, publicacionesPorDia y sectoresPie para que los gráficos cambien
      const hashtagsEjemplo = [
        { text: '#empleo', value: Math.floor(Math.random()*100+50) },
        { text: '#trabajo', value: Math.floor(Math.random()*80+30) },
        { text: '#vacante', value: Math.floor(Math.random()*60+20) },
        { text: '#colombia', value: Math.floor(Math.random()*40+10) },
        { text: '#oportunidad', value: Math.floor(Math.random()*30+5) }
      ];
      setHashtags(hashtagsEjemplo.sort((a,b)=>b.value-a.value));
      const dias = Array.from({length: 14}, (_,i) => {
        const d = new Date();
        d.setDate(d.getDate()-i);
        return {
          fecha: d.toISOString().slice(0,10),
          ofertas: Math.floor(Math.random()*30+5)
        };
      }).reverse();
      setPublicacionesPorDia(dias);
      const sectoresEjemplo = ['Tecnología','Salud','Educación','Finanzas','Manufactura','Logística','Legal','Comercial','Marketing','Ingeniería','Alimentos','Química','Ambiental'];
      setSectoresPie(sectoresEjemplo.map(s=>({name:s,value:Math.floor(Math.random()*60+10)})));

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

  // Filtro por palabra clave y paginación
  const ofertasFiltradas = useMemo(() => {
    let filtered = ofertas;
    if (keyword.trim()) {
      const kw = keyword.trim().toLowerCase();
      filtered = filtered.filter(of =>
        (of.titulo && of.titulo.toLowerCase().includes(kw)) ||
        (of.empresa && of.empresa.toLowerCase().includes(kw)) ||
        (of.sector && of.sector.toLowerCase().includes(kw)) ||
        (of.descripcion && of.descripcion.toLowerCase().includes(kw))
      );
    }
    return filtered;
  }, [ofertas, keyword]);

  // Paginación clásica: calcular total de páginas
  const totalPages = Math.ceil(ofertasFiltradas.length / ofertasPerPage);
  const ofertasPaginadas = useMemo(() => {
    const start = (ofertasPage - 1) * ofertasPerPage;
    return ofertasFiltradas.slice(start, start + ofertasPerPage);
  }, [ofertasFiltradas, ofertasPage, ofertasPerPage]);

  // Ranking de crecimiento (mock: top ciudades y sectores por cantidad de vacantes)
  const rankingCiudades = useMemo(() => {
    const counts = {};
    ofertas.forEach(of => {
      counts[of.ciudad] = (counts[of.ciudad] || 0) + 1;
    });
    return Object.entries(counts).map(([nombre, total]) => ({ nombre, total })).sort((a, b) => b.total - a.total).slice(0, 5);
  }, [ofertas]);
  const rankingSectores = useMemo(() => {
    const counts = {};
    ofertas.forEach(of => {
      counts[of.sector] = (counts[of.sector] || 0) + 1;
    });
    return Object.entries(counts).map(([nombre, total]) => ({ nombre, total })).sort((a, b) => b.total - a.total).slice(0, 5);
  }, [ofertas]);

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
        <div>
          <label style={{ fontWeight: 600, marginRight: 8 }}>Palabra clave:</label>
          <input type="text" value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Buscar..." style={{ padding: 6, borderRadius: 6, border: '1px solid #d0d7e2', minWidth: 120 }} />
        </div>
        <button onClick={handleAplicarFiltros} style={{ background: '#20bf6b', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer', transition: 'background 0.2s', marginLeft: 8 }}>
          Aplicar filtros
        </button>
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


      {/* Panel de Insights */}
      <div style={{ width: '100%', margin: '32px 0 0 0', display: 'flex', justifyContent: 'center' }}>
        <div style={{ background: '#f7faff', borderRadius: 16, boxShadow: '0 2px 12px #0001', padding: '22px 32px', minWidth: 320, maxWidth: 900, width: '100%', display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
          {(() => {
            // Frases automáticas de insights
            const frases = [];
            if (rankingCiudades.length > 0 && rankingSectores.length > 0) {
              frases.push(`${rankingCiudades[0].nombre} lidera en vacantes de ${rankingSectores[0].nombre} este mes.`);
            }
            if (rankingSectores.length > 1) {
              frases.push(`El sector ${rankingSectores[1].nombre} creció un ${(Math.random()*20+5).toFixed(1)}% en ${rankingCiudades[0].nombre}.`);
            }
            if (ofertas.length > 0) {
              frases.push(`Se publicaron ${ofertas.length} vacantes en total este mes.`);
            }
            if (frases.length === 0) frases.push('No hay insights disponibles para los filtros actuales.');
            return frases.map((frase, i) => (
              <span key={i} style={{ color: '#232a3b', fontWeight: 600, fontSize: 17, marginRight: 24 }}>{frase}</span>
            ));
          })()}
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
        {/* Gráfico de barras horizontal: distribución por sector */}
        <div style={{ flex: 1, minWidth: 320, background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #0001', padding: 24 }}>
          <h3 style={{ color: '#232a3b', fontWeight: 700, marginBottom: 12 }}>Distribución por sector</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={[...sectoresPie].sort((a, b) => b.value - a.value)}
              layout="vertical"
              margin={{ left: 20, right: 20, top: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} tick={{ fill: '#232a3b', fontWeight: 600, fontSize: 14 }} />
              <YAxis dataKey="name" type="category" width={120} tick={{ fill: '#232a3b', fontWeight: 700, fontSize: 15 }} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const p = payload[0];
                    return (
                      <div style={{ background: '#fff', border: '1px solid #d0d7e2', borderRadius: 8, padding: 10, boxShadow: '0 2px 8px #0002', color: '#232a3b', fontWeight: 600 }}>
                        <div style={{ color: p.color, fontWeight: 800 }}>{p.payload.name}</div>
                        <div>Vacantes: <b>{p.value}</b></div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="value" barSize={22} isAnimationActive animationDuration={1200}>
                {[...sectoresPie].sort((a, b) => b.value - a.value).map((entry, i) => (
                  <Cell key={`cell-bar-${i}`} fill={pieColors[i % pieColors.length]} />
                ))}
                {/* Etiquetas de valor al final de cada barra */}
                <LabelList dataKey="value" position="right" style={{ fill: '#232a3b', fontWeight: 700, fontSize: 15, textShadow: '0 1px 2px #fff8' }} formatter={v => v} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Ofertas recientes con paginación clásica */}
        <div style={{ flex: 1, minWidth: 320, background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #0001', padding: 24, position: 'relative' }}>
          <h3 style={{ color: '#232a3b', fontWeight: 700, marginBottom: 12 }}>Ofertas recientes</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, minHeight: 180, transition: 'min-height 0.4s' }}>
            {ofertasPaginadas.map((of, i) => (
              <li key={i} style={{ marginBottom: 18, paddingBottom: 10, borderBottom: '1px solid #e0e7ef', opacity: 1, transform: 'translateY(0)', transition: 'all 0.4s cubic-bezier(.4,1.2,.6,1)' }}>
                <div style={{ fontWeight: 700, color: '#188fd9', fontSize: 18 }}>{of.titulo}</div>
                <div style={{ color: '#232a3b', fontSize: 15 }}>{of.empresa} - {of.ciudad}</div>
                <div style={{ color: '#888', fontSize: 13 }}>{of.fecha} | <span style={{ color: '#20bf6b' }}>{of.sector}</span></div>
                {of.descripcion && <div style={{ color: '#555', fontSize: 13, marginTop: 4 }}>{of.descripcion}</div>}
              </li>
            ))}
          </ul>
          {/* Paginación simplificada */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 12 }}>
              <button onClick={() => setOfertasPage(1)} disabled={ofertasPage === 1} style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #188fd9', background: ofertasPage === 1 ? '#eee' : '#fff', color: '#188fd9', fontWeight: 700, cursor: ofertasPage === 1 ? 'not-allowed' : 'pointer' }}>Inicio</button>
              <button onClick={() => setOfertasPage(p => Math.max(1, p - 1))} disabled={ofertasPage === 1} style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #188fd9', background: ofertasPage === 1 ? '#eee' : '#fff', color: '#188fd9', fontWeight: 700, cursor: ofertasPage === 1 ? 'not-allowed' : 'pointer' }}>Anterior</button>
              <span style={{ alignSelf: 'center', fontWeight: 600, color: '#232a3b', fontSize: 15 }}>Página {ofertasPage} de {totalPages}</span>
              <button onClick={() => setOfertasPage(p => Math.min(totalPages, p + 1))} disabled={ofertasPage === totalPages} style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #188fd9', background: ofertasPage === totalPages ? '#eee' : '#fff', color: '#188fd9', fontWeight: 700, cursor: ofertasPage === totalPages ? 'not-allowed' : 'pointer' }}>Siguiente</button>
              <button onClick={() => setOfertasPage(totalPages)} disabled={ofertasPage === totalPages} style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #188fd9', background: ofertasPage === totalPages ? '#eee' : '#fff', color: '#188fd9', fontWeight: 700, cursor: ofertasPage === totalPages ? 'not-allowed' : 'pointer' }}>Final</button>
            </div>
          )}
          {ofertasFiltradas.length === 0 && (
            <div style={{ color: '#bbb', fontStyle: 'italic', textAlign: 'center', marginTop: 40 }}>
              No hay ofertas para mostrar.
            </div>
          )}
        </div>
        {/* Nube de palabras eliminada por eliminación de react-wordcloud */}
        {/* Mapa de calor real con react-leaflet y Top Empresas vertical */}
        <div style={{ flex: 1, minWidth: 320, background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #0001', padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', position: 'relative' }}>
          <h3 style={{ color: '#232a3b', fontWeight: 700, marginBottom: 12 }}>Mapa de calor por ciudad</h3>
          <MapaCalorColombia
            ciudades={(() => {
          {/* Top Empresas vertical dentro de la card del mapa */}
          <div style={{ width: '100%', marginTop: 28 }}>
            <div style={{ fontWeight: 800, fontSize: 18, color: '#188fd9', marginBottom: 12, textAlign: 'center' }}>
              Empresas con más vacantes actualmente
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', width: '100%' }}>
              {(() => {
                const counts = {};
                ofertas.forEach(of => {
                  if (!of.empresa) return;
                  counts[of.empresa] = (counts[of.empresa] || 0) + 1;
                });
                const topEmpresas = Object.entries(counts)
                  .map(([empresa, total]) => ({ empresa, total }))
                  .sort((a, b) => b.total - a.total)
                  .slice(0, 6);
                return topEmpresas.map(({ empresa, total }) => (
                  <div key={empresa} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: '10px 18px', minWidth: 210, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#188fd9', color: '#fff', fontWeight: 800, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px #0001' }}>
                      {empresa[0]}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <span style={{ fontWeight: 700, color: '#232a3b', fontSize: 15 }}>{empresa}</span>
                      <span style={{ color: '#888', fontSize: 13 }}>{total} vacantes</span>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
              // Coordenadas de ciudades principales
              const coordsMap = {
                'Bogotá': [4.711, -74.0721],
                'Medellín': [6.2442, -75.5812],
                'Cali': [3.4516, -76.532],
                'Barranquilla': [10.9685, -74.7813],
                'Cartagena': [10.391, -75.4794],
                'Bucaramanga': [7.1193, -73.1227],
                'Pereira': [4.8143, -75.6946],
                'Manizales': [5.0703, -75.5138],
                'Santa Marta': [11.2408, -74.199],
              };
              // Filtrar ofertas según los filtros activos
              let filtered = ofertas;
              if (ciudad && ciudad !== 'Todas') filtered = filtered.filter(of => of.ciudad === ciudad);
              if (sector && sector !== 'Todos') filtered = filtered.filter(of => of.sector === sector);
              if (fecha.desde) filtered = filtered.filter(of => of.fecha >= fecha.desde);
              if (fecha.hasta) filtered = filtered.filter(of => of.fecha <= fecha.hasta);
              // Agrupar por ciudad y contar vacantes y ofertas
              const counts = {};
              filtered.forEach(of => {
                if (!counts[of.ciudad]) counts[of.ciudad] = { vacantes: 0, ofertas: [] };
                counts[of.ciudad].vacantes++;
                counts[of.ciudad].ofertas.push(of);
              });
              // Convertir a array de objetos para el mapa
              return Object.entries(counts).map(([nombre, data]) => ({
                nombre,
                coords: coordsMap[nombre] || [4.5, -74.1],
                vacantes: data.vacantes,
                ofertas: data.ofertas
              }));
            })()}
            onCiudadClick={nombre => setCiudadSeleccionada(nombre)}
          />
          {/* Resumen/lista de vacantes al hacer click en ciudad */}
          {ciudadSeleccionada && (() => {
            const ciudadesData = (() => {
              // Repetimos la lógica de agrupación para obtener las ofertas de la ciudad seleccionada
              const coordsMap = {
                'Bogotá': [4.711, -74.0721],
                'Medellín': [6.2442, -75.5812],
                'Cali': [3.4516, -76.532],
                'Barranquilla': [10.9685, -74.7813],
                'Cartagena': [10.391, -75.4794],
                'Bucaramanga': [7.1193, -73.1227],
                'Pereira': [4.8143, -75.6946],
                'Manizales': [5.0703, -75.5138],
                'Santa Marta': [11.2408, -74.199],
              };
              let filtered = ofertas;
              if (ciudad && ciudad !== 'Todas') filtered = filtered.filter(of => of.ciudad === ciudad);
              if (sector && sector !== 'Todos') filtered = filtered.filter(of => of.sector === sector);
              if (fecha.desde) filtered = filtered.filter(of => of.fecha >= fecha.desde);
              if (fecha.hasta) filtered = filtered.filter(of => of.fecha <= fecha.hasta);
              const counts = {};
              filtered.forEach(of => {
                if (!counts[of.ciudad]) counts[of.ciudad] = { vacantes: 0, ofertas: [] };
                counts[of.ciudad].vacantes++;
                counts[of.ciudad].ofertas.push(of);
              });
              return Object.entries(counts).map(([nombre, data]) => ({
                nombre,
                coords: coordsMap[nombre] || [4.5, -74.1],
                vacantes: data.vacantes,
                ofertas: data.ofertas
              }));
            })();
            const ciudadData = ciudadesData.find(c => c.nombre === ciudadSeleccionada);
            return ciudadData ? (
              <div style={{ position: 'absolute', right: 24, top: 80, zIndex: 1200, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #0002', padding: 16, minWidth: 260 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <b style={{ fontSize: 16 }}>{ciudadSeleccionada}</b>
                  <button onClick={() => setCiudadSeleccionada(null)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#eb3b5a' }}>×</button>
                </div>
                <div style={{ maxHeight: 180, overflowY: 'auto' }}>
                  {ciudadData.ofertas.slice(0, 10).map((of, i) => (
                    <div key={i} style={{ borderBottom: '1px solid #eee', padding: '6px 0' }}>
                      <div style={{ fontWeight: 500 }}>{of.titulo || of.puesto || 'Vacante'}</div>
                      <div style={{ fontSize: 12, color: '#888' }}>{of.empresa || ''}</div>
                      <div style={{ fontSize: 12, color: '#188fd9' }}>{of.sector || ''}</div>
                    </div>
                  ))}
                  {ciudadData.ofertas.length > 10 && (
                    <div style={{ textAlign: 'center', color: '#888', fontSize: 13, marginTop: 6 }}>...más vacantes</div>
                  )}
                </div>
              </div>
            ) : null;
          })()}
        </div>
      </div>
    </div>
  );
}