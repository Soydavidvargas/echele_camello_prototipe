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
  const [reviewComment, setReviewComment] = useState('¡Excelente servicio! Llegó muy rápido y dejó todo funcionando perfecto.');
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
      {/* Top Banner with Service Code and Status */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-base text-[#ea580c] font-display">
              Camello {job.code}
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-xs text-slate-500">{job.createdAt}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Garantía Camello Activa
            </span>
          </div>

          <h2 className="text-xl font-bold text-slate-900 font-display">
            {job.problemTitle}
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            {job.address} ({job.neighborhood})
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleShareTracking}
            className="px-3.5 py-2 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-semibold text-slate-700 bg-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{hasCopiedShare ? '¡Enlace Copiado!' : 'Compartir con Familiar'}</span>
          </button>

          <button
            onClick={onBackToBrowse}
            className="px-3.5 py-2 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Volver a Buscar
          </button>
        </div>
      </div>

      {/* Real-time Status Tracker Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Línea de Tiempo del Servicio
          </h3>

          {job.status !== 'completado' && (
            <button
              onClick={handleAdvanceStep}
              className="text-xs font-semibold text-[#ea580c] hover:text-[#c2410c] bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Simular avance de estado: ({job.status})</span>
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
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isPast
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-[#ea580c] text-white ring-4 ring-orange-100 animate-pulse'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {step.icon}
                  </div>
                  <span
                    className={`text-xs mt-2 font-medium ${
                      isCurrent
                        ? 'text-[#ea580c] font-bold'
                        : isPast
                        ? 'text-slate-800'
                        : 'text-slate-400'
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
        <div className="mt-6 p-4 rounded-xl bg-orange-50 border border-orange-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#ea580c] text-white rounded-xl shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                {job.status === 'en_camino' && `Técnico en camino en motocicleta (~${job.etaMinutes} min)`}
                {job.status === 'solicitado' && 'Orden confirmada, preparando salida'}
                {job.status === 'en_diagnostico' && 'Técnico en el domicilio realizando diagnóstico'}
                {job.status === 'en_ejecucion' && 'Trabajo en ejecución bajo normas de seguridad'}
                {job.status === 'completado' && '¡Trabajo finalizado con éxito!'}
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                {job.status === 'en_camino' && 'Llegando por la Carrera 15 con el kit de repuestos.'}
                {job.status === 'solicitado' && 'Tu maestro ya revisó la foto y empacó herramientas.'}
                {job.status === 'en_diagnostico' && 'Revisando presiones y tuberías en sitio.'}
                {job.status === 'en_ejecucion' && 'Terminando sellos y prueba hidráulica.'}
                {job.status === 'completado' && 'Pago liberado en custodia y garantía de 30 días vigente.'}
              </p>
            </div>
          </div>

          {job.status === 'en_ejecucion' && (
            <button
              onClick={() => onUpdateJobStatus('completado')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              Confirmar que quedó listo
            </button>
          )}

          {job.status === 'completado' && (
            <button
              onClick={() => setShowRatingModal(true)}
              className="px-4 py-2 bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              Calificar & Dejar Reseña
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Technician Card + Live Interactive Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Technician Profile & Quick Contacts */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Técnico Asignado
            </h4>

            <div className="flex items-center gap-3.5">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl font-display shadow-inner ${job.technician.avatarColor}`}
              >
                {job.technician.initials}
              </div>
              <div>
                <h5 className="font-bold text-slate-900 text-base font-display">
                  {job.technician.name}
                </h5>
                <p className="text-xs text-slate-500">{job.technician.title}</p>
                <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold mt-1">
                  <Star className="w-3.5 h-3.5 fill-[#f59e0b]" />
                  <span className="tabular-nums">{job.technician.rating.toFixed(2)}</span>
                  <span className="text-slate-400 font-normal">
                    ({job.technician.completedJobs} camellos)
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Cédula & Antecedentes:</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verificado 100%
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Placa de motocicleta:</span>
                <span className="font-mono font-semibold text-slate-900">COF-82D</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Método de pago:</span>
                <span className="font-semibold uppercase text-slate-800">
                  {job.paymentMethod}
                </span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <a
                href={`tel:${job.technician.phone}`}
                className="flex-1 py-2 px-3 border border-slate-300 hover:border-slate-400 bg-white text-slate-800 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Llamar al Móvil</span>
              </a>

              <a
                href={`https://wa.me/573114928821?text=Hola%20${job.technician.name},%20sobre%20el%20camello%20${job.code}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Guarantee Summary */}
          <div className="bg-emerald-50 rounded-2xl border border-emerald-200/80 p-4 space-y-2 text-xs text-emerald-950">
            <div className="flex items-center gap-2 font-bold text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Garantía Camello de 30 Días</span>
            </div>
            <p className="text-emerald-800 leading-relaxed">
              Cualquier novedad con el arreglo queda respaldada sin costo adicional.
              Tu pago en custodia (${job.estimatedCostCOP.toLocaleString('es-CO')} COP)
              está blindado.
            </p>
          </div>
        </div>

        {/* Right Column: Live Chat with Technician */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[520px] overflow-hidden">
          {/* Chat Header */}
          <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#ea580c] flex items-center justify-center font-bold text-xs">
                {job.technician.initials}
              </div>
              <div>
                <h5 className="font-bold text-xs text-slate-900">
                  Chat con {job.technician.name}
                </h5>
                <span className="text-[11px] text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  En línea
                </span>
              </div>
            </div>

            <span className="text-[11px] text-slate-400 font-mono">
              Ref: {job.code}
            </span>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#f8fafc]">
            {job.chatMessages.map((msg) => {
              if (msg.sender === 'system') {
                return (
                  <div key={msg.id} className="text-center my-2">
                    <span className="inline-block px-3 py-1 bg-slate-200/80 text-slate-600 text-[11px] rounded-full">
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
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs ${
                      isClient
                        ? 'bg-[#ea580c] text-white rounded-tr-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-xs'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {msg.time}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Chat Input */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Escríbele a ${job.technician.nickname || job.technician.name}...`}
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="submit"
              className="p-2 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-xl transition-colors cursor-pointer shrink-0"
              aria-label="Enviar mensaje"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Review Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                ¿Cómo te fue con {job.technician.name}?
              </h3>
              <p className="text-xs text-slate-500">
                Tu calificación ayuda a mantener a los mejores maestros de Colombia.
              </p>
            </div>

            {/* Stars selector */}
            <div className="flex items-center justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatingStars(star)}
                  className="p-1 cursor-pointer transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= ratingStars
                        ? 'fill-[#f59e0b] text-[#f59e0b]'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Comentario para la comunidad
              </label>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setShowRatingModal(false)}
                className="flex-1 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  onFinishJob(job.id, ratingStars, reviewComment);
                  setShowRatingModal(false);
                }}
                className="flex-1 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
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
