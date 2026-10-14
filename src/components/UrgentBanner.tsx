import React from 'react';
import { Clock, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

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
    <div className="bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white rounded-2xl p-4 sm:p-6 mb-8 border border-slate-700 shadow-md">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <Zap className="w-3.5 h-3.5 text-orange-400" />
              Servicio de Emergencia Inmediato
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">· Cobertura completa en {cityName}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white">
            ¿Fuga de agua, corto circuito o chapa trabada ahora mismo?
          </h2>

          <p className="text-sm text-slate-300">
            Técnicos de guardia verificados en moto con kit de herramientas. Llegada estimada en tu puerta en 
            <span className="text-orange-400 font-semibold tabular-nums"> 25 a 35 minutos</span> con tarifa de visita fija.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Disponible 24 Horas / 7 Días</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Identidad cotejada con Policía Nacional</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            onClick={onFilterUrgent}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all text-center cursor-pointer border ${
              isUrgentFiltered
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-600'
            }`}
          >
            {isUrgentFiltered ? '✓ Mostrando "Disponibles Ya"' : 'Filtrar "Disponibles Ya"'}
          </button>

          <button
            onClick={onOpenEmergency}
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <span>Pedir Técnico Urgente</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
