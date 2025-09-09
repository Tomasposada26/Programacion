// fetchWithAuth.js
// Wrapper para fetch que detecta 401 y ejecuta un callback de logout

export default async function fetchWithAuth(url, options = {}, onLogout) {
  try {
    const res = await fetch(url, options);
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
