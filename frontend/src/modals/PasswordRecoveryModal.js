import React, { useState } from 'react';

const PasswordRecoveryModal = ({ isOpen, onClose, onSendRecovery, errorMsg }) => {
	const [email, setEmail] = useState('');

	React.useEffect(() => {
		if (!isOpen) setEmail('');
	}, [isOpen]);

	const handleSubmit = e => {
		e.preventDefault();
		if (onSendRecovery) onSendRecovery(email);
	};

	if (!isOpen) return null;

	return (
		<div
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100vw',
				height: '100vh',
				background: 'rgba(0,0,0,0.4)',
				zIndex: 9999,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
			aria-modal="true"
			role="dialog"
		>
			<div
				style={{
					background: '#fff',
					borderRadius: 10,
					width: 370,
					padding: 32,
					boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
					position: 'relative',
				}}
			>
			<button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>×</button>
				<h2 style={{ marginBottom: 16, textAlign: 'center', fontWeight: 700 }}>Recuperar contraseña</h2>
				<form onSubmit={handleSubmit} aria-label="Formulario de recuperación de contraseña">
					<label htmlFor="recovery-email" style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Correo electrónico</label>
					<input
						id="recovery-email"
						type="email"
						value={email}
						onChange={e => setEmail(e.target.value)}
						style={{ width: '100%', padding: 8, marginBottom: 10 }}
						placeholder="Ingresa tu correo registrado"
						required
						autoFocus
						aria-label="Correo electrónico"
					/>
					{errorMsg && <div style={{ color: '#e53e3e', fontSize: 13, marginBottom: 8 }} role="alert">{errorMsg}</div>}
					<button
						type="submit"
						style={{ width: '100%', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, padding: 14, fontWeight: 700, fontSize: 17, cursor: 'pointer', marginTop: 4 }}
					>
						Recuperar contraseña
					</button>
				</form>
			</div>
		</div>
	);
};

export default PasswordRecoveryModal;
