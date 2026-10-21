import React from 'react';
import { ShieldCheck, Check, Lock, Award, X, MessageCircle } from 'lucide-react';

interface GuaranteeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuaranteeModal: React.FC<GuaranteeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1c1c1e] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.18)] border border-black/[0.08] dark:border-white/[0.1] space-y-6 my-auto">
        {/* Apple-style Modal Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#34c759] to-[#28a745] text-white flex items-center justify-center shadow-[0_4px_16px_rgba(52,199,89,0.3)]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1d1d1f] font-display">
                Garantía Camello & Pago Protegido
              </h3>
              <p className="text-xs text-[#86868b] mt-0.5">
                Seguridad, trazabilidad y dignidad laboral en cada servicio en Colombia.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/[0.05] hover:bg-black/[0.1] text-[#1d1d1f] flex items-center justify-center transition-colors cursor-pointer apple-press"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Pillars in Apple Feature Card Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="p-4 rounded-2xl bg-[#f5f5f7] border border-black/[0.04] space-y-1.5">
            <div className="flex items-center gap-2 text-[#1d1d1f] font-bold text-xs sm:text-sm">
              <div className="w-5 h-5 rounded-full bg-[#34c759]/15 flex items-center justify-center">
                <Lock className="w-3 h-3 text-[#34c759]" />
              </div>
              <span>1. Pago en Custodia (Escrow)</span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#6e6e73] leading-relaxed">
              Tu dinero nunca se le entrega por adelantado a nadie. Échele Camello retiene el saldo de forma segura y solo se libera cuando tú confirmes que el arreglo quedó a entera satisfacción.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#f5f5f7] border border-black/[0.04] space-y-1.5">
            <div className="flex items-center gap-2 text-[#1d1d1f] font-bold text-xs sm:text-sm">
              <div className="w-5 h-5 rounded-full bg-[#34c759]/15 flex items-center justify-center">
                <ShieldCheck className="w-3 h-3 text-[#34c759]" />
              </div>
              <span>2. Validación con Policía Nacional</span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#6e6e73] leading-relaxed">
              Validamos la cédula de ciudadanía, fotografía y antecedentes judiciales en la Policía Nacional, Procuraduría y Contraloría de cada maestro antes de activarlo.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#f5f5f7] border border-black/[0.04] space-y-1.5">
            <div className="flex items-center gap-2 text-[#1d1d1f] font-bold text-xs sm:text-sm">
              <div className="w-5 h-5 rounded-full bg-[#ff9500]/15 flex items-center justify-center">
                <Award className="w-3 h-3 text-[#ff9500]" />
              </div>
              <span>3. Mano de Obra Garantizada (30 días)</span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#6e6e73] leading-relaxed">
              Si la fuga reaparece, la chapa vuelve a fallar o la instalación presenta defectos dentro de los 30 días, el técnico regresa sin costo o enviamos a otro especialista.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#f5f5f7] border border-black/[0.04] space-y-1.5">
            <div className="flex items-center gap-2 text-[#1d1d1f] font-bold text-xs sm:text-sm">
              <div className="w-5 h-5 rounded-full bg-[#34c759]/15 flex items-center justify-center">
                <Check className="w-3 h-3 text-[#34c759]" />
              </div>
              <span>4. Cobertura hasta $5.000.000 COP</span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#6e6e73] leading-relaxed">
              Todos los servicios solicitados a través de la plataforma cuentan con respaldo para daños accidentales a la propiedad causados durante la labor.
            </p>
          </div>
        </div>

        {/* Support Callout */}
        <div className="bg-[#34c759]/10 rounded-2xl p-4 border border-[#34c759]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#1d1d1f]">
          <div className="space-y-0.5">
            <span className="font-bold text-[#1d1d1f] block">¿Tienes una duda o inconformidad?</span>
            <span className="text-[#6e6e73]">
              Nuestro equipo de mediación atiende casos 7 días a la semana en tiempo real.
            </span>
          </div>

          <a
            href="https://wa.me/573114928821?text=Hola,%20necesito%20soporte%20sobre%20la%20Garant%C3%ADa%20Camello"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-[#34c759] hover:bg-[#2db84f] text-white font-semibold rounded-full flex items-center gap-1.5 shrink-0 transition-colors shadow-sm apple-press"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Soporte</span>
          </a>
        </div>

        <div className="text-center pt-1">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#1d1d1f] hover:bg-black text-white font-semibold text-xs rounded-full transition-colors cursor-pointer shadow-sm apple-press"
          >
            Entendido, volver a la aplicación
          </button>
        </div>
      </div>
    </div>
  );
};
