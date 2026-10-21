import React from 'react';
import { Clock, ShieldCheck, Zap, ArrowRight, Check } from 'lucide-react';

interface UrgentBannerProps {
  cityName: string;
  onOpenEmergency: () => void;
  onFilterUrgent: () => void;
  isUrgentFiltered: boolean;
}

export const UrgentBanner: React.FC<UrgentBannerProps> = ({
  cityName,
  onOpenEmergency,
  onFilterUrgent,
  isUrgentFiltered,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#161617] text-white p-6 sm:p-8 mb-8 border border-white/[0.1] shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
      {/* Subtle Apple Ambient Glow in the background */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#f05023]/15 blur-3xl"
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#ff9500]/10 blur-3xl"
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#f05023]/15 text-[#ff7a50] border border-[#f05023]/30 backdrop-blur-md">
              <Zap className="w-3.5 h-3.5 text-[#ff7a50]" />
              Servicio de Emergencia Inmediata
            </span>
            <span className="text-xs text-[#86868b]">· Cobertura completa en {cityName}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white leading-tight">
            ¿Fuga urgente, corto eléctrico o chapa trabada?
          </h2>

          <p className="text-sm text-[#a1a1a6] leading-relaxed">
            Técnicos certificados de guardia en moto con herramientas especializadas. Llegada garantizada en tu puerta en{' '}
            <span className="text-white font-semibold tabular-nums">25 a 35 minutos</span> con tarifa regulada y Garantía Camello.
          </p>

          <div className="flex flex-wrap items-center gap-5 pt-2 text-xs text-[#86868b]">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-[#34c759]/20 flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-[#34c759]" />
              </div>
              <span className="text-[#d2d2d7]">Disponible 24 Horas / 7 Días</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-[#34c759]/20 flex items-center justify-center">
                <ShieldCheck className="w-2.5 h-2.5 text-[#34c759]" />
              </div>
              <span className="text-[#d2d2d7]">Policía Nacional & Cédula Cotejada</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#ff9500]" />
              <span className="text-[#d2d2d7]">Pago protegido en custodia</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 pt-2 lg:pt-0">
          <button
            onClick={onFilterUrgent}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
              isUrgentFiltered
                ? 'bg-[#34c759] text-white border-[#34c759] shadow-[0_2px_12px_rgba(52,199,89,0.35)]'
                : 'bg-white/[0.08] hover:bg-white/[0.14] text-[#f5f5f7] border-white/[0.12] active:scale-[0.98]'
            }`}
          >
            {isUrgentFiltered ? '✓ Filtro "En Vivo" Activo' : 'Ver Disponibles Ya'}
          </button>

          <button
            onClick={onOpenEmergency}
            className="apple-pill-primary px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(240,80,35,0.4)]"
          >
            <span>Pedir Técnico Urgente</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
