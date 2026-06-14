import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  UserRound,
  Swords,
  Building2,
  Trophy,
  BarChart3,
  Brain,
  X,
  Globe,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/teams', label: 'Equipos', icon: Users },
  { path: '/players', label: 'Jugadores', icon: UserRound },
  { path: '/matches', label: 'Partidos', icon: Swords },
  { path: '/stadiums', label: 'Estadios', icon: Building2 },
  { path: '/bracket', label: 'Bracket', icon: Trophy },
  { path: '/rankings', label: 'Rankings', icon: BarChart3 },
  { path: '/predictions', label: 'Predicciones', icon: Brain },
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
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed top-0 left-0 z-50 h-full w-64 glass-strong border-r border-border-subtle flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <Globe size={24} className="text-neon-green" />
                <span className="font-black text-lg neon-text-green tracking-tight">WC26</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-lg hover:bg-white/5">
                <X size={18} />
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-neon-green/10 text-neon-green neon-border'
                        : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                    }`
                  }
                >
                  <item.icon size={18} />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// Desktop sidebar (always visible)
export function DesktopSidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 h-full glass-strong border-r border-border-subtle flex-shrink-0">
      <div className="flex items-center gap-2 p-5 border-b border-border-subtle">
        <Globe size={24} className="text-neon-green" />
        <span className="font-black text-lg neon-text-green tracking-tight">WC26</span>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-neon-green/10 text-neon-green neon-border'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-border-subtle">
        <p className="text-[10px] text-text-muted text-center">Copa Mundial FIFA 2026™</p>
      </div>
    </aside>
  );
}
