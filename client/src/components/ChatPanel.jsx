import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, Send, Search, RefreshCw, Clock, X, Flame, AlertTriangle, CheckCircle, Info, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = import.meta.env.VITE_API_URL || '';

const TRENDING_STOCKS = ['Tesla', 'Apple', 'NVIDIA', 'Microsoft', 'Amazon', 'Meta', 'Google', 'Bitcoin', 'TCS', 'Reliance'];

// All known stocks — must match server/data/stockList.js
const ALL_STOCKS = [
  { name:'Apple',          ticker:'AAPL',        exchange:'NASDAQ', flag:'🇺🇸' },
  { name:'Tesla',          ticker:'TSLA',        exchange:'NASDAQ', flag:'🇺🇸' },
  { name:'Microsoft',      ticker:'MSFT',        exchange:'NASDAQ', flag:'🇺🇸' },
  { name:'Google',         ticker:'GOOGL',       exchange:'NASDAQ', flag:'🇺🇸' },
  { name:'Amazon',         ticker:'AMZN',        exchange:'NASDAQ', flag:'🇺🇸' },
  { name:'NVIDIA',         ticker:'NVDA',        exchange:'NASDAQ', flag:'🇺🇸' },
  { name:'Meta',           ticker:'META',        exchange:'NASDAQ', flag:'🇺🇸' },
  { name:'Netflix',        ticker:'NFLX',        exchange:'NASDAQ', flag:'🇺🇸' },
  { name:'Intel',          ticker:'INTC',        exchange:'NASDAQ', flag:'🇺🇸' },
  { name:'AMD',            ticker:'AMD',         exchange:'NASDAQ', flag:'🇺🇸' },
  { name:'Adobe',          ticker:'ADBE',        exchange:'NASDAQ', flag:'🇺🇸' },
  { name:'Salesforce',     ticker:'CRM',         exchange:'NYSE',   flag:'🇺🇸' },
  { name:'Oracle',         ticker:'ORCL',        exchange:'NYSE',   flag:'🇺🇸' },
  { name:'IBM',            ticker:'IBM',         exchange:'NYSE',   flag:'🇺🇸' },
  { name:'Qualcomm',       ticker:'QCOM',        exchange:'NASDAQ', flag:'🇺🇸' },
  { name:'Broadcom',       ticker:'AVGO',        exchange:'NASDAQ', flag:'🇺🇸' },
  { name:'Palantir',       ticker:'PLTR',        exchange:'NYSE',   flag:'🇺🇸' },
  { name:'Snowflake',      ticker:'SNOW',        exchange:'NYSE',   flag:'🇺🇸' },
  { name:'CrowdStrike',    ticker:'CRWD',        exchange:'NASDAQ', flag:'🇺🇸' },
  { name:'Cloudflare',     ticker:'NET',         exchange:'NYSE',   flag:'🇺🇸' },
  { name:'JPMorgan',       ticker:'JPM',         exchange:'NYSE',   flag:'🇺🇸' },
  { name:'Goldman Sachs',  ticker:'GS',          exchange:'NYSE',   flag:'🇺🇸' },
  { name:'Visa',           ticker:'V',           exchange:'NYSE',   flag:'🇺🇸' },
  { name:'Mastercard',     ticker:'MA',          exchange:'NYSE',   flag:'🇺🇸' },
  { name:'PayPal',         ticker:'PYPL',        exchange:'NASDAQ', flag:'🇺🇸' },
  { name:'Coinbase',       ticker:'COIN',        exchange:'NASDAQ', flag:'🇺🇸' },
  { name:'Berkshire Hathaway', ticker:'BRK.B',   exchange:'NYSE',   flag:'🇺🇸' },
  { name:'Walmart',        ticker:'WMT',         exchange:'NYSE',   flag:'🇺🇸' },
  { name:"McDonald's",     ticker:'MCD',         exchange:'NYSE',   flag:'🇺🇸' },
  { name:'Starbucks',      ticker:'SBUX',        exchange:'NASDAQ', flag:'🇺🇸' },
  { name:'Nike',           ticker:'NKE',         exchange:'NYSE',   flag:'🇺🇸' },
  { name:'Coca-Cola',      ticker:'KO',          exchange:'NYSE',   flag:'🇺🇸' },
  { name:'PepsiCo',        ticker:'PEP',         exchange:'NASDAQ', flag:'🇺🇸' },
  { name:'Disney',         ticker:'DIS',         exchange:'NYSE',   flag:'🇺🇸' },
  { name:'Pfizer',         ticker:'PFE',         exchange:'NYSE',   flag:'🇺🇸' },
  { name:'Moderna',        ticker:'MRNA',        exchange:'NASDAQ', flag:'🇺🇸' },
  { name:'Johnson & Johnson', ticker:'JNJ',      exchange:'NYSE',   flag:'🇺🇸' },
  { name:'Uber',           ticker:'UBER',        exchange:'NYSE',   flag:'🇺🇸' },
  { name:'Airbnb',         ticker:'ABNB',        exchange:'NASDAQ', flag:'🇺🇸' },
  { name:'Shopify',        ticker:'SHOP',        exchange:'NYSE',   flag:'🇺🇸' },
  { name:'Snap',           ticker:'SNAP',        exchange:'NYSE',   flag:'🇺🇸' },
  { name:'Rivian',         ticker:'RIVN',        exchange:'NASDAQ', flag:'🇺🇸' },
  { name:'Ford',           ticker:'F',           exchange:'NYSE',   flag:'🇺🇸' },
  { name:'Boeing',         ticker:'BA',          exchange:'NYSE',   flag:'🇺🇸' },
  { name:'ARM Holdings',   ticker:'ARM',         exchange:'NASDAQ', flag:'🇺🇸' },
  { name:'Spotify',        ticker:'SPOT',        exchange:'NYSE',   flag:'🇺🇸' },
  // Indian stocks
  { name:'TCS',            ticker:'TCS.NS',      exchange:'NSE',    flag:'🇮🇳' },
  { name:'Infosys',        ticker:'INFY.NS',     exchange:'NSE',    flag:'🇮🇳' },
  { name:'Wipro',          ticker:'WIPRO.NS',    exchange:'NSE',    flag:'🇮🇳' },
  { name:'HCL Technologies',ticker:'HCLTECH.NS', exchange:'NSE',    flag:'🇮🇳' },
  { name:'Tech Mahindra',  ticker:'TECHM.NS',    exchange:'NSE',    flag:'🇮🇳' },
  { name:'HDFC Bank',      ticker:'HDFCBANK.NS', exchange:'NSE',    flag:'🇮🇳' },
  { name:'ICICI Bank',     ticker:'ICICIBANK.NS',exchange:'NSE',    flag:'🇮🇳' },
  { name:'SBI',            ticker:'SBIN.NS',     exchange:'NSE',    flag:'🇮🇳' },
  { name:'Axis Bank',      ticker:'AXISBANK.NS', exchange:'NSE',    flag:'🇮🇳' },
  { name:'Kotak Mahindra Bank',ticker:'KOTAKBANK.NS',exchange:'NSE',flag:'🇮🇳' },
  { name:'Reliance Industries',ticker:'RELIANCE.NS',exchange:'NSE', flag:'🇮🇳' },
  { name:'Bajaj Finance',  ticker:'BAJFINANCE.NS',exchange:'NSE',   flag:'🇮🇳' },
  { name:'Tata Motors',    ticker:'TATAMOTORS.NS',exchange:'NSE',   flag:'🇮🇳' },
  { name:'Tata Steel',     ticker:'TATASTEEL.NS',exchange:'NSE',    flag:'🇮🇳' },
  { name:'Adani Enterprises',ticker:'ADANIENT.NS',exchange:'NSE',   flag:'🇮🇳' },
  { name:'Adani Ports',    ticker:'ADANIPORTS.NS',exchange:'NSE',   flag:'🇮🇳' },
  { name:'Larsen & Toubro',ticker:'LT.NS',       exchange:'NSE',    flag:'🇮🇳' },
  { name:'ITC',            ticker:'ITC.NS',      exchange:'NSE',    flag:'🇮🇳' },
  { name:'Sun Pharma',     ticker:'SUNPHARMA.NS',exchange:'NSE',    flag:'🇮🇳' },
  { name:'Bharti Airtel',  ticker:'BHARTIARTL.NS',exchange:'NSE',   flag:'🇮🇳' },
  { name:'Maruti Suzuki',  ticker:'MARUTI.NS',   exchange:'NSE',    flag:'🇮🇳' },
  { name:'Zomato',         ticker:'ZOMATO.NS',   exchange:'NSE',    flag:'🇮🇳' },
  { name:'Nestle India',   ticker:'NESTLEIND.NS',exchange:'NSE',    flag:'🇮🇳' },
  // Global
  { name:'Samsung',        ticker:'005930.KS',   exchange:'KRX',    flag:'🇰🇷' },
  { name:'Sony',           ticker:'SONY',        exchange:'NYSE',   flag:'🇯🇵' },
  { name:'Toyota',         ticker:'TM',          exchange:'NYSE',   flag:'🇯🇵' },
  { name:'TSMC',           ticker:'TSM',         exchange:'NYSE',   flag:'🇹🇼' },
  { name:'Alibaba',        ticker:'BABA',        exchange:'NYSE',   flag:'🇨🇳' },
  { name:'ASML',           ticker:'ASML',        exchange:'NASDAQ', flag:'🇳🇱' },
  { name:'SAP',            ticker:'SAP',         exchange:'NYSE',   flag:'🇩🇪' },
  { name:'NIO',            ticker:'NIO',         exchange:'NYSE',   flag:'🇨🇳' },
  // Crypto
  { name:'Bitcoin',        ticker:'BTC-USD',     exchange:'CRYPTO', flag:'₿' },
  { name:'Ethereum',       ticker:'ETH-USD',     exchange:'CRYPTO', flag:'⟠' },
  { name:'Solana',         ticker:'SOL-USD',     exchange:'CRYPTO', flag:'◎' },
  { name:'Dogecoin',       ticker:'DOGE-USD',    exchange:'CRYPTO', flag:'🐶' },
  { name:'Ripple',         ticker:'XRP-USD',     exchange:'CRYPTO', flag:'✕' },
];


