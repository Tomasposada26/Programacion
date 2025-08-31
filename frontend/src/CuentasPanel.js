import React from 'react';
import './App.css';

const CuentasPanel = () => {
  return (
    <div
      className="cuentas-panel aura-main-panel-bg"
      style={{
        minHeight: 'calc(100vh - 100px)', // debajo de la barra superior
        marginLeft: 0, // ya que el main tiene marginLeft: 320px
        background: '#fff',
        padding: '0 0 0 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        boxSizing: 'border-box',
        width: '100%'
      }}
    >
      <div style={{padding: '40px 48px', maxWidth: 800, fontSize: '1.13rem', color: '#232a3b', lineHeight: 1.7}}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, urna eu tincidunt consectetur, nisi nisl aliquam nunc, eget aliquam massa nisi nec erat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse potenti. Etiam euismod, urna eu tincidunt consectetur, nisi nisl aliquam nunc, eget aliquam massa nisi nec erat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse potenti. Etiam euismod, urna eu tincidunt consectetur, nisi nisl aliquam nunc, eget aliquam massa nisi nec erat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse potenti. Etiam euismod, urna eu tincidunt consectetur, nisi nisl aliquam nunc, eget aliquam massa nisi nec erat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse potenti.
      </div>
    </div>
  );
};

export default CuentasPanel;
