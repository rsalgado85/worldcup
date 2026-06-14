import { motion, AnimatePresence } from 'framer-motion';
import { useMatches, useTeams } from '@/hooks/useQueries';
import {
  UserRound, Search, Trophy, Target, Zap, Flame, Medal, Users,
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
    const wikiName = name.replace(/\s+/g, '_');
    const resp = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiName)}`,
      { headers: { 'User-Agent': 'WorldCupInsight/1.0' } }
    );
    if (resp.ok) {
      const data = await resp.json();
      const thumb = data.thumbnail?.source || data.originalimage?.source;
      if (thumb) { photoCache.set(name, thumb); return thumb; }
    }
  } catch {}
  try {
    const sr = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(name + ' footballer')}&format=json&origin=*&srlimit=1`
    );
    const sd = await sr.json();
    const title = sd?.query?.search?.[0]?.title;
    if (title) {
      const ir = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&pithumbsize=300&format=json&origin=*`
      );
      const id = await ir.json();
      for (const p of Object.values(id?.query?.pages || {}) as any[]) {
        if (p.thumbnail?.source) { photoCache.set(name, p.thumbnail.source); return p.thumbnail.source; }
      }
    }
  } catch {}
  photoCache.set(name, null);
  return null;
}

// ─── Photo component ───
function PlayerPhoto({ name, accentColor, size = 'large' }: { name: string; accentColor: string; size?: 'small' | 'large' }) {
  const [photo, setPhoto] = useState<string | null | undefined>(undefined);
  const [error, setError] = useState(false);
  const dims = size === 'large' ? 'h-36 sm:h-44' : 'w-12 h-12';

  useEffect(() => {
    let c = false;
    fetchPlayerPhoto(name).then(u => { if (!c) setPhoto(u); });
    return () => { c = true; };
  }, [name]);

  const container = `relative w-full ${dims} rounded-xl overflow-hidden flex items-center justify-center`;
  const bgStyle = { background: `linear-gradient(135deg, ${accentColor}18 0%, ${accentColor}08 100%)`, border: `1px solid ${accentColor}20` };

  if (photo && !error) {
    return (
      <motion.div className={container} style={bgStyle} whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
        <img src={photo} alt={name} className="w-full h-full object-contain p-2" loading="lazy" onError={() => setError(true)} />
        <div className="absolute inset-x-0 bottom-0 h-8" style={{ background: `linear-gradient(to top, ${accentColor}10, transparent)` }} />
      </motion.div>
    );
  }

  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className={container} style={bgStyle}>
      <span className="font-black opacity-30" style={{ color: accentColor, fontSize: size === 'large' ? '2.5rem' : '1rem' }}>{initials}</span>
    </div>
  );
}

// ─── Stat bar (HyruleDex style) ───
function StatBar({ label, value, max, color, suffix = '' }: { label: string; value: number; max: number; color: string; suffix?: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs w-5 text-center">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ backgroundColor: color }}
        />
      </div>
      <span className="text-[9px] font-mono text-text-secondary/50 w-10 text-right">{value}{suffix}</span>
    </div>
  );
}

// ─── Player Card (HyruleDex style) ───
function PlayerCard({ player, rank, isExpanded, onToggle, maxGoals }: {
  player: ScorerData;
  rank: number;
  isExpanded: boolean;
  onToggle: () => void;
  maxGoals: number;
}) {
  const isTop3 = rank >= 1 && rank <= 3;
  const medals = ['🥇', '🥈', '🥉'];
  const accentColor = isTop3 ? '#F5A623' : '#14B8A6';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (rank % 6) * 0.06, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -6, scale: 1.02 }}
      onClick={onToggle}
      className="relative rounded-2xl overflow-hidden cursor-pointer group"
      style={{
        background: `linear-gradient(145deg, ${accentColor}0D 0%, rgba(6, 11, 21, 0.95) 50%, ${accentColor}08 100%)`,
        border: `1px solid ${accentColor}22`,
        ...(isTop3 ? { boxShadow: `0 0 30px ${accentColor}08` } : {}),
      }}
    >
      {/* Glow on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ boxShadow: `inset 0 0 60px ${accentColor}15, 0 0 40px ${accentColor}10` }}
      />

      {/* Decorative corner blob */}
      <div
        className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-15"
        style={{ background: `radial-gradient(circle, ${accentColor}, transparent)` }}
      />

      <div className="relative p-5 sm:p-6">
        {/* Header row: rank medal + team badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {/* Rank */}
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${accentColor}18`, border: `1px solid ${accentColor}30` }}
            >
              {isTop3 ? (
                <span className="text-xl">{medals[rank - 1]}</span>
              ) : (
                <span className="text-sm font-black" style={{ color: accentColor }}>#{rank}</span>
              )}
            </div>
          </div>

          {/* Team badge */}
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
            style={{ backgroundColor: `${accentColor}20`, color: accentColor, border: `1px solid ${accentColor}30` }}
          >
            <img src={player.teamFlag} alt="" className="w-4 h-3 rounded-sm" />
            {player.teamName.slice(0, 15)}
          </div>
        </div>

        {/* Name */}
        <h3 className="text-lg font-black tracking-tight mb-3 text-white">
          {player.name}
        </h3>

        {/* Player Image */}
        <div className="mb-4 flex justify-center">
          <PlayerPhoto name={player.name} accentColor={accentColor} />
        </div>

        {/* Meta: goals + matches badges */}
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-[10px]" style={{ color: `${accentColor}80` }}>
            <span>⚽</span>
            <span className="font-bold text-white">{player.goals}</span>
            <span>goles</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px]" style={{ color: `${accentColor}80` }}>
            <span>📊</span>
            <span className="font-bold text-white">{player.matches}</span>
            <span>partidos</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px]" style={{ color: `${accentColor}80` }}>
            <span>⏱️</span>
            <span className="font-bold text-white">{player.minutes.length}</span>
            <span>minutos</span>
          </div>
        </div>

        {/* Stat Bars — HyruleDex pattern */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mb-3">
          <StatBar label="⚽" value={player.goals} max={maxGoals} color="#F5A623" />
          <StatBar label="📊" value={player.matches} max={7} color="#14B8A6" />
          <StatBar
            label="🎯"
            value={player.matches > 0 ? Math.round((player.goals / player.matches) * 10) : 0}
            max={30}
            color="#FF6B35"
          />
          <StatBar label="⏱️" value={player.minutes.length} max={30} color="#60A5FA" />
        </div>

        {/* Minutes chips — expandable */}
        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : '2rem', opacity: 1 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="flex flex-wrap gap-1.5">
            {player.minutes.slice(0, isExpanded ? 99 : 4).map((m, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded text-[9px] font-mono font-medium"
                style={{ backgroundColor: `${accentColor}12`, color: `${accentColor}`, border: `1px solid ${accentColor}20` }}
              >
                {m}'
              </span>
            ))}
            {!isExpanded && player.minutes.length > 4 && (
              <span className="text-[9px] flex items-center" style={{ color: `${accentColor}60` }}>
                +{player.minutes.length - 4} más
              </span>
            )}
          </div>
        </motion.div>

        {/* Bottom bar */}
        <div className="mt-4 pt-3 flex items-center justify-between border-t" style={{ borderColor: `${accentColor}15` }}>
          <span className="text-[10px] font-mono tracking-wider" style={{ color: `${accentColor}99` }}>
            Gr. {player.teamGroup}
          </span>
          <motion.span className="text-[10px] font-medium transition-opacity duration-300" style={{ color: accentColor }}>
            {isExpanded ? 'Ver menos ↑' : 'Ver más ↓'}
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Detail Modal ───
function PlayerDetailModal({ player, onClose }: { player: ScorerData; onClose: () => void }) {
  const accentColor = '#14B8A6';
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="rounded-2xl p-8 max-w-md w-full"
        style={{ background: `linear-gradient(145deg, ${accentColor}10, rgba(15,29,58,0.98), ${accentColor}06)`, border: `1px solid ${accentColor}25` }}
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <PlayerPhoto name={player.name} accentColor={accentColor} />
          <h2 className="text-xl font-black text-white mt-3">{player.name}</h2>
          <div className="flex items-center justify-center gap-2 mt-1">
            <img src={player.teamFlag} alt="" className="w-5 h-3.5 rounded" />
            <span className="text-sm text-text-secondary">{player.teamName}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Trophy, value: player.goals, label: 'Goles', color: '#F5A623' },
            { icon: Target, value: player.matches, label: 'Partidos', color: '#FF6B35' },
            { icon: Zap, value: player.matches > 0 ? (player.goals / player.matches).toFixed(1) : '0', label: 'Goles/PJ', color: '#14B8A6' },
            { icon: Flame, value: player.minutes.length, label: 'Minutos gol', color: '#EF4444' },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: `${s.color}10`, border: `1px solid ${s.color}20` }}>
              <s.icon size={20} className="mx-auto mb-1.5" style={{ color: s.color }} />
              <p className="text-xl font-black text-white">{s.value}</p>
              <p className="text-[10px] text-text-muted uppercase mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {player.minutes.length > 0 && (
          <div className="mt-5 pt-4 border-t" style={{ borderColor: `${accentColor}20` }}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Minutos de gol</h3>
            <div className="flex flex-wrap gap-1.5">
              {player.minutes.map((m, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium" style={{ backgroundColor: `${accentColor}15`, color: accentColor, border: `1px solid ${accentColor}25` }}>
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

// ─── Parser helpers ───
function parseScorers(raw: string): string[] {
  if (!raw || raw === 'null') return [];
  try {
    const c = raw.replace(/'/g, '"').replace(/"/g, '"').replace(/"/g, '"');
    const p = JSON.parse(c);
    return Array.isArray(p) ? p : [];
  } catch {
    return raw.replace(/[{}'"]/g, '').split(',').map(s => s.trim()).filter(Boolean);
  }
}

function cleanGoalEntry(raw: string): { name: string; minute: string } {
  const mm = raw.match(/(\d+\+?\d*)'?\s*$/);
  const minute = mm ? mm[1] : '?';
  return { name: raw.replace(/\s*\d+\+?\d*'?\s*$/, '').trim(), minute };
}

// ═══════════════════ MAIN PAGE ═══════════════════
export function PlayersPage() {
  const { data: matches, isLoading } = useMatches();
  const { data: teams } = useTeams();
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<ScorerData | null>(null);
  const [sortBy, setSortBy] = useState<'goals' | 'name'>('goals');

  const teamMap = useMemo(() => {
    if (!teams) return new Map<string, Team>();
    const m = new Map<string, Team>();
    teams.forEach(t => m.set(t.id, t));
    return m;
  }, [teams]);

  const players = useMemo(() => {
    if (!matches) return [];
    const pm = new Map<string, ScorerData>();
    matches.forEach(m => {
      for (const side of ['home', 'away'] as const) {
        const raw = side === 'home' ? m.home_scorers : m.away_scorers;
        for (const entry of parseScorers(raw)) {
          const { name, minute } = cleanGoalEntry(entry);
          if (!name || name === 'null') continue;
          const ex = pm.get(name);
          if (ex) { ex.goals++; ex.minutes.push(minute); }
          else {
            pm.set(name, {
              name, goals: 1, matches: 1,
              teamId: side === 'home' ? m.home_team_id : m.away_team_id,
              teamName: side === 'home' ? m.home_team_name_en : m.away_team_name_en,
              teamFlag: teamMap.get(side === 'home' ? m.home_team_id : m.away_team_id)?.flag || '',
              teamGroup: teamMap.get(side === 'home' ? m.home_team_id : m.away_team_id)?.groups || m.group || '?',
              minutes: [minute],
            });
          }
        }
      }
    });
    const list = Array.from(pm.values());
    list.sort((a, b) => sortBy === 'goals' ? b.goals - a.goals : a.name.localeCompare(b.name));
    return list;
  }, [matches, teamMap, sortBy]);

  const filtered = useMemo(() => {
    if (!search.trim()) return players;
    const q = search.toLowerCase();
    return players.filter(p => p.name.toLowerCase().includes(q) || p.teamName.toLowerCase().includes(q));
  }, [players, search]);

  const totalGoals = useMemo(() => players.reduce((s, p) => s + p.goals, 0), [players]);
  const maxGoals = players[0]?.goals ?? 1;
  const topScorer = players[0];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-accent-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-teal/10 flex items-center justify-center" style={{ border: '1px solid rgba(20,184,166,0.2)' }}>
            <UserRound size={20} className="text-accent-teal" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Top Jugadores</h1>
            <p className="text-sm text-text-secondary">{players.length} goleadores · {totalGoals} goles en el torneo</p>
          </div>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Users, value: players.length, label: 'Goleadores', color: '#14B8A6' },
          { icon: Target, value: totalGoals, label: 'Goles totales', color: '#FF6B35' },
          { icon: Medal, value: topScorer?.goals ?? 0, label: 'Máximo goleador', color: '#F5A623' },
          { icon: Trophy, value: new Set(players.map(p => p.teamId)).size, label: 'Equipos con gol', color: '#60A5FA' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="rounded-xl p-4 text-center"
            style={{ background: `${s.color}0A`, border: `1px solid ${s.color}18` }}
          >
            <s.icon size={20} className="mx-auto mb-1.5" style={{ color: s.color }} />
            <p className="text-xl font-black text-white">{s.value}</p>
            <p className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Search + Sort */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
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

      {/* Player grid — HyruleDex style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filtered.map((player, i) => (
          <PlayerCard
            key={player.name}
            player={player}
            rank={sortBy === 'goals' ? i + 1 : 0}
            isExpanded={expandedId === player.name}
            onToggle={() => {
              setExpandedId(expandedId === player.name ? null : player.name);
              if (expandedId !== player.name) setSelectedPlayer(player);
            }}
            maxGoals={maxGoals}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <UserRound size={48} className="mx-auto mb-4 text-text-muted/20" />
          <p className="text-sm text-text-muted">No se encontraron jugadores</p>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedPlayer && (
          <PlayerDetailModal player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
