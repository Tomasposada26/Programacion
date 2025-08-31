import React from 'react';

const EyeIcon = ({ open = false, ...props }) => (
	<svg
		width={22}
		height={22}
		viewBox="0 0 24 24"
		fill="none"
		stroke={open ? '#6366f1' : '#888'}
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		style={{ verticalAlign: 'middle', cursor: 'pointer' }}
		{...props}
	>
		{open ? (
			<g>
				<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
				<circle cx="12" cy="12" r="3" />
			</g>
		) : (
			<g>
				<path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.81 21.81 0 0 1 5.06-7.94" />
				<path d="M1 1l22 22" />
			</g>
		)}
	</svg>
);

export default EyeIcon;
