import React from 'react';
import '../styles/ModernSwitch.css';

const ModernSwitch = ({ checked, onChange }) => (
  <label className="modern-switch">
    <input type="checkbox" checked={checked} onChange={onChange} />
    <span className="slider" />
  </label>
);

export default ModernSwitch;
