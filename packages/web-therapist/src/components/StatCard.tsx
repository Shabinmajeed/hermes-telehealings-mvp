import React from 'react';

interface StatCardProps {
  title?: string;
  label?: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
  accentColor?: string;
  iconBg?: string;
  iconColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  label,
  value,
  subtitle,
  icon,
  trend,
  accentColor = 'var(--color-brand-blue)',
  iconBg,
  iconColor,
}) => {
  const displayLabel = title || label || '';

  const iconWrapperStyle = iconBg
    ? undefined
    : { backgroundColor: `${accentColor}15` };
  const iconStyle = iconColor
    ? undefined
    : { color: accentColor };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg || ''}`}
          style={iconWrapperStyle}
        >
          {icon && (
            <span className={`w-5 h-5 flex items-center ${iconColor || ''}`} style={iconStyle}>
              {icon}
            </span>
          )}
        </div>
        {trend && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              trend.positive
                ? 'bg-status-successLight text-status-successDark'
                : 'bg-status-errorLight text-status-errorDark'
            }`}
          >
            {trend.positive ? '+' : ''}{trend.value}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-text-primary mb-0.5">{value}</p>
      <p className="text-sm font-medium text-text-secondary">{displayLabel}</p>
      {subtitle && <p className="text-xs text-text-tertiary mt-1">{subtitle}</p>}
    </div>
  );
};

export default StatCard;
