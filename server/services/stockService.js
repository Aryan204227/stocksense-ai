const axios = require('axios');

const FINNHUB_BASE = 'https://finnhub.io/api/v1';
const ALPHA_BASE = 'https://www.alphavantage.co/query';
const YAHOO_QUOTE_BASE = 'https://query1.finance.yahoo.com/v7/finance/quote';
const YAHOO_CHART_BASE = 'https://query1.finance.yahoo.com/v8/finance/chart';
const STOOQ_DAILY = 'https://stooq.com/q/d/l/';
const SYMBOL_MAP = {
  apple: 'AAPL',
  tesla: 'TSLA',
  microsoft: 'MSFT',
  google: 'GOOGL',
  alphabet: 'GOOGL',
  amazon: 'AMZN',
  nvidia: 'NVDA',
  meta: 'META',
  facebook: 'META',
  netflix: 'NFLX',
  bitcoin: 'BINANCE:BTCUSDT',
  ethereum: 'BINANCE:ETHUSDT',
};

function normalizeApiError(error, fallbackMessage) {
  if (error?.response?.status === 429) {
    const rateLimitError = new Error('RATE_LIMIT');
    rateLimitError.publicMessage = 'API limit reached, retry in 60 seconds';
    return rateLimitError;
  }
  if (error?.response?.status === 401 || error?.response?.status === 403) {
    const authError = new Error('AUTH_FAILED');
    authError.publicMessage = 'Unable to fetch data';
    return authError;
  }
  const genericError = new Error(fallbackMessage || 'API_ERROR');
  genericError.publicMessage = 'Unable to fetch data';
  return genericError;
}

async function resolveSymbol(query, apiKey) {
  const normalized = query.trim();
  const byMap = SYMBOL_MAP[normalized.toLowerCase()];
  if (byMap) return byMap;

  const directTicker = normalized.toUpperCase();
  if (/^[A-Z.\-:]{1,15}$/.test(directTicker)) return directTicker;

  try {
    const response = await axios.get(`${FINNHUB_BASE}/search`, {
      params: { q: normalized, token: apiKey },
      timeout: 10000,
    });
    const result = response?.data?.result || [];
    const match = result.find((item) => item.type === 'Common Stock') || result[0];
    if (!match?.symbol) {
      const invalid = new Error('INVALID_SYMBOL');
      invalid.publicMessage = 'Unable to fetch data';
      throw invalid;
    }
    return match.symbol;
  } catch (error) {
    throw normalizeApiError(error, 'SYMBOL_LOOKUP_FAILED');
  }
}

function looksLikeAlphaVantageKey(apiKey) {
  return /^[A-Z0-9]{12,20}$/.test((apiKey || '').trim());
}

async function resolveSymbolAlpha(query, apiKey) {
  const normalized = query.trim();
  const byMap = SYMBOL_MAP[normalized.toLowerCase()];
  if (byMap) return byMap.includes(':') ? byMap.split(':').pop().replace('USDT', '') : byMap;

  const directTicker = normalized.toUpperCase();
  if (/^[A-Z.\-]{1,10}$/.test(directTicker)) return directTicker;

  try {
    const response = await axios.get(ALPHA_BASE, {
      params: {
        function: 'SYMBOL_SEARCH',
        keywords: normalized,
        apikey: apiKey,
      },
      timeout: 12000,
    });

    const note = response?.data?.Note || response?.data?.Information;
    if (note && /rate limit|call frequency/i.test(note)) {
      const rateLimit = new Error('RATE_LIMIT');
      rateLimit.publicMessage = 'API limit reached, retry in 60 seconds';
      throw rateLimit;
    }

    const matches = response?.data?.bestMatches || [];
    const firstUs = matches.find((m) => (m['4. region'] || '').toUpperCase().includes('UNITED STATES')) || matches[0];
    const symbol = firstUs?.['1. symbol'];
    if (!symbol) {
      const invalid = new Error('INVALID_SYMBOL');
      invalid.publicMessage = 'Unable to fetch data';
      throw invalid;
    }
    return symbol;
  } catch (error) {
    if (error.message === 'RATE_LIMIT') throw error;
    const generic = new Error('SYMBOL_LOOKUP_FAILED');
    generic.publicMessage = 'Unable to fetch data';
    throw generic;
  }
}

