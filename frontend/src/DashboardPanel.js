import React from 'react';
import './App.css';
import { useTranslation } from 'react-i18next';


const DashboardPanel = () => {
  const { t } = useTranslation();
  return (
    <div className="dashboard-panel aura-main-panel-bg">
      <h2 style={{padding:32}}>{t('sidebar.dashboard')}</h2>
    </div>
  );
};

export default DashboardPanel;
