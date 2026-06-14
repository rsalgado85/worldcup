import { motion } from 'framer-motion';
import { useMatches } from '@/hooks/useQueries';
import { Swords, Flame, CheckCircle2, Clock } from 'lucide-react';
import { useState, useMemo } from 'react';
import type { Match } from '@/types';
import { PageWrapper, PageHeader, FilterTabs, EmptyState, LoadingSpinner } from '@/components/ui/design-system';

const MATCH_FILTERS = [
  { key: 'all' as const, label: 'Todos', icon: Swords },
  { key: 'live' as const, label: 'En vivo', icon: Flame },
  { key: 'finished' as const, label: 'Finalizados', icon: CheckCircle2 },
  { key: 'upcoming' as const, label: 'Próximos', icon: Clock },
];

function MatchCard({ match }: { match: Match }) {
  const isFinished = match.finished === 'TRUE';
  const isLive = !isFinished && match.home_score !== 'null' && match.home_score !== '';
  const homeScore = parseInt(match.home_score) || 0;
  const awayScore = parseInt(match.away_score) || 0;
  const totalGoals = homeScore + awayScore;

  return (
    <motion.div whileHover={{ y: -4 }} className="hd-card">
      {/* Score banner */}
      <div className={`relative px-5 py-4 flex items-center justify-between ${
        isLive ? 'bg-accent-red/10 border-b border-accent-red/20' :
        isFinished ? 'bg-navy-700/50 border-b border-border-card' :
        'bg-navy-700/30 border-b border-border-card'
      }`}>
        {/* Home */}
        <div className="text-center flex-1 min-w-0">
          <p className="text-sm font-bold text-white truncate">{match.home_team_name_en}</p>
        </div>

        {/* Score / Status */}
        <div className="flex-shrink-0 mx-4 text-center">
          {isFinished || isLive ? (
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-black ${isLive ? 'text-white' : 'text-white'}`}>
                {match.home_score}
              </span>
              <span className={`text-lg font-black ${isLive ? 'text-accent-red' : 'text-text-muted'}`}>-</span>
              <span className={`text-2xl font-black ${isLive ? 'text-white' : 'text-white'}`}>
                {match.away_score}
              </span>
            </div>
          ) : (
            <span className="text-lg font-black text-text-muted">VS</span>
          )}
        </div>

        {/* Away */}
        <div className="text-center flex-1 min-w-0">
          <p className="text-sm font-bold text-white truncate">{match.away_team_name_en}</p>
        </div>
      </div>

      {/* Body */}
      <div className="hd-card-body !pt-3 !pb-3">
        {/* Meta row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="badge badge-neutral">{match.group}</span>
            <span className="text-[10px] text-text-muted font-medium">J{match.matchday}</span>
          </div>
          <span className={`badge ${isFinished ? 'badge-neutral' : isLive ? 'badge-live' : 'badge-teal'}`}>
            {isFinished ? 'FINAL' : isLive ? 'LIVE' : 'PRÓXIMO'}
          </span>
        </div>

        {/* Date */}
        <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
          <Clock size={11} />
          <span>{match.local_date?.replace(' ', ' · ') || 'Fecha por confirmar'}</span>
        </div>

        {/* Stat bars */}
        {isFinished && totalGoals > 0 && (
          <div className="mt-3 pt-3 border-t border-border-card space-y-1.5">
            <div className="hd-stat-row">
              <span className="hd-stat-icon text-[10px]">⚽</span>
              <div className="hd-stat-bar">
                <div className="hd-stat-fill bg-accent-gold"
                  style={{ width: `${Math.min(homeScore * 10, 100)}%` }} />
              </div>
              <span className="hd-stat-value">{homeScore}</span>
            </div>
            <div className="hd-stat-row">
              <span className="hd-stat-icon text-[10px]">🥅</span>
              <div className="hd-stat-bar">
                <div className="hd-stat-fill bg-accent-teal"
                  style={{ width: `${Math.min(awayScore * 10, 100)}%` }} />
              </div>
              <span className="hd-stat-value">{awayScore}</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function MatchesPage() {
  const { data: matches, isLoading } = useMatches();
  const [filter, setFilter] = useState<'all' | 'live' | 'finished' | 'upcoming'>('all');

  const grouped = useMemo(() => {
    if (!matches) return [];
    const groups = new Map<string, Match[]>();
    matches.forEach((m) => {
      const key = m.group || 'Knockout';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(m);
    });
    return Array.from(groups.entries());
  }, [matches]);

  const filtered = useMemo(() => {
    if (!matches) return [];
    switch (filter) {
      case 'live': return matches.filter((m) => m.finished !== 'TRUE' && m.home_score !== 'null' && m.home_score !== '');
      case 'finished': return matches.filter((m) => m.finished === 'TRUE');
      case 'upcoming': return matches.filter((m) => m.finished !== 'TRUE' && (m.home_score === 'null' || m.home_score === ''));
      default: return matches;
    }
  }, [matches, filter]);

  if (isLoading) return <PageWrapper><LoadingSpinner /></PageWrapper>;

  return (
    <PageWrapper>
      <PageHeader
        icon={Swords}
        title="Centro de Partidos"
        subtitle={`${matches?.length || 104} partidos · Scores en vivo`}
        iconColor="text-accent-orange"
      />

      <FilterTabs options={MATCH_FILTERS} value={filter} onChange={setFilter} />

      {filter === 'all' ? (
        <div className="space-y-8">
          {grouped.map(([group, groupMatches]) => (
            <div key={group}>
              <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3 px-1">
                Grupo {group}
                <span className="ml-2 font-normal text-text-dim">{groupMatches.length} partidos</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {groupMatches.map((m) => (
                  <MatchCard key={m.id} match={m} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filtered.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
          {filtered.length === 0 && (
            <EmptyState icon={Swords} message="No hay partidos en esta categoría" />
          )}
        </>
      )}
    </PageWrapper>
  );
}
