
import React, { useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
// Gradiente de azul (#188fd9) a rojo (#eb3b5a)
function getColor(vacantes, min, max) {
  if (max === min) return "#188fd9";
  // Normaliza entre 0 y 1
  const t = (vacantes - min) / (max - min);
  // Interpolación RGB
  const r = Math.round(24 + t * (235 - 24));
  const g = Math.round(143 + t * (59 - 143));
  const b = Math.round(217 + t * (90 - 217));
  return `rgb(${r},${g},${b})`;
}

export default function MapaCalorColombia({ ciudades, onCiudadClick }) {
  const [ciudadActiva, setCiudadActiva] = useState(null);
  const vacantesArr = ciudades?.map(c => c.vacantes) || [0];
  const min = Math.min(...vacantesArr);
  const max = Math.max(...vacantesArr);

  return (
    <div style={{ width: "100%", height: 350, borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px #0001", position: 'relative' }}>
      {/* Leyenda gradiente */}
      <div style={{ position: 'absolute', right: 18, top: 18, zIndex: 1000, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0002', padding: 8, fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: '#188fd9', fontWeight: 700 }}>{min}</span>
        <div style={{ width: 60, height: 10, background: 'linear-gradient(to right, #188fd9, #eb3b5a)', borderRadius: 5 }} />
        <span style={{ color: '#eb3b5a', fontWeight: 700 }}>{max}</span>
        <span style={{ color: '#232a3b', marginLeft: 4 }}>vacantes</span>
      </div>
      <MapContainer
        center={[4.5, -74.1]}
        zoom={5.3}
        style={{ width: "100%", height: "100%" }}
        scrollWheelZoom={true}
        dragging={true}
        zoomControl={true}
        doubleClickZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {ciudades && ciudades.map((c, i) => (
          <CircleMarker
            key={i}
            center={c.coords}
            radius={10 + Math.min(30, c.vacantes / 2)}
            fillColor={getColor(c.vacantes, min, max)}
            color={ciudadActiva === c.nombre ? '#eb3b5a' : '#232a3b'}
            weight={ciudadActiva === c.nombre ? 3 : 1}
            fillOpacity={0.7}
            eventHandlers={{
              click: () => {
                setCiudadActiva(c.nombre);
                if (onCiudadClick) onCiudadClick(c.nombre);
              }
            }}
          >
            <Tooltip direction="top" offset={[0, -8]} opacity={1} permanent={false} sticky>
              <div style={{ fontWeight: 700, color: getColor(c.vacantes, min, max) }}>{c.nombre}</div>
              <div style={{ color: "#232a3b" }}>Vacantes: <b>{c.vacantes}</b></div>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
