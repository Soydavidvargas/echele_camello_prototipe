import React from 'react';
import { Star, ShieldCheck, MapPin, Award, ArrowRight } from 'lucide-react';
import { Technician } from '../types';

interface TechnicianCardProps {
  technician: Technician;
  onViewProfile: (tech: Technician) => void;
  onBookTechnician: (tech: Technician) => void;
}

export const TechnicianCard: React.FC<TechnicianCardProps> = ({
  technician,
  onViewProfile,
  onBookTechnician,
}) => {
  const formattedFee = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(technician.visitFeeCOP);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
      <div className="p-5">
        {/* Header row: Avatar, Info & Star Rating */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3.5">
            {/* Avatar container with online badge */}
            <div className="relative shrink-0">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg font-display shadow-inner ${technician.avatarColor}`}
              >
                {technician.initials}
              </div>

              {technician.isAvailableNow && (
                <span
                  title="Disponible ya para salir a tu domicilio"
                  className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center ring-2 ring-emerald-400/30"
                >
                  <span className="w-1.5 h-1.5 bg-white rounded-full" />
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="font-semibold text-slate-900 text-base leading-tight font-display group-hover:text-[#ea580c] transition-colors">
                  {technician.name}
                </h4>
                {technician.nickname && (
                  <span className="text-xs text-slate-500 font-normal">
                    ({technician.nickname})
                  </span>
                )}
              </div>

              <p className="text-xs font-medium text-slate-600 mt-0.5">
                {technician.title}
              </p>

              {/* Clean unboxed trust badges with dot separators */}
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1.5 flex-wrap">
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Cédula & Policía OK
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                {technician.senaCertified && (
                  <span className="flex items-center gap-1 text-slate-600">
                    <Award className="w-3.5 h-3.5 text-orange-600" />
                    SENA
                  </span>
                )}
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>{technician.experienceYears} años exp.</span>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="text-right shrink-0">
            <div className="flex items-center gap-1 justify-end font-semibold text-sm text-slate-900">
              <Star className="w-4 h-4 fill-[#f59e0b] text-[#f59e0b]" />
              <span className="tabular-nums">{technician.rating.toFixed(2)}</span>
            </div>
            <p className="text-[11px] text-slate-500 tabular-nums">
              {technician.completedJobs} camellos
            </p>
          </div>
        </div>

        {/* Short Bio */}
        <p className="text-xs text-slate-600 mt-3.5 line-clamp-2 leading-relaxed">
          {technician.bio}
        </p>

        {/* Coverage Neighborhoods */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1 text-xs text-slate-500">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">
            {technician.neighborhoods.slice(0, 3).join(', ')}
            {technician.neighborhoods.length > 3 && ` +${technician.neighborhoods.length - 3}`}
          </span>
        </div>
      </div>

      {/* Footer row: Price & Action CTA */}
      <div className="bg-[#f8fafc] px-5 py-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
        <div>
          <span className="block text-[11px] text-slate-500 font-medium leading-none">
            Visita técnica de diagnóstico
          </span>
          <span className="text-sm font-bold text-slate-900 font-display tabular-nums">
            {formattedFee} <span className="text-xs font-normal text-slate-500">COP</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewProfile(technician)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            Ver Tarifas
          </button>

          <button
            onClick={() => onBookTechnician(technician)}
            className="px-3.5 py-1.5 text-xs font-semibold bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer active:scale-[0.98]"
          >
            <span>Cotizar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
