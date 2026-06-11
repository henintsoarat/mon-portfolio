import { AuthProvider, useAuth } from './AuthContext';
import LoginScreen from './LoginScreen';
import PortfolioDataAnalyst from './PortfolioDataAnalyst';

function AppContent() {
  const { role, initializing } = useAuth();

  if (initializing) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-600 text-sm">Chargement…</div>
      </div>
    );
  }

  if (!role) return <LoginScreen />;
  return <PortfolioDataAnalyst />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
