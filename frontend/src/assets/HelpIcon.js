import React from 'react';

export default function HelpIcon({ size = 32, color = '#188fd9', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
      <text x="12" y="15" textAnchor="middle" fontSize="28" fontWeight="bold" fill={color} dominantBaseline="middle">?</text>
    </svg>
  );
}
