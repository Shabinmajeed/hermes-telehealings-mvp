import React from 'react';

type StatusVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface StatusBadgeProps {
  label: string;
  status?: StatusVariant;
  variant?: StatusVariant;
  dot?: boolean;
}

const variantStyles: Record<StatusVariant, { bg: string; text: string; dot: string }> = {
  success: {
    bg: 'bg-status-successLight',
    text: 'text-status-successDark',
    dot: 'bg-status-success',
  },
  warning: {
    bg: 'bg-status-warningLight',
    text: 'text-status-warningDark',
    dot: 'bg-status-warning',
  },
  error: {
    bg: 'bg-status-errorLight',
    text: 'text-status-errorDark',
    dot: 'bg-status-error',
  },
  info: {
    bg: 'bg-status-infoLight',
    text: 'text-status-info',
    dot: 'bg-status-info',
  },
  neutral: {
    bg: 'bg-neutral-100',
    text: 'text-neutral-600',
    dot: 'bg-neutral-400',
  },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  status,
  variant = 'neutral',
  dot = true,
}) => {
  const resolved = status || variant;
  const styles = variantStyles[resolved];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${styles.bg} ${styles.text}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />}
      {label}
    </span>
  );
};

export default StatusBadge;
