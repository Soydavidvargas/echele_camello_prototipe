import React from 'react';
import { ShieldCheck, Check, Lock, Award, X, AlertTriangle, MessageCircle } from 'lucide-react';

interface GuaranteeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuaranteeModal: React.FC<GuaranteeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 my-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-md shadow-emerald-600/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-display">
                Garantía Camello & Pago Seguro
              </h3>
              <p className="text-xs text-slate-500">
                Tu tranquilidad y la dignidad del trabajo bien hecho en Colombia.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>1. Pago en Custodia (Escrow)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tu dinero nunca se le entrega por adelantado a nadie. Échele Camello retiene el saldo de forma segura y solo se transfiere cuando tú confirmes que el arreglo quedó a entera satisfacción.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>2. Validación con Cédula & Policía</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Validamos la identidad biométrica, cédula de ciudadanía y antecedentes judiciales en la Policía Nacional, Procuraduría y Contraloría de cada maestro antes de activarlo.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Award className="w-4 h-4 text-orange-600" />
              <span>3. Garantía de Mano de Obra (30 días)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Si la fuga reaparece, la chapa vuelve a fallar o la instalación presenta defectos dentro de los 30 días siguientes, el técnico regresa sin costo alguno o enviamos a otro maestro certificado.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>4. Cobertura hasta $5.000.000 COP</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Todos los servicios solicitados a través de la plataforma cuentan con respaldo para daños accidentales a la propiedad causados durante la ejecución de la labor.
            </p>
          </div>
        </div>

        {/* Support Callout */}
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-950">
          <div className="space-y-0.5">
            <span className="font-bold block">¿Tienes una queja o inconformidad con un trabajo?</span>
            <span className="text-emerald-800">
              Nuestro equipo de mediación en Bogotá atiende casos 7 días a la semana.
            </span>
          </div>

          <a
            href="https://wa.me/573114928821?text=Hola,%20necesito%20soporte%20sobre%20la%20Garant%C3%ADa%20Camello"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl flex items-center gap-1.5 shrink-0 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Línea WhatsApp de Soporte</span>
          </a>
        </div>

        <div className="text-center pt-2">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#0f172a] hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Entendido, volver a la aplicación
          </button>
        </div>
      </div>
    </div>
  );
};
