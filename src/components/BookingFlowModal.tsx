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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-900 text-lg font-display">
              Solicitar Camello Garantizado
            </h3>
            <p className="text-xs text-slate-500">
              Paso {step} de 4 · {step === 1 && '¿Qué necesitas reparar?'}
              {step === 2 && 'Ubicación en tu ciudad'}
              {step === 3 && 'Horario & Fecha'}
              {step === 4 && 'Resumen & Método de pago'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-4 h-1.5 bg-slate-100">
          <div className={`h-full ${step >= 1 ? 'bg-[#ea580c]' : 'bg-transparent'}`} />
          <div className={`h-full ${step >= 2 ? 'bg-[#ea580c]' : 'bg-transparent'}`} />
          <div className={`h-full ${step >= 3 ? 'bg-[#ea580c]' : 'bg-transparent'}`} />
          <div className={`h-full ${step >= 4 ? 'bg-[#ea580c]' : 'bg-transparent'}`} />
        </div>

        {/* Body by Step */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* STEP 1: Problem description */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Título del problema o servicio
                </label>
                <input
                  type="text"
                  value={problemTitle}
                  onChange={(e) => setProblemTitle(e.target.value)}
                  placeholder="Ej: Fuga bajo el lavaplatos, chapa trancada, etc."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Describe los detalles del daño
                </label>
                <textarea
                  rows={3}
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  placeholder="Indica qué ocurrió, si el agua está cerrada, o si se necesitan repuestos especiales..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>

              {/* Photo upload simulator */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Foto o video del daño (Opcional para cotización exacta)
                </label>
                <div
                  onClick={() => setHasPhotoAttached(!hasPhotoAttached)}
                  className={`p-4 rounded-xl border-2 border-dashed flex items-center justify-between cursor-pointer transition-all ${
                    hasPhotoAttached
                      ? 'border-emerald-400 bg-emerald-50/50 text-emerald-900'
                      : 'border-slate-300 bg-slate-50 text-slate-600 hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        hasPhotoAttached ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      <Camera className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold block">
                        {hasPhotoAttached ? '✓ 1 Foto del daño adjuntada' : 'Adjuntar foto desde galería o cámara'}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {hasPhotoAttached
                          ? 'fuga_tubo_lavaplatos_foto1.jpg (2.4 MB)'
                          : 'Ayuda al maestro a llevar los repuestos exactos'}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-700 underline">
                    {hasPhotoAttached ? 'Cambiar' : 'Subir'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Address and Location */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-slate-100 rounded-xl text-xs text-slate-700">
                <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
                <span>
                  Ciudad configurada: <strong>{defaultCityName}</strong>
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Dirección (Nomenclatura)
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ej: Carrera 15 # 119-32 o Calle 72 # 10-34"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Barrio / Sector
                  </label>
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="Ej: Cedritos, Laureles, etc."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Apto / Casa / Torre
                  </label>
                  <input
                    type="text"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    placeholder="Ej: Apto 402, Torre 3"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Notas de llegada o portería
                </label>
                <input
                  type="text"
                  value={parkingNotes}
                  onChange={(e) => setParkingNotes(e.target.value)}
                  placeholder="Ej: Dejar moto en visitantes, avisar en citófono..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Timing and Schedule */}
          {step === 3 && (
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                ¿Cuándo requieres el servicio?
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setScheduleType('immediate')}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                    scheduleType === 'immediate'
                      ? 'border-[#ea580c] bg-orange-50/50 ring-2 ring-orange-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-orange-100 text-[#ea580c] rounded-xl">
                      <Clock className="w-5 h-5" />
                    </div>
                    {scheduleType === 'immediate' && (
                      <span className="w-5 h-5 bg-[#ea580c] text-white rounded-full flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Inmediato (25 - 35 min)
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Ideal para fugas, cerrajería o urgencias en el momento.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setScheduleType('scheduled')}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                    scheduleType === 'scheduled'
                      ? 'border-[#ea580c] bg-orange-50/50 ring-2 ring-orange-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-slate-100 text-slate-700 rounded-xl">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    {scheduleType === 'scheduled' && (
                      <span className="w-5 h-5 bg-[#ea580c] text-white rounded-full flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Programar Fecha & Hora
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Para trabajos planeados, pintura o remodelaciones.
                  </p>
                </button>
              </div>

              {scheduleType === 'scheduled' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Día del servicio
                    </label>
                    <select
                      value={scheduledDay}
                      onChange={(e) => setScheduledDay(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm"
                    >
                      <option value="Hoy">Hoy mismo</option>
                      <option value="Mañana">Mañana</option>
                      <option value="Sábado">Sábado próximo</option>
                      <option value="Domingo">Domingo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Franja horaria preferida
                    </label>
                    <select
                      value={scheduledSlot}
                      onChange={(e) => setScheduledSlot(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm"
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
              {/* Cost Breakdown */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Diagnóstico y visita técnica en moto:</span>
                  <span className="font-semibold text-slate-800 tabular-nums">
                    ${visitFee.toLocaleString('es-CO')} COP
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Mano de obra estimada ({problemTitle}):</span>
                  <span className="font-semibold text-slate-800 tabular-nums">
                    ${estimatedLabor.toLocaleString('es-CO')} COP
                  </span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>Bono bienvenida "Primer Camello":</span>
                  <span className="font-semibold tabular-nums">
                    -${discountCOP.toLocaleString('es-CO')} COP
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-sm">
                  <span className="font-bold text-slate-900">Total en Custodia:</span>
                  <span className="font-bold text-base text-[#ea580c] font-display tabular-nums">
                    ${totalEstimated.toLocaleString('es-CO')} COP
                  </span>
                </div>
              </div>

              {/* Payment selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Selecciona método de pago (Pago Protegido)
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('nequi')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 cursor-pointer transition-all ${
                      paymentMethod === 'nequi'
                        ? 'border-purple-600 bg-purple-50 text-purple-950 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-purple-600" />
                    <span>Nequi</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('daviplata')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 cursor-pointer transition-all ${
                      paymentMethod === 'daviplata'
                        ? 'border-red-600 bg-red-50 text-red-950 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-red-600" />
                    <span>Daviplata</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pse')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 cursor-pointer transition-all ${
                      paymentMethod === 'pse'
                        ? 'border-blue-600 bg-blue-50 text-blue-950 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>PSE / Banco</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('efectivo')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 cursor-pointer transition-all ${
                      paymentMethod === 'efectivo'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <span>Efectivo al terminar</span>
                  </button>
                </div>
              </div>

              {/* Guarantee micro banner */}
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Garantía Camello:</strong> Tu dinero se mantiene en custodia
                  segura. Solo se desembolsa al maestro cuando tú revises y apruebes la
                  terminación del trabajo.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-1.5 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Atrás</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep((s) => (s + 1) as 2 | 3 | 4)}
              className="px-6 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-[0.98]"
            >
              <span>Continuar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinishBooking}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-[0.98]"
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
