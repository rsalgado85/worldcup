import { create } from 'zustand';

type Theme = 'dark' | 'light';
type Language = 'es' | 'en';

interface AppState {
  viewMode: string;
  setViewMode: (mode: string) => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  toggleSidebarCollapsed: () => void;
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  toggleLanguage: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  viewMode: 'dashboard',
  setViewMode: (mode) => set({ viewMode: mode, sidebarOpen: false }),
  sidebarOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  sidebarCollapsed: false,
  toggleSidebarCollapsed: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  theme: 'dark',
  toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
  language: 'es',
  toggleLanguage: () => set((s) => ({ language: s.language === 'es' ? 'en' : 'es' })),
}));
