// ─────────────────────────────────────────────────────────
//  StockSense AI · News Controller v4 — STRICT MODE
//  ✅ No silent fallbacks
//  ✅ LIVE / DEMO / ERROR clearly labelled
//  ✅ STRICT_MODE: API errors surface immediately
// ─────────────────────────────────────────────────────────

const { fetchStockNews }  = require('../services/newsService');
const { getStockQuote, getStockHistory } = require('../services/stockService');
const { analyzeArticles } = require('../services/sentimentService');
const { buildDemoQuote, buildDemoHistory, buildDemoArticles, buildDemoMarkets } = require('../services/demoMarketService');
const { resolveSymbol, getAutoSuggestions } = require('../data/stockList');

// ── STRICT MODE flag ──────────────────────────────────────
// When true: if API keys exist but call fails → return error (NO silent demo fallback)
// When false: on API failure → fallback to demo
const STRICT_MODE = true; // API fail = clear error shown. No silent fake data fallback.

const cache = new Map();
const inFlightRequests = new Map();
const CACHE_TTL_MS = 60 * 1000;  // 1 minute

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL_MS) { cache.delete(key); return null; }
  return entry.data;
}
function setCache(key, data) {
  cache.set(key, { data, ts: Date.now() });
}

// ─── resolveSymbol replaces old KNOWN_STOCKS map ─────────
// See server/data/stockList.js for full 150+ stock database

// ─── Map internal errors to response objects ──────────────
function mapErrorToResponse(error) {
  const msg   = error?.message || '';
  const pubMsg = error?.publicMessage || msg || 'Something went wrong. Check your API keys.';

  if (msg === 'RATE_LIMIT')    return { status: 429, dataMode: 'rate-limit', message: 'NewsAPI rate limit reached. Retry in 60 seconds.' };
  if (msg === 'MISSING_KEY')   return { status: 400, dataMode: 'key-missing', message: 'API Key Missing' };
  if (msg === 'AUTH_FAILED')   return { status: 401, dataMode: 'api-error',  message: 'API authentication failed — check your NEWS_API_KEY.' };
  if (msg === 'NETWORK_ERROR') return { status: 503, dataMode: 'api-error',  message: pubMsg };
  if (
    msg.startsWith('No relevant') ||
    msg.startsWith('No relevant articles') ||
    msg.startsWith('No relevant news')
  ) return { status: 404, dataMode: 'no-data', message: pubMsg };

  // Generic fallback — always returns api-error, never server-error
  return {
    status: 502,
    dataMode: 'api-error',
    message: pubMsg,
  };
}

// ─── Build LIVE payload ───────────────────────────────────
async function buildLivePayload(resolvedSymbol, resolvedName, newsApiKey, stockApiKey) {
  // Fetch news using the company name (better results)
  let articles;
  try {
    articles = await fetchStockNews(resolvedName, newsApiKey);
  } catch (err) {
    // Re-throw so caller handles it
    throw err;
  }

  if (!articles || articles.length === 0) {
    const noData = new Error('No relevant news found for ' + resolvedName);
    noData.publicMessage = 'No relevant news found for ' + resolvedName;
    throw noData;
  }

  // Fetch stock quote & history using the symbol (required)
  let stockData = null;
  let priceHistory = null;

  try {
    stockData = await getStockQuote(resolvedSymbol, stockApiKey);
  } catch (err) {
    console.warn(`⚠️  Stock quote failed for "${resolvedSymbol}":`, err.message);
    // Non-fatal: continue with news + sentiment only
  }

  if (stockData?.symbol) {
    try {
      priceHistory = await getStockHistory(stockData.symbol, stockApiKey);
    } catch (err) {
      console.warn(`⚠️  Price history failed for "${stockData.symbol}":`, err.message);
    }
  }

  const sentimentResult = analyzeArticles(articles, resolvedName);

  return {
    success: true,
    query: resolvedName,
    dataSource: 'LIVE',
    dataMode: 'live',
    liveNews: true,
    liveStock: !!stockData,
    stockData: stockData || null,
    priceHistory: priceHistory || null,
    sentiment: sentimentResult,
    articles: sentimentResult.analyzedArticles || articles,
    articleCount: articles.length,
    timestamp: new Date().toISOString(),
  };
}

