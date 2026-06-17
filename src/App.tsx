import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardPage } from '@/pages/DashboardPage';
import { TeamsPage } from '@/pages/TeamsPage';
import { PlayersPage } from '@/pages/PlayersPage';
import { MatchesPage } from '@/pages/MatchesPage';
import { StadiumsPage } from '@/pages/StadiumsPage';
import { BracketPage } from '@/pages/BracketPage';
import { RankingsPage } from '@/pages/RankingsPage';
import { PredictionsPage } from '@/pages/PredictionsPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import DonatePage from '@/pages/DonatePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/resumen" replace />} />
            <Route path="/resumen" element={<DashboardPage />} />
            <Route path="/top-jugadores" element={<PlayersPage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/players" element={<PlayersPage />} />
            <Route path="/matches" element={<MatchesPage />} />
            <Route path="/stadiums" element={<StadiumsPage />} />
            <Route path="/bracket" element={<BracketPage />} />
            <Route path="/rankings" element={<RankingsPage />} />
            <Route path="/predictions" element={<PredictionsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/donate" element={<DonatePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
