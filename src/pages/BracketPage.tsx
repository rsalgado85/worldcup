import { motion } from 'framer-motion';
import { useMatches } from '@/hooks/useQueries';
import { Trophy } from 'lucide-react';
import { useMemo } from 'react';
import type { Match } from '@/types';

const KNOCKOUT_ROUNDS = [
  { key: 'round_of_32', label: 'Dieciseisavos', slots: 16 },
  { key: 'round_of_16', label: 'Octavos', slots: 8 },
  { key: 'quarter_final', label: 'Cuartos', slots: 4 },
  { key: 'semi_final', label: 'Semifinal', slots: 2 },
  { key: 'final', label: 'Final', slots: 1 },
];

export function BracketPage() {
  const { data: matches, isLoading } = useMatches();

  const knockout = useMemo(() => {
    if (!matches) return {};
    const groups: Record<string, Match[]> = {};
    KNOCKOUT_ROUNDS.forEach((r) => {
      groups[r.key] = matches.filter((m) => m.type === r.key);
    });
    return groups;
  }, [matches]);

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
          <Trophy size={28} className="text-accent-gold" />
          <h1 className="text-2xl md:text-3xl font-black">Bracket Mundial</h1>
        </div>
        <p className="text-sm text-text-secondary">Fase eliminatoria · Del 28 de junio al 19 de julio</p>
      </motion.div>

      <div className="space-y-6">
        {KNOCKOUT_ROUNDS.map((round, ri) => {
          const roundMatches = knockout[round.key] || [];
          const placeholders = Array.from({ length: round.slots - roundMatches.length }, (_, i) => i);

          return (
            <motion.div
              key={round.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: ri * 0.1 }}
              className="card-dark p-5"
            >
              <h2 className="text-sm font-bold uppercase tracking-wider text-accent-teal mb-4">{round.label}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {roundMatches.map((m) => (
                  <div key={m.id} className="bg-navy-700/30 rounded-xl p-3 border border-border-card">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium truncate flex-1">{m.home_team_name_en}</span>
                      <span className="font-bold text-accent-teal mx-2">{m.home_score}-{m.away_score}</span>
                      <span className="font-medium truncate flex-1 text-right">{m.away_team_name_en}</span>
                    </div>
                    <p className="text-[9px] text-text-muted text-center mt-1">{m.local_date}</p>
                  </div>
                ))}
                {placeholders.map((i) => (
                  <div key={`ph-${i}`} className="bg-navy-700/20 rounded-xl p-3 border border-dashed border-border-card flex items-center justify-center">
                    <span className="text-xs text-text-muted">Por definir</span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
