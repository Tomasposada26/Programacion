import React from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";



function getColor(vacantes) {
  if (vacantes > 100) return "#eb3b5a";
  if (vacantes > 60) return "#f7b731";
  if (vacantes > 30) return "#20bf6b";
  return "#188fd9";
}

export default function MapaCalorColombia({ ciudades }) {
  return (
    <div style={{ width: "100%", height: 350, borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px #0001" }}>
      <MapContainer center={[4.5, -74.1]} zoom={5.3} style={{ width: "100%", height: "100%" }} scrollWheelZoom={false} dragging={true} zoomControl={false} doubleClickZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {ciudades && ciudades.map((c, i) => (
          <CircleMarker
            key={i}
            center={c.coords}
            radius={10 + c.vacantes / 20}
            fillColor={getColor(c.vacantes)}
            color="#232a3b"
            weight={1}
            fillOpacity={0.7}
          >
            <Tooltip direction="top" offset={[0, -8]} opacity={1} permanent={false} sticky>
              <div style={{ fontWeight: 700, color: getColor(c.vacantes) }}>{c.nombre}</div>
              <div style={{ color: "#232a3b" }}>Vacantes: <b>{c.vacantes}</b></div>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
