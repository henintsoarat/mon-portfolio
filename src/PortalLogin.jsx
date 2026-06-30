import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 60;

export default function PortalLogin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockout, setLockout] = useState(0);

  useEffect(() => {
    if (lockout <= 0) return;
    const id = setInterval(() => {
      setLockout(s => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [lockout]);

  const isLocked = lockout > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLocked) return;
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (newAttempts >= MAX_ATTEMPTS) {
          setLockout(LOCKOUT_SECONDS);
          setAttempts(0);
          throw new Error(`Trop de tentatives. Réessayez dans ${LOCKOUT_SECONDS}s.`);
        }
        throw new Error(data.error || 'Identifiants incorrects.');
      }
      const { token } = await res.json();
      setAttempts(0);
      onLogin(token);
    } catch (err) {
      const msg = err.message;
      setError(msg.includes('fetch') || msg.includes('Failed') ? 'Impossible de contacter le serveur.' : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030508] text-white flex flex-col items-center justify-center px-4" style={{ fontFamily: 'Arial, sans-serif' }}>

      <div className="pointer-events-none fixed top-0 left-0 w-full h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(0,240,255,0.6),transparent)' }} />
      <div className="pointer-events-none fixed bottom-0 left-0 w-full h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(255,0,60,0.3),transparent)' }} />
      <div className="pointer-events-none fixed -top-40 -right-40 w-[500px] h-[500px] bg-[#00F0FF]/4 blur-[140px] rounded-full" />
      <div className="pointer-events-none fixed bottom-0 -left-20 w-[350px] h-[350px] bg-[#FF003C]/4 blur-[120px] rounded-full" />

      <div className="text-center mb-12 relative z-10">
        <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 border border-[#27272A] rounded-full bg-[#0D1117]/60">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
          <span className="text-xs font-mono text-[#A1A1AA] uppercase tracking-widest">Portail Admin</span>
        </div>
        <h1 className="text-5xl font-black tracking-tighter mb-2" style={{ color: '#00F0FF', textShadow: '0 0 40px rgba(0,240,255,0.4)' }}>
          RATOVONIRINA
        </h1>
        <p className="text-white text-xl font-bold">Henintsoa Andrianaivo</p>
        <p className="text-[#52525b] text-sm mt-2 font-mono">Espace de travail personnel</p>
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <div className="bg-[#0D1117] border border-[#27272A] rounded-2xl p-8 shadow-2xl" style={{ boxShadow: '0 0 60px rgba(0,240,255,0.06)' }}>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/20 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-[#00F0FF]">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Connexion</h2>
              <p className="text-[#52525b] text-xs font-mono">Accès restreint</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-[#A1A1AA] mb-1.5 font-mono uppercase tracking-widest">Identifiant</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                placeholder="admin"
                required
                className="w-full bg-[#030508] border border-[#27272A] rounded-xl px-4 py-3 text-sm text-white placeholder-[#3f3f46] focus:outline-none focus:border-[#00F0FF]/50 transition duration-200"
              />
            </div>

            <div>
              <label className="block text-xs text-[#A1A1AA] mb-1.5 font-mono uppercase tracking-widest">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="••••••••••"
                  required
                  className="w-full bg-[#030508] border border-[#27272A] rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-[#3f3f46] focus:outline-none focus:border-[#00F0FF]/50 transition duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52525b] hover:text-[#A1A1AA] transition"
                >
                  {showPassword
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            {(error || isLocked) && (
              <div className="text-xs text-center px-3 py-2.5 rounded-lg bg-[#FF003C]/10 border border-[#FF003C]/20 text-[#FF003C]">
                {isLocked ? `Accès bloqué — réessayez dans ${lockout}s` : error}
              </div>
            )}

            {attempts > 0 && !isLocked && (
              <p className="text-[10px] text-center text-[#FF003C]/50 font-mono">
                {MAX_ATTEMPTS - attempts} tentative{MAX_ATTEMPTS - attempts > 1 ? 's' : ''} restante{MAX_ATTEMPTS - attempts > 1 ? 's' : ''}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || isLocked}
              className="w-full mt-2 py-3 rounded-xl bg-[#00F0FF] text-black font-bold text-sm hover:bg-white transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ boxShadow: (loading || isLocked) ? 'none' : '0 0 24px rgba(0,240,255,0.3)' }}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2 justify-center">
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
                  Vérification…
                </span>
              ) : isLocked ? `Bloqué (${lockout}s)` : 'Accéder au portail'}
            </button>
          </form>
        </div>
      </div>

      <p className="relative z-10 mt-10 text-[#3f3f46] text-xs font-mono">
        © {new Date().getFullYear()} Henintsoa — Madagascar
      </p>
    </div>
  );
}
