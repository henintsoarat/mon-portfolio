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
  "Cognos Analytics", "n8n", "Azure DevOps", "Web Scraping",
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
    nav: { about: "Qui suis-je", skills: "Compétences", experience: "Parcours", projects: "Projets", tarifs: "Tarifs", contact: "Contact" },
    visitor: "Mode Visiteur",
    admin: "Admin",
    logout: "Déconnexion",
    quit: "Quitter",
    downloadCV: "Lire le CV",
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
      badges: ["Data Analyst", "Data Visualisation", "Reporting Décisionnel", "BI Développeur", "Développeur Fullstack (vibe coding)"],
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
      subtitle: "Consultant indépendant,",
      p1: "Je suis <strong class=\"text-white\">consultant Data Analyst freelance</strong> avec plus de 5 ans d'expérience dans la transformation des données en leviers de performance. Basé à Madagascar et intervenant en remote pour des entreprises françaises et internationales, j'accompagne mes clients dans la mise en place de <strong class=\"text-white\">solutions data sur mesure</strong> : dashboards Power BI, automatisation de flux avec Python et n8n, modélisation de données sous Microsoft Fabric, et reporting métier orienté décision.",
      p2: "Fort d'une expertise reconnue dans le <strong class=\"text-white\">secteur de l'assurance</strong>, j'ai conduit plus de 30 missions opérationnelles, pilotage d'activité, suivi des KPI, industrialisation des reportings et accompagnement des équipes métier. Mon approche : des livrables clairs, une communication transparente et une vraie compréhension des enjeux business.",
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
          company: "Voxens Madagascar (pour Stelliant, France)",
          type: "CDI",
          period: "Mars 2025",
          periodEnd: "Aujourd'hui",
          current: true,
          points: [
            "Migré ~20 reportings clients de Cognos Analytics vers Power BI Report Builder, par lots et sans rupture de service (T-SQL, SQL).",
            "Automatisé 30+ reportings récurrents et conçu des modèles de données fiables et scalables sous Microsoft Fabric (architecture médaillon, PySpark, T-SQL).",
            "Industrialisé la préparation des données (Snowflake) : identification, nettoyage, transformation et modélisation (DAX, PySpark).",
            "Livré des tableaux de bord KPI (Power BI Service) pour 3 publics (direction, métiers, technique) : suivi CA et dossiers (« Expertise »), pilotage interne d'un grand compte assurance.",
            "Collaboré au sein d'une équipe BI de 5 analystes (1 responsable BI), animé des ateliers métiers et coordonné les équipes opérationnelles.",
          ],
          achievements: [
            "Dashboard « Expertise » : suivi CA et dossiers en cours pour un grand compte assurance (DAX, PySpark, T-SQL).",
            "Automatisation de 30+ reportings récurrents sur Microsoft Fabric (architecture médaillon).",
            "Migration ~20 reportings Cognos → Power BI Report Builder sans rupture de service.",
          ],
          tags: ["Power BI", "Microsoft Fabric", "PySpark", "T-SQL", "DAX", "Snowflake"],
        },
        {
          title: "Data Analyst BI / Développeur VBA",
          company: "ARBI",
          type: "Freelance",
          period: "Janv. 2024",
          periodEnd: "Mars 2025",
          current: false,
          points: [
            "Réduit de 99 % les erreurs de paie après calibrage des règles de calcul, et ramené le délai d'accès aux données de 48–72 h à l'instantané via un tableau de bord RH automatisé.",
            "Conçu le modèle Power BI (DAX, règles métier) et sécurisé les accès par service et par utilisateur (RLS).",
            "Outillé le pilotage RH : délai de recrutement, conversion candidature→embauche, turnover, absentéisme, mobilité interne, écart salarial H/F, réclamations paie.",
            "Animé des ateliers réguliers avec les équipes RH pour faire évoluer reportings et KPI.",
          ],
          achievements: [
            "Erreurs de paie réduites de 99 % via calibrage des règles de calcul.",
            "Délai d'accès aux données ramené de 48–72 h à l'instantané via tableau de bord RH automatisé.",
          ],
          tags: ["Power BI", "DAX", "RLS", "VBA", "SQL"],
        },
        {
          title: "Chargé de Reporting BI",
          company: "Webhelp Madagascar",
          type: "CDI",
          period: "Janv. 2021",
          periodEnd: "Janv. 2024",
          current: false,
          points: [
            "Conçu 7 tableaux de bord et des dizaines de reportings pour plusieurs projets clients (WorldRemit, Sendwave, Zity, Zenpark, Iziwork, Trusk, Glide).",
            "Centralisé des données multi-sources (Salesforce, Zendesk, Talkdesk, Amazon Connect, Jira) via SQL, modélisées en étoile sous PostgreSQL.",
            "Automatisé les reportings hebdomadaires, mensuels et annuels : durée de traitement, productivité horaire, qualité de service, absentéisme, CA par acte et par heure (DAX, SQL).",
          ],
          achievements: [
            "7 tableaux de bord livrés pour 7 projets clients (WorldRemit, Sendwave, Zity, Zenpark, Iziwork, Trusk, Glide).",
            "Centralisation multi-sources (Salesforce, Zendesk, Talkdesk, Amazon Connect, Jira) modélisée en étoile sous PostgreSQL.",
          ],
          tags: ["Power BI", "SQL", "PostgreSQL", "DAX", "Salesforce", "Zendesk"],
        },
      ],
    },
    projects: { title: "Projets", adminNote: "🔐 Un projet est réservé à l'espace admin." },
    pricing: {
      title: "Tarifs",
      subtitle: "Quatre façons de transformer vos données en décisions, du diagnostic rapide à l'accompagnement dans la durée.",
      conditionsTitle: "Conditions & modalités",
      baseRateNote: ["Prix en euros TTC", "Licences à la charge du client", "Acompte 30 % · solde à la livraison", "100 % à distance"],
      investLabel: "Investissement",
      hoverHint: "Survoler pour le détail",
      ctaLabel: "Parlons-en",
      ctaDesc: "30 minutes pour cadrer votre besoin et identifier l'offre la plus adaptée.",
      offers: [
        {
          num: "01",
          title: "Tableau de bord décisionnel Power BI",
          problem: "Chaque semaine, vos équipes consolident à la main des données venues de plusieurs fichiers et applications. Le travail est sérieux, mais le résultat reste fragile : selon la source ouverte, les chiffres présentés en réunion ne concordent pas toujours. Vous passez alors plus de temps à vérifier les données qu'à les exploiter, les décisions se prennent en retard, et la confiance dans le reporting s'érode. À mesure que l'activité grandit, ce bricolage devient un point de blocage.",
          what: "Un tableau de bord unique, fiable et lisible, construit autour des décisions que vous avez réellement à prendre, pas une collection de graphiques. Chaque indicateur est défini avec vous, relié à une action concrète et accessible selon le profil de chacun. Les sources sont connectées et fiabilisées une fois pour toutes : fini la ressaisie. Vos équipes partagent enfin une même version des chiffres et décident plus vite, sur une base solide.",
          deliverables: ["Atelier de cadrage métier", "Connexion et fiabilisation des sources", "Modélisation des données", "Développement du tableau de bord Power BI", "Gestion des accès (RLS)", "Documentation & formation"],
          price: "À partir de 4 500 € TTC",
          commitment: null,
          back: {
            sections: [
              {
                title: "Périmètre",
                negative: false,
                included: ["Jusqu'à 3 sources de données", "Jusqu'à 10 KPI stratégiques", "4 tableaux de bord principal", "Modélisation et préparation des données", "Développement Power BI", "Gestion des accès utilisateurs", "Documentation utilisateur", "Formation à la prise en main", "Développement d'applications métier", "Architecture Microsoft Fabric"],
              },
              {
                title: "Non inclus",
                negative: true,
                included: ["Plus de 3 sources de données complexes", "Développements ou intégrations non définis lors du cadrage initial", "Refonte complète du système décisionnel"],
              },
            ],
          },
        },
        {
          num: "02",
          title: "Audit & optimisation Power BI",
          problem: "Votre environnement Power BI s'est construit au fil des demandes : un rapport ajouté ici, quelques indicateurs là, plusieurs personnes qui ont modifié les modèles au fil du temps. Aujourd'hui, les rapports rament, certains chiffres sont contestés en réunion, et la moindre évolution demande plus d'efforts que prévu. Personne n'a de vision claire de ce qui tourne sous le capot, et la dette technique ralentit tout le monde sans qu'on sache par où commencer.",
          what: "Un diagnostic complet et lisible de votre parc : performances, modèle de données, qualité des indicateurs, sécurité des accès. Surtout, vous repartez avec un plan d'action priorisé : une matrice impact/effort qui dit quoi corriger, dans quel ordre et pourquoi, accompagnée de quick wins applicables tout de suite. Vous reprenez le contrôle de votre environnement au lieu de le subir, et vos évolutions futures redeviennent simples.",
          deliverables: ["Analyse des performances", "Revue du modèle de données", "Contrôle des KPI et indicateurs", "Audit sécurité & accès", "Plan d'action priorisé"],
          price: "À partir de 3 000 € TTC",
          commitment: null,
          back: {
            sections: [
              {
                title: "Périmètre",
                negative: false,
                included: ["Analyse de l'environnement Power BI existant", "Audit jusqu'à 5 rapports", "Revue du modèle de données", "Analyse des performances", "Vérification des KPI", "Contrôle des accès et de la sécurité", "Identification des risques et de la dette technique", "Plan d'action priorisé", "Mise en œuvre des corrections prioritaires", "Refonte partielle des rapports existants"],
              },
              {
                title: "Non inclus",
                negative: true,
                included: ["Création de nouveaux tableaux de bord", "Développement de nouvelles sources de données", "Refonte complète de l'architecture décisionnelle", "Audits non définis lors du cadrage initial"],
              },
            ],
          },
        },
        {
          num: "03",
          title: "Migration Cognos vers Power BI & Microsoft Fabric",
          problem: "Votre organisation s'appuie depuis des années sur Cognos, Excel ou d'autres outils historiques. Ils ont fait le travail, mais aujourd'hui ils coûtent cher à maintenir, les compétences pour les faire vivre se raréfient, et chaque évolution se transforme en chantier. Vous savez qu'il faut moderniser, mais migrer des centaines de rapports sans interrompre l'activité fait hésiter, et le statu quo s'installe.",
          what: "Une migration progressive et sécurisée vers Power BI et Microsoft Fabric, menée par lots pour ne jamais rompre le service. On démarre par un inventaire, une cartographie de l'existant et un lot pilote validé : la démarche est éprouvée avant d'être généralisée. À l'arrivée, vous gagnez un socle moderne, plus rapide à faire évoluer, et vos équipes montent en compétence au passage. Cette méthode, je l'ai appliquée sur la migration de plus de 750 rapports Cognos vers Power BI Report Builder.",
          deliverables: ["Inventaire & cartographie de l'existant", "Définition de l'architecture cible", "Migration d'un lot pilote", "Plan de migration détaillé", "Documentation technique & fonctionnelle", "Transfert de compétences"],
          price: "À partir de 6 000 € TTC",
          commitment: null,
          back: {
            sections: [
              {
                title: "Périmètre",
                negative: false,
                included: ["Inventaire des rapports existants", "Cartographie de l'environnement BI", "Définition de l'architecture cible", "Migration d'un lot pilote", "Validation métier", "Documentation de migration", "Accompagnement des équipes", "Audit de l'existant", "Plan de migration détaillé", "Refonte des règles métier lorsque nécessaire pour assurer la cohérence de la cible"],
              },
              {
                title: "Le forfait de départ à 6 000 € TTC comprend",
                negative: false,
                included: ["Audit de l'existant", "Cartographie de l'environnement BI", "Définition de l'architecture cible", "Migration d'un lot pilote", "Élaboration du plan de migration"],
              },
              {
                title: "Non inclus",
                negative: true,
                included: ["Migration complète de l'ensemble du parc", "Développement spécifique non définis lors du cadrage initial", "Refonte globale des processus métiers"],
              },
            ],
          },
        },
        {
          num: "04",
          title: "Partenaire data longue durée",
          problem: "Vous avez investi dans des tableaux de bord et des outils de reporting, mais les besoins métier, eux, continuent d'évoluer. De nouveaux indicateurs apparaissent, les questions affluent, et tout repose sur des interventions ponctuelles qu'il faut relancer à chaque fois. Résultat : vos outils vieillissent plus vite qu'ils ne s'améliorent, et vous dépendez de prestataires qu'il faut à chaque fois remettre dans le contexte.",
          what: "Un partenaire data unique, disponible dans la durée, qui connaît vos enjeux et votre organisation. Il fait évoluer vos tableaux de bord, crée de nouveaux KPI, automatise les tâches chronophages et accompagne vos équipes, sans que vous ayez à mobiliser plusieurs prestataires. Un budget mensuel lissé, des priorités revues ensemble, une expertise transverse sur toute votre chaîne data. Vos outils progressent au rythme de votre activité, au lieu de prendre du retard.",
          deliverables: ["Évolutions & améliorations des tableaux de bord", "Création de nouveaux KPI", "Automatisation des flux (Python, Fabric)", "Ateliers métiers", "Accompagnement des équipes", "Conseil & support continu"],
          price: "4 000 € TTC / mois",
          commitment: "Engagement minimum 3 mois",
          back: {
            sections: [
              {
                title: "Périmètre",
                negative: false,
                included: ["Accompagnement continu", "Évolutions des tableaux de bord", "Création de nouveaux KPI", "Analyses ponctuelles", "Automatisation des flux de données (Python, Fabric)", "Support aux équipes métiers", "Ateliers de cadrage et de pilotage", "Conseils sur les bonnes pratiques data", "Priorisation mensuelle des besoins"],
              },
              {
                title: "Modalités",
                negative: false,
                included: ["Engagement minimum de 3 mois", "Réunion de pilotage mensuelle", "Accompagnement continu selon les priorités définies ensemble"],
              },
              {
                title: "Non inclus",
                negative: true,
                included: ["Refonte complète d'un système décisionnel", "Projet de migration complet", "Développement d'applications métier non définis lors du cadrage initial", "Refonte globale d'une architecture data existante"],
              },
            ],
          },
        },
      ],
    },
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
    nav: { about: "About", skills: "Skills", experience: "Experience", projects: "Projects", tarifs: "Pricing", contact: "Contact" },
    visitor: "Visitor Mode",
    admin: "Admin",
    logout: "Logout",
    quit: "Quit",
    downloadCV: "Read CV",
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
      badges: ["Data Analyst", "Data Visualisation", "Decision Reporting", "BI Developer", "Fullstack Developer (vibe coding)"],
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
      p2: "With recognised expertise in the <strong class=\"text-white\">insurance sector</strong>, I have led over 30 operational missions covering activity management, KPI tracking, reporting industrialisation, and business team support. My approach: clear deliverables, transparent communication, and a genuine understanding of business stakes.",
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
          company: "Voxens Madagascar (for Stelliant, France)",
          type: "Permanent",
          period: "Mar. 2025",
          periodEnd: "Present",
          current: true,
          points: [
            "Migrated ~20 client reports from IBM Cognos Analytics to Power BI Report Builder, in batches and with zero service disruption (T-SQL, SQL).",
            "Automated 30+ recurring reports and built reliable, scalable data models on Microsoft Fabric (medallion architecture, PySpark, T-SQL).",
            "Industrialised data preparation (Snowflake): sourcing, cleansing, transformation and modelling (DAX, PySpark).",
            "Delivered KPI dashboards (Power BI Service) for 3 audiences (executive, business, technical): revenue and case tracking ('Expertise') and internal steering for a major insurance account.",
            "Worked within a BI team of 5 analysts (1 BI lead); ran business workshops and coordinated operational teams.",
          ],
          achievements: [
            "'Expertise' dashboard: revenue & case tracking for a major insurance account (DAX, PySpark, T-SQL).",
            "Automated 30+ recurring reports on Microsoft Fabric (medallion architecture).",
            "Migrated ~20 Cognos reports to Power BI Report Builder with zero service disruption.",
          ],
          tags: ["Power BI", "Microsoft Fabric", "PySpark", "T-SQL", "DAX", "Snowflake"],
        },
        {
          title: "BI Data Analyst / VBA Developer",
          company: "ARBI",
          type: "Freelance",
          period: "Jan. 2024",
          periodEnd: "Mar. 2025",
          current: false,
          points: [
            "Cut payroll errors by 99% after calibrating calculation rules, and reduced data access time from 48–72h to instant via an automated HR dashboard.",
            "Built the Power BI model (DAX, business rules) and secured access by department and user (RLS).",
            "Delivered HR analytics: time-to-hire, application-to-hire conversion, turnover, absenteeism, internal mobility, gender pay gap, payroll claims.",
            "Ran regular workshops with HR teams to maintain and extend reports and KPIs.",
          ],
          achievements: [
            "Payroll errors cut by 99% through calculation rule calibration.",
            "Data access time reduced from 48–72h to instant via automated HR dashboard.",
          ],
          tags: ["Power BI", "DAX", "RLS", "VBA", "SQL"],
        },
        {
          title: "BI Reporting Analyst",
          company: "Webhelp Madagascar",
          type: "Permanent",
          period: "Jan. 2021",
          periodEnd: "Jan. 2024",
          current: false,
          points: [
            "Built 7 dashboards and dozens of reports across multiple client projects (WorldRemit, Sendwave, Zity, Zenpark, Iziwork, Trusk, Glide).",
            "Centralised multi-source data (Salesforce, Zendesk, Talkdesk, Amazon Connect, Jira) via SQL, modelled as a star schema in PostgreSQL.",
            "Automated weekly, monthly and annual reporting: handling time, hourly productivity, service quality, absenteeism, revenue per transaction and per hour (DAX, SQL).",
          ],
          achievements: [
            "7 dashboards delivered across 7 client projects (WorldRemit, Sendwave, Zity, Zenpark, Iziwork, Trusk, Glide).",
            "Multi-source data centralisation (Salesforce, Zendesk, Talkdesk, Amazon Connect, Jira) modelled as star schema in PostgreSQL.",
          ],
          tags: ["Power BI", "SQL", "PostgreSQL", "DAX", "Salesforce", "Zendesk"],
        },
      ],
    },
    projects: { title: "Projects", adminNote: "🔐 One project is reserved for the admin space." },
    pricing: {
      title: "Pricing",
      subtitle: "Four ways to turn your data into decisions, from a quick diagnosis to a long-term partnership.",
      conditionsTitle: "Terms & conditions",
      baseRateNote: ["Prices in euros excl. VAT", "Client-side licences", "30% deposit · balance on delivery", "Fully remote"],
      investLabel: "Investment",
      hoverHint: "Hover for details",
      ctaLabel: "Let's talk",
      ctaDesc: "30 minutes to scope your need and find the right fit.",
      offers: [
        {
          num: "01",
          title: "Decision-making Power BI Dashboard",
          problem: "Every week your teams manually consolidate data from multiple files. Figures differ depending on the source, decisions are delayed.",
          what: "A single, reliable, readable dashboard: each metric defined with you and tied to a concrete business decision.",
          deliverables: ["Business scoping workshop", "Source connection & validation", "Data modelling", "Power BI dashboard development", "Access control (RLS)", "Documentation & training"],
          price: "From €4,500 excl. VAT",
          commitment: null,
          back: {
            sections: [
              {
                title: "Scope",
                negative: false,
                included: ["Up to 3 data sources", "Up to 10 strategic KPIs", "4 main dashboards", "Data modelling & preparation", "Power BI development", "User access management", "User documentation", "Onboarding training", "Business application development", "Microsoft Fabric architecture"],
              },
              {
                title: "Not included",
                negative: true,
                included: ["More than 3 complex data sources", "Developments or integrations not defined during initial scoping", "Full BI system overhaul"],
              },
            ],
          },
        },
        {
          num: "02",
          title: "Power BI Audit & Optimisation",
          problem: "Reports are getting slower, some figures are disputed and every change takes more effort than expected.",
          what: "A full diagnosis of your Power BI environment with a prioritised action plan.",
          deliverables: ["Performance analysis", "Data model review", "KPI & indicator audit", "Security & access audit", "Prioritised action plan"],
          price: "From €3,000 excl. VAT",
          commitment: null,
          back: {
            sections: [
              {
                title: "Scope",
                negative: false,
                included: ["Analysis of existing Power BI environment", "Audit of up to 5 reports", "Data model review", "Performance analysis", "KPI verification", "Access & security audit", "Risk and technical debt identification", "Prioritised action plan", "Implementation of priority fixes", "Partial rework of existing reports"],
              },
              {
                title: "Not included",
                negative: true,
                included: ["New dashboard creation", "New data source development", "Full BI architecture overhaul", "Audits not defined during initial scoping"],
              },
            ],
          },
        },
        {
          num: "03",
          title: "Cognos to Power BI & Microsoft Fabric Migration",
          problem: "Your organisation relies on Cognos, Excel or legacy tools that are now slowing down every change.",
          what: "A progressive, controlled migration to Power BI and Microsoft Fabric, backed by hands-on experience migrating Cognos reports to Power BI Report Builder with zero service disruption.",
          deliverables: ["Inventory & mapping of existing reports", "Target architecture definition", "Pilot batch migration", "Detailed migration plan", "Technical & functional documentation", "Knowledge transfer"],
          price: "From €6,000 excl. VAT",
          commitment: null,
          back: {
            sections: [
              {
                title: "Scope",
                negative: false,
                included: ["Inventory of existing reports", "BI environment mapping", "Target architecture definition", "Pilot batch migration", "Business validation", "Migration documentation", "Team support", "Existing system audit", "Detailed migration plan", "Business rule rework where needed to ensure target consistency"],
              },
              {
                title: "The €6,000 incl. VAT starting package includes",
                negative: false,
                included: ["Existing system audit", "BI environment mapping", "Target architecture definition", "Pilot batch migration", "Migration plan development"],
              },
              {
                title: "Not included",
                negative: true,
                included: ["Full migration of the entire report estate", "Specific developments not defined during initial scoping", "Full business process overhaul"],
              },
            ],
          },
        },
        {
          num: "04",
          title: "Long-term Data Partner",
          problem: "Your dashboards exist but are ageing: needs keep evolving and everything relies on one-off interventions you have to chase each time.",
          what: "A single data partner covering dashboards, data flows and automation: no need to juggle multiple providers.",
          deliverables: ["Dashboard updates & improvements", "New KPIs on demand", "Data flow automation (Python, Fabric)", "Business workshops", "Team support & upskilling", "Ongoing advice & support"],
          price: "€4,000 excl. VAT / month",
          commitment: "3-month minimum engagement",
          back: {
            sections: [
              {
                title: "Scope",
                negative: false,
                included: ["Ongoing support", "Dashboard updates & improvements", "New KPI creation", "Ad-hoc analyses", "Data flow automation (Python, Fabric)", "Business team support", "Scoping & steering workshops", "Data best practice advisory", "Monthly needs prioritisation"],
              },
              {
                title: "Terms",
                negative: false,
                included: ["3-month minimum engagement", "Monthly steering meeting", "Ongoing support based on jointly defined priorities"],
              },
              {
                title: "Not included",
                negative: true,
                included: ["Full BI system overhaul", "Full migration project", "Business application development not defined during initial scoping", "Full existing data architecture overhaul"],
              },
            ],
          },
        },
      ],
    },
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
    <div className="core-card bg-[#0D1117] border border-[#27272A] rounded-lg p-5 text-center cursor-default">
      <span className="text-xs md:text-sm font-mono text-[#A1A1AA] tracking-widest uppercase">{skill}</span>
    </div>
  );
}

