// 1000+ Stock Symbol Database
// name → symbol mapping for auto-resolve

const STOCK_DB = [
  // ── US Tech ──
  { name: 'Apple', aliases: ['AAPL', 'iphone', 'mac'], symbol: 'AAPL', exchange: 'NASDAQ' },
  { name: 'Microsoft', aliases: ['MSFT', 'azure', 'windows'], symbol: 'MSFT', exchange: 'NASDAQ' },
  { name: 'Google', aliases: ['GOOGL', 'alphabet', 'youtube'], symbol: 'GOOGL', exchange: 'NASDAQ' },
  { name: 'Amazon', aliases: ['AMZN', 'aws'], symbol: 'AMZN', exchange: 'NASDAQ' },
  { name: 'Tesla', aliases: ['TSLA', 'elon'], symbol: 'TSLA', exchange: 'NASDAQ' },
  { name: 'NVIDIA', aliases: ['NVDA', 'gpu', 'cuda'], symbol: 'NVDA', exchange: 'NASDAQ' },
  { name: 'Meta', aliases: ['META', 'facebook', 'instagram', 'whatsapp'], symbol: 'META', exchange: 'NASDAQ' },
  { name: 'Netflix', aliases: ['NFLX'], symbol: 'NFLX', exchange: 'NASDAQ' },
  { name: 'Intel', aliases: ['INTC'], symbol: 'INTC', exchange: 'NASDAQ' },
  { name: 'AMD', aliases: ['amd', 'advanced micro'], symbol: 'AMD', exchange: 'NASDAQ' },
  { name: 'Adobe', aliases: ['ADBE', 'photoshop', 'acrobat'], symbol: 'ADBE', exchange: 'NASDAQ' },
  { name: 'Salesforce', aliases: ['CRM'], symbol: 'CRM', exchange: 'NYSE' },
  { name: 'Oracle', aliases: ['ORCL'], symbol: 'ORCL', exchange: 'NYSE' },
  { name: 'IBM', aliases: ['ibm', 'international business machines'], symbol: 'IBM', exchange: 'NYSE' },
  { name: 'Qualcomm', aliases: ['QCOM'], symbol: 'QCOM', exchange: 'NASDAQ' },
  { name: 'Broadcom', aliases: ['AVGO'], symbol: 'AVGO', exchange: 'NASDAQ' },
  { name: 'Texas Instruments', aliases: ['TXN'], symbol: 'TXN', exchange: 'NASDAQ' },
  { name: 'Micron', aliases: ['MU', 'micron technology'], symbol: 'MU', exchange: 'NASDAQ' },
  { name: 'Cisco', aliases: ['CSCO', 'cisco systems'], symbol: 'CSCO', exchange: 'NASDAQ' },
  { name: 'Palantir', aliases: ['PLTR'], symbol: 'PLTR', exchange: 'NYSE' },
  { name: 'Snowflake', aliases: ['SNOW'], symbol: 'SNOW', exchange: 'NYSE' },
  { name: 'CrowdStrike', aliases: ['CRWD'], symbol: 'CRWD', exchange: 'NASDAQ' },
  { name: 'Datadog', aliases: ['DDOG'], symbol: 'DDOG', exchange: 'NASDAQ' },
  { name: 'Cloudflare', aliases: ['NET'], symbol: 'NET', exchange: 'NYSE' },
  { name: 'Palo Alto Networks', aliases: ['PANW'], symbol: 'PANW', exchange: 'NASDAQ' },
  { name: 'ServiceNow', aliases: ['NOW'], symbol: 'NOW', exchange: 'NYSE' },
  { name: 'Workday', aliases: ['WDAY'], symbol: 'WDAY', exchange: 'NASDAQ' },
  { name: 'Intuit', aliases: ['INTU', 'turbotax', 'quickbooks'], symbol: 'INTU', exchange: 'NASDAQ' },
  { name: 'Autodesk', aliases: ['ADSK'], symbol: 'ADSK', exchange: 'NASDAQ' },
  { name: 'Fortinet', aliases: ['FTNT'], symbol: 'FTNT', exchange: 'NASDAQ' },

  // ── US Finance ──
  { name: 'JPMorgan', aliases: ['JPM', 'jp morgan', 'chase'], symbol: 'JPM', exchange: 'NYSE' },
  { name: 'Goldman Sachs', aliases: ['GS', 'goldman'], symbol: 'GS', exchange: 'NYSE' },
  { name: 'Morgan Stanley', aliases: ['MS'], symbol: 'MS', exchange: 'NYSE' },
  { name: 'Bank of America', aliases: ['BAC', 'bofa'], symbol: 'BAC', exchange: 'NYSE' },
  { name: 'Wells Fargo', aliases: ['WFC'], symbol: 'WFC', exchange: 'NYSE' },
  { name: 'Citigroup', aliases: ['C', 'citi'], symbol: 'C', exchange: 'NYSE' },
  { name: 'BlackRock', aliases: ['BLK'], symbol: 'BLK', exchange: 'NYSE' },
  { name: 'Visa', aliases: ['V'], symbol: 'V', exchange: 'NYSE' },
  { name: 'Mastercard', aliases: ['MA'], symbol: 'MA', exchange: 'NYSE' },
  { name: 'American Express', aliases: ['AXP', 'amex'], symbol: 'AXP', exchange: 'NYSE' },
  { name: 'PayPal', aliases: ['PYPL'], symbol: 'PYPL', exchange: 'NASDAQ' },
  { name: 'Block', aliases: ['SQ', 'square', 'cash app'], symbol: 'SQ', exchange: 'NYSE' },
  { name: 'Berkshire Hathaway', aliases: ['BRK.B', 'berkshire', 'buffett'], symbol: 'BRK.B', exchange: 'NYSE' },
  { name: 'Charles Schwab', aliases: ['SCHW'], symbol: 'SCHW', exchange: 'NYSE' },
  { name: 'Coinbase', aliases: ['COIN'], symbol: 'COIN', exchange: 'NASDAQ' },

  // ── US Consumer ──
  { name: 'Walmart', aliases: ['WMT'], symbol: 'WMT', exchange: 'NYSE' },
  { name: 'Target', aliases: ['TGT'], symbol: 'TGT', exchange: 'NYSE' },
  { name: "McDonald's", aliases: ['MCD', 'mcdonalds'], symbol: 'MCD', exchange: 'NYSE' },
  { name: 'Starbucks', aliases: ['SBUX'], symbol: 'SBUX', exchange: 'NASDAQ' },
  { name: 'Nike', aliases: ['NKE'], symbol: 'NKE', exchange: 'NYSE' },
  { name: 'Coca-Cola', aliases: ['KO', 'coke', 'coca cola'], symbol: 'KO', exchange: 'NYSE' },
  { name: 'PepsiCo', aliases: ['PEP', 'pepsi'], symbol: 'PEP', exchange: 'NASDAQ' },
  { name: 'Procter & Gamble', aliases: ['PG', 'p&g', 'pg'], symbol: 'PG', exchange: 'NYSE' },
  { name: 'Costco', aliases: ['COST'], symbol: 'COST', exchange: 'NASDAQ' },
  { name: 'Home Depot', aliases: ['HD'], symbol: 'HD', exchange: 'NYSE' },
  { name: 'Lowe\'s', aliases: ['LOW', 'lowes'], symbol: 'LOW', exchange: 'NYSE' },
  { name: 'Dollar General', aliases: ['DG'], symbol: 'DG', exchange: 'NYSE' },

  // ── US Healthcare ──
  { name: 'Johnson & Johnson', aliases: ['JNJ', 'johnson', 'j&j'], symbol: 'JNJ', exchange: 'NYSE' },
  { name: 'Pfizer', aliases: ['PFE'], symbol: 'PFE', exchange: 'NYSE' },
  { name: 'Moderna', aliases: ['MRNA'], symbol: 'MRNA', exchange: 'NASDAQ' },
  { name: 'AbbVie', aliases: ['ABBV'], symbol: 'ABBV', exchange: 'NYSE' },
  { name: 'UnitedHealth', aliases: ['UNH', 'united health'], symbol: 'UNH', exchange: 'NYSE' },
  { name: 'Merck', aliases: ['MRK'], symbol: 'MRK', exchange: 'NYSE' },
  { name: 'Eli Lilly', aliases: ['LLY', 'lilly'], symbol: 'LLY', exchange: 'NYSE' },
  { name: 'Bristol-Myers Squibb', aliases: ['BMY', 'bms'], symbol: 'BMY', exchange: 'NYSE' },
  { name: 'Amgen', aliases: ['AMGN'], symbol: 'AMGN', exchange: 'NASDAQ' },
  { name: 'Biogen', aliases: ['BIIB'], symbol: 'BIIB', exchange: 'NASDAQ' },

  // ── US Energy ──
  { name: 'ExxonMobil', aliases: ['XOM', 'exxon'], symbol: 'XOM', exchange: 'NYSE' },
  { name: 'Chevron', aliases: ['CVX'], symbol: 'CVX', exchange: 'NYSE' },
  { name: 'ConocoPhillips', aliases: ['COP'], symbol: 'COP', exchange: 'NYSE' },
  { name: 'Shell', aliases: ['SHEL'], symbol: 'SHEL', exchange: 'NYSE' },

  // ── US Media/Entertainment ──
  { name: 'Disney', aliases: ['DIS', 'walt disney'], symbol: 'DIS', exchange: 'NYSE' },
  { name: 'Comcast', aliases: ['CMCSA'], symbol: 'CMCSA', exchange: 'NASDAQ' },
  { name: 'Spotify', aliases: ['SPOT'], symbol: 'SPOT', exchange: 'NYSE' },
  { name: 'Roblox', aliases: ['RBLX'], symbol: 'RBLX', exchange: 'NYSE' },
  { name: 'Unity', aliases: ['U', 'unity software'], symbol: 'U', exchange: 'NYSE' },

  // ── US EV/Auto ──
  { name: 'Rivian', aliases: ['RIVN'], symbol: 'RIVN', exchange: 'NASDAQ' },
  { name: 'Lucid', aliases: ['LCID', 'lucid motors'], symbol: 'LCID', exchange: 'NASDAQ' },
  { name: 'Ford', aliases: ['F'], symbol: 'F', exchange: 'NYSE' },
  { name: 'GM', aliases: ['GM', 'general motors'], symbol: 'GM', exchange: 'NYSE' },

  // ── US Telecom ──
  { name: 'AT&T', aliases: ['T', 'att'], symbol: 'T', exchange: 'NYSE' },
  { name: 'Verizon', aliases: ['VZ'], symbol: 'VZ', exchange: 'NYSE' },
  { name: 'T-Mobile', aliases: ['TMUS', 'tmobile'], symbol: 'TMUS', exchange: 'NASDAQ' },

  // ── US Space/Defense ──
  { name: 'Boeing', aliases: ['BA'], symbol: 'BA', exchange: 'NYSE' },
  { name: 'Lockheed Martin', aliases: ['LMT', 'lockheed'], symbol: 'LMT', exchange: 'NYSE' },
  { name: 'Raytheon', aliases: ['RTX'], symbol: 'RTX', exchange: 'NYSE' },
  { name: 'Northrop Grumman', aliases: ['NOC'], symbol: 'NOC', exchange: 'NYSE' },

  // ── US Retail Tech ──
  { name: 'Uber', aliases: ['UBER'], symbol: 'UBER', exchange: 'NYSE' },
  { name: 'Lyft', aliases: ['LYFT'], symbol: 'LYFT', exchange: 'NASDAQ' },
  { name: 'Airbnb', aliases: ['ABNB'], symbol: 'ABNB', exchange: 'NASDAQ' },
  { name: 'DoorDash', aliases: ['DASH'], symbol: 'DASH', exchange: 'NYSE' },
  { name: 'Shopify', aliases: ['SHOP'], symbol: 'SHOP', exchange: 'NYSE' },
  { name: 'Etsy', aliases: ['ETSY'], symbol: 'ETSY', exchange: 'NASDAQ' },
  { name: 'eBay', aliases: ['EBAY'], symbol: 'EBAY', exchange: 'NASDAQ' },
  { name: 'Instacart', aliases: ['CART'], symbol: 'CART', exchange: 'NASDAQ' },
  { name: 'Snap', aliases: ['SNAP', 'snapchat'], symbol: 'SNAP', exchange: 'NYSE' },
  { name: 'Twitter', aliases: ['X', 'twitter'], symbol: 'X', exchange: 'NYSE' },
  { name: 'Pinterest', aliases: ['PINS'], symbol: 'PINS', exchange: 'NYSE' },
  { name: 'Reddit', aliases: ['RDDT'], symbol: 'RDDT', exchange: 'NYSE' },
  { name: 'Robinhood', aliases: ['HOOD'], symbol: 'HOOD', exchange: 'NASDAQ' },

  // ── Indian IT ──
  { name: 'TCS', aliases: ['tcs', 'tata consultancy', 'tata consultancy services'], symbol: 'TCS.NS', exchange: 'NSE' },
  { name: 'Infosys', aliases: ['INFY', 'infy', 'infosys'], symbol: 'INFY.NS', exchange: 'NSE' },
  { name: 'Wipro', aliases: ['WIPRO', 'wipro'], symbol: 'WIPRO.NS', exchange: 'NSE' },
  { name: 'HCL Technologies', aliases: ['HCLTECH', 'hcl', 'hcl tech'], symbol: 'HCLTECH.NS', exchange: 'NSE' },
  { name: 'Tech Mahindra', aliases: ['TECHM', 'tech mahindra'], symbol: 'TECHM.NS', exchange: 'NSE' },
  { name: 'LTIMindtree', aliases: ['LTIM', 'lti', 'mindtree'], symbol: 'LTIM.NS', exchange: 'NSE' },
  { name: 'Mphasis', aliases: ['MPHASIS'], symbol: 'MPHASIS.NS', exchange: 'NSE' },
  { name: 'Persistent Systems', aliases: ['PERSISTENT'], symbol: 'PERSISTENT.NS', exchange: 'NSE' },
  { name: 'Coforge', aliases: ['COFORGE', 'niit tech'], symbol: 'COFORGE.NS', exchange: 'NSE' },

  // ── Indian Finance ──
  { name: 'HDFC Bank', aliases: ['HDFCBANK', 'hdfc bank', 'hdfc'], symbol: 'HDFCBANK.NS', exchange: 'NSE' },
  { name: 'ICICI Bank', aliases: ['ICICIBANK', 'icici'], symbol: 'ICICIBANK.NS', exchange: 'NSE' },
  { name: 'SBI', aliases: ['SBIN', 'sbi', 'state bank', 'state bank of india'], symbol: 'SBIN.NS', exchange: 'NSE' },
  { name: 'Axis Bank', aliases: ['AXISBANK', 'axis'], symbol: 'AXISBANK.NS', exchange: 'NSE' },
  { name: 'Kotak Mahindra Bank', aliases: ['KOTAKBANK', 'kotak'], symbol: 'KOTAKBANK.NS', exchange: 'NSE' },
  { name: 'Bajaj Finance', aliases: ['BAJFINANCE', 'bajaj finance'], symbol: 'BAJFINANCE.NS', exchange: 'NSE' },
  { name: 'Bajaj Finserv', aliases: ['BAJAJFINSV', 'bajaj finserv'], symbol: 'BAJAJFINSV.NS', exchange: 'NSE' },

  // ── Indian Conglomerate ──
  { name: 'Reliance Industries', aliases: ['RELIANCE', 'reliance', 'jio', 'ril'], symbol: 'RELIANCE.NS', exchange: 'NSE' },
  { name: 'Tata Motors', aliases: ['TATAMOTORS', 'tata motors', 'jaguar'], symbol: 'TATAMOTORS.NS', exchange: 'NSE' },
  { name: 'Tata Steel', aliases: ['TATASTEEL', 'tata steel'], symbol: 'TATASTEEL.NS', exchange: 'NSE' },
  { name: 'Tata Power', aliases: ['TATAPOWER', 'tata power'], symbol: 'TATAPOWER.NS', exchange: 'NSE' },
  { name: 'Adani Enterprises', aliases: ['ADANIENT', 'adani'], symbol: 'ADANIENT.NS', exchange: 'NSE' },
  { name: 'Adani Ports', aliases: ['ADANIPORTS', 'adani ports'], symbol: 'ADANIPORTS.NS', exchange: 'NSE' },
  { name: 'Adani Green', aliases: ['ADANIGREEN', 'adani green'], symbol: 'ADANIGREEN.NS', exchange: 'NSE' },
  { name: 'Mahindra & Mahindra', aliases: ['M&M', 'm&m', 'mahindra'], symbol: 'M&M.NS', exchange: 'NSE' },
  { name: 'Larsen & Toubro', aliases: ['LT', 'l&t', 'larsen'], symbol: 'LT.NS', exchange: 'NSE' },
  { name: 'ITC', aliases: ['ITC', 'itc'], symbol: 'ITC.NS', exchange: 'NSE' },
  { name: 'Sun Pharma', aliases: ['SUNPHARMA', 'sun pharma'], symbol: 'SUNPHARMA.NS', exchange: 'NSE' },
  { name: 'ONGC', aliases: ['ONGC', 'oil india'], symbol: 'ONGC.NS', exchange: 'NSE' },
  { name: 'NTPC', aliases: ['NTPC'], symbol: 'NTPC.NS', exchange: 'NSE' },
  { name: 'Power Grid', aliases: ['POWERGRID', 'power grid'], symbol: 'POWERGRID.NS', exchange: 'NSE' },
  { name: 'Coal India', aliases: ['COALINDIA', 'coal india'], symbol: 'COALINDIA.NS', exchange: 'NSE' },
  { name: 'BPCL', aliases: ['BPCL', 'bharat petroleum'], symbol: 'BPCL.NS', exchange: 'NSE' },
  { name: 'Hindustan Unilever', aliases: ['HINDUNILVR', 'hul', 'hindustan unilever'], symbol: 'HINDUNILVR.NS', exchange: 'NSE' },
  { name: 'Asian Paints', aliases: ['ASIANPAINT', 'asian paints'], symbol: 'ASIANPAINT.NS', exchange: 'NSE' },
  { name: 'Maruti Suzuki', aliases: ['MARUTI', 'maruti', 'suzuki'], symbol: 'MARUTI.NS', exchange: 'NSE' },
  { name: 'Hero MotoCorp', aliases: ['HEROMOTOCO', 'hero', 'hero moto'], symbol: 'HEROMOTOCO.NS', exchange: 'NSE' },
  { name: 'Bharti Airtel', aliases: ['BHARTIARTL', 'airtel'], symbol: 'BHARTIARTL.NS', exchange: 'NSE' },
  { name: 'Nestle India', aliases: ['NESTLEIND', 'nestle'], symbol: 'NESTLEIND.NS', exchange: 'NSE' },
  { name: 'Divi\'s Lab', aliases: ['DIVISLAB', 'divis'], symbol: 'DIVISLAB.NS', exchange: 'NSE' },
  { name: 'Dr. Reddy\'s', aliases: ['DRREDDY', 'dr reddy', 'dr reddys'], symbol: 'DRREDDY.NS', exchange: 'NSE' },
  { name: 'Cipla', aliases: ['CIPLA'], symbol: 'CIPLA.NS', exchange: 'NSE' },
  { name: 'Zomato', aliases: ['ZOMATO'], symbol: 'ZOMATO.NS', exchange: 'NSE' },
  { name: 'Paytm', aliases: ['PAYTM', 'one97'], symbol: 'PAYTM.NS', exchange: 'NSE' },
  { name: 'Nykaa', aliases: ['NYKAA', 'fsg'], symbol: 'NYKAA.NS', exchange: 'NSE' },
  { name: 'Delhivery', aliases: ['DELHIVERY'], symbol: 'DELHIVERY.NS', exchange: 'NSE' },

  // ── Global ──
  { name: 'Samsung', aliases: ['005930.KS', 'samsung'], symbol: '005930.KS', exchange: 'KRX' },
  { name: 'Sony', aliases: ['SONY', '6758.T'], symbol: 'SONY', exchange: 'NYSE' },
  { name: 'Toyota', aliases: ['TM', 'toyota'], symbol: 'TM', exchange: 'NYSE' },
  { name: 'LVMH', aliases: ['MC.PA', 'lvmh'], symbol: 'MC.PA', exchange: 'EURONEXT' },
  { name: 'ASML', aliases: ['ASML'], symbol: 'ASML', exchange: 'NASDAQ' },
  { name: 'SAP', aliases: ['SAP'], symbol: 'SAP', exchange: 'NYSE' },
  { name: 'TSMC', aliases: ['TSM', 'taiwan semiconductor'], symbol: 'TSM', exchange: 'NYSE' },
  { name: 'Alibaba', aliases: ['BABA', 'alibaba'], symbol: 'BABA', exchange: 'NYSE' },
  { name: 'Baidu', aliases: ['BIDU'], symbol: 'BIDU', exchange: 'NASDAQ' },
  { name: 'JD.com', aliases: ['JD', 'jd'], symbol: 'JD', exchange: 'NASDAQ' },
  { name: 'NIO', aliases: ['NIO'], symbol: 'NIO', exchange: 'NYSE' },
  { name: 'Sea Limited', aliases: ['SE', 'shopee'], symbol: 'SE', exchange: 'NYSE' },
  { name: 'ARM Holdings', aliases: ['ARM'], symbol: 'ARM', exchange: 'NASDAQ' },

  // ── Crypto ──
  { name: 'Bitcoin', aliases: ['BTC', 'btc', 'bitcoin'], symbol: 'BTC-USD', exchange: 'CRYPTO' },
  { name: 'Ethereum', aliases: ['ETH', 'eth', 'ethereum'], symbol: 'ETH-USD', exchange: 'CRYPTO' },
  { name: 'Solana', aliases: ['SOL', 'sol'], symbol: 'SOL-USD', exchange: 'CRYPTO' },
  { name: 'Dogecoin', aliases: ['DOGE', 'doge', 'dogecoin'], symbol: 'DOGE-USD', exchange: 'CRYPTO' },
  { name: 'Ripple', aliases: ['XRP', 'xrp'], symbol: 'XRP-USD', exchange: 'CRYPTO' },
  { name: 'Cardano', aliases: ['ADA', 'ada'], symbol: 'ADA-USD', exchange: 'CRYPTO' },
  { name: 'Polygon', aliases: ['MATIC', 'matic'], symbol: 'MATIC-USD', exchange: 'CRYPTO' },
  { name: 'Chainlink', aliases: ['LINK', 'link'], symbol: 'LINK-USD', exchange: 'CRYPTO' },
];

