// Iconos SVG para las páginas legales
import React from 'react';


// Escudo minimalista (Privacidad)
// Permite height y width proporcionales, por defecto 44 de alto
export const PrivacidadIcon = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#4CAF50"/>
    <path d="M9 12l2 2l4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);


// Documento minimalista (Términos)
export const TerminosIcon = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Documento */}
    <path d="M42 8H22a4 4 0 0 0-4 4v40a4 4 0 0 0 4 4h20a4 4 0 0 0 4-4V12a4 4 0 0 0-4-4z" fill="#ECEFF1" stroke="#37474F" strokeWidth="3"/>
    <path d="M42 8v12h12" fill="#80DEEA" stroke="#37474F" strokeWidth="3"/>
    <line x1="20" y1="24" x2="36" y2="24" stroke="#37474F" strokeWidth="3" strokeLinecap="round"/>
    <line x1="20" y1="30" x2="36" y2="30" stroke="#37474F" strokeWidth="3" strokeLinecap="round"/>
    <line x1="20" y1="36" x2="36" y2="36" stroke="#37474F" strokeWidth="3" strokeLinecap="round"/>
    <line x1="20" y1="42" x2="30" y2="42" stroke="#37474F" strokeWidth="3" strokeLinecap="round"/>
    {/* Círculo con check */}
    <circle cx="44" cy="44" r="10" fill="#4DD0E1" stroke="#37474F" strokeWidth="3"/>
    <path d="M40 44l3 3l6-6" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);


// Papelera minimalista (Eliminación)
export const EliminacionIcon = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Documento */}
    <path d="M42 8H22a4 4 0 0 0-4 4v40a4 4 0 0 0 4 4h20a4 4 0 0 0 4-4V12a4 4 0 0 0-4-4z" fill="#F5F9FF" stroke="#3E2723" strokeWidth="3"/>
    <path d="M42 8v12h12" fill="#B0BEC5" stroke="#3E2723" strokeWidth="3"/>
    {/* Texto simulado */}
    <line x1="22" y1="28" x2="38" y2="28" stroke="#3E2723" strokeWidth="3" strokeLinecap="round"/>
    <line x1="22" y1="34" x2="38" y2="34" stroke="#3E2723" strokeWidth="3" strokeLinecap="round"/>
    <line x1="22" y1="40" x2="32" y2="40" stroke="#3E2723" strokeWidth="3" strokeLinecap="round"/>
    {/* Círculo rojo */}
    <circle cx="20" cy="44" r="10" fill="#FF7043" stroke="#3E2723" strokeWidth="3"/>
    <line x1="15" y1="44" x2="25" y2="44" stroke="white" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);
