import { useState } from 'react';
import { useAuth } from './AuthContext';

export default function LoginScreen() {
  const { loginAsVisitor, loginAsAdmin } = useAuth();
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginAsAdmin(username, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-4">
      {/* Branding */}
      <div className="text-center mb-12">
        <h1 className="text-6xl font-black tracking-tight mb-3">Henintsoa</h1>
        <p className="text-slate-400 text-lg">Data Analyst Portfolio</p>
        <div className="flex justify-center gap-2 mt-4 flex-wrap">
          {['Power BI', 'Python', 'SQL', 'Microsoft Fabric'].map(t => (
            <span key={t} className="px-3 py-1 text-xs rounded-full border border-slate-800 text-slate-500">{t}</span>
          ))}
        </div>
      </div>

      <div className="w-full max-w-md">
        {!showAdminForm ? (
          <>
            <p className="text-center text-slate-500 text-sm mb-6">Choisissez votre mode d'accès</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={loginAsVisitor}
                className="flex flex-col items-center gap-4 p-8 bg-slate-900 border border-slate-800 rounded-3xl hover:border-slate-600 hover:-translate-y-1 transition duration-300 cursor-pointer"
              >
                <span className="text-5xl">👁️</span>
                <div className="text-center">
                  <p className="font-bold text-lg">Visiteur</p>
                  <p className="text-slate-400 text-sm mt-1">Accès libre au portfolio</p>
                </div>
              </button>
              <button
                onClick={() => setShowAdminForm(true)}
                className="flex flex-col items-center gap-4 p-8 bg-slate-900 border border-slate-800 rounded-3xl hover:border-blue-500 hover:-translate-y-1 transition duration-300 cursor-pointer"
              >
                <span className="text-5xl">🔐</span>
                <div className="text-center">
                  <p className="font-bold text-lg">Admin</p>
                  <p className="text-slate-400 text-sm mt-1">Accès restreint</p>
                </div>
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleAdminLogin} className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
            <div className="text-center mb-6">
              <span className="text-3xl">🔐</span>
              <h2 className="text-xl font-bold mt-2">Connexion Administration</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Identifiant</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  autoComplete="username"
                  placeholder="admin"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Mot de passe</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            {error && (
              <div className="mt-4 text-sm text-center px-4 py-3 rounded-xl bg-red-950 text-red-400">
                {error}
              </div>
            )}
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => { setShowAdminForm(false); setError(''); setUsername(''); setPassword(''); }}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 transition text-sm"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 rounded-xl bg-white text-black font-semibold hover:scale-105 transition disabled:opacity-50 disabled:scale-100 text-sm"
              >
                {loading ? 'Connexion…' : 'Se connecter'}
              </button>
            </div>
          </form>
        )}
      </div>

      <p className="mt-12 text-slate-700 text-xs">© {new Date().getFullYear()} Henintsoa — Madagascar</p>
    </div>
  );
}
