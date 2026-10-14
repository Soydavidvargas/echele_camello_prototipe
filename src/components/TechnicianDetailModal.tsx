import React from 'react';
import {
  X,
  Star,
  ShieldCheck,
  Award,
  Clock,
  Phone,
  CheckCircle2,
  AlertCircle,
  FileText,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Ficha del Maestro Certificado
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            aria-label="Cerrar ficha"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main profile lockup */}
          <div className="flex flex-col sm:flex-row items-start gap-5 pb-6 border-b border-slate-100">
            <div className="relative shrink-0">
              <div
                className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl font-display shadow-inner ${technician.avatarColor}`}
              >
                {technician.initials}
              </div>
              {technician.isAvailableNow && (
                <span
                  title="Disponible en línea ahora"
                  className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center ring-2 ring-emerald-400/30"
                >
                  <span className="w-2 h-2 bg-white rounded-full" />
                </span>
              )}
            </div>

            <div className="space-y-1.5 flex-1">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  {technician.name}
                  {technician.nickname && (
                    <span className="text-sm font-normal text-slate-500 ml-1.5">
                      ({technician.nickname})
                    </span>
                  )}
                </h3>

                <div className="flex items-center gap-1 font-semibold text-sm text-slate-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
                  <Star className="w-4 h-4 fill-[#f59e0b] text-[#f59e0b]" />
                  <span className="tabular-nums">{technician.rating.toFixed(2)}</span>
                  <span className="text-xs text-slate-500 font-normal">
                    ({technician.completedJobs})
                  </span>
                </div>
              </div>

              <p className="text-sm font-medium text-slate-700">{technician.title}</p>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 pt-1">
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Cédula & Antecedentes Verificados
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                {technician.senaCertified && (
                  <span className="flex items-center gap-1 text-slate-700">
                    <Award className="w-4 h-4 text-orange-600" />
                    Título Técnico SENA
                  </span>
                )}
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>ARL Activa al día</span>
              </div>
            </div>
          </div>

          {/* Guarantee Stamp Box */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex items-start gap-3.5">
            <div className="p-2 bg-emerald-600 rounded-xl text-white shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-xs text-emerald-950 space-y-1">
              <span className="font-bold text-emerald-900 block text-sm">
                Garantía Camello Activa
              </span>
              <p className="text-emerald-800 leading-relaxed">
                Tu pago queda protegido en custodia hasta que apruebes el trabajo final. Incluye 
                garantía de mano de obra por 30 días y cobertura por daños accidentales hasta $5.000.000 COP.
              </p>
            </div>
          </div>

          {/* Bio */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Sobre el profesional & Experiencia
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {technician.bio}
            </p>
          </div>

          {/* Tariffs and Services List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Tarifas de Servicios Comunes
              </h4>
              <span className="text-xs text-slate-400">Precios transparentes en COP</span>
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
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-orange-300 bg-white hover:bg-orange-50/20 transition-all flex items-center justify-between gap-4"
                  >
                    <div className="space-y-0.5">
                      <h5 className="font-semibold text-sm text-slate-900">
                        {service.title}
                      </h5>
                      <p className="text-xs text-slate-500">{service.description}</p>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>Tiempo estimado: {service.estimatedTime}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="block text-sm font-bold text-slate-900 font-display tabular-nums">
                        {formattedPrice}
                      </span>
                      <button
                        onClick={() => onBookService(technician, service)}
                        className="mt-1 px-3 py-1 bg-slate-900 hover:bg-[#ea580c] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
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
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Reseñas Verificadas de Clientes ({technician.recentReviews.length})
            </h4>

            <div className="space-y-3">
              {technician.recentReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-800">{rev.author}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-slate-500">{rev.neighborhood}, {rev.city}</span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-[#f59e0b]" />
                      <span className="tabular-nums">{rev.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 italic">"{rev.comment}"</p>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                    <span>Servicio: {rev.service}</span>
                    <span>{rev.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Sticky Bottom Action Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-500 block leading-tight">
              Tarifa de visita técnica
            </span>
            <span className="text-lg font-bold text-slate-900 font-display tabular-nums">
              {formattedVisitFee} <span className="text-xs font-normal text-slate-500">COP</span>
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <a
              href={`tel:${technician.phone}`}
              className="flex-1 sm:flex-none px-4 py-2.5 border border-slate-300 hover:border-slate-400 bg-white text-slate-800 text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4 text-slate-600" />
              <span>Llamar Directo</span>
            </a>

            <button
              onClick={() => onBookService(technician)}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
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
