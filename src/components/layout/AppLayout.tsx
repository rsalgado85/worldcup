import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { DesktopSidebar, Sidebar } from './Sidebar';
import { useAppStore } from '@/store/useAppStore';

export function AppLayout() {
  const { toggleSidebar } = useAppStore();

  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary">
      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Mobile Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center gap-3 p-4 glass-strong border-b border-border-subtle">
          <button onClick={toggleSidebar} className="p-2 rounded-xl hover:bg-white/5">
            <Menu size={20} />
          </button>
          <span className="font-black text-lg neon-text-green tracking-tight">WC26 INSIGHT</span>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
