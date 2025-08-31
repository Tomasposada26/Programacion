import React, { useState, useEffect } from 'react';
import EyeIcon from './assets/EyeIcon';

// Modal funcional para el flujo de recuperación
function PasswordResetModal({ isOpen, onClose, onReset, email, errorMsg, step }) {
	const [code, setCode] = useState('');
	const [password, setPassword] = useState('');
	const [repeat, setRepeat] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showRepeat, setShowRepeat] = useState(false);

	useEffect(() => {
		if (!isOpen) {
			setCode('');
			setPassword('');
			setRepeat('');
		}
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<div style={{
			position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
		}} aria-modal="true" role="dialog">
			<div style={{ background: '#fff', borderRadius: 10, width: 370, padding: 32, boxShadow: '0 4px 24px rgba(0,0,0,0.15)', position: 'relative' }}>
				<button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>×</button>
				{step === 'code' && (
					<>
						<h2 style={{ marginBottom: 16, textAlign: 'center', fontWeight: 700 }}>Verifica tu código</h2>
						<form onSubmit={e => { e.preventDefault(); onReset(code); }}>
							<label htmlFor="recovery-code" style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Código recibido</label>
							<input
								id="recovery-code"
								type="text"
								value={code}
								onChange={e => setCode(e.target.value)}
								style={{ width: '100%', padding: 8, marginBottom: 10 }}
								placeholder="Ingresa el código"
								required
								autoFocus
							/>
							{errorMsg && <div style={{ color: '#e53e3e', fontSize: 13, marginBottom: 8 }} role="alert">{errorMsg}</div>}
							<button type="submit" style={{ width: '100%', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, padding: 14, fontWeight: 700, fontSize: 17, cursor: 'pointer', marginTop: 4 }}>Verificar</button>
						</form>
					</>
				)}
				{step === 'newpass' && (
					<>
						<h2 style={{ marginBottom: 16, textAlign: 'center', fontWeight: 700 }}>Nueva contraseña</h2>
						<form onSubmit={e => { e.preventDefault(); onReset(password, repeat); }}>
													<label htmlFor="reset-password" style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Nueva contraseña</label>
													<div style={{ position: 'relative', width: '100%', marginBottom: 10 }}>
														<input
															id="reset-password"
															type={showPassword ? 'text' : 'password'}
															value={password}
															onChange={e => setPassword(e.target.value)}
															style={{ width: '100%', padding: '8px 38px 8px 8px', fontSize: 16, borderRadius: 6, boxSizing: 'border-box', transition: 'border 0.2s' }}
															placeholder="Nueva contraseña"
															required
															autoFocus
														/>
														<button
															type="button"
															onClick={() => setShowPassword(v => !v)}
															style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', padding: 0, cursor: 'pointer', height: 28, width: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
															tabIndex={0}
															aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
														>
															<EyeIcon open={showPassword} />
														</button>
													</div>
													<label htmlFor="reset-repeat" style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Repetir contraseña</label>
													<div style={{ position: 'relative', width: '100%', marginBottom: 10 }}>
														<input
															id="reset-repeat"
															type={showRepeat ? 'text' : 'password'}
															value={repeat}
															onChange={e => setRepeat(e.target.value)}
															style={{ width: '100%', padding: '8px 38px 8px 8px', fontSize: 16, borderRadius: 6, boxSizing: 'border-box', transition: 'border 0.2s' }}
															placeholder="Repite la contraseña"
															required
														/>
														<button
															type="button"
															onClick={() => setShowRepeat(v => !v)}
															style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', padding: 0, cursor: 'pointer', height: 28, width: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
															tabIndex={0}
															aria-label={showRepeat ? 'Ocultar contraseña' : 'Mostrar contraseña'}
														>
															<EyeIcon open={showRepeat} />
														</button>
													</div>
							{errorMsg && <div style={{ color: '#e53e3e', fontSize: 13, marginBottom: 8 }} role="alert">{errorMsg}</div>}
							<button type="submit" style={{ width: '100%', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, padding: 14, fontWeight: 700, fontSize: 17, cursor: 'pointer', marginTop: 4 }}>Confirmar</button>
						</form>
					</>
				)}
			</div>
		</div>
	);
}

export default PasswordResetModal;