// ─── Build DEMO payload ───────────────────────────────────
function buildDemoPayload(sanitizedQuery) {
  const articles = buildDemoArticles(sanitizedQuery);
  const sentimentResult = analyzeArticles(articles, sanitizedQuery);
  const stockData = buildDemoQuote(sanitizedQuery);
  const priceHistory = buildDemoHistory(stockData.symbol);
  return {
    success: true,
    query: sanitizedQuery,
    dataSource: 'DEMO',
    dataMode: 'demo',
    liveNews: false,
    liveStock: false,
    stockData,
    priceHistory,
    sentiment: sentimentResult,
    articles: sentimentResult.analyzedArticles || articles,
    articleCount: articles.length,
    timestamp: new Date().toISOString(),
  };
}

// ─── GET /api/markets ─────────────────────────────────────
async function getMarketSnapshot(req, res) {
  const requestedMode = String(req.query?.mode || 'live').toLowerCase();

  if (requestedMode === 'demo') {
    return res.status(200).json({
      success: true,
      dataMode: 'demo',
      dataSource: 'DEMO',
      markets: buildDemoMarkets(),
      partial: false,
      timestamp: new Date().toISOString(),
    });
  }

  const stockApiKey = process.env.FINNHUB_API_KEY || process.env.STOCK_API_KEY;
  const hasStockKey = stockApiKey && stockApiKey !== 'your_key_here' && stockApiKey.length > 5;

  if (!hasStockKey) {
    // STRICT: no key → return error, do NOT silently show demo
    return res.status(400).json({
      success: false,
      dataMode: 'key-missing',
      dataSource: 'KEY_MISSING',
      message: 'STOCK_API_KEY is not configured. Set it in server/.env to get live market data.',
      key: 'FINNHUB_API_KEY',
    });
  }

  const cacheKey = 'markets:snapshot';
  const cached = getCached(cacheKey);
  if (cached) return res.status(200).json({ success: true, dataMode: 'live', dataSource: 'LIVE', markets: cached });

  const symbols = ['SPY', 'QQQ', 'DIA', 'IWM'];
  try {
    const settled = await Promise.allSettled(
      symbols.map((symbol) => getStockQuote(symbol, stockApiKey))
    );
    const markets = settled
      .filter((e) => e.status === 'fulfilled')
      .map((e) => e.value);

    if (!markets.length) {
      const firstError = settled.find((e) => e.status === 'rejected');
      throw (firstError ? firstError.reason : new Error('API_ERROR'));
    }

    setCache(cacheKey, markets);
    return res.status(200).json({
      success: true,
      dataMode: 'live',
      dataSource: 'LIVE',
      markets,
      partial: markets.length < symbols.length,
    });
  } catch (error) {
    const mapped = mapErrorToResponse(error);
    return res.status(mapped.status).json({
      success: false,
      dataMode: mapped.dataMode,
      dataSource: 'API_ERROR',
      message: mapped.message,
    });
  }
}

