import { useState, useEffect } from 'react';
import PortalLogin from './PortalLogin';
import PortalDashboard from './PortalDashboard';
import PortfolioDataAnalyst from './PortfolioDataAnalyst';

const SESSION_KEY = 'portal_token';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const PUBLIC_MODE = import.meta.env.VITE_PUBLIC_MODE === 'true';

export default function App() {
  const [view, setView] = useState(null);

  useEffect(() => {
    if (PUBLIC_MODE) {
      setView('portfolio');
      return;
    }
    const token = sessionStorage.getItem(SESSION_KEY);
    if (!token) {
      setView('login');
      return;
    }
    fetch(`${API_URL}/api/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        if (data.valid) {
          setView('dashboard');
        } else {
          sessionStorage.removeItem(SESSION_KEY);
          setView('login');
        }
      })
      .catch(() => {
        sessionStorage.removeItem(SESSION_KEY);
        setView('login');
      });
  }, []);

  const handleLogin = (token) => {
    if (!token || typeof token !== 'string') return;
    sessionStorage.setItem(SESSION_KEY, token);
    setView('dashboard');
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setView('login');
  };

  if (view === null) {
    return (
      <div className="min-h-screen bg-[#030508] flex items-center justify-center">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
      </div>
    );
  }

  if (view === 'portfolio') return <PortfolioDataAnalyst onBack={PUBLIC_MODE ? null : () => setView('dashboard')} />;
  if (view === 'login') return <PortalLogin onLogin={handleLogin} />;
  return <PortalDashboard onNavigate={setView} onLogout={handleLogout} />;
}
