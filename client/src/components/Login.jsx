import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Activity, ArrowRight, BarChart2, ShieldCheck, Zap, Globe } from 'lucide-react';

const TICKERS = [
  { s: 'AAPL', p: '172.45', c: '+1.2%', up: true },
  { s: 'TSLA', p: '198.20', c: '+3.4%', up: true },
  { s: 'NVDA', p: '875.60', c: '+5.1%', up: true },
  { s: 'MSFT', p: '419.30', c: '+0.8%', up: true },
  { s: 'AMZN', p: '185.70', c: '-0.5%', up: false },
  { s: 'GOOGL',p: '174.10', c: '+1.9%', up: true },
  { s: 'META', p: '512.40', c: '+2.3%', up: true },
  { s: 'NIFTY',p: '22,147',c: '+0.4%', up: true },
  { s: 'BTC',  p: '68,420', c: '+1.8%', up: true },
];

const FEATURES = [
  { icon: BarChart2, label: 'Real-time Analytics', color: 'text-cyan-400' },
  { icon: ShieldCheck, label: 'AI-Powered Insights', color: 'text-violet-400' },
  { icon: Activity,   label: 'Live Sentiment Engine', color: 'text-emerald-400' },
  { icon: Globe,      label: 'Global Markets', color: 'text-amber-400' },
];

function TickerBar() {
  const doubled = [...TICKERS, ...TICKERS];
  return (
    <div className="ticker-wrap border-t border-white/5 bg-black/40 py-2">
      <div className="ticker-inner gap-8 px-4">
        {doubled.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-2 mr-8 text-xs font-bold">
            <span className="text-slate-500">{t.s}</span>
            <span className="text-white font-black">${t.p}</span>
            <span className={t.up ? 'text-emerald-400' : 'text-rose-400'}>{t.c}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Login({ onLogin }) {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!name.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => { onLogin(name.trim()); setIsSubmitting(false); }, 900);
  };

  const showError = touched && !name.trim();

  return (
    <div className="min-h-screen flex flex-col overflow-hidden relative">
      {/* Animated mesh background */}
      <div className="absolute inset-0 grid-bg opacity-100 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[600px] bg-cyan-500/8 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[500px] bg-violet-500/8 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Header bar */}
      <div className="relative z-10 flex items-center justify-between px-8 py-4 border-b border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <TrendingUp size={18} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <span className="font-black text-white text-base tracking-tight">StockSense</span>
            <span className="font-black text-base tracking-tight bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent"> AI</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          LIVE
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: Hero text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold mb-6">
              <Zap size={12} />
              AI-POWERED MARKET INTELLIGENCE
            </div>
            <h1 className="text-6xl font-black text-white tracking-tight leading-[1.05] mb-6">
              Trade Smarter<br />
              <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent animate-gradient">
                With AI Insight
              </span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-md">
              Real-time sentiment analysis powered by AI. Analyze any stock, get market confidence scores, and stay ahead of the curve.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {FEATURES.map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <Icon size={16} className={color} />
                  <span className="text-slate-300 text-sm font-medium">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Login card */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            <div className="glass-panel p-10 relative overflow-hidden gradient-border">
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-violet-500 to-emerald-500 animate-gradient" />

              {/* Watermark */}
              <div className="absolute -bottom-8 -right-8 opacity-[0.03] pointer-events-none rotate-12">
                <TrendingUp size={200} />
              </div>

              <div className="relative z-10">
                {/* Brand (mobile) */}
                <div className="lg:hidden text-center mb-8">
                  <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 items-center justify-center shadow-lg shadow-cyan-500/30 animate-neon mb-4">
                    <TrendingUp size={28} className="text-white" strokeWidth={2.5} />
                  </div>
                  <h1 className="text-3xl font-black text-white">
                    Stock<span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">Sense</span> AI
                  </h1>
                </div>

                <div className="hidden lg:block mb-8">
                  <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 items-center justify-center shadow-lg shadow-cyan-500/30 animate-neon mb-4">
                    <TrendingUp size={24} className="text-white" strokeWidth={2.5} />
                  </div>
                  <h2 className="text-2xl font-black text-white mb-1">Access Terminal</h2>
                  <p className="text-slate-500 text-sm">Enter your analyst credentials</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
                      Analyst Name
                    </label>
                    <input
                      id="analyst-name"
                      type="text"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setTouched(false); }}
                      onBlur={() => setTouched(true)}
                      placeholder="Enter your name to access terminal..."
                      className={`glass-input ${showError ? 'border-rose-500/60 focus:ring-rose-500/30' : ''}`}
                      autoComplete="off"
                      autoFocus
                    />
                    <AnimatePresence>
                      {showError && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className="text-rose-400 text-xs font-semibold ml-1">
                          Please enter your analyst name to continue.
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <button id="launch-btn" type="submit" disabled={isSubmitting}
                    className="w-full neon-button flex items-center justify-center gap-2.5 text-base py-4">
                    {isSubmitting ? (
                      <>
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}>
                          <Activity size={20} />
                        </motion.div>
                        Launching Terminal...
                      </>
                    ) : (
                      <>Launch Terminal <ArrowRight size={18} /></>
                    )}
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-3 gap-4 text-center text-xs">
                  {[
                    { dot: 'bg-emerald-400', shadow: 'shadow-[0_0_8px_rgba(16,185,129,0.8)]', label: 'Live API Mode' },
                    { dot: 'bg-amber-400',   shadow: 'shadow-[0_0_8px_rgba(245,158,11,0.6)]',  label: 'API Key Validation' },
                    { dot: 'bg-violet-400',  shadow: 'shadow-[0_0_8px_rgba(139,92,246,0.6)]',  label: 'Live Sentiment AI' },
                  ].map(({ dot, shadow, label }) => (
                    <div key={label} className="flex flex-col items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${dot} ${shadow}`} />
                      <span className="text-slate-500 font-medium">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-center text-[11px] text-slate-700 mt-5 font-medium">
              Powered by NewsAPI · Finnhub · AI Sentiment Engine
            </p>
          </motion.div>
        </div>
      </div>

      {/* Ticker bar at bottom */}
      <div className="relative z-10">
        <TickerBar />
      </div>
    </div>
  );
}
