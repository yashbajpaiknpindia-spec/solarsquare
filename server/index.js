import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import analyticsRouter from './routes/analytics.js';
import { initDB } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for accurate IP addresses on Render
app.set('trust proxy', 1);

app.use(express.json({ limit: '1mb' }));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : '*',
  methods: ['GET', 'POST', 'PUT'],
}));

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok', ts: Date.now() }));

// Analytics API
app.use('/api/analytics', analyticsRouter);

// Serve static files from the React build
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath, {
  maxAge: '1y',
  immutable: true,
  index: false,
  setHeaders(res, filePath) {
    // No-cache for HTML
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  },
}));

// SPA fallback — always return index.html
app.get('*', (_req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(path.join(distPath, 'index.html'));
});

async function start() {
  try {
    await initDB();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅  Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌  Failed to start server:', err);
    process.exit(1);
  }
}

start();
