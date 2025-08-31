import React from 'react';
import './App.css';
import { useTranslation } from 'react-i18next';

const PruebaNetoPanel = () => {
  const { t } = useTranslation();
  return (
    <div className="prueba-neto-panel aura-main-panel-bg">
      {/* Aquí puedes personalizar la interfaz de Prueba Neto */}
      <h2 style={{padding:32}}>{t('sidebar.test')}</h2>
    </div>
  );
};

export default PruebaNetoPanel;
