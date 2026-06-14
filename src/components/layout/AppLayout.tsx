import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, LayoutDashboard, Users, Swords, MapPin, Trophy, LineChart } from 'lucide-react';
import { DesktopSidebar, Sidebar } from './Sidebar';
import { useAppStore } from '@/store/useAppStore';

const MOBILE_NAV_ITEMS = [
  { path: '/resumen', icon: LayoutDashboard, labelEs: 'Inicio', labelEn: 'Home' },
  { path: '/top-jugadores', icon: Users, labelEs: 'Jugadores', labelEn: 'Players' },
  { path: '/matches', icon: Swords, labelEs: 'Partidos', labelEn: 'Matches' },
  { path: '/teams', icon: Trophy, labelEs: 'Equipos', labelEn: 'Teams' },
  { path: '/stadiums', icon: MapPin, labelEs: 'Estadios', labelEn: 'Stadiums' },
  { path: '/rankings', icon: LineChart, labelEs: 'Rankings', labelEn: 'Rankings' },
];

export function AppLayout() {
  const { theme, language, toggleSidebar } = useAppStore();
  const location = useLocation();
  const isDark = theme === 'dark';

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') root.classList.add('light');
    else root.classList.remove('light');
  }, [theme]);

  useEffect(() => {
    document.querySelector('main')?.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  const bgStyle = isDark
    ? { background: 'radial-gradient(ellipse at 20% 50%, #0A1530 0%, #0A1128 40%, #060B15 70%, #040810 100%)' }
    : { background: 'radial-gradient(ellipse at 20% 50%, #F0F4FF 0%, #E8ECF4 40%, #F5F0E8 70%, #FAFAFA 100%)' };

  return (
    <div className="flex h-screen overflow-hidden" style={bgStyle}>
      <DesktopSidebar />
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header — HyruleDex style */}
        <MobileHeader />

        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </main>

        {/* Mobile Bottom Nav — HyruleDex style */}
        <MobileBottomNav />

        {/* Footer (desktop) */}
        <footer
          className="hidden lg:block py-3 px-4 text-center flex-shrink-0"
          style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}` }}
        >
          <p className="text-[10px]" style={{ color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }}>
            &copy; {new Date().getFullYear()} WorldCup Insight — FIFA World Cup 2026&trade;
          </p>
        </footer>
      </div>
    </div>
  );
}

// ─── Mobile Header (HyruleDex style) ───
function MobileHeader() {
  const { theme, toggleSidebar } = useAppStore();
  const isDark = theme === 'dark';

  return (
    <header
      className="lg:hidden flex items-center justify-between px-4 py-3 flex-shrink-0"
      style={{
        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'}`,
        backgroundColor: isDark ? 'rgba(6,11,21,0.95)' : 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <button
        onClick={toggleSidebar}
        className="p-2 -ml-1 rounded-lg transition-colors active:scale-95"
        style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)' }}
        aria-label="Menu"
      >
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center p-0.5"
          style={{
            background: 'linear-gradient(135deg, #F5A623, #14B8A6)',
            boxShadow: '0 0 10px rgba(20,184,166,0.12)',
          }}
        >
          <img src="/images/fifa-2026-logo.png" alt="FIFA" className="w-full h-full object-contain" />
        </div>
        <span className="text-sm font-black tracking-tight" style={{ color: isDark ? '#ffffff' : '#1A1510' }}>
          WORLD<span style={{ color: '#14B8A6' }}>CUP</span> 2026
        </span>
      </div>

      <div className="w-8" />
    </header>
  );
}

// ─── Mobile Bottom Nav (HyruleDex style) ───
function MobileBottomNav() {
  const { theme, language } = useAppStore();
  const isDark = theme === 'dark';
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav
      className="lg:hidden flex items-center justify-around px-1 py-2 flex-shrink-0"
      style={{
        backgroundColor: isDark ? 'rgba(6, 11, 21, 0.97)' : 'rgba(255, 255, 255, 0.97)',
        borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
      aria-label="Mobile navigation"
    >
      {MOBILE_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = item.path === '/resumen'
          ? location.pathname === '/' || location.pathname === '/resumen'
          : location.pathname === item.path || location.pathname.startsWith(item.path + '/');
        const label = language === 'es' ? item.labelEs : item.labelEn;

        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center gap-0.5 py-1.5 px-2 min-w-0 transition-all active:scale-90 rounded-xl"
            style={{ color: isActive ? '#14B8A6' : isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}
            aria-label={label}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            <span
              className="text-[9px] font-semibold truncate max-w-full"
              style={{ opacity: isActive ? 1 : 0.7 }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
