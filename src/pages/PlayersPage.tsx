import { motion, AnimatePresence } from 'framer-motion';
import { useMatches, useTeams } from '@/hooks/useQueries';
import {
  UserRound, Search, Trophy, Target, Zap, Flame, Medal, Users,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import type { Team } from '@/types';

interface ScorerData {
  name: string;
  goals: number;
  matches: number;
  teamId: string;
  teamName: string;
  teamFlag: string;
  teamGroup: string;
  minutes: string[];
}

function parseScorers(scorersRaw: string): string[] {
  if (!scorersRaw || scorersRaw === 'null') return [];
  try {
    const cleaned = scorersRaw
      .replace(/'/g, '"')
      .replace(/"/g, '"')
      .replace(/"/g, '"');
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    // Fallback: split by comma and clean
    return scorersRaw
      .replace(/[{}'"]/g, '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
}

function cleanName(raw: string): string {
  // Remove minute markers like 9', 67', etc.
  return raw.replace(/\s*\d+'?\s*$/, '').trim();
}

function cleanGoalEntry(raw: string): { name: string; minute: string } {
  const minuteMatch = raw.match(/(\d+\+?\d*)'?\s*$/);
  const minute = minuteMatch ? minuteMatch[1] : '?';
  const name = raw.replace(/\s*\d+\+?\d*'?\s*$/, '').trim();
  return { name, minute };
}

function PlayerDetailModal({
  player,
  onClose,
}: {
  player: ScorerData;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="card-dark p-6 max-w-md w-full border border-accent-teal/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-accent-teal/10 border-2 border-accent-teal/30 flex items-center justify-center mb-3">
            <UserRound size={40} className="text-accent-teal/60" />
          </div>
          <h2 className="text-xl font-black neon-text-green">{player.name}</h2>
          <div className="flex items-center justify-center gap-2 mt-1">
            <img src={player.teamFlag} alt="" className="w-6 h-4 rounded" />
            <span className="text-sm text-text-secondary">{player.teamName}</span>
            <span className="text-[10px] text-text-muted">Grupo {player.teamGroup}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="card-dark p-4 text-center">
            <Trophy size={20} className="mx-auto mb-1 text-accent-gold" />
            <p className="text-2xl font-black neon-text-green">{player.goals}</p>
            <p className="text-[10px] text-text-muted uppercase">Goles</p>
          </div>
          <div className="card-dark p-4 text-center">
            <Target size={20} className="mx-auto mb-1 text-accent-orange" />
            <p className="text-2xl font-black neon-text-green">{player.matches}</p>
            <p className="text-[10px] text-text-muted uppercase">Partidos</p>
          </div>
          <div className="card-dark p-4 text-center">
            <Zap size={20} className="mx-auto mb-1 text-accent-teal" />
            <p className="text-2xl font-black neon-text-green">
              {player.matches > 0 ? (player.goals / player.matches).toFixed(1) : '0'}
            </p>
            <p className="text-[10px] text-text-muted uppercase">Goles/partido</p>
          </div>
          <div className="card-dark p-4 text-center">
            <Flame size={20} className="mx-auto mb-1 text-accent-teal" />
            <p className="text-2xl font-black neon-text-green">{player.minutes.length}</p>
            <p className="text-[10px] text-text-muted uppercase">Minutos</p>
          </div>
        </div>

        {player.minutes.length > 0 && (
          <div className="mt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Minutos de gol</h3>
            <div className="flex flex-wrap gap-2">
              {player.minutes.map((m, i) => (
                <span key={i} className="px-2 py-1 rounded-lg text-xs font-mono bg-accent-teal/10 text-accent-teal">
                  {m}'
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function PlayerCard({ player, rank, onClick }: { player: ScorerData; rank: number; onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="card-dark p-4 border border-border-card hover:border-accent-teal/20 cursor-pointer transition-all"
    >
      <div className="flex items-center gap-3">
        <span className={`text-lg font-black w-8 ${
          rank <= 3 ? 'neon-text-gold' : 'text-text-muted'
        }`}>
          {rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : `#${rank}`}
        </span>
        <div className="w-10 h-10 rounded-full bg-accent-teal/10 flex items-center justify-center flex-shrink-0">
          <UserRound size={20} className="text-accent-teal" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold truncate">{player.name}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <img src={player.teamFlag} alt="" className="w-4 h-3 rounded" />
            <span className="text-[10px] text-text-muted truncate">{player.teamName}</span>
          </div>
        </div>
        <div className="text-center flex-shrink-0">
          <p className="text-xl font-black neon-text-green">{player.goals}</p>
          <p className="text-[9px] text-text-muted uppercase">Goles</p>
        </div>
      </div>
    </motion.div>
  );
}

export function PlayersPage() {
  const { data: matches, isLoading: mLoading } = useMatches();
  const { data: teams } = useTeams();
  const [search, setSearch] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<ScorerData | null>(null);
  const [sortBy, setSortBy] = useState<'goals' | 'name'>('goals');

  const teamMap = useMemo(() => {
    if (!teams) return new Map<string, Team>();
    const map = new Map<string, Team>();
    teams.forEach((t) => map.set(t.id, t));
    return map;
  }, [teams]);

  const players = useMemo(() => {
    if (!matches) return [];
    const playerMap = new Map<string, ScorerData>();

    matches.forEach((m) => {
      const homeScorers = parseScorers(m.home_scorers);
      const awayScorers = parseScorers(m.away_scorers);

      [...homeScorers].forEach((entry) => {
        const { name, minute } = cleanGoalEntry(entry);
        if (!name || name === 'null') return;
        const existing = playerMap.get(name);
        if (existing) {
          existing.goals += 1;
          existing.minutes.push(minute);
        } else {
          playerMap.set(name, {
            name,
            goals: 1,
            matches: 1,
            teamId: m.home_team_id,
            teamName: m.home_team_name_en,
            teamFlag: teamMap.get(m.home_team_id)?.flag || '',
            teamGroup: teamMap.get(m.home_team_id)?.groups || m.group || '?',
            minutes: [minute],
          });
        }
      });

      [...awayScorers].forEach((entry) => {
        const { name, minute } = cleanGoalEntry(entry);
        if (!name || name === 'null') return;
        const existing = playerMap.get(name);
        if (existing) {
          existing.goals += 1;
          existing.minutes.push(minute);
        } else {
          playerMap.set(name, {
            name,
            goals: 1,
            matches: 1,
            teamId: m.away_team_id,
            teamName: m.away_team_name_en,
            teamFlag: teamMap.get(m.away_team_id)?.flag || '',
            teamGroup: teamMap.get(m.away_team_id)?.groups || m.group || '?',
            minutes: [minute],
          });
        }
      });
    });

    let list = Array.from(playerMap.values());
    list.sort((a, b) => sortBy === 'goals' ? b.goals - a.goals : a.name.localeCompare(b.name));
    return list;
  }, [matches, teamMap, sortBy]);

  const filtered = useMemo(() => {
    if (!search.trim()) return players;
    const q = search.toLowerCase();
    return players.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.teamName.toLowerCase().includes(q)
    );
  }, [players, search]);

  const totalGoals = useMemo(() => players.reduce((sum, p) => sum + p.goals, 0), [players]);
  const topScorer = players[0];

  if (mLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-accent-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <div className="flex items-center gap-3">
          <UserRound size={28} className="text-accent-teal" />
          <h1 className="text-2xl md:text-3xl font-black">Jugadores</h1>
        </div>
        <p className="text-sm text-text-secondary">{players.length} goleadores · {totalGoals} goles en el torneo</p>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Users, value: players.length, label: 'Goleadores', color: '#00ff88' },
          { icon: Target, value: totalGoals, label: 'Goles totales', color: '#ff6b35' },
          { icon: Medal, value: topScorer?.goals ?? 0, label: 'Máximo goleador', color: '#ffd700' },
          { icon: Trophy, value: new Set(players.map((p) => p.teamId)).size, label: 'Equipos con gol', color: '#00aaff' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card-dark p-4 text-center"
          >
            <stat.icon size={20} className="mx-auto mb-2" />
            <p className="text-2xl font-black neon-text-green">{stat.value}</p>
            <p className="text-[10px] text-text-muted uppercase">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Search + Sort */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar jugador o equipo..."
            className="w-full bg-navy-700/50 border border-border-card rounded-xl py-2.5 pl-10 pr-4 text-sm text-text-primary focus:outline-none focus:border-accent-teal/30 transition-colors"
          />
        </div>
        <button
          onClick={() => setSortBy(sortBy === 'goals' ? 'name' : 'goals')}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-navy-700/50 border border-border-card text-text-secondary hover:bg-navy-600/50 transition-all"
        >
          {sortBy === 'goals' ? '🔥 Por goles' : '🔤 Alfabético'}
        </button>
      </div>

      {/* Player list */}
      <div className="space-y-2">
        {filtered.map((player, i) => (
          <PlayerCard
            key={player.name}
            player={player}
            rank={sortBy === 'goals' ? i + 1 : 0}
            onClick={() => setSelectedPlayer(player)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <UserRound size={48} className="mx-auto mb-4 text-white/5" />
            <p className="text-sm text-text-muted">No se encontraron jugadores</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedPlayer && (
          <PlayerDetailModal
            player={selectedPlayer}
            onClose={() => setSelectedPlayer(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
