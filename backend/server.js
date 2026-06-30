import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// ── Validation des variables d'environnement obligatoires ─────────────────────
const IS_PROD = process.env.NODE_ENV === 'production';
if (IS_PROD) {
  const required = ['JWT_SECRET', 'ADMIN_PASSWORD', 'ADMIN_USERNAME', 'FRONTEND_URL'];
  for (const key of required) {
    if (!process.env[key]) {
      console.error(`FATAL: variable d'environnement manquante: ${key}`);
      process.exit(1);
    }
  }
  if ((process.env.JWT_SECRET || '').length < 32) {
    console.error('FATAL: JWT_SECRET trop court (minimum 32 caractères).');
    process.exit(1);
  }
}

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;

if (!JWT_SECRET || !ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
  console.error('FATAL: JWT_SECRET, ADMIN_USERNAME et ADMIN_PASSWORD sont requis.');
  process.exit(1);
}

let ADMIN_PASSWORD_HASH; // initialisé dans startServer() — bcrypt async, non bloquant

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

const app = express();

// ── Sécurité HTTP headers ─────────────────────────────────────────────────────
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false,
}));

// ── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: (origin, cb) => {
    // En dev, autorise les requêtes sans Origin (ex: curl local)
    if (!origin && !IS_PROD) return cb(null, true);
    if (origin && ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    cb(new Error('CORS: origine non autorisée'));
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '100kb' }));

// ── Rate limiting login (anti brute-force) ───────────────────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { error: 'Trop de tentatives. Réessayez dans 15 minutes.' },
});

// ── Middleware d'authentification JWT ────────────────────────────────────────
function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Non autorisé.' });
  }
  try {
    jwt.verify(auth.slice(7), JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token invalide ou expiré.' });
  }
}

// ── Auth ─────────────────────────────────────────────────────────────────────
app.post('/api/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body || {};
  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Données invalides.' });
  }
  if (username.length > 100 || password.length > 200) {
    return res.status(400).json({ error: 'Données invalides.' });
  }
  const userMatch = username === ADMIN_USERNAME;
  const passMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  if (!userMatch || !passMatch) {
    return res.status(401).json({ error: 'Identifiants incorrects.' });
  }
  const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '4h' });
  res.json({ token });
});

app.get('/api/verify', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ valid: false });
  }
  try {
    const payload = jwt.verify(auth.slice(7), JWT_SECRET);
    res.json({ valid: true, role: payload.role });
  } catch {
    res.status(401).json({ valid: false });
  }
});

// ── Claude (proxy Anthropic) — authentification requise ──────────────────────
const ALLOWED_CLAUDE_MODELS = [
  'claude-haiku-4-5-20251001',
  'claude-sonnet-4-6',
  'claude-opus-4-8',
];

