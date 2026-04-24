const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const newsRoutes = require('./routes/newsRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === 'production';
const clientUrl = process.env.CLIENT_URL;
const allowedOrigins = [clientUrl, 'http://localhost:3000', 'http://localhost:5173'].filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('CORS blocked'));
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// API routes FIRST
app.use('/api', newsRoutes);

// API status
app.get('/api/status', (req, res) => {
  res.json({
    status: 'OK',
    service: 'StockSense AI',
    version: '2.0.0',
    newsApi:  process.env.NEWS_API_KEY  ? 'configured' : 'missing',
    stockApi: (process.env.FINNHUB_API_KEY || process.env.STOCK_API_KEY) ? 'configured' : 'missing',
    timestamp: new Date().toISOString(),
  });
});

// Serve React build in production
if (isProd) {
  const dist = path.join(__dirname, '../client/dist');
  app.use(express.static(dist, { maxAge: '1d' }));
  app.get('*', (req, res) => {
    const fs = require('fs');
    const indexPath = path.join(dist, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send(`
        <div style="font-family:sans-serif; padding: 40px; text-align: center;">
          <h1 style="color: #e11d48;">UI Not Built Properly</h1>
          <p>The backend is running, but the React frontend files are missing at <code>${dist}</code>.</p>
          <p>Please check your Render build commands.</p>
        </div>
      `);
    }
  });
} else {
  app.get('/', (req, res) => res.json({ status: 'OK', frontend: 'http://localhost:3000' }));
}

app.use((req, res) => res.status(404).json({ success: false, message: 'Not found' }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: err.message });
});

app.listen(PORT, () => {
  const newsApi = process.env.NEWS_API_KEY || "820c22559f3945b7a51feca92a1df50d";
  const stockApi = process.env.FINNHUB_API_KEY || process.env.STOCK_API_KEY || "51ZZBUFL7Q681K8C";
  console.log(`\n🚀 StockSense AI running on port ${PORT}`);
  console.log(`🔑 News API:  ${newsApi ? '✅ Configured' : '❌ Missing'}`);
  console.log(`📈 Stock API: ${stockApi ? '✅ Configured' : '❌ Missing'}\n`);
});
