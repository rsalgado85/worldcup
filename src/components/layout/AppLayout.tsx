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

  // Apply theme class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') root.classList.add('light');
    else root.classList.remove('light');
  }, [theme]);

  // Scroll to top on route change
  useEffect(() => {
    document.querySelector('main')?.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  const bgStyle = isDark
    ? { background: 'radial-gradient(ellipse at 20% 50%, #0A1530 0%, #0A1128 40%, #060B15 70%, #040810 100%)' }
    : { background: 'radial-gradient(ellipse at 20% 50%, #F0F4FF 0%, #E8ECF4 40%, #F5F0E8 70%, #FAFAFA 100%)' };

  return (
    <div className="flex h-screen overflow-hidden" style={bgStyle}>
      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Mobile Sidebar — uses store's sidebarOpen, handles its own overlay internally */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Title Bar (HyruleDex style) */}
        <header
          className="lg:hidden flex items-center justify-between px-3 py-3 flex-shrink-0"
          style={{
            borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)'}`,
            backgroundColor: isDark ? 'transparent' : 'rgba(255,255,255,0.8)',
            backdropFilter: isDark ? 'none' : 'blur(12px)',
          }}
        >
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg transition-colors active:scale-95"
            style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)' }}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center p-0.5"
              style={{ background: `linear-gradient(135deg, #F5A623, #14B8A6)`, boxShadow: '0 0 12px rgba(20,184,166,0.15)' }}
            >
              <img src="/images/fifa-2026-logo.png" alt="FIFA" className="w-full h-full object-contain" />
            </div>
            <span className="text-sm font-black tracking-tight" style={{ color: isDark ? '#ffffff' : '#1A1510' }}>
              WORLD<span style={{ color: '#14B8A6' }}>CUP</span> 2026
            </span>
          </div>
          <div className="w-9" />
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>

        {/* Mobile Bottom Nav */}
        <MobileBottomNav />

        {/* Footer (desktop only) */}
        <footer
          className="hidden lg:block py-3 px-4 text-center flex-shrink-0"
          style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}` }}
        >
          <p className="text-[10px]" style={{ color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)' }}>
            &copy; {new Date().getFullYear()} WorldCup Insight — FIFA World Cup 2026&trade;
          </p>
        </footer>
      </div>
    </div>
  );
}

// ─── Mobile Bottom Nav ───
function MobileBottomNav() {
  const { theme, language } = useAppStore();
  const isDark = theme === 'dark';
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav
      className="lg:hidden flex items-center justify-around px-1 py-1 flex-shrink-0"
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
            className="flex flex-col items-center gap-0.5 py-1 px-1.5 min-w-0 transition-all active:scale-90"
            style={{ color: isActive ? '#14B8A6' : isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)' }}
            aria-label={label}
          >
            <Icon size={18} />
            <span className="text-[8px] font-semibold truncate max-w-full">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
