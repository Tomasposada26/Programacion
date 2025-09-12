// fetchWithAuth.js
// Wrapper para fetch que detecta 401 y ejecuta un callback de logout

// fetchWithAuth ahora acepta un cuarto parámetro opcional: token
export default async function fetchWithAuth(url, options = {}, onLogout, token) {
  // Clona las opciones para no mutar el objeto original
  const opts = { ...options };
  opts.headers = opts.headers ? { ...opts.headers } : {};
  if (token) {
    opts.headers['Authorization'] = `Bearer ${token}`;
  }
  try {
    const res = await fetch(url, opts);
    if (res.status === 401) {
      if (typeof onLogout === 'function') onLogout();
      throw new Error('Sesión expirada');
    }
    return res;
  } catch (err) {
    if (err.message === 'Sesión expirada' && typeof onLogout === 'function') {
      onLogout();
    }
    throw err;
  }
}
