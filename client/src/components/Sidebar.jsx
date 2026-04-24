import React from 'react';
import { LayoutDashboard, Globe, Settings, LogOut, TrendingUp, ChevronRight, Wifi } from 'lucide-react';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { id: 'terminal', icon: LayoutDashboard, label: 'Terminal',  color: 'cyan' },
  { id: 'markets',  icon: Globe,           label: 'Markets',   color: 'violet' },
  { id: 'settings', icon: Settings,        label: 'Settings',  color: 'emerald' },
];

export default function Sidebar({ user, onLogout, activePage, onNavigate }) {
  return (
    <aside className="w-[68px] lg:w-64 flex-shrink-0 flex flex-col h-full z-20 relative"
      style={{ background: 'linear-gradient(180deg, #020c1a 0%, #030d1c 100%)', borderRight: '1px solid rgba(255,255,255,0.05)' }}>

      {/* Top glow accent */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
      <div className="absolute top-0 left-0 w-full h-48 bg-cyan-500/[0.03] rounded-b-full blur-2xl pointer-events-none" />

      {/* Brand */}
      <div className="h-[72px] flex items-center justify-center lg:justify-start lg:px-5 border-b border-white/[0.05] flex-shrink-0 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 flex-shrink-0 animate-neon">
            <TrendingUp size={20} strokeWidth={2.5} />
          </div>
          <div className="hidden lg:block">
            <div className="font-black text-white text-[17px] tracking-tight leading-none">StockSense</div>
            <div className="text-[10px] font-bold text-cyan-400/60 uppercase tracking-[0.2em] mt-0.5">AI Platform</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2.5 space-y-1 relative z-10">
        <p className="hidden lg:block text-[9px] font-bold text-slate-700 uppercase tracking-[0.25em] px-3 mb-3 mt-2">
          Navigation
        </p>
        {NAV_ITEMS.map(({ id, icon: Icon, label, color }) => {
          const isActive = activePage === id;
          const colorMap = {
            cyan:   { bg: 'from-cyan-500/15 to-cyan-500/5',   border: 'border-cyan-500/25',   text: 'text-cyan-400',   bar: 'from-cyan-400 to-cyan-600' },
            violet: { bg: 'from-violet-500/15 to-violet-500/5',border: 'border-violet-500/25', text: 'text-violet-400', bar: 'from-violet-400 to-violet-600' },
            emerald:{ bg: 'from-emerald-500/15 to-emerald-500/5',border:'border-emerald-500/25',text: 'text-emerald-400',bar: 'from-emerald-400 to-emerald-600' },
          }[color];

          return (
            <button key={id} id={`nav-${id}`} onClick={() => onNavigate(id)}
              className={`w-full flex items-center justify-center lg:justify-start gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                isActive
                  ? `bg-gradient-to-r ${colorMap.bg} border ${colorMap.border} text-white`
                  : 'border border-transparent text-slate-600 hover:text-slate-300 hover:bg-white/[0.03]'
              }`}>
              {isActive && (
                <motion.div layoutId="activeNav"
                  className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 bg-gradient-to-b ${colorMap.bar} rounded-r-full`}
                />
              )}
              <Icon size={18} className={`flex-shrink-0 transition-colors ${isActive ? colorMap.text : 'text-slate-600 group-hover:text-slate-400'}`} />
              <span className={`font-semibold text-sm hidden lg:block flex-1 text-left ${isActive ? 'text-white' : ''}`}>{label}</span>
              {isActive && <ChevronRight size={13} className={`${colorMap.text} opacity-60 hidden lg:block`} />}
            </button>
          );
        })}
      </nav>

      {/* System status */}
      <div className="hidden lg:block px-3 mb-2 relative z-10">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/10">
          <div className="relative flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 block shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-50" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">System Online</p>
            <p className="text-[10px] text-slate-600 font-medium">All services running</p>
          </div>
          <Wifi size={12} className="text-emerald-500/50 flex-shrink-0" />
        </div>
      </div>

      {/* User */}
      <div className="p-3 border-t border-white/[0.05] relative z-10">
        <div className="flex items-center justify-center lg:justify-start gap-3 mb-2.5 px-1">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex-shrink-0 flex items-center justify-center text-white font-black text-sm shadow-md shadow-violet-500/20">
            {user?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="hidden lg:block min-w-0">
            <p className="text-sm font-bold text-white truncate">{user}</p>
            <p className="text-[11px] text-slate-600 font-medium">Senior Analyst</p>
          </div>
        </div>
        <button id="logout-btn" onClick={onLogout}
          className="w-full flex items-center justify-center lg:justify-start gap-2 px-3 py-2 rounded-xl text-slate-600 hover:text-rose-400 hover:bg-rose-500/[0.07] transition-all text-sm font-semibold group">
          <LogOut size={15} className="flex-shrink-0 transition-transform group-hover:-translate-x-0.5" />
          <span className="hidden lg:block">Secure Logout</span>
        </button>
      </div>
    </aside>
  );
}
