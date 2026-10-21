import React from 'react';
import {
  X,
  Star,
  ShieldCheck,
  Award,
  Clock,
  Phone,
  CheckCircle2,
} from 'lucide-react';
import { Technician, ServiceTariff } from '../types';

interface TechnicianDetailModalProps {
  technician: Technician | null;
  onClose: () => void;
  onBookService: (technician: Technician, selectedService?: ServiceTariff) => void;
}

export const TechnicianDetailModal: React.FC<TechnicianDetailModalProps> = ({
  technician,
  onClose,
  onBookService,
}) => {
  if (!technician) return null;

  const formattedVisitFee = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(technician.visitFeeCOP);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1c1c1e] rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-[0_24px_64px_rgba(0,0,0,0.2)] border border-black/[0.08] dark:border-white/[0.1] overflow-hidden my-auto">
        {/* Apple Modal Top Bar */}
        <div className="px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between bg-[#f5f5f7]/70 dark:bg-white/[0.04] backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-[#86868b] dark:text-[#a1a1a6] uppercase tracking-wider">
              Ficha del Profesional Verificado
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/[0.05] hover:bg-black/[0.1] dark:bg-white/[0.08] dark:hover:bg-white/[0.15] text-[#1d1d1f] dark:text-white flex items-center justify-center transition-colors cursor-pointer apple-press"
            aria-label="Cerrar ficha"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-6">
          {/* Main profile lockup */}
          <div className="flex flex-col sm:flex-row items-start gap-5 pb-6 border-b border-black/[0.06]">
            <div className="relative shrink-0">
              <div
                className={`w-20 h-20 rounded-3xl flex items-center justify-center text-white font-bold text-2xl font-display shadow-inner ${technician.avatarColor} ring-1 ring-black/[0.05]`}
              >
                {technician.initials}
              </div>
              {technician.isAvailableNow && (
                <span
                  title="Disponible en línea ahora"
                  className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#34c759] border-2 border-white rounded-full flex items-center justify-center shadow-xs"
                >
                  <span className="w-2 h-2 bg-white rounded-full" />
                </span>
              )}
            </div>

            <div className="space-y-1.5 flex-1">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h3 className="text-xl sm:text-2xl font-bold text-[#1d1d1f] font-display">
                  {technician.name}
                  {technician.nickname && (
                    <span className="text-sm font-normal text-[#86868b] ml-1.5">
                      ({technician.nickname})
                    </span>
                  )}
                </h3>

                <div className="flex items-center gap-1 font-semibold text-xs text-[#1d1d1f] bg-[#f5f5f7] px-3 py-1.5 rounded-full">
                  <Star className="w-3.5 h-3.5 fill-[#ff9500] text-[#ff9500]" />
                  <span className="tabular-nums">{technician.rating.toFixed(2)}</span>
                  <span className="text-[11px] text-[#86868b] font-normal">
                    ({technician.completedJobs} camellos)
                  </span>
                </div>
              </div>

              <p className="text-sm font-medium text-[#6e6e73]">{technician.title}</p>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
                <span className="flex items-center gap-1 text-[#248a3d] font-medium bg-[#34c759]/10 px-2.5 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#34c759]" />
                  Cédula & Antecedentes Verificados
                </span>
                {technician.senaCertified && (
                  <span className="flex items-center gap-1 text-[#b45309] font-medium bg-[#ff9500]/10 px-2.5 py-0.5 rounded-full">
                    <Award className="w-3.5 h-3.5 text-[#ff9500]" />
                    Título Técnico SENA
                  </span>
                )}
                <span className="text-[#86868b] text-[11px]">· ARL Vigente</span>
              </div>
            </div>
          </div>

          {/* Guarantee Stamp Box */}
          <div className="bg-[#34c759]/10 border border-[#34c759]/20 rounded-2xl p-4 flex items-start gap-3.5">
            <div className="p-2 bg-[#34c759] rounded-xl text-white shrink-0 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-xs text-[#1d1d1f] space-y-1">
              <span className="font-bold text-[#1d1d1f] block text-sm">
                Garantía Camello Incluida
              </span>
              <p className="text-[#6e6e73] leading-relaxed">
                Tu pago queda protegido en custodia hasta que apruebes el trabajo final. Incluye 
                garantía de mano de obra por 30 días y cobertura por daños accidentales hasta $5.000.000 COP.
              </p>
            </div>
          </div>

          {/* Bio */}
          <div>
            <h4 className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-2">
              Sobre el profesional & Experiencia
            </h4>
            <p className="text-xs sm:text-sm text-[#48484a] leading-relaxed bg-[#f5f5f7] p-4 rounded-2xl border border-black/[0.04]">
              {technician.bio}
            </p>
          </div>

          {/* Tariffs and Services List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">
                Tarifas de Servicios Comunes
              </h4>
              <span className="text-xs text-[#86868b]">Precios transparentes en COP</span>
            </div>

            <div className="space-y-2.5">
              {technician.services.map((service, index) => {
                const formattedPrice = new Intl.NumberFormat('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  maximumFractionDigits: 0,
                }).format(service.priceCOP);

                return (
                  <div
                    key={index}
                    className="p-4 rounded-2xl border border-black/[0.06] hover:border-black/[0.12] bg-white hover:bg-[#fafafc] transition-all flex items-center justify-between gap-4 shadow-[0_1px_4px_rgba(0,0,0,0.02)]"
                  >
                    <div className="space-y-0.5">
                      <h5 className="font-semibold text-xs sm:text-sm text-[#1d1d1f]">
                        {service.title}
                      </h5>
                      <p className="text-xs text-[#6e6e73]">{service.description}</p>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#86868b] pt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>Estimado: {service.estimatedTime}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="block text-sm font-bold text-[#1d1d1f] font-display tabular-nums">
                        {formattedPrice}
                      </span>
                      <button
                        onClick={() => onBookService(technician, service)}
                        className="mt-1.5 px-3 py-1 bg-[#1d1d1f] hover:bg-[#f05023] text-white text-[11px] font-semibold rounded-full transition-colors cursor-pointer apple-press"
                      >
                        Pedir este
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real Customer Reviews */}
          <div>
            <h4 className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-3">
              Reseñas Verificadas de Clientes ({technician.recentReviews.length})
            </h4>

            <div className="space-y-2.5">
              {technician.recentReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 bg-[#f5f5f7] rounded-2xl border border-black/[0.04] space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-[#1d1d1f]">{rev.author}</span>
                      <span className="text-[#86868b]">·</span>
                      <span className="text-[#6e6e73]">{rev.neighborhood}, {rev.city}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[#ff9500] font-semibold">
                      <Star className="w-3 h-3 fill-[#ff9500]" />
                      <span className="tabular-nums text-[11px]">{rev.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#48484a] italic">"{rev.comment}"</p>

                  <div className="text-[11px] text-[#86868b] flex items-center justify-between pt-1">
                    <span>Labor: {rev.service}</span>
                    <span>{rev.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Sticky Bottom Action Bar */}
        <div className="p-4 sm:p-5 bg-[#f5f5f7]/80 backdrop-blur-md border-t border-black/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#86868b] font-semibold block leading-tight">
              Visita Técnica Diagnóstica
            </span>
            <span className="text-lg font-bold text-[#1d1d1f] font-display tabular-nums">
              {formattedVisitFee} <span className="text-xs font-normal text-[#86868b]">COP</span>
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <a
              href={`tel:${technician.phone}`}
              className="flex-1 sm:flex-none px-4 py-2.5 border border-black/[0.1] hover:bg-black/[0.05] bg-white text-[#1d1d1f] text-xs font-semibold rounded-full flex items-center justify-center gap-2 transition-colors apple-press"
            >
              <Phone className="w-3.5 h-3.5 text-[#1d1d1f]" />
              <span>Llamar</span>
            </a>

            <button
              onClick={() => onBookService(technician)}
              className="apple-pill-primary flex-1 sm:flex-none px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-full flex items-center justify-center gap-2 cursor-pointer shadow-sm apple-press"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Agendar Técnico Ahora</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
