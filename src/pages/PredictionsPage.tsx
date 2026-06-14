import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

export function PredictionsPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <div className="flex items-center gap-3">
          <Brain size={28} className="text-neon-pink" />
          <h1 className="text-2xl md:text-3xl font-black">Predicciones</h1>
        </div>
        <p className="text-sm text-text-secondary">Análisis predictivo del torneo · Disponible próximamente</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8 text-center"
      >
        <Brain size={48} className="mx-auto mb-4 text-neon-pink/30" />
        <h2 className="text-lg font-bold mb-2">Módulo en desarrollo</h2>
        <p className="text-sm text-text-secondary max-w-md mx-auto">
          Las predicciones estarán disponibles conforme avance el torneo. Incluirá probabilidades de clasificación,
          proyecciones de bracket, y análisis de rendimiento por equipo usando datos de API-Football.
        </p>
      </motion.div>
    </div>
  );
}
