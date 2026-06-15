import { useState, useMemo, useEffect } from 'react';
import { useTeams, useMatches, useStadiums } from '@/hooks/useQueries';
import { Users, MapPin, Swords, Calendar, Globe, ChevronDown, Trophy, Flag, Clock, Flame } from 'lucide-react';
import type { Match } from '@/types';
import { squads, type SquadPlayer } from '@/data/squads';

// ─── Stats Badge ───
function StatBadge({ icon: Icon, value, label, delay = 0, subtitle }: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  value: string; label: string; delay?: number; subtitle?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 px-5 py-5 bg-navy-700/30 rounded-2xl border border-border-card animate-fade-up hover:scale-[1.02] transition-transform"
      style={{ animationDelay: `${delay}s` }}>
      <div className="flex items-center gap-2 text-accent-teal">
        <Icon size={18} />
        <span className="text-[11px] font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-3xl sm:text-4xl font-black text-white leading-none">{value}</p>
      {subtitle && (
        <p className="text-[10px] text-text-muted -mt-1">{subtitle}</p>
      )}
    </div>
  );
}

// ─── Country Card ───
function CountryCard({ flag, name, venues, matches, delay = 0 }: {
  flag: string; name: string; venues: number; matches: number; delay?: number;
}) {
  return (
    <div className="flex flex-col items-center gap-2 p-4 bg-navy-700/30 rounded-xl border border-border-card animate-fade-up"
      style={{ animationDelay: `${delay}s` }}>
      <img src={flag} alt={name} className="w-16 h-12 object-cover rounded shadow-lg" />
      <p className="text-xs font-bold text-white text-center">{name}</p>
      <div className="flex gap-3 text-[10px] text-text-secondary">
        <span className="text-accent-teal font-semibold">{venues} Sedes</span>
        <span className="text-text-muted">·</span>
        <span className="font-semibold">{matches} Partidos</span>
      </div>
    </div>
  );
}

