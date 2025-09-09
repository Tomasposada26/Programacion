import React from 'react';
import '../styles/DashboardPanel.css';

const DashboardPanel = () => {
  return (
    <div className="dashboard-panel aura-main-panel-bg" style={{padding: '32px'}}>
      <h2 style={{fontSize: '2rem', fontWeight: 700, marginBottom: '18px', color: '#183b54'}}>Panel Dashboard</h2>
      <p style={{fontSize: '1.1rem', color: '#232a3b'}}>Texto de prueba para ver el espacio disponible en el panel.</p>
    </div>
  );
};

export default DashboardPanel;
