import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { DesktopSidebar, Sidebar } from './Sidebar';
import { useAppStore } from '@/store/useAppStore';

export function AppLayout() {
  const { toggleSidebar } = useAppStore();

  return (
    <div className="flex h-screen overflow-hidden bg-navy-900">
      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Mobile Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center gap-3 p-4 bg-navy-800 border-b border-border-card">
          <button onClick={toggleSidebar} className="p-2 rounded-xl hover:bg-white/5">
            <Menu size={20} />
          </button>
          <span className="font-black text-sm tracking-widest text-accent-teal">COPA MUNDIAL 2026</span>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
