import React from 'react';
import { Star, ShieldCheck, Zap, Phone, Award, Sparkles, MessageCircle, CheckCircle2 } from 'lucide-react';
import { WorkerAd } from '../types';

interface GoldenAdsSectionProps {
  ads: WorkerAd[];
  onSelectWorkerForBooking?: (technicianName: string) => void;
  onGoToWorkerMode?: () => void;
}

export const GoldenAdsSection: React.FC<GoldenAdsSectionProps> = ({
  ads,
  onSelectWorkerForBooking,
  onGoToWorkerMode,
}) => {
  return (
    <section className="space-y-6">
      {/* Golden Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#291b06] via-[#1a1205] to-[#110e08] border border-amber-500/40 p-6 sm:p-8 shadow-[0_8px_32px_rgba(217,119,6,0.15)]">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-orange-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Sección Dorada VIP · Anuncios Patrocinados</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
              Maestros y Técnicos <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400">Destacados</span>
            </h2>
            <p className="text-xs sm:text-sm text-amber-100/70 leading-relaxed">
              Profesionales verificados con disponibilidad prioritaria, garantía de mano de obra y pago seguro.
            </p>
          </div>

          {onGoToWorkerMode && (
            <button
              onClick={onGoToWorkerMode}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#140e04] font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <span>⭐ ¿Eres Técnico? Anúnciate Aquí</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of Golden Ads */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {ads.map((ad) => (
          <div
            key={ad.id}
            className="group relative rounded-3xl bg-gradient-to-b from-[#1f1607] to-[#120f09] border border-amber-500/35 hover:border-amber-400/70 p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(245,158,11,0.18)] flex flex-col justify-between"
          >
            {/* Top VIP Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[11px] font-bold tracking-wider uppercase">
                <Award className="w-3 h-3 text-amber-400" />
                <span>Patrocinado VIP</span>
              </span>
              <span className="text-[10px] text-amber-200/50 font-medium">
                {ad.createdAt}
              </span>
            </div>

            {/* Technician Info */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-black font-extrabold text-lg flex items-center justify-center font-display shadow-md shadow-amber-500/30 shrink-0">
                  {ad.technicianName
                    .split(' ')
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div>
                  <h4 className="text-base font-bold text-white font-display group-hover:text-amber-200 transition-colors">
                    {ad.technicianName}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="flex items-center text-amber-400 text-xs font-bold gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {ad.rating.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-[#86868b]">
                      ({ad.completedJobs} camellos hechos)
                    </span>
                  </div>
                </div>
              </div>

              {/* Title / Commercial Hook */}
              <h5 className="text-xs sm:text-sm font-semibold text-amber-100/90 leading-snug">
                {ad.title}
              </h5>

              {/* Service tags / features */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {ad.features.map((feat, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/[0.05] text-amber-200/80 border border-white/[0.06]"
                  >
                    <CheckCircle2 className="w-2.5 h-2.5 text-amber-400" />
                    <span>{feat}</span>
                  </span>
                ))}
              </div>

              {/* Location & Price */}
              <div className="pt-2 border-t border-amber-500/15 flex items-center justify-between text-xs">
                <span className="text-amber-200/60 truncate max-w-[150px]">
                  📍 {ad.neighborhood}
                </span>
                <div className="text-right">
                  <span className="text-[10px] text-amber-200/60 block">Tarifa desde</span>
                  <span className="text-sm font-extrabold text-amber-300 font-mono">
                    ${ad.startingPriceCOP.toLocaleString('es-CO')} COP
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 mt-4 border-t border-amber-500/20 grid grid-cols-2 gap-2">
              <a
                href={`https://wa.me/57${ad.phone.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(
                  ad.technicianName
                )},%20te%20vi%20en%20la%20Secci%C3%B3n%20Dorada%20de%20%C3%89chele%20Camello.`}
                target="_blank"
                rel="noreferrer"
                className="py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  if (onSelectWorkerForBooking) {
                    onSelectWorkerForBooking(ad.technicianName);
                  }
                }}
                className="py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-xs"
              >
                <span>Contratar</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