// ── Toast notification component ──
function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onDismiss, 5000);
    return () => clearTimeout(t);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const styles = {
    error:   { bg: 'bg-rose-500/15',    border: 'border-rose-500/40',    icon: <AlertTriangle size={14} className="text-rose-400 flex-shrink-0" />,    text: 'text-rose-300' },
    success: { bg: 'bg-emerald-500/15', border: 'border-emerald-500/40', icon: <CheckCircle   size={14} className="text-emerald-400 flex-shrink-0" />, text: 'text-emerald-300' },
    info:    { bg: 'bg-cyan-500/15',    border: 'border-cyan-500/40',    icon: <Info          size={14} className="text-cyan-400 flex-shrink-0" />,    text: 'text-cyan-300' },
  };

  const s = styles[toast.type] || styles.info;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        className={`mx-3.5 mt-2 flex items-start gap-2.5 px-3 py-2.5 rounded-xl border ${s.bg} ${s.border} flex-shrink-0`}
      >
        {s.icon}
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-bold ${s.text} leading-snug`}>{toast.title}</p>
          {toast.message && <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{toast.message}</p>}
        </div>
        <button onClick={onDismiss} className="text-slate-600 hover:text-slate-400 flex-shrink-0 mt-0.5">
          <X size={11} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

function formatText(text) {
  if (!text) return '';
  return text
    .replace(/^## (.+)$/gm, '<p class="text-white font-black text-sm mb-1.5 mt-3 flex items-center gap-1.5"><span class="w-1 h-4 bg-cyan-400 rounded-full inline-block flex-shrink-0"></span>$1</p>')
    .replace(/^---$/gm, '<hr class="border-white/5 my-2.5"/>')
    .replace(/^> (.+)$/gm, '<div class="border-l-2 border-cyan-500/50 pl-3 text-slate-400 text-xs italic my-1.5 bg-cyan-500/[0.04] py-1.5 rounded-r-lg">$1</div>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<span class="text-slate-400 text-xs italic">$1</span>')
    .replace(/^✔ (.+)$/gm, '<div class="flex gap-1.5 my-0.5 items-start"><span class="text-emerald-400 text-xs mt-0.5 flex-shrink-0">✔</span><span class="text-slate-300 text-xs">$1</span></div>')
    .replace(/^• (.+)$/gm, '<div class="flex gap-2 my-0.5 ml-1"><span class="text-slate-600 text-xs mt-1 flex-shrink-0">•</span><span class="text-slate-400 text-xs">$1</span></div>')
    .replace(/^❌ (.+)$/gm, '<div class="flex gap-1.5 my-0.5 items-start"><span class="text-rose-400 text-xs mt-0.5 flex-shrink-0">❌</span><span class="text-rose-300 text-xs font-medium">$1</span></div>')
    .replace(/\n/g, '<br/>');
}

function TypingDots() {
  return (
    <div className="flex gap-1.5 items-center px-1">
      {[0, 0.15, 0.3].map((d, i) => (
        <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-cyan-400"
          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.7, delay: d, repeat: Infinity }} />
      ))}
    </div>
  );
}

export default function ChatPanel({ userName, onAnalysisComplete, onLoadingChange, runtimeMode = 'live' }) {
  const [messages, setMessages] = useState([{
    id: 1, role: 'bot',
    text: `Hello **${userName || 'Analyst'}**! 👋\n\nI'm your **Intelligent Market AI**.\n\nType any stock to get:\n✔ Real sentiment & news analysis\n✔ Confidence scoring\n✔ AI-driven insights`,
  }]);
  const [input, setInput]     = useState('');
  const [searchHistory, setSearchHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ss_history') || '[]'); } catch { return []; }
  });
  const [isTyping, setIsTyping]         = useState(false);
  const [lastQuery, setLastQuery]       = useState('');
  const [toast, setToast]               = useState(null);
  const [lastRequestAt, setLastRequestAt] = useState(0);
  const [activeQuery, setActiveQuery]   = useState('');
  const [suggestions, setSuggestions]   = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const endRef      = useRef(null);
  const inputRef    = useRef(null);
  const debounceRef = useRef(null);
  const suggestRef  = useRef(null);

  // Auto-suggestions based on input
  const getSuggestions = useCallback((val) => {
    if (!val || val.length < 1) return [];
    const q = val.toLowerCase();
    return ALL_STOCKS.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.ticker.toLowerCase().includes(q)
    ).slice(0, 6);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInput(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const sugg = getSuggestions(val);
      setSuggestions(sugg);
      setShowSuggestions(sugg.length > 0 && val.trim().length > 0);
    }, 180);
  };

  const handleSuggestionClick = (stock) => {
    setInput(stock.name);
    setSuggestions([]);
    setShowSuggestions(false);
    setTimeout(() => handleSend(null, stock.name), 50);
  };

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e) => {
      if (suggestRef.current && !suggestRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  const showToast = useCallback((type, title, message = '') => {
    setToast({ type, title, message });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  const addMsg = useCallback((role, text) =>
    setMessages(p => [...p, { id: Date.now() + Math.random(), role, text }]), []);

  const analyzeStock = async (query) => {
    try {
      const res = await fetch(`${API_BASE}/api/analyze`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ query, mode: runtimeMode }),
        signal:  AbortSignal.timeout(28000),
      });
      const json = await res.json();
      return { httpStatus: res.status, ...json };
    } catch (e) {
      console.warn('API Error:', e.message);
      return { success: false, dataMode: 'network-error', message: e.message };
    }
  };

  const handleSend = async (e, forced) => {
    e?.preventDefault();
    const query = (forced || input).trim();
    if (!query || isTyping) return;
    if (query.toLowerCase() === activeQuery.toLowerCase()) return;
    if (Date.now() - lastRequestAt < 600) return;

    setInput('');
    setLastQuery(query);
    setActiveQuery(query);
    setLastRequestAt(Date.now());
    setToast(null);
    addMsg('user', query);
    setIsTyping(true);
    onLoadingChange?.(true);
    inputRef.current?.focus();

    const data = await analyzeStock(query);

    // ── Handle API error modes ──────────────────────────────────────────────
    if (!data.success) {
      const mode = data.dataMode || 'unknown-error';

      if (mode === 'api-error') {
        const isStrict = data.strictMode;
        showToast('error', `❌ Live API Failed${isStrict ? ' (Strict Mode)' : ''}`, data.message || 'Check API key / connection');
        addMsg('bot',
          `❌ **Live API Failed for "${query}"**\n\n` +
          `**Error:** ${data.message || 'Unable to fetch live data'}\n\n` +
          (isStrict
            ? `🔒 **Strict Mode is ON** — no silent demo fallback.\n\n`
            : '') +
          `**To fix:**\n✔ Check \`server/.env\` has valid API keys\n✔ Verify keys at newsapi.org & finnhub.io\n✔ Check backend terminal for details`
        );
      } else if (mode === 'rate-limit') {
        showToast('error', '⏱️ API limit reached', 'Retry in 60 seconds');
        addMsg('bot', '⏱️ **API limit reached, retry in 60 seconds**');
      } else if (mode === 'key-missing') {
        const keyName = data.key || 'API_KEY';
        showToast('error', `🔑 ${keyName} Missing`, 'API Key Missing');
        addMsg('bot',
          `🔑 **API Key Missing**\n\n` +
          `**${keyName}** is not set in your environment.\n\n` +
          `**To fix:**\n✔ Open \`server/.env\`\n✔ Add: \`${keyName}=your_key_here\`\n✔ Restart the backend server\n\n` +
          `${data.instructions || ''}`
        );
      } else if (mode === 'invalid-query') {
        const isNotFound = data.notFound;
        showToast('error',
          isNotFound ? '❌ Stock Not Found' : '⚠️ Invalid Query',
          data.message
        );
        addMsg('bot',
          isNotFound
            ? `❌ **"${query}" is not a recognized stock or company.**\n\n` +
              `This could be a random name, typo, or a stock not in our database.\n\n` +
              `**Try these valid examples:**\n` +
              `• US Stocks: \`Tesla\`, \`Apple\`, \`NVIDIA\`, \`Microsoft\`, \`Amazon\`\n` +
              `• Indian Stocks: \`TCS\`, \`Infosys\`, \`Reliance\`, \`HDFC\`, \`Wipro\`\n` +
              `• Crypto: \`Bitcoin\`, \`Ethereum\`, \`Dogecoin\`\n` +
              `• Finance: \`JPMorgan\`, \`Visa\`, \`Goldman\`\n\n` +
              `_Only real, listed companies are supported._`
            : `⚠️ **Invalid search: "${query}"**\n\n${data.message}`
        );
      } else if (mode === 'no-data') {
        showToast('info', 'No data found', `No relevant news for "${query}"`);
        addMsg('bot',
          `🔍 **No Relevant News Found**\n\n` +
          `I couldn't find any relevant financial news for **"${query}"**.\n\n` +
          `• Try the full company name: *"Apple Inc"*\n` +
          `• Or use a ticker: *"AAPL"*, *"TSLA"*, *"NVDA"*\n` +
          `• Try: **Tesla**, **Microsoft**, **NVIDIA**, **TCS**`
        );
      } else if (mode === 'network-error') {
        showToast('error', '🔌 Connection Failed', 'Backend server is unreachable');
        addMsg('bot',
          `🔌 **Cannot reach the server**\n\n` +
          `The backend server appears to be offline.\n\n` +
          `• Make sure \`node server.js\` is running on port 5000\n` +
          `• Check for error messages in the backend terminal`
        );
      } else if (mode === 'server-error') {
        showToast('error', '⚠️ Server Error', data.message || 'Internal server error');
        addMsg('bot',
          `⚠️ **Server Error for "${query}"**\n\n` +
          `${data.message || 'Internal server error occurred.'}\n\n` +
          `**Try:**\n✔ Search again in a few seconds\n✔ Check backend terminal for details\n✔ Try a different stock name`
        );
      } else {
        showToast('error', 'Analysis failed', data.message || 'Unknown error');
        addMsg('bot',
          `⚠️ **Error analyzing "${query}"**\n\n${data.message || 'Something went wrong. Please try again.'}`
        );
      }

      onAnalysisComplete({
        success: false,
        dataMode: mode,
        query,
        message: data.message,
      });
      setIsTyping(false);
      setActiveQuery('');
      onLoadingChange?.(false);
      return;
    }

    // ── Success path ─────────────────────────────────────────────────────────
    onAnalysisComplete(data);

    if (data.dataSource === 'LIVE') {
      showToast('success', '🚀 Live Data Loaded', `${data.articles?.length || 0} real articles analyzed`);
    } else if (data.dataSource === 'DEMO') {
      showToast('info', '🧪 Demo Mode', 'Simulated market mode enabled');
    }

    // Update search history
    const newHistory = [query, ...searchHistory.filter(h => h.toLowerCase() !== query.toLowerCase())].slice(0, 8);
    setSearchHistory(newHistory);
    try { localStorage.setItem('ss_history', JSON.stringify(newHistory)); } catch {}

    const { overall, emoji, confidence, confidenceLabel, chatResponse, posCount, negCount, neuCount } = data.sentiment;
    const s   = data.stockData;
    const cur = s?.currency === 'INR' ? '₹' : '$';
    const price = s?.price ? `${cur}${Number(s.price).toLocaleString()}` : 'N/A';
    const chg   = s?.change !== undefined ? ` ${s.change > 0 ? '+' : ''}${s.change} (${s.changePercent}%)` : '';

    const srcTag = data.dataSource === 'DEMO'
      ? '> ⚠️ *Demo Mode — this is simulated data, NOT real market data*'
      : '> 🚀 *Live Mode — real-time news & prices from NewsAPI + Finnhub*';

    const total = (posCount || 0) + (negCount || 0) + (neuCount || 0);
    const breakdown = total > 0
      ? `✔ ${posCount || 0} Positive · ${negCount || 0} Negative · ${neuCount || 0} Neutral`
      : '';

    addMsg('bot',
      `## ${s?.name || query}${s?.symbol ? ` (${s.symbol})` : ''}\n\n` +
      `**Price:** ${price}${chg}\n\n---\n\n` +
      `**AI Analysis:** ${chatResponse}\n\n` +
      `**Verdict:** ${overall} ${emoji}\n` +
      `**Confidence:** ${confidence} *(${confidenceLabel})*\n` +
      (breakdown ? `${breakdown}\n\n` : '\n') +
      `Dashboard updated ↗\n${srcTag}`
    );

    setIsTyping(false);
    setActiveQuery('');
    onLoadingChange?.(false);
  };

  const handleRefresh = () => {
    if (lastQuery && !isTyping) handleSend(null, lastQuery);
  };

  const handleClear = () => {
    setMessages([{ id: Date.now(), role: 'bot', text: `Terminal cleared. What shall we analyze next, **${userName}**?` }]);
    onAnalysisComplete(null);
    setLastQuery('');
    setToast(null);
  };

  const displayHistory = searchHistory.slice(0, 5);

  return (
    <div className="flex flex-col h-full" style={{ background: 'linear-gradient(180deg,#020c1a 0%,#030e1e 100%)' }}>

      {/* ── Header ── */}
      <div className="px-4 py-3 border-b border-white/[0.05] flex items-center gap-2.5 flex-shrink-0"
        style={{ background: 'rgba(2,12,26,0.95)', backdropFilter: 'blur(12px)' }}>
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-600/20 border border-cyan-500/25 flex items-center justify-center text-cyan-400 flex-shrink-0">
          <Bot size={15} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm leading-none">StockSense AI</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
            <span className="text-emerald-400 text-[9px] font-bold uppercase tracking-wider">AI Online</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {lastQuery && (
            <button onClick={handleRefresh} disabled={isTyping} title="Refresh analysis"
              className="p-1.5 rounded-lg text-slate-600 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all disabled:opacity-30">
              <RefreshCw size={12} className={isTyping ? 'animate-spin' : ''} />
            </button>
          )}
          <button onClick={handleClear} title="Clear chat"
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-300 hover:bg-white/5 transition-all">
            <X size={12} />
          </button>
        </div>
      </div>

      {/* ── Toast ── */}
      <Toast toast={toast} onDismiss={dismissToast} />

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center text-[10px] font-black ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-violet-500 to-cyan-500 text-white'
                  : 'bg-white/[0.04] border border-white/[0.08] text-cyan-400'
              }`}>
                {msg.role === 'user' ? (userName?.[0]?.toUpperCase() || 'U') : <Bot size={11} />}
              </div>
              <div className={`max-w-[86%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-cyan-500/60 to-violet-600/60 text-white rounded-tr-sm'
                  : 'bg-white/[0.04] border border-white/[0.06] text-slate-300 rounded-tl-sm'
              }`} dangerouslySetInnerHTML={{ __html: formatText(msg.text) }} />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex gap-2">
              <div className="w-6 h-6 rounded-lg bg-white/[0.04] border border-white/[0.08] text-cyan-400 flex items-center justify-center flex-shrink-0">
                <Bot size={11} />
              </div>
              <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl rounded-tl-sm px-4 py-3">
                <TypingDots />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={endRef} />
      </div>

      {/* ── Trending ── */}
      <div className="px-3.5 pt-2.5 pb-1 border-t border-white/[0.04] flex-shrink-0">
        <p className="text-[9px] font-bold text-slate-700 uppercase tracking-widest mb-1.5 flex items-center gap-1">
          <Flame size={8} className="text-orange-500" /> Trending
        </p>
        <div className="flex flex-wrap gap-1">
          {TRENDING_STOCKS.slice(0, 5).map(s => (
            <button key={s} onClick={() => handleSend(null, s)} disabled={isTyping}
              className="px-2 py-0.5 rounded-md text-[10px] font-bold text-orange-400 bg-orange-500/[0.07] border border-orange-500/[0.15] hover:bg-orange-500/15 transition-all disabled:opacity-40">
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Search History ── */}
      {displayHistory.length > 0 && (
        <div className="px-3.5 pt-1.5 pb-1.5 flex-shrink-0">
          <p className="text-[9px] font-bold text-slate-700 uppercase tracking-widest mb-1.5 flex items-center gap-1">
            <Clock size={8} /> Recent
          </p>
          <div className="flex flex-wrap gap-1">
            {displayHistory.map(s => (
              <button key={s} onClick={() => handleSend(null, s)} disabled={isTyping}
                className="px-2 py-0.5 rounded-md text-[10px] font-bold text-cyan-400 bg-cyan-500/[0.06] border border-cyan-500/[0.12] hover:bg-cyan-500/10 transition-all disabled:opacity-40">
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Input + Suggestions ── */}
      <div className="p-3.5 flex-shrink-0">
        <div className="relative" ref={suggestRef}>

          {/* Suggestions dropdown */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                className="absolute bottom-full mb-1.5 left-0 right-0 z-50 rounded-xl overflow-hidden"
                style={{ background: 'rgba(9,14,26,0.98)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 -8px 32px rgba(0,0,0,0.5)' }}
              >
                {suggestions.map((s, i) => (
                  <button key={i} onMouseDown={() => handleSuggestionClick(s)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-white/[0.05] transition-colors text-left border-b border-white/[0.04] last:border-0">
                    <span className="text-sm w-5 text-center flex-shrink-0">{s.flag}</span>
                    <span className="text-white text-xs font-semibold flex-1">{s.name}</span>
                    <div className="flex flex-col items-end">
                      <span className="text-cyan-400 text-[10px] font-mono font-bold tracking-wider">{s.ticker}</span>
                      <span className="text-slate-600 text-[8px] uppercase">{s.exchange}</span>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSend} className="relative flex items-center">
            <div className="absolute left-3 text-slate-600 pointer-events-none"><Search size={12} /></div>
            <input ref={inputRef} id="stock-input" value={input}
              onChange={handleInputChange}
              onFocus={() => input.trim() && setShowSuggestions(suggestions.length > 0)}
              onKeyDown={e => { if (e.key === 'Escape') setShowSuggestions(false); }}
              placeholder="Tesla, AAPL, TCS, Bitcoin…"
              className="flex-1 pl-8 pr-11 py-3 rounded-xl text-white placeholder-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500/40 transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              disabled={isTyping} autoComplete="off" />
            <button type="submit" id="send-btn" disabled={!input.trim() || isTyping}
              className="absolute right-1.5 w-8 h-8 rounded-lg flex items-center justify-center text-white disabled:opacity-30 transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg,#06b6d4,#8b5cf6)' }}>
              {isTyping ? <RefreshCw size={12} className="animate-spin" /> : <Send size={12} />}
            </button>
          </form>
        </div>
        <p className="text-center text-[9px] text-slate-800 mt-1.5 font-medium">
          NewsAPI · Finnhub · AI Sentiment v4
        </p>
      </div>
    </div>
  );
}
