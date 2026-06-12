import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, changeType = 'neutral', icon }) => {
  const changeColor =
    changeType === 'positive'
      ? 'text-status-success'
      : changeType === 'negative'
        ? 'text-status-error'
        : 'text-text-tertiary';

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-neutral-200/60 p-5 shadow-card hover:bg-white/80 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-text-tertiary">{title}</p>
        <div className="w-10 h-10 rounded-xl bg-primary-50/80 flex items-center justify-center text-primary-600">
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-text-primary">{value}</p>
      {change && <p className={`text-xs font-medium mt-1 ${changeColor}`}>{change}</p>}
    </div>
  );
};
