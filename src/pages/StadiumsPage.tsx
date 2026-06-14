import { motion, AnimatePresence } from 'framer-motion';
import { useStadiums } from '@/hooks/useQueries';
import { Building2, MapPin, Users, X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { useState } from 'react';
import type { Stadium } from '@/types';

// ─── Image mapping ───
const STADIUM_IMAGES: Record<string, string[]> = {
  'MetLife Stadium': ['/images/stadiums/official/metlife.jpg'],
  'AT&T Stadium': ['/images/stadiums/official/att.jpg'],
  'Arrowhead Stadium': ['/images/stadiums/official/arrowhead.jpg'],
  'Mercedes-Benz Stadium': ['/images/stadiums/official/mercedes-benz.jpg'],
  'Hard Rock Stadium': ['/images/stadiums/official/hardrock.jpg'],
  'Lincoln Financial Field': ['/images/stadiums/official/lincoln.jpg'],
  "Levi's Stadium": ['/images/stadiums/official/levis.jpg'],
  'Lumen Field': ['/images/stadiums/official/lumen.jpg'],
  'NRG Stadium': ['/images/stadiums/official/nrg.jpg'],
  'SoFi Stadium': ['/images/stadiums/official/sofi.jpg'],
  'Gillette Stadium': ['/images/stadiums/official/gillette.jpg'],
  'Estadio Azteca': ['/images/stadiums/official/azteca.jpg'],
  'Estadio BBVA': ['/images/stadiums/official/bbva.jpg'],
  'Estadio Akron': ['/images/stadiums/official/akron.jpg'],
  'BC Place': ['/images/stadiums/official/bcplace.jpg', '/images/stadiums/vancouver-bcplace.jpg'],
  'BMO Field': ['/images/stadiums/official/bmo.jpg'],
};

// ─── Stadium Card ───
function StadiumCard({ stadium, onClick, index }: { stadium: Stadium; onClick: () => void; index: number }) {
  const images = STADIUM_IMAGES[stadium.name_en];
  const hasImage = images && images.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      whileHover={{ y: -6, scale: 1.02 }}
      onClick={onClick}
      className="rounded-2xl overflow-hidden cursor-pointer group relative"
      style={{
        background: 'linear-gradient(145deg, rgba(20,184,166,0.08) 0%, rgba(6,11,21,0.95) 50%, rgba(245,166,35,0.04) 100%)',
        border: '1px solid rgba(20,184,166,0.15)',
      }}
    >
      {/* Glow on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 60px rgba(20,184,166,0.1)' }} />

      {/* Image / Placeholder */}
      <div className="relative w-full h-44 overflow-hidden">
        {hasImage ? (
          <img src={images![0]} alt={stadium.name_en} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.15), rgba(245,166,35,0.08))' }}>
            <Building2 size={56} className="text-accent-teal/15" />
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/20 to-transparent" />

        {/* Image count badge */}
        {hasImage && images!.length > 1 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-black/50 text-white/80 backdrop-blur-sm">
            <Camera size={10} /> {images!.length}
          </div>
        )}

        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-base font-bold text-white leading-tight">{stadium.name_en}</h3>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-1.5">
        <div className="flex items-center gap-1.5 text-[11px] text-text-secondary">
          <MapPin size={12} className="text-text-muted flex-shrink-0" />
          <span>{stadium.city_en}, {stadium.country_en}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-text-secondary">
          <Users size={12} className="text-text-muted flex-shrink-0" />
          <span>{Number(stadium.capacity).toLocaleString()} espectadores</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Gallery Carousel Modal ───
function StadiumGallery({ stadium, onClose }: { stadium: Stadium; onClose: () => void }) {
  const images = STADIUM_IMAGES[stadium.name_en] || [];
  const [currentIdx, setCurrentIdx] = useState(0);

  const goNext = () => setCurrentIdx((p) => (p + 1) % Math.max(images.length, 1));
  const goPrev = () => setCurrentIdx((p) => (p - 1 + images.length) % Math.max(images.length, 1));

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button onClick={onClose}
          className="absolute top-0 right-0 z-20 p-3 rounded-full bg-black/50 text-white/70 hover:text-white hover:bg-black/70 transition-all -mt-2 -mr-2">
          <X size={22} />
        </button>

        {/* Main Image */}
        <div className="relative flex-1 rounded-2xl overflow-hidden" style={{ minHeight: 300, maxHeight: '60vh' }}>
          {images.length > 0 ? (
            <>
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIdx}
                  initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  src={images[currentIdx]}
                  alt={`${stadium.name_en} - ${currentIdx + 1}`}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </AnimatePresence>

              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); goPrev(); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 text-white/80 hover:bg-black/70 hover:text-white transition-all backdrop-blur-sm">
                    <ChevronLeft size={24} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); goNext(); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 text-white/80 hover:bg-black/70 hover:text-white transition-all backdrop-blur-sm">
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Counter */}
              {images.length > 1 && (
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 text-white/80 text-xs font-medium backdrop-blur-sm">
                  {currentIdx + 1} / {images.length}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center rounded-2xl gap-4"
              style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.15), rgba(245,166,35,0.08))' }}>
              <Building2 size={80} className="text-accent-teal/20" />
              <p className="text-text-muted text-sm">Imagen no disponible</p>
            </div>
          )}
        </div>

        {/* Stadium Info */}
        <div className="mt-3 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="text-xl font-black text-white">{stadium.name_en}</h2>
          <div className="flex items-center gap-4 mt-2 text-sm text-text-secondary">
            <span className="flex items-center gap-1"><MapPin size={14} /> {stadium.city_en}, {stadium.country_en}</span>
            <span className="flex items-center gap-1"><Users size={14} /> {Number(stadium.capacity).toLocaleString()}</span>
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrentIdx(i)}
                className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                  i === currentIdx ? 'border-accent-teal opacity-100' : 'border-transparent opacity-50 hover:opacity-80'
                }`}
              >
                <img src={img} alt={`${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════ MAIN PAGE ═══════════════════
export function StadiumsPage() {
  const { data: stadiums, isLoading } = useStadiums();
  const [selectedStadium, setSelectedStadium] = useState<Stadium | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-accent-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const hostCountries = [
    { name: 'Estados Unidos', stadiums: stadiums?.filter((s) => s.country_en === 'USA') ?? [], color: '#3B82F6' },
    { name: 'México', stadiums: stadiums?.filter((s) => s.country_en === 'Mexico') ?? [], color: '#F59E0B' },
    { name: 'Canadá', stadiums: stadiums?.filter((s) => s.country_en === 'Canada') ?? [], color: '#EF4444' },
  ];

  return (
    <div className="p-5 sm:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1 sm:space-y-2">
        <div className="flex items-center gap-3">
          <Building2 size={26} className="text-accent-teal" />
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Estadios</h1>
        </div>
        <p className="text-xs sm:text-sm text-text-secondary">16 estadios en 3 países — Copa Mundial 2026</p>
      </motion.div>

      {/* Host country stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {hostCountries.map(({ name, stadiums: cs, color }) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="rounded-2xl p-5"
            style={{
              background: `linear-gradient(135deg, ${color}10, ${color}05)`,
              border: `1px solid ${color}20`,
            }}
          >
            <h3 className="text-base font-bold mb-1" style={{ color }}>{name}</h3>
            <div className="flex items-center gap-3 text-sm text-text-secondary">
              <span className="flex items-center gap-1"><Building2 size={14} /> {cs.length} sedes</span>
              <span className="flex items-center gap-1"><Users size={14} /> {cs.reduce((s, x) => s + Number(x.capacity || 0), 0).toLocaleString()} cap.</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stadium Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {stadiums?.map((stadium, i) => (
          <StadiumCard
            key={stadium.id}
            stadium={stadium}
            index={i}
            onClick={() => setSelectedStadium(stadium)}
          />
        ))}
      </div>

      {/* Gallery Modal */}
      <AnimatePresence>
        {selectedStadium && (
          <StadiumGallery stadium={selectedStadium} onClose={() => setSelectedStadium(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
