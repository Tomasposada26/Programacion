import React, { useState, useRef } from 'react';
import './ProductDropdown.css';

const RESOURCES_ITEMS = [
  {
    title: 'Panel de análisis y métricas',
    desc: 'Visualiza y analiza métricas clave de tus redes sociales en un solo lugar.'
  },
  {
    title: 'Simulación de interacciones',
    desc: 'Prueba y simula respuestas automáticas antes de activarlas en producción.'
  },
  {
    title: 'Preguntas frecuentes',
    desc: 'Encuentra respuestas a las dudas más comunes sobre Aura y su funcionamiento.'
  },
  {
    title: 'Documentación técnica',
    desc: 'Accede a la documentación para desarrolladores e integradores.'
  }
];

const ResourcesDropdown = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleMouseLeave = () => setOpen(false);
  const handleMouseEnter = () => setOpen(true);

  // Divide en dos columnas si hay más de 3 recursos
  const col1 = RESOURCES_ITEMS.slice(0, 2);
  const col2 = RESOURCES_ITEMS.slice(2);

  return (
    <div className="product-dropdown-wrapper" onMouseLeave={handleMouseLeave}>
      <div
        className="product-dropdown-trigger"
        onMouseEnter={handleMouseEnter}
        style={{fontWeight: 700, color: '#fff', background: 'transparent', cursor: 'pointer', padding: '0 18px', fontSize: '1.1em', display: 'inline-block'}}
      >
        Recursos <span style={{fontWeight: 400, fontSize: '0.9em'}}>▼</span>
      </div>
      {open && (
        <div
          className="product-dropdown-modal"
          ref={dropdownRef}
          onMouseEnter={handleMouseEnter}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            background: '#fff',
            color: '#232a3b',
            borderRadius: 12,
            boxShadow: '0 8px 32px #0004',
            padding: '28px 36px 28px 36px',
            minWidth: 520,
            zIndex: 1000,
            display: 'flex',
            gap: 48,
            fontFamily: 'inherit',
            fontSize: 16
          }}
        >
          <div style={{display: 'flex', flexDirection: 'column', gap: 18, minWidth: 220}}>
            <div style={{color: '#188fd9', fontWeight: 700, letterSpacing: 1, fontSize: 15, marginBottom: 2}}>RECURSOS</div>
            {col1.map(item => (
              <div key={item.title}>
                <div style={{fontWeight: 700, fontSize: 16, marginBottom: 2}}>{item.title}</div>
                <div style={{fontWeight: 400, fontSize: 14, color: '#232a3b'}}>{item.desc}</div>
              </div>
            ))}
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 18, minWidth: 220}}>
            <div style={{color: 'transparent', fontWeight: 700, fontSize: 15, marginBottom: 2}}>_</div>
            {col2.map(item => (
              <div key={item.title}>
                <div style={{fontWeight: 700, fontSize: 16, marginBottom: 2}}>{item.title}</div>
                <div style={{fontWeight: 400, fontSize: 14, color: '#232a3b'}}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourcesDropdown;
