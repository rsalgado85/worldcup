import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Home, UserRound, X,
  Users, Swords, MapPin, Medal, LineChart, Brain,
  ChevronLeft, ChevronRight,
  Sun, Moon, Languages,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const mainItems = [
  { path: '/resumen', label: 'INICIO', icon: Home },
  { path: '/top-jugadores', label: 'TOP JUGADORES', icon: UserRound },
];

const moreItems = [
  { path: '/teams', label: 'Equipos', icon: Users },
  { path: '/matches', label: 'Partidos', icon: Swords },
  { path: '/stadiums', label: 'Estadios', icon: MapPin },
  { path: '/bracket', label: 'Bracket', icon: Trophy },
  { path: '/rankings', label: 'Rankings', icon: LineChart },
  { path: '/predictions', label: 'Predicciones', icon: Brain },
];

const accentGold = '#F5A623';
const accentTeal = '#14B8A6';

// ─── Mobile Sidebar ───
export function Sidebar() {
  const { sidebarOpen, setSidebarOpen, theme } = useAppStore();
  const isDark = theme === 'dark';

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
            className="fixed left-0 top-0 z-50 h-full w-[280px] lg:hidden flex flex-col"
            style={{
              backgroundColor: isDark ? '#060B15' : '#ffffff',
              borderRight: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)'}`,
            }}
          >
            <SidebarContent collapsed={false} onClose={() => setSidebarOpen(false)} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Desktop Sidebar (collapsible, 280px/80px) ───
export function DesktopSidebar() {
  const { sidebarCollapsed, theme } = useAppStore();
  const isDark = theme === 'dark';

  return (
    <motion.aside
      className="hidden lg:flex flex-col h-full flex-shrink-0 overflow-hidden relative"
      initial={false}
      animate={{ width: sidebarCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{
        backgroundColor: isDark ? '#060B15' : '#ffffff',
        borderRight: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)'}`,
        boxShadow: !isDark ? '0 1px 3px rgba(0,0,0,0.04)' : 'none',
      }}
    >
      <SidebarContent collapsed={sidebarCollapsed} />
    </motion.aside>
  );
}

// ─── Sidebar Content ───
function SidebarContent({ collapsed, onClose }: { collapsed: boolean; onClose?: () => void }) {
  const {
    sidebarCollapsed, toggleSidebarCollapsed,
    theme, toggleTheme, language, toggleLanguage,
  } = useAppStore();
  const isDark = theme === 'dark';
  const isCollapsed = collapsed;

  const textMuted = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)';
  const textHover = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)';
  const hoverBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
  const borderColor = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)';
  const logoSubtext = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)';

  return (
    <>
      {/* Logo Section */}
      <div
        className="flex items-center justify-between px-6 py-6 flex-shrink-0"
        style={{ borderBottom: `1px solid ${borderColor}` }}
      >
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                <img src="/images/fifa-2026-logo.png" alt="FIFA 2026" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight" style={{ color: isDark ? '#ffffff' : '#1A1510' }}>
                  WORLD<span style={{ color: accentTeal }}>CUP</span>
                </h1>
                <p className="text-[10px] font-medium tracking-wider uppercase" style={{ color: logoSubtext }}>
                  2026
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
              className="w-full flex justify-center"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center p-1"
                style={{ background: `linear-gradient(135deg, ${accentGold}, ${accentTeal})`, boxShadow: `0 0 20px ${accentGold}15` }}
              >
                <img src="/images/fifa-2026-logo.png" alt="FIFA" className="w-full h-full object-contain" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {mainItems.map((item) => (
          <NavItem key={item.path} item={item} collapsed={isCollapsed} onClose={onClose} />
        ))}

        {/* Divider */}
        {!isCollapsed && (
          <div className="pt-3 pb-1 px-4">
            <p className="text-[8px] font-bold uppercase tracking-[0.15em]" style={{ color: textMuted }}>
              {language === 'es' ? 'Torneo' : 'Tournament'}
            </p>
          </div>
        )}

        {moreItems.map((item) => (
          <NavItem key={item.path} item={item} collapsed={isCollapsed} onClose={onClose} small />
        ))}
      </nav>

      {/* Bottom Controls */}
      <div className="px-3 py-4 space-y-2 flex-shrink-0" style={{ borderTop: `1px solid ${borderColor}` }}>
        {/* Collapse Toggle */}
        <button
          onClick={toggleSidebarCollapsed}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-[999px] transition-all duration-200"
          style={{ color: textMuted }}
          onMouseEnter={(e) => { e.currentTarget.style.color = textHover; e.currentTarget.style.backgroundColor = hoverBg; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = textMuted; e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          {isCollapsed ? <ChevronRight size={18} /> : (
            <>
              <ChevronLeft size={18} />
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs font-medium">
                    {language === 'es' ? 'Colapsar' : 'Collapse'}
                  </motion.span>
                )}
              </AnimatePresence>
            </>
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-[999px] transition-all duration-200"
          style={{ color: textMuted }}
          onMouseEnter={(e) => { e.currentTarget.style.color = textHover; e.currentTarget.style.backgroundColor = hoverBg; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = textMuted; e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs font-medium">
                {language === 'es' ? (theme === 'dark' ? 'Modo claro' : 'Modo oscuro') : (theme === 'dark' ? 'Light mode' : 'Dark mode')}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-[999px] transition-all duration-200"
          style={{ color: textMuted }}
          onMouseEnter={(e) => { e.currentTarget.style.color = textHover; e.currentTarget.style.backgroundColor = hoverBg; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = textMuted; e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <Languages size={18} />
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs font-medium">
                {language === 'es' ? 'English' : 'Español'}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </>
  );
}

// ─── Nav Item (pill-shaped) ───
function NavItem({
  item, collapsed, onClose, small,
}: {
  item: { path: string; label: string; icon: React.ComponentType<{ size?: number }> };
  collapsed: boolean;
  onClose?: () => void;
  small?: boolean;
}) {
  const Icon = item.icon;
  const size = small ? 14 : 18;
  const py = small ? 'py-2' : 'py-3';
  const fontSize = small ? 'text-[10px]' : 'text-sm';

  return (
    <NavLink
      to={item.path}
      end={item.path === '/resumen'}
      onClick={onClose}
      className={`flex items-center gap-3 px-4 ${py} rounded-[999px] transition-all duration-200 group relative ${fontSize} font-medium`}
      style={({ isActive }) =>
        isActive
          ? {
              background: `linear-gradient(90deg, ${accentGold}, ${accentTeal})`,
              boxShadow: `0 0 20px ${accentTeal}30, 0 0 40px ${accentGold}15`,
              color: '#ffffff',
              fontWeight: 600,
            }
          : { color: 'var(--color-text-muted)' }
      }
    >
      <div className="flex items-center justify-center w-5 h-5 flex-shrink-0">
        <Icon size={size} />
      </div>
      <AnimatePresence mode="wait">
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
            className="whitespace-nowrap"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
    </NavLink>
  );
}
