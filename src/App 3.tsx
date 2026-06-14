import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
            <Route path="/" element={<DashboardPage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/players" element={<PlayersPage />} />
            <Route path="/matches" element={<MatchesPage />} />
            <Route path="/stadiums" element={<StadiumsPage />} />
            <Route path="/bracket" element={<BracketPage />} />
            <Route path="/rankings" element={<RankingsPage />} />
            <Route path="/predictions" element={<PredictionsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
