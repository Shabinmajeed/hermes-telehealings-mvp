import React from 'react';

type StatusVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface StatusBadgeProps {
  label: string;
  variant?: StatusVariant;
}

const variantClasses: Record<StatusVariant, string> = {
  success: 'bg-status-successLight text-status-successDark',
  warning: 'bg-status-warningLight text-status-warningDark',
  error: 'bg-status-errorLight text-status-errorDark',
  info: 'bg-status-infoLight text-primary-700',
  neutral: 'bg-neutral-100 text-neutral-600',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ label, variant = 'neutral' }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${variantClasses[variant]}`}>
      {label}
    </span>
  );
};
