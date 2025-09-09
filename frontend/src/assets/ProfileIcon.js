import React from 'react';

export default function ProfileIcon({ size = 32, color = '#fff', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="4.5" fill={color} />
      <ellipse cx="12" cy="17" rx="7" ry="4" fill={color} />
    </svg>
  );
}
