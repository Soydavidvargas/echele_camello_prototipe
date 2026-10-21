import React from 'react';
import { motion } from 'motion/react';
import { Star, ShieldCheck, MapPin, Award, ArrowRight } from 'lucide-react';
import { Technician } from '../types';
import { fadeUp } from '../lib/motion';

const cardReveal = fadeUp(50, 0.7);

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
    <motion.article
      variants={cardReveal}
      aria-label={`${technician.name}, ${technician.title}`}
      className="bg-white dark:bg-[#1c1c1e] rounded-3xl border border-black/[0.06] dark:border-white/[0.08] hover:border-black/[0.12] dark:hover:border-white/[0.16] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_24px_60px_rgb(0,0,0,0.10)] hover:-translate-y-2 transition-[translate,box-shadow,border-color] duration-300 ease-in-out flex flex-col justify-between overflow-hidden group"
    >
      <div className="p-6">
        {/* Header row: Avatar, Info & Star Rating */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-4">
            {/* Apple squircle avatar with live online badge */}
            <div className="relative shrink-0">
              <div
                aria-hidden="true"
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg font-display shadow-inner ${technician.avatarColor} ring-1 ring-black/[0.04]`}
              >
                {technician.initials}
              </div>

              {technician.isAvailableNow && (
                <span
                  role="img"
                  aria-label="Disponible en línea ahora"
                  title="Disponible en línea ahora"
                  className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#34c759] border-2 border-white rounded-full flex items-center justify-center shadow-xs"
                >
                  <span className="w-1.5 h-1.5 bg-white rounded-full" />
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="font-semibold text-[#1d1d1f] dark:text-white text-base leading-tight font-display group-hover:text-[#c2410c] transition-colors">
                  {technician.name}
                </h4>
                {technician.nickname && (
                  <span className="text-xs text-[#6e6e73] dark:text-[#a1a1a6] font-normal">
                    ({technician.nickname})
                  </span>
                )}
              </div>

              <p className="text-xs font-medium text-[#6e6e73] dark:text-[#a1a1a6] mt-0.5">
                {technician.title}
              </p>

              {/* Apple-style trust tags with dot separators */}
              <div className="flex items-center gap-1.5 text-[11px] text-[#6e6e73] dark:text-[#a1a1a6] mt-2 flex-wrap">
                <span className="flex items-center gap-1 text-[#248a3d] dark:text-[#34c759] font-medium bg-[#34c759]/10 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3 text-[#34c759]" />
                  Policía & Cédula OK
                </span>
                {technician.senaCertified && (
                  <span className="flex items-center gap-1 text-[#b45309] dark:text-[#ff9500] font-medium bg-[#ff9500]/10 px-2 py-0.5 rounded-full">
                    <Award className="w-3 h-3 text-[#ff9500]" />
                    SENA
                  </span>
                )}
                <span>·</span>
                <span>{technician.experienceYears} años exp.</span>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="text-right shrink-0">
            <div className="flex items-center gap-1 justify-end font-semibold text-sm text-[#1d1d1f] dark:text-white bg-[#f5f5f7] dark:bg-white/[0.08] px-2.5 py-1 rounded-xl">
              <Star className="w-3.5 h-3.5 fill-[#ff9500] text-[#ff9500]" />
              <span className="tabular-nums text-xs">{technician.rating.toFixed(2)}</span>
            </div>
            <p className="text-[10px] text-[#6e6e73] dark:text-[#a1a1a6] tabular-nums mt-1 text-right">
              {technician.completedJobs} servicios
            </p>
          </div>
        </div>

        {/* Short Bio */}
        <p className="text-xs text-[#6e6e73] dark:text-[#a1a1a6] mt-4 line-clamp-2 leading-relaxed">
          {technician.bio}
        </p>

        {/* Coverage Neighborhoods */}
        <div className="mt-4 pt-3.5 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center gap-1.5 text-xs text-[#6e6e73] dark:text-[#a1a1a6]">
          <MapPin className="w-3.5 h-3.5 text-[#6e6e73] dark:text-[#a1a1a6] shrink-0" />
          <span className="truncate">
            {technician.neighborhoods.slice(0, 3).join(', ')}
            {technician.neighborhoods.length > 3 && ` +${technician.neighborhoods.length - 3}`}
          </span>
        </div>
      </div>

      {/* Footer row: Apple price block & pill CTA */}
      <div className="bg-[#f5f5f7]/60 dark:bg-white/[0.03] px-6 py-4 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between gap-3">
        <div>
          <span className="block text-[10px] uppercase tracking-wider text-[#6e6e73] dark:text-[#a1a1a6] font-semibold leading-tight">
            Visita Técnica
          </span>
          <span className="text-base font-bold text-[#1d1d1f] dark:text-white font-display tabular-nums">
            {formattedFee} <span className="text-xs font-normal text-[#6e6e73] dark:text-[#a1a1a6]">COP</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onViewProfile(technician)}
            aria-label={`Ver tarifas de ${technician.name}`}
            className="px-3.5 py-2 text-xs font-medium text-[#1d1d1f] dark:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.08] rounded-full transition-colors cursor-pointer apple-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#c2410c]"
          >
            Tarifas
          </button>

          <button
            type="button"
            onClick={() => onBookTechnician(technician)}
            aria-label={`Cotizar servicio con ${technician.name}`}
            className="apple-pill-primary px-4 py-2 text-xs font-semibold rounded-full flex items-center gap-1.5 cursor-pointer shadow-sm apple-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#c2410c]"
          >
            <span>Cotizar</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </motion.article>
  );
};
