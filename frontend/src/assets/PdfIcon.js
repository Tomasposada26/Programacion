import React from 'react';

export const PdfIcon = ({ size = 36 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width={size} height={size}>
    {/* Documento */}
    <path fill="#e0e0e0" d="M8 4h22l10 10v30a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2z"/>
    {/* Doblez */}
    <path fill="#bdbdbd" d="M30 4v10h10L30 4z"/>
    {/* Etiqueta roja */}
    <rect x="10" y="26" width="28" height="10" rx="2" ry="2" fill="#f44336"/>
    {/* Texto PDF */}
    <text x="24" y="34" fontFamily="Arial, sans-serif" fontSize="6" fontWeight="bold" textAnchor="middle" fill="white">
      PDF
    </text>
  </svg>
);
