const axios = require('axios');

// ── Company aliases with smart search terms and exclusion words ──
const COMPANY_ALIASES = {
  apple:     { ticker: 'AAPL', searchTerms: ['Apple Inc', 'AAPL', 'iPhone', 'Apple stock', 'Apple earnings'], excludeWords: ['fruit', 'recipe', 'orchard', 'cider', 'pie', 'tree', 'juice', 'apple watch face'] },
  tesla:     { ticker: 'TSLA', searchTerms: ['Tesla', 'TSLA', 'Elon Musk Tesla', 'Tesla EV'], excludeWords: ['nikola tesla', 'tesla coil'] },
  microsoft: { ticker: 'MSFT', searchTerms: ['Microsoft', 'MSFT', 'Azure', 'Windows', 'Microsoft stock'], excludeWords: [] },
  google:    { ticker: 'GOOGL', searchTerms: ['Google', 'Alphabet', 'GOOGL', 'Google stock'], excludeWords: [] },
  alphabet:  { ticker: 'GOOGL', searchTerms: ['Alphabet', 'Google', 'GOOGL'], excludeWords: [] },
  amazon:    { ticker: 'AMZN', searchTerms: ['Amazon', 'AMZN', 'AWS', 'Amazon stock'], excludeWords: [] },
  nvidia:    { ticker: 'NVDA', searchTerms: ['NVIDIA', 'NVDA', 'GPU', 'NVIDIA stock'], excludeWords: [] },
  meta:      { ticker: 'META', searchTerms: ['Meta Platforms', 'Facebook', 'META', 'Meta stock'], excludeWords: ['metadata', 'meta description'] },
  netflix:   { ticker: 'NFLX', searchTerms: ['Netflix', 'NFLX', 'Netflix stock'], excludeWords: [] },
  bitcoin:   { ticker: 'BTC',  searchTerms: ['Bitcoin', 'BTC', 'crypto Bitcoin', 'Bitcoin price'], excludeWords: [] },
  ethereum:  { ticker: 'ETH',  searchTerms: ['Ethereum', 'ETH', 'crypto Ethereum'], excludeWords: [] },
  tcs:       { ticker: 'TCS',  searchTerms: ['TCS', 'Tata Consultancy', 'Tata CS', 'TCS stock'], excludeWords: [] },
  infosys:   { ticker: 'INFY', searchTerms: ['Infosys', 'INFY', 'Infosys stock'], excludeWords: [] },
  reliance:  { ticker: 'RELIANCE', searchTerms: ['Reliance Industries', 'Jio', 'Reliance stock'], excludeWords: [] },
  wipro:     { ticker: 'WIPRO', searchTerms: ['Wipro', 'Wipro stock', 'Wipro IT'], excludeWords: [] },
  hdfc:      { ticker: 'HDFC',  searchTerms: ['HDFC', 'HDFC Bank', 'HDFC stock'], excludeWords: [] },
  samsung:   { ticker: 'SMSN', searchTerms: ['Samsung', 'Samsung Electronics', 'Samsung stock'], excludeWords: [] },
  intel:     { ticker: 'INTC', searchTerms: ['Intel', 'INTC', 'Intel stock'], excludeWords: [] },
  amd:       { ticker: 'AMD',  searchTerms: ['AMD', 'Advanced Micro Devices', 'AMD stock'], excludeWords: [] },
};

function resolveQuery(query) {
  const q = query.toLowerCase().trim();
  for (const [key, data] of Object.entries(COMPANY_ALIASES)) {
    if (q === key || q === data.ticker.toLowerCase() || data.searchTerms.some(t => t.toLowerCase() === q)) {
      return { ...data, resolvedKey: key, originalQuery: query };
    }
  }
  return { ticker: query.toUpperCase(), searchTerms: [query], excludeWords: [], resolvedKey: null, originalQuery: query };
}

// ── Relevancy check with strict matching ───────────────────
function isRelevantArticle(article, queryInfo, queryLower) {
  // Hard filter: removed or empty articles
  if (!article.title || article.title === '[Removed]' || article.title.includes('[Removed]')) return false;
  if (!article.description || article.description.length < 20) return false;

  const text = `${article.title} ${article.description || ''}`.toLowerCase();

  // Hard exclusion for ambiguous company names (e.g. "Apple" = fruit)
  if (queryInfo.excludeWords?.length > 0) {
    const hasExclude = queryInfo.excludeWords.some(w => text.includes(w.toLowerCase()));
    const hasStockCtx = text.includes('stock') || text.includes('share') || text.includes('market') ||
      text.includes('nasdaq') || text.includes('nyse') || text.includes('invest') || text.includes('earnings') ||
      queryInfo.searchTerms.slice(1).some(t => text.includes(t.toLowerCase()));
    if (hasExclude && !hasStockCtx) return false;
  }

  // Must contain at least one search term OR finance signal
  const hasQueryTerm     = queryInfo.searchTerms.some(t => text.includes(t.toLowerCase()));
  const hasQueryLower    = text.includes(queryLower);
  const hasFinanceContext = text.includes('stock') || text.includes('share') || text.includes('market') ||
    text.includes('investor') || text.includes('earnings') || text.includes('revenue') ||
    text.includes('nasdaq') || text.includes('nyse') || text.includes('bse') || text.includes('nse') ||
    text.includes('trading') || text.includes('quarterly') || text.includes('analyst');

  // Strong match: query term in title specifically
  const hasTermInTitle = queryInfo.searchTerms.some(t => (article.title || '').toLowerCase().includes(t.toLowerCase()));
  const hasQueryInTitle = (article.title || '').toLowerCase().includes(queryLower);

  // Require title match OR (body match + finance context)
  return hasTermInTitle || hasQueryInTitle || ((hasQueryTerm || hasQueryLower) && hasFinanceContext);
}

