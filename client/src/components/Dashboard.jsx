import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Sidebar from './Sidebar.jsx';
import AnalyticsPanel from './AnalyticsPanel.jsx';
import ChatPanel from './ChatPanel.jsx';
import MarketsPage from './MarketsPage.jsx';
import SettingsPage from './SettingsPage.jsx';

function LiveClock() {
  const [time, setTime] = React.useState(new Date());
  React.useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="hidden md:flex items-center gap-1.5 text-slate-600 text-xs font-mono">
      <Clock size={11} />
      {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </div>
  );
}

function DataModeTag({ data }) {
  if (!data) return null;
  if (data.error || data.dataMode === 'api-error' || data.dataMode === 'server-error') {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/40 text-rose-400 text-xs font-bold">
        <span className="w-2 h-2 rounded-full bg-rose-400" />
        ❌ API Error Mode
      </div>
    );
  }
  if (data.dataMode === 'rate-limit') {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-400 text-xs font-bold">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        ⏱ Rate Limited
      </div>
    );
  }
  if (data.dataMode === 'key-missing') {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-400 text-xs font-bold">
        <span className="w-2 h-2 rounded-full bg-amber-400" />
        🔑 API Key Missing
      </div>
    );
  }
  if (data.dataSource === 'DEMO' || data.dataMode === 'demo') {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-400 text-xs font-bold">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        ⚠️ Demo Mode
      </div>
    );
  }
  if (data.dataSource === 'LIVE') {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold">
        <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"/><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"/></span>
        🚀 Live Data Mode
      </div>
    );
  }
  return null;
}

function RecentAnalysisBar({ history }) {
  if (!history || history.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-6 lg:px-10 py-2.5 border-b border-white/[0.03] flex items-center gap-3 overflow-x-auto custom-scrollbar"
      style={{ background: 'rgba(2,8,23,0.6)' }}
    >
      <span className="text-[9px] font-bold text-slate-700 uppercase tracking-widest flex-shrink-0 flex items-center gap-1">
        <Clock size={8} /> Recent
      </span>
      {history.map((item, i) => {
        const isPos = item.sentiment?.includes('Positive');
        const isNeg = item.sentiment?.includes('Negative');
        return (
          <div key={`${item.query}-${i}`}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border flex-shrink-0 text-xs font-bold"
            style={{
              background: isPos ? 'rgba(16,185,129,0.06)' : isNeg ? 'rgba(244,63,94,0.06)' : 'rgba(255,255,255,0.04)',
              borderColor: isPos ? 'rgba(16,185,129,0.2)' : isNeg ? 'rgba(244,63,94,0.2)' : 'rgba(255,255,255,0.07)',
              color: isPos ? '#10b981' : isNeg ? '#f43f5e' : '#94a3b8',
            }}
          >
            {isPos ? <TrendingUp size={9} /> : isNeg ? <TrendingDown size={9} /> : <Minus size={9} />}
            {item.query}
            {item.confidence && <span className="opacity-60 text-[9px]">{item.confidence}</span>}
          </div>
        );
      })}
    </motion.div>
  );
}

export default function Dashboard({ user, onLogout }) {
  const [analysisData, setAnalysisData]   = useState(null);
  const [activePage, setActivePage]       = useState('terminal');
  const [isLoading, setIsLoading]         = useState(false);
  const [recentHistory, setRecentHistory] = useState([]);
  const [runtimeMode, setRuntimeMode] = useState(() => localStorage.getItem('ss_runtime_mode') || 'live');

  const PAGE_TITLES = {
    terminal: { title: 'Market Terminal',  sub: 'Real-time AI sentiment analysis' },
    markets:  { title: 'Global Markets',   sub: 'Live market indices & trends' },
    settings: { title: 'Settings',         sub: 'API keys & system preferences' },
  };
  const { title, sub } = PAGE_TITLES[activePage] || PAGE_TITLES.terminal;

  const handleAnalysisComplete = (data) => {
    setAnalysisData(data);
    if (data?.success && data.query) {
      setRecentHistory(prev => {
        const filtered = prev.filter(h => h.query.toLowerCase() !== data.query.toLowerCase());
        return [
          {
            query:      data.query,
            sentiment:  data.sentiment?.overall || 'Neutral',
            confidence: data.sentiment?.confidence,
            emoji:      data.sentiment?.emoji,
          },
          ...filtered,
        ].slice(0, 6);
      });
    }
  };

  const toggleMode = () => {
    const next = runtimeMode === 'live' ? 'demo' : 'live';
    setRuntimeMode(next);
    localStorage.setItem('ss_runtime_mode', next);
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#020817' }}>
      <Sidebar user={user} onLogout={onLogout} activePage={activePage} onNavigate={setActivePage} />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Ambient glows */}
        <div className="absolute top-0 left-1/3 w-[600px] h-[300px] bg-cyan-500/[0.04] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[250px] bg-violet-500/[0.04] rounded-full blur-[100px] pointer-events-none" />

        {/* Fixed top header */}
        <div className="flex-shrink-0 relative z-20">
          <div className="px-6 lg:px-10 py-4 border-b border-white/[0.04] flex items-center justify-between"
            style={{ background: 'rgba(2,8,23,0.9)', backdropFilter: 'blur(20px)' }}>
            <div>
              <h2 className="text-xl lg:text-2xl font-black text-white tracking-tight">{title}</h2>
              <p className="text-slate-600 text-xs mt-0.5 font-medium">{sub}</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleMode}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  runtimeMode === 'live'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-violet-500/10 text-violet-400 border-violet-500/30'
                }`}
                title="Toggle Live/Demo Mode"
              >
                {runtimeMode === 'live' ? 'Live Market Mode' : 'Demo Mode'}
              </button>
              <LiveClock />
              <AnimatePresence mode="wait">
                {analysisData && activePage === 'terminal' && (
                  <motion.div key="mode-tag"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}>
                    <DataModeTag data={analysisData} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Recent Analysis Bar — only on terminal page */}
          <AnimatePresence>
            {activePage === 'terminal' && recentHistory.length > 0 && (
              <RecentAnalysisBar history={recentHistory} />
            )}
          </AnimatePresence>
        </div>

        {/* Scrollable content + chat panel */}
        <div className="flex-1 flex overflow-hidden relative z-10">
          {/* Main content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-6 lg:p-10">
              <div className="max-w-5xl mx-auto">
                <AnimatePresence mode="wait">
                  {activePage === 'terminal' && (
                    <motion.div key="terminal"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <AnalyticsPanel data={analysisData} isLoading={isLoading} />
                    </motion.div>
                  )}
                  {activePage === 'markets' && (
                    <motion.div key="markets"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <MarketsPage runtimeMode={runtimeMode} />
                    </motion.div>
                  )}
                  {activePage === 'settings' && (
                    <motion.div key="settings"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <SettingsPage runtimeMode={runtimeMode} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Chat panel — only on terminal */}
          <AnimatePresence>
            {activePage === 'terminal' && (
              <motion.div key="chat"
                initial={{ x: 60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 60, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-[300px] xl:w-[360px] flex-shrink-0 flex flex-col"
                style={{ borderLeft: '1px solid rgba(255,255,255,0.05)', boxShadow: '-10px 0 40px rgba(0,0,0,0.3)' }}>
                <ChatPanel
                  userName={user}
                  onAnalysisComplete={handleAnalysisComplete}
                  onLoadingChange={setIsLoading}
                  runtimeMode={runtimeMode}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
