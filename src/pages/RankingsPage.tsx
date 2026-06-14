import { motion } from 'framer-motion';
import { useTeams, useMatches } from '@/hooks/useQueries';
import { BarChart3, Trophy, Target, Globe } from 'lucide-react';
import { useMemo } from 'react';
import { PageWrapper, PageHeader, LoadingSpinner } from '@/components/ui/design-system';

export function RankingsPage() {
  const { data: teams } = useTeams();
  const { data: matches } = useMatches();

  const topScorers = useMemo(() => {
    if (!matches) return [];
    const scorers = new Map<string, { name: string; goals: number; team: string; teamId: string }>();
    matches.forEach((m) => {
      for (const side of ['home' as const, 'away' as const]) {
        const raw = side === 'home' ? m.home_scorers : m.away_scorers;
        const teamName = side === 'home' ? m.home_team_name_en : m.away_team_name_en;
        const teamId = side === 'home' ? m.home_team_id : m.away_team_id;
        if (raw && raw !== 'null') {
          try {
            const names = JSON.parse(raw.replace(/'/g, '"'));
            names.forEach((n: string) => {
              const clean = n.replace(/\s*\d+\+?\d*'?\s*$/, '').trim();
              if (clean && clean !== 'null') {
                const existing = scorers.get(clean);
                if (existing) existing.goals++;
                else scorers.set(clean, { name: clean, goals: 1, team: teamName, teamId });
              }
            });
          } catch {}
        }
      }
    });
    return Array.from(scorers.values()).sort((a, b) => b.goals - a.goals).slice(0, 15);
  }, [matches]);

  const maxGoals = topScorers[0]?.goals || 1;

  const teamMap = useMemo(() => {
    if (!teams) return new Map();
    const m = new Map<string, string>();
    teams.forEach(t => m.set(t.name_en, t.flag));
    return m;
  }, [teams]);

  if (!teams) return <PageWrapper><LoadingSpinner /></PageWrapper>;

  return (
    <PageWrapper>
      <PageHeader
        icon={BarChart3}
        title="Rankings"
        subtitle="Goleadores, equipos y estadísticas del torneo"
        iconColor="text-accent-orange"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Scorers with stat bars */}
        <div className="card p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-5">
            <Trophy size={18} className="text-accent-gold" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-text-primary">Goleadores</h2>
            <span className="badge badge-gold text-[9px]">TOP 15</span>
          </div>
          <div className="space-y-1.5">
            {topScorers.map((s, i) => (
              <div key={s.name} className="hd-list-item">
                {/* Rank */}
                <span className={`text-sm font-black w-7 flex-shrink-0 text-center ${
                  i < 3 ? 'text-accent-gold' : 'text-text-muted'
                }`}>
                  {i < 3 ? ['🥇', '🥈', '🥉'][i] : `#${i + 1}`}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="hd-list-name">{s.name}</p>
                  <p className="hd-list-desc">{s.team}</p>

                  {/* Goal bar */}
                  <div className="hd-stat-row mt-1.5">
                    <span className="hd-stat-icon text-[10px]">⚽</span>
                    <div className="hd-stat-bar">
                      <div className="hd-stat-fill bg-accent-gold"
                        style={{ width: `${(s.goals / maxGoals) * 100}%` }} />
                    </div>
                    <span className="hd-stat-value">{s.goals}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Teams list with thumbnails */}
        <div className="card p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-5">
            <Globe size={18} className="text-accent-teal" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-text-primary">Equipos</h2>
            <span className="badge badge-teal text-[9px]">{teams.length}</span>
          </div>
          <div className="space-y-0.5 max-h-[600px] overflow-y-auto">
            {teams.slice(0, 48).map((team, i) => (
              <div key={team.id} className="hd-list-item">
                <span className="text-xs text-text-muted w-5 flex-shrink-0">{i + 1}</span>
                <img src={team.flag} alt="" className="hd-list-thumb w-8 h-5 !rounded-sm" />
                <div className="flex-1 min-w-0">
                  <p className="hd-list-name text-xs">{team.name_en}</p>
                  <p className="hd-list-desc">Grupo {team.groups} · {team.fifa_code}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
