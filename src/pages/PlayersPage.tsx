import { motion, AnimatePresence } from 'framer-motion';
import { useMatches, useTeams } from '@/hooks/useQueries';
import {
  UserRound, Search, Trophy, Target, Zap, Flame, Medal, Users,
  ExternalLink,
} from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
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
  photoUrl?: string;
}

// ─── Wikipedia Photo Cache ───
const photoCache = new Map<string, string | null>();

async function fetchPlayerPhoto(name: string): Promise<string | null> {
  if (photoCache.has(name)) return photoCache.get(name)!;

  try {
    // Try Wikipedia REST API summary
    const wikiName = name.replace(/\s+/g, '_');
    const resp = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiName)}`,
      { headers: { 'User-Agent': 'WorldCupInsight/1.0' } }
    );
    if (resp.ok) {
      const data = await resp.json();
      const thumb = data.thumbnail?.source || data.originalimage?.source;
      if (thumb) {
        photoCache.set(name, thumb);
        return thumb;
      }
    }
  } catch {}

  // Fallback: search and get page image
  try {
    const searchResp = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(name + ' footballer')}&format=json&origin=*&srlimit=1`
    );
    const searchData = await searchResp.json();
    const title = searchData?.query?.search?.[0]?.title;
    if (title) {
      const imgResp = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&pithumbsize=300&format=json&origin=*`
      );
      const imgData = await imgResp.json();
      const pages = imgData?.query?.pages || {};
      for (const page of Object.values(pages) as any[]) {
        if (page.thumbnail?.source) {
          photoCache.set(name, page.thumbnail.source);
          return page.thumbnail.source;
        }
      }
    }
  } catch {}

  photoCache.set(name, null);
  return null;
}

// ─── Photo Component ───
function PlayerPhoto({ name, size = 56 }: { name: string; size?: number }) {
  const [photo, setPhoto] = useState<string | null | undefined>(undefined);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchPlayerPhoto(name).then((url) => {
      if (!cancelled) setPhoto(url);
    });
    return () => { cancelled = true; };
  }, [name]);

  if (photo && !error) {
    return (
      <img
        src={photo}
        alt={name}
        className="rounded-full object-cover border-2 border-accent-teal/20 shadow-lg flex-shrink-0"
        style={{ width: size, height: size }}
        onError={() => setError(true)}
        loading="lazy"
      />
    );
  }

  // Fallback avatar
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div
      className="rounded-full bg-navy-600 border-2 border-accent-teal/10 flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <span className="font-black text-accent-teal/50" style={{ fontSize: size * 0.32 }}>
        {initials}
      </span>
    </div>
  );
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
    return scorersRaw
      .replace(/[{}'"]/g, '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
}

function cleanGoalEntry(raw: string): { name: string; minute: string } {
  const minuteMatch = raw.match(/(\d+\+?\d*)'?\s*$/);
  const minute = minuteMatch ? minuteMatch[1] : '?';
  const name = raw.replace(/\s*\d+\+?\d*'?\s*$/, '').trim();
  return { name, minute };
}

// ─── Player Detail Modal ───
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
        className="card-dark p-8 max-w-md w-full border border-accent-teal/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <PlayerPhoto name={player.name} size={88} />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">{player.name}</h2>
          <div className="flex items-center justify-center gap-2">
            <img src={player.teamFlag} alt="" className="w-7 h-5 rounded shadow" />
            <span className="text-sm text-text-secondary">{player.teamName}</span>
            <span className="text-[11px] text-text-muted">· Grupo {player.teamGroup}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="card-dark p-5 text-center" style={{ background: 'linear-gradient(135deg, rgba(245,166,35,0.08), transparent)' }}>
            <Trophy size={24} className="mx-auto mb-2 text-accent-gold" />
            <p className="text-3xl font-black text-white">{player.goals}</p>
            <p className="text-[11px] text-text-muted uppercase tracking-wider mt-1">Goles</p>
          </div>
          <div className="card-dark p-5 text-center">
            <Target size={24} className="mx-auto mb-2 text-accent-orange" />
            <p className="text-3xl font-black text-white">{player.matches}</p>
            <p className="text-[11px] text-text-muted uppercase tracking-wider mt-1">Partidos</p>
          </div>
          <div className="card-dark p-5 text-center">
            <Zap size={24} className="mx-auto mb-2 text-accent-teal" />
            <p className="text-3xl font-black text-white">
              {player.matches > 0 ? (player.goals / player.matches).toFixed(1) : '0'}
            </p>
            <p className="text-[11px] text-text-muted uppercase tracking-wider mt-1">Goles/partido</p>
          </div>
          <div className="card-dark p-5 text-center">
            <Flame size={24} className="mx-auto mb-2 text-red-400" />
            <p className="text-3xl font-black text-white">{player.minutes.length}</p>
            <p className="text-[11px] text-text-muted uppercase tracking-wider mt-1">Minutos</p>
          </div>
        </div>

        {player.minutes.length > 0 && (
          <div className="mt-6 pt-5 border-t border-border-card">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Minutos de gol</h3>
            <div className="flex flex-wrap gap-2">
              {player.minutes.map((m, i) => (
                <span key={i} className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-accent-teal/10 text-accent-teal border border-accent-teal/20">
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

// ─── Player Card (rediseñada) ───
function PlayerCard({ player, rank, onClick }: { player: ScorerData; rank: number; onClick: () => void }) {
  const isTop3 = rank >= 1 && rank <= 3;
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      onClick={onClick}
      className={`card-dark p-5 border cursor-pointer transition-all duration-200 ${
        isTop3
          ? 'border-accent-gold/20 hover:border-accent-gold/40 shadow-[0_0_20px_rgba(245,166,35,0.05)]'
          : 'border-border-card hover:border-accent-teal/20'
      }`}
      style={isTop3 ? { background: `linear-gradient(135deg, rgba(245,166,35,${0.04 + (4 - rank) * 0.02}), #0F1D3A)` } : undefined}
    >
      <div className="flex items-center gap-5">
        {/* Rank */}
        <div className="flex-shrink-0 w-10 text-center">
          {isTop3 ? (
            <span className="text-2xl">{medals[rank - 1]}</span>
          ) : (
            <span className="text-sm font-bold text-text-muted">#{rank}</span>
          )}
        </div>

        {/* Photo */}
        <PlayerPhoto name={player.name} size={56} />

        {/* Name + Team */}
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-white truncate">{player.name}</p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <img src={player.teamFlag} alt="" className="w-5 h-3.5 rounded shadow-sm" />
            <span className="text-[11px] text-text-secondary truncate">{player.teamName}</span>
            <span className="text-[10px] text-text-muted ml-0.5">Gr. {player.teamGroup}</span>
          </div>
        </div>

        {/* Stats mini */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="text-center">
            <p className={`text-xl font-black ${isTop3 ? 'text-accent-gold' : 'text-white'}`}>
              {player.goals}
            </p>
            <p className="text-[9px] text-text-muted uppercase tracking-wider">Goles</p>
          </div>
          <div className="text-center hidden sm:block">
            <p className="text-sm font-semibold text-text-secondary">{player.matches}</p>
            <p className="text-[9px] text-text-muted uppercase tracking-wider">PJ</p>
          </div>
        </div>
      </div>

      {/* Goal minutes bar for top scorers */}
      {player.minutes.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border-card flex items-center gap-2">
          <Clock size={12} className="text-text-muted flex-shrink-0" />
          <div className="flex flex-wrap gap-1">
            {player.minutes.slice(0, 6).map((m, i) => (
              <span key={i} className="px-1.5 py-0.5 rounded text-[9px] font-mono font-medium bg-navy-700/50 text-text-muted">
                {m}'
              </span>
            ))}
            {player.minutes.length > 6 && (
              <span className="text-[9px] text-text-muted">+{player.minutes.length - 6}</span>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Small clock icon for minutes bar
function Clock({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

// ─── MAIN PAGE ───
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
    <div className="p-5 md:p-6 lg:p-8 max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-teal/10 flex items-center justify-center">
            <UserRound size={20} className="text-accent-teal" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white">Top Jugadores</h1>
            <p className="text-sm text-text-secondary">{players.length} goleadores · {totalGoals} goles en el torneo</p>
          </div>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Users, value: players.length, label: 'Goleadores' },
          { icon: Target, value: totalGoals, label: 'Goles totales' },
          { icon: Medal, value: topScorer?.goals ?? 0, label: 'Máximo goleador' },
          { icon: Trophy, value: new Set(players.map((p) => p.teamId)).size, label: 'Equipos con gol' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card-dark p-5 text-center"
          >
            <stat.icon size={22} className="mx-auto mb-2 text-accent-teal" />
            <p className="text-2xl font-black text-white">{stat.value}</p>
            <p className="text-[11px] text-text-muted uppercase tracking-wider mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Search + Sort */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar jugador o equipo..."
            className="w-full bg-navy-700/50 border border-border-card rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-accent-teal/30 transition-colors"
          />
        </div>
        <button
          onClick={() => setSortBy(sortBy === 'goals' ? 'name' : 'goals')}
          className="flex items-center gap-1.5 px-5 py-3 rounded-xl text-xs font-semibold bg-navy-700/50 border border-border-card text-text-secondary hover:bg-navy-600/50 hover:text-white transition-all"
        >
          {sortBy === 'goals' ? '🔥 Por goles' : '🔤 Alfabético'}
        </button>
      </div>

      {/* Player list */}
      <div className="space-y-3">
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
            <UserRound size={48} className="mx-auto mb-4 text-text-muted/20" />
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
