import React from 'react';

interface FilterBarProps {
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  children?: React.ReactNode;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchPlaceholder = 'Search...',
  onSearch,
  children,
}) => {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="relative flex-1 max-w-sm">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder={searchPlaceholder}
          onChange={(e) => onSearch?.(e.target.value)}
          className="w-full py-2.5 pl-10 pr-3 rounded-lg border border-neutral-200 bg-white text-sm outline-none focus:border-primary-500 transition-colors"
        />
      </div>
      {children}
    </div>
  );
};
