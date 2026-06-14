import { motion } from 'framer-motion';
import { useStadiums } from '@/hooks/useQueries';
import { Building2, MapPin, Users } from 'lucide-react';

export function StadiumsPage() {
  const { data: stadiums, isLoading } = useStadiums();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-accent-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const hostCountries = [
    { name: 'Estados Unidos', stadiums: stadiums?.filter((s) => s.country_en === 'USA') ?? [], color: '#00aaff' },
    { name: 'México', stadiums: stadiums?.filter((s) => s.country_en === 'Mexico') ?? [], color: '#ff6b35' },
    { name: 'Canadá', stadiums: stadiums?.filter((s) => s.country_en === 'Canada') ?? [], color: '#ff3366' },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <div className="flex items-center gap-3">
          <Building2 size={28} className="text-accent-teal" />
          <h1 className="text-2xl md:text-3xl font-black">Estadios</h1>
        </div>
        <p className="text-sm text-text-secondary">16 estadios en 3 países</p>
      </motion.div>

      {/* Host country stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {hostCountries.map(({ name, stadiums: countryStadiums, color }) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="card-dark p-5"
            style={{ borderColor: `${color}20` }}
          >
            <h3 className="text-lg font-bold mb-2" style={{ color }}>{name}</h3>
            <div className="flex items-center gap-4 text-sm text-text-secondary">
              <span className="flex items-center gap-1"><Building2 size={14} /> {countryStadiums.length} sedes</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stadium grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        {stadiums?.map((stadium, i) => (
          <motion.div
            key={stadium.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            whileHover={{ y: -4 }}
            className="card-dark p-4 border border-border-card hover:border-neon-blue/20 transition-all"
          >
            <div className="w-full h-36 rounded-lg mb-3 bg-gradient-to-br from-neon-blue/10 to-neon-green/5 flex items-center justify-center">
              <Building2 size={48} className="text-accent-teal/20" />
            </div>
            <h3 className="font-bold text-sm">{stadium.name_en}</h3>
            <div className="flex items-center gap-1 mt-1 text-[10px] text-text-muted">
              <MapPin size={10} />
              {stadium.city_en}, {stadium.country_en}
            </div>
            <div className="flex items-center gap-1 mt-1 text-[10px] text-text-muted">
              <Users size={10} />
              {Number(stadium.capacity).toLocaleString()} espectadores
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