// ── Deduplicate articles by title similarity ───────────────
function deduplicateArticles(articles) {
  const seen = new Set();
  return articles.filter(a => {
    const key = (a.title || '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 60);
    if (seen.has(key) || key.length < 5) return false;
    seen.add(key);
    return true;
  });
}

// ── Main fetch function ────────────────────────────────────
async function fetchStockNews(query, apiKey) {
  if (!apiKey || apiKey === 'your_key_here' || apiKey.length < 6) {
    const keyError = new Error('MISSING_KEY');
    keyError.publicMessage = 'NEWS_API_KEY is missing. Add it to server/.env';
    throw keyError;
  }

  const queryInfo  = resolveQuery(query);
  const queryLower = query.toLowerCase().trim();

  // Build precise search query with financial context
  const primaryTerm = queryInfo.searchTerms[0];
  const searchQ = `"${primaryTerm}" AND (stock OR shares OR market OR earnings OR revenue OR investor OR profit OR loss OR quarterly)`;

  let response;
  try {
    response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q:        searchQ,
        language: 'en',
        sortBy:   'relevancy',
        pageSize: 40,           // fetch more so filtering has more to work with
        from:     new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
      headers: { 'X-Api-Key': apiKey },
      timeout: 14000,
    });
  } catch (error) {
    if (error?.response?.status === 429) {
      const e = new Error('RATE_LIMIT');
      e.publicMessage = 'NewsAPI rate limit reached. Retry in 60 seconds.';
      throw e;
    }
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      const e = new Error('AUTH_FAILED');
      e.publicMessage = `NewsAPI key invalid or unauthorized (${error.response.status}). Check your NEWS_API_KEY.`;
      throw e;
    }
    if (error?.response?.status === 426) {
      const e = new Error('AUTH_FAILED');
      e.publicMessage = 'NewsAPI plan upgrade required. Free keys only work on localhost — deploy to use live news.';
      throw e;
    }
    const e = new Error('NETWORK_ERROR');
    e.publicMessage = `NewsAPI unreachable: ${error.message}`;
    throw e;
  }

  if (response.data.status !== 'ok') {
    const msg  = response.data.message || 'NewsAPI returned an error';
    const code = response.data.code    || '';

    if (code === 'rateLimited' || code === 'maximumResultsReached') {
      const e = new Error('RATE_LIMIT');
      e.publicMessage = 'NewsAPI daily limit reached (100 req/day free plan). Try again tomorrow.';
      throw e;
    }
    if (code === 'apiKeyInvalid' || code === 'apiKeyDisabled' || code === 'apiKeyExhausted') {
      const e = new Error('AUTH_FAILED');
      e.publicMessage = `NewsAPI key problem (${code}): ${msg}`;
      throw e;
    }
    if (code === 'corsNotAllowed') {
      const e = new Error('AUTH_FAILED');
      e.publicMessage = 'NewsAPI free plan only allows localhost. Use a paid plan for deployed backends.';
      throw e;
    }
    const e = new Error(msg);
    e.publicMessage = `NewsAPI error (${code}): ${msg}`;
    throw e;
  }

  // Map raw articles
  let articles = (response.data.articles || []).map(a => ({
    title:       a.title,
    description: a.description,
    source:      a.source?.name || 'Unknown',
    url:         a.url,
    urlToImage:  a.urlToImage,
    publishedAt: a.publishedAt,
  }));

  // 1. Remove articles with empty/removed titles or very short descriptions
  articles = articles.filter(a =>
    a.title &&
    a.title !== '[Removed]' &&
    !a.title.includes('[Removed]') &&
    (a.description || '').length > 15
  );

  // 2. Deduplicate
  articles = deduplicateArticles(articles);

  // 3. Relevancy filter
  articles = articles.filter(a => isRelevantArticle(a, queryInfo, queryLower));

  // 4. Sort by relevancy: articles with title match first
  articles.sort((a, b) => {
    const aHasTitle = queryInfo.searchTerms.some(t => (a.title || '').toLowerCase().includes(t.toLowerCase()));
    const bHasTitle = queryInfo.searchTerms.some(t => (b.title || '').toLowerCase().includes(t.toLowerCase()));
    if (aHasTitle && !bHasTitle) return -1;
    if (!aHasTitle && bHasTitle) return 1;
    return 0;
  });

  if (articles.length === 0) {
    const e = new Error(`No relevant news found for "${query}". Try a specific company name or ticker.`);
    e.publicMessage = `No relevant financial news found for "${query}".`;
    throw e;
  }

  // Return top 12 for rich analysis
  return articles.slice(0, 12);
}

module.exports = { fetchStockNews, resolveQuery };
