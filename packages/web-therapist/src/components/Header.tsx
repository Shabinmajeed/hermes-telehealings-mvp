import React from 'react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="h-16 bg-white/60 backdrop-blur-sm border-b border-neutral-200/50 flex items-center justify-between px-8 flex-shrink-0">
      <div>
        {title ? (
          <>
            <h1 className="text-lg font-bold text-text-primary">{title}</h1>
            {subtitle && <p className="text-xs text-neutral-500">{subtitle}</p>}
          </>
        ) : (
          <p className="text-sm text-neutral-500">{dateStr}</p>
        )}
      </div>
      <div className="flex items-center gap-4">
        <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-neutral-100/50 transition-colors relative">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-status-error rounded-full border-2 border-white" />
        </button>
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-neutral-200/50 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-text-primary">Dr. Sarah Miller</p>
            <p className="text-xs text-neutral-500">Therapist</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
