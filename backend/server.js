import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'portfolio_jwt_secret_changez_en_prod';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'Portfolio@2024', 10);

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST'],
}));
app.use(express.json({ limit: '100kb' }));

app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Données invalides.' });
  }
  if (username.length > 100 || password.length > 200) {
    return res.status(400).json({ error: 'Données trop longues.' });
  }
  if (username !== ADMIN_USERNAME || !bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)) {
    return res.status(401).json({ error: 'Identifiants incorrects.' });
  }
  const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '2h' });
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

app.post('/api/claude', async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY non configurée. Ajoutez-la dans backend/.env' });
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
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── NOTION ────────────────────────────────────────────────────────────────────
const NOTION_API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

function notionHeaders() {
  return {
    'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
    'Content-Type': 'application/json',
    'Notion-Version': NOTION_VERSION,
  };
}

app.get('/api/notion/status', async (req, res) => {
  const token = process.env.NOTION_TOKEN;
  const dbId = process.env.NOTION_DATABASE_ID;
  if (!token) return res.json({ configured: false, reason: 'no_token' });
  if (!dbId) return res.json({ configured: false, reason: 'no_db_id' });
  try {
    const r = await fetch(`${NOTION_API}/databases/${dbId}`, { headers: notionHeaders() });
    if (!r.ok) return res.json({ configured: false, reason: 'db_not_found' });
    const db = await r.json();
    res.json({ configured: true, dbId, dbUrl: db.url, dbTitle: db.title?.[0]?.plain_text });
  } catch (e) {
    res.json({ configured: false, reason: e.message });
  }
});

app.post('/api/notion/create-db', async (req, res) => {
  const token = process.env.NOTION_TOKEN;
  if (!token) return res.status(500).json({ error: 'NOTION_TOKEN non configuré dans backend/.env' });
  const { parentPageId } = req.body || {};
  if (!parentPageId) return res.status(400).json({ error: 'parentPageId requis' });
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
    if (!r.ok) return res.status(r.status).json({ error: data.message || 'Erreur Notion' });
    res.json({ dbId: data.id, dbUrl: data.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/notion/save-post', async (req, res) => {
  const token = process.env.NOTION_TOKEN;
  if (!token) return res.status(500).json({ error: 'NOTION_TOKEN non configuré dans backend/.env' });
  const { content, status, date, tone, postType, hashtags, dbId } = req.body || {};
  const effectiveDbId = dbId || process.env.NOTION_DATABASE_ID;
  if (!effectiveDbId) return res.status(500).json({ error: 'Base Notion non configurée. Initialisez-la d\'abord.' });
  if (!content) return res.status(400).json({ error: 'content requis' });
  try {
    const firstLine = content.split('\n')[0].replace(/[\u{1F300}-\u{1FAFF}]/gu, '').trim().slice(0, 100) || 'Post LinkedIn';
    const props = {
      'Nom':    { title: [{ text: { content: firstLine } }] },
      'Statut': { select: { name: status === 'published' ? 'Publié' : status === 'scheduled' ? 'Planifié' : 'Brouillon' } },
    };
    if (date) {
      const iso = date.replace(' ', 'T');
      props['Date'] = { date: { start: iso.length >= 16 ? iso.slice(0, 16) : iso } };
    }
    if (tone) props['Ton'] = { select: { name: tone } };
    if (postType) props['Type'] = { select: { name: postType } };
    if (hashtags?.length) {
      const tagText = hashtags.map(h => '#' + h.replace(/^#/, '')).join(' ');
      props['Hashtags'] = { rich_text: [{ text: { content: tagText.slice(0, 2000) } }] };
    }
    const r = await fetch(`${NOTION_API}/pages`, {
      method: 'POST',
      headers: notionHeaders(),
      body: JSON.stringify({ parent: { database_id: effectiveDbId }, properties: props }),
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data.message || 'Erreur Notion' });
    res.json({ notionId: data.id, notionUrl: data.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
