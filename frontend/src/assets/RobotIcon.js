import React from 'react';

export default function RobotIcon({ size = 22, color = '#fff', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="8" width="16" height="10" rx="4" fill={color}/>
      <rect x="8" y="4" width="8" height="4" rx="2" fill={color}/>
      <circle cx="8" cy="13" r="1.5" fill="#232a3b"/>
      <circle cx="16" cy="13" r="1.5" fill="#232a3b"/>
    </svg>
  );
}
