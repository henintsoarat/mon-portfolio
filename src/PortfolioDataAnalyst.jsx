import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";

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

function ProjectCard({ project }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl hover:-translate-y-2 transition duration-300">
      <div className="text-4xl mb-6">{project.emoji}</div>
      <h3 className="text-2xl font-bold mb-4">{project.title}</h3>
      <p className="text-slate-400 leading-relaxed">{project.description}</p>
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
        {loading ? "⏳ Envoi en cours..." : "✉️ Envoyer le message"}
      </button>
    </div>
  );
}

export default function PortfolioDataAnalyst() {
  const linkedInUrl = "https://www.linkedin.com/in/henintsoa-ratovonirina/";
  const openLinkedIn = () => window.open(linkedInUrl, "_blank");

  return (
    <main className="min-h-screen bg-slate-950 text-white overflow-hidden scroll-smooth">

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-6 mb-6 flex-wrap">
              <div className="w-28 h-28 rounded-3xl border border-slate-800 bg-slate-900 flex items-center justify-center text-slate-500 text-sm text-center p-4">
                Votre photo
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-sm">
                <span>🧠</span>
                <span>Data Analyst • Power BI • Automatisation</span>
              </div>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black leading-tight tracking-tight">
              Henintsoa
              <span className="block text-slate-400 mt-2">Data Analyst Freelance</span>
            </h1>
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
                🔗 Voir mon LinkedIn
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full" />
            <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-8 gap-6">
                <div>
                  <p className="text-slate-400 text-sm">KPI opérationnels</p>
                  <h2 className="text-3xl font-bold mt-2">+42%</h2>
                </div>
                <span className="text-5xl">📈</span>
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

      {/* Compétences */}
      <section className="max-w-7xl mx-auto px-6 py-10">
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
          {projects.map((project) => <ProjectCard key={project.id} project={project} />)}
        </div>
      </section>

      {/* Contact */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 shadow-2xl">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Transformons vos données en décisions.</h2>
            <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed mb-6">
              Disponible pour des missions freelance en Data Analysis, automatisation et reporting métier.
            </p>
            <button type="button" onClick={openLinkedIn}
              className="relative z-50 inline-flex items-center gap-2 px-6 py-4 rounded-2xl border border-slate-700 hover:bg-slate-800 transition duration-300 cursor-pointer">
              <span>🔗</span><span>LinkedIn</span>
            </button>
          </div>
          <ContactForm />
        </div>
      </section>

    </main>
  );
}
