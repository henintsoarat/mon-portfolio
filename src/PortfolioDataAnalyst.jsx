import React, { useState, useRef, useEffect } from "react";
import emailjs from "@emailjs/browser";
import LifeCalculator from "./LifeCalculator";
import { useAuth } from "./AuthContext";
import LinkedInManager from "./linkedin_manager";

const EMAILJS_SERVICE_ID = "service_4k6fbdp";
const EMAILJS_TEMPLATE_ID = "template_rxm98ga";
const EMAILJS_PUBLIC_KEY = "hVKKAZFnXWGFCz2LZ";

const skills = [
  "Power BI", "Python", "SQL", "Microsoft Fabric",
  "Cognos Analytics", "n8n", "DataViz", "Web Scraping",
  "Git/GitHub", "REST API",
];

const projects = [
  {
    id: 1,
    title: "Pilotage & Reporting Data",
    description: "Dashboards Power BI, KPI métiers et automatisation des reportings opérationnels — du traitement brut à la visualisation décisionnelle.",
    emoji: "📊",
    access: "public",
    buttonLabel: "Voir les projets",
    action: "data",
  },
  {
    id: 2,
    title: "Espace Projets Privés",
    description: "Études de cas confidentielles, projets clients et ressources réservées à l'administration du portfolio.",
    emoji: "🔐",
    access: "admin",
    buttonLabel: "Accéder au panel",
    action: "admin",
  },
  {
    id: 3,
    title: "Vibe Coding avec Claude Code",
    description: "Applications fullstack conçues en vibe coding pour résoudre des problèmes concrets du quotidien : piloter un établissement scolaire, décrypter un marché, simuler ses finances personnelles, organiser ses tâches et prendre de meilleures décisions de vie — chaque outil transforme une complexité métier en interface simple et actionnable.",
    emoji: "⚡",
    access: "public",
    buttonLabel: "Voir les projets",
    action: "vibe",
  },
];

function SkillCard({ skill }) {
  return (
    <div className="bg-[#111113] border border-slate-800 rounded-2xl p-5 text-center hover:-translate-y-1 hover:border-slate-600 hover:bg-slate-800/50 transition duration-200 cursor-default">
      <span className="text-sm md:text-base font-medium text-slate-300">{skill}</span>
    </div>
  );
}

