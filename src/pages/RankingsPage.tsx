import { motion } from 'framer-motion';
import { useTeams, useMatches } from '@/hooks/useQueries';
import { BarChart3, Trophy, Target, Shield } from 'lucide-react';
import { useMemo } from 'react';

export function RankingsPage() {
  const { data: teams } = useTeams();
  const { data: matches } = useMatches();

  const topScorers = useMemo(() => {
    if (!matches) return [];
    const scorers = new Map<string, number>();
    matches.forEach((m) => {
      if (m.home_scorers && m.home_scorers !== 'null') {
        try {
          const names = JSON.parse(m.home_scorers.replace(/'/g, '"'));
          names.forEach((n: string) => {
            const clean = n.replace(/\d+'?/, '').trim();
            scorers.set(clean, (scorers.get(clean) || 0) + 1);
          });
        } catch {}
      }
      if (m.away_scorers && m.away_scorers !== 'null') {
        try {
          const names = JSON.parse(m.away_scorers.replace(/'/g, '"'));
          names.forEach((n: string) => {
            const clean = n.replace(/\d+'?/, '').trim();
            scorers.set(clean, (scorers.get(clean) || 0) + 1);
          });
        } catch {}
      }
    });
    return Array.from(scorers.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);
  }, [matches]);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <div className="flex items-center gap-3">
          <BarChart3 size={28} className="text-accent-orange" />
          <h1 className="text-2xl md:text-3xl font-black">Rankings</h1>
        </div>
        <p className="text-sm text-text-secondary">Goleadores, asistencias y más</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Scorers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-dark p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Trophy size={18} className="text-accent-gold" />
            <h2 className="text-sm font-bold uppercase tracking-wider">Goleadores</h2>
          </div>
          <div className="space-y-2">
            {topScorers.map(([name, goals], i) => (
              <div key={name} className="flex items-center justify-between p-3 rounded-xl bg-navy-700/20">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-accent-teal w-6">{i + 1}</span>
                  <span className="text-sm font-medium">{name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target size={14} className="text-accent-orange" />
                  <span className="text-sm font-bold neon-text-green">{goals}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Team Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-dark p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Shield size={18} className="text-accent-teal" />
            <h2 className="text-sm font-bold uppercase tracking-wider">Equipos participantes</h2>
          </div>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {teams?.slice(0, 48).map((team, i) => (
              <div key={team.id} className="flex items-center justify-between p-3 rounded-xl bg-navy-700/20">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-text-muted w-6">{i + 1}</span>
                  <img src={team.flag} alt="" className="w-8 h-5 rounded object-cover" />
                  <span className="text-sm font-medium">{team.name_en}</span>
                </div>
                <span className="text-[10px] text-text-muted">Grupo {team.groups}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
