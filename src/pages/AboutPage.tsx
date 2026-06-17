import { Info, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { PageWrapper, PageHeader } from '@/components/ui/design-system';

const content = {
  es: {
    title: 'Sobre WorldCup Insight',
    subtitle: 'Tecnología, datos y pasión por el fútbol',
    p1: 'WorldCup Insight 2026 es una plataforma premium de análisis para la Copa Mundial de la FIFA. Nacida de la intersección entre la ciencia de datos y la pasión futbolera, ofrecemos estadísticas en tiempo real, predicciones basadas en machine learning, simulaciones Monte Carlo y visualizaciones interactivas.',
    p2: 'Nuestro motor de predicción combina modelos Poisson, Elo ratings y datos históricos de torneos para proyectar resultados con precisión estadística. Cada simulación ejecuta miles de iteraciones para calcular probabilidades de clasificación, campeón y goleo.',
    stack: 'Stack tecnológico',
    stackItems: [
      'Frontend: React 18 + TypeScript + TailwindCSS v4 + Vite',
      'Visualizaciones: Recharts + Framer Motion',
      'Backend: FastAPI + PostgreSQL + Redis',
      'ML: scikit-learn + XGBoost + Monte Carlo',
      'Deploy: Vercel + Docker + GitHub Actions',
    ],
    credits: 'Créditos',
    built: 'Construido por',
    back: 'Volver al inicio',
  },
  en: {
    title: 'About WorldCup Insight',
    subtitle: 'Technology, data, and passion for football',
    p1: 'WorldCup Insight 2026 is a premium analysis platform for the FIFA World Cup. Born from the intersection of data science and football passion, we provide real-time statistics, machine learning predictions, Monte Carlo simulations, and interactive visualizations.',
    p2: 'Our prediction engine combines Poisson models, Elo ratings, and historical tournament data to project outcomes with statistical precision. Each simulation runs thousands of iterations to calculate qualification, champion, and scoring probabilities.',
    stack: 'Tech Stack',
    stackItems: [
      'Frontend: React 18 + TypeScript + TailwindCSS v4 + Vite',
      'Visualizations: Recharts + Framer Motion',
      'Backend: FastAPI + PostgreSQL + Redis',
      'ML: scikit-learn + XGBoost + Monte Carlo',
      'Deploy: Vercel + Docker + GitHub Actions',
    ],
    credits: 'Credits',
    built: 'Built by',
    back: 'Back to home',
  },
};

export default function AboutPage() {
  const { language } = useAppStore();
  const t = content[language];

  return (
    <PageWrapper>
      <PageHeader icon={Info} title={t.title} subtitle={t.subtitle} />

      <div className="max-w-3xl space-y-6">
        <div className="bg-navy-700/30 rounded-2xl border border-border-card p-6 space-y-4">
          <p className="text-text-secondary text-[15px] leading-relaxed">{t.p1}</p>
          <p className="text-text-secondary text-[15px] leading-relaxed">{t.p2}</p>
        </div>

        <div className="bg-navy-700/30 rounded-2xl border border-border-card p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-accent-teal mb-4">{t.stack}</h3>
          <ul className="space-y-3">
            {t.stackItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-text-secondary text-[13px]">
                <span className="text-accent-teal mt-1.5 shrink-0">▸</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-navy-700/30 rounded-2xl border border-border-card p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-accent-teal mb-2">{t.credits}</h3>
          <p className="text-text-secondary text-[14px]">
            {t.built} <span className="text-white font-semibold">Robinson Salgado</span>
          </p>
          <div className="flex gap-4 mt-4">
            <a href="https://github.com/rsalgado85" target="_blank" rel="noopener noreferrer"
              className="text-[13px] text-accent-teal hover:text-accent-teal-light transition-colors">
              GitHub → rsalgado85
            </a>
            <a href="https://linkedin.com/in/robinsonsalgado" target="_blank" rel="noopener noreferrer"
              className="text-[13px] text-accent-teal hover:text-accent-teal-light transition-colors">
              LinkedIn → robinsonsalgado
            </a>
          </div>
        </div>

        <Link to="/resumen"
          className="inline-flex items-center gap-2 text-text-muted hover:text-accent-teal transition-colors text-[14px]">
          <ArrowLeft size={16} />
          {t.back}
        </Link>
      </div>
    </PageWrapper>
  );
}
