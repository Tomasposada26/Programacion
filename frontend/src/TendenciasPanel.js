import React from 'react';
import './App.css';
import { useTranslation } from 'react-i18next';

const TendenciasPanel = () => {
  const { t } = useTranslation();
  return (
    <div className="tendencias-panel aura-main-panel-bg">
      {/* Aquí puedes personalizar la interfaz de Análisis de Tendencias */}
      <h2 style={{padding:32}}>{t('sidebar.trends')}</h2>
    </div>
  );
};

export default TendenciasPanel;
