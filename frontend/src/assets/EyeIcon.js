import React from 'react';


const EyeIcon = ({ open = false, ...props }) => (
	<svg
		width={28}
		height={28}
		viewBox="0 0 28 28"
		fill="none"
		style={{ verticalAlign: 'middle', cursor: 'pointer', transition: 'stroke 0.2s' }}
		{...props}
	>
		{/* Fondo circular */}
		<circle cx="14" cy="14" r="13" fill="#f4f6fa" stroke="#d1d5db" strokeWidth="1.5" />
		{/* Ojo abierto */}
		<g style={{ opacity: open ? 1 : 0.7, transition: 'opacity 0.2s' }}>
			<path d="M4 14s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" stroke="#6366f1" strokeWidth="2" fill="none" />
			<circle cx="14" cy="14" r="3.2" stroke="#6366f1" strokeWidth="2" fill="#fff" />
			<circle cx="14" cy="14" r="1.2" fill="#6366f1" />
		</g>
		{/* Ojo cerrado */}
		<g style={{ opacity: open ? 0 : 1, transition: 'opacity 0.2s' }}>
			<path d="M4 14s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" stroke="#888" strokeWidth="2" fill="none" />
			<circle cx="14" cy="14" r="3.2" stroke="#888" strokeWidth="2" fill="#fff" />
			<circle cx="14" cy="14" r="1.2" fill="#888" />
			{/* Línea de cerrado */}
			<line x1="8" y1="8" x2="20" y2="20" stroke="#e53e3e" strokeWidth="2.2" strokeLinecap="round" />
		</g>
	</svg>
);

export default EyeIcon;