app.post('/api/claude', requireAuth, async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'Service non configuré.' });
  }
  const { model, messages, max_tokens } = req.body || {};
  if (!model || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Corps de requête invalide.' });
  }
  if (!ALLOWED_CLAUDE_MODELS.includes(model)) {
    return res.status(400).json({ error: 'Modèle non autorisé.' });
  }
  if (max_tokens && (typeof max_tokens !== 'number' || max_tokens > 8192)) {
    return res.status(400).json({ error: 'max_tokens invalide (max 8192).' });
  }
  try {
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    };
    if (req.body.mcp_servers) {
      headers['anthropic-beta'] = 'mcp-client-2025-04-04';
    }
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers,
      body: JSON.stringify(req.body),
    });
    const data = await anthropicRes.json();
    res.status(anthropicRes.status).json(data);
  } catch {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ── Notion — authentification requise ────────────────────────────────────────
const NOTION_API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

function notionHeaders() {
  return {
    'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
    'Content-Type': 'application/json',
    'Notion-Version': NOTION_VERSION,
  };
}

app.get('/api/notion/status', requireAuth, async (req, res) => {
  const token = process.env.NOTION_TOKEN;
  const dbId = process.env.NOTION_DATABASE_ID;
  if (!token) return res.json({ configured: false, reason: 'no_token' });
  if (!dbId) return res.json({ configured: false, reason: 'no_db_id' });
  try {
    const r = await fetch(`${NOTION_API}/databases/${dbId}`, { headers: notionHeaders() });
    if (!r.ok) return res.json({ configured: false, reason: 'db_not_found' });
    const db = await r.json();
    res.json({ configured: true, dbId, dbUrl: db.url, dbTitle: db.title?.[0]?.plain_text });
  } catch {
    res.json({ configured: false, reason: 'error' });
  }
});

app.post('/api/notion/create-db', requireAuth, async (req, res) => {
  const token = process.env.NOTION_TOKEN;
  if (!token) return res.status(503).json({ error: 'Service non configuré.' });
  const { parentPageId } = req.body || {};
  if (!parentPageId || typeof parentPageId !== 'string' || !/^[a-f0-9-]{32,36}$/i.test(parentPageId.replace(/-/g, ''))) {
    return res.status(400).json({ error: 'parentPageId invalide.' });
  }
  try {
    const r = await fetch(`${NOTION_API}/databases`, {
      method: 'POST',
      headers: notionHeaders(),
      body: JSON.stringify({
        parent: { type: 'page_id', page_id: parentPageId },
        title: [{ type: 'text', text: { content: 'LinkedIn Posts Manager' } }],
        properties: {
          'Titre':        { title: {} },
          'Contenu':      { rich_text: {} },
          'Statut':       { select: { options: [
            { name: 'Brouillon', color: 'gray' },
            { name: 'Planifié',  color: 'yellow' },
            { name: 'Publié',    color: 'green' },
          ]}},
          'Date':         { date: {} },
          'Ton':          { select: { options: [
            { name: 'Professionnel', color: 'blue' },
            { name: 'Inspirant',     color: 'orange' },
            { name: 'Éducatif',      color: 'purple' },
            { name: 'Storytelling',  color: 'pink' },
            { name: 'Engageant',     color: 'red' },
          ]}},
          'Type':         { select: { options: [
            { name: 'Article',      color: 'blue' },
            { name: 'Conseil',      color: 'green' },
            { name: 'Étude de cas', color: 'yellow' },
            { name: 'Annonce',      color: 'orange' },
            { name: 'Opinion',      color: 'purple' },
          ]}},
          'Hashtags':     { multi_select: {} },
          'Likes':        { number: {} },
          'Commentaires': { number: {} },
        },
      }),
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: 'Erreur Notion.' });
    res.json({ dbId: data.id, dbUrl: data.url });
  } catch {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

app.post('/api/notion/save-post', requireAuth, async (req, res) => {
  const token = process.env.NOTION_TOKEN;
  if (!token) return res.status(503).json({ error: 'Service non configuré.' });
  const { content, status, date, tone, postType, hashtags, dbId } = req.body || {};
  const effectiveDbId = dbId || process.env.NOTION_DATABASE_ID;
  if (!effectiveDbId) return res.status(400).json({ error: 'Base Notion non configurée.' });
  if (!content || typeof content !== 'string') return res.status(400).json({ error: 'content requis.' });
  if (content.length > 10000) return res.status(400).json({ error: 'Contenu trop long.' });
  try {
    const firstLine = content.split('\n')[0].replace(/[\u{1F300}-\u{1FAFF}]/gu, '').trim().slice(0, 100) || 'Post LinkedIn';
    const props = {
      'Nom':    { title: [{ text: { content: firstLine } }] },
      'Statut': { select: { name: status === 'published' ? 'Publié' : status === 'scheduled' ? 'Planifié' : 'Brouillon' } },
    };
    if (date && typeof date === 'string') {
      const iso = date.replace(' ', 'T');
      props['Date'] = { date: { start: iso.length >= 16 ? iso.slice(0, 16) : iso } };
    }
    if (tone && typeof tone === 'string') props['Ton'] = { select: { name: tone.slice(0, 50) } };
    if (postType && typeof postType === 'string') props['Type'] = { select: { name: postType.slice(0, 50) } };
    if (Array.isArray(hashtags) && hashtags.length) {
      const tagText = hashtags.map(h => '#' + String(h).replace(/^#/, '')).join(' ');
      props['Hashtags'] = { rich_text: [{ text: { content: tagText.slice(0, 2000) } }] };
    }
    const r = await fetch(`${NOTION_API}/pages`, {
      method: 'POST',
      headers: notionHeaders(),
      body: JSON.stringify({ parent: { database_id: effectiveDbId }, properties: props }),
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: 'Erreur Notion.' });
    res.json({ notionId: data.id, notionUrl: data.url });
  } catch {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

async function startServer() {
  try {
    ADMIN_PASSWORD_HASH = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT} [${IS_PROD ? 'production' : 'development'}]`);
    });
  } catch (err) {
    console.error('FATAL: Impossible de démarrer le serveur.', err.message);
    process.exit(1);
  }
}
startServer();
