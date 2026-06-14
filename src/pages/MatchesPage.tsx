import { motion } from 'framer-motion';
import { useMatches } from '@/hooks/useQueries';
import { Swords, Clock, CheckCircle2, Flame } from 'lucide-react';
import { useState, useMemo } from 'react';
import type { Match } from '@/types';

function MatchCard({ match }: { match: Match }) {
  const isFinished = match.finished === 'TRUE';
  const isLive = !isFinished && match.home_score !== 'null';

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="card-dark p-4 border border-border-card hover:border-accent-teal/20 transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          {match.group} · J{match.matchday}
        </span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          isFinished
            ? 'bg-text-muted/10 text-text-muted'
            : isLive
            ? 'bg-accent-teal/15 text-accent-teal animate-pulse'
            : 'bg-accent-teal/10 text-accent-teal'
        }`}>
          {isFinished ? 'FINAL' : isLive ? 'LIVE' : 'PRÓXIMO'}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="text-right flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{match.home_team_name_en}</p>
        </div>
        <div className="text-center flex-shrink-0">
          {isFinished || isLive ? (
            <span className="text-xl font-black neon-text-green">
              {match.home_score} - {match.away_score}
            </span>
          ) : (
            <span className="text-xl font-black text-text-muted">vs</span>
          )}
        </div>
        <div className="text-left flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{match.away_team_name_en}</p>
        </div>
      </div>

      <p className="text-[10px] text-text-muted text-center mt-2">
        {match.local_date?.replace(' ', ' · ') || ''}
      </p>
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
      case 'live': return matches.filter((m) => m.finished !== 'TRUE' && m.home_score !== 'null');
      case 'finished': return matches.filter((m) => m.finished === 'TRUE');
      case 'upcoming': return matches.filter((m) => m.finished !== 'TRUE' && m.home_score === 'null');
      default: return matches;
    }
  }, [matches, filter]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-accent-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <div className="flex items-center gap-3">
          <Swords size={28} className="text-accent-orange" />
          <h1 className="text-2xl md:text-3xl font-black">Centro de Partidos</h1>
        </div>
        <p className="text-sm text-text-secondary">104 partidos · Scores en vivo vía worldcup26.ir</p>
      </motion.div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'all', label: 'Todos', icon: Swords },
          { key: 'live', label: 'En vivo', icon: Flame },
          { key: 'finished', label: 'Finalizados', icon: CheckCircle2 },
          { key: 'upcoming', label: 'Próximos', icon: Clock },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setFilter(key as typeof filter)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              filter === key
                ? 'bg-accent-teal/15 text-accent-teal border border-accent-teal/20'
                : 'bg-navy-700/30 text-text-secondary hover:bg-navy-700/50'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Matches grid */}
      <div className="space-y-8">
        {filter === 'all' ? (
          grouped.map(([group, groupMatches]) => (
            <div key={group}>
              <h2 className="text-sm font-bold uppercase tracking-wider text-accent-teal mb-3">Grupo {group}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {groupMatches.map((m) => (
                  <MatchCard key={m.id} match={m} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Swords size={48} className="mx-auto mb-4 text-white/5" />
            <p className="text-sm text-text-muted">No hay partidos en esta categoría</p>
          </div>
        )}
      </div>
    </div>
  );
}
