import { useState } from 'react';
import { Heart, Coffee, ArrowLeft, Shield, Zap, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { PageWrapper, PageHeader } from '@/components/ui/design-system';

const AMOUNTS = [
  { value: 5, icon: Coffee },
  { value: 10, icon: Heart },
  { value: 25, icon: Zap },
  { value: 50, icon: Shield },
  { value: 100, icon: Globe },
];

const content = {
  es: {
    title: 'Apoya este proyecto',
    subtitle: 'Tu contribución mantiene WorldCup Insight gratuito y en constante evolución',
    oneTime: 'Una vez',
    monthly: 'Mensual',
    custom: 'Monto personalizado',
    placeholder: 'Ingresa un monto',
    donate: 'Donar con PayPal',
    why: '¿Por qué donar?',
    reason1: 'Sin anuncios — experiencia 100% limpia',
    reason2: 'Datos y predicciones en tiempo real',
    reason3: 'Desarrollo continuo de nuevas funcionalidades',
    reason4: 'Infraestructura y servidores',
    thanks: '¡Gracias por tu apoyo!',
    thanksDesc: 'Cada contribución, por pequeña que sea, ayuda a mantener este proyecto vivo y mejorando.',
    back: 'Volver al inicio',
  },
  en: {
    title: 'Support this project',
    subtitle: 'Your contribution keeps WorldCup Insight free and constantly evolving',
    oneTime: 'One time',
    monthly: 'Monthly',
    custom: 'Custom amount',
    placeholder: 'Enter an amount',
    donate: 'Donate with PayPal',
    why: 'Why donate?',
    reason1: 'No ads — 100% clean experience',
    reason2: 'Real-time data and predictions',
    reason3: 'Continuous development of new features',
    reason4: 'Infrastructure and servers',
    thanks: 'Thank you for your support!',
    thanksDesc: 'Every contribution, no matter how small, helps keep this project alive and improving.',
    back: 'Back to home',
  },
};

export default function DonatePage() {
  const { language } = useAppStore();
  const t = content[language];
  const [selected, setSelected] = useState<number | null>(null);
  const [custom, setCustom] = useState('');
  const [recurring, setRecurring] = useState(false);
  const [done, setDone] = useState(false);

  const paypalUrl = 'https://paypal.me/rsalgado85';
  const customNum = Number(custom) || 0;
  const amount = selected != null ? selected : customNum;

  const handleDonate = () => {
    if (amount <= 0) return;
    setDone(true);
    window.open(paypalUrl, '_blank');
  };

  return (
    <PageWrapper>
      <PageHeader icon={Heart} title={t.title} subtitle={t.subtitle} />

      <div className="max-w-lg space-y-6">
        {!done ? (
          <>
            {/* Recurring toggle */}
            <div className="flex bg-navy-700/30 rounded-xl border border-border-card p-1 gap-1">
              <button
                onClick={() => setRecurring(false)}
                className={`flex-1 py-2.5 rounded-lg text-[13px] font-semibold transition-all ${
                  !recurring ? 'bg-accent-teal text-white' : 'text-text-muted hover:text-white'
                }`}
              >
                {t.oneTime}
              </button>
              <button
                onClick={() => setRecurring(true)}
                className={`flex-1 py-2.5 rounded-lg text-[13px] font-semibold transition-all ${
                  recurring ? 'bg-accent-teal text-white' : 'text-text-muted hover:text-white'
                }`}
              >
                {t.monthly}
              </button>
            </div>

            {/* Preset amounts */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {AMOUNTS.map(({ value, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => { setSelected(value); setCustom(''); }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    selected === value
                      ? 'border-accent-teal bg-accent-teal/10 text-white shadow-md scale-105'
                      : 'border-border-card bg-navy-700/30 text-text-muted hover:border-border-emphasis'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-[14px] font-semibold">${value}</span>
                </button>
              ))}
            </div>

            {/* Custom amount */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-text-muted block mb-2">
                {t.custom}
              </label>
              <input
                type="number"
                value={custom}
                onChange={(e) => { setCustom(e.target.value); setSelected(null); }}
                placeholder={t.placeholder}
                className={`w-full bg-navy-700/30 rounded-xl border-2 px-4 py-4 text-white text-[16px] outline-none transition-all placeholder:text-text-dim ${
                  custom && !selected ? 'border-accent-teal' : 'border-border-card focus:border-accent-teal/50'
                }`}
              />
            </div>

            {/* Donate button */}
            <button
              onClick={handleDonate}
              disabled={amount <= 0}
              className="w-full py-4 rounded-xl bg-accent-teal text-white font-bold text-[15px] hover:bg-accent-teal-light transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {t.donate} {amount > 0 ? `($${amount})` : ''}
            </button>

            {/* Why donate */}
            <div className="bg-navy-700/30 rounded-2xl border border-border-card p-5 space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-accent-teal">{t.why}</h3>
              {[t.reason1, t.reason2, t.reason3, t.reason4].map((r, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-accent-teal mt-1 shrink-0 text-[11px]">✦</span>
                  <span className="text-text-secondary text-[13px]">{r}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Thank you screen */
          <div className="text-center bg-navy-700/30 rounded-2xl border border-border-card p-10 space-y-4">
            <Heart size={48} className="text-accent-teal mx-auto" />
            <h3 className="text-2xl font-black text-white">{t.thanks}</h3>
            <p className="text-text-secondary text-[14px] max-w-sm mx-auto">{t.thanksDesc}</p>
            <button
              onClick={() => setDone(false)}
              className="text-[13px] text-accent-teal hover:text-accent-teal-light transition-colors mt-2"
            >
              {language === 'es' ? 'Hacer otra donación' : 'Make another donation'}
            </button>
          </div>
        )}

        <Link to="/resumen"
          className="inline-flex items-center gap-2 text-text-muted hover:text-accent-teal transition-colors text-[14px] pt-2">
          <ArrowLeft size={16} />
          {t.back}
        </Link>
      </div>
    </PageWrapper>
  );
}
