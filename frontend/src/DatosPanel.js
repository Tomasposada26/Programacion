import React from 'react';
import './App.css';
import { useTranslation } from 'react-i18next';

const DatosPanel = () => {
  const { t } = useTranslation();
  return (
    <div className="datos-panel aura-main-panel-bg">
      {/* Aquí puedes personalizar la interfaz de Análisis de Datos */}
      <h2 style={{padding:32}}>{t('sidebar.data')}</h2>
    </div>
  );
};

export default DatosPanel;