function ProgressBar({ label, value }) {
  const safeValue = Math.min(100, Math.max(0, value));
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span>{label}</span>
        <span>{safeValue}%</span>
      </div>
      <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-3 bg-white rounded-full transition-all duration-500" style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}

function ProjectCard({ project, onAction }) {
  return (
    <div className="bg-[#111113] border border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col hover:-translate-y-2 hover:border-slate-600 hover:shadow-2xl hover:shadow-blue-500/5 transition duration-200 h-full">
      <div className="text-4xl mb-6">{project.emoji}</div>
      <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>{project.title}</h3>
      <p className="text-slate-400 leading-relaxed flex-1" style={{ lineHeight: '1.75' }}>{project.description}</p>
      {project.access === 'admin' && (
        <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-yellow-500/70">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
          <span>Accès admin uniquement</span>
        </div>
      )}
      <button
        onClick={onAction}
        className="mt-6 w-full px-4 py-3 rounded-2xl bg-white text-black font-semibold text-sm hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98] transition duration-200 cursor-pointer"
      >
        {project.buttonLabel} →
      </button>
    </div>
  );
}

function sanitize(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

function ContactForm() {
  const [form, setForm] = useState({ from_name: "", from_email: "", company: "", subject: "", message: "" });
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const lastSent = useRef(0);
  const submitCount = useRef(0);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (honeypot !== "") return;

    const now = Date.now();
    if (now - lastSent.current < 30000) {
      setStatus({ type: "error", msg: "Patientez 30 secondes avant un nouvel envoi." });
      return;
    }
    if (submitCount.current >= 5) {
      setStatus({ type: "error", msg: "Limite d'envois atteinte pour cette session." });
      return;
    }

    const name    = sanitize(form.from_name);
    const email   = sanitize(form.from_email);
    const company = sanitize(form.company);
    const subject = sanitize(form.subject);
    const message = sanitize(form.message);

    if (!name || name.length < 2) { setStatus({ type: "error", msg: "Veuillez entrer votre nom complet." }); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setStatus({ type: "error", msg: "Adresse email invalide." }); return; }
    if (!subject) { setStatus({ type: "error", msg: "Veuillez choisir un objet." }); return; }
    if (!message || message.length < 10) { setStatus({ type: "error", msg: "Le message doit contenir au moins 10 caractères." }); return; }
    if (message.length > 2000) { setStatus({ type: "error", msg: "Message trop long (max 2000 caractères)." }); return; }

    setLoading(true);
    setStatus(null);

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name:  name,
          from_email: email,
          company:    company || "Non renseignée",
          subject:    subject,
          message:    message,
        },
        EMAILJS_PUBLIC_KEY
      );
      lastSent.current = Date.now();
      submitCount.current += 1;
      setStatus({ type: "success", msg: "✅ Message envoyé ! Je vous répondrai dans les plus brefs délais." });
      setForm({ from_name: "", from_email: "", company: "", subject: "", message: "" });
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus({ type: "error", msg: `❌ Erreur (${err?.status || ""} ${err?.text || JSON.stringify(err)}). Réessayez ou contactez via LinkedIn.` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 text-left">
      {/* Honeypot anti-bot */}
      <div style={{ display: "none" }}>
        <input type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Nom complet *</label>
          <input name="from_name" value={form.from_name} onChange={handleChange}
            placeholder="Jean Dupont" maxLength={100} type="text"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Email *</label>
          <input name="from_email" value={form.from_email} onChange={handleChange}
            placeholder="jean@exemple.com" maxLength={150} type="email"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Entreprise</label>
          <input name="company" value={form.company} onChange={handleChange}
            placeholder="Nom de votre entreprise" maxLength={100} type="text"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Objet *</label>
          <select name="subject" value={form.subject} onChange={handleChange}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500">
            <option value="">-- Choisir un objet --</option>
            <option value="Mission freelance - Data Analysis">Mission freelance — Data Analysis</option>
            <option value="Mission freelance - Power BI">Mission freelance — Power BI</option>
            <option value="Mission freelance - Automatisation">Mission freelance — Automatisation</option>
            <option value="Mission freelance - Reporting">Mission freelance — Developpeur FullStack avec Claude</option>
            <option value="Collaboration / Partenariat">Collaboration / Partenariat</option>
            <option value="Autre demande">Autre demande</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-slate-400 mb-1">Message *</label>
          <textarea name="message" value={form.message} onChange={handleChange}
            placeholder="Décrivez votre projet ou votre besoin..." maxLength={2000} rows={4}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-y" />
        </div>
      </div>

      {status && (
        <div className={`mt-4 text-sm text-center px-4 py-3 rounded-xl ${
          status.type === "success" ? "bg-green-950 text-green-400" : "bg-red-950 text-red-400"
        }`}>
          {status.msg}
        </div>
      )}

      <button onClick={handleSubmit} disabled={loading}
        className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white text-black font-semibold hover:scale-105 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100">
        {loading ? "⏳ Envoi en cours..." : "📤 Envoyer le message"}
      </button>
    </div>
  );
}

function useTypewriter(phrases, { typingSpeed = 75, deletingSpeed = 40, pauseMs = 2200 } = {}) {
  const [text, setText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIndex];
    let timeout;
    if (!isDeleting && text === current) {
      timeout = setTimeout(() => setIsDeleting(true), pauseMs);
    } else if (isDeleting && text === '') {
      setIsDeleting(false);
      setPhraseIndex((i) => (i + 1) % phrases.length);
    } else {
      timeout = setTimeout(() => {
        setText(isDeleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1));
      }, isDeleting ? deletingSpeed : typingSpeed);
    }
    return () => clearTimeout(timeout);
  }, [text, isDeleting, phraseIndex]);

  return text;
}

