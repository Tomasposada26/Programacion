import React, { useState, useRef } from 'react';
import './ProductDropdown.css';

const PRODUCT_ITEMS = [
  {
    title: 'Vinculación de cuentas Instagram',
    desc: 'Conecta y administra múltiples cuentas de Instagram desde un solo lugar.'
  },
  {
    title: 'Escucha y análisis de interacciones',
    desc: 'Monitorea y analiza comentarios, likes y mensajes para obtener insights valiosos.'
  },
  {
    title: 'Chatbot IA Neto',
    desc: 'Automatiza respuestas y atención al cliente con inteligencia artificial avanzada.'
  },
  {
    title: 'Panel de análisis y tendencias',
    desc: 'Visualiza métricas clave y tendencias de tus redes sociales en tiempo real.'
  },
  {
    title: 'Respuestas automáticas configurables',
    desc: 'Crea reglas personalizadas para responder automáticamente a interacciones.'
  }
];

const ProductDropdown = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Cierra el menú si el mouse sale del área del dropdown
  const handleMouseLeave = () => setOpen(false);
  const handleMouseEnter = () => setOpen(true);

  // Divide en dos columnas
  const col1 = PRODUCT_ITEMS.slice(0, 3);
  const col2 = PRODUCT_ITEMS.slice(3);

  return (
    <div className="product-dropdown-wrapper" onMouseLeave={handleMouseLeave}>
      <div
        className="product-dropdown-trigger"
        onMouseEnter={handleMouseEnter}
        style={{fontWeight: 700, color: '#fff', background: 'transparent', cursor: 'pointer', padding: '0 18px', fontSize: '1.1em', display: 'inline-block'}}
      >
        Nuestro producto <span style={{fontWeight: 400, fontSize: '0.9em'}}>▼</span>
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
            <div style={{color: '#188fd9', fontWeight: 700, letterSpacing: 1, fontSize: 15, marginBottom: 2}}>SOLUCIONES</div>
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

export default ProductDropdown;
