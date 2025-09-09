import React, { useState, useEffect, useRef } from 'react';
import EyeIcon from '../assets/EyeIcon';

// Modal funcional para el flujo de recuperación
const BACKEND_URL = process.env.REACT_APP_API_URL || 'https://programacion-gdr0.onrender.com';
function PasswordResetModal({ isOpen, onClose, onReset, email, errorMsg, step }) {
	const [code, setCode] = useState(['', '', '', '', '', '']);
	const [password, setPassword] = useState('');
	const [repeat, setRepeat] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showRepeat, setShowRepeat] = useState(false);
	const [timer, setTimer] = useState(60);
	const [resending, setResending] = useState(false);
	const timerRef = useRef();

	useEffect(() => {
		if (!isOpen) {
			setCode(['', '', '', '', '', '']);
			setPassword('');
			setRepeat('');
			setTimer(60);
			clearInterval(timerRef.current);
		}
	}, [isOpen]);

	useEffect(() => {
		if (step === 'code' && isOpen) {
			timerRef.current = setInterval(() => {
				setTimer(t => {
					if (t <= 1) {
						clearInterval(timerRef.current);
						return 0;
					}
					return t - 1;
				});
			}, 1000);
			return () => clearInterval(timerRef.current);
		}
	}, [step, isOpen]);

	if (!isOpen) return null;

	return (
		<div style={{
			position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
		}} aria-modal="true" role="dialog">
			<div style={{ background: '#fff', borderRadius: 10, width: 370, padding: 32, boxShadow: '0 4px 24px rgba(0,0,0,0.15)', position: 'relative' }}>
				<button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>×</button>
				{step === 'code' && (
					<>
												<h2 style={{ marginBottom: 16, textAlign: 'center', fontWeight: 700 }}>Verificar cuenta</h2>
												<div style={{ textAlign: 'center', marginBottom: 12, color: '#444', fontSize: 16 }}>
													Ingresa el código que te enviamos a<br />
													<span style={{ color: '#6366f1', fontWeight: 600 }}>{email || 'tu correo'}</span>
												</div>
																<form onSubmit={e => { e.preventDefault(); onReset(code.join('')); }} autoComplete="off">
													<div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
														{code.map((v, i) => (
															<input
																key={i}
																type="text"
																inputMode="numeric"
																maxLength={1}
																value={v}
																onChange={e => {
																	const val = e.target.value.replace(/[^0-9]/g, '');
																	if (!val) return;
																	const newCode = [...code];
																	newCode[i] = val;
																	setCode(newCode);
																	// focus next
																	if (i < 5) {
																		const next = document.getElementById(`code-input-${i+1}`);
																		if (next) next.focus();
																	}
																}}
																onKeyDown={e => {
																	if (e.key === 'Backspace' && !code[i] && i > 0) {
																		const prev = document.getElementById(`code-input-${i-1}`);
																		if (prev) prev.focus();
																	}
																}}
																id={`code-input-${i}`}
																style={{ width: 44, height: 54, fontSize: 28, textAlign: 'center', border: '2px solid #6366f1', borderRadius: 8, outline: 'none', background: '#fafbff', color: '#222', fontWeight: 600, boxShadow: '0 1px 4px #6366f11a' }}
																autoFocus={i === 0}
															/>
														))}
													</div>
																				<div style={{ textAlign: 'center', marginBottom: 12, color: '#888', fontSize: 15 }}>
																					{timer > 0 ? (
																						<>
																							Puedes reenviar el código en <span style={{ color: '#6366f1', fontWeight: 600 }}>{timer}s</span>
																						</>
																					) : (
																						<button
																							type="button"
																							disabled={resending}
																							style={{ background: 'none', border: 'none', color: '#6366f1', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', fontSize: 15, padding: 0, marginBottom: 8 }}
																							onClick={async () => {
																								setResending(true);
																								try {
																									await fetch(`${BACKEND_URL}/api/recovery/request`, {
																										method: 'POST',
																										headers: { 'Content-Type': 'application/json' },
																										body: JSON.stringify({ correo: email })
																									});
																									setTimer(60);
																								} catch {}
																								setResending(false);
																							}}
																						>
																							Enviar nuevo código
																						</button>
																					)}
																				</div>
													{errorMsg && <div style={{ color: '#e53e3e', fontSize: 13, marginBottom: 8 }} role="alert">{errorMsg}</div>}
													<button type="submit" style={{ width: '100%', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, padding: 14, fontWeight: 700, fontSize: 17, cursor: 'pointer', marginTop: 4 }}>Verificar cuenta</button>
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

