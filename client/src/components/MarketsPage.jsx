import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function MarketsPage({ runtimeMode = 'live' }) {
  const [refreshed, setRefreshed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [markets, setMarkets] = useState([]);
  const [clock, setClock] = useState(new Date());

  const fetchMarkets = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/markets?mode=${encodeURIComponent(runtimeMode)}`, { signal: AbortSignal.timeout(20000) });
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.message || 'Unable to fetch data');
      }
      setMarkets(json.markets || []);
    } catch (err) {
      setMarkets([]);
      setError(err.message === 'RATE_LIMIT' ? 'API limit reached, retry in 60 seconds' : (err.message || 'Unable to fetch data'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarkets();
  }, [runtimeMode]);

  useEffect(() => {
    const tick = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    const autoRefresh = setInterval(() => {
      fetchMarkets();
    }, runtimeMode === 'live' ? 30000 : 45000);
    return () => clearInterval(autoRefresh);
  }, [runtimeMode]);

  const handleRefresh = () => {
    setRefreshed(true);
    fetchMarkets();
    setTimeout(() => setRefreshed(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Global Markets</h2>
          <p className="text-slate-600 text-sm mt-1">
            {runtimeMode === 'live' ? 'Live market snapshot' : 'Demo market snapshot'} · {clock.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleRefresh}
            className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.07] text-slate-500 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
            title="Refresh data">
            <RefreshCw size={14} className={refreshed ? 'animate-spin text-cyan-400' : ''} />
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-300 text-sm font-semibold">
          {error}
        </div>
      )}

      {loading && (
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-8 text-center text-slate-500 text-sm">
          Loading live market data...
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {markets.map((m, i) => (
            <motion.div key={m.symbol}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel p-5 group hover:-translate-y-1 transition-transform duration-200 relative overflow-hidden">
              <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${m.trend === 'up' ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`} />
              <div className="flex items-start justify-between mb-3 relative z-10">
                <div>
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">{m.symbol}</p>
                  <p className="text-white font-semibold text-sm mt-0.5">{m.name || m.symbol}</p>
                </div>
                <div className={`p-1.5 rounded-lg ${m.trend === 'up' ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
                  {m.trend === 'up'
                    ? <TrendingUp size={13} className="text-emerald-400" />
                    : <TrendingDown size={13} className="text-rose-400" />}
                </div>
              </div>
              <p className="text-xl font-black text-white mb-1 neon-number relative z-10">${Number(m.price).toLocaleString()}</p>
              <p className={`text-xs font-bold relative z-10 ${m.trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {m.change > 0 ? '+' : ''}{m.change} <span className="opacity-60">({m.changePercent}%)</span>
              </p>
            </motion.div>
          ))}
        </div>
      )}

      <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
        <Globe size={13} className="text-slate-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-slate-600 font-medium">
          Data is pulled from live providers only. Configure keys in{' '}
          <code className="text-cyan-400 bg-cyan-500/10 px-1 rounded">server/.env</code> for real-time quotes.
        </p>
      </div>
    </motion.div>
  );
}
