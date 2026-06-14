import { motion, AnimatePresence } from 'framer-motion';
import { useGroups, useTeams } from '@/hooks/useQueries';
import { Brain, TrendingUp, Trophy, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useMemo } from 'react';
import type { Group, Team } from '@/types';

function GroupPrediction({ group, teams }: { group: Group; teams: Map<string, Team> }) {
  const [expanded, setExpanded] = useState(false);
  const sorted = [...group.teams].sort((a, b) => {
    const ptsA = Number(a.pts);
    const ptsB = Number(b.pts);
    if (ptsB !== ptsA) return ptsB - ptsA;
    return Number(b.gd) - Number(a.gd);
  });

  const getTeamName = (id: string) => teams.get(id)?.name_en || `Team ${id}`;
  const getFlag = (id: string) => teams.get(id)?.flag || '';

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="glass rounded-xl p-4 border border-border-subtle"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between"
      >
        <h3 className="text-sm font-bold uppercase tracking-wider text-neon-green">Grupo {group.name}</h3>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      <div className="mt-4 space-y-2">
        {sorted.slice(0, 2).map((t, i) => (
          <div key={t.team_id} className="flex items-center gap-2 p-2 rounded-lg bg-neon-green/5">
            <span className="text-[10px] font-bold text-neon-green">#{i + 1}</span>
            {getFlag(t.team_id) && (
              <img src={getFlag(t.team_id)} alt="" className="w-5 h-3.5 rounded" />
            )}
            <span className="text-xs font-semibold flex-1">{getTeamName(t.team_id)}</span>
            <span className="text-[10px] font-bold text-neon-green">{t.pts} pts</span>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-border-subtle space-y-1.5">
              {sorted.map((t, i) => (
                <div key={t.team_id} className="flex items-center gap-2 text-[10px]">
                  <span className="w-4 text-text-muted">{i + 1}</span>
                  <span className="flex-1 truncate">{getTeamName(t.team_id)}</span>
                  <span className="text-text-secondary">PJ:{t.mp}</span>
                  <span className="text-text-secondary">G:{t.w}</span>
                  <span className="text-text-secondary">E:{t.d}</span>
                  <span className="text-text-secondary">P:{t.l}</span>
                  <span className="font-bold text-neon-green">{t.pts}</span>
                </div>
              ))}
            </div>
            <p className="text-[9px] text-text-muted mt-3">
              Los 2 primeros de cada grupo + los 8 mejores terceros avanzan a dieciseisavos.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function PredictionsPage() {
  const { data: groups, isLoading } = useGroups();
  const { data: teams } = useTeams();

  const teamMap = useMemo(() => {
    if (!teams) return new Map();
    const map = new Map<string, Team>();
    teams.forEach((t) => map.set(t.id, t));
    return map;
  }, [teams]);

  const stats = useMemo(() => {
    if (!groups) return null;
    const totalTeams = groups.reduce((sum, g) => sum + g.teams.length, 0);
    const playedGroups = groups.filter((g) => g.teams.some((t) => Number(t.mp) > 0)).length;
    const totalPoints = groups.reduce((sum, g) =>
      sum + g.teams.reduce((s, t) => s + Number(t.pts), 0), 0);
    return { totalTeams, playedGroups, totalPoints };
  }, [groups]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-neon-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <div className="flex items-center gap-3">
          <Brain size={28} className="text-neon-pink" />
          <h1 className="text-2xl md:text-3xl font-black">Predicciones</h1>
        </div>
        <p className="text-sm text-text-secondary">Proyecciones de clasificación basadas en los resultados actuales</p>
      </motion.div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Shield, value: stats.playedGroups, label: 'Grupos activos', color: '#00ff88' },
            { icon: TrendingUp, value: stats.totalPoints, label: 'Puntos repartidos', color: '#00aaff' },
            { icon: Trophy, value: stats.totalTeams, label: 'Equipos', color: '#ffd700' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-4 text-center"
            >
              <s.icon size={20} className="mx-auto mb-2" />
              <p className="text-2xl font-black neon-text-green">{s.value}</p>
              <p className="text-[10px] text-text-muted uppercase">{s.label}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Group predictions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {groups?.map((group, i) => (
          <motion.div
            key={group.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <GroupPrediction group={group} teams={teamMap} />
          </motion.div>
        ))}
      </div>

      {!groups?.length && (
        <div className="text-center py-20">
          <Brain size={48} className="mx-auto mb-4 text-neon-pink/30" />
          <p className="text-sm text-text-muted">Cargando datos de grupos...</p>
        </div>
      )}
    </div>
  );
}
