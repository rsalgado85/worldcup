import { motion } from 'framer-motion';
import { useTeams } from '@/hooks/useQueries';
import { useNavigate } from 'react-router-dom';
import { Users, Search } from 'lucide-react';
import { useState, useMemo } from 'react';

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
          <Users size={28} className="text-neon-green" />
          <h1 className="text-2xl md:text-3xl font-black">Equipos</h1>
        </div>
        <p className="text-sm text-text-secondary">48 selecciones nacionales · 12 grupos</p>
      </motion.div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar equipo..."
          className="w-full bg-white/5 border border-border-subtle rounded-xl py-2.5 pl-10 pr-4 text-sm text-text-primary focus:outline-none focus:border-neon-green/30 transition-colors"
        />
      </div>

      {/* Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3"
      >
        {filtered.map((team, i) => (
          <motion.button
            key={team.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02 }}
            whileHover={{ y: -4, scale: 1.03 }}
            onClick={() => navigate(`/teams/${team.id}`)}
            className="glass rounded-xl p-4 text-center cursor-pointer transition-all"
          >
            <img
              src={team.flag}
              alt={team.name_en}
              className="w-14 h-10 mx-auto mb-2 rounded shadow-lg object-cover"
              loading="lazy"
            />
            <p className="text-xs font-semibold truncate">{team.name_en}</p>
            <p className="text-[10px] text-text-muted mt-0.5">Grupo {team.groups}</p>
          </motion.button>
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <Users size={48} className="mx-auto mb-4 text-white/5" />
          <p className="text-sm text-text-muted">No se encontraron equipos</p>
        </div>
      )}
    </div>
  );
}
