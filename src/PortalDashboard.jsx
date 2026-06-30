export default function PortalDashboard({ onNavigate, onLogout }) {
  const apps = [
    {
      id: 'portfolio',
      emoji: '📊',
      title: 'Mon Portfolio',
      desc: 'Portfolio Data Analyst — Power BI, Python, SQL, Microsoft Fabric.',
      status: 'active',
      color: '#00F0FF',
      action: () => onNavigate('portfolio'),
    },
    {
      id: 'projets',
      emoji: '📁',
      title: 'Gestion de Projets',
      desc: 'Suivi des tâches, kanban, jalons et ressources projets.',
      status: 'soon',
      color: '#A855F7',
      action: null,
    },
    {
      id: 'comptabilite',
      emoji: '💰',
      title: 'Comptabilité & Finance',
      desc: 'Facturation, suivi des dépenses, rapports financiers.',
      status: 'soon',
      color: '#22C55E',
      action: null,
    },
    {
      id: 'rh',
      emoji: '👥',
      title: 'Ressources Humaines',
      desc: 'Gestion des équipes, congés, évaluations et contrats.',
      status: 'soon',
      color: '#F97316',
      action: null,
    },
  ];

  return (
    <div className="min-h-screen bg-[#030508] text-white" style={{ fontFamily: 'Arial, sans-serif' }}>

      {/* Glow blobs */}
      <div className="pointer-events-none fixed -top-40 -right-40 w-[500px] h-[500px] bg-[#00F0FF]/3 blur-[140px] rounded-full" />
      <div className="pointer-events-none fixed bottom-0 -left-20 w-[350px] h-[350px] bg-[#FF003C]/3 blur-[120px] rounded-full" />

      {/* Scan lines top/bottom */}
      <div className="pointer-events-none fixed top-0 left-0 w-full h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(0,240,255,0.5),transparent)' }} />
      <div className="pointer-events-none fixed bottom-0 left-0 w-full h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(255,0,60,0.2),transparent)' }} />

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[#27272A] backdrop-blur-md" style={{ backgroundColor: 'rgba(3,5,8,0.8)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/20 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
            </div>
            <div>
              <span className="text-sm font-bold text-white tracking-tight">Portail Admin</span>
              <span className="ml-2 text-[10px] font-mono text-[#52525b] uppercase tracking-widest">/ RATOVONIRINA</span>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#FF003C]/50 hover:text-[#FF003C] transition uppercase tracking-widest"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Déconnexion
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-16 relative z-10">

        {/* Title block */}
        <div className="mb-14">
          <p className="text-xs font-mono text-[#00F0FF] uppercase tracking-widest mb-3">Tableau de bord</p>
          <h1 className="text-4xl font-black tracking-tighter text-white mb-3">
            Espace de travail
          </h1>
          <p className="text-[#52525b] text-sm max-w-md">
            Accédez à vos applications depuis ce portail centralisé. D'autres outils seront ajoutés progressivement.
          </p>
        </div>

        {/* Apps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {apps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-16 text-center text-[#3f3f46] text-xs font-mono">
          © {new Date().getFullYear()} Henintsoa Andrianaivo — Portail privé
        </p>
      </main>
    </div>
  );
}

function AppCard({ app }) {
  const isActive = app.status === 'active';

  return (
    <div
      onClick={isActive ? app.action : undefined}
      className={`
        relative group bg-[#0D1117] border rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300
        ${isActive
          ? 'border-[#27272A] hover:border-[#00F0FF]/40 cursor-pointer hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(0,240,255,0.08)]'
          : 'border-[#1a1a1f] opacity-60 cursor-default'
        }
      `}
    >
      {/* Status badge */}
      <div className="absolute top-4 right-4">
        {isActive
          ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/20 text-[#00F0FF] text-[10px] font-mono uppercase tracking-widest">
              <span className="w-1 h-1 rounded-full bg-[#00F0FF] animate-pulse" />
              Actif
            </span>
          : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1a1a1f] border border-[#27272A] text-[#52525b] text-[10px] font-mono uppercase tracking-widest">
              Bientôt
            </span>
        }
      </div>

      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-300"
        style={{
          backgroundColor: `${app.color}10`,
          border: `1px solid ${app.color}20`,
        }}
      >
        {app.emoji}
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="font-bold text-white text-base mb-1.5 leading-tight">{app.title}</h3>
        <p className="text-[#52525b] text-xs leading-relaxed">{app.desc}</p>
      </div>

      {/* CTA */}
      {isActive && (
        <div
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest transition-all duration-200 group-hover:gap-2.5"
          style={{ color: app.color }}
        >
          Ouvrir
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </div>
      )}
    </div>
  );
}
