import React from 'react';

export default function DashboardIcon({ size = 22, color = '#fff', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="13" width="7" height="8" rx="2" fill={color}/>
      <rect x="14" y="3" width="7" height="18" rx="2" fill={color}/>
    </svg>
  );
}
