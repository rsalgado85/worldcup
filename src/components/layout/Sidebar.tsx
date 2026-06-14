import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Home, UserRound, X,
  Users, Swords, MapPin, Medal, LineChart, Brain,
  ChevronLeft, ChevronRight,
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
            className="fixed left-0 top-0 z-50 h-full w-[280px] lg:hidden"
            style={{ backgroundColor: '#060B15', borderRight: '1px solid rgba(255,255,255,0.04)' }}
          >
            <SidebarContent onClose={() => setSidebarOpen(false)} collapsed={false} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Desktop Sidebar (collapsible) ───
export function DesktopSidebar() {
  const { sidebarCollapsed } = useAppStore();

  return (
    <motion.aside
      className="hidden lg:flex flex-col h-full flex-shrink-0 overflow-hidden relative"
      initial={false}
      animate={{ width: sidebarCollapsed ? 80 : 220 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{
        backgroundColor: '#060B15',
        borderRight: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <SidebarContent collapsed={sidebarCollapsed} />
    </motion.aside>
  );
}

// ─── Sidebar Content ───
function SidebarContent({ onClose, collapsed }: { onClose?: () => void; collapsed: boolean }) {
  const { toggleSidebarCollapsed, sidebarCollapsed } = useAppStore();
  const isCollapsed = collapsed;

  return (
    <>
      {/* Logo Section */}
      <div
        className="flex items-center justify-between px-5 py-5 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
      >
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center p-1.5"
                style={{
                  background: `linear-gradient(135deg, ${accentGold}, ${accentTeal})`,
                  boxShadow: `0 0 20px ${accentGold}20`,
                }}
              >
                <Trophy size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-base font-black tracking-tight text-white">
                  WORLD<span style={{ color: accentTeal }}>CUP</span>
                </h1>
                <p className="text-[9px] font-medium tracking-wider uppercase text-text-muted">
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
                className="w-10 h-10 rounded-xl flex items-center justify-center p-1.5"
                style={{
                  background: `linear-gradient(135deg, ${accentGold}, ${accentTeal})`,
                  boxShadow: `0 0 20px ${accentGold}20`,
                }}
              >
                <Trophy size={18} className="text-white" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {/* Main items */}
        {mainItems.map((item) => (
          <NavItem key={item.path} item={item} collapsed={isCollapsed} onClose={onClose} />
        ))}

        {/* Divider */}
        {!isCollapsed && (
          <div className="pt-3 pb-1 px-4">
            <p className="text-[8px] font-bold text-text-muted uppercase tracking-[0.15em]">Torneo</p>
          </div>
        )}

        {/* Secondary items */}
        {moreItems.map((item) => (
          <NavItem key={item.path} item={item} collapsed={isCollapsed} onClose={onClose} small />
        ))}
      </nav>

      {/* Collapse toggle (desktop only) */}
      <div className="px-3 py-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <button
          onClick={toggleSidebarCollapsed}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-[999px] transition-all duration-200 text-text-muted hover:text-text-secondary hover:bg-white/[0.03]"
        >
          {isCollapsed ? <ChevronRight size={16} /> : (
            <>
              <ChevronLeft size={16} />
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[10px] font-medium">
                    Colapsar
                  </motion.span>
                )}
              </AnimatePresence>
            </>
          )}
        </button>
      </div>
    </>
  );
}

// ─── Nav Item (pill-shaped HyruleDex style) ───
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
  const py = small ? 'py-2' : 'py-2.5';
  const fontSize = small ? 'text-[10px]' : 'text-xs';

  return (
    <NavLink
      to={item.path}
      end={item.path === '/resumen'}
      onClick={onClose}
      className={`flex items-center gap-3 px-3.5 ${py} rounded-[999px] transition-all duration-200 group relative ${fontSize} font-semibold tracking-wider`}
      style={({ isActive }) =>
        isActive
          ? {
              background: `linear-gradient(90deg, ${accentGold}30, ${accentTeal}50)`,
              boxShadow: `0 0 20px ${accentTeal}20, 0 0 40px ${accentGold}10`,
              color: '#ffffff',
            }
          : {
              color: '#8BA4C7',
            }
      }
    >
      <div className="flex items-center justify-center flex-shrink-0" style={{ width: collapsed ? '100%' : 'auto' }}>
        <Icon size={size} />
      </div>
      <AnimatePresence mode="wait">
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
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
