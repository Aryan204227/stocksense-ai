import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

export default function StockPriceCard({ data, query }) {
  if (!data) return null;

  const isUp = data.trend === 'up';
  const TrendIcon = isUp ? TrendingUp : TrendingDown;
  const trendColor = isUp ? 'text-neon-green' : 'text-neon-red';
  const bgTrendColor = isUp ? 'bg-neon-green/10' : 'bg-neon-red/10';

  const formatCurrency = (val) => {
    if (val === undefined || val === null) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: data.currency || 'USD',
    }).format(val);
  };

  const formatPercent = (val) => {
    if (val === undefined || val === null) return 'N/A';
    return `${val > 0 ? '+' : ''}${val.toFixed(2)}%`;
  };

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 transition-opacity group-hover:opacity-40 rounded-full ${isUp ? 'bg-neon-green' : 'bg-neon-red'}`}></div>
      
      <div className="flex justify-between items-start relative z-10">
        <div>
          <h2 className="text-2xl font-bold text-white">{data.symbol}</h2>
          <p className="text-zinc-400 text-sm font-medium mt-0.5">{data.name}</p>
        </div>
        <div className={`p-3 rounded-xl ${bgTrendColor} border border-white/5`}>
          <TrendIcon className={`w-6 h-6 ${trendColor}`} />
        </div>
      </div>

      <div className="mt-6 flex items-end gap-4 relative z-10">
        <div className="text-4xl font-bold text-white tracking-tight">
          {formatCurrency(data.price)}
        </div>
        <div className={`flex items-center gap-1 font-semibold text-lg pb-1 ${trendColor}`}>
          {formatPercent(data.changePercent)}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/5 flex gap-6 relative z-10">
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Day Change</p>
          <p className={`text-sm font-medium ${trendColor}`}>{formatCurrency(data.change)}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Currency</p>
          <p className="text-sm font-medium text-zinc-300">{data.currency}</p>
        </div>
      </div>
    </div>
  );
}
