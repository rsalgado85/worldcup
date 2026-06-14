import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Home, UserRound,
  Users, Swords, MapPin, LineChart, Brain,
  ChevronLeft, ChevronRight,
  Sun, Moon, Languages,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const allItems = [
  { path: '/resumen', label: 'Panel', icon: Home },
  { path: '/top-jugadores', label: 'Jugadores', icon: UserRound },
  { path: '/teams', label: 'Equipos', icon: Users },
  { path: '/matches', label: 'Partidos', icon: Swords },
  { path: '/stadiums', label: 'Estadios', icon: MapPin },
  { path: '/bracket', label: 'Bracket', icon: Trophy },
  { path: '/rankings', label: 'Rankings', icon: LineChart },
  { path: '/predictions', label: 'Predicciones', icon: Brain },
];

// ─── Mobile Sidebar ───
export function Sidebar() {
  const { sidebarOpen, setSidebarOpen, theme } = useAppStore();
  const isDark = theme === 'dark';
  const bg = isDark ? '#0D0D0D' : '#ffffff';

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <motion.aside
            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 z-50 h-full flex flex-col lg:hidden"
            style={{ width: '300px', backgroundColor: bg }}
          >
            <SidebarContent collapsed={false} onClose={() => setSidebarOpen(false)} bg={bg} isDark={isDark} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Desktop Sidebar ───
export function DesktopSidebar() {
  const { sidebarCollapsed, theme } = useAppStore();
  const isDark = theme === 'dark';
  const bg = isDark ? '#0D0D0D' : '#ffffff';

  return (
    <motion.aside
      className="hidden lg:flex flex-col h-full flex-shrink-0 overflow-hidden"
      initial={false}
      animate={{ width: sidebarCollapsed ? 80 : 300 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{ backgroundColor: bg }}
    >
      <SidebarContent collapsed={sidebarCollapsed} bg={bg} isDark={isDark} />
    </motion.aside>
  );
}

// ─── Sidebar Content ───
function SidebarContent({
  collapsed, onClose, bg, isDark,
}: {
  collapsed: boolean; onClose?: () => void; bg: string; isDark: boolean;
}) {
  const { toggleSidebarCollapsed, theme, toggleTheme, language, toggleLanguage } = useAppStore();

  // HyruleDex colors
  const textActive = '#FFFFFF';
  const textInactive = isDark ? '#AAAAAA' : '#666666';
  const subtitleColor = isDark ? '#777777' : '#999999';
  const borderColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';

  return (
    <>
      {/* ─── Logo (standalone icon, no box) ─── */}
      <div className="flex-shrink-0 px-6 pt-8 pb-6" style={{ borderBottom: `1px solid ${borderColor}` }}>
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              {/* Standalone golden FIFA logo — no background box */}
              <img
                src="/images/fifa-2026-logo.png"
                alt="FIFA"
                className="w-10 h-10 object-contain flex-shrink-0"
                style={{ filter: 'brightness(1.1) saturate(1.3)' }}
              />
              <div className="min-w-0 leading-none">
                <h1 className="text-lg font-black tracking-tight text-white">
                  WORLD<span style={{ color: '#14B8A6' }}>CUP</span>
                </h1>
                <p className="text-[10px] font-medium uppercase tracking-[0.15em] mt-0.5" style={{ color: subtitleColor }}>
                  INSIGHT 2026
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
              className="w-full flex justify-center"
            >
              <img
                src="/images/fifa-2026-logo.png"
                alt="FIFA"
                className="w-9 h-9 object-contain"
                style={{ filter: 'brightness(1.1) saturate(1.3)' }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Nav Items ─── */}
      <nav className="flex-1 px-5 py-5 space-y-1.5 overflow-y-auto">
        {allItems.map((item) => (
          <SidebarNavItem
            key={item.path}
            item={item}
            collapsed={collapsed}
            onClose={onClose}
            textActive={textActive}
            textInactive={textInactive}
          />
        ))}
      </nav>

      {/* ─── Bottom Controls ─── */}
      <div className="flex-shrink-0 px-5 py-4 space-y-2" style={{ borderTop: `1px solid ${borderColor}` }}>
        <BottomBtn onClick={toggleSidebarCollapsed} icon={collapsed ? ChevronRight : ChevronLeft} label="Colapsar" collapsed={collapsed} color={textInactive} />
        <BottomBtn onClick={toggleTheme} icon={theme === 'dark' ? Sun : Moon} label={theme === 'dark' ? 'Claro' : 'Oscuro'} collapsed={collapsed} color={textInactive} />
        <BottomBtn onClick={toggleLanguage} icon={Languages} label={language === 'es' ? 'English' : 'Español'} collapsed={collapsed} color={textInactive} />
      </div>
    </>
  );
}

// ─── Nav Item ───
function SidebarNavItem({
  item, collapsed, onClose, textActive, textInactive,
}: {
  item: { path: string; label: string; icon: React.ComponentType<{ size?: number }> };
  collapsed: boolean;
  onClose?: () => void;
  textActive: string;
  textInactive: string;
}) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      end={item.path === '/resumen'}
      onClick={onClose}
      className="flex items-center gap-4 px-4 py-3 rounded-full transition-all duration-200"
      style={({ isActive }) =>
        isActive
          ? {
              background: 'linear-gradient(90deg, rgba(120,140,60,0.25) 0%, rgba(100,130,50,0.15) 100%)',
              color: textActive,
              fontWeight: 600,
            }
          : { color: textInactive, fontWeight: 400 }
      }
    >
      <div className="flex items-center justify-center w-6 h-6 flex-shrink-0">
        <Icon size={22} />
      </div>
      <AnimatePresence mode="wait">
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.1 }}
            className="text-[15px] whitespace-nowrap leading-none"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
    </NavLink>
  );
}

// ─── Bottom Button ───
function BottomBtn({
  onClick, icon: Icon, label, collapsed, color,
}: {
  onClick: () => void;
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  collapsed: boolean;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 px-4 py-2.5 rounded-full transition-all duration-150 hover:bg-white/3"
      style={{ color }}
    >
      <div className="flex items-center justify-center w-6 h-6 flex-shrink-0">
        <Icon size={20} />
      </div>
      <AnimatePresence mode="wait">
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.1 }}
            className="text-[15px] whitespace-nowrap leading-none"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
