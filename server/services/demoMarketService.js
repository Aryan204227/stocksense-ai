const SYMBOLS = {
  tesla: { symbol: 'TSLA', name: 'Tesla Inc', base: 370 },
  apple: { symbol: 'AAPL', name: 'Apple Inc', base: 272 },
  microsoft: { symbol: 'MSFT', name: 'Microsoft Corp', base: 511 },
  nvidia: { symbol: 'NVDA', name: 'NVIDIA Corp', base: 151 },
  amazon: { symbol: 'AMZN', name: 'Amazon.com Inc', base: 236 },
  spy: { symbol: 'SPY', name: 'SPDR S&P 500 ETF', base: 708 },
  qqq: { symbol: 'QQQ', name: 'Invesco QQQ', base: 651 },
  dia: { symbol: 'DIA', name: 'SPDR Dow Jones ETF', base: 493 },
  iwm: { symbol: 'IWM', name: 'iShares Russell 2000 ETF', base: 275 },
};

function hashString(input) {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) h = ((h << 5) - h) + input.charCodeAt(i);
  return Math.abs(h);
}

function resolveSymbol(query) {
  const key = String(query || '').trim().toLowerCase();
  if (SYMBOLS[key]) return SYMBOLS[key];
  const byTicker = Object.values(SYMBOLS).find((item) => item.symbol.toLowerCase() === key);
  return byTicker || { symbol: key.toUpperCase(), name: key.toUpperCase(), base: 120 + (hashString(key) % 400) };
}

function buildDemoQuote(query) {
  const ref = resolveSymbol(query);
  const minuteBucket = Math.floor(Date.now() / 60000);
  const driftSeed = hashString(`${ref.symbol}:${minuteBucket}`);
  const drift = ((driftSeed % 900) - 450) / 100;
  const price = Math.max(5, ref.base + drift);
  const prevClose = Math.max(5, price - (((driftSeed % 200) - 100) / 100));
  const change = price - prevClose;
  const changePercent = prevClose ? (change / prevClose) * 100 : 0;

  return {
    symbol: ref.symbol,
    name: ref.name,
    price: Number(price.toFixed(2)),
    currency: 'USD',
    change: Number(change.toFixed(2)),
    changePercent: Number(changePercent.toFixed(2)),
    open: Number((price - 0.5).toFixed(2)),
    high: Number((price + 1.8).toFixed(2)),
    low: Number((price - 2).toFixed(2)),
    prevClose: Number(prevClose.toFixed(2)),
    trend: change >= 0 ? 'up' : 'down',
  };
}

function buildDemoHistory(query) {
  const quote = buildDemoQuote(query);
  const points = [];
  for (let i = 29; i >= 0; i -= 1) {
    const ts = Date.now() - (i * 24 * 60 * 60 * 1000);
    const dayShift = Math.sin((i + quote.price) / 3) * 3 + Math.cos(i / 4) * 1.1;
    const p = Math.max(3, quote.price - dayShift);
    points.push({
      date: new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: Number(p.toFixed(2)),
      volume: 40000000 + (i * 21000),
    });
  }
  return points;
}

function buildDemoArticles(query) {
  const q = resolveSymbol(query);
  const now = Date.now();
  return [
    {
      title: `${q.name} investors watch momentum ahead of earnings update`,
      description: `${q.name} remains active in market discussion with focus on guidance and demand trends.`,
      source: 'Market Brief',
      publishedAt: new Date(now - 3600 * 1000).toISOString(),
      url: 'https://example.com/demo-1',
      sentiment: 'Positive',
      score: 2.1,
    },
    {
      title: `${q.symbol} faces mixed analyst commentary on near-term growth`,
      description: `Analysts remain divided on valuation and execution risks while maintaining broad coverage.`,
      source: 'Finance Wire',
      publishedAt: new Date(now - 2 * 3600 * 1000).toISOString(),
      url: 'https://example.com/demo-2',
      sentiment: 'Neutral',
      score: 0.2,
    },
    {
      title: `${q.name} volatility rises as macro headlines pressure risk assets`,
      description: `Macro uncertainty adds short-term pressure, though long-term outlook remains under review.`,
      source: 'Economic Post',
      publishedAt: new Date(now - 3 * 3600 * 1000).toISOString(),
      url: 'https://example.com/demo-3',
      sentiment: 'Negative',
      score: -1.5,
    },
  ];
}

function buildDemoMarkets() {
  return ['SPY', 'QQQ', 'DIA', 'IWM'].map((symbol) => buildDemoQuote(symbol));
}

module.exports = {
  buildDemoQuote,
  buildDemoHistory,
  buildDemoArticles,
  buildDemoMarkets,
};
