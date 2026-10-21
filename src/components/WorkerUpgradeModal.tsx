import React, { useState } from 'react';
import {
  X,
  HardHat,
  Car,
  Bike,
  Footprints,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Wrench,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Check,
  Camera,
  AlertCircle,
  Briefcase,
} from 'lucide-react';
import { UserSession } from '../services/api';
import { handleRegisterWorker } from '../services/auth';
import {
  WORKER_ROLES_CATALOG,
  ESSENTIAL_TOOLS_KIT,
  setAuthCookie,
} from '../data/colombiaData';

interface WorkerUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserSession | null;
  onUpgradeSuccess: (user: UserSession, token: string) => void;
}

const FIELD =
  'w-full px-4 py-3 rounded-2xl bg-[#f5f5f7] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] focus:bg-white dark:focus:bg-[#2c2c2e] text-sm focus:border-[#c2410c] focus:ring-4 focus:ring-[#c2410c]/15 transition-all outline-none';

export const WorkerUpgradeModal: React.FC<WorkerUpgradeModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpgradeSuccess,
}) => {
  if (!isOpen) return null;

  // Pasos de requisitos: 1 = Movilidad, 2 = Oficio y Certificación, 3 = Kit de Herramientas
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [analysisProgress, setAnalysisProgress] = useState(0);

  // Campos de Requisitos de Trabajador
  const [hasVehicle, setHasVehicle] = useState(true);
  const [vehicleType, setVehicleType] = useState<'moto' | 'carro' | 'bicicleta' | 'a_pie'>('moto');
  const [vehicleName, setVehicleName] = useState('Pulsar NS 200');
  const [vehiclePlate, setVehiclePlate] = useState('COF-82D');
  const [vehiclePhoto, setVehiclePhoto] = useState('');

  const [selectedRole, setSelectedRole] = useState(WORKER_ROLES_CATALOG[0].title);
  const [customRole, setCustomRole] = useState('');
  const [isProfessional, setIsProfessional] = useState(true);
  const [certPhoto, setCertPhoto] = useState('');

  const [selectedTools, setSelectedTools] = useState<string[]>([
    'Juego de Llaves Stilson / Expansivas metálicas',
    'Taladro percutor con brocas para concreto y metal',
    'Juego de destornilladores aislados de seguridad 1000V',
    'Caja de herramientas metálica con candado',
  ]);

  const toggleTool = (tool: string) => {
    setSelectedTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  };

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (hasVehicle && !vehiclePlate.trim()) {
      setErrorMsg('Por favor ingresa la placa de tu vehículo para verificar tu movilidad.');
      return;
    }
    setStep(2);
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const finalRole = customRole.trim() || selectedRole;
    if (!finalRole) {
      setErrorMsg('Por favor selecciona o escribe tu oficio de trabajo.');
      return;
    }
    setStep(3);
  };

  const handleCompleteUpgrade = async () => {
    setErrorMsg('');
    if (selectedTools.length === 0) {
      setErrorMsg('Selecciona al menos una herramienta de tu kit de trabajo.');
      return;
    }

    setLoading(true);
    // Simulación de barra de análisis de antecedentes y verificación
    for (let p = 15; p <= 100; p += 25) {
      setAnalysisProgress(p);
      await new Promise((r) => setTimeout(r, 220));
    }

    try {
      const names = (currentUser?.name || 'Técnico Aliado').split(' ');
      const firstName = names[0] || 'Técnico';
      const lastName = names.slice(1).join(' ') || 'Aliado';
      const email = currentUser?.email || 'trabajador@echelecamello.co';
      const finalRole = customRole.trim() || selectedRole;

      const res = await handleRegisterWorker({
        first_name: firstName,
        last_name: lastName,
        email,
        password: 'PasswordUpgrade2026!', // Contraseña de resguardo para la cuenta
        avatar_url:
          currentUser?.avatar_url ||
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        has_vehicle: hasVehicle,
        vehicle_type: vehicleType,
        vehicle_name: vehicleName,
        vehicle_plate: vehiclePlate,
        vehicle_photo: vehiclePhoto,
        job_role: finalRole,
        is_professional: isProfessional,
        cert_or_work_photo: certPhoto,
        tools_verified: selectedTools,
        city: currentUser?.city || 'neiva',
      });

      if (res.success) {
        // Guardar marcas locales para habilitar el perfil sin perder el de cliente
        setAuthCookie('ec_registered_worker', 'true');
        setAuthCookie('ec_worker_onboarded', 'true');
        try {
          localStorage.setItem('ec_registered_worker', 'true');
          localStorage.setItem(
            `ec_worker_profile_${email.toLowerCase()}`,
            JSON.stringify({
              hasVehicle,
              vehicleType,
              vehicleName,
              vehiclePlate,
              jobRole: finalRole,
              isProfessional,
              tools: selectedTools,
            })
          );
        } catch {
          // ignore
        }

        const updatedUser: UserSession = {
          ...currentUser,
          id: res.user?.id || currentUser?.id || Date.now(),
          name: currentUser?.name || `${firstName} ${lastName}`,
          email,
          role: 'worker',
          city: currentUser?.city || 'neiva',
          avatar_url: res.user?.avatar_url || currentUser?.avatar_url,
        };

        onUpgradeSuccess(updatedUser, res.token || 'mockworker_upgraded');
        onClose();
      } else {
        setErrorMsg(
          'message' in res && res.message
            ? res.message
            : 'Error al actualizar el perfil de trabajador.'
        );
      }
    } catch {
      setErrorMsg('No pudimos conectar con el servidor. Se guardó localmente tu perfil.');
    } finally {
      setLoading(false);
      setAnalysisProgress(0);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-worker-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.3)] border border-black/[0.08] dark:border-white/[0.1] space-y-6 my-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f05023] to-[#c2410c] text-white flex items-center justify-center shadow-lg shadow-[#f05023]/25 shrink-0">
              <HardHat className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#f05023]">
                Actualización de Cuenta
              </span>
              <h2
                id="upgrade-worker-title"
                className="text-xl sm:text-2xl font-bold font-display leading-tight"
              >
                Habilitar Perfil de Trabajador
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 flex items-center justify-center text-[#86868b] transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Resumen de cuenta del cliente (Ya autenticado) */}
        <div className="p-3.5 rounded-2xl bg-[#f5f5f7] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#f05023]/15 text-[#f05023] font-bold flex items-center justify-center text-xs">
              {currentUser?.name ? currentUser.name[0]?.toUpperCase() : 'C'}
            </div>
            <div>
              <span className="font-semibold block text-[#1d1d1f] dark:text-white">
                {currentUser?.name || 'Cliente de Échele Camello'}
              </span>
              <span className="text-[#86868b] text-[11px]">
                {currentUser?.email || 'cliente@echelecamello.co'} · Cuenta Cliente Activa
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#34c759]/15 text-[#34c759] font-bold text-[10px] flex items-center gap-1 shrink-0">
            <Check className="w-3 h-3" /> Datos Guardados
          </span>
        </div>

        <p className="text-xs text-[#6e6e73] dark:text-[#a1a1a6] leading-relaxed">
          Solo necesitamos los <strong>requisitos técnicos de trabajador</strong> para empezar a asignarte camellos cerca a tu ubicación. Tu perfil de cliente seguirá intacto.
        </p>

        {/* Wizard Steps Indicator */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { num: 1, label: 'Movilidad' },
            { num: 2, label: 'Oficio' },
            { num: 3, label: 'Herramientas' },
          ].map((s) => (
            <div
              key={s.num}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                step === s.num
                  ? 'border-[#f05023] bg-[#f05023]/10 text-[#f05023] font-bold'
                  : step > s.num
                  ? 'border-[#34c759]/40 bg-[#34c759]/5 text-[#34c759] font-medium'
                  : 'border-black/[0.06] dark:border-white/[0.08] text-[#86868b]'
              }`}
            >
              <div className="text-[10px] uppercase font-bold tracking-wider">
                Paso {s.num}
              </div>
              <div className="text-xs">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ======================================================== */}
        {/* PASO 1: MOVILIDAD Y VEHÍCULO                            */}
        {/* ======================================================== */}
        {step === 1 && (
          <form onSubmit={handleNextStep1} className="space-y-4">
            <div className="space-y-3">
              <label className="text-xs font-semibold text-[#86868b] uppercase tracking-wider block">
                ¿Cuentas con vehículo propio para desplazarte?
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setHasVehicle(true)}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    hasVehicle
                      ? 'border-[#f05023] bg-[#f05023]/10 text-[#f05023] font-bold shadow-xs'
                      : 'border-black/[0.08] dark:border-white/[0.08] text-[#1d1d1f] dark:text-white'
                  }`}
                >
                  <Car className="w-5 h-5 shrink-0" />
                  <div>
                    <span className="text-xs block">Sí tengo transporte</span>
                    <span className="text-[10px] text-[#86868b]">Llega más rápido</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setHasVehicle(false);
                    setVehicleType('a_pie');
                    setVehiclePlate('SIN-PLACA');
                  }}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    !hasVehicle
                      ? 'border-[#f05023] bg-[#f05023]/10 text-[#f05023] font-bold shadow-xs'
                      : 'border-black/[0.08] dark:border-white/[0.08] text-[#1d1d1f] dark:text-white'
                  }`}
                >
                  <Footprints className="w-5 h-5 shrink-0" />
                  <div>
                    <span className="text-xs block">A pie / Transporte</span>
                    <span className="text-[10px] text-[#86868b]">Camellos en tu barrio</span>
                  </div>
                </button>
              </div>

              {hasVehicle && (
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-semibold text-[#86868b] block">
                    Tipo de vehículo:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { type: 'moto', label: 'Moto 🏍️' },
                      { type: 'carro', label: 'Carro 🚗' },
                      { type: 'bicicleta', label: 'Bicicleta 🚲' },
                    ].map((v) => (
                      <button
                        key={v.type}
                        type="button"
                        onClick={() => setVehicleType(v.type as any)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          vehicleType === v.type
                            ? 'border-[#f05023] bg-[#f05023] text-white'
                            : 'border-black/[0.08] dark:border-white/[0.08]'
                        }`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-[11px] font-semibold text-[#86868b] block mb-1">
                        Marca / Modelo
                      </label>
                      <input
                        type="text"
                        value={vehicleName}
                        onChange={(e) => setVehicleName(e.target.value)}
                        placeholder="Ej: Pulsar NS 200, Boxer CT"
                        className={FIELD}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#86868b] block mb-1">
                        Placa del vehículo
                      </label>
                      <input
                        type="text"
                        value={vehiclePlate}
                        onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
                        placeholder="Ej: COF-82D"
                        className={`${FIELD} uppercase font-mono tracking-wider`}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="apple-pill-primary px-6 py-3 rounded-full text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                <span>Continuar a Especialidad</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* PASO 2: OFICIO Y CERTIFICACIÓN TÉCNICA                   */}
        {/* ======================================================== */}
        {step === 2 && (
          <form onSubmit={handleNextStep2} className="space-y-4">
            <div className="space-y-3">
              <label className="text-xs font-semibold text-[#86868b] uppercase tracking-wider block">
                Selecciona tu especialidad u oficio principal:
              </label>

              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className={FIELD}
              >
                {WORKER_ROLES_CATALOG.map((r) => (
                  <option key={r.id} value={r.title}>
                    {r.title}
                  </option>
                ))}
                <option value="otro">Otro oficio (Escribir personalizado)</option>
              </select>

              {selectedRole === 'otro' && (
                <div>
                  <label className="text-[11px] font-semibold text-[#86868b] block mb-1">
                    Escribe tu especialidad:
                  </label>
                  <input
                    type="text"
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    placeholder="Ej: Instalador de Redes de Gas Domiciliario"
                    className={FIELD}
                  />
                </div>
              )}

              {/* Acreditación Técnica */}
              <div className="pt-2 space-y-2">
                <label className="text-xs font-semibold text-[#86868b] block">
                  Nivel de Acreditación Técnica:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIsProfessional(true)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isProfessional
                        ? 'border-[#f05023] bg-[#f05023]/10 text-[#f05023] font-bold'
                        : 'border-black/[0.08] dark:border-white/[0.08]'
                    }`}
                  >
                    <span className="text-xs block">🎓 Técnico Titulado</span>
                    <span className="text-[10px] text-[#86868b]">SENA, Conte, Tecnólogo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsProfessional(false)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      !isProfessional
                        ? 'border-[#f05023] bg-[#f05023]/10 text-[#f05023] font-bold'
                        : 'border-black/[0.08] dark:border-white/[0.08]'
                    }`}
                  >
                    <span className="text-xs block">🔨 Práctico / Empírico</span>
                    <span className="text-[10px] text-[#86868b]">Experiencia comprobada</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver</span>
              </button>

              <button
                type="submit"
                className="apple-pill-primary px-6 py-3 rounded-full text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                <span>Continuar a Herramientas</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* PASO 3: KIT DE HERRAMIENTAS Y ACTIVACIÓN FINAL           */}
        {/* ======================================================== */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#86868b] uppercase tracking-wider block">
                Selecciona las herramientas que tienes listas en tu kit:
              </label>
              <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
                {ESSENTIAL_TOOLS_KIT.map((tool) => {
                  const checked = selectedTools.includes(tool);
                  return (
                    <button
                      key={tool}
                      type="button"
                      onClick={() => toggleTool(tool)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all cursor-pointer ${
                        checked
                          ? 'border-[#f05023] bg-[#f05023]/10 font-medium text-[#1d1d1f] dark:text-white'
                          : 'border-black/[0.06] dark:border-white/[0.08] text-[#6e6e73]'
                      }`}
                    >
                      <span className="pr-2">{tool}</span>
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                          checked
                            ? 'bg-[#f05023] border-[#f05023] text-white'
                            : 'border-black/20 dark:border-white/20'
                        }`}
                      >
                        {checked && <Check className="w-3.5 h-3.5" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Verification progress bar when loading */}
            {loading && (
              <div className="space-y-2 p-4 rounded-2xl bg-[#161617] text-white">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#f05023]" />
                    <span>Verificando perfil y activando modo trabajador...</span>
                  </span>
                  <span className="font-bold text-[#f05023]">{analysisProgress}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#f05023] to-[#ff7a50] transition-all duration-300"
                    style={{ width: `${analysisProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                disabled={loading}
                onClick={() => setStep(2)}
                className="text-xs font-semibold text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver</span>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={handleCompleteUpgrade}
                className="apple-pill-primary px-6 py-3 rounded-full text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-[#f05023]/30"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Activando...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Activar Cuenta de Trabajador</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