// ─── Player Pitch (uses squad data with real positions) ───
function PlayerPitch({ selectedTeam, onTeamChange, teams, matches }: {
  selectedTeam: string;
  onTeamChange: (v: string) => void;
  teams: string[];
  matches: Match[];
}) {
  const squadPlayers: SquadPlayer[] | null = squads[selectedTeam] ?? null;

  const gk = squadPlayers ? squadPlayers.filter(p => p.position === 'GK') : [];
  const def = squadPlayers ? squadPlayers.filter(p => p.position === 'DEF') : [];
  const mid = squadPlayers ? squadPlayers.filter(p => p.position === 'MID') : [];
  const fwd = squadPlayers ? squadPlayers.filter(p => p.position === 'FWD') : [];
  const hasSquadData = squadPlayers !== null;
  const totalPlayers = hasSquadData ? squadPlayers.length : 23;

  return (
    <div className="animate-fade-up" style={{ animationDelay: '0.3s' }}>
      <div className="relative mb-4">
        <select
          value={selectedTeam}
          onChange={(e) => onTeamChange(e.target.value)}
          className="w-full appearance-none bg-navy-700 border border-border-card rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-white focus:outline-none focus:border-accent-teal/30 cursor-pointer"
        >
          <option value="" disabled>SELECCIÓN</option>
          {teams.map((t) => (
            <option key={t} value={t}>{t}{squads[t] ? ' ✓' : ''}</option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
      </div>

      <div className="relative bg-[#0d4a22] rounded-2xl overflow-hidden border border-border-card mb-4" style={{ height: 260 }}>
        <div className="absolute inset-4 border border-white/15 rounded-full" />
        <div className="absolute top-1/2 left-4 right-4 h-px bg-white/10" />
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/20" />
        <div className="absolute top-4 left-[20%] right-[20%] h-[30%] border border-white/10 rounded-b-full" />
        <div className="absolute bottom-4 left-[20%] right-[20%] h-[30%] border border-white/10 rounded-t-full" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[25%] h-[18%] border border-white/15 border-b-0" />

        {hasSquadData ? (
          <>
            {fwd.map((p, i) => (
              <div key={`fwd-${i}`} className="absolute flex flex-col items-center gap-0.5"
                style={{ top: '10%', left: `${10 + i * (80 / Math.max(fwd.length - 1, 1))}%`, transform: 'translateX(-50%)' }}>
                <MiniPlayerPhoto name={p.name} />
                <span className="text-[7px] text-white/70 text-center leading-tight max-w-[55px] truncate">{p.name.split(' ').pop()}</span>
              </div>
            ))}
            {mid.map((p, i) => (
              <div key={`mid-${i}`} className="absolute flex flex-col items-center gap-0.5"
                style={{ top: '40%', left: `${10 + i * (80 / Math.max(mid.length - 1, 1))}%`, transform: 'translateX(-50%)' }}>
                <MiniPlayerPhoto name={p.name} />
                <span className="text-[7px] text-white/70 text-center leading-tight max-w-[55px] truncate">{p.name.split(' ').pop()}</span>
              </div>
            ))}
            {def.map((p, i) => (
              <div key={`def-${i}`} className="absolute flex flex-col items-center gap-0.5"
                style={{ top: '62%', left: `${12 + i * (76 / Math.max(def.length - 1, 1))}%`, transform: 'translateX(-50%)' }}>
                <MiniPlayerPhoto name={p.name} />
                <span className="text-[7px] text-white/70 text-center leading-tight max-w-[55px] truncate">{p.name.split(' ').pop()}</span>
              </div>
            ))}
            {gk.map((p, i) => (
              <div key={`gk-${i}`} className="absolute flex flex-col items-center gap-0.5"
                style={{ top: '84%', left: `${45 + i * 10}%`, transform: 'translateX(-50%)' }}>
                <MiniPlayerPhoto name={p.name} />
                <span className="text-[7px] text-white/70 text-center leading-tight max-w-[55px] truncate">{p.name.split(' ').pop()}</span>
              </div>
            ))}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-xs text-white/30 text-center px-4">Sin plantilla para {selectedTeam}.<br /><span className="text-[10px]">Equipos con ✓ tienen datos.</span></p>
          </div>
        )}
      </div>

      <div className="bg-navy-700/50 rounded-xl p-4 border border-border-card space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-text-secondary">TOTAL JUGADORES</span>
          <span className="text-lg font-black text-white">{totalPlayers}</span>
        </div>
        {hasSquadData ? (
          <div className="space-y-2">
            <PositionBar label="DELANTEROS" percent={Math.round((fwd.length / squadPlayers.length) * 100)} color="bg-red-400" />
            <PositionBar label="CENTROCAMPISTAS" percent={Math.round((mid.length / squadPlayers.length) * 100)} color="bg-blue-400" />
            <PositionBar label="DEFENSAS" percent={Math.round(((def.length + gk.length) / squadPlayers.length) * 100)} color="bg-amber-400" />
          </div>
        ) : (
          <p className="text-[10px] text-text-muted text-center py-2">Selecciona un equipo con ✓</p>
        )}
      </div>
    </div>
  );
}

// ─── Mini Player Photo ───
function MiniPlayerPhoto({ name }: { name: string }) {
  const [photo, setPhoto] = useState<string | null>(null);
  useEffect(() => {
    let c = false;
    const wikiName = name.replace(/\s+/g, '_');
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiName)}`, {
      headers: { 'User-Agent': 'WCInsight/1.0' }
    }).then(r => r.json()).then(d => {
      if (!c && d.thumbnail?.source) setPhoto(d.thumbnail.source);
    }).catch(() => {});
    return () => { c = true; };
  }, [name]);
  if (photo) {
    return <img src={photo} alt={name} className="w-8 h-8 rounded-full object-cover border border-white/20 shadow-lg" />;
  }
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className="w-8 h-8 rounded-full bg-navy-600 border border-white/10 flex items-center justify-center">
      <span className="text-[8px] font-bold text-white/50">{initials}</span>
    </div>
  );
}

function PositionBar({ label, percent, color }: { label: string; percent: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-[10px] mb-1">
        <span className="text-text-muted">{label}</span>
        <span className="text-text-secondary font-semibold">{percent}%</span>
      </div>
      <div className="h-1.5 bg-navy-600 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

// ─── Tournament Timeline ───
function TournamentTimeline() {
  const stages = [
    { icon: Globe, label: 'Sorteo de grupos', date: 'Dic 2025' },
    { icon: Flag, label: 'Partido inaugural', date: '11 Jun 2026' },
    { icon: Trophy, label: 'Fase de grupos', date: '11-27 Jun' },
    { icon: Swords, label: 'Fase eliminatoria', date: '28 Jun - 15 Jul' },
    { icon: Trophy, label: 'Semifinales', date: '14-15 Jul' },
    { icon: Trophy, label: 'Gran final', date: '19 Jul 2026' },
  ];
  return (
    <div className="card p-6 animate-fade-up" style={{ animationDelay: '0.5s' }}>
      <h3 className="text-sm font-bold uppercase tracking-wider text-accent-teal mb-5 flex items-center gap-2">
        <Clock size={16} />LÍNEA DE TIEMPO DEL TORNEO
      </h3>
      <div className="flex items-start justify-between relative">
        <div className="absolute top-4 left-[7%] right-[7%] h-0.5 bg-accent-teal/20" />
        {stages.map((stage, i) => (
          <div key={stage.label} style={{ animationDelay: `${0.6 + i * 0.1}s` }}
            className="flex flex-col items-center gap-2 relative z-10 flex-1 animate-fade-up">
            <div className="w-8 h-8 rounded-full bg-accent-teal/15 border-2 border-accent-teal/30 flex items-center justify-center">
              <stage.icon size={14} className="text-accent-teal" />
            </div>
            <p className="text-[9px] text-text-secondary font-medium text-center leading-tight max-w-[80px]">{stage.label}</p>
            <p className="text-[8px] text-text-muted">{stage.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Highlighted Facts ───
function HighlightedFacts() {
  const facts = [
    'Será el primer Mundial con 48 selecciones en la historia.',
    'Se jugará de manera conjunta en tres países: México, Estados Unidos y Canadá.',
    'Primera vez en la historia que tres naciones son anfitrionas de una Copa del Mundo.',
    '16 estadios de clase mundial distribuidos en 16 ciudades de los tres países.',
    'Capacidad combinada para más de 7 millones de aficionados.',
    'México se convierte en el primer país en albergar tres Copas del Mundo.',
  ];
  return (
    <div className="card p-6 animate-fade-up" style={{ animationDelay: '0.4s' }}>
      <h3 className="text-sm font-bold uppercase tracking-wider text-accent-teal mb-4 flex items-center gap-2">
        <Trophy size={16} />DATOS DESTACADOS
      </h3>
      <ul className="space-y-3">
        {facts.map((fact, i) => (
          <li key={i} className="flex gap-3 text-xs text-text-secondary leading-relaxed">
            <span className="text-accent-teal mt-1 flex-shrink-0">◆</span>
            <span>{fact}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Today's Matches (with team flags) ───
function TodayMatches({ matches, teams }: { matches: Match[]; teams?: { id: string; flag: string; name_en: string }[] }) {
  const today = useMemo(() => {
    const d = new Date();
    return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;
  }, []);

  const todayMatches = useMemo(() => {
    if (!matches?.length) return [];
    return matches.filter((m) => m.local_date?.startsWith(today)).sort((a, b) => (a.local_date || '').localeCompare(b.local_date || ''));
  }, [matches, today]);

  const upcomingMatches = useMemo(() => {
    if (!matches?.length || todayMatches.length > 0) return [];
    const now = new Date();
    return matches.filter((m) => {
      if (!m.local_date || m.finished === 'TRUE') return false;
      const [d, t] = m.local_date.split(' ');
      const [mo, day, yr] = d.split('/');
      return new Date(`${yr}-${mo}-${day}T${t || '00:00'}`) >= now;
    }).sort((a, b) => (a.local_date || '').localeCompare(b.local_date || '')).slice(0, 4);
  }, [matches, todayMatches]);

  const displayMatches = todayMatches.length > 0 ? todayMatches : upcomingMatches;
  const sectionTitle = todayMatches.length > 0 ? 'PARTIDOS DE HOY' : 'PRÓXIMOS PARTIDOS';

  // Build flag lookup
  const flagMap = useMemo(() => {
    if (!teams) return new Map<string, string>();
    const m = new Map<string, string>();
    teams.forEach(t => m.set(t.name_en, t.flag));
    return m;
  }, [teams]);

  if (!displayMatches.length) return null;

  return (
    <div className="card p-5 animate-fade-up" style={{ animationDelay: '0.25s' }}>
      <div className="flex items-center gap-2 mb-4">
        {todayMatches.length > 0 && (
          <span className="badge badge-live text-[9px] animate-pulse">EN VIVO</span>
        )}
        <h3 className="text-sm font-bold uppercase tracking-wider text-accent-teal">{sectionTitle}</h3>
        <span className="text-[10px] text-text-muted ml-auto">{today}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {displayMatches.map((m) => {
          const isFinished = m.finished === 'TRUE';
          const isLive = !isFinished && (m.home_score !== 'null' && m.home_score !== '');
          const time = m.local_date?.split(' ')[1]?.slice(0, 5) || '';
          const homeFlag = flagMap.get(m.home_team_name_en);
          const awayFlag = flagMap.get(m.away_team_name_en);

          return (
            <div key={m.id} className={`hd-card px-4 py-3.5 ${isLive ? '!border-accent-red/30' : ''}`}>
              <div className="flex items-center gap-3">
                {/* Home */}
                <div className="flex-1 min-w-0 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <p className="text-xs font-bold text-white truncate">{m.home_team_name_en}</p>
                    {homeFlag && <img src={homeFlag} alt="" className="w-6 h-4 rounded-sm object-cover flex-shrink-0" />}
                  </div>
                </div>

                {/* Score */}
                <div className="flex-shrink-0 text-center min-w-[50px]">
                  {isLive ? (
                    <div className="flex items-center gap-1.5 justify-center">
                      <span className="text-lg font-black text-white">{m.home_score}</span>
                      <span className="text-xs text-accent-red font-bold">-</span>
                      <span className="text-lg font-black text-white">{m.away_score}</span>
                    </div>
                  ) : isFinished ? (
                    <div className="flex items-center gap-1.5 justify-center">
                      <span className="text-lg font-bold text-white">{m.home_score}</span>
                      <span className="text-xs text-text-muted">-</span>
                      <span className="text-lg font-bold text-white">{m.away_score}</span>
                    </div>
                  ) : (
                    <span className="text-sm font-bold text-accent-teal">{time}</span>
                  )}
                  <div className="mt-1">
                    {isLive && <span className="text-[8px] font-bold text-accent-red uppercase animate-pulse">LIVE {m.time_elapsed}'</span>}
                    {isFinished && <span className="text-[8px] font-medium text-text-muted uppercase">FINAL</span>}
                    {!isLive && !isFinished && <span className="text-[8px] text-text-muted uppercase">{m.group}</span>}
                  </div>
                </div>

                {/* Away */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-2">
                    {awayFlag && <img src={awayFlag} alt="" className="w-6 h-4 rounded-sm object-cover flex-shrink-0" />}
                    <p className="text-xs font-bold text-white truncate">{m.away_team_name_en}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {todayMatches.length === 0 && (
        <p className="text-[10px] text-text-muted text-center mt-3">No hay partidos programados para hoy. Mostrando los próximos encuentros.</p>
      )}
    </div>
  );
}

// ═══════════════════════════════ MAIN DASHBOARD ═══════════════════════════════
export function DashboardPage() {
  const { data: teams } = useTeams();
  const { data: matches } = useMatches();
  const { data: stadiums } = useStadiums();
  const [selectedTeam, setSelectedTeam] = useState('Argentina');

  const teamNames = teams?.map((t) => t.name_en).sort() ?? ['Argentina', 'Brasil', 'México', 'USA', 'Canadá', 'Francia', 'Alemania', 'España'];
  const stadiumVancouver = stadiums?.find((s) => s.name_en?.toLowerCase().includes('vancouver'));
  const totalTeams = teams?.length ?? 48;
  const totalStadiums = stadiums?.length ?? 16;
  const totalMatches = matches?.length ?? 104;

  return (
    <div className="p-5 sm:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-4 sm:space-y-6 lg:space-y-8 pb-20 relative">

      <div className="relative flex flex-col items-center pt-4 pb-2">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 pointer-events-none">
          <div className="blob w-28 h-28 bg-red-500/30 top-8 left-10 animate-pulse" />
          <div className="blob w-20 h-20 bg-blue-500/30 top-4 right-8" style={{ animationDelay: '0.5s' }} />
          <div className="blob w-24 h-24 bg-green-400/25 bottom-6 left-16" style={{ animationDelay: '1s' }} />
          <div className="blob w-16 h-16 bg-yellow-400/25 top-12 right-12" style={{ animationDelay: '0.7s' }} />
        </div>
        <div className="relative z-10 mb-2">
          <img src="/images/trophy/trophy-golden.png" alt="FIFA World Cup Trophy" className="w-28 h-auto drop-shadow-[0_0_40px_rgba(245,166,35,0.3)] animate-fade-up" />
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight text-center animate-fade-up" style={{ animationDelay: '0.1s' }}>
          COPA MUNDIAL <span className="text-accent-teal">2026</span>
        </h1>
        <p className="text-sm md:text-base text-accent-teal font-medium mt-1 animate-fade-up" style={{ animationDelay: '0.15s' }}>
          TRES PAÍSES. UN MUNDO. UNA COPA.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatBadge icon={Users} value={String(totalTeams)} label="EQUIPOS" delay={0.2} />
        <StatBadge icon={MapPin} value={String(totalStadiums)} label="ESTADIOS" delay={0.25} />
        <StatBadge icon={Swords} value={String(totalMatches)} label="PARTIDOS" delay={0.3} />
        <StatBadge icon={Calendar} value="39" label="DÍAS" delay={0.35} />
        <StatBadge icon={Globe} value="+7M" label="AFICIONADOS" delay={0.4} />
      </div>

      <TodayMatches matches={matches ?? []} teams={teams} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        <div className="space-y-4 sm:space-y-6">
          <div className="card p-5 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-accent-teal mb-4">🇺🇸🇲🇽🇨🇦 PAÍSES ANFITRIONES</h3>
            <div className="grid grid-cols-3 gap-3">
              <CountryCard flag="/images/flags/mexico.png" name="México" venues={3} matches={13} delay={0.25} />
              <CountryCard flag="/images/flags/usa.png" name="Estados Unidos" venues={11} matches={78} delay={0.3} />
              <CountryCard flag="/images/flags/canada.png" name="Canadá" venues={2} matches={13} delay={0.35} />
            </div>
            <div className="flex justify-around mt-4 pt-4 border-t border-border-card text-[10px] text-text-muted">
              <span>3 países anfitriones</span><span>16 ciudades sede</span><span>104 partidos totales</span>
            </div>
          </div>

          <div className="card overflow-hidden animate-fade-up" style={{ animationDelay: '0.35s' }}>
            <div className="relative h-56 overflow-hidden">
              <img src="/images/stadiums/vancouver-bcplace.jpg" alt="BC Place" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-5">
                <p className="text-sm font-bold text-white/80 uppercase tracking-wider mb-0.5">Estadio</p>
                <h3 className="text-xl font-black text-white">{stadiumVancouver?.name_en || 'BC Place'}</h3>
              </div>
            </div>
            <div className="p-5 flex gap-6">
              <div>
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">UBICACIÓN</p>
                <p className="text-sm font-semibold text-white">{stadiumVancouver?.city_en || 'Vancouver'}, {stadiumVancouver?.country_en || 'Canadá'}</p>
              </div>
              <div>
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">CAPACIDAD</p>
                <p className="text-sm font-semibold text-white">{Number(stadiumVancouver?.capacity || 54500).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex gap-2 px-5 pb-5">
              {['/images/stadiums/stadium-1.jpg', '/images/stadiums/stadium-2.jpg', '/images/stadiums/stadium-3.jpg'].map((img, i) => (
                <div key={i} className="w-20 h-14 rounded-lg overflow-hidden opacity-60 hover:opacity-100 transition-opacity border border-border-card">
                  <img src={img} alt={`Estadio ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="card p-5 animate-fade-up" style={{ animationDelay: '0.25s' }}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-accent-teal mb-4">DISTRIBUCIÓN DE JUGADORES</h3>
            <PlayerPitch selectedTeam={selectedTeam} onTeamChange={setSelectedTeam} teams={teamNames} matches={matches ?? []} />
          </div>
          <HighlightedFacts />
        </div>
      </div>

      <TournamentTimeline />

      <div className="hidden lg:block absolute bottom-10 right-6 w-48 h-48 pointer-events-none opacity-60">
        <img src="/images/decorations/fire-ball.png" alt="" className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(255,107,35,0.4)]" />
      </div>
    </div>
  );
}
