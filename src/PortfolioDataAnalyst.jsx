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

const PROJECTS = [
  {
    id: 1,
    title: "Pilotage & Reporting Data",
    titleEN: "Data Piloting & Reporting",
    description: "Dashboards Power BI, KPI métiers et automatisation des reportings opérationnels, du traitement brut à la visualisation décisionnelle.",
    descriptionEN: "Power BI dashboards, business KPIs and operational reporting automation, from raw data to decision-making visualisation.",
    emoji: "📊",
    access: "public",
    buttonLabel: "Voir les projets",
    buttonLabelEN: "View projects",
    action: "data",
  },
  {
    id: 2,
    title: "Espace Projets Privés",
    titleEN: "Private Projects Space",
    description: "Études de cas confidentielles, projets clients et ressources réservées à l'administration du portfolio.",
    descriptionEN: "Confidential case studies, client projects, and resources reserved for portfolio administration.",
    emoji: "🔐",
    access: "admin",
    buttonLabel: "Accéder au panel",
    buttonLabelEN: "Access panel",
    action: "admin",
  },
  {
    id: 3,
    title: "Vibe Coding avec Claude Code",
    titleEN: "Vibe Coding with Claude Code",
    description: "Applications fullstack conçues en vibe coding pour résoudre des problèmes concrets du quotidien : piloter un établissement scolaire, décrypter un marché, simuler ses finances personnelles, organiser ses tâches et prendre de meilleures décisions de vie. Chaque outil transforme une complexité métier en interface simple et actionnable.",
    descriptionEN: "Fullstack apps built in vibe coding to solve real everyday problems: managing a school, decoding a market, simulating personal finances, organising tasks and making better life decisions. Each tool turns business complexity into a simple, actionable interface.",
    emoji: "⚡",
    access: "public",
    buttonLabel: "Voir les projets",
    buttonLabelEN: "View projects",
    action: "vibe",
  },
];

