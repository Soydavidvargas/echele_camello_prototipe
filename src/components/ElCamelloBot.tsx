import React, { useState } from 'react';
import { MessageSquare, X, Sparkles, HelpCircle, ArrowRight, RotateCcw } from 'lucide-react';

interface ElCamelloBotProps {
  mode: 'client' | 'worker';
}

interface QAItem {
  id: string;
  question: string;
  answer: string;
}

const CLIENT_FAQS: QAItem[] = [
  {
    id: 'c1',
    question: '🛡️ ¿Cómo funciona la Garantía Camello y el pago seguro?',
    answer:
      '¡Buenas vecino! En Échele Camello tu dinero queda en Custodia Segura (Escrow). Cuando pagas por Nequi, Daviplata o PSE, el dinero NO se le entrega al técnico hasta que tú revises el trabajo y confirmes tu total satisfacción. Además, incluye 30 días de garantía por mano de obra y seguro contra daños accidentales de hasta $5.000.000 COP.',
  },
  {
    id: 'c2',
    question: '⚡ ¿Cuánto demora en llegar un técnico de urgencia?',
    answer:
      'Nuestros técnicos de guardia se desplazan en motocicleta con kit de herramientas y repuestos estándar. El tiempo promedio de llegada a tu domicilio en Neiva o Bogotá es de 25 a 35 minutos desde el momento en que confirmas la solicitud.',
  },
  {
    id: 'c3',
    question: '👮 ¿Cómo verifican los antecedentes de los maestros?',
    answer:
      'Cada técnico pasa por validación de cédula de ciudadanía, reconocimiento biométrico y cotejo directo de antecedentes judiciales en la Policía Nacional, Procuraduría y Contraloría General de la República. Solo activamos profesionales 100% aprobados.',
  },
  {
    id: 'c4',
    question: '💳 ¿Qué métodos de pago reciben?',
    answer:
      'Puedes pagar directamente desde tu celular con Nequi, Daviplata, PSE, Tarjeta débito/crédito, o en efectivo una vez finalizada la labor a entera conformidad.',
  },
  {
    id: 'c5',
    question: '🔧 ¿Qué incluye la visita técnica diagnóstica?',
    answer:
      'La visita cubre el traslado del técnico en su moto, la inspección física del daño con herramientas especializadas (como geófonos o multímetros) y la entrega de una cotización con tarifa fija regulada antes de ejecutar el arreglo.',
  },
];

const WORKER_FAQS: QAItem[] = [
  {
    id: 'w1',
    question: '💰 ¿Cómo retiro mi plata de la billetera a Nequi o Daviplata?',
    answer:
      '¡Hola maestro! Tu dinero acumulado por servicios completados se liquida al instante. Solo ingresas a tu Panel Técnico > pestaña Billetera, tocas "Retirar a Nequi" o "Retirar a Daviplata" y la transferencia se envía automáticamente a tu número registrado sin comisión sobre tus propinas.',
  },
  {
    id: 'w2',
    question: '📋 ¿Qué requisitos necesito para ser Maestro Pro?',
    answer:
      'Debes tener cédula de ciudadanía colombiana vigente, antecedentes judiciales limpios (Policía Nacional), certificación técnica SENA o Conte (o acreditar mínimo 5 años de experiencia comprobada) y planilla ARL al día.',
  },
  {
    id: 'w3',
    question: '🛵 ¿Cómo funciona el seguro de accidentes para técnicos?',
    answer:
      'Todos los técnicos activos en plataforma cuentan con cobertura bajo la póliza colectiva contra accidentes de trabajo locativos y responsabilidad civil extracontractual durante el trayecto y la ejecución de la labor.',
  },
  {
    id: 'w4',
    question: '🎯 ¿Cómo aceptar más camellos cerca a mi zona?',
    answer:
      'Mantén tu estado en "Recibiendo Camellos" (botón verde activo) y activa tu GPS. El Radar te notificará los servicios más cercanos a tu ubicación en un radio de 5 km para que no gastes gasolina de más.',
  },
];