function ProgressBar({ label, value }) {
  const safeValue = Math.min(100, Math.max(0, value));
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5 font-mono">
        <span className="text-[#A1A1AA] uppercase tracking-widest">{label}</span>
        <span className="text-[#00F0FF]">{safeValue}%</span>
      </div>
      <div className="w-full h-1 bg-[#27272A] overflow-hidden">
        <div className="h-1 bg-[#00F0FF] core-progress-bar transition-all duration-700" style={{ width: `${safeValue}%` }} />
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
    <div className="core-card bg-[#0D1117] border border-[#27272A] rounded-lg p-8 flex flex-col h-full">
      <div className="mb-6">
        <div className="w-8 h-8 rounded bg-[#00F0FF]/10 border border-[#00F0FF]/20 flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-core-cyan" />
        </div>
      </div>
      <h3 className="text-xl font-bold mb-4 tracking-tight text-white">{title}</h3>
      <p className="text-[#A1A1AA] leading-relaxed flex-1 text-sm" style={{ lineHeight: '1.75' }}>{description}</p>
      {project.access === 'admin' && (
        <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-[#FF003C]/70 font-mono">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
          <span>{adminNote}</span>
        </div>
      )}
      <button
        type="button"
        onClick={onAction}
        className="core-btn mt-6 w-full px-4 py-3 rounded-lg bg-[#00F0FF] text-black font-bold text-sm hover:bg-white active:scale-[0.98] transition duration-200 cursor-pointer"
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
          <label className="block text-[10px] font-mono text-[#A1A1AA] mb-1.5 uppercase tracking-widest">{tc.formName}</label>
          <input name="from_name" value={form.from_name} onChange={handleChange}
            placeholder={tc.formNamePlaceholder} maxLength={100} type="text"
            className="core-input w-full bg-[#030508] border border-[#27272A] rounded-lg px-4 py-3 text-sm text-white placeholder-[#3f3f46] font-mono transition duration-200" />
        </div>
        <div>
          <label className="block text-[10px] font-mono text-[#A1A1AA] mb-1.5 uppercase tracking-widest">{tc.formEmail}</label>
          <input name="from_email" value={form.from_email} onChange={handleChange}
            placeholder={tc.formEmailPlaceholder} maxLength={150} type="email"
            className="core-input w-full bg-[#030508] border border-[#27272A] rounded-lg px-4 py-3 text-sm text-white placeholder-[#3f3f46] font-mono transition duration-200" />
        </div>
        <div>
          <label className="block text-[10px] font-mono text-[#A1A1AA] mb-1.5 uppercase tracking-widest">{tc.formCompany}</label>
          <input name="company" value={form.company} onChange={handleChange}
            placeholder={tc.formCompanyPlaceholder} maxLength={100} type="text"
            className="core-input w-full bg-[#030508] border border-[#27272A] rounded-lg px-4 py-3 text-sm text-white placeholder-[#3f3f46] font-mono transition duration-200" />
        </div>
        <div>
          <label className="block text-[10px] font-mono text-[#A1A1AA] mb-1.5 uppercase tracking-widest">{tc.formSubject}</label>
          <select name="subject" value={form.subject} onChange={handleChange}
            className="core-input w-full bg-[#030508] border border-[#27272A] rounded-lg px-4 py-3 text-sm text-white font-mono transition duration-200">
            <option value="">{tc.formSubjectDefault}</option>
            {tc.subjects.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-[10px] font-mono text-[#A1A1AA] mb-1.5 uppercase tracking-widest">{tc.formMessage}</label>
          <textarea name="message" value={form.message} onChange={handleChange}
            placeholder={tc.formMessagePlaceholder} maxLength={2000} rows={4}
            className="core-input w-full bg-[#030508] border border-[#27272A] rounded-lg px-4 py-3 text-sm text-white placeholder-[#3f3f46] font-mono transition duration-200 resize-y" />
        </div>
      </div>

      {status && (
        <div className={`mt-4 text-xs text-center px-4 py-3 rounded-lg font-mono uppercase tracking-widest ${
          status.type === "success"
            ? "bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/20"
            : "bg-[#FF003C]/10 text-[#FF003C] border border-[#FF003C]/20"
        }`}>
          {status.msg}
        </div>
      )}

      <button onClick={handleSubmit} disabled={loading}
        className="core-btn mt-4 w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-[#00F0FF] text-black font-bold hover:bg-white transition duration-200 disabled:opacity-40 disabled:cursor-not-allowed">
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



  const [flippedCard, setFlippedCard] = useState(null);
  const flippedCardRef = useRef(null);
  const cardRefs = useRef([]);
  const flipTimers = useRef({});
  const isAnimating = useRef(false);
  const pendingFlip = useRef(undefined);

  const applySettledClass = (idx) => {
    // Manipulation DOM directe : pas de re-render React → le contexte preserve-3d reste intact
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      if (i === idx) el.classList.add('pricing-card-in-verso');
      else el.classList.remove('pricing-card-in-verso');
    });
  };

  const triggerFlip = (val) => {
    if (val === flippedCardRef.current) {
      isAnimating.current = false;
      pendingFlip.current = undefined;
      return;
    }
    isAnimating.current = true;
    flippedCardRef.current = val;
    if (val === null) applySettledClass(null); // retire la classe settled dès le début de l'unflip
    setFlippedCard(val);
  };
  const handleCardEnter = (i) => {
    if (flipTimers.current[i]) clearTimeout(flipTimers.current[i]);
    if (isAnimating.current) { pendingFlip.current = i; }
    else { triggerFlip(i); }
  };
  const handleCardLeave = (i) => {
    if (flipTimers.current[i]) clearTimeout(flipTimers.current[i]);
    if (isAnimating.current) { pendingFlip.current = null; }
    else { flipTimers.current[i] = setTimeout(() => { if (flippedCardRef.current === i) triggerFlip(null); }, 300); }
  };
  const handleFlipEnd = (e) => {
    if (e.propertyName !== 'transform') return;
    isAnimating.current = false;
    if (pendingFlip.current !== undefined) {
      const next = pendingFlip.current;
      pendingFlip.current = undefined;
      triggerFlip(next);
    } else {
      applySettledClass(flippedCardRef.current); // ajoute la classe settled sans re-render
    }
  };
  const [showCalculator, setShowCalculator] = useState(false);
  const [showVibeCoding, setShowVibeCoding] = useState(false);
  const [showDataProject, setShowDataProject] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showLinkedInManager, setShowLinkedInManager] = useState(false);
  const linkedInUrl = "https://www.linkedin.com/in/henintsoa-ratovonirina/";
  const openLinkedIn = () => window.open(linkedInUrl, "_blank");

  const anyModalOpen = showCalculator || showVibeCoding || showDataProject || showAdminPanel || showLinkedInManager;
  useEffect(() => {
    document.body.style.overflow = anyModalOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [anyModalOpen]);

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
    <main className="min-h-screen bg-[#030508] text-white scroll-smooth core-scanlines" style={{ fontFamily: 'Arial, sans-serif' }}>

      {/* Tactical ticker */}
      <div className="w-full bg-[#030508] border-b border-[#27272A] overflow-hidden py-2" style={{ borderTop: '1px solid rgba(0,240,255,0.2)' }}>
        <div className="animate-marquee whitespace-nowrap flex gap-24 text-sm font-mono text-[#A1A1AA] tracking-widest">
          {[...t.marquee, ...t.marquee].map((msg, i) => (
            <span key={i} className="inline-flex items-center gap-3">
              <span className="text-[#00F0FF]">▸</span>
              <span className="uppercase">{msg}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="sticky top-0 z-30 w-full border-b border-[#27272A] py-3 backdrop-blur-md" style={{ backgroundColor: 'rgba(3,5,8,0.55)', boxShadow: '0 4px 32px rgba(0,0,0,0.4)' }}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
          {/* Mode badge */}
          <div className="flex items-center gap-4">
            {role === 'admin' ? (
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-[10px] font-mono uppercase tracking-widest">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
                  {t.admin}
                </span>
                <button onClick={logout} className="text-[10px] font-mono text-[#FF003C]/60 hover:text-[#FF003C] transition uppercase tracking-widest">{t.logout}</button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0D1117] border border-[#27272A] text-[#52525b] text-[10px] font-mono uppercase tracking-widest">
                  <span className="w-1 h-1 rounded-full bg-[#A1A1AA]/30" /> {t.visitor}
                </span>
                <button onClick={logout} className="text-[10px] font-mono text-[#FF003C]/60 hover:text-[#FF003C] transition uppercase tracking-widest">{t.quit}</button>
              </div>
            )}
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-5 font-mono">
            <a href="#about" className="text-[#A1A1AA] hover:text-[#00F0FF] text-xs uppercase tracking-widest transition duration-200">{t.nav.about}</a>
            <span className="text-[#27272A]">/</span>
            <a href="#experience" className="text-[#A1A1AA] hover:text-[#00F0FF] text-xs uppercase tracking-widest transition duration-200">{t.nav.experience}</a>
            <span className="text-[#27272A]">/</span>
            <a href="#competences" className="text-[#A1A1AA] hover:text-[#00F0FF] text-xs uppercase tracking-widest transition duration-200">{t.nav.skills}</a>
            <span className="text-[#27272A]">/</span>
            <a href="#projects" className="text-[#A1A1AA] hover:text-[#00F0FF] text-xs uppercase tracking-widest transition duration-200">{t.nav.projects}</a>
            <span className="text-[#27272A]">/</span>
            <a href="#tarifs" className="text-[#A1A1AA] hover:text-[#00F0FF] text-xs uppercase tracking-widest transition duration-200">{t.nav.tarifs}</a>
            <span className="text-[#27272A]">/</span>
            <a href="#contact" className="text-[#A1A1AA] hover:text-[#00F0FF] text-xs uppercase tracking-widest transition duration-200">{t.nav.contact}</a>
          </div>

          {/* lang */}
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center rounded-lg border border-[#27272A] overflow-hidden">
              <button onClick={() => setLang('fr')}
                className={`px-2.5 py-2 transition duration-200 ${lang === 'fr' ? 'bg-[#27272A]' : 'opacity-40 hover:opacity-70'}`}
                title="Passer en français">
                <span className="fi fi-fr" style={{ width: '1.4em', height: '1em', display: 'inline-block', backgroundSize: 'cover', borderRadius: '2px' }} />
              </button>
              <span className="w-px h-5 bg-[#27272A]" />
              <button onClick={() => setLang('en')}
                className={`px-2.5 py-2 transition duration-200 ${lang === 'en' ? 'bg-[#27272A]' : 'opacity-40 hover:opacity-70'}`}
                title="Switch to English">
                <span className="fi fi-gb" style={{ width: '1.4em', height: '1em', display: 'inline-block', backgroundSize: 'cover', borderRadius: '2px' }} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative core-grid-bg core-dither overflow-hidden">
        <div className="pointer-events-none absolute -top-32 -right-32 w-[500px] h-[500px] bg-[#FF003C]/4 blur-[120px] rounded-full" />
        <div className="pointer-events-none absolute top-1/2 -left-20 w-[350px] h-[350px] bg-[#00F0FF]/5 blur-[100px] rounded-full -translate-y-1/2" />
        <div className="pointer-events-none absolute top-0 left-0 w-full h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(0,240,255,0.5),transparent)' }} />
        <div className="pointer-events-none absolute bottom-0 left-0 w-full h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(255,0,60,0.2),transparent)' }} />
        <div className="core-scan-beam absolute inset-0 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="reveal">
              <h1 className="font-black leading-none tracking-tighter mb-6" style={{ fontFamily: 'Arial, sans-serif' }}>
                <span className="block text-[#00F0FF] core-glow text-4xl lg:text-6xl">RATOVONIRINA</span>
                <span className="block text-white text-3xl lg:text-5xl font-bold mt-2">Henintsoa Andrianaivo</span>
              </h1>

              {/* Protocol label */}
              <div className="inline-flex items-center gap-3 mb-8 px-3 py-2 border border-[#27272A] rounded-lg bg-[#0D1117]/60">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-core-cyan" />
                <span className="text-sm font-mono text-[#A1A1AA] uppercase tracking-widest">
                  {t.hero.consultantIn}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {t.hero.badges.map(b => (
                  <span key={b} className="px-3 py-1.5 border border-[#27272A] hover:border-[#00F0FF]/30 text-[#A1A1AA] text-xs font-mono uppercase tracking-widest cursor-default transition duration-200">{b}</span>
                ))}
              </div>

              <p className="text-[#A1A1AA] text-base leading-relaxed max-w-2xl" style={{ lineHeight: '1.75' }}>
                {t.hero.description}
              </p>

              <div className="flex flex-wrap gap-4 mt-10">
                <a href="#projects"
                  className="core-btn px-6 py-4 rounded-lg bg-[#00F0FF] text-black font-bold text-sm hover:bg-white transition duration-200 cursor-pointer tracking-wide">
                  {t.hero.viewProjects}
                </a>
                <button type="button" onClick={openLinkedIn}
                  className="relative z-50 inline-flex items-center gap-2 px-6 py-4 rounded-lg border border-[#27272A] hover:border-[#00F0FF]/40 hover:bg-[#0D1117] transition duration-200 cursor-pointer font-mono text-sm">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#00F0FF' }}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  LinkedIn
                </button>
                <a href="https://calendly.com/henintsoa_ratovonirina" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-lg border border-[#FF003C]/30 text-[#FF003C] hover:bg-[#FF003C]/10 transition duration-200 cursor-pointer font-mono text-sm">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  {t.hero.bookCall}
                </a>
              </div>
            </div>

            {/* Stats panel */}
            <div className="relative">
              <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 border border-[#27272A] rounded-lg font-mono text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-core-cyan" />
                <span className="text-[#A1A1AA] text-xs uppercase tracking-widest">{t.hero.expBadge}</span>
              </div>
              <div className="bg-[#0D1117] border border-[#27272A] rounded-lg p-8" style={{ boxShadow: '0 0 40px rgba(0,240,255,0.04)' }}>
                <p className="text-[#A1A1AA] text-[10px] font-mono mb-4 uppercase tracking-widest">{t.hero.fieldExp}</p>
                <div className="flex items-start gap-2 text-sm mb-6">
                  <span className="text-[#00F0FF] mt-1 shrink-0 font-mono">▸</span>
                  <span className="text-[#A1A1AA] text-sm">
                    {lang === 'fr'
                      ? <>Plus de <span className="text-white font-bold">30 missions</span> dans le secteur assurance, <span className="text-white font-bold">dizaines de clients</span> accompagnés.</>
                      : <>Over <span className="text-white font-bold">30 missions</span> in insurance, <span className="text-white font-bold">dozens of clients</span> supported.</>}
                  </span>
                </div>
                <div className="space-y-4">
                  <ProgressBar label={t.progressLabels[0]} value={92} />
                  <ProgressBar label={t.progressLabels[1]} value={95} />
                  <ProgressBar label={t.progressLabels[2]} value={96} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Qui suis-je */}
      <section id="about" className="max-w-7xl mx-auto px-6 py-20 scroll-mt-24">
        <div className="flex items-center gap-3 mb-10 reveal">
          <h2 className="text-4xl font-bold" style={{ fontFamily: 'Arial, sans-serif' }}>{t.about.title}</h2>
        </div>
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h3 className="text-2xl font-bold mb-6 leading-snug text-white">
              {t.about.subtitle}
              <span className="block text-[#00F0FF] min-h-[1.4em]">
                {typedText}
                <span className="inline-block w-[2px] h-[1.1em] bg-blue-400 ml-[2px] align-middle animate-pulse" />
              </span>
            </h3>
            <p className="text-[#A1A1AA] leading-relaxed mb-5" dangerouslySetInnerHTML={{ __html: t.about.p1 }} />
            <p className="text-[#A1A1AA] leading-relaxed mb-5" dangerouslySetInnerHTML={{ __html: t.about.p2 }} />
            <p className="text-[#A1A1AA] leading-relaxed" dangerouslySetInnerHTML={{ __html: t.about.p3 }} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { emoji: "📊", number: "30+", label: t.about.statMissions },
              { emoji: "🗓️", number: "5+", label: t.about.statYears },
            ].map(({ emoji, number, label }) => (
              <div key={label} className="bg-[#0D1117] border border-[#27272A] rounded-lg p-6 text-center hover:-translate-y-1 transition duration-300">
                <div className="text-3xl mb-2">{emoji}</div>
                <div className="text-3xl font-black mb-1">{number}</div>
                <div className="text-[#A1A1AA] text-sm">{label}</div>
              </div>
            ))}
            <div className="col-span-2 bg-[#0D1117] border border-[#27272A] rounded-lg overflow-hidden p-4">
              <svg viewBox="0 0 360 178" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                <rect width="360" height="26" rx="10" fill="#1e293b"/>
                <rect y="13" width="360" height="13" fill="#1e293b"/>
                <circle cx="14" cy="13" r="4" fill="#f87171" opacity="0.8"/>
                <circle cx="28" cy="13" r="4" fill="#fbbf24" opacity="0.8"/>
                <circle cx="42" cy="13" r="4" fill="#4ade80" opacity="0.8"/>
                <text x="56" y="17" fontFamily="monospace" fontSize="7.5" fill="#334155">Power BI · {lang === 'fr' ? 'Niveau d\'expertise, Compétences clés' : 'Expertise level, Key skills'}</text>
                <rect x="0"   y="33" width="87" height="34" rx="6" fill="#0f172a"/>
                <text x="10"  y="46" fontFamily="sans-serif" fontSize="6.5" fill="#64748b">{lang === 'fr' ? 'Missions' : 'Missions'}</text>
                <text x="10"  y="59" fontFamily="sans-serif" fontSize="13" fontWeight="700" fill="#f1f5f9">30+</text>
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
          <h2 className="text-4xl font-bold" style={{ fontFamily: 'Arial, sans-serif' }}>{t.experience.title}</h2>
        </div>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-800 hidden md:block" />
          <div className="space-y-6">
            {t.experience.jobs.map((job, i) => (
              <div key={i} className="reveal relative md:pl-16">
                {/* Timeline dot */}
                <div className={`absolute left-[18px] top-6 w-4 h-4 rounded-full border-2 hidden md:block ${job.current ? 'bg-blue-400 border-blue-400' : 'bg-slate-900 border-slate-600'}`} />

                <div className="bg-[#0D1117] border border-[#27272A] rounded-3xl p-7 hover:border-slate-700 transition duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-lg font-bold text-white">{job.title}</h3>
                        {job.current && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/10 border border-blue-500/30 text-[#00F0FF]">
                            {job.periodEnd}
                          </span>
                        )}
                        <span className="px-2 py-0.5 text-xs rounded-full bg-slate-800 border border-slate-700 text-[#A1A1AA]">{job.type}</span>
                      </div>
                      <p className="text-[#A1A1AA] text-sm font-medium">{job.company}</p>
                    </div>
                    <span className="text-[#A1A1AA] text-sm whitespace-nowrap shrink-0">
                      {job.period} → {job.periodEnd}
                    </span>
                  </div>

                  <ul className="space-y-1.5 mb-5">
                    {job.points.map((point, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-[#A1A1AA]">
                        <span className="text-[#00F0FF] mt-1 shrink-0">▸</span>
                        {point}
                      </li>
                    ))}
                  </ul>

                  <div className="border-t border-[#27272A] pt-4 mb-4">
                    <p className="text-xs text-[#A1A1AA] font-semibold uppercase tracking-wider mb-2">{t.experience.achievementsLabel}</p>
                    <ul className="space-y-1">
                      {job.achievements.map((a, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                          <span className="text-[#00F0FF] mt-1 shrink-0">✦</span>
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {job.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-slate-800 border border-slate-700 text-[#A1A1AA]">{tag}</span>
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
          <h2 className="text-4xl font-bold" style={{ fontFamily: 'Arial, sans-serif' }}>{t.skills.title}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {skills.map((skill) => <SkillCard key={skill} skill={skill} />)}
        </div>
      </section>

      {/* Projets */}
      <section id="projects" className="max-w-7xl mx-auto px-6 py-20 scroll-mt-24">
        <div className="flex items-center gap-3 mb-10 reveal">
          <h2 className="text-4xl font-bold" style={{ fontFamily: 'Arial, sans-serif' }}>{t.projects.title}</h2>
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
      </section>

      {/* Tarifs */}
      <section id="tarifs" className="max-w-7xl mx-auto px-6 pt-4 pb-20 scroll-mt-24">
        <div className="flex items-center gap-3 mb-4 reveal">
          <h2 className="text-4xl font-bold" style={{ fontFamily: 'Arial, sans-serif' }}>{t.pricing.title}</h2>
        </div>
        <p className="text-sm text-[#A1A1AA] leading-relaxed mb-12 reveal">{t.pricing.subtitle}</p>

        <div className="grid md:grid-cols-2 gap-6">
          {t.pricing.offers.map((offer, i) => (
            <div
              key={offer.num}
              ref={el => { cardRefs.current[i] = el; }}
              className={`pricing-card reveal reveal-delay-${(i % 4) + 1}`}
              onMouseEnter={() => handleCardEnter(i)}
              onMouseLeave={() => handleCardLeave(i)}
            >
              <div className={`pricing-card-inner${flippedCard === i ? " flipped" : ""}`} onTransitionEnd={handleFlipEnd}>
                {/* Recto — problème + solution + prix */}
                <div className="pricing-card-front bg-[#0D1117] border border-[#27272A] p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="text-[10px] font-mono font-bold text-[#00F0FF] bg-[#00F0FF]/10 border border-[#00F0FF]/20 rounded px-2 py-1 shrink-0 mt-0.5">{offer.num}</span>
                    <h3 className="text-base font-bold text-white leading-snug">{offer.title}</h3>
                  </div>
                  <p className="text-[#A1A1AA] text-xs font-mono mb-3 leading-relaxed border-l-2 border-[#00F0FF]/30 pl-3">{offer.problem}</p>
                  <p className="text-[#A1A1AA] text-sm mb-4 leading-relaxed flex-1">{offer.what}</p>
                  <div className="border-t border-[#27272A] pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#A1A1AA] uppercase tracking-widest">{t.pricing.investLabel}</span>
                      <span className="text-sm font-mono font-bold text-[#00F0FF]">{offer.price}</span>
                    </div>
                    {offer.commitment && (
                      <p className="text-[10px] font-mono text-[#A1A1AA] mt-1 text-right">{offer.commitment}</p>
                    )}
                    <p className="text-[10px] font-mono text-[#00F0FF]/40 mt-3 text-center uppercase tracking-widest">
                      ⟳ {t.pricing.hoverHint}
                    </p>
                  </div>
                </div>

                {/* Verso — sections périmètre / non inclus */}
                <div className="pricing-card-back bg-[#060D1A] border border-[#00F0FF]/20 p-5 overflow-y-auto">
                  <div className="flex items-start gap-2 mb-5">
                    <span className="text-[10px] font-mono font-bold text-[#00F0FF] bg-[#00F0FF]/10 border border-[#00F0FF]/20 rounded px-2 py-1 shrink-0">{offer.num}</span>
                    <h3 className="text-sm font-bold text-white leading-snug">{offer.title}</h3>
                  </div>
                  {offer.back.sections.map((section, si) => (
                    <div key={si} className={si > 0 ? "mt-5" : ""}>
                      <p className={`text-[10px] font-mono font-bold uppercase tracking-widest mb-2 ${section.negative ? "text-[#FF003C]" : "text-[#00F0FF]"}`}>
                        {section.title}
                      </p>
                      <ul className="space-y-1.5">
                        {section.included.map((item, ii) => (
                          <li key={ii} className="flex items-start gap-2 text-sm text-[#A1A1AA] leading-relaxed">
                            <span className={`shrink-0 mt-0.5 ${section.negative ? "text-[#FF003C]" : "text-[#00F0FF]"}`}>
                              {section.negative ? "✕" : "▸"}
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 bg-[#0D1117] border border-[#27272A] rounded-lg p-8 text-center reveal">
          <p className="text-lg font-mono text-white uppercase tracking-widest mb-6">{t.pricing.conditionsTitle}</p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {t.pricing.baseRateNote.map((note, i) => (
              <span key={note} className="core-chip-anim inline-flex items-center gap-1.5 px-3 py-1.5 border text-[#A1A1AA] text-xs font-mono uppercase tracking-widest whitespace-nowrap cursor-default"
                style={{ animationDelay: `${i * 0.75}s` }}>
                <span className="text-[#00F0FF]">▸</span>
                {note}
              </span>
            ))}
          </div>
          <p className="text-[#A1A1AA] text-sm leading-relaxed mb-8">{t.pricing.ctaDesc}</p>
          <a href="https://calendly.com/henintsoa_ratovonirina" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-4 rounded-lg border border-[#FF003C]/30 text-[#FF003C] hover:bg-[#FF003C]/10 transition duration-200 cursor-pointer font-mono text-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {t.pricing.ctaLabel}
          </a>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="max-w-7xl mx-auto px-6 pb-24 scroll-mt-24">
        <div className="bg-[#0D1117] border border-[#27272A] rounded-3xl p-10 shadow-2xl reveal">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Arial, sans-serif' }}>{t.contact.title}</h2>
            <p className="text-[#A1A1AA] max-w-2xl mx-auto leading-relaxed mb-6" style={{ lineHeight: '1.75' }}>
              {t.contact.subtitle}
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <button type="button" onClick={openLinkedIn}
                className="relative z-50 inline-flex items-center gap-2 px-6 py-4 rounded-2xl border border-[#27272A] hover:bg-[#0D1117] hover:border-[#00F0FF]/20 transition duration-200 cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#00F0FF]"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                <span>LinkedIn</span>
              </button>
              <a href="https://calendly.com/henintsoa_ratovonirina" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-lg border border-[#FF003C]/30 text-[#FF003C] hover:bg-[#FF003C]/10 transition duration-200 cursor-pointer font-mono text-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <span>{t.contact.bookCall}</span>
              </a>
            </div>
          </div>
          <ContactForm tc={t.contact} />
        </div>
      </section>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-lg bg-[#FF003C] text-white font-mono font-bold flex items-center justify-center shadow-lg hover:scale-110 hover:bg-[#cc002f] transition duration-200 text-lg cursor-pointer"
        style={{ boxShadow: '0 0 20px rgba(255,0,60,0.3)' }}>
        ↑
      </button>

      {/* Modale Projets Data */}
      {showDataProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#030508] rounded-lg border border-[#27272A] shadow-2xl p-10">
            <button onClick={() => setShowDataProject(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#0D1117] hover:bg-[#27272A] border border-[#27272A] flex items-center justify-center text-[#A1A1AA] hover:text-white transition font-mono">
              ✕
            </button>
            <div className="flex items-center gap-3 mb-8">
              <span className="text-3xl">📊</span>
              <h2 className="text-3xl font-bold">{lang === 'en' ? 'Data Piloting & Reporting' : 'Pilotage & Reporting Data'}</h2>
            </div>
            <div className="space-y-6">
              {(lang === 'fr' ? [
                { emoji: "📉", title: "Pilotage d'activité Assurance", desc: "Création de dashboards opérationnels pour le suivi des délais, KPI métiers et performances des équipes expertise.", tags: ["Power BI", "DAX", "Microsoft Fabric"] },
                { emoji: "⚙️", title: "Automatisation de flux de données", desc: "Automatisation des traitements et reportings via Python et n8n afin de réduire les tâches manuelles répétitives.", tags: ["Python", "n8n", "REST API"] },
                { emoji: "🗄️", title: "Modélisation & Reporting", desc: "Conception de modèles de données orientés métier pour améliorer la qualité des analyses et la prise de décision.", tags: ["SQL", "Cognos Analytics", "DataViz"] },
              ] : [
                { emoji: "📉", title: "Insurance Activity Piloting", desc: "Operational dashboards for tracking deadlines, business KPIs, and expertise team performance.", tags: ["Power BI", "DAX", "Microsoft Fabric"] },
                { emoji: "⚙️", title: "Data Flow Automation", desc: "Automated data processing and reporting with Python and n8n to reduce repetitive manual tasks.", tags: ["Python", "n8n", "REST API"] },
                { emoji: "🗄️", title: "Modelling & Reporting", desc: "Business-oriented data models to improve analysis quality and support decision-making.", tags: ["SQL", "Cognos Analytics", "DataViz"] },
              ]).map(({ emoji, title, desc, tags }) => (
                <div key={title} className="bg-[#0D1117] border border-[#27272A] rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{emoji}</span>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2">{title}</h3>
                      <p className="text-[#A1A1AA] text-sm leading-relaxed mb-3">{desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {tags.map(t => (
                          <span key={t} className="px-2 py-0.5 text-xs rounded-full bg-slate-800 border border-slate-700 text-[#A1A1AA]">{t}</span>
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
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#0D1117] hover:bg-[#27272A] border border-[#27272A] flex items-center justify-center text-[#A1A1AA] hover:text-white transition font-mono">
              ✕
            </button>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🔐</span>
              <h2 className="text-3xl font-bold">{t.adminPanel.title}</h2>
            </div>
            <p className="text-[#A1A1AA] text-sm mb-8">{t.adminPanel.subtitle}</p>
            <div className="space-y-4">
              <div className="bg-[#0D1117] border border-[#27272A] rounded-lg p-6">
                <h3 className="font-bold mb-2 flex items-center gap-2"><span>📁</span> {t.adminPanel.projects}</h3>
                <p className="text-[#A1A1AA] text-sm">{t.adminPanel.projectsDesc}</p>
              </div>
              <div className="bg-[#0D1117] border border-[#27272A] rounded-lg p-6">
                <h3 className="font-bold mb-2 flex items-center gap-2"><span>💼</span> {t.adminPanel.pricing}</h3>
                <p className="text-[#A1A1AA] text-sm">{t.adminPanel.pricingDesc}</p>
              </div>
              <div className="bg-[#0D1117] border border-[#27272A] rounded-lg p-6">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#00F0FF]"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  {t.adminPanel.linkedinTitle}
                </h3>
                <p className="text-[#A1A1AA] text-sm mb-4">{t.adminPanel.linkedinDesc}</p>
                <button
                  onClick={() => { setShowAdminPanel(false); setShowLinkedInManager(true); }}
                  className="w-full px-4 py-2.5 rounded-xl core-btn bg-[#00F0FF] hover:bg-white text-black text-white font-semibold text-sm transition duration-300"
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
          <div className="relative w-full h-full max-w-[1400px] max-h-[95vh] overflow-y-auto rounded-3xl border border-[#27272A] shadow-2xl">
            <button
              onClick={() => setShowLinkedInManager(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-[#0D1117] hover:bg-[#27272A] border border-[#27272A] flex items-center justify-center text-[#A1A1AA] hover:text-white transition font-mono">
              ✕
            </button>
            <LinkedInManager onClose={() => setShowLinkedInManager(false)} />
          </div>
        </div>
      )}

      {/* Modale Vibe Coding */}
      {showVibeCoding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#030508] rounded-lg border border-[#27272A] shadow-2xl p-10">
            <button onClick={() => setShowVibeCoding(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#0D1117] hover:bg-[#27272A] border border-[#27272A] flex items-center justify-center text-[#A1A1AA] hover:text-white transition font-mono">
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
                <div key={title} className="bg-[#0D1117] border border-[#27272A] rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold">{title}</h3>
                        {available
                          ? <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/10 border border-green-500/30 text-green-400">{lang === 'en' ? 'Available' : 'Disponible'}</span>
                          : <span className="px-2 py-0.5 text-xs rounded-full bg-[#0D1117] border border-[#27272A] text-[#A1A1AA]">{lang === 'en' ? 'In progress' : 'En cours'}</span>
                        }
                      </div>
                      <p className="text-[#A1A1AA] text-sm leading-relaxed mb-3">{desc}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-slate-800 border border-slate-700 text-[#A1A1AA]">{tag}</span>
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
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[#27272A] shadow-2xl">
            <button
              onClick={() => { setShowCalculator(false); setShowVibeCoding(true); }}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-[#0D1117] hover:bg-[#27272A] border border-[#27272A] flex items-center justify-center text-[#A1A1AA] hover:text-white transition font-mono">
              ✕
            </button>
            <LifeCalculator />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-[#27272A] py-8 px-6" style={{ borderTop: '1px solid rgba(0,240,255,0.1)' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#52525b] text-[10px] font-mono uppercase tracking-widest">{t.footer.rights}</p>
          <div className="flex items-center gap-2 text-[#52525b] text-[10px] font-mono uppercase tracking-widest">
            <img src="https://flagcdn.com/20x15/mg.png" srcSet="https://flagcdn.com/40x30/mg.png 2x" width="20" height="15" alt="Madagascar" style={{ borderRadius: '2px', display: 'inline-block', verticalAlign: 'middle' }} />
            <span>{t.footer.made}</span>
          </div>
          <p className="text-[#3f3f46] text-[10px] font-mono uppercase tracking-widest">{t.footer.tech}</p>
        </div>
      </footer>
    </main>
  );
}
