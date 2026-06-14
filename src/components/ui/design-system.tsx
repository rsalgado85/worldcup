import { motion } from 'framer-motion';
import type { ReactNode, ComponentType } from 'react';

/* ═══════════════════════════════════════════
   Shared Design System Components
   WorldCup Insight 2026
   ═══════════════════════════════════════════ */

// ─── Page Wrapper: consistent container for all pages ───
export function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="p-5 sm:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6 lg:space-y-8 pb-20">
      {children}
    </div>
  );
}

// ─── Page Header: standardized header with icon + title + subtitle ───
export function PageHeader({
  icon: Icon,
  title,
  subtitle,
  iconColor = 'text-accent-teal',
}: {
  icon: ComponentType<{ size?: number; className?: string }>;
  title: string;
  subtitle?: string;
  iconColor?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-1.5"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent-teal/10 border border-accent-teal/20 flex items-center justify-center flex-shrink-0">
          <Icon size={20} className={iconColor} />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-sm text-text-secondary mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Stats KPI grid (HyruleDex style) ───
export function StatsGrid({
  items,
  columns = 4,
}: {
  items: { icon: ComponentType<{ size?: number; className?: string }>; value: string | number; label: string; color?: string; subtitle?: string }[];
  columns?: 2 | 3 | 4;
}) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-3`}>
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.4 }}
          className="rounded-2xl p-5 text-center border transition-all hover:scale-[1.02] cursor-default"
          style={{
            background: `linear-gradient(145deg, ${item.color || '#14B8A6'}0A, ${item.color || '#14B8A6'}04)`,
            borderColor: `${item.color || '#14B8A6'}15`,
          }}
        >
          {/* Icon + label row */}
          <div className="flex items-center justify-center gap-2 mb-3" style={{ color: item.color || '#14B8A6' }}>
            <item.icon size={18} />
            <span className="text-[11px] font-semibold uppercase tracking-wider opacity-80">{item.label}</span>
          </div>

          {/* Large number */}
          <p className="text-3xl sm:text-4xl font-black text-white leading-none mb-1.5">{item.value}</p>

          {/* Subtitle */}
          {item.subtitle && (
            <p className="text-[10px] text-text-muted">{item.subtitle}</p>
          )}
        </motion.div>
      ))}
    </div>
  );
}

// ─── Empty State ───
export function EmptyState({
  icon: Icon,
  message,
}: {
  icon: ComponentType<{ size?: number; className?: string }>;
  message: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Icon size={48} className="text-text-dim/20 mb-4" />
      <p className="text-sm text-text-muted">{message}</p>
    </div>
  );
}

// ─── Search Input ───
export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative max-w-md">
      <svg
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
        width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-navy-700/50 border border-border-card rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-accent-teal/30 transition-colors"
      />
    </div>
  );
}

// ─── Section Header ───
export function SectionHeader({
  icon: Icon,
  title,
  badge,
}: {
  icon?: ComponentType<{ size?: number; className?: string }>;
  title: string;
  badge?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {Icon && <Icon size={18} className="text-accent-teal" />}
      <h2 className="text-sm font-bold uppercase tracking-wider text-accent-teal">{title}</h2>
      {badge && (
        <span className="badge badge-teal text-[9px]">{badge}</span>
      )}
    </div>
  );
}

// ─── Filter Tabs ───
export function FilterTabs<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { key: T; label: string; icon?: ComponentType<{ size?: number }> }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            value === opt.key
              ? 'bg-accent-teal/15 text-accent-teal border border-accent-teal/20'
              : 'bg-navy-700/30 text-text-secondary hover:bg-navy-700/50 border border-transparent'
          }`}
        >
          {opt.icon && <opt.icon size={14} />}
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── Loading Spinner ───
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-accent-teal border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
