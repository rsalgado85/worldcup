import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Home, UserRound,
  Users, Swords, MapPin, LineChart, Brain,
  ChevronLeft, ChevronRight,
  Sun, Moon, Languages,
  Info, Mail, Heart,
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

const secondaryItems = [
  { path: '/about', label: 'Info', icon: Info },
  { path: '/contact', label: 'Contacto', icon: Mail },
  { path: '/donate', label: 'Donar', icon: Heart },
];

// ─── Mobile Sidebar ───
export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useAppStore();
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
            className="fixed left-0 top-0 z-50 h-full flex flex-col lg:hidden bg-[#0D0D0D]"
            style={{ width: '320px' }}
          >
            <SidebarContent collapsed={false} onClose={() => setSidebarOpen(false)} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Desktop Sidebar ───
export function DesktopSidebar() {
  const { sidebarCollapsed } = useAppStore();
  return (
    <motion.aside
      className="hidden lg:flex flex-col h-full flex-shrink-0 overflow-hidden bg-[#0D0D0D]"
      initial={false}
      animate={{ width: sidebarCollapsed ? 80 : 320 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <SidebarContent collapsed={sidebarCollapsed} />
    </motion.aside>
  );
}

// ─── Sidebar Content ───
function SidebarContent({ collapsed, onClose }: { collapsed: boolean; onClose?: () => void }) {
  const { toggleSidebarCollapsed, theme, toggleTheme, language, toggleLanguage } = useAppStore();

  return (
    <>
      {/* Logo */}
      <div className="flex-shrink-0 px-6 pt-8 pb-6 border-b border-white/5">
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div key="expanded" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-3">
              <img src="/images/fifa-2026-logo.png" alt="FIFA" className="w-10 h-10 object-contain flex-shrink-0 brightness-110 saturate-125" />
              <div className="min-w-0 leading-none">
                <h1 className="text-lg font-black tracking-tight text-white">
                  WORLD<span className="text-accent-teal">CUP</span>
                </h1>
                <p className="text-[10px] font-medium uppercase tracking-[0.15em] mt-0.5 text-[#777]">
                  INSIGHT 2026
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div key="collapsed" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
              className="w-full flex justify-center">
              <img src="/images/fifa-2026-logo.png" alt="FIFA" className="w-9 h-9 object-contain brightness-110 saturate-125" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-5 py-6 space-y-3 overflow-y-auto">
        {allItems.map((item) => (
          <SidebarNavItem key={item.path} item={item} collapsed={collapsed} onClose={onClose} />
        ))}
        {/* Divider */}
        <div className="pt-2 pb-1">
          <div className="border-t border-white/5" />
        </div>
        {secondaryItems.map((item) => (
          <SidebarNavItem key={item.path} item={item} collapsed={collapsed} onClose={onClose} />
        ))}
      </nav>

      {/* Bottom Controls */}
      <div className="flex-shrink-0 px-5 py-5 space-y-3 border-t border-white/5">
        <BottomBtn onClick={toggleSidebarCollapsed} icon={collapsed ? ChevronRight : ChevronLeft} label="Colapsar" collapsed={collapsed} />
        <BottomBtn onClick={toggleTheme} icon={theme === 'dark' ? Sun : Moon} label={theme === 'dark' ? 'Claro' : 'Oscuro'} collapsed={collapsed} />
        <BottomBtn onClick={toggleLanguage} icon={Languages} label={language === 'es' ? 'English' : 'Español'} collapsed={collapsed} />
      </div>
    </>
  );
}

// ─── Nav Item with explicit active detection ───
function SidebarNavItem({
  item, collapsed, onClose,
}: {
  item: { path: string; label: string; icon: React.ComponentType<{ size?: number }> };
  collapsed: boolean;
  onClose?: () => void;
}) {
  const Icon = item.icon;
  const location = useLocation();

  // Explicit active detection matching NavLink's end behavior
  const isActive = item.path === '/resumen'
    ? location.pathname === '/' || location.pathname === '/resumen'
    : location.pathname.startsWith(item.path);

  return (
    <NavLink
      to={item.path}
      end={item.path === '/resumen'}
      onClick={onClose}
      className={`
        flex items-center gap-4 px-4 py-3.5 rounded-full transition-all duration-200
        ${isActive
          ? 'bg-gradient-to-r from-[rgba(120,140,60,0.25)] to-[rgba(100,130,50,0.12)] text-white font-semibold'
          : 'text-[#AAAAAA] font-normal hover:text-white/70'
        }
      `}
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
  onClick, icon: Icon, label, collapsed,
}: {
  onClick: () => void;
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  collapsed: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 px-4 py-3 rounded-full transition-all duration-150 text-[#AAAAAA] hover:text-white/70 hover:bg-white/[0.03]"
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