async function getStockQuoteFromAlpha(query, apiKey) {
  const symbol = await resolveSymbolAlpha(query, apiKey);
  let quoteRes;
  try {
    quoteRes = await axios.get(ALPHA_BASE, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol,
        apikey: apiKey,
      },
      timeout: 12000,
    });
  } catch (error) {
    throw normalizeApiError(error, 'QUOTE_FAILED');
  }

  const note = quoteRes?.data?.Note || quoteRes?.data?.Information;
  if (note && /rate limit|call frequency/i.test(note)) {
    const rateLimit = new Error('RATE_LIMIT');
    rateLimit.publicMessage = 'API limit reached, retry in 60 seconds';
    throw rateLimit;
  }

  const quote = quoteRes?.data?.['Global Quote'] || {};
  const price = Number(quote['05. price'] || 0);
  if (!price || price <= 0) {
    const invalid = new Error('INVALID_QUOTE');
    invalid.publicMessage = 'Unable to fetch data';
    throw invalid;
  }

  const change = Number(quote['09. change'] || 0);
  const changePercent = Number(String(quote['10. change percent'] || '0').replace('%', '')) || 0;

  return {
    symbol,
    name: symbol,
    price: Number(price.toFixed(2)),
    currency: 'USD',
    change: Number(change.toFixed(2)),
    changePercent: Number(changePercent.toFixed(2)),
    open: Number(Number(quote['02. open'] || 0).toFixed(2)),
    high: Number(Number(quote['03. high'] || 0).toFixed(2)),
    low: Number(Number(quote['04. low'] || 0).toFixed(2)),
    prevClose: Number(Number(quote['08. previous close'] || 0).toFixed(2)),
    trend: change >= 0 ? 'up' : 'down',
  };
}

async function getStockHistoryFromAlpha(symbol, apiKey) {
  let historyRes;
  try {
    historyRes = await axios.get(ALPHA_BASE, {
      params: {
        function: 'TIME_SERIES_DAILY_ADJUSTED',
        symbol,
        outputsize: 'compact',
        apikey: apiKey,
      },
      timeout: 12000,
    });
  } catch (error) {
    throw normalizeApiError(error, 'HISTORY_FAILED');
  }

  const note = historyRes?.data?.Note || historyRes?.data?.Information;
  if (note && /rate limit|call frequency/i.test(note)) {
    const rateLimit = new Error('RATE_LIMIT');
    rateLimit.publicMessage = 'API limit reached, retry in 60 seconds';
    throw rateLimit;
  }

  const series = historyRes?.data?.['Time Series (Daily)'] || {};
  const dates = Object.keys(series).sort((a, b) => new Date(a) - new Date(b)).slice(-30);
  const points = dates.map((date) => {
    const close = Number(series[date]?.['4. close'] || 0);
    return {
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: Number(close.toFixed(2)),
      volume: Number(series[date]?.['6. volume'] || 0),
    };
  }).filter((item) => item.price > 0);

  if (points.length < 2) {
    const noData = new Error('HISTORY_UNAVAILABLE');
    noData.publicMessage = 'Unable to fetch data';
    throw noData;
  }

  return points;
}

async function getStockQuoteFromYahoo(queryOrSymbol) {
  const symbol = (SYMBOL_MAP[queryOrSymbol.toLowerCase()] || queryOrSymbol).toUpperCase();
  const response = await axios.get(YAHOO_QUOTE_BASE, {
    params: { symbols: symbol },
    timeout: 12000,
  });
  const item = response?.data?.quoteResponse?.result?.[0];
  if (!item?.regularMarketPrice) {
    const err = new Error('YAHOO_QUOTE_FAILED');
    err.publicMessage = 'Unable to fetch data';
    throw err;
  }
  const change = Number(item.regularMarketChange || 0);
  const changePercent = Number(item.regularMarketChangePercent || 0);
  return {
    symbol: item.symbol || symbol,
    name: item.longName || item.shortName || item.symbol || symbol,
    price: Number(Number(item.regularMarketPrice).toFixed(2)),
    currency: item.currency || 'USD',
    change: Number(change.toFixed(2)),
    changePercent: Number(changePercent.toFixed(2)),
    open: Number(Number(item.regularMarketOpen || 0).toFixed(2)),
    high: Number(Number(item.regularMarketDayHigh || 0).toFixed(2)),
    low: Number(Number(item.regularMarketDayLow || 0).toFixed(2)),
    prevClose: Number(Number(item.regularMarketPreviousClose || 0).toFixed(2)),
    trend: change >= 0 ? 'up' : 'down',
  };
}

