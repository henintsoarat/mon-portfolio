import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const TOKEN_KEY = 'portfolio_admin_token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const saved = sessionStorage.getItem(TOKEN_KEY);
    if (!saved) { setInitializing(false); return; }
    fetch(`${API_URL}/api/verify`, { headers: { Authorization: `Bearer ${saved}` } })
      .then(r => r.json())
      .then(data => {
        if (data.valid) { setToken(saved); setRole(data.role); }
        else sessionStorage.removeItem(TOKEN_KEY);
      })
      .catch(() => sessionStorage.removeItem(TOKEN_KEY))
      .finally(() => setInitializing(false));
  }, []);

  const loginAsVisitor = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setRole('visitor');
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  }, []);

  const loginAsAdmin = useCallback(async (username, password) => {
    let res;
    try {
      res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
    } catch {
      throw new Error('Impossible de contacter le serveur. Vérifiez que le backend est démarré.');
    }
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Identifiants incorrects.');
    }
    const { token: jwt } = await res.json();
    sessionStorage.setItem(TOKEN_KEY, jwt);
    setToken(jwt);
    setRole('admin');
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setRole(null);
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  }, []);

  return (
    <AuthContext.Provider value={{ role, initializing, loginAsVisitor, loginAsAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
