import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, Key, Bell, Loader, CheckCircle, XCircle, ExternalLink,
  RefreshCw, Zap, Shield, Database, Globe, BookOpen, Info,
  TrendingUp, AlertTriangle, Newspaper, BarChart3, Terminal,
} from 'lucide-react';

const FADE = { hidden: { opacity: 0, y: 14 }, show: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07 } }) };

function SectionHeader({ icon: Icon, color, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${color}`}>
        <Icon size={15} />
      </div>
      <div>
        <h3 className="text-white font-bold text-sm">{title}</h3>
        {subtitle && <p className="text-slate-600 text-xs">{subtitle}</p>}
      </div>
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`w-11 h-6 rounded-full transition-all duration-300 relative focus:outline-none focus:ring-2 focus:ring-cyan-500/40 ${value ? 'bg-cyan-500' : 'bg-slate-700'}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${value ? 'left-5' : 'left-0.5'}`} />
    </button>
  );
}

function StatusBadge({ ok }) {
  return ok
    ? <span className="flex items-center gap-1 text-emerald-400 text-[10px] font-black uppercase tracking-wider"><CheckCircle size={11} /> Configured</span>
    : <span className="flex items-center gap-1 text-rose-400    text-[10px] font-black uppercase tracking-wider"><XCircle    size={11} /> Missing</span>;
}

export default function SettingsPage({ runtimeMode = 'live' }) {
  const [apiStatus, setApiStatus]     = useState(null);
  const [checking, setChecking]       = useState(false);
  const [lastChecked, setLastChecked] = useState(null);

  // Preferences (saved in localStorage)
  const load = (k, def) => { try { const v = localStorage.getItem(k); return v !== null ? JSON.parse(v) : def; } catch { return def; } };
  const save = (k, v)   => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

  const [notifs,    setNotifs]    = useState(() => load('pref_notifs',    true));
  const [autoScroll, setAutoScroll] = useState(() => load('pref_scroll',  true));
  const [showScore, setShowScore]  = useState(() => load('pref_score',    true));
  const [compactNews, setCompact]  = useState(() => load('pref_compact',  false));

  const updatePref = (key, setter) => (val) => { setter(val); save(key, val); };

  const checkStatus = () => {
    setChecking(true);
    const API_BASE = import.meta.env.VITE_API_URL || '';
    fetch(`${API_BASE}/api/status`)
      .then(r => r.json())
      .then(d => { setApiStatus(d); setLastChecked(new Date()); setChecking(false); })
      .catch(() => { setApiStatus(null); setChecking(false); });
  };

  useEffect(() => { checkStatus(); }, []);

  const newsOk  = apiStatus?.newsApi  === 'configured';
  const stockOk = apiStatus?.stockApi === 'configured' || apiStatus?.finnhubApi === 'configured';

  const prefs = [
    { label: 'Analysis Alerts',    desc: 'Toast notification on completed analysis',  icon: Bell,      val: notifs,     set: updatePref('pref_notifs',   setNotifs)     },
    { label: 'Auto-Scroll Chat',   desc: 'Scroll to latest message automatically',    icon: TrendingUp, val: autoScroll, set: updatePref('pref_scroll',  setAutoScroll)  },
    { label: 'Show Sentiment Score', desc: 'Display numeric score on articles',       icon: BarChart3,  val: showScore,  set: updatePref('pref_score',   setShowScore)   },
    { label: 'Compact News Cards', desc: 'Smaller article cards in analytics panel',  icon: Newspaper,  val: compactNews,set: updatePref('pref_compact', setCompact)     },
  ];

  const apiLinks = [
    { name: 'NewsAPI.org',   desc: 'Free — 100 requests/day. Use NEWS_API_KEY',          url: 'https://newsapi.org/register',   color: 'text-cyan-400',   border: 'border-cyan-500/20',   bg: 'bg-cyan-500/5'  },
    { name: 'Finnhub.io',   desc: 'Free — Real-time stock quotes. Use FINNHUB_API_KEY', url: 'https://finnhub.io/register',   color: 'text-violet-400', border: 'border-violet-500/20', bg: 'bg-violet-500/5'},
  ];

  const dataGuide = [
    { dot: 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.7)]',  label: '🚀 Live Mode',         desc: 'Both API keys present — real news + real stock prices from external APIs.' },
    { dot: 'bg-amber-400   shadow-[0_0_8px_rgba(245,158,11,0.6)]',   label: '⚠️ Demo Mode',         desc: 'API keys missing — simulated, realistic-looking data is shown (NOT real).' },
    { dot: 'bg-rose-400    shadow-[0_0_8px_rgba(244,63,94,0.6)]',    label: '❌ API Error',          desc: 'Keys are set but the API call failed — error details shown in chat & panel.' },
    { dot: 'bg-orange-400  shadow-[0_0_8px_rgba(251,146,60,0.6)]',   label: '⏱ Rate Limited',       desc: 'Free tier limit reached (100/day for NewsAPI). Resets at midnight UTC.' },
    { dot: 'bg-slate-400   shadow-[0_0_6px_rgba(148,163,184,0.5)]',  label: '🔑 Key Missing',       desc: 'Specific API key not found in server/.env — add the key and restart backend.' },
  ];

  const tips = [
    { icon: Terminal,  text: 'After editing server/.env, restart the backend terminal for changes to take effect.' },
    { icon: Shield,    text: 'API keys are kept server-side only — never exposed to the browser.' },
    { icon: Globe,     text: 'NewsAPI free plan only allows localhost. For deployed apps, upgrade to a paid plan.' },
    { icon: Database,  text: 'Stock quotes use Finnhub (primary) → Alpha Vantage → Yahoo Finance as fallback chain.' },
    { icon: Zap,       text: 'Sentiment engine uses weighted keyword scoring + negation detection for accuracy.' },
  ];

  return (
    <motion.div initial="hidden" animate="show" className="space-y-5 max-w-2xl pb-8">

      {/* ── 1. Backend API Status ── */}
      <motion.div custom={0} variants={FADE} className="glass-panel p-5">
        <SectionHeader icon={Zap} color="bg-emerald-500/10 border-emerald-500/20 text-emerald-400" title="Backend API Status" subtitle="Live connectivity check with your configured keys" />

        {checking && (
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-3">
            <Loader size={13} className="animate-spin" /> Checking servers...
          </div>
        )}

        {apiStatus ? (
          <>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: 'NewsAPI.org',     sub: 'NEWS_API_KEY',     ok: newsOk },
                { label: 'Finnhub / Stock', sub: 'FINNHUB_API_KEY',  ok: stockOk },
              ].map(({ label, sub, ok }) => (
                <div key={label} className={`rounded-xl border p-4 flex flex-col gap-2 ${ok ? 'bg-emerald-500/5 border-emerald-500/15' : 'bg-rose-500/5 border-rose-500/15'}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${ok ? 'bg-emerald-500/15' : 'bg-rose-500/15'}`}>
                    {ok ? <CheckCircle size={15} className="text-emerald-400" /> : <XCircle size={15} className="text-rose-400" />}
                  </div>
                  <div>
                    <p className="text-white font-bold text-xs">{label}</p>
                    <p className="text-slate-600 text-[10px] font-mono mb-1">{sub}</p>
                    <StatusBadge ok={ok} />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-emerald-400 text-xs font-bold">Server Online</span>
              <span className="text-slate-600 text-xs">v{apiStatus.version || '3.0'}</span>
              {lastChecked && (
                <span className="text-slate-700 text-[10px] ml-auto">
                  Last checked: {lastChecked.toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={checkStatus}
                className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-400 text-xs hover:text-white hover:border-white/20 transition-all"
              >
                <RefreshCw size={11} className={checking ? 'animate-spin' : ''} /> Recheck
              </button>
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
            <p className="text-rose-400 font-bold text-sm mb-1">⚠️ Cannot reach backend</p>
            <p className="text-slate-500 text-xs">Make sure backend server is running on port 5000.</p>
            <code className="text-cyan-400 text-xs block mt-2 bg-white/[0.03] p-2 rounded-lg">cd server &amp;&amp; node server.js</code>
            <button onClick={checkStatus} className="mt-3 flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
              <RefreshCw size={11} /> Retry
            </button>
          </div>
        )}
      </motion.div>

      {/* ── 2. API Keys Setup Guide ── */}
      <motion.div custom={1} variants={FADE} className="glass-panel p-6">
        <SectionHeader icon={Key} color="bg-cyan-500/10 border-cyan-500/20 text-cyan-400" title="API Keys Setup" subtitle="Server-side configuration — edit server/.env file" />

        <div className="space-y-3 mb-5">
          {apiLinks.map(({ name, desc, url, color, border, bg }) => (
            <div key={name} className={`flex items-center justify-between p-4 rounded-xl border ${border} ${bg}`}>
              <div>
                <p className={`font-bold text-sm ${color}`}>{name}</p>
                <p className="text-slate-500 text-xs mt-0.5">{desc}</p>
              </div>
              <a href={url} target="_blank" rel="noopener noreferrer"
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border ${border} ${color} hover:bg-white/10 transition-all`}>
                Get Key <ExternalLink size={10} />
              </a>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <p className="text-white font-bold text-xs mb-3 flex items-center gap-2">
            <Terminal size={12} className="text-slate-500" /> server/.env — required format:
          </p>
          <pre className="text-cyan-400 text-xs leading-relaxed font-mono bg-black/30 p-3 rounded-lg overflow-x-auto">{`NEWS_API_KEY=your_newsapi_key_here
FINNHUB_API_KEY=your_finnhub_key_here
PORT=5000`}</pre>
          <p className="text-slate-600 text-[10px] mt-2">After saving, close and restart the backend terminal window.</p>
        </div>
      </motion.div>

      {/* ── 3. Preferences ── */}
      <motion.div custom={2} variants={FADE} className="glass-panel p-6">
        <SectionHeader icon={Settings} color="bg-violet-500/10 border-violet-500/20 text-violet-400" title="Preferences" subtitle="Saved locally in your browser" />

        <div className="space-y-1">
          {prefs.map(({ label, desc, icon: Icon, val, set }) => (
            <div key={label} className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                  <Icon size={13} className="text-slate-500" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{label}</p>
                  <p className="text-slate-600 text-xs">{desc}</p>
                </div>
              </div>
              <Toggle value={val} onChange={set} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── 4. Data Mode Guide ── */}
      <motion.div custom={3} variants={FADE} className="glass-panel p-6">
        <SectionHeader icon={Info} color="bg-blue-500/10 border-blue-500/20 text-blue-400" title="Data Mode Guide" subtitle="What each badge in the app means" />

        <div className="space-y-2">
          {dataGuide.map(({ dot, label, desc }) => (
            <div key={label} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/10 transition-colors">
              <span className={`w-2.5 h-2.5 rounded-full ${dot} mt-1 flex-shrink-0`} />
              <div>
                <p className="text-white font-bold text-xs">{label}</p>
                <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── 5. Pro Tips ── */}
      <motion.div custom={4} variants={FADE} className="glass-panel p-6">
        <SectionHeader icon={BookOpen} color="bg-amber-500/10 border-amber-500/20 text-amber-400" title="Pro Tips" subtitle="Get the most out of StockSense AI" />

        <div className="space-y-3">
          {tips.map(({ icon: Icon, text }, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon size={12} className="text-amber-400" />
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── 6. About ── */}
      <motion.div custom={5} variants={FADE} className="glass-panel p-6">
        <SectionHeader icon={Database} color="bg-slate-500/10 border-slate-500/20 text-slate-400" title="About StockSense AI" subtitle="Technical details and stack info" />

        <div className="space-y-0">
          {[
            ['Version',         'v4.0 — Production Grade'],
            ['Sentiment Engine','Weighted NLP v4 — Negation-aware'],
            ['Frontend',        'React 18 + Vite + Recharts + Framer Motion'],
            ['Backend',         'Node.js + Express + Axios'],
            ['Data Sources',    'NewsAPI + Finnhub + Alpha Vantage'],
            ['Strict Mode',     'ON — no silent demo fallbacks'],
            ['Deployment',      'Render (backend) + Vercel (frontend)'],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0">
              <span className="text-slate-600 text-xs font-medium">{k}</span>
              <span className="text-white text-xs font-bold text-right">{v}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-white/[0.05] flex items-center justify-between">
          <span className="text-slate-700 text-[10px]">StockSense AI — For educational use only. Not financial advice.</span>
          <span className="text-slate-700 text-[10px]">© 2025</span>
        </div>
      </motion.div>

    </motion.div>
  );
}
