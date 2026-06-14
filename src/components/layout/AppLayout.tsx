import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { DesktopSidebar, Sidebar } from './Sidebar';
import { useAppStore } from '@/store/useAppStore';

export function AppLayout() {
  const { toggleSidebar } = useAppStore();
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    const main = document.querySelector('main');
    main?.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 20% 50%, #0A1530 0%, #0A1128 40%, #060B15 70%, #040810 100%)',
      }}
    >
      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Mobile Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header
          className="lg:hidden flex items-center justify-between px-3 py-3 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
        >
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg transition-colors active:scale-95 text-text-secondary"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-black tracking-tight text-white">
              WORLD<span className="text-accent-teal">CUP</span> 2026
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

        {/* Footer */}
        <footer
          className="hidden lg:block py-3 px-4 md:px-6 lg:px-8 text-center flex-shrink-0"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
        >
          <p className="text-[10px] text-text-muted/30">
            &copy; {new Date().getFullYear()} WorldCup Insight — FIFA World Cup 2026&trade;
          </p>
        </footer>
      </div>
    </div>
  );
}