const T = {
  fr: {
    nav: { about: "Qui suis-je", skills: "Compétences", experience: "Parcours", projects: "Projets", contact: "Contact" },
    visitor: "Mode Visiteur",
    admin: "Admin",
    logout: "Déconnexion",
    quit: "Quitter",
    downloadCV: "Télécharger le CV",
    cvFile: "/CV_Henintsoa_Andrianaivo.pdf",
    marquee: [
      "👋 Bienvenue sur mon portfolio !",
      "📊 Expert en Data Visualisation & Reporting",
      "⚙️ Automatisation de flux de données",
      "🚀 Disponible pour des missions freelance",
      "📅 Réservez un appel directement depuis ce site",
      "💡 Transformer vos données en décisions opérationnelles",
      "🔍 Power BI · Python · SQL · Microsoft Fabric",
    ],
    hero: {
      consultantIn: "Consultant en",
      badges: ["Data Analyst", "Data Visualisation", "Reporting Décisionnel"],
      description: "J'aide les entreprises à transformer leurs données en décisions opérationnelles grâce à la DataViz, l'automatisation des flux et la modélisation de données orientée métier.",
      viewProjects: "Voir mes projets",
      bookCall: "Réserver un appel",
      fieldExp: "Expérience terrain",
      missions: "Missions réalisées",
      years: "Années d'expérience",
      expBadge: "Data Analyst • Power BI • Automatisation • Développement de solutions data et IA",
    },
    typewriter: [
      "spécialisé en DataViz Power BI",
      "automatisation et reporting décisionnel",
      "Vibe Coding Fullstack avec Claude Code",
      "expert Microsoft Fabric & Python",
      "disponible pour missions freelance",
    ],
    about: {
      title: "Qui suis-je",
      subtitle: "Consultant Data indépendant,",
      p1: "Je suis <strong class=\"text-white\">consultant Data Analyst freelance</strong> avec plus de 5 ans d'expérience dans la transformation des données en leviers de performance. Basé à Madagascar et intervenant en remote pour des entreprises françaises et internationales, j'accompagne mes clients dans la mise en place de <strong class=\"text-white\">solutions data sur mesure</strong> : dashboards Power BI, automatisation de flux avec Python et n8n, modélisation de données sous Microsoft Fabric, et reporting métier orienté décision.",
      p2: "Fort d'une expertise reconnue dans le <strong class=\"text-white\">secteur de l'assurance</strong>, j'ai conduit plus de 20 missions opérationnelles, pilotage d'activité, suivi des KPI, industrialisation des reportings et accompagnement des équipes métier. Mon approche : des livrables clairs, une communication transparente et une vraie compréhension des enjeux business.",
      p3: "Disponible pour des <strong class=\"text-white\">missions freelance en Data Analysis</strong>, Power BI, automatisation et reporting. Réactif, rigoureux et orienté résultats. Je transforme vos données brutes en décisions opérationnelles concrètes.",
      statMissions: "Missions réalisées",
      statYears: "Années d'expérience",
    },
    skills: { title: "Compétences" },
    experience: {
      title: "Parcours",
      achievementsLabel: "Réalisations clés",
      jobs: [
        {
          title: "Analyst Power BI",
          company: "Voxens Madagascar / Stelliant France",
          type: "CDI",
          period: "Mars 2025",
          periodEnd: "Aujourd'hui",
          current: true,
          points: [
            "Migration de 750+ rapports Cognos Analytics vers Power BI Report Builder.",
            "Conception de tableaux de bord KPI pour direction, métiers et technique.",
            "Modélisation scalable sous Microsoft Fabric (PySpark, T-SQL, DAX).",
            "Animation d'ateliers métiers et coordination en mode Agile / Scrum.",
          ],
          achievements: [
            "Dashboard « Expertise » : suivi CA et dossiers en cours (DAX, PySpark, T-SQL).",
            "Dashboard AXA : pilotage interne selon KPI clients (DAX, PySpark, T-SQL).",
          ],
          tags: ["Power BI", "Microsoft Fabric", "PySpark", "T-SQL", "DAX"],
        },
        {
          title: "Data Analyst BI — Développeur VBA",
          company: "ARBI Madagascar",
          type: "Freelance",
          period: "Janv. 2024",
          periodEnd: "Mars 2025",
          current: false,
          points: [
            "Cartographie des sources RH et conception du modèle Power BI (DAX, RLS).",
            "Ateliers réguliers avec les équipes RH pour mise à jour des KPI et rapports.",
          ],
          achievements: [
            "Dashboard RH : recrutement, turnover, absentéisme, écart salarial H/F, mobilité interne.",
            "Réduction significative des erreurs et gains de temps sur les reportings de paie.",
          ],
          tags: ["Power BI", "DAX", "RLS", "VBA", "SQL"],
        },
        {
          title: "Chargé de Reporting BI",
          company: "WEBHELP Madagascar",
          type: "CDI",
          period: "Janv. 2021",
          periodEnd: "Janv. 2024",
          current: false,
          points: [
            "Extraction SQL depuis CRM et outils métiers (Salesforce, Zendesk, Talkdesk, Amazon Connect).",
            "Modélisation en étoile PostgreSQL et automatisation des reportings Power BI.",
            "Consolidation hebdomadaire, mensuelle et annuelle des indicateurs de performance.",
          ],
          achievements: [
            "Dashboard opérationnel : DMT, productivité horaire, qualité de service, CA par acte.",
            "Meilleure visibilité sur les effectifs et supports de décision fiabilisés.",
          ],
          tags: ["Power BI", "SQL", "PostgreSQL", "DAX", "Salesforce"],
        },
      ],
    },
    projects: { title: "Projets", adminNote: "🔐 Un projet est réservé à l'espace admin." },
    contact: {
      title: "Transformons vos données en décisions.",
      subtitle: "Disponible pour des missions freelance en Data Analysis, automatisation et reporting métier.",
      bookCall: "Réserver un appel",
      formName: "Nom complet *",
      formNamePlaceholder: "Jean Dupont",
      formEmail: "Email *",
      formEmailPlaceholder: "jean@exemple.com",
      formCompany: "Entreprise",
      formCompanyPlaceholder: "Nom de votre entreprise",
      formSubject: "Objet *",
      formSubjectDefault: "-- Choisir un objet --",
      formMessage: "Message *",
      formMessagePlaceholder: "Décrivez votre projet ou votre besoin...",
      formSend: "📤 Envoyer le message",
      formSending: "⏳ Envoi en cours...",
      subjects: [
        { value: "Mission freelance - Data Analysis", label: "Mission freelance, Data Analysis" },
        { value: "Mission freelance - Power BI", label: "Mission freelance, Power BI" },
        { value: "Mission freelance - Automatisation", label: "Mission freelance, Automatisation" },
        { value: "Mission freelance - Reporting", label: "Mission freelance, Développeur FullStack avec Claude" },
        { value: "Collaboration / Partenariat", label: "Collaboration / Partenariat" },
        { value: "Autre demande", label: "Autre demande" },
      ],
      successMsg: "✅ Message envoyé ! Je vous répondrai dans les plus brefs délais.",
      errWait: "Patientez 30 secondes avant un nouvel envoi.",
      errLimit: "Limite d'envois atteinte pour cette session.",
      errName: "Veuillez entrer votre nom complet.",
      errEmail: "Adresse email invalide.",
      errSubject: "Veuillez choisir un objet.",
      errMsgShort: "Le message doit contenir au moins 10 caractères.",
      errMsgLong: "Message trop long (max 2000 caractères).",
      errGeneric: "Réessayez ou contactez via LinkedIn.",
    },
    footer: {
      rights: `© ${new Date().getFullYear()} Henintsoa Andrianaivo RATOVONIRINA. Tous droits réservés.`,
      made: "Conçu & développé depuis Madagascar",
      tech: "Fait avec React • Vite • Tailwind CSS",
    },
    progressLabels: ["Automatisation", "DataViz", "Reporting Métier"],
    adminPanel: {
      title: "Espace Administration",
      subtitle: "Accès restreint, session admin active",
      projects: "Projets confidentiels",
      projectsDesc: "Ajoutez ici vos études de cas clients, projets NDA ou ressources privées.",
      pricing: "Tarification & Disponibilités",
      pricingDesc: "Informations tarifaires et planning de disponibilité accessibles depuis ce panel.",
      linkedinTitle: "LinkedIn Manager",
      linkedinDesc: "Outil de gestion de posts LinkedIn, génération IA, planification et intégration Notion.",
      linkedinBtn: "Lancer LinkedIn Manager →",
      logout: "Se déconnecter",
    },
  },
  en: {
    nav: { about: "About", skills: "Skills", experience: "Experience", projects: "Projects", contact: "Contact" },
    visitor: "Visitor Mode",
    admin: "Admin",
    logout: "Logout",
    quit: "Quit",
    downloadCV: "Download CV",
    cvFile: "/CV_Henintsoa_Andrianaivo_EN.pdf",
    marquee: [
      "👋 Welcome to my portfolio!",
      "📊 Data Visualisation & Reporting Expert",
      "⚙️ Data flow automation specialist",
      "🚀 Available for freelance missions",
      "📅 Book a call directly from this site",
      "💡 Turning data into operational decisions",
      "🔍 Power BI · Python · SQL · Microsoft Fabric",
    ],
    hero: {
      consultantIn: "Consultant in",
      badges: ["Data Analyst", "Data Visualisation", "Decision Reporting"],
      description: "I help companies turn their data into operational decisions through DataViz, workflow automation, and business-driven data modelling.",
      viewProjects: "View my projects",
      bookCall: "Book a call",
      fieldExp: "Field experience",
      missions: "Missions completed",
      years: "Years of experience",
      expBadge: "Data Analyst • Power BI • Automation • Data & AI solutions development",
    },
    typewriter: [
      "specialised in Power BI DataViz",
      "workflow automation & reporting",
      "Fullstack Vibe Coding with Claude Code",
      "Microsoft Fabric & Python expert",
      "available for freelance missions",
    ],
    about: {
      title: "About me",
      subtitle: "Independent Data Consultant,",
      p1: "I am a <strong class=\"text-white\">freelance Data Analyst consultant</strong> with over 5 years of experience transforming data into performance drivers. Based in Madagascar and working remotely for French and international companies, I help clients implement <strong class=\"text-white\">tailor-made data solutions</strong>: Power BI dashboards, Python & n8n workflow automation, Microsoft Fabric data modelling, and business-oriented decision reporting.",
      p2: "With recognised expertise in the <strong class=\"text-white\">insurance sector</strong>, I have led over 20 operational missions covering activity management, KPI tracking, reporting industrialisation, and business team support. My approach: clear deliverables, transparent communication, and a genuine understanding of business stakes.",
      p3: "Available for <strong class=\"text-white\">freelance missions in Data Analysis</strong>, Power BI, automation and reporting. Responsive, rigorous, and results-driven. I turn your raw data into concrete operational decisions.",
      statMissions: "Missions completed",
      statYears: "Years of experience",
    },
    skills: { title: "Skills" },
    experience: {
      title: "Experience",
      achievementsLabel: "Key achievements",
      jobs: [
        {
          title: "Power BI Analyst",
          company: "Voxens Madagascar / Stelliant France",
          type: "Permanent",
          period: "Mar. 2025",
          periodEnd: "Present",
          current: true,
          points: [
            "Migration of 750+ Cognos Analytics reports to Power BI Report Builder.",
            "KPI dashboard design tailored to management, business, and technical teams.",
            "Scalable modelling in Microsoft Fabric (PySpark, T-SQL, DAX).",
            "Business workshops facilitation and team coordination in Agile / Scrum mode.",
          ],
          achievements: [
            "'Expertise' dashboard: revenue & case tracking (DAX, PySpark, T-SQL).",
            "AXA dashboard: internal steering based on client-defined KPIs (DAX, PySpark, T-SQL).",
          ],
          tags: ["Power BI", "Microsoft Fabric", "PySpark", "T-SQL", "DAX"],
        },
        {
          title: "BI Data Analyst — VBA Developer",
          company: "ARBI Madagascar",
          type: "Freelance",
          period: "Jan. 2024",
          periodEnd: "Mar. 2025",
          current: false,
          points: [
            "HR data source mapping and Power BI model design (DAX, RLS).",
            "Regular workshops with HR teams to update KPIs and reports.",
          ],
          achievements: [
            "HR dashboard: hiring, turnover, absenteeism, gender pay gap, internal mobility.",
            "Significant error reduction and time savings on payroll reporting.",
          ],
          tags: ["Power BI", "DAX", "RLS", "VBA", "SQL"],
        },
        {
          title: "BI Reporting Officer",
          company: "WEBHELP Madagascar",
          type: "Permanent",
          period: "Jan. 2021",
          periodEnd: "Jan. 2024",
          current: false,
          points: [
            "SQL extraction from CRM and business tools (Salesforce, Zendesk, Talkdesk, Amazon Connect).",
            "Star-schema modelling in PostgreSQL, Power BI reporting automation.",
            "Weekly, monthly, and annual consolidation of performance indicators.",
          ],
          achievements: [
            "Operations dashboard: AHT, hourly productivity, quality rate, revenue per case.",
            "Better workforce visibility and reliable decision-support materials.",
          ],
          tags: ["Power BI", "SQL", "PostgreSQL", "DAX", "Salesforce"],
        },
      ],
    },
    projects: { title: "Projects", adminNote: "🔐 One project is reserved for the admin space." },
    contact: {
      title: "Let's turn your data into decisions.",
      subtitle: "Available for freelance missions in Data Analysis, automation and business reporting.",
      bookCall: "Book a call",
      formName: "Full name *",
      formNamePlaceholder: "John Smith",
      formEmail: "Email *",
      formEmailPlaceholder: "john@example.com",
      formCompany: "Company",
      formCompanyPlaceholder: "Your company name",
      formSubject: "Subject *",
      formSubjectDefault: "-- Choose a subject --",
      formMessage: "Message *",
      formMessagePlaceholder: "Describe your project or need...",
      formSend: "📤 Send message",
      formSending: "⏳ Sending...",
      subjects: [
        { value: "Mission freelance - Data Analysis", label: "Freelance mission, Data Analysis" },
        { value: "Mission freelance - Power BI", label: "Freelance mission, Power BI" },
        { value: "Mission freelance - Automatisation", label: "Freelance mission, Automation" },
        { value: "Mission freelance - Reporting", label: "Freelance mission, FullStack with Claude" },
        { value: "Collaboration / Partenariat", label: "Collaboration / Partnership" },
        { value: "Autre demande", label: "Other request" },
      ],
      successMsg: "✅ Message sent! I will get back to you as soon as possible.",
      errWait: "Please wait 30 seconds before sending again.",
      errLimit: "Send limit reached for this session.",
      errName: "Please enter your full name.",
      errEmail: "Invalid email address.",
      errSubject: "Please choose a subject.",
      errMsgShort: "Message must be at least 10 characters.",
      errMsgLong: "Message too long (max 2000 characters).",
      errGeneric: "Please try again or contact via LinkedIn.",
    },
    footer: {
      rights: `© ${new Date().getFullYear()} Henintsoa Andrianaivo RATOVONIRINA. All rights reserved.`,
      made: "Designed & built from Madagascar",
      tech: "Built with React • Vite • Tailwind CSS",
    },
    progressLabels: ["Automation", "DataViz", "Business Reporting"],
    adminPanel: {
      title: "Administration Space",
      subtitle: "Restricted access, admin session active",
      projects: "Confidential Projects",
      projectsDesc: "Add client case studies, NDA projects, or private resources here.",
      pricing: "Pricing & Availability",
      pricingDesc: "Pricing information and availability schedule accessible from this panel.",
      linkedinTitle: "LinkedIn Manager",
      linkedinDesc: "LinkedIn post management tool with AI generation, scheduling, and Notion integration.",
      linkedinBtn: "Launch LinkedIn Manager →",
      logout: "Log out",
    },
  },
};

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