export default function PortfolioDataAnalyst() {
  const { role, logout } = useAuth();
  const typedText = useTypewriter([
    "spécialisé en DataViz Power BI",
    "automatisation et reporting décisionnel",
    "Vibe Coding Fullstack avec Claude Code",
    "expert Microsoft Fabric & Python",
    "disponible pour missions freelance",
  ]);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showVibeCoding, setShowVibeCoding] = useState(false);
  const [showDataProject, setShowDataProject] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showLinkedInManager, setShowLinkedInManager] = useState(false);
  const linkedInUrl = "https://www.linkedin.com/in/henintsoa-ratovonirina/";
  const openLinkedIn = () => window.open(linkedInUrl, "_blank");

  const handleProjectAction = (action) => {
    if (action === 'vibe') setShowVibeCoding(true);
    else if (action === 'data') setShowDataProject(true);
    else if (action === 'admin') setShowAdminPanel(true);
  };

  const visibleProjects = projects.filter(p => p.access === 'public' || (p.access === 'admin' && role === 'admin'));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen bg-[#09090B] text-white scroll-smooth" style={{ fontFamily: "'Inter', sans-serif" }}>

{/* Bandeau défilant */}
<div className="w-full bg-slate-900 border-b border-slate-800 overflow-hidden py-3">
  <div className="animate-marquee whitespace-nowrap flex gap-20 text-base font-medium text-slate-300">
    {[
      "👋 Bienvenue sur mon portfolio !",
      "📊 Expert en Data Visualisation & Reporting",
      "⚙️ Automatisation de flux de données",
      "🚀 Disponible pour des missions freelance",
      "📅 Réservez un appel directement depuis ce site",
      "💡 Transformer vos données en décisions opérationnelles",
      "🔍 Power BI · Python · SQL · Microsoft Fabric",
      "👋 Bienvenue sur mon portfolio !",
      "📊 Expert en Data Visualisation & Reporting",
      "⚙️ Automatisation de flux de données",
      "🚀 Disponible pour des missions freelance",
      "📅 Réservez un appel directement depuis ce site",
      "💡 Transformer vos données en décisions opérationnelles",
      "🔍 Power BI · Python · SQL · Microsoft Fabric",
    ].map((msg, i) => (
      <span key={i}>{msg}</span>
    ))}
  </div>
</div>

{/* Menu navigation */}
<div className="sticky top-0 z-30 w-full bg-slate-950/95 backdrop-blur border-b border-slate-800 py-3">
  <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-6">
    {/* Badge mode */}
    {role === 'admin' ? (
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-medium">
          <span>🔐</span> Admin
        </span>
        <button onClick={logout} className="text-xs text-slate-500 hover:text-red-400 transition">Déconnexion</button>
      </div>
    ) : (
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs">
          <span>👁️</span> Mode Visiteur
        </span>
        <button onClick={logout} className="text-xs text-slate-500 hover:text-red-400 transition">Quitter</button>
      </div>
    )}
    {/* Nav links */}
    <div className="flex items-center gap-6">
      <a href="#about" className="text-slate-300 hover:text-white text-sm font-medium transition duration-300">Qui suis-je</a>
      <span className="text-slate-700">|</span>
      <a href="#competences" className="text-slate-300 hover:text-white text-sm font-medium transition duration-300">Compétences</a>
      <span className="text-slate-700">|</span>
      <a href="#projects" className="text-slate-300 hover:text-white text-sm font-medium transition duration-300">Projets</a>
      <span className="text-slate-700">|</span>
      <a href="#contact" className="text-slate-300 hover:text-white text-sm font-medium transition duration-300">Contact</a>
    </div>
  </div>
</div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="reveal">
            <h1 className="font-black leading-tight tracking-tight mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <span className="block text-blue-400 text-5xl lg:text-7xl">RATOVONIRINA</span>
              <span className="block text-white text-3xl lg:text-5xl font-bold">Henintsoa Andrianaivo</span>
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-8 mb-2 uppercase tracking-widest">
              Consultant en
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full border border-slate-700 text-slate-300 text-sm font-medium cursor-default">
                Data Analyst
              </span>
              <span className="px-3 py-1 rounded-full border border-slate-700 text-slate-300 text-sm font-medium cursor-default">
                Data Visualisation
              </span>
              <span className="px-3 py-1 rounded-full border border-slate-700 text-slate-300 text-sm font-medium cursor-default">
                Reporting Décisionnel
              </span>
            </div>
            <p className="text-slate-400 text-lg leading-relaxed mt-8 max-w-2xl" style={{ lineHeight: '1.75' }}>
              J'aide les entreprises à transformer leurs données en décisions opérationnelles
              grâce à la DataViz, l'automatisation des flux et la modélisation de données orientée métier.
            </p>
            <div className="flex flex-wrap gap-4 mt-10">
              <a href="#projects"
                className="px-6 py-4 rounded-2xl bg-white text-black font-semibold hover:scale-105 hover:shadow-lg hover:shadow-white/10 transition duration-200 text-center cursor-pointer">
                Voir mes projets
              </a>
              <button type="button" onClick={openLinkedIn}
                className="relative z-50 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border border-slate-700 hover:bg-slate-900 hover:border-slate-500 transition duration-200 cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-blue-400"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
              </button>
              <a href="https://calendly.com/henintsoa_ratovonirina" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 transition duration-200 text-center cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Réserver un appel
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full" />
            
            {/* Badge au-dessus de la carte */}
            <div className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-sm mb-4">
              <span>🧠</span>
              <span className="text-base text-slate-300">Data Analyst • Power BI • Automatisation • Développement de solutions data et IA</span>
            </div>

            {/* Carte Expérience terrain */}
            <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-8 gap-6">
                <div>
                  <p className="text-slate-400 text-sm mb-3">Expérience terrain</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <span className="text-white mt-1">•</span>
                      <span className="text-slate-300">Plus de <span className="text-white font-semibold">20 missions</span> réalisées dans le secteur de l'assurance, au service de <span className="text-white font-semibold">dizaines de clients accompagnés</span> dans leurs projets data.</span>
                    </li>
                    {/* <li className="flex items-start gap-2 text-sm">
                      <span className="text-white mt-1">•</span>
                      <span className="text-slate-300">Réalisation d'un projet d'analyse et de pilotage des <span className="text-white font-semibold">données RH</span>.</span>
                    </li> */}
                  </ul>
                </div>
                <span className="text-5xl">📉</span>
              </div>
              <div className="space-y-5">
                <ProgressBar label="Automatisation" value={92} />
                <ProgressBar label="DataViz" value={95} />
                <ProgressBar label="Reporting Métier" value={96} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Qui suis-je */}
      <section id="about" className="max-w-7xl mx-auto px-6 py-20 scroll-mt-24">
        <div className="flex items-center gap-3 mb-10 reveal">
          <h2 className="text-4xl font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>Qui suis-je</h2>
        </div>
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h3 className="text-2xl font-bold mb-6 leading-snug text-white">
              Consultant Data indépendant,
              <span className="block text-blue-400 min-h-[1.4em]">
                {typedText}
                <span className="inline-block w-[2px] h-[1.1em] bg-blue-400 ml-[2px] align-middle animate-pulse" />
              </span>
            </h3>
            <p className="text-slate-400 leading-relaxed mb-5">
              Je suis <strong className="text-white">consultant Data Analyst freelance</strong> avec plus de 5 ans d'expérience dans la transformation des données en leviers de performance. Basé à Madagascar et intervenant en remote pour des entreprises françaises et internationales, j'accompagne mes clients dans la mise en place de <strong className="text-white">solutions data sur mesure</strong> : dashboards Power BI, automatisation de flux avec Python et n8n, modélisation de données sous Microsoft Fabric, et reporting métier orienté décision.
            </p>
            <p className="text-slate-400 leading-relaxed mb-5">
              Fort d'une expertise reconnue dans le <strong className="text-white">secteur de l'assurance</strong>, j'ai conduit plus de 20 missions opérationnelles — pilotage d'activité, suivi des KPI, industrialisation des reportings et accompagnement des équipes métier. Mon approche : des livrables clairs, une communication transparente et une vraie compréhension des enjeux business.
            </p>
            <p className="text-slate-400 leading-relaxed">
              Disponible pour des <strong className="text-white">missions freelance en Data Analysis</strong>, Power BI, automatisation et reporting. Réactif, rigoureux et orienté résultats — je transforme vos données brutes en décisions opérationnelles concrètes.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { emoji: "📊", number: "20+", label: "Missions réalisées" },
              { emoji: "🗓️", number: "5+", label: "Années d'expérience" },
            ].map(({ emoji, number, label }) => (
              <div key={label} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center hover:-translate-y-1 transition duration-300">
                <div className="text-3xl mb-2">{emoji}</div>
                <div className="text-3xl font-black mb-1">{number}</div>
                <div className="text-slate-400 text-sm">{label}</div>
              </div>
            ))}
            <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-4">
              <svg viewBox="0 0 360 178" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                {/* Chrome */}
                <rect width="360" height="26" rx="10" fill="#1e293b"/>
                <rect y="13" width="360" height="13" fill="#1e293b"/>
                <circle cx="14" cy="13" r="4" fill="#f87171" opacity="0.8"/>
                <circle cx="28" cy="13" r="4" fill="#fbbf24" opacity="0.8"/>
                <circle cx="42" cy="13" r="4" fill="#4ade80" opacity="0.8"/>
                <text x="56" y="17" fontFamily="monospace" fontSize="7.5" fill="#334155">Power BI · Niveau d'expertise — Compétences clés</text>

                {/* KPI cards — 4 cartes x=0,91,182,273 w=87 */}
                <rect x="0"   y="33" width="87" height="34" rx="6" fill="#0f172a"/>
                <text x="10"  y="46" fontFamily="sans-serif" fontSize="6.5" fill="#64748b">Missions</text>
                <text x="10"  y="59" fontFamily="sans-serif" fontSize="13" fontWeight="700" fill="#f1f5f9">20+</text>

                <rect x="91"  y="33" width="87" height="34" rx="6" fill="#0f172a"/>
                <text x="101" y="46" fontFamily="sans-serif" fontSize="6.5" fill="#64748b">Expérience</text>
                <text x="101" y="59" fontFamily="sans-serif" fontSize="13" fontWeight="700" fill="#f1f5f9">5 ans</text>

                <rect x="182" y="33" width="87" height="34" rx="6" fill="#0f172a"/>
                <text x="192" y="46" fontFamily="sans-serif" fontSize="6.5" fill="#64748b">DataViz</text>
                <text x="192" y="59" fontFamily="sans-serif" fontSize="13" fontWeight="700" fill="#60a5fa">95%</text>

                <rect x="273" y="33" width="87" height="34" rx="6" fill="#0f172a"/>
                <text x="283" y="46" fontFamily="sans-serif" fontSize="6.5" fill="#64748b">Reporting</text>
                <text x="283" y="59" fontFamily="sans-serif" fontSize="13" fontWeight="700" fill="#34d399">96%</text>

                {/* Chart label */}
                <text x="0" y="82" fontFamily="sans-serif" fontSize="7.5" fill="#475569" fontWeight="500">Niveau d'expertise · Compétences clés (échelle 75–100%)</text>

                {/* Grid lines — baseline y=152, top y=96, scale 70–100% (range=30, 56px) */}
                <line x1="0" y1="96"  x2="360" y2="96"  stroke="#1e293b" strokeWidth="1"/>
                <line x1="0" y1="114" x2="360" y2="114" stroke="#1e293b" strokeWidth="1"/>
                <line x1="0" y1="133" x2="360" y2="133" stroke="#1e293b" strokeWidth="1"/>
                <line x1="0" y1="152" x2="360" y2="152" stroke="#1e293b" strokeWidth="1"/>
                <text x="0" y="99"  fontFamily="sans-serif" fontSize="5" fill="#334155">100%</text>
                <text x="0" y="117" fontFamily="sans-serif" fontSize="5" fill="#334155">90%</text>
                <text x="0" y="136" fontFamily="sans-serif" fontSize="5" fill="#334155">80%</text>
                <text x="0" y="155" fontFamily="sans-serif" fontSize="5" fill="#334155">70%</text>

                {/* 5 bars  x:27,94,161,228,295  w=40  gap=27
                    scale:(val-70)/30*56  baseline y=152
                    Power BI        98% → h=52 y=100  ★
                    Python          90% → h=37 y=115
                    SQL             96% → h=49 y=103
                    Microsoft Fabric90% → h=37 y=115
                    Cognos Analytics97% → h=50 y=102  */}

                {/* Power BI 98% — outil principal */}
                <rect x="27"  y="100" width="40" height="52" rx="3" fill="#3b82f6"/>
                <rect x="27"  y="100" width="40" height="3"  rx="1" fill="#93c5fd"/>
                <text x="35"  y="97"  fontFamily="sans-serif" fontSize="6" fill="#93c5fd">98%</text>
                <text x="29"  y="163" fontFamily="sans-serif" fontSize="6" fill="#93c5fd">Power BI</text>

                {/* Python 90% */}
                <rect x="94"  y="115" width="40" height="37" rx="3" fill="#60a5fa"/>
                <text x="102" y="112" fontFamily="sans-serif" fontSize="6" fill="#bfdbfe">90%</text>
                <text x="99"  y="163" fontFamily="sans-serif" fontSize="6" fill="#475569">Python</text>

                {/* SQL 96% */}
                <rect x="161" y="103" width="40" height="49" rx="3" fill="#60a5fa" opacity="0.85"/>
                <text x="170" y="100" fontFamily="sans-serif" fontSize="6" fill="#bfdbfe">96%</text>
                <text x="172" y="163" fontFamily="sans-serif" fontSize="6" fill="#475569">SQL</text>

                {/* Microsoft Fabric 90% */}
                <rect x="228" y="115" width="40" height="37" rx="3" fill="#38bdf8"/>
                <text x="236" y="112" fontFamily="sans-serif" fontSize="6" fill="#7dd3fc">90%</text>
                <text x="224" y="163" fontFamily="sans-serif" fontSize="6" fill="#475569">MS Fabric</text>

                {/* Cognos Analytics 97% */}
                <rect x="295" y="102" width="40" height="50" rx="3" fill="#38bdf8" opacity="0.8"/>
                <text x="303" y="99"  fontFamily="sans-serif" fontSize="6" fill="#7dd3fc">97%</text>
                <text x="295" y="163" fontFamily="sans-serif" fontSize="6" fill="#475569">Cognos</text>

                {/* Legend */}
                <rect x="0" y="169" width="7" height="7" rx="1.5" fill="#3b82f6"/>
                <text x="11" y="176" fontFamily="sans-serif" fontSize="6.5" fill="#93c5fd">Power BI · Outil principal</text>
                <rect x="170" y="169" width="7" height="7" rx="1.5" fill="#38bdf8"/>
                <text x="181" y="176" fontFamily="sans-serif" fontSize="6.5" fill="#64748b">Outils complémentaires</text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Compétences */}
      <section id="competences" className="max-w-7xl mx-auto px-6 py-10 scroll-mt-24">
        <div className="flex items-center gap-3 mb-10 reveal">
          <h2 className="text-4xl font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>Compétences</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {skills.map((skill) => <SkillCard key={skill} skill={skill} />)}
        </div>
      </section>

      {/* Projets */}
      <section id="projects" className="max-w-7xl mx-auto px-6 py-20 scroll-mt-24">
        <div className="flex items-center gap-3 mb-10 reveal">
          <h2 className="text-4xl font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>Projets</h2>
        </div>
        <div className={`grid gap-6 ${visibleProjects.length === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'}`}>
          {visibleProjects.map((project, i) => (
            <div key={project.id} className={`reveal reveal-delay-${i + 1}`}>
              <ProjectCard
                project={project}
                onAction={() => handleProjectAction(project.action)}
              />
            </div>
          ))}
        </div>
        {role !== 'admin' && (
          <p className="text-center text-slate-600 text-sm mt-6">
            🔐 Un projet est réservé à l'espace admin.
          </p>
        )}
      </section>

      {/* Contact */}
      <section id="contact" className="max-w-7xl mx-auto px-6 pb-24 scroll-mt-24">
        <div className="bg-[#111113] border border-slate-800 rounded-3xl p-10 shadow-2xl reveal">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>Transformons vos données en décisions.</h2>
            <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed mb-6" style={{ lineHeight: '1.75' }}>
              Disponible pour des missions freelance en Data Analysis, automatisation et reporting métier.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <button type="button" onClick={openLinkedIn}
                className="relative z-50 inline-flex items-center gap-2 px-6 py-4 rounded-2xl border border-slate-700 hover:bg-slate-800 hover:border-slate-500 transition duration-200 cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-blue-400"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                <span>LinkedIn</span>
              </button>
              <a href="https://calendly.com/henintsoa_ratovonirina" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition duration-200 cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <span>Réserver un appel</span>
              </a>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:scale-110 transition duration-300 text-lg">
          ↑
        </button>

        {/* Modale Projets Data */}
        {showDataProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
            <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl p-10">
              <button onClick={() => setShowDataProject(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white transition">
                ✕
              </button>
              <div className="flex items-center gap-3 mb-8">
                <span className="text-3xl">📊</span>
                <h2 className="text-3xl font-bold">Pilotage & Reporting Data</h2>
              </div>
              <div className="space-y-6">
                {[
                  { emoji: "📉", title: "Pilotage d'activité Assurance", desc: "Création de dashboards opérationnels pour le suivi des délais, KPI métiers et performances des équipes expertise.", tags: ["Power BI", "DAX", "Microsoft Fabric"] },
                  { emoji: "⚙️", title: "Automatisation de flux de données", desc: "Automatisation des traitements et reportings via Python et n8n afin de réduire les tâches manuelles répétitives.", tags: ["Python", "n8n", "REST API"] },
                  { emoji: "🗄️", title: "Modélisation & Reporting", desc: "Conception de modèles de données orientés métier pour améliorer la qualité des analyses et la prise de décision.", tags: ["SQL", "Cognos Analytics", "DataViz"] },
                ].map(({ emoji, title, desc, tags }) => (
                  <div key={title} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                      <span className="text-3xl">{emoji}</span>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-2">{title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-3">{desc}</p>
                        <div className="flex flex-wrap gap-2">
                          {tags.map(t => (
                            <span key={t} className="px-2 py-0.5 text-xs rounded-full bg-slate-800 border border-slate-700 text-slate-400">{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modale Admin Panel */}
        {showAdminPanel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-950 rounded-3xl border border-yellow-500/20 shadow-2xl p-10">
              <button onClick={() => setShowAdminPanel(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white transition">
                ✕
              </button>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🔐</span>
                <h2 className="text-3xl font-bold">Espace Administration</h2>
              </div>
              <p className="text-slate-500 text-sm mb-8">Accès restreint — session admin active</p>
              <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <h3 className="font-bold mb-2 flex items-center gap-2"><span>📁</span> Projets confidentiels</h3>
                  <p className="text-slate-400 text-sm">Ajoutez ici vos études de cas clients, projets NDA ou ressources privées.</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <h3 className="font-bold mb-2 flex items-center gap-2"><span>💼</span> Tarification & Disponibilités</h3>
                  <p className="text-slate-400 text-sm">Informations tarifaires et planning de disponibilité accessibles depuis ce panel.</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-blue-400"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    LinkedIn Manager
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">Outil de gestion de posts LinkedIn — génération IA, planification et intégration Notion.</p>
                  <button
                    onClick={() => { setShowAdminPanel(false); setShowLinkedInManager(true); }}
                    className="w-full px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition duration-300"
                  >
                    Lancer LinkedIn Manager →
                  </button>
                </div>
              </div>
              <button onClick={logout}
                className="mt-8 w-full px-4 py-3 rounded-2xl border border-red-500/30 text-red-400 hover:bg-red-950/30 transition text-sm font-medium">
                Se déconnecter
              </button>
            </div>
          </div>
        )}

        {/* Modale LinkedIn Manager */}
        {showLinkedInManager && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="relative w-full h-full max-w-[1400px] max-h-[95vh] overflow-y-auto rounded-3xl border border-slate-800 shadow-2xl">
              <button
                onClick={() => setShowLinkedInManager(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white transition">
                ✕
              </button>
              <LinkedInManager onClose={() => setShowLinkedInManager(false)} />
            </div>
          </div>
        )}

        {/* Modale Vibe Coding — liste des projets */}
        {showVibeCoding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
            <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl p-10">
              <button onClick={() => setShowVibeCoding(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white transition">
                ✕
              </button>
              <div className="flex items-center gap-3 mb-8">
                <span className="text-3xl">⚡</span>
                <h2 className="text-3xl font-bold">Vibe Coding</h2>
              </div>
              <div className="space-y-4">
                {[
                  { emoji: "🏫", title: "Gestion d'école", desc: "Application de gestion des élèves, classes, notes et absences — tableau de bord complet pour les établissements scolaires.", tags: ["React", "Node.js", "SQL"], available: false },
                  { emoji: "📈", title: "Analyse de marché", desc: "Outil d'analyse et de visualisation de données de marché : tendances, segments et opportunités business.", tags: ["Python", "DataViz", "API"], available: false },
                  { emoji: "⏳", title: "Calculateur de vie", desc: "Visualisez vos jours vécus, les jours restants estimés et votre progression de vie sous forme graphique.", tags: ["React", "Charts"], available: true, onLaunch: () => { setShowVibeCoding(false); setShowCalculator(true); } },
                  { emoji: "✅", title: "Gestionnaire de tâches", desc: "Application de productivité avec kanban, priorités, rappels et suivi d'avancement des projets personnels.", tags: ["React", "LocalStorage"], available: false },
                  { emoji: "💰", title: "Simulateur de budget", desc: "Planifiez vos revenus et dépenses, simulez des scénarios financiers et visualisez votre épargne projetée.", tags: ["React", "Charts"], available: false },
                ].map(({ emoji, title, desc, tags, available, onLaunch }) => (
                  <div key={title} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                      <span className="text-3xl">{emoji}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold">{title}</h3>
                          {available
                            ? <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/10 border border-green-500/30 text-green-400">Disponible</span>
                            : <span className="px-2 py-0.5 text-xs rounded-full bg-slate-800 border border-slate-700 text-slate-500">En cours</span>
                          }
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-3">{desc}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {tags.map(t => (
                            <span key={t} className="px-2 py-0.5 text-xs rounded-full bg-slate-800 border border-slate-700 text-slate-400">{t}</span>
                          ))}
                        </div>
                        {available && onLaunch && (
                          <button onClick={onLaunch}
                            className="px-4 py-2 rounded-xl bg-white text-black text-xs font-semibold hover:scale-105 transition">
                            Lancer l'application →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modale Calculateur de vie */}
        {showCalculator && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-800 shadow-2xl">
              <button
                onClick={() => { setShowCalculator(false); setShowVibeCoding(true); }}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white transition">
                ✕
              </button>
              <LifeCalculator />
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="border-t border-slate-800 py-8 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} Henintsoa Andrianaivo RATOVONIRINA — Tous droits réservés.
            </p>
            <div className="flex items-center gap-2 text-slate-600 text-xs">
              <span>🇲🇬</span>
              <span>Conçu & développé depuis Madagascar</span>
            </div>
            <p className="text-slate-600 text-xs">
              Fait avec React • Vite • Tailwind CSS
            </p>
          </div>
        </footer>
    </main>
  );
}














































