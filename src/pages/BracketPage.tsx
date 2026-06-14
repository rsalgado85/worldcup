import { motion } from 'framer-motion';
import { useMatches } from '@/hooks/useQueries';
import { Trophy } from 'lucide-react';
import { useMemo } from 'react';
import type { Match } from '@/types';
import { PageWrapper, PageHeader, LoadingSpinner } from '@/components/ui/design-system';

const KNOCKOUT_ROUNDS = [
  { key: 'round_of_32', label: 'Dieciseisavos', slots: 16, emoji: '🏟️' },
  { key: 'round_of_16', label: 'Octavos', slots: 8, emoji: '⚔️' },
  { key: 'quarter_final', label: 'Cuartos', slots: 4, emoji: '🔥' },
  { key: 'semi_final', label: 'Semifinal', slots: 2, emoji: '🏆' },
  { key: 'final', label: 'Final', slots: 1, emoji: '👑' },
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

  if (isLoading) return <PageWrapper><LoadingSpinner /></PageWrapper>;

  return (
    <PageWrapper>
      <PageHeader
        icon={Trophy}
        title="Bracket Mundial"
        subtitle="Fase eliminatoria · Del 28 de junio al 19 de julio"
        iconColor="text-accent-gold"
      />

      <div className="space-y-5">
        {KNOCKOUT_ROUNDS.map((round, ri) => {
          const roundMatches = knockout[round.key] || [];
          const placeholders = Array.from({ length: round.slots - roundMatches.length }, (_, i) => i);

          return (
            <motion.div
              key={round.key}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: ri * 0.08 }}
              className="card p-5 sm:p-6"
            >
              <h2 className="text-sm font-bold uppercase tracking-wider text-accent-teal mb-4 flex items-center gap-2">
                <span>{round.emoji}</span>
                {round.label}
                <span className="ml-auto text-xs font-normal text-text-muted">{roundMatches.length}/{round.slots}</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {roundMatches.map((m) => {
                  const hasScore = m.finished === 'TRUE' || (m.home_score !== 'null' && m.home_score !== '');
                  return (
                    <div key={m.id} className="hd-card">
                      <div className="px-4 py-3 flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0 text-right">
                          <p className="text-xs font-semibold text-white truncate">{m.home_team_name_en}</p>
                        </div>
                        {hasScore ? (
                          <span className="text-sm font-black text-accent-teal mx-2 flex-shrink-0">
                            {m.home_score}-{m.away_score}
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-text-muted mx-2 flex-shrink-0">vs</span>
                        )}
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-xs font-semibold text-white truncate">{m.away_team_name_en}</p>
                        </div>
                      </div>
                      <div className="px-4 pb-3">
                        <p className="text-[10px] text-text-muted text-center">{m.local_date}</p>
                      </div>
                    </div>
                  );
                })}
                {placeholders.map((i) => (
                  <div key={`ph-${i}`}
                    className="hd-card border-dashed flex items-center justify-center"
                    style={{ minHeight: '80px' }}>
                    <span className="text-xs text-text-dim">Por definir</span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </PageWrapper>
  );
}
