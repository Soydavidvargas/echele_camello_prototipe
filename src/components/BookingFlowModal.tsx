import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  CreditCard,
  ShieldCheck,
  Check,
  Camera,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Banknote,
  Sparkles,
} from 'lucide-react';
import { Technician, ServiceTariff, CategoryId, ActiveJob } from '../types';

interface BookingFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  technician: Technician | null;
  presetService?: ServiceTariff | null;
  defaultCategory?: CategoryId;
  defaultCityName: string;
  onJobCreated: (newJob: ActiveJob) => void;
}

export const BookingFlowModal: React.FC<BookingFlowModalProps> = (props) => {
  if (!props.isOpen) return null;
  return <BookingFlowContent {...props} />;
};

const BookingFlowContent: React.FC<BookingFlowModalProps> = ({
  onClose,
  technician,
  presetService,
  defaultCategory = 'plomeria',
  defaultCityName,
  onJobCreated,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [problemTitle, setProblemTitle] = useState(
    presetService?.title || 'Fuga de agua o daño en grifería / tubería'
  );
  const [problemDescription, setProblemDescription] = useState(
    presetService?.description ||
      'Se filtra agua por la base de la tubería y gotea constantemente.'
  );
  const [hasPhotoAttached, setHasPhotoAttached] = useState(true);

  // Location states
  const [address, setAddress] = useState('Carrera 8 # 14-38');
  const [apartment, setApartment] = useState('Apto 402, Edificio Los Samanes');
  const [neighborhood, setNeighborhood] = useState('Quirinal');
  const [parkingNotes, setParkingNotes] = useState(
    'Portería 24 horas, hay espacio para parquear la moto del técnico.'
  );

  // Timing states
  const [scheduleType, setScheduleType] = useState<'immediate' | 'scheduled'>('immediate');
  const [scheduledDay, setScheduledDay] = useState('Hoy');
  const [scheduledSlot, setScheduledSlot] = useState('Tarde (2:00 PM - 5:00 PM)');

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<
    'nequi' | 'daviplata' | 'pse' | 'tarjeta' | 'efectivo'
  >('nequi');

  // Pricing math
  const visitFee = technician?.visitFeeCOP || 45000;
  const estimatedLabor = presetService?.priceCOP || 85000;
  const discountCOP = 15000;
  const totalEstimated = Math.max(0, estimatedLabor - discountCOP);

  const handleFinishBooking = () => {
    const randomCode = `CAM-${Math.floor(1000 + Math.random() * 9000)}`;

    const newJob: ActiveJob = {
      id: `job-${Date.now()}`,
      code: randomCode,
      technician: technician || {
        id: 'tech-auto',
        name: 'Wilson Cárdenas',
        nickname: 'Maestro Wilson',
        title: 'Técnico Especialista en Turno',
        categoryId: defaultCategory,
        categoryName: 'Servicio General',
        city: 'bogota',
        cityName: defaultCityName,
        neighborhoods: [neighborhood],
        photoUrl: '',
        avatarColor: 'bg-orange-600',
        initials: 'WC',
        rating: 4.92,
        completedJobs: 145,
        experienceYears: 12,
        isAvailableNow: true,
        responseTimeMinutes: 25,
        idVerified: true,
        policeBackgroundCheck: true,
        senaCertified: true,
        arlActive: true,
        visitFeeCOP: visitFee,
        bio: 'Técnico de guardia asignado automáticamente para atender tu solicitud.',
        phone: '+57 310 987 6543',
        services: [],
        recentReviews: [],
      },
      category: defaultCategory,
      problemTitle,
      description: problemDescription,
      address: `${address}, ${apartment}`,
      city: defaultCityName,
      neighborhood,
      scheduledTime:
        scheduleType === 'immediate'
          ? 'Inmediato (Técnico en camino ~25 min)'
          : `${scheduledDay} - ${scheduledSlot}`,
      status: 'en_camino',
      etaMinutes: 24,
      createdAt: 'Hace un momento',
      estimatedCostCOP: totalEstimated,
      paymentMethod,
      isGuaranteeActive: true,
      chatMessages: [
        {
          id: 'sys-start',
          sender: 'system',
          text: `¡Camello ${randomCode} confirmado! Tu técnico ya fue notificado y se prepara para salir a ${neighborhood}.`,
          time: 'Ahora',
        },
        {
          id: 'tech-welcome',
          sender: 'technician',
          text: `¡Buenas tardes vecino! Recibí la orden para "${problemTitle}". Ya alisto mi equipo y voy en camino.`,
          time: 'Ahora',
        },
      ],
    };

    onJobCreated(newJob);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1c1c1e] rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-[0_24px_64px_rgba(0,0,0,0.2)] border border-black/[0.08] dark:border-white/[0.1] overflow-hidden my-auto">
        {/* Apple Header */}
        <div className="px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between bg-[#f5f5f7]/70 dark:bg-white/[0.04] backdrop-blur-md">
          <div>
            <h3 className="font-bold text-[#1d1d1f] dark:text-white text-lg font-display">
              Solicitar Camello Protegido
            </h3>
            <p className="text-xs text-[#86868b] dark:text-[#a1a1a6]">
              Paso {step} de 4 ·{' '}
              {step === 1 && 'Detalles del servicio'}
              {step === 2 && 'Ubicación del domicilio'}
              {step === 3 && 'Horario & Inmediatez'}
              {step === 4 && 'Custodia & Pago seguro'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/[0.05] hover:bg-black/[0.1] dark:bg-white/[0.08] dark:hover:bg-white/[0.15] text-[#1d1d1f] dark:text-white flex items-center justify-center transition-colors cursor-pointer apple-press"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Apple Step Indicator Pill */}
        <div className="px-6 pt-3 pb-1 bg-white dark:bg-[#1c1c1e]">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  i <= step ? 'bg-[#f05023]' : 'bg-black/[0.06]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Body by Step */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* STEP 1: Problem description */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-1.5">
                  Título del problema o labor
                </label>
                <input
                  type="text"
                  value={problemTitle}
                  onChange={(e) => setProblemTitle(e.target.value)}
                  placeholder="Ej: Fuga bajo el lavaplatos, chapa trancada, etc."
                  className="w-full px-4 py-3 rounded-2xl bg-[#f5f5f7] border border-black/[0.06] focus:bg-white focus:border-[#f05023] focus:ring-4 focus:ring-[#f05023]/10 text-sm font-medium transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-1.5">
                  Describe los detalles del daño
                </label>
                <textarea
                  rows={3}
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  placeholder="Indica qué ocurrió, si el agua está cerrada, o si se necesitan repuestos especiales..."
                  className="w-full px-4 py-3 rounded-2xl bg-[#f5f5f7] border border-black/[0.06] focus:bg-white focus:border-[#f05023] focus:ring-4 focus:ring-[#f05023]/10 text-sm transition-all outline-none leading-relaxed"
                />
              </div>

              {/* Photo upload simulator */}
              <div>
                <label className="block text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-1.5">
                  Foto o video del daño (Opcional)
                </label>
                <div
                  onClick={() => setHasPhotoAttached(!hasPhotoAttached)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    hasPhotoAttached
                      ? 'border-[#34c759] bg-[#34c759]/5'
                      : 'border-black/[0.08] bg-[#f5f5f7] hover:border-black/[0.15]'
                  } apple-press`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        hasPhotoAttached ? 'bg-[#34c759] text-white shadow-xs' : 'bg-black/[0.08] text-[#86868b]'
                      }`}
                    >
                      <Camera className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-[#1d1d1f] block">
                        {hasPhotoAttached ? '✓ 1 Foto del daño adjunta' : 'Adjuntar foto o video'}
                      </span>
                      <span className="text-[11px] text-[#86868b]">
                        {hasPhotoAttached
                          ? 'fuga_tubo_lavaplatos_foto1.jpg (2.4 MB)'
                          : 'Ayuda al maestro a llevar repuestos exactos'}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#f05023]">
                    {hasPhotoAttached ? 'Cambiar' : 'Subir'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Address */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-1.5">
                    Dirección principal
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ej: Carrera 8 # 14-38"
                    className="w-full px-4 py-3 rounded-2xl bg-[#f5f5f7] border border-black/[0.06] focus:bg-white focus:border-[#f05023] focus:ring-4 focus:ring-[#f05023]/10 text-sm font-medium transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-1.5">
                    Barrio
                  </label>
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="Ej: Quirinal, Ipanema, etc."
                    className="w-full px-4 py-3 rounded-2xl bg-[#f5f5f7] border border-black/[0.06] focus:bg-white focus:border-[#f05023] focus:ring-4 focus:ring-[#f05023]/10 text-sm font-medium transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-1.5">
                  Apto, Casa o Torre
                </label>
                <input
                  type="text"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  placeholder="Ej: Torre 3 Apto 402, Casa 15 Conjunto..."
                  className="w-full px-4 py-3 rounded-2xl bg-[#f5f5f7] border border-black/[0.06] focus:bg-white focus:border-[#f05023] focus:ring-4 focus:ring-[#f05023]/10 text-sm font-medium transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-1.5">
                  Instrucciones de portería o parqueo
                </label>
                <input
                  type="text"
                  value={parkingNotes}
                  onChange={(e) => setParkingNotes(e.target.value)}
                  placeholder="Ej: Portería 24h, hay espacio para la moto del técnico..."
                  className="w-full px-4 py-3 rounded-2xl bg-[#f5f5f7] border border-black/[0.06] focus:bg-white focus:border-[#f05023] focus:ring-4 focus:ring-[#f05023]/10 text-sm font-medium transition-all outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Timing and Schedule */}
          {step === 3 && (
            <div className="space-y-4">
              <label className="block text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-1.5">
                ¿Cuándo requieres la visita técnica?
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setScheduleType('immediate')}
                  className={`p-5 rounded-2xl border text-left cursor-pointer transition-all ${
                    scheduleType === 'immediate'
                      ? 'border-[#f05023] bg-[#f05023]/5 shadow-[0_2px_12px_rgba(240,80,35,0.12)]'
                      : 'border-black/[0.06] bg-[#f5f5f7] hover:border-black/[0.12]'
                  } apple-press`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-[#f05023]/10 text-[#f05023] flex items-center justify-center">
                      <Clock className="w-5 h-5" />
                    </div>
                    {scheduleType === 'immediate' && (
                      <span className="w-5 h-5 bg-[#f05023] text-white rounded-full flex items-center justify-center shadow-xs">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-[#1d1d1f] text-sm">
                    Inmediato (25 - 35 min)
                  </h4>
                  <p className="text-xs text-[#86868b] mt-1 leading-relaxed">
                    Técnico en moto en camino directo para fugas o urgencias.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setScheduleType('scheduled')}
                  className={`p-5 rounded-2xl border text-left cursor-pointer transition-all ${
                    scheduleType === 'scheduled'
                      ? 'border-[#f05023] bg-[#f05023]/5 shadow-[0_2px_12px_rgba(240,80,35,0.12)]'
                      : 'border-black/[0.06] bg-[#f5f5f7] hover:border-black/[0.12]'
                  } apple-press`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-black/[0.06] text-[#1d1d1f] flex items-center justify-center">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    {scheduleType === 'scheduled' && (
                      <span className="w-5 h-5 bg-[#f05023] text-white rounded-full flex items-center justify-center shadow-xs">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-[#1d1d1f] text-sm">
                    Programar Fecha & Hora
                  </h4>
                  <p className="text-xs text-[#86868b] mt-1 leading-relaxed">
                    Para mantenimientos programados, pinturas o remodelación.
                  </p>
                </button>
              </div>

              {scheduleType === 'scheduled' && (
                <div className="p-4 bg-[#f5f5f7] rounded-2xl border border-black/[0.04] space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1d1d1f] mb-1">
                      Día del servicio
                    </label>
                    <select
                      value={scheduledDay}
                      onChange={(e) => setScheduledDay(e.target.value)}
                      className="w-full p-3 bg-white border border-black/[0.08] rounded-xl text-sm font-medium"
                    >
                      <option value="Hoy">Hoy mismo</option>
                      <option value="Mañana">Mañana</option>
                      <option value="Sábado">Sábado próximo</option>
                      <option value="Domingo">Domingo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1d1d1f] mb-1">
                      Franja horaria preferida
                    </label>
                    <select
                      value={scheduledSlot}
                      onChange={(e) => setScheduledSlot(e.target.value)}
                      className="w-full p-3 bg-white border border-black/[0.08] rounded-xl text-sm font-medium"
                    >
                      <option value="Mañana (8:00 AM - 12:00 PM)">
                        Mañana (8:00 AM - 12:00 PM)
                      </option>
                      <option value="Tarde (2:00 PM - 5:00 PM)">
                        Tarde (2:00 PM - 5:00 PM)
                      </option>
                      <option value="Final de tarde (5:00 PM - 7:30 PM)">
                        Final de tarde (5:00 PM - 7:30 PM)
                      </option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Summary and Payment in Custody */}
          {step === 4 && (
            <div className="space-y-4">
              {/* Cost Breakdown Apple Receipt */}
              <div className="bg-[#f5f5f7] p-5 rounded-2xl border border-black/[0.04] space-y-2 text-xs">
                <div className="flex justify-between text-[#6e6e73]">
                  <span>Diagnóstico y visita técnica en moto:</span>
                  <span className="font-semibold text-[#1d1d1f] tabular-nums">
                    ${visitFee.toLocaleString('es-CO')} COP
                  </span>
                </div>
                <div className="flex justify-between text-[#6e6e73]">
                  <span>Mano de obra estimada ({problemTitle}):</span>
                  <span className="font-semibold text-[#1d1d1f] tabular-nums">
                    ${estimatedLabor.toLocaleString('es-CO')} COP
                  </span>
                </div>
                <div className="flex justify-between text-[#34c759] font-medium">
                  <span>Bono bienvenida "Primer Camello":</span>
                  <span className="font-semibold tabular-nums">
                    -${discountCOP.toLocaleString('es-CO')} COP
                  </span>
                </div>
                <div className="pt-3 border-t border-black/[0.06] flex justify-between items-baseline text-sm">
                  <span className="font-bold text-[#1d1d1f]">Total en Custodia Segura:</span>
                  <span className="font-bold text-lg text-[#f05023] font-display tabular-nums">
                    ${totalEstimated.toLocaleString('es-CO')} COP
                  </span>
                </div>
              </div>

              {/* Payment selector */}
              <div>
                <label className="block text-[11px] font-semibold text-[#86868b] uppercase tracking-wider mb-2">
                  Selecciona método de pago (En custodia protegida)
                </label>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('nequi')}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === 'nequi'
                        ? 'border-[#f05023] bg-[#f05023]/5 font-semibold text-[#1d1d1f]'
                        : 'border-black/[0.06] bg-[#f5f5f7] text-[#48484a] hover:bg-black/[0.03]'
                    } apple-press`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-purple-600/10 text-purple-700 flex items-center justify-center">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <span className="text-xs">Nequi</span>
                    </div>
                    {paymentMethod === 'nequi' && (
                      <span className="w-4 h-4 rounded-full bg-[#f05023] text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('daviplata')}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === 'daviplata'
                        ? 'border-[#f05023] bg-[#f05023]/5 font-semibold text-[#1d1d1f]'
                        : 'border-black/[0.06] bg-[#f5f5f7] text-[#48484a] hover:bg-black/[0.03]'
                    } apple-press`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-red-600/10 text-red-700 flex items-center justify-center">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <span className="text-xs">Daviplata</span>
                    </div>
                    {paymentMethod === 'daviplata' && (
                      <span className="w-4 h-4 rounded-full bg-[#f05023] text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pse')}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === 'pse'
                        ? 'border-[#f05023] bg-[#f05023]/5 font-semibold text-[#1d1d1f]'
                        : 'border-black/[0.06] bg-[#f5f5f7] text-[#48484a] hover:bg-black/[0.03]'
                    } apple-press`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-600/10 text-blue-700 flex items-center justify-center">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <span className="text-xs">PSE / Tarjeta</span>
                    </div>
                    {paymentMethod === 'pse' && (
                      <span className="w-4 h-4 rounded-full bg-[#f05023] text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('efectivo')}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === 'efectivo'
                        ? 'border-[#f05023] bg-[#f05023]/5 font-semibold text-[#1d1d1f]'
                        : 'border-black/[0.06] bg-[#f5f5f7] text-[#48484a] hover:bg-black/[0.03]'
                    } apple-press`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-600/10 text-emerald-700 flex items-center justify-center">
                        <Banknote className="w-4 h-4" />
                      </div>
                      <span className="text-xs">Efectivo al fin</span>
                    </div>
                    {paymentMethod === 'efectivo' && (
                      <span className="w-4 h-4 rounded-full bg-[#f05023] text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Guarantee micro banner */}
              <div className="bg-[#34c759]/10 p-3.5 rounded-2xl border border-[#34c759]/20 flex items-start gap-2.5 text-xs text-[#1d1d1f]">
                <ShieldCheck className="w-4 h-4 text-[#34c759] shrink-0 mt-0.5" />
                <span className="text-[#48484a] text-[11px] leading-relaxed">
                  <strong className="text-[#1d1d1f]">Garantía Camello:</strong> Tu dinero queda en custodia segura. Solo se libera al técnico cuando tú confirmes que el arreglo quedó perfecto.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="p-4 sm:p-5 bg-[#f5f5f7]/80 backdrop-blur-md border-t border-black/[0.06] flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
              className="px-5 py-2.5 rounded-full border border-black/[0.1] bg-white text-[#1d1d1f] text-xs font-semibold flex items-center gap-1.5 hover:bg-black/[0.04] transition-colors cursor-pointer apple-press"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Atrás</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep((s) => (s + 1) as 2 | 3 | 4)}
              className="apple-pill-primary px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm apple-press"
            >
              <span>Continuar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinishBooking}
              className="px-6 py-2.5 rounded-full bg-[#34c759] hover:bg-[#2db84f] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-[0_2px_12px_rgba(52,199,89,0.35)] transition-all cursor-pointer apple-press"
            >
              <Check className="w-4 h-4" />
              <span>Confirmar & Despachar Camello</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
