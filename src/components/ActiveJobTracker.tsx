import React, { useState } from 'react';
import {
  ShieldCheck,
  Phone,
  MessageSquare,
  Clock,
  MapPin,
  Send,
  Star,
  CheckCircle2,
  AlertCircle,
  Truck,
  Wrench,
  ThumbsUp,
  Share2,
} from 'lucide-react';
import { ActiveJob, JobStatus, ChatMessage } from '../types';

interface ActiveJobTrackerProps {
  job: ActiveJob;
  onUpdateJobStatus: (newStatus: JobStatus) => void;
  onSendMessage: (jobId: string, text: string) => void;
  onFinishJob: (jobId: string, rating: number, comment: string) => void;
  onBackToBrowse: () => void;
}

export const ActiveJobTracker: React.FC<ActiveJobTrackerProps> = ({
  job,
  onUpdateJobStatus,
  onSendMessage,
  onFinishJob,
  onBackToBrowse,
}) => {
  const [inputText, setInputText] = useState('');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingStars, setRatingStars] = useState(5);
  const [reviewComment, setReviewComment] = useState(
    '¡Excelente servicio! Llegó muy rápido y dejó todo funcionando perfecto.'
  );
  const [hasCopiedShare, setHasCopiedShare] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(job.id, inputText.trim());
    setInputText('');
  };

  const statusSteps: { key: JobStatus; label: string; icon: React.ReactNode }[] = [
    { key: 'solicitado', label: 'Asignado', icon: <CheckCircle2 className="w-4 h-4" /> },
    { key: 'en_camino', label: 'En camino (Moto)', icon: <Truck className="w-4 h-4" /> },
    { key: 'en_diagnostico', label: 'Diagnóstico', icon: <Clock className="w-4 h-4" /> },
    { key: 'en_ejecucion', label: 'En ejecución', icon: <Wrench className="w-4 h-4" /> },
    { key: 'completado', label: 'Terminado', icon: <ThumbsUp className="w-4 h-4" /> },
  ];

  const currentStepIndex = statusSteps.findIndex((s) => s.key === job.status);

  const getNextStatus = (current: JobStatus): JobStatus => {
    switch (current) {
      case 'solicitado':
        return 'en_camino';
      case 'en_camino':
        return 'en_diagnostico';
      case 'en_diagnostico':
        return 'en_ejecucion';
      case 'en_ejecucion':
        return 'completado';
      default:
        return 'completado';
    }
  };

  const handleAdvanceStep = () => {
    const next = getNextStatus(job.status);
    onUpdateJobStatus(next);
  };

  const handleShareTracking = () => {
    navigator.clipboard?.writeText(window.location.href);
    setHasCopiedShare(true);
    setTimeout(() => setHasCopiedShare(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Apple Live Activity Card */}
      <div className="bg-white rounded-3xl border border-black/[0.06] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03),0_12px_28px_rgba(0,0,0,0.04)] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="font-bold text-sm text-[#f05023] font-display">
              Camello {job.code}
            </span>
            <span className="text-[#86868b]">·</span>
            <span className="text-xs text-[#86868b]">{job.createdAt}</span>
            <span className="text-[#86868b]">·</span>
            <span className="text-xs text-[#248a3d] font-medium bg-[#34c759]/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#34c759]" />
              Garantía Activa
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-[#1d1d1f] font-display">
            {job.problemTitle}
          </h2>
          <p className="text-xs text-[#6e6e73] mt-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#86868b]" />
            <span>{job.address} ({job.neighborhood})</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleShareTracking}
            className="px-4 py-2 border border-black/[0.08] hover:bg-black/[0.03] rounded-full text-xs font-semibold text-[#1d1d1f] bg-white flex items-center gap-1.5 transition-colors cursor-pointer apple-press"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{hasCopiedShare ? '¡Copiado!' : 'Compartir'}</span>
          </button>

          <button
            onClick={onBackToBrowse}
            className="px-4 py-2 border border-black/[0.08] hover:bg-black/[0.05] rounded-full text-xs font-semibold text-[#1d1d1f] bg-[#f5f5f7] transition-colors cursor-pointer apple-press"
          >
            Explorar Otros
          </button>
        </div>
      </div>

      {/* Real-time Status Tracker Timeline */}
      <div className="bg-white rounded-3xl border border-black/[0.06] p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03),0_12px_28px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">
            Línea de Tiempo del Servicio en Vivo
          </h3>

          {job.status !== 'completado' && (
            <button
              onClick={handleAdvanceStep}
              className="text-xs font-semibold text-[#f05023] hover:text-[#d04018] bg-[#f05023]/10 hover:bg-[#f05023]/15 px-3 py-1.5 rounded-full transition-colors cursor-pointer flex items-center gap-1 apple-press"
            >
              <span>Avanzar Estado Demo</span>
            </button>
          )}
        </div>

        {/* Timeline nodes */}
        <div className="relative">
          <div className="grid grid-cols-5 gap-2">
            {statusSteps.map((step, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <div key={step.key} className="flex flex-col items-center text-center">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                      isPast
                        ? 'bg-[#34c759] text-white shadow-xs'
                        : isCurrent
                        ? 'bg-[#f05023] text-white shadow-[0_4px_14px_rgba(240,80,35,0.35)] scale-110'
                        : 'bg-[#f5f5f7] text-[#86868b]'
                    }`}
                  >
                    {step.icon}
                  </div>
                  <span
                    className={`text-[11px] sm:text-xs mt-2.5 font-medium leading-tight ${
                      isCurrent
                        ? 'text-[#f05023] font-bold'
                        : isPast
                        ? 'text-[#1d1d1f]'
                        : 'text-[#86868b]'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Callout Card */}
        <div className="mt-7 p-4 sm:p-5 rounded-2xl bg-[#f5f5f7] border border-black/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-[#f05023] text-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1d1d1f]">
                {job.status === 'en_camino' && `Técnico en motocicleta en camino (~${job.etaMinutes} min)`}
                {job.status === 'solicitado' && 'Orden confirmada, preparando salida'}
                {job.status === 'en_diagnostico' && 'Técnico en el domicilio realizando diagnóstico'}
                {job.status === 'en_ejecucion' && 'Trabajo en ejecución con Garantía Camello'}
                {job.status === 'completado' && '¡Trabajo finalizado con total satisfacción!'}
              </h4>
              <p className="text-xs text-[#6e6e73] mt-0.5">
                {job.status === 'en_camino' && 'Llegando por la vía principal con el kit de repuestos.'}
                {job.status === 'solicitado' && 'Tu maestro ya revisó la foto y empacó herramientas.'}
                {job.status === 'en_diagnostico' && 'Revisando presiones y tuberías en sitio.'}
                {job.status === 'en_ejecucion' && 'Terminando sellos y prueba técnica.'}
                {job.status === 'completado' && 'Pago liberado en custodia y garantía de 30 días vigente.'}
              </p>
            </div>
          </div>

          {job.status === 'en_ejecucion' && (
            <button
              onClick={() => onUpdateJobStatus('completado')}
              className="px-5 py-2.5 bg-[#34c759] hover:bg-[#2db84f] text-white text-xs font-semibold rounded-full shadow-sm transition-colors shrink-0 cursor-pointer apple-press"
            >
              Confirmar Terminado
            </button>
          )}

          {job.status === 'completado' && (
            <button
              onClick={() => setShowRatingModal(true)}
              className="px-5 py-2.5 bg-[#1d1d1f] hover:bg-black text-white text-xs font-semibold rounded-full shadow-sm transition-colors shrink-0 cursor-pointer apple-press"
            >
              Calificar & Dejar Reseña
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Technician Card + iMessage Style Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Technician Profile */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-black/[0.06] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
            <h4 className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">
              Técnico Asignado
            </h4>

            <div className="flex items-center gap-3.5">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl font-display shadow-inner ${job.technician.avatarColor}`}
              >
                {job.technician.initials}
              </div>
              <div>
                <h5 className="font-bold text-[#1d1d1f] text-base font-display">
                  {job.technician.name}
                </h5>
                <p className="text-xs text-[#6e6e73]">{job.technician.title}</p>
                <div className="flex items-center gap-1 text-xs text-[#ff9500] font-semibold mt-1">
                  <Star className="w-3.5 h-3.5 fill-[#ff9500]" />
                  <span className="tabular-nums">{job.technician.rating.toFixed(2)}</span>
                  <span className="text-[#86868b] font-normal">
                    ({job.technician.completedJobs} camellos)
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-black/[0.06] space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#6e6e73]">
                <span>Cédula & Antecedentes:</span>
                <span className="font-semibold text-[#248a3d] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#34c759]" />
                  Verificado 100%
                </span>
              </div>
              <div className="flex items-center justify-between text-[#6e6e73]">
                <span>Placa de motocicleta:</span>
                <span className="font-mono font-semibold text-[#1d1d1f] bg-[#f5f5f7] px-2 py-0.5 rounded-md">
                  COF-82D
                </span>
              </div>
              <div className="flex items-center justify-between text-[#6e6e73]">
                <span>Método de pago:</span>
                <span className="font-semibold uppercase text-[#1d1d1f]">
                  {job.paymentMethod}
                </span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <a
                href={`tel:${job.technician.phone}`}
                className="flex-1 py-2.5 px-3 border border-black/[0.1] hover:bg-black/[0.04] bg-white text-[#1d1d1f] text-xs font-semibold rounded-full flex items-center justify-center gap-1.5 transition-colors apple-press"
              >
                <Phone className="w-3.5 h-3.5 text-[#34c759]" />
                <span>Llamar</span>
              </a>

              <a
                href={`https://wa.me/573114928821?text=Hola%20${job.technician.name},%20sobre%20el%20camello%20${job.code}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 px-3 bg-[#34c759] hover:bg-[#2db84f] text-white text-xs font-semibold rounded-full flex items-center justify-center gap-1.5 transition-colors shadow-xs apple-press"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Guarantee Summary */}
          <div className="bg-[#34c759]/10 rounded-3xl border border-[#34c759]/20 p-5 space-y-2 text-xs text-[#1d1d1f]">
            <div className="flex items-center gap-2 font-bold text-[#1d1d1f]">
              <ShieldCheck className="w-4 h-4 text-[#34c759]" />
              <span>Garantía Camello de 30 Días</span>
            </div>
            <p className="text-[#6e6e73] leading-relaxed">
              Cualquier novedad con el arreglo queda respaldada sin costo adicional.
              Tu pago en custodia (${job.estimatedCostCOP.toLocaleString('es-CO')} COP) está protegido.
            </p>
          </div>
        </div>

        {/* Right Column: Apple iMessage Style Chat */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col h-[520px] overflow-hidden">
          {/* Chat Header */}
          <div className="px-5 py-3.5 border-b border-black/[0.06] bg-[#f5f5f7]/70 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#f05023]/10 text-[#f05023] flex items-center justify-center font-bold text-xs">
                {job.technician.initials}
              </div>
              <div>
                <h5 className="font-bold text-xs text-[#1d1d1f]">
                  Chat con {job.technician.name}
                </h5>
                <span className="text-[11px] text-[#34c759] flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34c759] animate-pulse" />
                  En línea
                </span>
              </div>
            </div>

            <span className="text-[11px] text-[#86868b] font-mono bg-black/[0.04] px-2 py-0.5 rounded-full">
              Ref: {job.code}
            </span>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-[#f5f5f7]/40">
            {job.chatMessages.map((msg) => {
              if (msg.sender === 'system') {
                return (
                  <div key={msg.id} className="text-center my-2">
                    <span className="inline-block px-3.5 py-1 bg-black/[0.05] text-[#6e6e73] text-[11px] rounded-full">
                      {msg.text} · {msg.time}
                    </span>
                  </div>
                );
              }

              const isClient = msg.sender === 'client';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isClient ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2.5 text-xs ${
                      isClient
                        ? 'bg-[#f05023] text-white rounded-[20px] rounded-tr-[4px] shadow-[0_2px_8px_rgba(240,80,35,0.25)]'
                        : 'bg-[#e9e9eb] text-[#1d1d1f] rounded-[20px] rounded-tl-[4px]'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                  <span className="text-[10px] text-[#86868b] mt-1 px-1">
                    {msg.time}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Apple Chat Input Pill */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-white border-t border-black/[0.06] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Escríbele a ${job.technician.nickname || job.technician.name}...`}
              className="flex-1 px-4 py-2.5 rounded-full bg-[#f5f5f7] border border-black/[0.06] text-xs focus:bg-white focus:outline-none focus:border-[#f05023] transition-all"
            />
            <button
              type="submit"
              className="w-9 h-9 bg-[#f05023] hover:bg-[#e04018] text-white rounded-full flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-sm apple-press"
              aria-label="Enviar mensaje"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Apple Review Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-7 shadow-[0_24px_64px_rgba(0,0,0,0.2)] border border-black/[0.08] space-y-4">
            <div className="text-center space-y-1">
              <div className="w-14 h-14 bg-[#34c759]/15 text-[#34c759] rounded-2xl flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#1d1d1f] font-display">
                ¿Cómo te fue con {job.technician.name}?
              </h3>
              <p className="text-xs text-[#86868b]">
                Tu reseña ayuda a dignificar y visibilizar a los mejores maestros de Colombia.
              </p>
            </div>

            {/* Stars selector */}
            <div className="flex items-center justify-center gap-2 py-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatingStars(star)}
                  className="p-1 cursor-pointer transition-transform hover:scale-110 apple-press"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= ratingStars
                        ? 'fill-[#ff9500] text-[#ff9500]'
                        : 'text-black/[0.15]'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-1">
                Comentario para la comunidad
              </label>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full p-3 text-xs rounded-2xl bg-[#f5f5f7] border border-black/[0.08] focus:bg-white focus:outline-none focus:border-[#f05023] leading-relaxed"
              />
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setShowRatingModal(false)}
                className="flex-1 py-2.5 border border-black/[0.1] rounded-full text-xs font-semibold text-[#1d1d1f] hover:bg-black/[0.04] cursor-pointer apple-press"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  onFinishJob(job.id, ratingStars, reviewComment);
                  setShowRatingModal(false);
                }}
                className="apple-pill-primary flex-1 py-2.5 rounded-full text-xs font-semibold shadow-sm cursor-pointer apple-press"
              >
                Publicar & Liberar Pago
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
