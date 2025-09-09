import React from 'react';

export default function UsersIcon({ size = 22, color = '#fff', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="4" fill={color}/>
      <circle cx="16" cy="13" r="4" fill={color}/>
      <ellipse cx="8" cy="19" rx="7" ry="3" fill={color}/>
      <ellipse cx="16" cy="22" rx="5" ry="2" fill={color}/>
    </svg>
  );
}
