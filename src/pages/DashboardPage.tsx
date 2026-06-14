import { motion } from 'framer-motion';
import { useTeams, useMatches, useStadiums, useGroups } from '@/hooks/useQueries';
import {
  Users, Building2, Swords, CalendarDays, TrendingUp, Activity,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Match } from '@/types';

function StatCard({ icon: Icon, value, label, color }: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  value: string | number;
  label: string;
  color: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="glass rounded-2xl p-5 cursor-default"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${color}15` }}>
          <Icon size={20} className={`text-[${color}]`} />
        </div>
        <span className="text-3xl font-black neon-text-green">{value}</span>
      </div>
      <p className="text-sm text-text-secondary">{label}</p>
    </motion.div>
  );
}

function FeaturedMatch({ match }: { match: Match }) {
  const isLive = !match.finished || match.finished === 'FALSE';
  const isFinished = match.finished === 'TRUE';

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="glass-strong rounded-2xl p-6 border border-neon-green/10"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-neon-green">
          {match.group} · J{match.matchday}
        </span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
          isLive ? 'bg-neon-green/15 text-neon-green animate-pulse' :
          isFinished ? 'bg-text-muted/10 text-text-muted' :
          'bg-neon-blue/15 text-neon-blue'
        }`}>
          {isFinished ? 'FINAL' : isLive ? 'EN VIVO' : 'PROGRAMADO'}
        </span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="text-center flex-1">
          <p className="text-lg font-bold">{match.home_team_name_en}</p>
        </div>
        <div className="text-center">
          <span className="text-3xl font-black neon-text-green">
            {match.home_score} - {match.away_score}
          </span>
          <p className="text-[10px] text-text-muted mt-1">{match.local_date?.split(' ')[1] || ''}</p>
        </div>
        <div className="text-center flex-1">
          <p className="text-lg font-bold">{match.away_team_name_en}</p>
        </div>
      </div>
    </motion.div>
  );
}

function GroupStandings({ groupName }: { groupName: string }) {
  const { data: groups } = useGroups();
  const group = groups?.find((g) => g.name === groupName);
  if (!group) return null;

  return (
    <div className="glass rounded-xl p-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-neon-green mb-3">Grupo {groupName}</h3>
      <table className="w-full text-xs">
        <thead>
          <tr className="text-text-muted">
            <th className="text-left pb-2">Equipo</th>
            <th className="text-center pb-2">PJ</th>
            <th className="text-center pb-2">Pts</th>
            <th className="text-center pb-2">DG</th>
          </tr>
        </thead>
        <tbody>
          {group.teams.slice(0, 4).map((t) => (
            <tr key={t.team_id} className="border-t border-border-subtle">
              <td className="py-1.5 font-medium">{t.team_id}</td>
              <td className="text-center text-text-secondary">{t.mp}</td>
              <td className="text-center font-bold text-neon-green">{t.pts}</td>
              <td className="text-center text-text-secondary">{t.gd}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DashboardPage() {
  const { data: teams } = useTeams();
  const { data: matches } = useMatches();
  const { data: stadiums } = useStadiums();

  const liveMatches = matches?.filter((m) => m.finished !== 'TRUE' && m.type === 'group') ?? [];
  const featuredMatch = matches?.find((m) => m.finished === 'TRUE') ?? matches?.[0];

  const stats = [
    { icon: Users, value: teams?.length ?? 48, label: 'Equipos', color: '#00ff88' },
    { icon: Building2, value: stadiums?.length ?? 16, label: 'Estadios', color: '#00aaff' },
    { icon: Swords, value: matches?.length ?? 104, label: 'Partidos', color: '#ff6b35' },
    { icon: CalendarDays, value: 39, label: 'Días de torneo', color: '#ffd700' },
  ];

  const mainGroups = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-black">
          <span className="neon-text-green">COPA MUNDIAL</span>{' '}
          <span className="text-white">2026</span>
        </h1>
        <p className="text-sm text-text-secondary">Tres países. Un mundo. Una copa.</p>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* Featured Match + Live */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {featuredMatch && <FeaturedMatch match={featuredMatch} />}
          <div className="flex items-center gap-4 mt-4">
            <Link to="/matches" className="text-sm text-neon-green hover:underline font-medium">
              Ver todos los partidos →
            </Link>
            <Link to="/teams" className="text-sm text-neon-blue hover:underline font-medium">
              Explorar equipos →
            </Link>
          </div>
        </div>
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={16} className="text-neon-green" />
            <h2 className="text-sm font-bold uppercase tracking-wider">En vivo</h2>
          </div>
          {liveMatches.length > 0 ? (
            <div className="space-y-3">
              {liveMatches.slice(0, 5).map((m) => (
                <div key={m.id} className="flex items-center justify-between p-3 rounded-xl bg-white/2">
                  <span className="text-xs font-medium w-20 truncate">{m.home_team_name_en}</span>
                  <span className="text-sm font-bold neon-text-green">vs</span>
                  <span className="text-xs font-medium w-20 truncate text-right">{m.away_team_name_en}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-text-muted">No hay partidos en vivo ahora</p>
          )}
        </div>
      </div>

      {/* Group Standings Grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-neon-green" />
          <h2 className="text-lg font-bold">Grupos</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {mainGroups.map((g) => (
            <GroupStandings key={g} groupName={g} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
