import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import LifeCalculator from "./LifeCalculator";

const EMAILJS_SERVICE_ID = "service_4k6fbdp";
const EMAILJS_TEMPLATE_ID = "template_rxm98ga";
const EMAILJS_PUBLIC_KEY = "hVKKAZFnXWGFCz2LZ";

const skills = [
  "Power BI", "Python", "SQL", "Microsoft Fabric",
  "Cognos Analytics", "n8n", "DataViz", "Web Scraping",
  "Git/GitHub", "REST API",
];

const projects = [
  { id: 1, title: "Pilotage d'activité Assurance", description: "Création de dashboards opérationnels pour le suivi des délais, KPI métiers et performances des équipes expertise.", emoji: "📊" },
  { id: 2, title: "Automatisation de flux de données", description: "Automatisation des traitements et reportings via Python et n8n afin de réduire les tâches manuelles répétitives.", emoji: "⚙️" },
  { id: 3, title: "Modélisation & Reporting", description: "Conception de modèles de données orientés métier pour améliorer la qualité des analyses et la prise de décision.", emoji: "🗄️" },
  { id: 4, title: "Calculateur de vie", description: "Application React interactive permettant de visualiser les jours vécus, les jours restants estimés et la progression de vie à partir d'une date de naissance.", emoji: "⏳" },
];

function SkillCard({ skill }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center hover:-translate-y-1 transition duration-300">
      <span className="text-sm md:text-base font-medium">{skill}</span>
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

function ProjectCard({ project, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl hover:-translate-y-2 transition duration-300 ${onClick ? "cursor-pointer hover:border-slate-600" : ""}`}>
      <div className="text-4xl mb-6">{project.emoji}</div>
      <h3 className="text-2xl font-bold mb-4">{project.title}</h3>
      <p className="text-slate-400 leading-relaxed">{project.description}</p>
      {onClick && (
        <div className="mt-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition">
          <span>Lancer l'application</span>
          <span>→</span>
        </div>
      )}
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
            <option value="Mission freelance - Reporting">Mission freelance — Reporting</option>
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

export default function PortfolioDataAnalyst() {
  const [showCalculator, setShowCalculator] = useState(false);
  const linkedInUrl = "https://www.linkedin.com/in/henintsoa-ratovonirina/";
  const openLinkedIn = () => window.open(linkedInUrl, "_blank");

  return (
    <main className="min-h-screen bg-slate-950 text-white overflow-hidden scroll-smooth">

{/* Bandeau défilant */}
<div className="sticky top-0 z-40 w-full bg-slate-900 border-b border-slate-800 overflow-hidden py-3">
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
<div className="sticky top-12 z-30 w-full bg-slate-950 border-b border-slate-800 py-3">
  <div className="max-w-7xl mx-auto px-6 flex items-center justify-end gap-6">
    <a href="#about" className="text-slate-300 hover:text-white text-sm font-medium transition duration-300">Qui suis-je</a>
    <span className="text-slate-700">|</span>
    <a href="#competences" className="text-slate-300 hover:text-white text-sm font-medium transition duration-300">Compétences</a>
    <span className="text-slate-700">|</span>
    <a href="#projects" className="text-slate-300 hover:text-white text-sm font-medium transition duration-300">Projets</a>
    <span className="text-slate-700">|</span>
    <a href="#contact" className="text-slate-300 hover:text-white text-sm font-medium transition duration-300">Contact</a>
  </div>
</div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20">
      {/* <section className="max-w-7xl mx-auto px-6 py-20 mt-16"> */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-6 mb-6 flex-wrap">
              <div className="w-28 h-28 rounded-3xl border border-slate-800 bg-slate-900 flex items-center justify-center text-slate-500 text-sm text-center p-4">
                Votre photo
              </div>
              {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-sm">
                <span>🧠</span>
                <span>Data Analyst • Power BI • Automatisation • Développement de solutions data et IA</span>
              </div> */}
            </div>
           <h1 className="text-5xl lg:text-7xl font-black leading-tight tracking-tight">
            Henintsoa
           </h1>
            <p className="text-slate-500 text-sm font-medium mt-8 mb-2 uppercase tracking-widest">
              Consultant en
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full border border-slate-700 text-slate-300 text-sm font-medium">
                Data Analyst
              </span>
              <span className="px-3 py-1 rounded-full border border-slate-700 text-slate-300 text-sm font-medium">
                Data Visualisation
              </span>
              <span className="px-3 py-1 rounded-full border border-slate-700 text-slate-300 text-sm font-medium">
                Reporting Décisionnel
              </span>
            </div>
            <p className="text-slate-400 text-lg leading-relaxed mt-8 max-w-2xl">
              J'aide les entreprises à transformer leurs données en décisions opérationnelles
              grâce à la DataViz, l'automatisation des flux et la modélisation de données orientée métier.
            </p>
            <div className="flex flex-wrap gap-4 mt-10">
              <a href="#projects"
                className="px-6 py-4 rounded-2xl bg-white text-black font-semibold hover:scale-105 transition duration-300 text-center">
                Voir mes projets
              </a>
              <button type="button" onClick={openLinkedIn}
                className="relative z-50 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border border-slate-700 hover:bg-slate-900 transition duration-300 cursor-pointer">
                🔗 LinkedIn
              </button>
              <a href="https://calendly.com/henintsoa_ratovonirina" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold hover:scale-105 transition duration-300 text-center">
                📅 Réserver un appel
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
        <div className="flex items-center gap-3 mb-10">
          <span className="text-3xl">👤</span>
          <h2 className="text-4xl font-bold">Qui suis-je</h2>
        </div>
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h3 className="text-2xl font-bold mb-6 leading-snug text-white">
              Consultant Data indépendant, spécialisé en DataViz, automatisation et reporting décisionnel.
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
        <div className="flex items-center gap-3 mb-10">
          <span className="text-3xl">💻</span>
          <h2 className="text-4xl font-bold">Compétences</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {skills.map((skill) => <SkillCard key={skill} skill={skill} />)}
        </div>
      </section>

      {/* Projets */}
      <section id="projects" className="max-w-7xl mx-auto px-6 py-20 scroll-mt-24">
        <div className="flex items-center gap-3 mb-10">
          <span className="text-3xl">📊</span>
          <h2 className="text-4xl font-bold">Projets</h2>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={project.id === 4 ? () => setShowCalculator(true) : undefined}
            />
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="max-w-7xl mx-auto px-6 pb-24 scroll-mt-24">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 shadow-2xl">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Transformons vos données en décisions.</h2>
            <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed mb-6">
              Disponible pour des missions freelance en Data Analysis, automatisation et reporting métier.
            </p>
            <div className="flex items-center justify-center gap-4">
              <button type="button" onClick={openLinkedIn}
                className="relative z-50 inline-flex items-center gap-2 px-6 py-4 rounded-2xl border border-slate-700 hover:bg-slate-800 transition duration-300 cursor-pointer">
                <span>🔗</span><span>LinkedIn</span>
              </button>
              <a href="https://calendly.com/henintsoa_ratovonirina" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition duration-300">
                <span>📅</span><span>Réserver un appel</span>
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

        {/* Modale Calculateur de vie */}
          {showCalculator && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
              <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-800 shadow-2xl">
                <button
                  onClick={() => setShowCalculator(false)}
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
              © {new Date().getFullYear()} Henintsoa — Tous droits réservés.
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














































