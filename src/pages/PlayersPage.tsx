import { motion } from 'framer-motion';
import { UserRound } from 'lucide-react';

export function PlayersPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <div className="flex items-center gap-3">
          <UserRound size={28} className="text-neon-blue" />
          <h1 className="text-2xl md:text-3xl font-black">Jugadores</h1>
        </div>
        <p className="text-sm text-text-secondary">Estadísticas, squads y distribución táctica · API-Football</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8 text-center"
      >
        <UserRound size={48} className="mx-auto mb-4 text-neon-blue/30" />
        <h2 className="text-lg font-bold mb-2">Módulo en desarrollo</h2>
        <p className="text-sm text-text-secondary max-w-md mx-auto">
          Los datos de jugadores estarán disponibles cuando se active la API de API-Football.
          Este módulo incluirá stats individuales, squads por equipo, y distribución táctica en campo.
        </p>
      </motion.div>
    </div>
  );
}
