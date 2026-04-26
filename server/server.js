const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const newsRoutes = require('./routes/newsRoutes');

dotenv.config();

// Fix for SSL errors with external APIs
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const app = express();
const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === 'production';

// ── In production, serve static files FIRST (before any CORS or middleware) ──
// This ensures JS/CSS assets are NEVER blocked by CORS origin checks.
if (isProd) {
  const dist = path.join(__dirname, 'public');
  const distAlt = path.join(__dirname, '..', 'client', 'dist');

  const serveDir = fs.existsSync(path.join(dist, 'index.html')) ? dist
                 : fs.existsSync(path.join(distAlt, 'index.html')) ? distAlt
                 : dist;

  console.log(`📁 Serving static from: ${serveDir}`);
  try { console.log(`📂 Contents: ${fs.readdirSync(serveDir).join(', ')}`); } catch(e) { console.error(`❌ ${e.message}`); }

  // Serve all static assets (JS, CSS, images) with no CORS restriction
  app.use(express.static(serveDir, { maxAge: '1d' }));

  // SPA fallback — for any non-API route, serve index.html
  app.get(/^(?!\/api).*$/, (req, res) => {
    const indexPath = path.join(serveDir, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(503).send(`
        <div style="font-family:sans-serif;padding:40px;text-align:center">
          <h1 style="color:#e11d48">Build files missing</h1>
          <p>Looked in: <code>${serveDir}</code></p>
        </div>`);
    }
  });
}

// ── CORS — only applies to /api routes ──
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://stocksense-ai-r24w.onrender.com',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use('/api', cors({
  origin(origin, callback) {
    // Allow no-origin requests (curl, server-to-server) and whitelisted origins
    if (!origin || allowedOrigins.some(o => origin.startsWith(o))) return callback(null, true);
    return callback(new Error('CORS blocked: ' + origin));
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ── API Routes ──
app.use('/api', newsRoutes);

app.get('/api/status', (req, res) => {
  res.json({
    status: 'OK',
    service: 'StockSense AI',
    version: '3.0.0',
    newsApi:  process.env.NEWS_API_KEY  ? 'configured' : 'missing',
    stockApi: (process.env.FINNHUB_API_KEY || process.env.STOCK_API_KEY) ? 'configured' : 'missing',
    timestamp: new Date().toISOString(),
  });
});

// ── Dev: root route ──
if (!isProd) {
  app.get('/', (req, res) => res.json({ status: 'OK', frontend: 'http://localhost:3000' }));
}

app.use((req, res) => res.status(404).json({ success: false, message: 'Not found' }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: err.message });
});

app.listen(PORT, () => {
  console.log(`\n🚀 StockSense AI running on port ${PORT}`);
  console.log(`🔑 News API:  ${process.env.NEWS_API_KEY ? '✅' : '❌ Missing'}`);
  console.log(`📈 Stock API: ${(process.env.FINNHUB_API_KEY || process.env.STOCK_API_KEY) ? '✅' : '❌ Missing'}\n`);
});
