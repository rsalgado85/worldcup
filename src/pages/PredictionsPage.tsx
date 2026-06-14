import { motion, AnimatePresence } from 'framer-motion';
import { useGroups, useTeams } from '@/hooks/useQueries';
import { Brain, TrendingUp, Trophy, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useMemo } from 'react';
import type { Group, Team } from '@/types';
import { PageWrapper, PageHeader, StatsGrid, LoadingSpinner, EmptyState } from '@/components/ui/design-system';

function GroupPrediction({ group, teams }: { group: Group; teams: Map<string, Team> }) {
  const [expanded, setExpanded] = useState(false);
  const sorted = [...group.teams].sort((a, b) => {
    const ptsA = Number(a.pts);
    const ptsB = Number(b.pts);
    if (ptsB !== ptsA) return ptsB - ptsA;
    return Number(b.gd) - Number(a.gd);
  });
  const maxPts = Math.max(...sorted.map(t => Number(t.pts)), 1);

  const getTeamName = (id: string) => teams.get(id)?.name_en || `Team ${id}`;
  const getFlag = (id: string) => teams.get(id)?.flag || '';

  return (
    <div className="hd-card">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 flex items-center justify-between border-b border-border-card"
      >
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-accent-teal">Grupo {group.name}</h3>
          <p className="text-[10px] text-text-muted mt-0.5">{sorted.length} equipos</p>
        </div>
        {expanded ? <ChevronUp size={16} className="text-text-muted" /> : <ChevronDown size={16} className="text-text-muted" />}
      </button>

      {/* Body */}
      <div className="hd-card-body">
        {/* Top 2 */}
        <div className="space-y-1.5 mb-3">
          {sorted.slice(0, 2).map((t, i) => (
            <div key={t.team_id} className="flex items-center gap-2 p-2 rounded-lg bg-accent-teal/5">
              <span className="text-xs font-bold text-accent-teal">#{i + 1}</span>
              {getFlag(t.team_id) && (
                <img src={getFlag(t.team_id)} alt="" className="w-5 h-3.5 rounded flex-shrink-0" />
              )}
              <span className="text-xs font-semibold text-white flex-1 truncate">{getTeamName(t.team_id)}</span>
              <span className="text-xs font-black text-accent-teal">{t.pts}</span>
            </div>
          ))}
        </div>

        {/* Stat bars for top 2 */}
        {sorted.slice(0, 2).map((t, i) => (
          <div key={`stat-${t.team_id}`} className="hd-stat-row">
            <span className="hd-stat-icon text-[10px]">{['🥇', '🥈'][i]}</span>
            <div className="hd-stat-bar">
              <div className={`hd-stat-fill ${i === 0 ? 'bg-accent-gold' : 'bg-accent-teal'}`}
                style={{ width: `${(Number(t.pts) / maxPts) * 100}%` }} />
            </div>
            <span className="hd-stat-value">{t.pts}pts</span>
          </div>
        ))}

        {/* Expandable table */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 border-t border-border-card space-y-1">
                {sorted.map((t, i) => (
                  <div key={t.team_id} className="flex items-center gap-1.5 text-[10px] py-1">
                    <span className="w-4 text-text-muted">{i + 1}</span>
                    <span className="flex-1 truncate text-white font-medium">{getTeamName(t.team_id)}</span>
                    <span className="text-text-dim w-8 text-right">PJ{t.mp}</span>
                    <span className="text-text-dim w-6 text-right">G{t.w}</span>
                    <span className="text-text-dim w-6 text-right">E{t.d}</span>
                    <span className="text-text-dim w-6 text-right">P{t.l}</span>
                    <span className="font-bold text-accent-teal w-7 text-right">{t.pts}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-text-muted mt-3">
                Los 2 primeros + 8 mejores terceros avanzan.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
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
    if (!groups) return [];
    const totalTeams = groups.reduce((sum, g) => sum + g.teams.length, 0);
    const playedGroups = groups.filter((g) => g.teams.some((t) => Number(t.mp) > 0)).length;
    const totalPoints = groups.reduce((sum, g) =>
      sum + g.teams.reduce((s, t) => s + Number(t.pts), 0), 0);
    return [
      { icon: Shield, value: playedGroups, label: 'Grupos activos', color: '#22C55E' },
      { icon: TrendingUp, value: totalPoints, label: 'Puntos repartidos', color: '#3B82F6' },
      { icon: Trophy, value: totalTeams, label: 'Equipos', color: '#F5A623' },
    ];
  }, [groups]);

  if (isLoading) return <PageWrapper><LoadingSpinner /></PageWrapper>;

  return (
    <PageWrapper>
      <PageHeader
        icon={Brain}
        title="Predicciones"
        subtitle="Proyecciones de clasificación basadas en resultados actuales"
      />

      {stats.length > 0 && <StatsGrid items={stats} columns={3} />}

      {groups && groups.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {groups.map((group, i) => (
            <motion.div
              key={group.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <GroupPrediction group={group} teams={teamMap} />
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState icon={Brain} message="Cargando datos de grupos..." />
      )}
    </PageWrapper>
  );
}