async function getStockHistoryFromYahoo(symbol) {
  const response = await axios.get(`${YAHOO_CHART_BASE}/${encodeURIComponent(symbol)}`, {
    params: { range: '1mo', interval: '1d' },
    timeout: 12000,
  });
  const result = response?.data?.chart?.result?.[0];
  const timestamps = result?.timestamp || [];
  const closes = result?.indicators?.quote?.[0]?.close || [];
  const volumes = result?.indicators?.quote?.[0]?.volume || [];
  const points = timestamps
    .map((ts, i) => ({
      date: new Date(ts * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: Number(Number(closes[i] || 0).toFixed(2)),
      volume: Number(volumes[i] || 0),
    }))
    .filter((p) => p.price > 0);

  if (points.length < 2) {
    const err = new Error('YAHOO_HISTORY_FAILED');
    err.publicMessage = 'Unable to fetch data';
    throw err;
  }
  return points;
}

function toStooqSymbol(symbolOrQuery) {
  const raw = (symbolOrQuery || '').toLowerCase().replace(/[^a-z0-9.:-]/g, '');
  if (raw === 'binance:btcusdt' || raw === 'btc') return 'btc.v';
  if (raw === 'binance:ethusdt' || raw === 'eth') return 'eth.v';
  if (raw.includes('.us') || raw.includes('.v')) return raw;
  return `${raw}.us`;
}

function parseCsvRows(csvText) {
  const lines = String(csvText || '').trim().split(/\r?\n/);
  if (lines.length < 3) return [];
  const header = lines[0].split(',').map((h) => h.trim().toLowerCase());
  return lines.slice(1).map((line) => {
    const cols = line.split(',');
    const row = {};
    header.forEach((key, idx) => { row[key] = cols[idx]; });
    return row;
  }).filter((r) => r.date && r.close && r.close !== '0');
}

async function getStockDataFromStooq(symbolOrQuery) {
  const stooqSymbol = toStooqSymbol(symbolOrQuery);
  const response = await axios.get(STOOQ_DAILY, {
    params: { s: stooqSymbol, i: 'd' },
    timeout: 12000,
    responseType: 'text',
  });
  const rows = parseCsvRows(response.data);
  if (rows.length < 3) {
    const err = new Error('STOOQ_DATA_FAILED');
    err.publicMessage = 'Unable to fetch data';
    throw err;
  }
  return rows;
}

async function getCompanyProfile(symbol, apiKey) {
  try {
    const profileRes = await axios.get(`${FINNHUB_BASE}/stock/profile2`, {
      params: { symbol, token: apiKey },
      timeout: 10000,
    });
    return profileRes.data || {};
  } catch (error) {
    throw normalizeApiError(error, 'PROFILE_FAILED');
  }
}

async function getStockQuote(query, apiKey) {
  if (!apiKey || apiKey === 'your_key_here') {
    const error = new Error('MISSING_KEY');
    error.publicMessage = 'API Key Missing';
    throw error;
  }

  if (looksLikeAlphaVantageKey(apiKey)) {
    try {
      return await getStockQuoteFromAlpha(query, apiKey);
    } catch (error) {
      if (error.message === 'RATE_LIMIT' || error.message === 'AUTH_FAILED') {
        try {
          return await getStockQuoteFromYahoo(query);
        } catch {
          const rows = await getStockDataFromStooq(query);
          const latest = rows[rows.length - 1];
          const prev = rows[rows.length - 2];
          const price = Number(latest.close);
          const prevClose = Number(prev.close || latest.open || price);
          const change = price - prevClose;
          const changePercent = prevClose ? (change / prevClose) * 100 : 0;
          return {
            symbol: String(latest.symbol || query).toUpperCase().replace('.US', ''),
            name: String(latest.symbol || query).toUpperCase().replace('.US', ''),
            price: Number(price.toFixed(2)),
            currency: 'USD',
            change: Number(change.toFixed(2)),
            changePercent: Number(changePercent.toFixed(2)),
            open: Number(Number(latest.open || price).toFixed(2)),
            high: Number(Number(latest.high || price).toFixed(2)),
            low: Number(Number(latest.low || price).toFixed(2)),
            prevClose: Number(prevClose.toFixed(2)),
            trend: change >= 0 ? 'up' : 'down',
          };
        }
      }
      throw error;
    }
  }

  const symbol = await resolveSymbol(query, apiKey);
  let quoteRes;
  try {
    quoteRes = await axios.get(`${FINNHUB_BASE}/quote`, {
      params: { symbol, token: apiKey },
      timeout: 10000,
    });
  } catch (error) {
    const mapped = normalizeApiError(error, 'QUOTE_FAILED');
    if (mapped.message === 'RATE_LIMIT' || mapped.message === 'AUTH_FAILED') {
      try {
        return await getStockQuoteFromYahoo(query);
      } catch {
        const rows = await getStockDataFromStooq(query);
        const latest = rows[rows.length - 1];
        const prev = rows[rows.length - 2];
        const price = Number(latest.close);
        const prevClose = Number(prev.close || latest.open || price);
        const change = price - prevClose;
        const changePercent = prevClose ? (change / prevClose) * 100 : 0;
        return {
          symbol: String(latest.symbol || query).toUpperCase().replace('.US', ''),
          name: String(latest.symbol || query).toUpperCase().replace('.US', ''),
          price: Number(price.toFixed(2)),
          currency: 'USD',
          change: Number(change.toFixed(2)),
          changePercent: Number(changePercent.toFixed(2)),
          open: Number(Number(latest.open || price).toFixed(2)),
          high: Number(Number(latest.high || price).toFixed(2)),
          low: Number(Number(latest.low || price).toFixed(2)),
          prevClose: Number(prevClose.toFixed(2)),
          trend: change >= 0 ? 'up' : 'down',
        };
      }
    }
    throw mapped;
  }

  const quote = quoteRes.data || {};
  if (!quote.c || quote.c <= 0) {
    const invalid = new Error('INVALID_QUOTE');
    invalid.publicMessage = 'Unable to fetch data';
    throw invalid;
  }

  const profile = await getCompanyProfile(symbol, apiKey);
  const companyName = profile?.name || symbol;

  return {
    symbol,
    name: companyName,
    price: Number(quote.c.toFixed(2)),
    currency: profile?.currency || 'USD',
    change: Number((quote.d || 0).toFixed(2)),
    changePercent: Number((quote.dp || 0).toFixed(2)),
    open: Number((quote.o || 0).toFixed(2)),
    high: Number((quote.h || 0).toFixed(2)),
    low: Number((quote.l || 0).toFixed(2)),
    prevClose: Number((quote.pc || 0).toFixed(2)),
    trend: (quote.d || 0) >= 0 ? 'up' : 'down',
  };
}

async function getStockHistory(symbol, apiKey) {
  if (looksLikeAlphaVantageKey(apiKey)) {
    try {
      return await getStockHistoryFromAlpha(symbol, apiKey);
    } catch (error) {
      if (error.message === 'RATE_LIMIT' || error.message === 'AUTH_FAILED') {
        try {
          return await getStockHistoryFromYahoo(symbol);
        } catch {
          const rows = await getStockDataFromStooq(symbol);
          return rows.slice(-30).map((row) => ({
            date: new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            price: Number(Number(row.close || 0).toFixed(2)),
            volume: Number(row.volume || 0),
          })).filter((p) => p.price > 0);
        }
      }
      throw error;
    }
  }

  if (!apiKey || apiKey === 'your_key_here') {
    const error = new Error('MISSING_KEY');
    error.publicMessage = 'API Key Missing';
    throw error;
  }

  const to = Math.floor(Date.now() / 1000);
  const from = to - (30 * 24 * 60 * 60);

  let candleRes;
  try {
    candleRes = await axios.get(`${FINNHUB_BASE}/stock/candle`, {
      params: {
        symbol,
        resolution: 'D',
        from,
        to,
        token: apiKey,
      },
      timeout: 10000,
    });
  } catch (error) {
    const mapped = normalizeApiError(error, 'HISTORY_FAILED');
    if (mapped.message === 'RATE_LIMIT' || mapped.message === 'AUTH_FAILED') {
      try {
        return await getStockHistoryFromYahoo(symbol);
      } catch {
        const rows = await getStockDataFromStooq(symbol);
        return rows.slice(-30).map((row) => ({
          date: new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          price: Number(Number(row.close || 0).toFixed(2)),
          volume: Number(row.volume || 0),
        })).filter((p) => p.price > 0);
      }
    }
    throw mapped;
  }

  const payload = candleRes.data || {};
  if (payload.s !== 'ok' || !Array.isArray(payload.t) || !Array.isArray(payload.c)) {
    const noData = new Error('HISTORY_UNAVAILABLE');
    noData.publicMessage = 'Unable to fetch data';
    throw noData;
  }

  const points = payload.t.map((timestamp, idx) => ({
    date: new Date(timestamp * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    price: Number((payload.c[idx] || 0).toFixed(2)),
    volume: payload.v?.[idx] || 0,
  })).filter((point) => point.price > 0);

  if (points.length < 2) {
    const noData = new Error('HISTORY_UNAVAILABLE');
    noData.publicMessage = 'Unable to fetch data';
    throw noData;
  }

  return points;
}

module.exports = { getStockQuote, getStockHistory };
