import { useState, useEffect } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0F1923; --surface: #1A2535; --surface2: #243047; --border: #2E3F58;
    --primary: #0A66C2; --primary-light: #1a7fd4;
    --accent: #00C4CC; --accent2: #7B61FF;
    --text: #E8EDF3; --text-muted: #7B8FA8; --text-dim: #4A6080;
    --success: #22C55E; --warning: #F59E0B; --danger: #EF4444;
    --radius: 12px; --radius-sm: 8px;
  }
  body { background: var(--bg); color: var(--text); font-family: 'Inter', sans-serif; min-height: 100vh; }
  .app { display: flex; min-height: 100vh; }
  .sidebar { width: 224px; min-width: 224px; background: var(--surface); border-right: 1px solid var(--border); padding: 24px 14px; display: flex; flex-direction: column; gap: 2px; position: sticky; top: 0; height: 100vh; overflow-y: auto; }
  .sidebar-logo { font-family: 'Space Grotesk', sans-serif; font-size: 17px; font-weight: 700; color: var(--text); margin-bottom: 24px; padding: 0 8px; display: flex; align-items: center; gap: 8px; }
  .sidebar-logo .dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); }
  .nav-section { font-size: 10px; font-weight: 600; color: var(--text-dim); text-transform: uppercase; letter-spacing: 1px; padding: 12px 8px 4px; }
  .nav-item { display: flex; align-items: center; gap: 9px; padding: 9px 12px; border-radius: var(--radius-sm); cursor: pointer; font-size: 13px; font-weight: 500; color: var(--text-muted); transition: all .15s; border: none; background: none; width: 100%; text-align: left; }
  .nav-item:hover { background: var(--surface2); color: var(--text); }
  .nav-item.active { background: rgba(10,102,194,.15); color: var(--primary-light); }
  .notion-pill { margin-top: auto; padding: 10px 12px; border-radius: var(--radius-sm); background: var(--surface2); border: 1px solid var(--border); display: flex; align-items: center; gap: 8px; font-size: 11px; color: var(--text-muted); }
  .notion-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--text-dim); transition: background .3s; flex-shrink: 0; }
  .notion-dot.ok { background: var(--success); }
  .notion-dot.loading { background: var(--warning); animation: pulse 1s infinite; }
  .notion-dot.error { background: var(--danger); }
  @keyframes pulse { 0%,100%{opacity:1}50%{opacity:.4} }
  .topbar { padding: 14px 26px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; background: var(--surface); position: sticky; top: 0; z-index: 10; }
  .topbar-title { font-family: 'Space Grotesk', sans-serif; font-size: 19px; font-weight: 600; }
  .topbar-sub { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
  .profile-badge { display: flex; align-items: center; gap: 9px; background: var(--surface2); border: 1px solid var(--border); border-radius: 40px; padding: 5px 13px 5px 5px; }
  .avatar { width: 30px; height: 30px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--accent)); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; }
  .content { padding: 26px; flex: 1; }
  .main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
  .composer-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
  .composer-header { padding: 14px 18px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .composer-header-title { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 14px; }
  .composer-body { padding: 18px; display: flex; flex-direction: column; gap: 13px; }
  .panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px; }
  .panel-title { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 13px; margin-bottom: 13px; display: flex; align-items: center; gap: 7px; }
  .tab-row { display: flex; gap: 3px; background: var(--bg); border-radius: var(--radius-sm); padding: 3px; }
  .tab-btn { padding: 6px 13px; border-radius: 6px; font-size: 12px; font-weight: 500; cursor: pointer; border: none; background: none; color: var(--text-muted); transition: all .15s; }
  .tab-btn.active { background: var(--surface2); color: var(--text); }
  .field-label { font-size: 10px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: .5px; margin-bottom: 5px; }
  .prompt-input { width: 100%; background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 10px 12px; color: var(--text); font-size: 13px; font-family: 'Inter', sans-serif; outline: none; transition: border-color .15s; resize: none; }
  .prompt-input:focus { border-color: var(--primary); }
  .prompt-input::placeholder { color: var(--text-dim); }
  .field-input { width: 100%; background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 9px 11px; color: var(--text); font-size: 12px; font-family: 'Inter', sans-serif; outline: none; }
  .field-input:focus { border-color: var(--primary); }
  select.field-input option { background: var(--surface); }
  .post-editor { width: 100%; min-height: 170px; background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 12px; color: var(--text); font-size: 13px; font-family: 'Inter', sans-serif; line-height: 1.6; outline: none; resize: vertical; }
  .post-editor:focus { border-color: var(--primary); }
  .post-editor::placeholder { color: var(--text-dim); }
  .char-count { text-align: right; font-size: 10px; color: var(--text-dim); margin-top: 3px; }
  .char-count.over { color: var(--danger); }
  .options-row { display: flex; gap: 8px; flex-wrap: wrap; }
  .option-chip { display: flex; align-items: center; gap: 5px; padding: 5px 11px; border-radius: 20px; font-size: 11px; font-weight: 500; cursor: pointer; border: 1px solid var(--border); background: var(--bg); color: var(--text-muted); transition: all .15s; }
  .option-chip.selected { border-color: var(--primary); background: rgba(10,102,194,.1); color: var(--primary-light); }
  .option-chip:hover:not(.selected) { border-color: var(--text-dim); color: var(--text); }
  .analysis-row { display: flex; gap: 6px; flex-wrap: wrap; }
  .analysis-chip { padding: 3px 9px; border-radius: 20px; font-size: 10px; font-weight: 600; border: 1px solid; }
  .chip-good { color: var(--success); border-color: var(--success); background: rgba(34,197,94,.08); }
  .chip-warn { color: var(--warning); border-color: var(--warning); background: rgba(245,158,11,.08); }
  .chip-neutral { color: var(--accent); border-color: var(--accent); background: rgba(0,196,204,.08); }
  .hashtag { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; cursor: pointer; transition: all .15s; }
  .hashtag-primary { background: rgba(10,102,194,.15); color: var(--primary-light); border: 1px solid rgba(10,102,194,.3); }
  .hashtag-accent { background: rgba(0,196,204,.1); color: var(--accent); border: 1px solid rgba(0,196,204,.3); }
  .hashtag:hover { transform: translateY(-1px); }
  .hashtag-cloud { display: flex; flex-wrap: wrap; gap: 6px; }
  .btn { display: inline-flex; align-items: center; gap: 5px; padding: 9px 16px; border-radius: var(--radius-sm); font-size: 12px; font-weight: 600; cursor: pointer; border: none; transition: all .15s; font-family: 'Inter', sans-serif; white-space: nowrap; }
  .btn-primary { background: var(--primary); color: #fff; }
  .btn-primary:hover:not(:disabled) { background: var(--primary-light); }
  .btn-primary:disabled { opacity: .5; cursor: not-allowed; }
  .btn-secondary { background: var(--surface2); color: var(--text); border: 1px solid var(--border); }
  .btn-secondary:hover:not(:disabled) { border-color: var(--primary); color: var(--primary-light); }
  .btn-secondary:disabled { opacity: .5; cursor: not-allowed; }
  .btn-accent { background: linear-gradient(135deg, var(--accent), var(--accent2)); color: #fff; }
  .btn-ghost { background: transparent; color: var(--text-muted); }
  .btn-ghost:hover { color: var(--text); }
  .btn-sm { padding: 6px 11px; font-size: 11px; }
  .btn-notion { background: #fff; color: #000; border: 1px solid #ddd; }
  .btn-notion:hover:not(:disabled) { background: #f5f5f5; }
  .btn-notion:disabled { opacity: .5; cursor: not-allowed; }
  .btn-notion-draft { background: var(--surface2); color: var(--text-muted); border: 1px solid var(--border); }
  .btn-notion-draft:hover:not(:disabled) { border-color: #fff; color: #fff; }
  .btn-notion-draft:disabled { opacity: .5; cursor: not-allowed; }
  .posts-list { display: flex; flex-direction: column; gap: 10px; }
  .post-item { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px; display: flex; gap: 12px; align-items: flex-start; transition: border-color .15s; }
  .post-item:hover { border-color: var(--primary); }
  .post-status { width: 7px; height: 7px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }
  .status-scheduled { background: var(--warning); }
  .status-published { background: var(--success); }
  .status-draft { background: var(--text-dim); }
  .post-text { font-size: 12px; color: var(--text); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .post-meta { display: flex; align-items: center; gap: 8px; margin-top: 5px; font-size: 10px; color: var(--text-muted); flex-wrap: wrap; }
  .notion-badge { display: inline-flex; align-items: center; gap: 4px; padding: 2px 7px; border-radius: 10px; font-size: 9px; font-weight: 600; background: rgba(255,255,255,.08); color: var(--text-muted); border: 1px solid var(--border); }
  .notion-badge.synced { background: rgba(34,197,94,.1); color: var(--success); border-color: rgba(34,197,94,.3); }
  .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 12px; margin-bottom: 20px; }
  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px; }
  .stat-label { font-size: 10px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: .5px; }
  .stat-value { font-family: 'Space Grotesk', sans-serif; font-size: 26px; font-weight: 700; color: var(--text); margin: 4px 0; }
  .stat-change { font-size: 11px; }
  .stat-change.up { color: var(--success); }
  .suggestions-list { display: flex; flex-direction: column; gap: 6px; }
  .suggestion-item { background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 10px 12px; font-size: 12px; color: var(--text-muted); cursor: pointer; transition: all .15s; line-height: 1.5; }
  .suggestion-item:hover { border-color: var(--accent); color: var(--text); }
  .preview-card { background: #fff; border-radius: var(--radius); padding: 14px; color: #000; font-size: 13px; line-height: 1.6; }
  .preview-header { display: flex; align-items: center; gap: 9px; margin-bottom: 11px; }
  .preview-avatar { width: 38px; height: 38px; border-radius: 50%; background: var(--primary); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 13px; }
  .preview-name { font-weight: 700; font-size: 13px; }
  .preview-title { font-size: 11px; color: #666; }
  .preview-text { color: #1a1a1a; white-space: pre-wrap; font-size: 13px; }
  .preview-actions { display: flex; gap: 14px; margin-top: 12px; padding-top: 10px; border-top: 1px solid #e0e0e0; }
  .preview-action { font-size: 12px; color: #666; }
  .two-col { display: grid; grid-template-columns: 1fr 360px; gap: 18px; }
  @media (max-width: 1100px) { .two-col { grid-template-columns: 1fr; } }
  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .section-title { font-family: 'Space Grotesk', sans-serif; font-size: 16px; font-weight: 600; }
  .loader { display: inline-block; width: 13px; height: 13px; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; animation: spin .6s linear infinite; }
  .loader-dark { border-color: rgba(0,0,0,.2); border-top-color: #000; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .notif { position: fixed; bottom: 22px; right: 22px; padding: 11px 16px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 12px; font-weight: 500; display: flex; align-items: center; gap: 7px; box-shadow: 0 8px 32px rgba(0,0,0,.4); z-index: 200; animation: slideUp .2s ease; max-width: 340px; }
  @keyframes slideUp { from{transform:translateY(10px);opacity:0}to{transform:translateY(0);opacity:1} }
  .notif-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.6); z-index: 150; display: flex; align-items: center; justify-content: center; }
  .modal { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; width: 440px; max-width: 95vw; }
  .modal-title { font-family: 'Space Grotesk', sans-serif; font-size: 16px; font-weight: 700; margin-bottom: 6px; }
  .modal-sub { font-size: 12px; color: var(--text-muted); margin-bottom: 18px; line-height: 1.6; }
  .modal-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 20px; }
  .empty-state { text-align: center; padding: 36px 20px; color: var(--text-muted); font-size: 13px; }
  .empty-icon { font-size: 32px; margin-bottom: 8px; }
  .divider { height: 1px; background: var(--border); margin: 14px 0; }
  .notion-db-link { font-size: 11px; color: var(--accent); text-decoration: none; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; }
  .notion-db-link:hover { text-decoration: underline; }
`;

const NIcon = ({ name, size = 15 }) => {
  const d = {
    compose: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    chart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    sparkles: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z"/></svg>,
    send: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    clock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    hash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>,
    copy: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>,
    refresh: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>,
    eye: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    linkedin: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
    external: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
    info: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  };
  return d[name] || null;
};

const NotionLogo = ({ size = 14 }) => (
  <span style={{ width: size, height: size, background: "#fff", borderRadius: Math.floor(size * 0.2), display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: Math.floor(size * 0.65), fontWeight: 900, color: "#000", flexShrink: 0, lineHeight: 1 }}>N</span>
);

const TONES = ["Professionnel", "Inspirant", "Éducatif", "Storytelling", "Engageant"];
const TYPES = ["Article", "Conseil", "Étude de cas", "Annonce", "Opinion"];
const MAX_CHARS = 3000;

// ── GÉNÉRATION LOCALE (sans API) ──────────────────────────────────────────

const HOOKS = {
  "Professionnel": {
    "Conseil":      t => `${t} : voici les ${pick([3,4])} points clés que j'applique au quotidien.`,
    "Article":      t => `Après 5 ans d'expérience sur ${t}, voici ce que j'ai vraiment retenu.`,
    "Étude de cas": t => `Comment nous avons résolu un problème critique sur ${t} — retour d'expérience.`,
    "Annonce":      t => `Nouvelle étape franchie : ${t}. Je suis heureux de partager ça avec vous.`,
    "Opinion":      t => `Opinion peu partagée sur ${t} — mais que j'assume entièrement.`,
  },
  "Inspirant": {
    "Conseil":      t => `${t} m'a appris une leçon que je n'oublierai jamais. 💡`,
    "Article":      t => `Tout le monde parle de ${t}. Voici pourquoi c'est une vraie opportunité. 🚀`,
    "Étude de cas": t => `De zéro à des résultats concrets sur ${t} — voici notre parcours.`,
    "Annonce":      t => `Un nouveau chapitre s'ouvre. ${t} — et je suis plus motivé que jamais. ✨`,
    "Opinion":      t => `${t} est sous-estimé. Et c'est une chance pour ceux qui agissent maintenant.`,
  },
  "Éducatif": {
    "Conseil":      t => `Vous voulez progresser sur ${t} ? Commencez par ces fondamentaux. 📚`,
    "Article":      t => `Guide pratique : tout ce qu'il faut savoir sur ${t}.`,
    "Étude de cas": t => `Décryptage : comment fonctionne vraiment ${t} ? (avec exemple concret)`,
    "Annonce":      t => `Nouveau : ${t} — voici comment ça marche et ce que ça change pour vous.`,
    "Opinion":      t => `Ce que la plupart ignorent encore sur ${t} — et pourquoi c'est important.`,
  },
  "Storytelling": {
    "Conseil":      t => `Il y a 3 ans, je ne savais rien de ${t}. Aujourd'hui, c'est mon quotidien.`,
    "Article":      t => `Mon histoire avec ${t} : les erreurs, les succès, et ce que j'en ai retenu.`,
    "Étude de cas": t => `J'étais sceptique sur ${t}. Un projet a tout changé. Voici comment.`,
    "Annonce":      t => `Je me souviens du jour où j'ai décidé de me lancer dans ${t}...`,
    "Opinion":      t => `On m'a dit que ${t} ne marcherait pas. J'ai quand même essayé. Voici ce qui s'est passé.`,
  },
  "Engageant": {
    "Conseil":      t => `Quelle est votre plus grande difficulté avec ${t} ? 👇 (Ma réponse en commentaire)`,
    "Article":      t => `VRAI ou FAUX : ${t} va tout changer dans les 12 prochains mois. 🤔`,
    "Étude de cas": t => `Devinez le résultat avant de lire — sur ${t}, on ne s'attendait pas à ça.`,
    "Annonce":      t => `Grande nouvelle ! ${t} — dites-moi ce que vous en pensez. 💬`,
    "Opinion":      t => `Débat ouvert : sur ${t}, je pense le contraire de la majorité. Qui est d'accord ?`,
  },
};

const BODIES = {
  "Conseil": (t, n) => {
    const pts = [
      `Définir des objectifs mesurables avant de commencer quoi que ce soit`,
      `Mesurer régulièrement les résultats pour ajuster la stratégie`,
      `S'appuyer sur des données concrètes plutôt que sur des intuitions`,
      `Documenter chaque étape pour capitaliser sur les apprentissages`,
      `Collaborer avec des personnes qui ont déjà résolu ce problème`,
    ].slice(0, n);
    return "\n\n" + pts.map((p, i) => `${i + 1}. ${p}`).join("\n");
  },
  "Article": t => `\n\nPlusieurs facteurs expliquent pourquoi ${t} est en pleine évolution :\n\n→ L'adoption rapide de nouvelles pratiques\n→ Des attentes clients qui changent\n→ Des outils qui permettent d'aller plus loin qu'avant\n\nMa conviction : ceux qui anticipent cette tendance maintenant auront une longueur d'avance significative dans 12 mois.`,
  "Étude de cas": t => `\n\nLe contexte : une équipe confrontée à un défi récurrent sur ${t}.\n\nLe problème : des processus manuels, un manque de visibilité, des décisions prises sans données fiables.\n\nCe qu'on a mis en place :\n→ Audit complet de l'existant\n→ Mise en place d'un suivi centralisé\n→ Montée en compétences des équipes\n\nRésultat : gains de temps significatifs et décisions beaucoup mieux éclairées.`,
  "Annonce": t => `\n\nAprès plusieurs mois de travail, cette nouvelle étape est enfin là.\n\nCe que ça change concrètement :\n→ De nouvelles opportunités pour mes clients\n→ Une offre plus complète sur ${t}\n→ Des résultats encore plus mesurables\n\nMerci à toutes les personnes qui m'ont soutenu dans ce projet. 🙏`,
  "Opinion": t => `\n\nVoici pourquoi je pense ça :\n\nD'abord, les données parlent d'elles-mêmes. Les organisations qui ont adopté cette approche sur ${t} performent mieux.\n\nEnsuite, les méthodes traditionnelles montrent leurs limites. La question n'est plus "si", mais "quand".\n\nEnfin, l'écart se creuse entre ceux qui agissent maintenant et ceux qui attendent.`,
};

const CTAS = {
  "Professionnel": [
    "Et vous, quelle est votre expérience sur ce sujet ? Partagez en commentaire.",
    "Des questions ? Je réponds à tous les commentaires.",
    "Vous avez vécu quelque chose de similaire ? Je serais curieux d'en entendre plus.",
  ],
  "Inspirant": [
    "Qu'est-ce qui vous inspire le plus dans ce domaine ? 💬",
    "Partagez si vous avez vécu quelque chose de similaire. 🙏",
    "Retenez ce point. Il pourrait tout changer pour vous. 👇",
  ],
  "Éducatif": [
    "Des questions sur ce sujet ? Posez-les en commentaire, je réponds à chacune.",
    "Sauvegardez ce post pour y revenir. 🔖",
    "Partagez avec quelqu'un qui en a besoin. 🎯",
  ],
  "Storytelling": [
    "Avez-vous vécu une expérience similaire ? Racontez-moi. 👇",
    "Je serais ravi d'entendre votre histoire. 💬",
    "Partagez avec quelqu'un qui traverse la même chose. 🤝",
  ],
  "Engageant": [
    "Likez si vous êtes d'accord, commentez si vous ne l'êtes pas ! 👍",
    "RÉPONDEZ : oui ou non, et pourquoi. 🗣️",
    "Taguez quelqu'un qui devrait lire ça. 👇",
  ],
};

const HASHTAG_MAP = [
  { keys: ["data", "données", "analyse", "analytique"], tags: ["DataAnalytics", "DataScience", "BusinessIntelligence", "DataDriven"] },
  { keys: ["power bi", "powerbi", "dashboard", "tableau de bord"], tags: ["PowerBI", "DataViz", "Dashboard", "Reporting"] },
  { keys: ["python", "script", "code", "développement"], tags: ["Python", "DataEngineering", "Automation", "Dev"] },
  { keys: ["sql", "base de données", "requête"], tags: ["SQL", "Database", "DataEngineering"] },
  { keys: ["automatisation", "workflow", "n8n", "robot"], tags: ["Automation", "n8n", "Workflow", "NoCode"] },
  { keys: ["reporting", "kpi", "indicateur", "performance"], tags: ["Reporting", "KPI", "BusinessAnalytics", "Insights"] },
  { keys: ["startup", "entrepreneur", "fondateur", "lancement"], tags: ["Startup", "Entrepreneuriat", "Innovation", "Business"] },
  { keys: ["freelance", "consultant", "indépendant", "mission"], tags: ["Freelance", "Consultant", "IndépendantIT", "Missions"] },
  { keys: ["ia", "intelligence artificielle", "ai", "machine learning"], tags: ["AI", "MachineLearning", "ArtificialIntelligence"] },
  { keys: ["notion", "organisation", "productivité"], tags: ["Productivity", "Notion", "Organisation"] },
  { keys: ["linkedin", "réseau", "personal branding", "visibilité"], tags: ["LinkedIn", "PersonalBranding", "ContentMarketing"] },
  { keys: ["microsoft fabric", "azure", "cloud"], tags: ["MicrosoftFabric", "Azure", "Cloud", "DataPlatform"] },
];

const DEFAULT_TAGS = ["DataAnalyst", "Consulting", "TechFrance", "DigitalTransformation"];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function generatePostLocal(topic, tone, postType) {
  const hookFn = HOOKS[tone]?.[postType] ?? HOOKS["Professionnel"]["Conseil"];
  const hook = hookFn(topic);
  const bodyFn = BODIES[postType] ?? BODIES["Article"];
  const body = postType === "Conseil" ? bodyFn(topic, pick([3, 4])) : bodyFn(topic);
  const cta = pick(CTAS[tone] ?? CTAS["Professionnel"]);
  return `${hook}${body}\n\n${cta}`;
}

function generateHashtagsLocal(text) {
  const lower = text.toLowerCase();
  const found = new Set();
  for (const { keys, tags } of HASHTAG_MAP) {
    if (keys.some(k => lower.includes(k))) tags.forEach(t => found.add(t));
  }
  DEFAULT_TAGS.forEach(t => found.add(t));
  return [...found].slice(0, 10);
}

function analyzePostLocal(content) {
  const len = content.length;
  const emojiRe = /[\u{1F300}-\u{1FAFF}]/u;
  const hasEmoji = emojiRe.test(content);
  const hasCTA = /comment|partage|avis|question|vous|likez|dites|r[ée]pond|\?/i.test(content.slice(-300));
  const lines = (content.match(/\n/g) || []).length;
  let score = 40;
  if (len >= 400 && len <= 2000) score += 15;
  if (len >= 800 && len <= 1500) score += 10;
  if (hasEmoji) score += 10;
  if (hasCTA) score += 15;
  if (lines >= 4) score += 10;
  const firstLine = content.split("\n")[0];
  const accroche = firstLine.length <= 120 && (firstLine.includes("?") || emojiRe.test(firstLine) || firstLine.includes(":")) ? "Forte" : "À améliorer";
  const longueur = len < 300 ? "Trop court" : len <= 1000 ? "Courte" : len <= 2000 ? "Idéale" : "Trop long";
  const conseil = hasCTA
    ? "Bonne structure ! Pensez à varier vos formats pour maintenir l'engagement."
    : "Ajoutez une question ou un appel à l'action à la fin pour booster l'engagement.";
  return { score: Math.min(score, 100), accroche, cta: hasCTA ? "Présent" : "Absent", longueur, conseil };
}

const TOPIC_SUGGESTIONS = [
  "3 erreurs que j'ai commises en démarrant mon activité freelance en data",
  "Comment j'ai automatisé 80% de mes reportings avec Python et n8n",
  "Power BI : les 5 fonctionnalités que peu de consultants utilisent vraiment",
  "Les KPIs qui comptent vraiment dans le secteur de l'assurance",
  "De consultant salarié à freelance data : ce que personne ne vous dit",
  "Comment convaincre un DSI d'adopter Microsoft Fabric",
  "Modélisation de données : l'erreur que font 90% des débutants",
  "DataViz : pourquoi un bon dashboard commence avant Power BI",
];

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const PORTAL_SESSION_KEY = 'portal_token';

function authHeaders() {
  const token = sessionStorage.getItem(PORTAL_SESSION_KEY);
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export default function App({ onClose }) {
  const [tab, setTab] = useState("compose");
  const [notif, setNotif] = useState(null);
  const [composerTab, setComposerTab] = useState("ia");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Professionnel");
  const [postType, setPostType] = useState("Conseil");
  const [postContent, setPostContent] = useState("");
  const [hashtags, setHashtags] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [isHashtagging, setIsHashtagging] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [schedDate, setSchedDate] = useState("");
  const [schedTime, setSchedTime] = useState("09:00");
  const [schedFreq, setSchedFreq] = useState("once");
  const [notionStatus, setNotionStatus] = useState("idle");
  const [notionDbId, setNotionDbId] = useState(null);
  const [notionDbUrl, setNotionDbUrl] = useState(null);
  const [notionLoadingPostId, setNotionLoadingPostId] = useState(null);
  const [notionDraftLoading, setNotionDraftLoading] = useState(false);
  const [showNotionModal, setShowNotionModal] = useState(false);
  const [notionParentPageId, setNotionParentPageId] = useState("");
  const [posts, setPosts] = useState([
    { id: 1, content: "🚀 Lancement de notre nouvelle fonctionnalité ! Après 6 mois de développement, nous sommes fiers de présenter...", status: "published", date: "2026-06-08 10:30", likes: 142, comments: 23, notionId: null },
    { id: 2, content: "3 leçons que j'ai apprises en construisant une startup :\n\n1. L'exécution > la vision\n2. Écouter ses clients d'abord...", status: "scheduled", date: "2026-06-12 08:00", likes: 0, comments: 0, notionId: null },
    { id: 3, content: "Le marché du SaaS B2B en Afrique francophone représente une opportunité de 12Md$. Voici pourquoi maintenant...", status: "draft", date: "2026-06-14 14:00", likes: 0, comments: 0, notionId: null },
  ]);

  const toast = (msg, color = "#22C55E") => {
    setNotif({ msg, color });
    setTimeout(() => setNotif(null), 4000);
  };

  useEffect(() => {
    const savedDbId = localStorage.getItem("notion_db_id");
    const savedDbUrl = localStorage.getItem("notion_db_url");
    if (savedDbId) { setNotionDbId(savedDbId); if (savedDbUrl) setNotionDbUrl(savedDbUrl); setNotionStatus("ok"); }
    fetch(`${API_BASE}/api/notion/status`, { headers: authHeaders() })
      .then(r => r.json())
      .then(data => {
        if (data.configured) {
          setNotionStatus("ok");
          setNotionDbId(data.dbId);
          setNotionDbUrl(data.dbUrl);
          localStorage.setItem("notion_db_id", data.dbId);
          if (data.dbUrl) localStorage.setItem("notion_db_url", data.dbUrl);
        }
      })
      .catch(() => {});
  }, []);

  const initNotionDb = async () => {
    if (!notionParentPageId.trim()) {
      toast("⚠️ Entrez l'ID de la page parent Notion", "#F59E0B");
      return;
    }
    setNotionStatus("loading");
    try {
      const res = await fetch(`${API_BASE}/api/notion/create-db`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ parentPageId: notionParentPageId.trim() }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setNotionStatus("ok");
      setNotionDbId(data.dbId);
      setNotionDbUrl(data.dbUrl);
      localStorage.setItem("notion_db_id", data.dbId);
      if (data.dbUrl) localStorage.setItem("notion_db_url", data.dbUrl);
      toast("✅ Base Notion créée !");
      setShowNotionModal(false);
    } catch (e) {
      setNotionStatus("error");
      toast(`❌ Notion : ${e.message}`, "#EF4444");
    }
  };

  const savePostToNotion = async (post) => {
    const dbId = notionDbId || localStorage.getItem("notion_db_id");
    if (!dbId) { toast("⚠️ Initialisez Notion d'abord", "#F59E0B"); return; }
    setNotionLoadingPostId(post.id);
    try {
      const res = await fetch(`${API_BASE}/api/notion/save-post`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ content: post.content, status: post.status, date: post.date, dbId }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, notionId: data.notionId } : p));
      toast("✅ Post sauvegardé dans Notion !");
    } catch (e) {
      toast(`❌ ${e.message}`, "#EF4444");
    } finally {
      setNotionLoadingPostId(null);
    }
  };

  const saveDraftToNotion = async () => {
    if (!postContent.trim()) return;
    const dbId = notionDbId || localStorage.getItem("notion_db_id");
    if (!dbId) { toast("⚠️ Initialisez Notion d'abord", "#F59E0B"); return; }
    setNotionDraftLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/notion/save-post`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ content: postContent, status: "draft", tone, postType, hashtags, date: new Date().toISOString().slice(0, 16), dbId }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast("📝 Brouillon enregistré dans Notion !");
    } catch (e) {
      toast(`❌ ${e.message}`, "#EF4444");
    } finally {
      setNotionDraftLoading(false);
    }
  };

  const callClaude = async (prompt, maxTokens = 1024) => {
    const res = await fetch(`${API_BASE}/api/claude`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: maxTokens,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data.content?.[0]?.text || "";
  };

  const generatePost = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true); setSuggestions([]); setAnalysis(null); setHashtags([]);
    try {
      const text = await callClaude(
        `Tu es un expert en rédaction de contenu LinkedIn pour des professionnels de la data et du consulting en France.\n\nGénère un post LinkedIn en français avec ces paramètres :\n- Sujet : ${topic}\n- Ton : ${tone}\n- Type : ${postType}\n\nLe post doit :\n- Commencer par une accroche forte (première ligne percutante, max 120 caractères)\n- Avoir une structure aérée avec des lignes vides entre les paragraphes\n- Contenir une question ou appel à l'action à la fin\n- Faire entre 800 et 1500 caractères\n- Être naturel et authentique\n- Utiliser des emojis avec parcimonie si le ton le permet\n\nRéponds UNIQUEMENT avec le contenu du post, sans commentaire ni titre.`
      );
      setPostContent(text.slice(0, MAX_CHARS));
      toast("✨ Post généré par Claude !");
    } catch (e) {
      setPostContent(generatePostLocal(topic, tone, postType));
      toast("⚠️ Claude indisponible — génération locale", "#F59E0B");
    } finally {
      setIsGenerating(false);
    }
  };

  const analyzePost = async () => {
    if (!postContent.trim()) return;
    setIsAnalyzing(true);
    try {
      const text = await callClaude(
        `Analyse ce post LinkedIn et réponds UNIQUEMENT avec un objet JSON valide (sans markdown) ayant ces champs :\n{"score": number 0-100, "accroche": "Forte" ou "À améliorer", "cta": "Présent" ou "Absent", "longueur": "Trop court" ou "Courte" ou "Idéale" ou "Trop long", "conseil": "conseil court en une phrase"}\n\nPost :\n${postContent}`,
        300
      );
      setAnalysis(JSON.parse(text));
      toast("📊 Analyse par Claude terminée");
    } catch {
      setAnalysis(analyzePostLocal(postContent));
      toast("📊 Analyse locale (Claude indisponible)");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateHashtags = async () => {
    if (!postContent.trim() && !topic.trim()) return;
    setIsHashtagging(true);
    try {
      const text = await callClaude(
        `Génère 8 à 10 hashtags LinkedIn pertinents en français et anglais pour ce contenu :\n\n${postContent || topic}\n\nRéponds UNIQUEMENT avec les hashtags séparés par des virgules, sans le symbole #, sans espaces.`,
        200
      );
      const tags = text.split(",").map(t => t.trim()).filter(Boolean).slice(0, 10);
      setHashtags(tags);
      toast("# Hashtags générés par Claude");
    } catch {
      setHashtags(generateHashtagsLocal(postContent || topic));
      toast("# Hashtags locaux (Claude indisponible)");
    } finally {
      setIsHashtagging(false);
    }
  };

  const getSuggestions = async () => {
    setIsGenerating(true); setSuggestions([]);
    try {
      const text = await callClaude(
        `Génère 3 idées originales de sujets de posts LinkedIn pour un consultant data analyst freelance en France (spécialiste Power BI, Python, SQL, automatisation, Microsoft Fabric).\n\nRéponds UNIQUEMENT avec 3 lignes, une idée par ligne, sans numérotation ni tiret ni guillemets.`,
        250
      );
      const ideas = text.split("\n").map(l => l.trim()).filter(Boolean).slice(0, 3);
      setSuggestions(ideas.length ? ideas : [...TOPIC_SUGGESTIONS].sort(() => Math.random() - 0.5).slice(0, 3));
    } catch {
      setSuggestions([...TOPIC_SUGGESTIONS].sort(() => Math.random() - 0.5).slice(0, 3));
    } finally {
      setIsGenerating(false);
    }
  };

  const addHashtagToPost = (tag) => setPostContent(p => p + (p.endsWith("\n") ? "" : "\n") + "#" + tag + " ");

  const saveLocalDraft = () => {
    if (!postContent.trim()) return;
    setPosts(prev => [{ id: Date.now(), content: postContent, status: "draft", date: new Date().toISOString().slice(0, 16).replace("T", " "), likes: 0, comments: 0, notionId: null }, ...prev]);
    toast("💾 Brouillon local sauvegardé");
    setPostContent("");
  };

  const schedulePost = () => {
    if (!postContent.trim() || !schedDate) { toast("Remplir le contenu et la date", "#F59E0B"); return; }
    setPosts(prev => [{ id: Date.now(), content: postContent, status: "scheduled", date: schedDate + " " + schedTime, likes: 0, comments: 0, notionId: null }, ...prev]);
    toast("🗓️ Post planifié !"); setPostContent(""); setSchedDate("");
  };

  const deletePost = (id) => { setPosts(prev => prev.filter(p => p.id !== id)); toast("Post supprimé", "#EF4444"); };
  const editPost = (post) => { setPostContent(post.content); setTab("compose"); setComposerTab("manual"); };

  const totalLikes = posts.reduce((s, p) => s + p.likes, 0);
  const totalComments = posts.reduce((s, p) => s + p.comments, 0);
  const notionSynced = posts.filter(p => p.notionId).length;

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">

        {/* SIDEBAR */}
        <nav className="sidebar">
          <div className="sidebar-logo">
            <NIcon name="linkedin" size={18} /> LI Manager <span className="dot" />
          </div>
          <span className="nav-section">Principal</span>
          {[["compose","Composer","compose"],["posts","Mes posts","calendar"],["stats","Analytics","chart"]].map(([key,label,icon]) => (
            <button key={key} className={"nav-item" + (tab===key?" active":"")} onClick={() => setTab(key)}>
              <NIcon name={icon} size={14} /> {label}
            </button>
          ))}
          <span className="nav-section" style={{marginTop:12}}>Intégrations</span>
          <button className="nav-item" onClick={() => setShowNotionModal(true)}>
            <NotionLogo size={14} /> Notion
          </button>
          <div className="notion-pill">
            <div className={"notion-dot" + (notionStatus==="ok"?" ok":notionStatus==="loading"?" loading":notionStatus==="error"?" error":"")} />
            <span>{notionStatus==="ok"?"Notion actif":notionStatus==="loading"?"Connexion...":notionStatus==="error"?"Erreur Notion":"Notion non initialisé"}</span>
          </div>
        </nav>

        {/* MAIN */}
        <div className="main">
          <div className="topbar">
            <div>
              <div className="topbar-title">{tab==="compose"?"Composer un post":tab==="posts"?"Mes publications":"Analytics LinkedIn"}</div>
              <div className="topbar-sub">{new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div className="profile-badge"><div className="avatar">VP</div><span style={{fontSize:12,fontWeight:500}}>Votre profil</span></div>
              {onClose && (
                <button onClick={onClose} style={{width:32,height:32,borderRadius:"50%",background:"var(--surface2)",border:"1px solid var(--border)",color:"var(--text-muted)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,transition:"all .15s"}} onMouseEnter={e=>e.currentTarget.style.color="var(--text)"} onMouseLeave={e=>e.currentTarget.style.color="var(--text-muted)"} title="Fermer">✕</button>
              )}
            </div>
          </div>

          <div className="content">

            {/* ══ COMPOSE ══ */}
            {tab==="compose" && (
              <div className="two-col">
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  <div className="composer-card">
                    <div className="composer-header">
                      <span className="composer-header-title">Rédaction</span>
                      <div className="tab-row">
                        {[["ia","✨ IA"],["manual","✍️ Manuel"]].map(([t,l]) => (
                          <button key={t} className={"tab-btn"+(composerTab===t?" active":"")} onClick={() => setComposerTab(t)}>{l}</button>
                        ))}
                      </div>
                    </div>
                    <div className="composer-body">
                      {composerTab==="ia" && <>
                        <div>
                          <div className="field-label">Sujet du post</div>
                          <textarea className="prompt-input" rows={2} placeholder="Ex: 3 leçons apprises en lançant ma startup en Afrique..." value={topic} onChange={e => setTopic(e.target.value)} />
                        </div>
                        <div>
                          <div className="field-label">Ton</div>
                          <div className="options-row">{TONES.map(t => <div key={t} className={"option-chip"+(tone===t?" selected":"")} onClick={() => setTone(t)}>{t}</div>)}</div>
                        </div>
                        <div>
                          <div className="field-label">Type</div>
                          <div className="options-row">{TYPES.map(t => <div key={t} className={"option-chip"+(postType===t?" selected":"")} onClick={() => setPostType(t)}>{t}</div>)}</div>
                        </div>
                        <div style={{display:"flex",gap:7}}>
                          <button className="btn btn-primary" onClick={generatePost} disabled={isGenerating||!topic.trim()} style={{flex:1}}>
                            {isGenerating?<><span className="loader"/>Génération...</>:<><NIcon name="sparkles" size={13}/>Générer</>}
                          </button>
                          <button className="btn btn-secondary" onClick={getSuggestions} disabled={isGenerating}><NIcon name="refresh" size={13}/></button>
                        </div>
                        {suggestions.length>0 && <div>
                          <div className="field-label">Idées</div>
                          <div className="suggestions-list">{suggestions.map((s,i) => <div key={i} className="suggestion-item" onClick={()=>{setTopic(s);setSuggestions([])}}>💡 {s}</div>)}</div>
                        </div>}
                      </>}

                      <div>
                        <div className="field-label">Contenu du post</div>
                        <textarea className="post-editor" placeholder="Votre post LinkedIn ici..." value={postContent} onChange={e => setPostContent(e.target.value.slice(0,MAX_CHARS))} />
                        <div className={"char-count"+(postContent.length>MAX_CHARS*.9?" over":"")}>{postContent.length} / {MAX_CHARS}</div>
                      </div>

                      {analysis && <div>
                        <div className="field-label">Analyse</div>
                        <div className="analysis-row">
                          <div className="analysis-chip chip-good">Score {analysis.score}/100</div>
                          <div className={"analysis-chip "+(analysis.accroche==="Forte"?"chip-good":"chip-warn")}>Accroche: {analysis.accroche}</div>
                          <div className={"analysis-chip "+(analysis.cta==="Présent"?"chip-good":"chip-warn")}>CTA: {analysis.cta}</div>
                          <div className="analysis-chip chip-neutral">Longueur: {analysis.longueur}</div>
                        </div>
                        {analysis.conseil && <div style={{marginTop:6,fontSize:11,color:"var(--text-muted)",padding:"7px 11px",background:"var(--bg)",borderRadius:6,borderLeft:"3px solid var(--accent)"}}>💡 {analysis.conseil}</div>}
                      </div>}

                      {hashtags.length>0 && <div>
                        <div className="field-label">Hashtags <span style={{color:"var(--text-dim)",fontWeight:400}}>(cliquer pour ajouter)</span></div>
                        <div className="hashtag-cloud">{hashtags.map((tag,i) => <span key={tag} className={"hashtag "+(i%2===0?"hashtag-primary":"hashtag-accent")} onClick={()=>addHashtagToPost(tag)}>#{tag}</span>)}</div>
                      </div>}

                      {/* Toolbar */}
                      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                        <button className="btn btn-secondary btn-sm" onClick={analyzePost} disabled={isAnalyzing||!postContent.trim()}>{isAnalyzing?<span className="loader" style={{width:11,height:11}}/>:"📊"} Analyser</button>
                        <button className="btn btn-secondary btn-sm" onClick={generateHashtags} disabled={isHashtagging}>{isHashtagging?<span className="loader" style={{width:11,height:11}}/>:<NIcon name="hash" size={11}/>} Hashtags</button>
                        <button className="btn btn-secondary btn-sm" onClick={()=>{navigator.clipboard.writeText(postContent);toast("📋 Copié !")}} disabled={!postContent}><NIcon name="copy" size={11}/> Copier</button>
                        <button className="btn btn-secondary btn-sm" onClick={()=>setShowPreview(!showPreview)} disabled={!postContent}><NIcon name="eye" size={11}/> Aperçu</button>
                        <button className="btn btn-secondary btn-sm" onClick={saveLocalDraft} disabled={!postContent.trim()}>💾 Local</button>
                      </div>

                      <div className="divider"/>

                      {/* ── NOTION ACTIONS dans le composeur ── */}
                      <div>
                        <div className="field-label" style={{display:"flex",alignItems:"center",gap:6}}>
                          <NotionLogo size={12}/> Sauvegarder dans Notion
                        </div>
                        <button className="btn btn-notion-draft" disabled={!postContent.trim()||notionDraftLoading} onClick={saveDraftToNotion} style={{width:"100%",justifyContent:"center"}}>
                          {notionDraftLoading
                            ? <><span className="loader" style={{width:11,height:11,borderColor:"rgba(255,255,255,.3)",borderTopColor:"var(--text)"}}/>Enregistrement...</>
                            : <>📝 Enregistrer comme brouillon Notion</>}
                        </button>
                        {notionStatus!=="ok" && <div style={{marginTop:7,fontSize:11,color:"var(--text-dim)",display:"flex",alignItems:"center",gap:5}}>
                          <NIcon name="info" size={11}/>
                          <span>Notion non initialisé — <span style={{color:"var(--accent)",cursor:"pointer"}} onClick={()=>setShowNotionModal(true)}>Configurer</span></span>
                        </div>}
                      </div>
                    </div>
                  </div>

                  {showPreview && postContent && (
                    <div className="composer-card">
                      <div className="composer-header"><span className="composer-header-title">Prévisualisation LinkedIn</span></div>
                      <div style={{padding:18}}>
                        <div className="preview-card">
                          <div className="preview-header">
                            <div className="preview-avatar">VP</div>
                            <div><div className="preview-name">Votre Nom</div><div className="preview-title">Votre titre · 1er</div></div>
                          </div>
                          <div className="preview-text">{postContent}</div>
                          <div className="preview-actions">
                            <span className="preview-action">👍 J'aime</span>
                            <span className="preview-action">💬 Commenter</span>
                            <span className="preview-action">🔁 Partager</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* RIGHT PANEL */}
                <div style={{display:"flex",flexDirection:"column",gap:13}}>
                  <div className="panel">
                    <div className="panel-title"><NIcon name="clock" size={14}/> Planification</div>
                    <div style={{display:"flex",flexDirection:"column",gap:10}}>
                      <div><div className="field-label">Date</div><input type="date" className="field-input" value={schedDate} onChange={e=>setSchedDate(e.target.value)}/></div>
                      <div><div className="field-label">Heure</div><input type="time" className="field-input" value={schedTime} onChange={e=>setSchedTime(e.target.value)}/></div>
                      <div><div className="field-label">Fréquence</div>
                        <select className="field-input" value={schedFreq} onChange={e=>setSchedFreq(e.target.value)}>
                          <option value="once">Une seule fois</option><option value="weekly">Hebdomadaire</option>
                        </select>
                      </div>
                      <button className="btn btn-primary" onClick={schedulePost} disabled={!postContent.trim()||!schedDate} style={{width:"100%",justifyContent:"center"}}><NIcon name="clock" size={13}/> Planifier</button>
                      <button className="btn btn-accent" style={{width:"100%",justifyContent:"center"}} disabled={!postContent.trim()}><NIcon name="send" size={13}/> Publier maintenant</button>
                    </div>
                  </div>

                  {/* Notion workspace panel */}
                  <div className="panel">
                    <div className="panel-title"><NotionLogo size={16}/> Notion Workspace</div>
                    {notionStatus==="ok" ? (
                      <div style={{display:"flex",flexDirection:"column",gap:10}}>
                        <div style={{fontSize:12,color:"var(--success)",display:"flex",alignItems:"center",gap:6}}><NIcon name="check" size={12}/> Base "LinkedIn Posts Manager" active</div>
                        <div style={{fontSize:11,color:"var(--text-muted)"}}>{notionSynced} post{notionSynced!==1?"s":""} synchronisé{notionSynced!==1?"s":""}</div>
                        {notionDbUrl && <a href={notionDbUrl} target="_blank" rel="noopener noreferrer" className="notion-db-link"><NIcon name="external" size={11}/> Ouvrir dans Notion</a>}
                        <button className="btn btn-secondary btn-sm" onClick={() => { setNotionStatus("loading"); fetch(`${API_BASE}/api/notion/status`, { headers: authHeaders() }).then(r=>r.json()).then(d=>{ if(d.configured){setNotionStatus("ok");setNotionDbId(d.dbId);setNotionDbUrl(d.dbUrl);}else{setNotionStatus("idle");} }).catch(()=>setNotionStatus("error")); }} style={{width:"100%",justifyContent:"center"}}><NIcon name="refresh" size={11}/> Resynchroniser</button>
                      </div>
                    ) : (
                      <div style={{display:"flex",flexDirection:"column",gap:10}}>
                        <div style={{fontSize:12,color:"var(--text-muted)",lineHeight:1.5}}>Connectez Notion pour sauvegarder vos posts et brouillons directement dans votre workspace.</div>
                        <button className="btn btn-notion" onClick={() => setShowNotionModal(true)} disabled={notionStatus==="loading"} style={{width:"100%",justifyContent:"center"}}>
                          {notionStatus==="loading"?<><span className="loader loader-dark" style={{width:11,height:11}}/>Connexion...</>:<>⚡ Initialiser Notion</>}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="panel">
                    <div className="panel-title">⏰ Meilleurs moments</div>
                    {[["Mar–Jeu","8h–10h","🔥 Très fort"],["Lun–Ven","12h–13h","🟡 Bon"],["Mer","17h–18h","🟠 Moyen"]].map(([day,time,score]) => (
                      <div key={day} style={{display:"flex",justifyContent:"space-between",fontSize:11,padding:"7px 0",borderBottom:"1px solid var(--border)"}}>
                        <span>{day} · {time}</span><span>{score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ══ POSTS ══ */}
            {tab==="posts" && <>
              <div className="section-header">
                <span className="section-title">Publications ({posts.length})</span>
                {notionStatus==="ok" && <span style={{fontSize:11,color:"var(--success)",display:"flex",alignItems:"center",gap:4}}><NIcon name="check" size={11}/> {notionSynced} dans Notion</span>}
              </div>
              {posts.length===0
                ? <div className="empty-state"><div className="empty-icon">📝</div><div>Aucun post encore.</div></div>
                : <div className="posts-list">
                    {posts.map(post => (
                      <div key={post.id} className="post-item">
                        <div className={"post-status status-"+post.status}/>
                        <div style={{flex:1,minWidth:0}}>
                          <div className="post-text">{post.content}</div>
                          <div className="post-meta">
                            <span>{post.status==="published"?"✅ Publié":post.status==="scheduled"?"🗓️ Planifié":"📝 Brouillon"}</span>
                            <span>•</span>
                            <span>{post.date}</span>
                            {post.likes>0 && <><span>•</span><span>👍 {post.likes}</span><span>💬 {post.comments}</span></>}
                            {post.notionId && <span className="notion-badge synced"><span style={{fontSize:8,fontWeight:900}}>N</span> Notion ✓</span>}
                          </div>
                        </div>
                        <div style={{display:"flex",gap:5,flexShrink:0,flexWrap:"wrap",justifyContent:"flex-end"}}>
                          {/* Bouton Notion */}
                          <button
                            className="btn btn-sm"
                            style={{
                              background: post.notionId?"rgba(34,197,94,.1)":"#fff",
                              color: post.notionId?"var(--success)":"#000",
                              border: post.notionId?"1px solid rgba(34,197,94,.3)":"1px solid #ddd",
                            }}
                            onClick={() => !post.notionId && savePostToNotion(post)}
                            disabled={!!post.notionId||notionLoadingPostId===post.id}
                            title={post.notionId?"Déjà dans Notion":"Sauvegarder dans Notion"}
                          >
                            {notionLoadingPostId===post.id
                              ? <span className="loader loader-dark" style={{width:10,height:10}}/>
                              : post.notionId
                                ? <><NIcon name="check" size={11}/> Notion</>
                                : <><NotionLogo size={11}/> Sauvegarder</>}
                          </button>
                          <button className="btn btn-ghost btn-sm" onClick={()=>editPost(post)}><NIcon name="compose" size={12}/></button>
                          <button className="btn btn-ghost btn-sm" onClick={()=>{navigator.clipboard.writeText(post.content);toast("📋 Copié !")}}><NIcon name="copy" size={12}/></button>
                          <button className="btn btn-ghost btn-sm" style={{color:"var(--danger)"}} onClick={()=>deletePost(post.id)}><NIcon name="trash" size={12}/></button>
                        </div>
                      </div>
                    ))}
                  </div>}
            </>}

            {/* ══ STATS ══ */}
            {tab==="stats" && <>
              <div className="section-header">
                <span className="section-title">Vue d'ensemble</span>
                <select className="field-input" style={{width:"auto",fontSize:12}}>
                  <option>7 derniers jours</option><option>30 derniers jours</option>
                </select>
              </div>
              <div className="stats-grid">
                {[
                  {label:"Impressions",value:"12 840",change:"+18%",up:true},
                  {label:"J'aimes",value:String(totalLikes),change:"+24%",up:true},
                  {label:"Commentaires",value:String(totalComments),change:"+11%",up:true},
                  {label:"Posts publiés",value:String(posts.filter(p=>p.status==="published").length)},
                  {label:"Posts planifiés",value:String(posts.filter(p=>p.status==="scheduled").length)},
                  {label:"Synchro Notion",value:String(notionSynced),change:notionStatus==="ok"?"✅ Actif":"⚪ Inactif"},
                ].map(({label,value,change,up}) => (
                  <div key={label} className="stat-card">
                    <div className="stat-label">{label}</div>
                    <div className="stat-value">{value}</div>
                    {change && <div className={"stat-change"+(up?" up":"")}>{change}</div>}
                  </div>
                ))}
              </div>
            </>}

          </div>
        </div>
      </div>

      {/* ── NOTION MODAL ── */}
      {showNotionModal && (
        <div className="modal-overlay" onClick={()=>setShowNotionModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
              <NotionLogo size={28}/>
              <div className="modal-title">Intégration Notion</div>
            </div>
            <div className="modal-sub">
              Crée automatiquement la base <strong>"LinkedIn Posts Manager"</strong> dans votre workspace Notion.<br/><br/>
              <strong>Prérequis :</strong><br/>
              1. Créez une intégration sur <a href="https://www.notion.so/my-integrations" target="_blank" rel="noopener noreferrer" style={{color:"var(--accent)"}}>notion.so/my-integrations</a> et copiez le token dans <code style={{background:"var(--bg)",padding:"1px 5px",borderRadius:4}}>backend/.env</code> → <code style={{background:"var(--bg)",padding:"1px 5px",borderRadius:4}}>NOTION_TOKEN</code><br/>
              2. Créez une page Notion, partagez-la avec l'intégration, puis collez son ID ci-dessous.
            </div>
            {notionStatus==="ok"
              ? <div style={{padding:"12px 14px",background:"rgba(34,197,94,.08)",border:"1px solid rgba(34,197,94,.3)",borderRadius:"var(--radius-sm)",fontSize:13,color:"var(--success)",display:"flex",alignItems:"center",gap:8}}>
                  <NIcon name="check" size={14}/> Base de données active !
                  {notionDbUrl && <a href={notionDbUrl} target="_blank" rel="noopener noreferrer" className="notion-db-link" style={{marginLeft:"auto"}}>Ouvrir <NIcon name="external" size={11}/></a>}
                </div>
              : <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <div>
                    <div className="field-label">ID de la page parent Notion</div>
                    <input
                      className="field-input"
                      placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      value={notionParentPageId}
                      onChange={e => setNotionParentPageId(e.target.value)}
                      style={{fontFamily:"monospace",fontSize:12}}
                    />
                    <div style={{fontSize:10,color:"var(--text-dim)",marginTop:4}}>Copiez l'ID depuis l'URL Notion : notion.so/Mon-titre-<strong>xxxxxxxx...</strong></div>
                  </div>
                  <button className="btn btn-notion" onClick={initNotionDb} disabled={notionStatus==="loading"||!notionParentPageId.trim()} style={{width:"100%",justifyContent:"center",padding:"12px"}}>
                    {notionStatus==="loading"?<><span className="loader loader-dark" style={{width:13,height:13}}/>Création...</>:<>⚡ Créer la base de données</>}
                  </button>
                </div>}
            <div className="modal-actions"><button className="btn btn-secondary btn-sm" onClick={()=>setShowNotionModal(false)}>Fermer</button></div>
          </div>
        </div>
      )}

      {/* NOTIFICATION */}
      {notif && <div className="notif"><div className="notif-dot" style={{background:notif.color}}/>{notif.msg}</div>}
    </>
  );
}