function ProjectCard({ project, lang, onAction }) {
  const title = lang === 'en' ? (project.titleEN || project.title) : project.title;
  const description = lang === 'en' ? (project.descriptionEN || project.description) : project.description;
  const buttonLabel = lang === 'en' ? (project.buttonLabelEN || project.buttonLabel) : project.buttonLabel;
  const adminNote = lang === 'en' ? "Admin access only" : "Accès admin uniquement";

  return (
    <div className="bg-[#111113] border border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col hover:-translate-y-2 hover:border-slate-600 hover:shadow-2xl hover:shadow-blue-500/5 transition duration-200 h-full">
      <div className="text-4xl mb-6">{project.emoji}</div>
      <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>{title}</h3>
      <p className="text-slate-400 leading-relaxed flex-1" style={{ lineHeight: '1.75' }}>{description}</p>
      {project.access === 'admin' && (
        <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-yellow-500/70">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
          <span>{adminNote}</span>
        </div>
      )}
      <button
        onClick={onAction}
        className="mt-6 w-full px-4 py-3 rounded-2xl bg-white text-black font-semibold text-sm hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98] transition duration-200 cursor-pointer"
      >
        {buttonLabel} →
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

function ContactForm({ tc }) {
  const [form, setForm] = useState({ from_name: "", from_email: "", company: "", subject: "", message: "" });
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const lastSent = useRef(0);
  const submitCount = useRef(0);

  useEffect(() => {
    setStatus(null);
    setForm({ from_name: "", from_email: "", company: "", subject: "", message: "" });
  }, [tc]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (honeypot !== "") return;

    const now = Date.now();
    if (now - lastSent.current < 30000) {
      setStatus({ type: "error", msg: tc.errWait });
      return;
    }
    if (submitCount.current >= 5) {
      setStatus({ type: "error", msg: tc.errLimit });
      return;
    }

    const name    = sanitize(form.from_name);
    const email   = sanitize(form.from_email);
    const company = sanitize(form.company);
    const subject = sanitize(form.subject);
    const message = sanitize(form.message);

    if (!name || name.length < 2) { setStatus({ type: "error", msg: tc.errName }); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setStatus({ type: "error", msg: tc.errEmail }); return; }
    if (!subject) { setStatus({ type: "error", msg: tc.errSubject }); return; }
    if (!message || message.length < 10) { setStatus({ type: "error", msg: tc.errMsgShort }); return; }
    if (message.length > 2000) { setStatus({ type: "error", msg: tc.errMsgLong }); return; }

    setLoading(true);
    setStatus(null);

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { from_name: name, from_email: email, company: company || "—", subject, message },
        EMAILJS_PUBLIC_KEY
      );
      lastSent.current = Date.now();
      submitCount.current += 1;
      setStatus({ type: "success", msg: tc.successMsg });
      setForm({ from_name: "", from_email: "", company: "", subject: "", message: "" });
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus({ type: "error", msg: `❌ Erreur (${err?.status || ""} ${err?.text || JSON.stringify(err)}). ${tc.errGeneric}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 text-left">
      <div style={{ display: "none" }}>
        <input type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1">{tc.formName}</label>
          <input name="from_name" value={form.from_name} onChange={handleChange}
            placeholder={tc.formNamePlaceholder} maxLength={100} type="text"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">{tc.formEmail}</label>
          <input name="from_email" value={form.from_email} onChange={handleChange}
            placeholder={tc.formEmailPlaceholder} maxLength={150} type="email"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">{tc.formCompany}</label>
          <input name="company" value={form.company} onChange={handleChange}
            placeholder={tc.formCompanyPlaceholder} maxLength={100} type="text"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">{tc.formSubject}</label>
          <select name="subject" value={form.subject} onChange={handleChange}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500">
            <option value="">{tc.formSubjectDefault}</option>
            {tc.subjects.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-slate-400 mb-1">{tc.formMessage}</label>
          <textarea name="message" value={form.message} onChange={handleChange}
            placeholder={tc.formMessagePlaceholder} maxLength={2000} rows={4}
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
        {loading ? tc.formSending : tc.formSend}
      </button>
    </div>
  );
}

function useTypewriter(phrases, resetKey, { typingSpeed = 75, deletingSpeed = 40, pauseMs = 2200 } = {}) {
  const [text, setText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setText('');
    setPhraseIndex(0);
    setIsDeleting(false);
  }, [resetKey]);

  useEffect(() => {
    const current = phrases[phraseIndex % phrases.length];
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
  }, [text, isDeleting, phraseIndex, phrases, pauseMs]);

  return text;
}

export default function PortfolioDataAnalyst() {
  const { role, logout } = useAuth();
  const [lang, setLang] = useState('fr');
  const t = T[lang];

  const typedText = useTypewriter(t.typewriter, lang);

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

  const visibleProjects = PROJECTS.filter(p => p.access === 'public' || (p.access === 'admin' && role === 'admin'));

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
          {[...t.marquee, ...t.marquee].map((msg, i) => (
            <span key={i}>{msg}</span>
          ))}
        </div>
      </div>

      {/* Menu navigation */}
      <div className="sticky top-0 z-30 w-full bg-slate-950/95 backdrop-blur border-b border-slate-800 py-3">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
          {/* Badge mode */}
          {role === 'admin' ? (
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-medium">
                <span>🔐</span> {t.admin}
              </span>
              <button onClick={logout} className="text-xs text-slate-500 hover:text-red-400 transition">{t.logout}</button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs">
                <span>👁️</span> {t.visitor}
              </span>
              <button onClick={logout} className="text-xs text-slate-500 hover:text-red-400 transition">{t.quit}</button>
            </div>
          )}

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-5">
            <a href="#about" className="text-slate-300 hover:text-white text-sm font-medium transition duration-300">{t.nav.about}</a>
            <span className="text-slate-700">|</span>
            <a href="#experience" className="text-slate-300 hover:text-white text-sm font-medium transition duration-300">{t.nav.experience}</a>
            <span className="text-slate-700">|</span>
            <a href="#competences" className="text-slate-300 hover:text-white text-sm font-medium transition duration-300">{t.nav.skills}</a>
            <span className="text-slate-700">|</span>
            <a href="#projects" className="text-slate-300 hover:text-white text-sm font-medium transition duration-300">{t.nav.projects}</a>
            <span className="text-slate-700">|</span>
            <a href="#contact" className="text-slate-300 hover:text-white text-sm font-medium transition duration-300">{t.nav.contact}</a>
          </div>

          {/* Right: CV download + lang toggle */}
          <div className="flex items-center gap-3">
            <a
              href={t.cvFile}
              download
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition duration-200"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              {t.downloadCV}
            </a>
            <div className="inline-flex items-center rounded-xl border border-slate-700 overflow-hidden">
              <button
                onClick={() => setLang('fr')}
                className={`px-2.5 py-1.5 text-base transition duration-200 ${lang === 'fr' ? 'bg-slate-700' : 'opacity-40 hover:opacity-70 hover:bg-slate-800'}`}
                title="Passer en français"
              >🇫🇷</button>
              <span className="w-px h-5 bg-slate-700" />
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1.5 text-base transition duration-200 ${lang === 'en' ? 'bg-slate-700' : 'opacity-40 hover:opacity-70 hover:bg-slate-800'}`}
                title="Switch to English"
              >🇬🇧</button>
            </div>
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
              {t.hero.consultantIn}
            </p>
            <div className="flex flex-wrap gap-2">
              {t.hero.badges.map(b => (
                <span key={b} className="px-3 py-1 rounded-full border border-slate-700 text-slate-300 text-sm font-medium cursor-default">{b}</span>
              ))}
            </div>
            <p className="text-slate-400 text-lg leading-relaxed mt-8 max-w-2xl" style={{ lineHeight: '1.75' }}>
              {t.hero.description}
            </p>
            <div className="flex flex-wrap gap-4 mt-10">
              <a href="#projects"
                className="px-6 py-4 rounded-2xl bg-white text-black font-semibold hover:scale-105 hover:shadow-lg hover:shadow-white/10 transition duration-200 text-center cursor-pointer">
                {t.hero.viewProjects}
              </a>
              <button type="button" onClick={openLinkedIn}
                className="relative z-50 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border border-slate-700 hover:bg-slate-900 hover:border-slate-500 transition duration-200 cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-blue-400"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
              </button>
              <a href="https://calendly.com/henintsoa_ratovonirina" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 transition duration-200 text-center cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                {t.hero.bookCall}
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full" />
            <div className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-sm mb-4">
              <span>🧠</span>
              <span className="text-base text-slate-300">{t.hero.expBadge}</span>
            </div>
            <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-8 gap-6">
                <div>
                  <p className="text-slate-400 text-sm mb-3">{t.hero.fieldExp}</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <span className="text-white mt-1">•</span>
                      <span className="text-slate-300">
                        {lang === 'fr'
                          ? <>Plus de <span className="text-white font-semibold">20 missions</span> réalisées dans le secteur de l'assurance, au service de <span className="text-white font-semibold">dizaines de clients accompagnés</span> dans leurs projets data.</>
                          : <>Over <span className="text-white font-semibold">20 missions</span> completed in the insurance sector, supporting <span className="text-white font-semibold">dozens of clients</span> in their data projects.</>
                        }
                      </span>
                    </li>
                  </ul>
                </div>
                <span className="text-5xl">📉</span>
              </div>
              <div className="space-y-5">
                <ProgressBar label={t.progressLabels[0]} value={92} />
                <ProgressBar label={t.progressLabels[1]} value={95} />
                <ProgressBar label={t.progressLabels[2]} value={96} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Qui suis-je */}
      <section id="about" className="max-w-7xl mx-auto px-6 py-20 scroll-mt-24">
        <div className="flex items-center gap-3 mb-10 reveal">
          <h2 className="text-4xl font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>{t.about.title}</h2>
        </div>
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h3 className="text-2xl font-bold mb-6 leading-snug text-white">
              {t.about.subtitle}
              <span className="block text-blue-400 min-h-[1.4em]">
                {typedText}
                <span className="inline-block w-[2px] h-[1.1em] bg-blue-400 ml-[2px] align-middle animate-pulse" />
              </span>
            </h3>
            <p className="text-slate-400 leading-relaxed mb-5" dangerouslySetInnerHTML={{ __html: t.about.p1 }} />
            <p className="text-slate-400 leading-relaxed mb-5" dangerouslySetInnerHTML={{ __html: t.about.p2 }} />
            <p className="text-slate-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: t.about.p3 }} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { emoji: "📊", number: "20+", label: t.about.statMissions },
              { emoji: "🗓️", number: "5+", label: t.about.statYears },
            ].map(({ emoji, number, label }) => (
              <div key={label} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center hover:-translate-y-1 transition duration-300">
                <div className="text-3xl mb-2">{emoji}</div>
                <div className="text-3xl font-black mb-1">{number}</div>
                <div className="text-slate-400 text-sm">{label}</div>
              </div>
            ))}
            <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-4">
              <svg viewBox="0 0 360 178" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                <rect width="360" height="26" rx="10" fill="#1e293b"/>
                <rect y="13" width="360" height="13" fill="#1e293b"/>
                <circle cx="14" cy="13" r="4" fill="#f87171" opacity="0.8"/>
                <circle cx="28" cy="13" r="4" fill="#fbbf24" opacity="0.8"/>
                <circle cx="42" cy="13" r="4" fill="#4ade80" opacity="0.8"/>
                <text x="56" y="17" fontFamily="monospace" fontSize="7.5" fill="#334155">Power BI · {lang === 'fr' ? 'Niveau d\'expertise, Compétences clés' : 'Expertise level, Key skills'}</text>
                <rect x="0"   y="33" width="87" height="34" rx="6" fill="#0f172a"/>
                <text x="10"  y="46" fontFamily="sans-serif" fontSize="6.5" fill="#64748b">{lang === 'fr' ? 'Missions' : 'Missions'}</text>
                <text x="10"  y="59" fontFamily="sans-serif" fontSize="13" fontWeight="700" fill="#f1f5f9">20+</text>
                <rect x="91"  y="33" width="87" height="34" rx="6" fill="#0f172a"/>
                <text x="101" y="46" fontFamily="sans-serif" fontSize="6.5" fill="#64748b">{lang === 'fr' ? 'Expérience' : 'Experience'}</text>
                <text x="101" y="59" fontFamily="sans-serif" fontSize="13" fontWeight="700" fill="#f1f5f9">{lang === 'fr' ? '5 ans' : '5 yrs'}</text>
                <rect x="182" y="33" width="87" height="34" rx="6" fill="#0f172a"/>
                <text x="192" y="46" fontFamily="sans-serif" fontSize="6.5" fill="#64748b">DataViz</text>
                <text x="192" y="59" fontFamily="sans-serif" fontSize="13" fontWeight="700" fill="#60a5fa">95%</text>
                <rect x="273" y="33" width="87" height="34" rx="6" fill="#0f172a"/>
                <text x="283" y="46" fontFamily="sans-serif" fontSize="6.5" fill="#64748b">Reporting</text>
                <text x="283" y="59" fontFamily="sans-serif" fontSize="13" fontWeight="700" fill="#34d399">96%</text>
                <text x="0" y="82" fontFamily="sans-serif" fontSize="7.5" fill="#475569" fontWeight="500">
                  {lang === 'fr' ? 'Niveau d\'expertise · Compétences clés (échelle 75–100%)' : 'Expertise level · Key skills (scale 75–100%)'}
                </text>
                <line x1="0" y1="96"  x2="360" y2="96"  stroke="#1e293b" strokeWidth="1"/>
                <line x1="0" y1="114" x2="360" y2="114" stroke="#1e293b" strokeWidth="1"/>
                <line x1="0" y1="133" x2="360" y2="133" stroke="#1e293b" strokeWidth="1"/>
                <line x1="0" y1="152" x2="360" y2="152" stroke="#1e293b" strokeWidth="1"/>
                <text x="0" y="99"  fontFamily="sans-serif" fontSize="5" fill="#334155">100%</text>
                <text x="0" y="117" fontFamily="sans-serif" fontSize="5" fill="#334155">90%</text>
                <text x="0" y="136" fontFamily="sans-serif" fontSize="5" fill="#334155">80%</text>
                <text x="0" y="155" fontFamily="sans-serif" fontSize="5" fill="#334155">70%</text>
                <rect x="27"  y="100" width="40" height="52" rx="3" fill="#3b82f6"/>
                <rect x="27"  y="100" width="40" height="3"  rx="1" fill="#93c5fd"/>
                <text x="35"  y="97"  fontFamily="sans-serif" fontSize="6" fill="#93c5fd">98%</text>
                <text x="29"  y="163" fontFamily="sans-serif" fontSize="6" fill="#93c5fd">Power BI</text>
                <rect x="94"  y="115" width="40" height="37" rx="3" fill="#60a5fa"/>
                <text x="102" y="112" fontFamily="sans-serif" fontSize="6" fill="#bfdbfe">90%</text>
                <text x="99"  y="163" fontFamily="sans-serif" fontSize="6" fill="#475569">Python</text>
                <rect x="161" y="103" width="40" height="49" rx="3" fill="#60a5fa" opacity="0.85"/>
                <text x="170" y="100" fontFamily="sans-serif" fontSize="6" fill="#bfdbfe">96%</text>
                <text x="172" y="163" fontFamily="sans-serif" fontSize="6" fill="#475569">SQL</text>
                <rect x="228" y="115" width="40" height="37" rx="3" fill="#38bdf8"/>
                <text x="236" y="112" fontFamily="sans-serif" fontSize="6" fill="#7dd3fc">90%</text>
                <text x="224" y="163" fontFamily="sans-serif" fontSize="6" fill="#475569">MS Fabric</text>
                <rect x="295" y="102" width="40" height="50" rx="3" fill="#38bdf8" opacity="0.8"/>
                <text x="303" y="99"  fontFamily="sans-serif" fontSize="6" fill="#7dd3fc">97%</text>
                <text x="295" y="163" fontFamily="sans-serif" fontSize="6" fill="#475569">Cognos</text>
                <rect x="0" y="169" width="7" height="7" rx="1.5" fill="#3b82f6"/>
                <text x="11" y="176" fontFamily="sans-serif" fontSize="6.5" fill="#93c5fd">Power BI · {lang === 'fr' ? 'Outil principal' : 'Main tool'}</text>
                <rect x="170" y="169" width="7" height="7" rx="1.5" fill="#38bdf8"/>
                <text x="181" y="176" fontFamily="sans-serif" fontSize="6.5" fill="#64748b">{lang === 'fr' ? 'Outils complémentaires' : 'Complementary tools'}</text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Parcours / Experience */}
      <section id="experience" className="max-w-7xl mx-auto px-6 py-20 scroll-mt-24">
        <div className="flex items-center gap-3 mb-10 reveal">
          <h2 className="text-4xl font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>{t.experience.title}</h2>
        </div>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-800 hidden md:block" />
          <div className="space-y-6">
            {t.experience.jobs.map((job, i) => (
              <div key={i} className="reveal relative md:pl-16">
                {/* Timeline dot */}
                <div className={`absolute left-[18px] top-6 w-4 h-4 rounded-full border-2 hidden md:block ${job.current ? 'bg-blue-400 border-blue-400' : 'bg-slate-900 border-slate-600'}`} />

                <div className="bg-[#111113] border border-slate-800 rounded-3xl p-7 hover:border-slate-700 transition duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-lg font-bold text-white">{job.title}</h3>
                        {job.current && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">
                            {job.periodEnd}
                          </span>
                        )}
                        <span className="px-2 py-0.5 text-xs rounded-full bg-slate-800 border border-slate-700 text-slate-400">{job.type}</span>
                      </div>
                      <p className="text-slate-400 text-sm font-medium">{job.company}</p>
                    </div>
                    <span className="text-slate-500 text-sm whitespace-nowrap shrink-0">
                      {job.period} → {job.periodEnd}
                    </span>
                  </div>

                  <ul className="space-y-1.5 mb-5">
                    {job.points.map((point, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-slate-400">
                        <span className="text-slate-600 mt-1 shrink-0">▸</span>
                        {point}
                      </li>
                    ))}
                  </ul>

                  <div className="border-t border-slate-800 pt-4 mb-4">
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">{t.experience.achievementsLabel}</p>
                    <ul className="space-y-1">
                      {job.achievements.map((a, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                          <span className="text-blue-400 mt-1 shrink-0">✦</span>
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {job.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-slate-800 border border-slate-700 text-slate-400">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compétences */}
      <section id="competences" className="max-w-7xl mx-auto px-6 py-10 scroll-mt-24">
        <div className="flex items-center gap-3 mb-10 reveal">
          <h2 className="text-4xl font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>{t.skills.title}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {skills.map((skill) => <SkillCard key={skill} skill={skill} />)}
        </div>
      </section>

      {/* Projets */}
      <section id="projects" className="max-w-7xl mx-auto px-6 py-20 scroll-mt-24">
        <div className="flex items-center gap-3 mb-10 reveal">
          <h2 className="text-4xl font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>{t.projects.title}</h2>
        </div>
        <div className={`grid gap-6 ${visibleProjects.length === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'}`}>
          {visibleProjects.map((project, i) => (
            <div key={project.id} className={`reveal reveal-delay-${i + 1}`}>
              <ProjectCard
                project={project}
                lang={lang}
                onAction={() => handleProjectAction(project.action)}
              />
            </div>
          ))}
        </div>
        {role !== 'admin' && (
          <p className="text-center text-slate-600 text-sm mt-6">
            {t.projects.adminNote}
          </p>
        )}
      </section>

      {/* Contact */}
      <section id="contact" className="max-w-7xl mx-auto px-6 pb-24 scroll-mt-24">
        <div className="bg-[#111113] border border-slate-800 rounded-3xl p-10 shadow-2xl reveal">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>{t.contact.title}</h2>
            <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed mb-6" style={{ lineHeight: '1.75' }}>
              {t.contact.subtitle}
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
                <span>{t.contact.bookCall}</span>
              </a>
            </div>
          </div>
          <ContactForm tc={t.contact} />
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
              <h2 className="text-3xl font-bold">{lang === 'en' ? 'Data Piloting & Reporting' : 'Pilotage & Reporting Data'}</h2>
            </div>
            <div className="space-y-6">
              {lang === 'fr' ? [
                { emoji: "📉", title: "Pilotage d'activité Assurance", desc: "Création de dashboards opérationnels pour le suivi des délais, KPI métiers et performances des équipes expertise.", tags: ["Power BI", "DAX", "Microsoft Fabric"] },
                { emoji: "⚙️", title: "Automatisation de flux de données", desc: "Automatisation des traitements et reportings via Python et n8n afin de réduire les tâches manuelles répétitives.", tags: ["Python", "n8n", "REST API"] },
                { emoji: "🗄️", title: "Modélisation & Reporting", desc: "Conception de modèles de données orientés métier pour améliorer la qualité des analyses et la prise de décision.", tags: ["SQL", "Cognos Analytics", "DataViz"] },
              ] : [
                { emoji: "📉", title: "Insurance Activity Piloting", desc: "Operational dashboards for tracking deadlines, business KPIs, and expertise team performance.", tags: ["Power BI", "DAX", "Microsoft Fabric"] },
                { emoji: "⚙️", title: "Data Flow Automation", desc: "Automated data processing and reporting with Python and n8n to reduce repetitive manual tasks.", tags: ["Python", "n8n", "REST API"] },
                { emoji: "🗄️", title: "Modelling & Reporting", desc: "Business-oriented data models to improve analysis quality and support decision-making.", tags: ["SQL", "Cognos Analytics", "DataViz"] },
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
              <h2 className="text-3xl font-bold">{t.adminPanel.title}</h2>
            </div>
            <p className="text-slate-500 text-sm mb-8">{t.adminPanel.subtitle}</p>
            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="font-bold mb-2 flex items-center gap-2"><span>📁</span> {t.adminPanel.projects}</h3>
                <p className="text-slate-400 text-sm">{t.adminPanel.projectsDesc}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="font-bold mb-2 flex items-center gap-2"><span>💼</span> {t.adminPanel.pricing}</h3>
                <p className="text-slate-400 text-sm">{t.adminPanel.pricingDesc}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-blue-400"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  {t.adminPanel.linkedinTitle}
                </h3>
                <p className="text-slate-400 text-sm mb-4">{t.adminPanel.linkedinDesc}</p>
                <button
                  onClick={() => { setShowAdminPanel(false); setShowLinkedInManager(true); }}
                  className="w-full px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition duration-300"
                >
                  {t.adminPanel.linkedinBtn}
                </button>
              </div>
            </div>
            <button onClick={logout}
              className="mt-8 w-full px-4 py-3 rounded-2xl border border-red-500/30 text-red-400 hover:bg-red-950/30 transition text-sm font-medium">
              {t.adminPanel.logout}
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

      {/* Modale Vibe Coding */}
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
              {(lang === 'fr' ? [
                { emoji: "🏫", title: "Gestion d'école", desc: "Application de gestion des élèves, classes, notes et absences. Tableau de bord complet pour les établissements scolaires.", tags: ["React", "Node.js", "SQL"], available: false },
                { emoji: "📈", title: "Analyse de marché", desc: "Outil d'analyse et de visualisation de données de marché : tendances, segments et opportunités business.", tags: ["Python", "DataViz", "API"], available: false },
                { emoji: "⏳", title: "Calculateur de vie", desc: "Visualisez vos jours vécus, les jours restants estimés et votre progression de vie sous forme graphique.", tags: ["React", "Charts"], available: true, onLaunch: () => { setShowVibeCoding(false); setShowCalculator(true); } },
                { emoji: "✅", title: "Gestionnaire de tâches", desc: "Application de productivité avec kanban, priorités, rappels et suivi d'avancement des projets personnels.", tags: ["React", "LocalStorage"], available: false },
                { emoji: "💰", title: "Simulateur de budget", desc: "Planifiez vos revenus et dépenses, simulez des scénarios financiers et visualisez votre épargne projetée.", tags: ["React", "Charts"], available: false },
              ] : [
                { emoji: "🏫", title: "School Management", desc: "Student, class, grade, and attendance management app with a full dashboard for schools.", tags: ["React", "Node.js", "SQL"], available: false },
                { emoji: "📈", title: "Market Analysis", desc: "Data analysis and visualisation tool for market trends, segments, and business opportunities.", tags: ["Python", "DataViz", "API"], available: false },
                { emoji: "⏳", title: "Life Calculator", desc: "Visualise days lived, estimated days remaining, and life progress as an interactive chart.", tags: ["React", "Charts"], available: true, onLaunch: () => { setShowVibeCoding(false); setShowCalculator(true); } },
                { emoji: "✅", title: "Task Manager", desc: "Productivity app with kanban board, priorities, reminders, and personal project tracking.", tags: ["React", "LocalStorage"], available: false },
                { emoji: "💰", title: "Budget Simulator", desc: "Plan income and expenses, simulate financial scenarios, and visualise projected savings.", tags: ["React", "Charts"], available: false },
              ]).map(({ emoji, title, desc, tags, available, onLaunch }) => (
                <div key={title} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold">{title}</h3>
                        {available
                          ? <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/10 border border-green-500/30 text-green-400">{lang === 'en' ? 'Available' : 'Disponible'}</span>
                          : <span className="px-2 py-0.5 text-xs rounded-full bg-slate-800 border border-slate-700 text-slate-500">{lang === 'en' ? 'In progress' : 'En cours'}</span>
                        }
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed mb-3">{desc}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-slate-800 border border-slate-700 text-slate-400">{tag}</span>
                        ))}
                      </div>
                      {available && onLaunch && (
                        <button onClick={onLaunch}
                          className="px-4 py-2 rounded-xl bg-white text-black text-xs font-semibold hover:scale-105 transition">
                          {lang === 'en' ? 'Launch app →' : 'Lancer l\'application →'}
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
          <p className="text-slate-500 text-sm">{t.footer.rights}</p>
          <div className="flex items-center gap-2 text-slate-600 text-xs">
            <span>🇲🇬</span>
            <span>{t.footer.made}</span>
          </div>
          <p className="text-slate-600 text-xs">{t.footer.tech}</p>
        </div>
      </footer>
    </main>
  );
}
