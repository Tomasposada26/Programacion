import React from 'react';

export default function AuraBotAvatar({ style = {}, className = '' }) {
  return (
    <svg
      width="90"
      height="90"
      viewBox="0 0 90 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      className={className}
    >
      <circle cx="45" cy="45" r="44" fill="#fff" stroke="#10b981" strokeWidth="2" />
      <ellipse cx="45" cy="55" rx="24" ry="18" fill="#10b981" fillOpacity="0.13" />
      <ellipse cx="45" cy="40" rx="22" ry="20" fill="#10b981" />
      <ellipse cx="35" cy="38" rx="3.5" ry="4.5" fill="#fff" />
      <ellipse cx="55" cy="38" rx="3.5" ry="4.5" fill="#fff" />
      <ellipse cx="35" cy="38" rx="1.5" ry="2" fill="#232a3b" />
      <ellipse cx="55" cy="38" rx="1.5" ry="2" fill="#232a3b" />
      <rect x="38" y="50" width="14" height="4" rx="2" fill="#fff" />
      <rect x="41" y="18" width="8" height="10" rx="4" fill="#10b981" />
      <rect x="41" y="18" width="8" height="4" rx="2" fill="#fff" />
      <rect x="25" y="30" width="4" height="10" rx="2" fill="#10b981" />
      <rect x="61" y="30" width="4" height="10" rx="2" fill="#10b981" />
    </svg>
  );
}