export const ElCamelloBot: React.FC<ElCamelloBotProps> = ({ mode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedQA, setSelectedQA] = useState<QAItem | null>(null);

  const faqs = mode === 'worker' ? WORKER_FAQS : CLIENT_FAQS;

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-20 md:bottom-6 right-5 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center gap-2.5 px-4 py-3 bg-[#161617] text-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.25)] border border-white/[0.12] hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          {/* Camel Avatar with blinking pulse */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#f05023] to-[#e03d10] flex items-center justify-center text-white font-bold text-sm shadow-md">
            🐪
          </div>
          <div className="text-left hidden sm:block">
            <span className="text-xs font-bold font-display block leading-none">
              El Camello
            </span>
            <span className="text-[10px] text-[#ff7a50] font-medium">
              Ayuda & FAQ Bot
            </span>
          </div>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#34c759] border-2 border-[#161617]" />
        </button>
      </div>

      {/* Bot Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-24 md:bottom-20 right-4 sm:right-6 z-50 w-[92vw] sm:w-96 max-h-[520px] bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-white rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.25)] border border-black/[0.08] dark:border-white/[0.1] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
          {/* Header */}
          <div className="px-5 py-4 bg-[#161617] text-white flex items-center justify-between border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#f05023] to-[#e03d10] flex items-center justify-center text-xl shadow-xs">
                🐪
              </div>
              <div>
                <h4 className="font-bold text-sm font-display leading-tight flex items-center gap-1.5">
                  <span>El Camello Bot</span>
                  <span className="text-[10px] bg-[#34c759]/20 text-[#34c759] px-2 py-0.5 rounded-full font-semibold">
                    En vivo
                  </span>
                </h4>
                <p className="text-[11px] text-[#86868b]">
                  {mode === 'worker' ? 'Asistente para Maestros & Técnicos' : 'Asistente de Servicios & Garantía'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Conversation Body */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#f5f5f7] dark:bg-[#121214]">
            {/* Welcome message bubble */}
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#f05023] text-white text-xs flex items-center justify-center shrink-0">
                🐪
              </div>
              <div className="bg-white dark:bg-[#2c2c2e] p-3.5 rounded-2xl rounded-tl-xs border border-black/[0.06] dark:border-white/[0.08] shadow-xs text-xs space-y-1">
                <p className="font-semibold text-[#1d1d1f] dark:text-white">
                  ¡Hola! Soy <strong>El Camello</strong>, tu asesor virtual.
                </p>
                <p className="text-[#6e6e73] dark:text-[#a1a1a6] leading-relaxed">
                  Toca cualquiera de las opciones establecidas a continuación para darte una respuesta inmediata y clara:
                </p>
              </div>
            </div>

            {/* If an answer is selected, show question and answer */}
            {selectedQA ? (
              <div className="space-y-3 animate-in fade-in">
                {/* User selection bubble */}
                <div className="flex justify-end">
                  <div className="bg-[#f05023] text-white p-3 rounded-2xl rounded-tr-xs text-xs max-w-[85%] font-medium shadow-xs">
                    {selectedQA.question}
                  </div>
                </div>

                {/* Bot Answer bubble */}
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#f05023] text-white text-xs flex items-center justify-center shrink-0">
                    🐪
                  </div>
                  <div className="bg-white dark:bg-[#2c2c2e] p-4 rounded-2xl rounded-tl-xs border border-black/[0.06] dark:border-white/[0.08] shadow-xs text-xs text-[#1d1d1f] dark:text-white leading-relaxed space-y-2">
                    <p>{selectedQA.answer}</p>
                    <div className="pt-2 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-[11px] text-[#86868b]">
                      <span>¿Respondió tu duda?</span>
                      <button
                        onClick={() => setSelectedQA(null)}
                        className="text-[#f05023] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Hacer otra pregunta</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Pre-established Question Chips (No typing required) */
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider block">
                  Preguntas Frecuentes Establecidas:
                </span>
                {faqs.map((faq) => (
                  <button
                    key={faq.id}
                    onClick={() => setSelectedQA(faq)}
                    className="w-full text-left p-3 rounded-2xl bg-white dark:bg-[#2c2c2e] hover:bg-[#fafafc] dark:hover:bg-[#343438] border border-black/[0.06] dark:border-white/[0.08] text-xs text-[#1d1d1f] dark:text-white font-medium flex items-center justify-between transition-all cursor-pointer shadow-xs apple-press"
                  >
                    <span className="pr-2">{faq.question}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#f05023] shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="p-3 bg-white dark:bg-[#1c1c1e] border-t border-black/[0.06] dark:border-white/[0.08] text-center text-[11px] text-[#86868b]">
            Respuestas automáticas protegidas por Garantía Camello
          </div>
        </div>
      )}
    </>
  );
};
