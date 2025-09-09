import React from 'react';

export default function TrendsIcon({ size = 22, color = '#fff', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
      <path d="M3 17l6-6 4 4 8-8" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="3" cy="17" r="2" fill={color}/>
      <circle cx="9" cy="11" r="2" fill={color}/>
      <circle cx="13" cy="15" r="2" fill={color}/>
      <circle cx="21" cy="7" r="2" fill={color}/>
    </svg>
  );
}