// ─── POST /api/analyze ────────────────────────────────────
async function analyzeStock(req, res) {
  try {
    const { query, mode } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({ success: false, message: 'Stock query is required' });
    }

    const sanitizedQuery = query.trim().substring(0, 80);
    const requestedMode  = String(mode || 'live').toLowerCase();

    // ── Explicit DEMO mode request ────────────────────────
    if (requestedMode === 'demo') {
      const payload = buildDemoPayload(sanitizedQuery);
      return res.status(200).json(payload);
    }

    // ── Resolve stock symbol from name or ticker ─────────
    const resolved = resolveSymbol(sanitizedQuery);
    if (!resolved) {
      console.log(`❌ Unknown stock query: "${sanitizedQuery}"`);
      return res.status(400).json({
        success:    false,
        dataSource: 'INVALID_QUERY',
        dataMode:   'invalid-query',
        query:      sanitizedQuery,
        notFound:   true,
        message:    `"${sanitizedQuery}" is not a recognized stock or company. Try: "Tesla", "Infosys", "Apple", "Bitcoin".`,
      });
    }

    const resolvedSymbol = resolved.symbol;  // e.g. "INFY.NS"
    const resolvedName   = resolved.name;    // e.g. "Infosys"
    console.log(`✅ Resolved: "${sanitizedQuery}" → ${resolvedSymbol} (${resolvedName})`);

    const newsApiKey  = process.env.NEWS_API_KEY || "820c22559f3945b7a51feca92a1df50d";
    const stockApiKey = process.env.FINNHUB_API_KEY || process.env.STOCK_API_KEY || "51ZZBUFL7Q681K8C";

    const hasNewsKey  = newsApiKey  && newsApiKey  !== 'your_key_here' && newsApiKey.length  > 5;
    const hasStockKey = stockApiKey && stockApiKey !== 'your_key_here' && stockApiKey.length > 5;

    // ── SMART FALLBACK LOGIC ──────────────────────────────
    // IF API keys missing → use DEMO (never silently)
    if (!hasNewsKey) {
      const missingKey = 'NEWS_API_KEY';
      return res.status(400).json({
        success:      false,
        dataSource:   'KEY_MISSING',
        dataMode:     'key-missing',
        key:          missingKey,
        query:        sanitizedQuery,
        message:      'NEWS_API_KEY is not configured.',
        instructions: 'Get a free key at https://newsapi.org/register and add it to server/.env',
      });
    }
    if (!hasStockKey) {
      const missingKey = 'FINNHUB_API_KEY';
      return res.status(400).json({
        success:      false,
        dataSource:   'KEY_MISSING',
        dataMode:     'key-missing',
        key:          missingKey,
        query:        sanitizedQuery,
        message:      'FINNHUB_API_KEY (stock price key) is not configured.',
        instructions: 'Get a free key at https://finnhub.io and add it to server/.env',
      });
    }

    // ── Check cache (keyed on resolved symbol) ────────────
    const cacheKey = `analysis:${resolvedSymbol.toLowerCase()}`;
    const cachedResponse = getCached(cacheKey);
    if (cachedResponse) {
      return res.status(200).json({ ...cachedResponse, cached: true });
    }

    // ── Deduplicate in-flight requests ────────────────────
    if (!inFlightRequests.has(cacheKey)) {
      inFlightRequests.set(
        cacheKey,
        buildLivePayload(resolvedSymbol, resolvedName, newsApiKey, stockApiKey)
          .then((payload) => {
            const enriched = { ...payload, resolvedSymbol, resolvedName };
            setCache(cacheKey, enriched);
            return enriched;
          })
          .finally(() => inFlightRequests.delete(cacheKey))
      );
    }


    try {
      const response = await inFlightRequests.get(cacheKey);
      return res.status(200).json(response);

    } catch (error) {
      // ── STRICT MODE: keys exist but API failed → error ──
      if (STRICT_MODE) {
        console.error(`❌ STRICT MODE: Live API failed for "${sanitizedQuery}":`, error.message);
        const mapped = mapErrorToResponse(error);
        return res.status(mapped.status).json({
          success:    false,
          dataSource: 'API_ERROR',
          dataMode:   mapped.dataMode,
          query:      sanitizedQuery,
          message:    mapped.message,
          strictMode: true,
        });
      } else {
        // Non-strict: fallback to demo (labelled clearly)
        console.warn(`⚠️  Non-strict fallback to DEMO for "${sanitizedQuery}":`, error.message);
        const payload = buildDemoPayload(sanitizedQuery);
        return res.status(200).json({
          ...payload,
          fallbackReason: error.message,
        });
      }
    }

  } catch (error) {
    console.error('❌ Unexpected controller error:', error);
    return res.status(500).json({
      success:    false,
      dataSource: 'SERVER_ERROR',
      dataMode:   'server-error',
      message:    'Internal server error. Please try again.',
    });
  }
}

// ─── GET /api/suggestions?q=tesla ────────────────────────
function getSuggestions(req, res) {
  const q = String(req.query?.q || '').trim();
  if (!q) return res.status(200).json({ suggestions: [] });
  const suggestions = getAutoSuggestions(q, 8).map(s => ({
    name:     s.name,
    symbol:   s.symbol,
    exchange: s.exchange,
  }));
  return res.status(200).json({ suggestions });
}

module.exports = { analyzeStock, getMarketSnapshot, getSuggestions };
