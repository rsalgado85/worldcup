import { Mail, MapPin, ExternalLink, ArrowLeft, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { PageWrapper, PageHeader } from '@/components/ui/design-system';

const content = {
  es: {
    title: 'Contacto',
    subtitle: '¿Consultas, colaboraciones o feedback?',
    email: 'Correo electrónico',
    location: 'Ubicación',
    locationVal: 'Latinoamérica',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    availability: 'Disponibilidad',
    availabilityNote: 'Abierto a consultoría técnica, arquitectura de software y proyectos de IA. Respuesta en 24-48h.',
    back: 'Volver al inicio',
  },
  en: {
    title: 'Contact',
    subtitle: 'Questions, collaborations, or feedback?',
    email: 'Email',
    location: 'Location',
    locationVal: 'Latin America',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    availability: 'Availability',
    availabilityNote: 'Open to technical consulting, software architecture, and AI projects. Response within 24-48h.',
    back: 'Back to home',
  },
};

export default function ContactPage() {
  const { language } = useAppStore();
  const t = content[language];

  const email = 'rsalgado85@gmail.com';
  const githubUrl = 'https://github.com/rsalgado85';
  const linkedinUrl = 'https://linkedin.com/in/robinsonsalgado';

  return (
    <PageWrapper>
      <PageHeader icon={Send} title={t.title} subtitle={t.subtitle} />

      <div className="max-w-2xl space-y-4">
        {/* Email */}
        <a href={`mailto:${email}`}
          className="flex items-center gap-4 bg-navy-700/30 rounded-2xl border border-border-card p-5 hover:border-accent-teal/30 hover:bg-navy-700/50 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-accent-teal/10 flex items-center justify-center shrink-0">
            <Mail size={20} className="text-accent-teal" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">{t.email}</p>
            <p className="text-[15px] text-white font-medium truncate">{email}</p>
          </div>
        </a>

        {/* Location */}
        <div className="flex items-center gap-4 bg-navy-700/30 rounded-2xl border border-border-card p-5">
          <div className="w-10 h-10 rounded-xl bg-accent-teal/10 flex items-center justify-center shrink-0">
            <MapPin size={20} className="text-accent-teal" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">{t.location}</p>
            <p className="text-[15px] text-white font-medium">{t.locationVal}</p>
          </div>
        </div>

        {/* GitHub */}
        <a href={githubUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-4 bg-navy-700/30 rounded-2xl border border-border-card p-5 hover:border-accent-teal/30 hover:bg-navy-700/50 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-accent-teal/10 flex items-center justify-center shrink-0">
            <Github size={20} className="text-accent-teal" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">{t.github}</p>
            <p className="text-[15px] text-white font-medium">rsalgado85</p>
          </div>
        </a>

        {/* LinkedIn */}
        <a href={linkedinUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-4 bg-navy-700/30 rounded-2xl border border-border-card p-5 hover:border-accent-teal/30 hover:bg-navy-700/50 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-accent-teal/10 flex items-center justify-center shrink-0">
            <ExternalLink size={20} className="text-accent-teal" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">{t.linkedin}</p>
            <p className="text-[15px] text-white font-medium">robinsonsalgado</p>
          </div>
        </a>

        {/* Availability */}
        <div className="bg-navy-700/30 rounded-2xl border border-border-card p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-2">{t.availability}</p>
          <p className="text-[13px] text-text-secondary leading-relaxed">{t.availabilityNote}</p>
        </div>

        <Link to="/resumen"
          className="inline-flex items-center gap-2 text-text-muted hover:text-accent-teal transition-colors text-[14px] pt-2">
          <ArrowLeft size={16} />
          {t.back}
        </Link>
      </div>
    </PageWrapper>
  );
}
