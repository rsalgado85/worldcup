import { motion } from 'framer-motion';
import { useTeams } from '@/hooks/useQueries';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import { useState, useMemo } from 'react';
import { PageWrapper, PageHeader, SearchInput, EmptyState, LoadingSpinner } from '@/components/ui/design-system';

export function TeamsPage() {
  const navigate = useNavigate();
  const { data: teams, isLoading } = useTeams();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!teams) return [];
    if (!search.trim()) return teams;
    const q = search.toLowerCase();
    return teams.filter((t) =>
      t.name_en.toLowerCase().includes(q) ||
      t.fifa_code.toLowerCase().includes(q) ||
      t.groups.toLowerCase().includes(q)
    );
  }, [teams, search]);

  if (isLoading) return <PageWrapper><LoadingSpinner /></PageWrapper>;

  const groups = [...new Set(teams?.map(t => t.groups).sort() || [])];
  const maxCapacity = Math.max(...(teams?.map(t => Number(t.id) % 1000000 || 50000) || [50000]));

  return (
    <PageWrapper>
      <PageHeader
        icon={Users}
        title="Equipos"
        subtitle={`${teams?.length || 48} selecciones nacionales · ${groups.length} grupos`}
      />

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Buscar equipo o grupo..."
      />

      {filtered.length > 0 ? (
        groups
          .filter(g => filtered.some(t => t.groups === g))
          .map((group) => {
            const groupTeams = filtered.filter(t => t.groups === group);
            return (
              <div key={group} className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted px-1">
                  Grupo {group}
                  <span className="ml-2 font-normal text-text-dim">{groupTeams.length} equipos</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                  {groupTeams.map((team, i) => (
                    <motion.button
                      key={team.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03, duration: 0.35 }}
                      whileHover={{ y: -6, scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(`/teams/${team.id}`)}
                      className="hd-card text-left cursor-pointer"
                    >
                      {/* Flag image */}
                      <div className="relative w-full" style={{ aspectRatio: '16/10' }}>
                        <img
                          src={team.flag}
                          alt={team.name_en}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent" />
                        {/* FIFA code badge */}
                        <span className="absolute top-2 right-2 badge badge-teal text-[9px]">
                          {team.fifa_code}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="hd-card-body">
                        {/* Group tag */}
                        <span className="hd-card-tag bg-accent-teal/10 text-accent-teal border border-accent-teal/20">
                          Grupo {team.groups}
                        </span>

                        {/* Name */}
                        <h3 className="hd-card-name">{team.name_en}</h3>

                        {/* Description */}
                        <p className="hd-card-desc">
                          {team.name_en} compite en el Grupo {team.groups} del Mundial 2026.
                        </p>

                        {/* Stats */}
                        <div className="space-y-1.5">
                          <div className="hd-stat-row">
                            <span className="hd-stat-icon text-[10px]">🏟️</span>
                            <div className="hd-stat-bar">
                              <div className="hd-stat-fill bg-accent-teal" style={{ width: '65%' }} />
                            </div>
                            <span className="hd-stat-value">FIFA</span>
                          </div>
                          <div className="hd-stat-row">
                            <span className="hd-stat-icon text-[10px]">⚽</span>
                            <div className="hd-stat-bar">
                              <div className="hd-stat-fill bg-accent-gold"
                                style={{ width: `${Math.min((Number(team.id) % 21) * 5, 100)}%` }} />
                            </div>
                            <span className="hd-stat-value">WC</span>
                          </div>
                          <div className="hd-stat-row">
                            <span className="hd-stat-icon text-[10px]">🌎</span>
                            <div className="hd-stat-bar">
                              <div className="hd-stat-fill bg-accent-blue"
                                style={{ width: '80%' }} />
                            </div>
                            <span className="hd-stat-value">CON</span>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            );
          })
      ) : (
        <EmptyState icon={Users} message="No se encontraron equipos" />
      )}
    </PageWrapper>
  );
}