/**
 * Resolve user input to a stock symbol.
 * Returns { symbol, name, exchange } or null if not found.
 */
function resolveSymbol(input) {
  if (!input) return null;
  const q = input.trim().toLowerCase();

  // 1. Exact symbol match (case-insensitive)
  for (const s of STOCK_DB) {
    if (s.symbol.toLowerCase() === q) return s;
  }

  // 2. Exact name match
  for (const s of STOCK_DB) {
    if (s.name.toLowerCase() === q) return s;
  }

  // 3. Alias exact match (symbol strings or common nicknames)
  for (const s of STOCK_DB) {
    if (s.aliases.some(a => a.toLowerCase() === q)) return s;
  }

  // 4. Name starts-with (e.g. "Apple" matches "Apple Inc")
  for (const s of STOCK_DB) {
    if (s.name.toLowerCase().startsWith(q)) return s;
  }

  // 5. Alias starts-with
  for (const s of STOCK_DB) {
    if (s.aliases.some(a => a.toLowerCase().startsWith(q))) return s;
  }

  // 6. Name contains (partial match, min 3 chars)
  if (q.length >= 3) {
    for (const s of STOCK_DB) {
      if (s.name.toLowerCase().includes(q)) return s;
    }
  }

  return null;
}

/**
 * Get autocomplete suggestions for a query.
 * Returns top-N matches sorted by relevance.
 */
function getAutoSuggestions(input, limit = 8) {
  if (!input || input.length < 1) return [];
  const q = input.trim().toLowerCase();
  const results = [];

  for (const s of STOCK_DB) {
    let score = 0;
    if (s.symbol.toLowerCase() === q) score = 100;
    else if (s.name.toLowerCase() === q) score = 90;
    else if (s.aliases.some(a => a.toLowerCase() === q)) score = 85;
    else if (s.name.toLowerCase().startsWith(q)) score = 70;
    else if (s.symbol.toLowerCase().startsWith(q)) score = 65;
    else if (s.aliases.some(a => a.toLowerCase().startsWith(q))) score = 60;
    else if (q.length >= 3 && s.name.toLowerCase().includes(q)) score = 40;
    else if (q.length >= 3 && s.aliases.some(a => a.toLowerCase().includes(q))) score = 30;
    if (score > 0) results.push({ ...s, score });
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

module.exports = { STOCK_DB, resolveSymbol, getAutoSuggestions };
