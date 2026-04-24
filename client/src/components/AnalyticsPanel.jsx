import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Newspaper, ExternalLink, Activity, BarChart3, LineChart as LineChartIcon, Zap, ShieldCheck, AlertTriangle, Wifi } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';

function ConfidenceMeter({ percent, label }) {
  const color = percent >= 80 ? '#10b981' : percent >= 58 ? '#f59e0b' : '#94a3b8';
  return (
    <div className="mt-3">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Confidence Meter</span>
        <span className="text-xs font-black" style={{ color }}>{percent}% — {label}</span>
      </div>
      <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}99, ${color})` }}
        />
      </div>
    </div>
  );
}

function DataModeBanner({ dataSource, dataMode }) {
  if (dataSource === 'LIVE') return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 mb-5">
      <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"/><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"/></span>
      <span className="text-emerald-400 text-xs font-bold">🚀 LIVE DATA MODE — Real-time news &amp; prices</span>
    </div>
  );
  if (dataSource === 'DEMO' || dataMode === 'demo') return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/25 mb-5">
      <Wifi size={13} className="text-amber-400" />
      <span className="text-amber-400 text-xs font-bold">⚠️ DEMO MODE — Simulated data (not real market data)</span>
    </div>
  );
  return null;
}

const COLORS = { Positive: '#10b981', Negative: '#f43f5e', Neutral: '#475569' };

function EmptyState() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="h-[60vh] flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/[0.06] text-center p-8"
      style={{ background: 'rgba(255,255,255,0.01)' }}>
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6 shadow-lg shadow-cyan-500/10 animate-float">
        <Activity size={36} />
      </div>
      <p className="text-white text-2xl font-black tracking-tight mb-2">Awaiting Market Signal</p>
      <p className="text-slate-500 text-sm font-medium max-w-sm">Use the AI terminal to search for a stock. The sentiment engine will analyze real-time data.</p>
    </motion.div>
  );
}

function ApiErrorState({ data }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="h-[60vh] flex flex-col items-center justify-center rounded-3xl border-2 border-rose-500/20 text-center p-8"
      style={{ background: 'rgba(244,63,94,0.03)' }}>
      <div className="w-20 h-20 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-6 shadow-lg shadow-rose-500/10">
        <span className="text-4xl">❌</span>
      </div>
      <p className="text-rose-400 text-xl font-black tracking-tight mb-2">Unable to fetch data</p>
        <p className="text-slate-500 text-sm font-medium max-w-md mb-6">{data?.message || 'Unable to fetch data'}</p>
      <div className="flex flex-col items-start gap-2 px-5 py-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-left max-w-sm">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Troubleshooting</p>
        <p className="text-slate-500 text-xs">• Verify <code className="text-cyan-400 bg-cyan-500/10 px-1 rounded">NEWS_API_KEY</code> in <code className="text-cyan-400 bg-cyan-500/10 px-1 rounded">server/.env</code></p>
        <p className="text-slate-500 text-xs">• Check your NewsAPI quota at <span className="text-cyan-400">newsapi.org</span></p>
        <p className="text-slate-500 text-xs">• Free tier: 100 requests/day</p>
        <p className="text-slate-500 text-xs">• Verify both API keys are configured</p>
      </div>
    </motion.div>
  );
}

function NoDataState({ data }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="h-[60vh] flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/[0.06] text-center p-8"
      style={{ background: 'rgba(255,255,255,0.01)' }}>
      <div className="w-20 h-20 rounded-2xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center text-slate-400 mb-6">
        <span className="text-4xl">🔍</span>
      </div>
      <p className="text-slate-300 text-xl font-black tracking-tight mb-2">No Relevant News Found</p>
      <p className="text-slate-500 text-sm font-medium max-w-md mb-6">
        {data?.message || `No financial news articles were found. Try a different stock name or ticker.`}
      </p>
      <div className="flex gap-2 flex-wrap justify-center">
        {['Tesla', 'Apple', 'NVIDIA', 'Microsoft', 'TCS', 'Bitcoin'].map(s => (
          <span key={s} className="px-3 py-1.5 rounded-lg text-xs font-bold text-cyan-400 bg-cyan-500/5 border border-cyan-500/15">{s}</span>
        ))}
      </div>
    </motion.div>
  );
}

function Skeleton({ h = 'h-4', w = 'w-full', className = '' }) {
  return <div className={`skeleton ${h} ${w} rounded-xl ${className}`} />;
}

function SkeletonLayout() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-7 space-y-5">
          <div className="flex justify-between"><Skeleton h="h-5" w="w-20" /><Skeleton h="h-6" w="w-16" /></div>
          <Skeleton h="h-4" w="w-32" />
          <Skeleton h="h-10" w="w-48" />
          <Skeleton h="h-8" w="w-24" />
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
            <Skeleton h="h-10" /> <Skeleton h="h-10" /> <Skeleton h="h-10" />
          </div>
        </div>
        <div className="glass-panel p-7 flex flex-col">
          <Skeleton h="h-4" w="w-32 mb-4" />
          <div className="flex gap-5 flex-1 items-center">
            <Skeleton h="h-32" w="w-32 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <Skeleton h="h-8" w="w-3/4" />
              <Skeleton h="h-6" w="w-1/2" />
              <div className="pt-2 space-y-2"><Skeleton h="h-4" /> <Skeleton h="h-4" w="w-5/6" /></div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6"><Skeleton h="h-4" w="w-32 mb-4" /><Skeleton h="h-[110px]" /></div>
        <div className="glass-panel p-6"><Skeleton h="h-4" w="w-40 mb-4" /><Skeleton h="h-[110px]" /></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-panel h-36 flex"><Skeleton w="w-36 rounded-r-none h-full" /><div className="p-4 flex-1 space-y-2"><Skeleton h="h-3" w="w-20" /><Skeleton h="h-5" /><Skeleton h="h-10" /></div></div>
        <div className="glass-panel h-36 flex"><Skeleton w="w-36 rounded-r-none h-full" /><div className="p-4 flex-1 space-y-2"><Skeleton h="h-3" w="w-20" /><Skeleton h="h-5" /><Skeleton h="h-10" /></div></div>
      </div>
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-4 py-2.5 rounded-xl shadow-xl border border-white/10" style={{ background: '#0c1629' }}>
      <p className="text-white font-bold text-sm">{payload[0].name}</p>
      <p className="font-black text-lg" style={{ color: payload[0].payload.color }}>{payload[0].value}%</p>
    </div>
  );
};

export default function AnalyticsPanel({ data, isLoading }) {
  if (isLoading) return <SkeletonLayout />;
  if (!data)     return <EmptyState />;

  // ── Error states ──
  if (data.dataMode === 'rate-limit') {
    return <ApiErrorState data={{ message: 'API limit reached, retry in 60 seconds' }} />;
  }
  if (data.error || data.dataMode === 'api-error' || data.dataMode === 'server-error') {
    return <ApiErrorState data={data} />;
  }
  if (data.dataMode === 'key-missing') {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="h-[60vh] flex flex-col items-center justify-center rounded-3xl border-2 border-amber-500/20 text-center p-8"
        style={{ background: 'rgba(245,158,11,0.03)' }}>
        <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6">
          <span className="text-4xl">🔑</span>
        </div>
        <p className="text-amber-400 text-xl font-black tracking-tight mb-2">API Key Missing</p>
        <p className="text-slate-500 text-sm font-medium max-w-md mb-6">{data.message || 'API Key Missing'}</p>
        <div className="text-left px-5 py-4 rounded-xl bg-white/[0.03] border border-white/[0.06] max-w-sm w-full">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Setup Steps</p>
          <p className="text-slate-500 text-xs mb-1">1. Open <code className="text-cyan-400 bg-cyan-500/10 px-1 rounded">server/.env</code></p>
          <p className="text-slate-500 text-xs mb-1">2. Add: <code className="text-cyan-400 bg-cyan-500/10 px-1 rounded">{data.key}=your_key_here</code></p>
          <p className="text-slate-500 text-xs mb-3">3. Restart backend server</p>
          {data.instructions && <p className="text-cyan-400 text-xs font-medium">{data.instructions}</p>}
        </div>
      </motion.div>
    );
  }
  if (data.dataMode === 'no-data') {
    return <NoDataState data={data} />;
  }

  // ── Stock not found (invalid symbol / unknown company) ──
  if (data.dataMode === 'invalid-query' || (!data.success && data.dataSource === 'INVALID_QUERY')) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="h-[60vh] flex flex-col items-center justify-center rounded-3xl border-2 border-rose-500/20 text-center p-8"
        style={{ background: 'rgba(244,63,94,0.03)' }}>
        <div className="w-20 h-20 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-6 shadow-lg shadow-rose-500/10">
          <span className="text-4xl">🔍</span>
        </div>
        <p className="text-rose-400 text-2xl font-black tracking-tight mb-2">Stock Not Found ❌</p>
        <p className="text-slate-500 text-sm font-medium max-w-md mb-6">
          {data.message || `"${data.query}" is not a recognized stock or company.`}
        </p>
        <div className="flex flex-col gap-2 text-left px-5 py-4 rounded-xl bg-white/[0.03] border border-white/[0.06] max-w-sm w-full">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Valid Examples</p>
          <div className="flex flex-wrap gap-1.5">
            {['Tesla', 'Apple', 'NVIDIA', 'Microsoft', 'Amazon', 'TCS', 'Infosys', 'Bitcoin', 'Reliance', 'Meta'].map(s => (
              <span key={s} className="px-2.5 py-1 rounded-lg text-xs font-bold text-cyan-400 bg-cyan-500/5 border border-cyan-500/15">{s}</span>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  // ── Guard: if backend returned success=false for any reason, show error ──
  if (data.success === false) {
    return <ApiErrorState data={data} />;
  }

  // Invalid query (too short, random text, not a stock)
  if (data.dataMode === 'invalid-query') {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="h-[60vh] flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/[0.06] text-center p-8"
        style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className="w-20 h-20 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-6">
          <span className="text-4xl">⚠️</span>
        </div>
        <p className="text-violet-400 text-xl font-black tracking-tight mb-2">Invalid Search</p>
        <p className="text-slate-500 text-sm font-medium max-w-md mb-6">{data.message}</p>
        <div className="flex gap-2 flex-wrap justify-center">
          {['Tesla', 'Apple', 'NVIDIA', 'Microsoft', 'TCS', 'Bitcoin', 'Infosys', 'Reliance'].map(s => (
            <span key={s} className="px-3 py-1.5 rounded-lg text-xs font-bold text-cyan-400 bg-cyan-500/5 border border-cyan-500/15">{s}</span>
          ))}
        </div>
      </motion.div>
    );
  }
  if (!data.success && !data.stockData && !data.sentiment) {
    return <ApiErrorState data={data} />;
  };

  const { stockData: s, sentiment, articles, priceHistory } = data;
  const isUp = s?.trend === 'up';

  const pieData = [
    { name: 'Positive', value: sentiment?.distribution?.positive || 0, color: COLORS.Positive },
    { name: 'Negative', value: sentiment?.distribution?.negative || 0, color: COLORS.Negative },
    { name: 'Neutral',  value: sentiment?.distribution?.neutral  || 0, color: COLORS.Neutral  },
  ].filter(d => d.value > 0);

  const sparkData = articles?.slice(0, 8).map((a, i) => ({
    i, score: a.score !== undefined ? Math.max(-5, Math.min(5, a.score)) : 0
  })) || [];

  const liveIndicator =
    data.dataSource === 'LIVE'
      ? { text: 'Live Data 🚀', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' }
    : data.dataSource === 'DEMO' || data.dataMode === 'demo'
      ? { text: 'Demo Mode 🧪', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' }
      : { text: 'Unable to fetch data', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

      {/* ── Data Mode Banner ── */}
      <DataModeBanner dataSource={data.dataSource} dataMode={data.dataMode} />

      {/* ── Row 1: Stock + Sentiment ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Stock Price Card */}
        <div className="glass-panel p-7 relative overflow-hidden group">
          <div className="absolute -top-8 -right-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500 pointer-events-none">
            {isUp ? <TrendingUp size={160} /> : <TrendingDown size={160} />}
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5">
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${liveIndicator.color} ${liveIndicator.bg} ${liveIndicator.border}`}>
                {liveIndicator.text}
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-black text-cyan-400 bg-cyan-500/10 border border-cyan-500/20">
                {s?.symbol || '—'}
              </span>
            </div>
            <p className="text-slate-400 font-semibold mb-1 truncate">{s?.name || '—'}</p>
            {s?.price !== undefined ? (
              <>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-black text-white tracking-tight neon-number">
                    {s?.currency === 'INR' ? '₹' : '$'}{Number(s?.price).toLocaleString()}
                  </span>
                </div>
                <div className={`inline-flex items-center gap-2 text-sm font-bold px-3 py-1.5 rounded-xl border ${
                  isUp ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}>
                  {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {s?.change > 0 ? '+' : ''}{s?.change} ({s?.changePercent}%)
                </div>
              </>
            ) : <div className="py-3 text-rose-400 text-sm font-bold">Unable to fetch data</div>}
            <div className="mt-5 pt-4 border-t border-white/5 grid grid-cols-3 gap-4">
              {[
                { label: 'Articles',    value: `${articles?.length || 0} ${data.liveNews ? '📡' : '🧪'}` },
                { label: 'Confidence',  value: sentiment?.confidence },
                { label: 'Score',       value: sentiment?.avgScore !== undefined ? (sentiment.avgScore > 0 ? `+${sentiment.avgScore}` : `${sentiment.avgScore}`) : 'N/A' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">{label}</p>
                  <p className="text-white font-black text-base">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sentiment Verdict Card */}
        <div className="glass-panel p-7 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-violet-400" /> AI Verdict
            </span>
          </div>
          <div className="flex items-center gap-5 flex-1">
            <div className="w-36 h-36 flex-shrink-0 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={62} paddingAngle={4} dataKey="value" stroke="none">
                    {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-3xl filter drop-shadow-md">{sentiment?.emoji}</span>
              </div>
            </div>
            <div className="flex-1 space-y-1">
              <p className={`text-2xl font-black mb-2 tracking-tight ${
                sentiment?.color === 'emerald' || sentiment?.color === 'green' ? 'text-emerald-400' :
                sentiment?.color === 'red' || sentiment?.color === 'rose' ? 'text-rose-400' : 'text-slate-300'
              }`}>{sentiment?.overall}</p>

              <div className="flex items-center gap-1.5 mb-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  sentiment?.confidenceLabel === 'High' ? 'bg-emerald-500/20 text-emerald-400' :
                  sentiment?.confidenceLabel === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-500/20 text-slate-400'
                }`}>
                  {sentiment?.confidenceLabel} Confidence
                </span>
              </div>
              {sentiment?.confidencePercent > 0 && (
                <ConfidenceMeter percent={sentiment.confidencePercent} label={sentiment.confidenceLabel} />
              )}

              <div className="mt-4 space-y-2">
                {pieData.map(d => (
                  <div key={d.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                      <span className="text-slate-400 font-medium text-xs">{d.name}</span>
                    </div>
                    <span className="font-bold text-white text-xs px-2 py-0.5 rounded-md" style={{ background: 'rgba(255,255,255,0.05)' }}>{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 2: Charts ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stock Price History */}
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <LineChartIcon size={15} />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">30-Day Price Trend</h3>
                <span className={`text-xs block leading-none mt-0.5 ${priceHistory ? 'text-emerald-500' : 'text-slate-600'}`}>
                  {priceHistory ? '✓ Real market data (Finnhub)' : 'Unable to fetch data'}
                </span>
              </div>
            </div>
          </div>
          {priceHistory && priceHistory.length >= 2 ? (
            <ResponsiveContainer width="100%" height={110}>
              <LineChart data={priceHistory} margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="date" hide />
                <YAxis domain={['auto', 'auto']} tick={{ fill: '#334155', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#0c1629', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 12 }}
                  itemStyle={{ color: '#fff' }} formatter={(v) => [`$${v}`, 'Close Price']} />
                <Line type="monotone" dataKey="price" stroke={isUp ? "#10b981" : "#f43f5e"} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[110px] flex flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/10">
              <><p className="text-rose-400 text-xs font-bold">Unable to fetch data</p></>
            </div>
          )}
        </div>

        {/* Sentiment Sparkline */}
        <div className="glass-panel p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <BarChart3 size={15} />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">Article Sentiment Scores</h3>
              <span className="text-xs text-slate-600 block leading-none mt-0.5">({sparkData.length} top articles)</span>
            </div>
          </div>
          {sparkData.length > 1 ? (
            <ResponsiveContainer width="100%" height={110}>
              <AreaChart data={sparkData} margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="i" hide />
                <YAxis domain={[-5, 5]} tick={{ fill: '#334155', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#0c1629', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 12 }}
                  itemStyle={{ color: '#fff' }} formatter={(v) => [v.toFixed(1), 'Score']} />
                <Area type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={2} fill="url(#scoreGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[110px] flex items-center justify-center text-slate-600 text-xs">Not enough articles for chart</div>
          )}
        </div>
      </div>

      {/* ── Key Topics ── */}
      {sentiment?.topKeywords && (sentiment.topKeywords.positive.length > 0 || sentiment.topKeywords.negative.length > 0) && (
        <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-2">
          {sentiment.topKeywords.positive.map(k => (
            <span key={`p-${k}`} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex-shrink-0 flex items-center gap-1.5">
              <TrendingUp size={11} /> {k}
            </span>
          ))}
          {sentiment.topKeywords.negative.map(k => (
            <span key={`n-${k}`} className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold flex-shrink-0 flex items-center gap-1.5">
              <TrendingDown size={11} /> {k}
            </span>
          ))}
        </div>
      )}

      {/* ── News Feed ── */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Newspaper size={17} />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg leading-none">Market Intelligence</h3>
              <span className="text-xs text-slate-500 font-medium block mt-1">Filtered & deduplicated sources</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AnimatePresence>
            {(articles || []).map((article, i) => {
              const isPos = article.sentiment === 'Positive';
              const isNeg = article.sentiment === 'Negative';
              return (
                <motion.a key={i} href={article.url && article.url !== '#' ? article.url : undefined}
                  target="_blank" rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="glass-panel group relative flex flex-col sm:flex-row overflow-hidden hover:border-cyan-500/30 cursor-pointer h-auto sm:h-36">
                  
                  {/* Image */}
                  <div className="h-36 sm:h-full w-full sm:w-36 overflow-hidden relative flex-shrink-0">
                    {article.urlToImage ? (
                      <img src={article.urlToImage} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#0a1628,#0c1a30)' }}>
                        <Newspaper size={32} className="text-slate-800" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2 sm:hidden">
                      <span className="text-[10px] font-bold text-slate-300 px-2 py-1 rounded-md border border-white/10" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
                        {article.source}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] text-slate-500 font-bold hidden sm:block truncate pr-2">
                        {article.source} • {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recent'}
                      </p>
                      {article.sentiment && (
                        <span className={`flex-shrink-0 ${isPos ? 'badge-positive' : isNeg ? 'badge-negative' : 'badge-neutral'}`}>
                          {article.sentiment}
                        </span>
                      )}
                    </div>
                    
                    <h4 className="text-white font-bold leading-snug group-hover:text-cyan-400 transition-colors mb-2 line-clamp-2 text-sm" title={article.title}>
                      {article.title}
                    </h4>
                    
                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mb-3 flex-1 hidden sm:webkit-box">
                      {article.description || 'No summary available.'}
                    </p>

                    <div className="flex items-center pt-2 border-t border-white/5 mt-auto">
                      <span className="text-[10px] font-bold text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1.5 uppercase tracking-wider">
                        Read Article <ExternalLink size={10} />
                      </span>
                    </div>
                  </div>
                </motion.a>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
