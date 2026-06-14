import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Home, BarChart3, UserRound, X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const navItems = [
  { path: '/', label: 'INICIO', icon: Home },
  { path: '/resumen', label: 'RESUMEN', icon: BarChart3 },
  { path: '/top-jugadores', label: 'TOP JUGADORES', icon: UserRound },
];

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useAppStore();

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <motion.aside
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed top-0 left-0 z-50 h-full w-[220px] bg-navy-800 border-r border-border-card flex flex-col lg:hidden"
          >
            <SidebarContent onClose={() => setSidebarOpen(false)} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export function DesktopSidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-[220px] h-full bg-navy-800 border-r border-border-card flex-shrink-0">
      <SidebarContent />
    </aside>
  );
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  return (
    <>
      {/* Header with Trophy */}
      <div className="flex flex-col items-center pt-6 pb-5 px-4 border-b border-border-card">
        <div className="w-12 h-12 rounded-full bg-navy-600 flex items-center justify-center mb-3">
          <Trophy size={24} className="text-accent-gold" />
        </div>
        <p className="text-[10px] font-bold tracking-[0.2em] text-text-secondary text-center leading-tight">
          COPA<br />MUNDIAL<br />2026
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-semibold tracking-wider transition-all duration-200 ${
                isActive
                  ? 'bg-accent-teal/10 text-accent-teal border-l-[3px] border-accent-teal'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.03] border-l-[3px] border-transparent'
              }`
            }
          >
            <item.icon size={16} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border-card">
        <p className="text-[9px] text-text-muted text-center uppercase tracking-widest">
          FIFA World Cup 26™
        </p>
      </div>
    </>
  );
}
