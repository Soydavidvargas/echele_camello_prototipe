import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
  HardHat,
  User,
  MapPin,
  Camera,
  Car,
  Bike,
  Footprints,
  ShieldCheck,
  Sparkles,
  Wrench,
  CheckCircle2,
  Navigation,
  Loader2,
  FileText,
  Briefcase,
  HelpCircle,
  Globe,
  Radio,
  KeyRound,
  Timer,
  RefreshCw,
} from 'lucide-react';
import { UserSession } from '../services/api';
import {
  handleLogin,
  handleRegisterClient,
  handleRegisterWorker,
  handleRequestPasswordRecovery,
  handleResetPassword,
  hasUserRegistered,
  Role,
} from '../services/auth';
import { UserRole } from '../types';
import {
  COLOMBIA_REGIONS,
  COMMON_NEIGHBORHOODS,
  SERVICES_CATALOG,
  LANGUAGES,
  HOW_HEARD_OPTIONS,
  SERVICE_FREQUENCY_OPTIONS,
  PAYMENT_PREFERENCES,
  WORKER_ROLES_CATALOG,
  ESSENTIAL_TOOLS_KIT,
  setAuthCookie,
} from '../data/colombiaData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (session: UserSession, token: string, role: UserRole) => void;
  defaultRole?: UserRole;
}

const FIELD =
  'w-full pl-10 pr-4 py-3 rounded-2xl bg-[#f5f5f7] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] focus:bg-white dark:focus:bg-[#2c2c2e] text-sm focus:border-[#c2410c] focus:ring-4 focus:ring-[#c2410c]/15 transition-all outline-none';

const FIELD_NO_ICON =
  'w-full px-4 py-3 rounded-2xl bg-[#f5f5f7] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] focus:bg-white dark:focus:bg-[#2c2c2e] text-sm focus:border-[#c2410c] focus:ring-4 focus:ring-[#c2410c]/15 transition-all outline-none';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  defaultRole = 'client',
}) => {
  const [activeRole, setActiveRole] = useState<Role>(defaultRole as Role);
  // Modos: 'login' | 'register' | 'recovery'
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'recovery'>('register');

  // Estado general de formulario
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Paso actual en el wizard de registro
  const [clientStep, setClientStep] = useState<1 | 2 | 3>(1);
  const [workerStep, setWorkerStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // --- Campos Comunes (Login & Registro) ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // --- Recuperación de Contraseña con Código de 5 Minutos ---
  const [recoveryStep, setRecoveryStep] = useState<1 | 2>(1);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(300); // 5 minutos = 300 segundos
  const [timerActive, setTimerActive] = useState(false);

  // --- Captcha Matemático ---
  const [captchaNum1, setCaptchaNum1] = useState(4);
  const [captchaNum2, setCaptchaNum2] = useState(3);
  const [captchaAnswer, setCaptchaAnswer] = useState('');

  // --- Campos de Cliente (Onboarding) ---
  const [selectedServices, setSelectedServices] = useState<string[]>(['plomeria', 'electricidad', 'cerrajeria']);
  const [selectedLanguage, setSelectedLanguage] = useState('Español (Predeterminado)');
  const [department, setDepartment] = useState('Huila');
  const [city, setCity] = useState('Neiva');
  const [neighborhood, setNeighborhood] = useState('Quirinal');
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoCoordinates, setGeoCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [geoStatusText, setGeoStatusText] = useState('');
  const [howHeard, setHowHeard] = useState('📱 Redes Sociales (TikTok, Instagram, Facebook)');
  const [serviceFrequency, setServiceFrequency] = useState('Solo cuando ocurre una emergencia imprevista');
  const [preferredPayment, setPreferredPayment] = useState('nequi_daviplata');

  // --- Campos de Trabajador ---
  const [hasVehicle, setHasVehicle] = useState(true);
  const [vehicleType, setVehicleType] = useState<'moto' | 'carro' | 'bicicleta' | 'a_pie'>('moto');
  const [vehicleName, setVehicleName] = useState('Pulsar NS 200');
  const [vehiclePlate, setVehiclePlate] = useState('COF-82D');
  const [vehiclePhoto, setVehiclePhoto] = useState('');
  const [selectedWorkerRole, setSelectedWorkerRole] = useState('Plomero & Redes Hidrosanitarias');
  const [customWorkerRole, setCustomWorkerRole] = useState('');
  const [isProfessional, setIsProfessional] = useState(true);
  const [certOrWorkPhoto, setCertOrWorkPhoto] = useState('');
  const [selectedTools, setSelectedTools] = useState<string[]>([
    'Juego de Llaves Stilson / Expansivas metálicas',
    'Taladro percutor con brocas para concreto y metal',
    'Juego de destornilladores aislados de seguridad 1000V',
    'Caja de herramientas metálica con candado',
  ]);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const emailInputRef = useRef<HTMLInputElement>(null);

  // Contador regresivo en tiempo real de 5 minutos (300s)
  useEffect(() => {
    let interval: any = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds <= 0 && timerActive) {
      setTimerActive(false);
      setErrorMsg('El código de 5 minutos ha expirado. Por favor solicita uno nuevo.');
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  // Formato MM:SS
  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Reiniciar estado cada vez que se abre el modal
  useEffect(() => {
    if (isOpen) {
      const currentRole = (defaultRole === 'worker' ? 'worker' : 'client') as Role;
      setActiveRole(currentRole);

      // Comprobar si ya se registró por primera vez
      const isRegistered = hasUserRegistered(currentRole);
      setAuthMode(isRegistered ? 'login' : 'register');

      setClientStep(1);
      setWorkerStep(1);
      setRecoveryStep(1);
      setTimerActive(false);
      setTimerSeconds(300);
      setErrorMsg('');
      setSuccessMsg('');
      setLoading(false);
      setAnalysisProgress(0);

      // Generar nuevo captcha
      const n1 = Math.floor(Math.random() * 8) + 2;
      const n2 = Math.floor(Math.random() * 8) + 1;
      setCaptchaNum1(n1);
      setCaptchaNum2(n2);
      setCaptchaAnswer('');

      setTimeout(() => emailInputRef.current?.focus(), 60);
    }
  }, [isOpen, defaultRole]);

  // Cerrar con tecla Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Toggle de servicios para cliente
  const toggleService = (serviceId: string) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter((s) => s !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  // Toggle de herramientas para trabajador
  const toggleTool = (tool: string) => {
    if (selectedTools.includes(tool)) {
      setSelectedTools(selectedTools.filter((t) => t !== tool));
    } else {
      setSelectedTools([...selectedTools, tool]);
    }
  };

  // Geolocalización automática
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatusText('Tu navegador no soporta geolocalización.');
      return;
    }
    setGeoLoading(true);
    setGeoStatusText('Solicitando permiso al dispositivo...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setGeoCoordinates({ lat: latitude, lng: longitude });
        setGeoLoading(false);
        setGeoStatusText(`¡Ubicación detectada! (Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)})`);
        setDepartment('Huila');
        setCity('Neiva');
        setNeighborhood('Ubicación GPS detectada');
      },
      () => {
        setGeoLoading(false);
        setGeoStatusText('No se otorgó permiso de ubicación. Puedes elegir manualmente tus opciones abajo.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Carga de imágenes
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setter(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Validación de Captcha
  const validateCaptcha = () => {
    if (parseInt(captchaAnswer, 10) !== captchaNum1 + captchaNum2) {
      setErrorMsg(`Por favor resuelve correctamente la suma de seguridad (${captchaNum1} + ${captchaNum2}).`);
      return false;
    }
    return true;
  };

  // -------------------------------------------------------------
  // ENVÍO: INICIO DE SESIÓN
  // -------------------------------------------------------------
  const onLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await handleLogin(email, password, activeRole);
      if (res.success) {
        onLoginSuccess(res.user, res.token, res.role);
        onClose();
      } else {
        setErrorMsg('message' in res && res.message ? res.message : 'Error al iniciar sesión.');
      }
    } catch {
      setErrorMsg('No pudimos conectar con el servidor. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // ENVÍO: RECUPERACIÓN DE CONTRASEÑA (PHPMAILER 5 MINUTOS)
  // -------------------------------------------------------------
  const onRequestRecoveryCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!recoveryEmail || !recoveryEmail.includes('@')) {
      setErrorMsg('Por favor ingresa un correo electrónico válido.');
      return;
    }
    setLoading(true);
    try {
      const res = await handleRequestPasswordRecovery(recoveryEmail);
      if (res.success) {
        setRecoveryStep(2);
        setTimerSeconds(res.expires_in_seconds || 300);
        setTimerActive(true);
        setSuccessMsg(res.message);
      } else {
        setErrorMsg(res.message);
      }
    } catch {
      setErrorMsg('No pudimos procesar tu solicitud. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const onResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!recoveryCode.trim()) {
      setErrorMsg('Por favor ingresa el código de 6 dígitos que enviamos a tu correo.');
      return;
    }
    if (timerSeconds <= 0) {
      setErrorMsg('El código ha expirado porque pasaron más de 5 minutos. Solicita uno nuevo.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMsg('Las contraseñas no coinciden. Verifica e intenta de nuevo.');
      return;
    }

    setLoading(true);
    try {
      const res = await handleResetPassword(recoveryEmail, recoveryCode, newPassword);
      if (res.success) {
        setSuccessMsg(res.message);
        setTimerActive(false);
        setPassword('');
        setEmail(recoveryEmail);
        setTimeout(() => {
          setAuthMode('login');
          setRecoveryStep(1);
          setRecoveryCode('');
          setNewPassword('');
          setConfirmNewPassword('');
          setSuccessMsg('¡Contraseña restablecida! Ahora ingresa con tu nueva contraseña.');
        }, 1200);
      } else {
        setErrorMsg(res.message);
      }
    } catch {
      setErrorMsg('No pudimos actualizar la contraseña. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // ENVÍO: REGISTRO DE CLIENTE
  // -------------------------------------------------------------
  const onClientStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!firstName.trim() || !lastName.trim()) {
      setErrorMsg('Por favor ingresa tu nombre y apellido completos.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Por favor ingresa un correo electrónico válido.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (!validateCaptcha()) return;

    setClientStep(2);
  };

  const onClientCompleteRegistration = async () => {
    setErrorMsg('');
    if (selectedServices.length < 3) {
      setErrorMsg('Por favor selecciona al menos 3 servicios de tu interés.');
      return;
    }
    setLoading(true);
    try {
      const res = await handleRegisterClient({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        avatar_url: avatarUrl || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
        services_interested: selectedServices,
        language: selectedLanguage,
        department,
        city,
        neighborhood,
        geolocation_lat: geoCoordinates?.lat ?? null,
        geolocation_lng: geoCoordinates?.lng ?? null,
        how_heard: howHeard,
        service_frequency: serviceFrequency,
        preferred_payment: preferredPayment,
      });

      if (res.success) {
        setAuthCookie('ec_client_onboarded', 'true');
        setSuccessMsg('¡Registro completado! Bienvenido a Échele Camello.');
        setTimeout(() => {
          onLoginSuccess(res.user, res.token, 'client');
          onClose();
        }, 800);
      } else {
        setErrorMsg('message' in res && res.message ? res.message : 'Error al completar el registro.');
      }
    } catch {
      setErrorMsg('Ocurrió un error al guardar tus datos. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // ENVÍO: REGISTRO DE TRABAJADOR
  // -------------------------------------------------------------
  const onWorkerStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!firstName.trim() || !lastName.trim()) {
      setErrorMsg('Por favor ingresa tu nombre y apellido.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Ingresa un correo electrónico válido.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (!validateCaptcha()) return;

    setWorkerStep(2);
  };

  const onWorkerStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (hasVehicle && !vehiclePlate.trim()) {
      setErrorMsg('Por favor ingresa la placa de tu vehículo para verificar tu movilidad.');
      return;
    }
    setWorkerStep(3);
  };

  const onWorkerStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const finalRole = customWorkerRole.trim() || selectedWorkerRole;
    if (!finalRole) {
      setErrorMsg('Selecciona el rol u oficio en el que trabajas.');
      return;
    }
    setWorkerStep(4);
  };

  const onWorkerStep4Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setWorkerStep(5);
  };

  const onWorkerStep5Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (selectedTools.length === 0) {
      setErrorMsg('Selecciona al menos una herramienta de tu kit de trabajo.');
      return;
    }
    setWorkerStep(6);
    startWorkerAnalysis();
  };

  const startWorkerAnalysis = async () => {
    setLoading(true);
    for (let i = 10; i <= 100; i += 20) {
      await wait(350);
      setAnalysisProgress(i);
    }

    try {
      const finalRole = customWorkerRole.trim() || selectedWorkerRole;
      const res = await handleRegisterWorker({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        avatar_url: avatarUrl || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80`,
        has_vehicle: hasVehicle,
        vehicle_type: vehicleType,
        vehicle_name: vehicleName,
        vehicle_plate: vehiclePlate,
        vehicle_photo: vehiclePhoto,
        job_role: finalRole,
        is_professional: isProfessional,
        cert_or_work_photo: certOrWorkPhoto,
        tools_verified: selectedTools,
        city,
      });

      if (res.success) {
        setAuthCookie('ec_worker_onboarded', 'true');
        await wait(600);
        onLoginSuccess(res.user, res.token, 'worker');
        onClose();
      } else {
        setErrorMsg('message' in res && res.message ? res.message : 'Error al registrar perfil.');
      }
    } catch {
      setErrorMsg('Ocurrió un error en el registro. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const isClient = activeRole === 'client';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xl overflow-y-auto">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-white rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-[0_24px_64px_rgba(0,0,0,0.3)] border border-black/[0.08] dark:border-white/[0.1] space-y-5 my-auto max-h-[92vh] flex flex-col"
      >
        {/* Cabecera del Modal */}
        <div className="flex items-start justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="w-12 h-12 rounded-2xl bg-[#c2410c] flex items-center justify-center text-white shadow-lg shadow-orange-900/25 shrink-0"
            >
              {authMode === 'recovery' ? (
                <KeyRound className="w-6 h-6" />
              ) : isClient ? (
                <User className="w-6 h-6" />
              ) : (
                <HardHat className="w-6 h-6" />
              )}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-[#c2410c] dark:text-orange-400">
                  {authMode === 'recovery' ? 'Seguridad & Acceso' : isClient ? 'Modo Contratar' : 'Modo Trabajar'}
                </span>
                {authMode === 'register' && (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                    Primera vez
                  </span>
                )}
                {authMode === 'recovery' && (
                  <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Timer className="w-3 h-3" />
                    <span>Código 5 min</span>
                  </span>
                )}
              </div>
              <h2 id="auth-modal-title" className="text-xl sm:text-2xl font-extrabold font-display tracking-tight mt-0.5">
                {authMode === 'recovery'
                  ? 'Recuperar Contraseña'
                  : authMode === 'login'
                  ? 'Iniciar Sesión'
                  : isClient
                  ? 'Registro de Cliente'
                  : 'Registro de Técnico / Trabajador'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="w-9 h-9 shrink-0 rounded-full bg-black/[0.05] dark:bg-white/[0.1] text-[#6e6e73] hover:text-[#1d1d1f] dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Pestañas de Cambio de Modo (Iniciar Sesión vs Registrarse) */}
        {authMode !== 'recovery' && (
          <div className="flex p-1 bg-[#f5f5f7] dark:bg-white/[0.06] rounded-2xl shrink-0">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white shadow-xs'
                  : 'text-[#6e6e73] dark:text-[#a1a1a6] hover:text-[#1d1d1f]'
              }`}
            >
              Ya tengo cuenta (Iniciar Sesión)
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                authMode === 'register'
                  ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white shadow-xs'
                  : 'text-[#6e6e73] dark:text-[#a1a1a6] hover:text-[#1d1d1f]'
              }`}
            >
              Soy nuevo (Registrarme)
            </button>
          </div>
        )}

        {/* Notificaciones de error o éxito */}
        {errorMsg && (
          <div
            role="alert"
            className="p-3 bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 text-xs sm:text-sm rounded-2xl flex items-start gap-2 shrink-0"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div
            role="status"
            className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs sm:text-sm rounded-2xl flex items-center gap-2 shrink-0"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ============================================================== */}
        {/* VISTA 1: INICIAR SESIÓN                                        */}
        {/* ============================================================== */}
        {authMode === 'login' && (
          <form onSubmit={onLoginSubmit} className="space-y-4 overflow-y-auto pr-1 flex-1" noValidate>
            <p className="text-xs sm:text-sm text-[#6e6e73] dark:text-[#a1a1a6]">
              {isClient
                ? 'Ingresa con tu correo registrado para contactar técnicos verificados en Neiva y toda Colombia.'
                : 'Ingresa para gestionar tus solicitudes de trabajo y ver tus ganancias protegidas.'}
            </p>

            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold text-[#6e6e73] dark:text-[#a1a1a6] mb-1.5">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#6e6e73] absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
                <input
                  id="login-email"
                  ref={emailInputRef}
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className={FIELD}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="block text-xs font-semibold text-[#6e6e73] dark:text-[#a1a1a6]">
                  Contraseña
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('recovery');
                    setRecoveryStep(1);
                    setRecoveryEmail(email);
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="text-xs text-[#c2410c] dark:text-orange-400 hover:underline font-semibold cursor-pointer"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#6e6e73] absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={FIELD}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-[#c2410c] text-white hover:bg-[#9a3412] text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-orange-900/20 transition-all disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verificando credenciales...</span>
                  </>
                ) : (
                  <>
                    <span>Ingresar a mi cuenta</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className="text-xs text-[#c2410c] hover:underline font-semibold"
              >
                ¿No tienes cuenta todavía? Regístrate aquí
              </button>
            </div>
          </form>
        )}

        {/* ============================================================== */}
        {/* VISTA 4: RECUPERACIÓN DE CONTRASEÑA (PHPMAILER 5 MINUTOS)      */}
        {/* ============================================================== */}
        {authMode === 'recovery' && (
          <div className="space-y-4 overflow-y-auto pr-1 flex-1">
            {recoveryStep === 1 ? (
              <form onSubmit={onRequestRecoveryCode} className="space-y-4" noValidate>
                <div className="p-3.5 bg-orange-50 dark:bg-orange-950/30 rounded-2xl border border-orange-200 dark:border-orange-900/40 space-y-1">
                  <span className="text-xs font-bold text-[#c2410c] dark:text-orange-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Recuperación Segura por Correo</span>
                  </span>
                  <p className="text-xs text-[#6e6e73] dark:text-[#a1a1a6] leading-relaxed">
                    Ingresa el correo de tu cuenta. Te enviaremos un código de seguridad de 6 dígitos mediante PHPMailer.
                    Por seguridad cibernética, el código <strong>se eliminará automáticamente en 5 minutos</strong>.
                  </p>
                </div>

                <div>
                  <label htmlFor="recovery-email" className="block text-xs font-semibold text-[#6e6e73] dark:text-[#a1a1a6] mb-1.5">
                    Correo electrónico registrado
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#6e6e73] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="recovery-email"
                      type="email"
                      required
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      placeholder="tu@correo.com"
                      className={FIELD}
                    />
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    disabled={loading || !recoveryEmail}
                    className="w-full py-3.5 rounded-full bg-[#c2410c] text-white hover:bg-[#9a3412] text-sm font-semibold flex items-center justify-center gap-2 shadow-md shadow-orange-900/20 disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Enviando código por PHPMailer...</span>
                      </>
                    ) : (
                      <>
                        <span>Enviar código de recuperación (5 min)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="w-full py-2.5 text-xs text-[#6e6e73] hover:text-[#1d1d1f] font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Volver a Iniciar Sesión</span>
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={onResetPasswordSubmit} className="space-y-4" noValidate>
                {/* Caja de Alerta con Temporizador Regresivo de 5 minutos */}
                <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-900/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                      <Timer className="w-4 h-4" />
                      <span>Tiempo restante del código:</span>
                    </span>
                    <span
                      className={`text-sm font-extrabold px-2.5 py-0.5 rounded-full tabular-nums ${
                        timerSeconds < 60
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-amber-500/20 text-amber-900 dark:text-amber-200'
                      }`}
                    >
                      {formatTimer(timerSeconds)}
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">
                    Hemos enviado el código a <strong>{recoveryEmail}</strong>. Tienes 5 minutos antes de que el código expire. Revisa tu bandeja de entrada o carpeta de spam.
                  </p>
                </div>

                <div>
                  <label htmlFor="recovery-code" className="block text-xs font-semibold text-[#6e6e73] mb-1.5">
                    Código de seguridad de 6 dígitos
                  </label>
                  <input
                    id="recovery-code"
                    type="text"
                    required
                    maxLength={6}
                    value={recoveryCode}
                    onChange={(e) => setRecoveryCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className={`${FIELD_NO_ICON} text-center font-mono tracking-widest text-lg font-bold`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="new-password" className="block text-xs font-semibold text-[#6e6e73] mb-1">
                      Nueva Contraseña
                    </label>
                    <input
                      id="new-password"
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className={FIELD_NO_ICON}
                    />
                  </div>

                  <div>
                    <label htmlFor="confirm-password" className="block text-xs font-semibold text-[#6e6e73] mb-1">
                      Confirmar Contraseña
                    </label>
                    <input
                      id="confirm-password"
                      type="password"
                      required
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Repite la contraseña"
                      className={FIELD_NO_ICON}
                    />
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    disabled={loading || timerSeconds <= 0}
                    className="w-full py-3.5 rounded-full bg-[#c2410c] text-white hover:bg-[#9a3412] text-sm font-semibold flex items-center justify-center gap-2 shadow-md shadow-orange-900/20 disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Actualizando contraseña en MySQL...</span>
                      </>
                    ) : (
                      <>
                        <span>Restablecer Contraseña e Iniciar Sesión</span>
                        <Check className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      disabled={loading}
                      onClick={onRequestRecoveryCode}
                      className="text-[#c2410c] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reenviar código nuevo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('login');
                        setErrorMsg('');
                        setSuccessMsg('');
                      }}
                      className="text-[#6e6e73] hover:text-[#1d1d1f] font-semibold cursor-pointer"
                    >
                      Volver a Iniciar Sesión
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* VISTA 2: REGISTRO DE CLIENTE (CONTRATAR)                       */}
        {/* ============================================================== */}
        {authMode === 'register' && isClient && (
          <div className="space-y-4 overflow-y-auto pr-1 flex-1">
            {/* Indicador de Pasos Cliente */}
            <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    clientStep === 1 ? 'bg-[#c2410c] text-white' : 'bg-emerald-500 text-white'
                  }`}
                >
                  {clientStep > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}
                </span>
                <span className="text-xs font-semibold">Datos Básicos</span>
              </div>
              <div className="w-8 h-px bg-black/[0.1] dark:bg-white/[0.1]" />
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    clientStep === 2
                      ? 'bg-[#c2410c] text-white'
                      : clientStep > 2
                      ? 'bg-emerald-500 text-white'
                      : 'bg-black/[0.1] dark:bg-white/[0.1] text-[#6e6e73]'
                  }`}
                >
                  2
                </span>
                <span className="text-xs font-semibold">Encuesta & Preferencias</span>
              </div>
            </div>

            {/* PASO 1 CLIENTE: Datos Personales, Foto y Captcha */}
            {clientStep === 1 && (
              <form onSubmit={onClientStep1Submit} className="space-y-4" noValidate>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#6e6e73] dark:text-[#a1a1a6] mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Ej: Laura"
                      className={FIELD_NO_ICON}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#6e6e73] dark:text-[#a1a1a6] mb-1">
                      Apellido
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Ej: Gómez"
                      className={FIELD_NO_ICON}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6e6e73] dark:text-[#a1a1a6] mb-1">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#6e6e73] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@correo.com"
                      className={FIELD}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6e6e73] dark:text-[#a1a1a6] mb-1">
                    Contraseña segura (se encriptará en MySQL)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#6e6e73] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className={FIELD}
                    />
                  </div>
                </div>

                {/* Subir foto de perfil */}
                <div>
                  <label className="block text-xs font-semibold text-[#6e6e73] dark:text-[#a1a1a6] mb-1">
                    Foto de perfil (opcional)
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 dark:bg-white/10 flex items-center justify-center border border-black/[0.08]">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Foto de perfil" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-6 h-6 text-[#6e6e73]" />
                      )}
                    </div>
                    <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-[#f5f5f7] dark:bg-white/[0.06] hover:bg-[#e8e8ed] text-xs font-medium border border-black/[0.08] flex items-center gap-2">
                      <Camera className="w-3.5 h-3.5 text-[#c2410c]" />
                      <span>Subir foto</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, setAvatarUrl)}
                      />
                    </label>
                  </div>
                </div>

                {/* Captcha anti-bots */}
                <div className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded-2xl border border-orange-200 dark:border-orange-900/40">
                  <span className="block text-xs font-bold text-[#c2410c] dark:text-orange-400 mb-1">
                    Verificación Humana (Captcha Anti-Bot):
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-extrabold text-[#1d1d1f] dark:text-white bg-white dark:bg-[#2c2c2e] px-3 py-1.5 rounded-xl border border-orange-200">
                      ¿Cuánto es {captchaNum1} + {captchaNum2}?
                    </span>
                    <input
                      type="number"
                      required
                      value={captchaAnswer}
                      onChange={(e) => setCaptchaAnswer(e.target.value)}
                      placeholder="Respuesta"
                      className="w-28 px-3 py-1.5 rounded-xl border border-orange-300 dark:border-orange-800 bg-white dark:bg-[#1c1c1e] text-sm focus:outline-none focus:ring-2 focus:ring-[#c2410c]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#c2410c] text-white hover:bg-[#9a3412] text-sm font-semibold flex items-center justify-center gap-2 shadow-md shadow-orange-900/20 cursor-pointer"
                >
                  <span>Continuar a Encuesta y Preferencias</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* PASO 2 CLIENTE: Encuesta de Onboarding */}
            {clientStep === 2 && (
              <div className="space-y-5">
                {/* 1. Servicios de Interés (Botones Flotantes - Mínimo 3) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-[#1d1d1f] dark:text-white flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-[#c2410c]" />
                      <span>¿Qué servicios te interesan?</span>
                    </label>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        selectedServices.length >= 3
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                          : 'bg-orange-100 dark:bg-orange-950/60 text-[#c2410c]'
                      }`}
                    >
                      {selectedServices.length} de 3 mínimo
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1">
                    {SERVICES_CATALOG.map((serv) => {
                      const isSelected = selectedServices.includes(serv.id);
                      return (
                        <button
                          key={serv.id}
                          type="button"
                          onClick={() => toggleService(serv.id)}
                          className={`px-3 py-2 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-[#c2410c] text-white border-[#c2410c] shadow-sm scale-102'
                              : 'bg-[#f5f5f7] dark:bg-white/[0.06] text-[#1d1d1f] dark:text-white border-black/[0.06] hover:bg-orange-50 dark:hover:bg-white/10'
                          }`}
                        >
                          <span>{serv.emoji}</span>
                          <span>{serv.name}</span>
                          {isSelected && <Check className="w-3 h-3 ml-0.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Idioma que hablas */}
                <div>
                  <label className="block text-xs font-bold text-[#1d1d1f] dark:text-white mb-1.5 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#c2410c]" />
                    <span>¿Qué idioma hablas?</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.id}
                        type="button"
                        onClick={() => setSelectedLanguage(lang.label)}
                        className={`p-2 rounded-xl text-xs font-medium text-left border transition-all cursor-pointer ${
                          selectedLanguage === lang.label
                            ? 'bg-[#c2410c]/10 text-[#c2410c] border-[#c2410c] font-bold'
                            : 'bg-[#f5f5f7] dark:bg-white/[0.06] border-black/[0.06] text-[#6e6e73]'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. De dónde eres (3 selectores O GPS) */}
                <div className="space-y-2 p-3 bg-[#f5f5f7] dark:bg-white/[0.04] rounded-2xl border border-black/[0.06]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1d1d1f] dark:text-white flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#c2410c]" />
                      <span>¿De dónde eres? (Colombia)</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      disabled={geoLoading}
                      className="text-[11px] font-bold text-[#c2410c] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {geoLoading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Navigation className="w-3 h-3" />
                      )}
                      <span>Detectar con GPS</span>
                    </button>
                  </div>

                  {geoStatusText && (
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      {geoStatusText}
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <span className="text-[10px] font-semibold text-[#6e6e73] block mb-0.5">Departamento</span>
                      <select
                        value={department}
                        onChange={(e) => {
                          setDepartment(e.target.value);
                          const firstCity = COLOMBIA_REGIONS[e.target.value]?.[0] || 'Ciudad';
                          setCity(firstCity);
                        }}
                        className="w-full text-xs p-2 rounded-xl bg-white dark:bg-[#2c2c2e] border border-black/[0.08] outline-none"
                      >
                        {Object.keys(COLOMBIA_REGIONS).map((dep) => (
                          <option key={dep} value={dep}>
                            {dep}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold text-[#6e6e73] block mb-0.5">Ciudad / Pueblo</span>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full text-xs p-2 rounded-xl bg-white dark:bg-[#2c2c2e] border border-black/[0.08] outline-none"
                      >
                        {(COLOMBIA_REGIONS[department] || ['Neiva']).map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold text-[#6e6e73] block mb-0.5">Barrio / Comuna</span>
                      <input
                        type="text"
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        placeholder="Ej: Quirinal"
                        className="w-full text-xs p-2 rounded-xl bg-white dark:bg-[#2c2c2e] border border-black/[0.08] outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Cómo se enteró de la app */}
                <div>
                  <label className="block text-xs font-bold text-[#1d1d1f] dark:text-white mb-1.5 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-[#c2410c]" />
                    <span>¿Cómo te enteraste de Échele Camello?</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {HOW_HEARD_OPTIONS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setHowHeard(item.label)}
                        className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                          howHeard === item.label
                            ? 'bg-[#c2410c]/10 text-[#c2410c] border-[#c2410c] font-bold'
                            : 'bg-[#f5f5f7] dark:bg-white/[0.06] border-black/[0.06] text-[#6e6e73]'
                        }`}
                      >
                        <span className="text-xs block font-semibold">{item.label}</span>
                        <span className="text-[10px] text-[#8e8e93] block">{item.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Preguntas extra: Frecuencia y Método de pago */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-[#6e6e73] mb-1">
                      ¿Frecuencia de servicios?
                    </label>
                    <select
                      value={serviceFrequency}
                      onChange={(e) => setServiceFrequency(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl bg-[#f5f5f7] dark:bg-white/[0.06] border border-black/[0.08] outline-none"
                    >
                      {SERVICE_FREQUENCY_OPTIONS.map((freq) => (
                        <option key={freq} value={freq}>
                          {freq}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#6e6e73] mb-1">
                      ¿Método de pago preferido?
                    </label>
                    <select
                      value={preferredPayment}
                      onChange={(e) => setPreferredPayment(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl bg-[#f5f5f7] dark:bg-white/[0.06] border border-black/[0.08] outline-none"
                    >
                      {PAYMENT_PREFERENCES.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Botones de Navegación del Paso 2 */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setClientStep(1)}
                    className="py-3 px-4 rounded-full border border-black/[0.1] text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:bg-black/5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Atrás</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClientCompleteRegistration}
                    disabled={loading || selectedServices.length < 3}
                    className="flex-1 py-3.5 rounded-full bg-[#c2410c] text-white hover:bg-[#9a3412] text-sm font-semibold flex items-center justify-center gap-2 shadow-md shadow-orange-900/20 disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Guardando encriptado en XAMPP...</span>
                      </>
                    ) : (
                      <>
                        <span>Finalizar Registro e Ingresar</span>
                        <Check className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* VISTA 3: REGISTRO DE TRABAJADOR / TÉCNICO (TRABAJAR)           */}
        {/* ============================================================== */}
        {authMode === 'register' && !isClient && (
          <div className="space-y-4 overflow-y-auto pr-1 flex-1">
            {/* Indicador de progreso de trabajador */}
            <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.08] pb-2 text-xs font-semibold">
              <span className="text-[#c2410c]">Paso {workerStep} de 6</span>
              <span className="text-[#6e6e73]">
                {workerStep === 1 && 'Datos Personales'}
                {workerStep === 2 && 'Transporte & Vehículo'}
                {workerStep === 3 && 'Oficio / Rol Laboral'}
                {workerStep === 4 && 'Evidencias y Certificado'}
                {workerStep === 5 && 'Kit de Herramientas'}
                {workerStep === 6 && 'Análisis y Validación'}
              </span>
            </div>

            {/* PASO 1 TRABAJADOR: Datos Básicos */}
            {workerStep === 1 && (
              <form onSubmit={onWorkerStep1Submit} className="space-y-3.5" noValidate>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#6e6e73] mb-1">Nombre</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Ej: Orlando"
                      className={FIELD_NO_ICON}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#6e6e73] mb-1">Apellido</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Ej: Tovar"
                      className={FIELD_NO_ICON}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6e6e73] mb-1">Correo electrónico</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#6e6e73] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="orlando@trabajador.com"
                      className={FIELD}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6e6e73] mb-1">
                    Contraseña (encriptada con bcrypt en MySQL)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#6e6e73] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className={FIELD}
                    />
                  </div>
                </div>

                {/* Subir foto de perfil de técnico */}
                <div>
                  <label className="block text-xs font-semibold text-[#6e6e73] mb-1">Foto de Perfil Profesional</label>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 dark:bg-white/10 flex items-center justify-center border border-black/[0.08]">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Foto de perfil" className="w-full h-full object-cover" />
                      ) : (
                        <HardHat className="w-6 h-6 text-[#6e6e73]" />
                      )}
                    </div>
                    <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-[#f5f5f7] dark:bg-white/[0.06] hover:bg-[#e8e8ed] text-xs font-medium border border-black/[0.08] flex items-center gap-2">
                      <Camera className="w-3.5 h-3.5 text-[#c2410c]" />
                      <span>Subir foto con rostro</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, setAvatarUrl)}
                      />
                    </label>
                  </div>
                </div>

                {/* Captcha anti-bots */}
                <div className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded-2xl border border-orange-200">
                  <span className="block text-xs font-bold text-[#c2410c] mb-1">
                    Seguridad: Resuelve la suma ({captchaNum1} + {captchaNum2})
                  </span>
                  <input
                    type="number"
                    required
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                    placeholder="Resultado"
                    className="w-full px-3 py-2 rounded-xl border border-orange-300 bg-white dark:bg-[#1c1c1e] text-sm outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#c2410c] text-white hover:bg-[#9a3412] text-sm font-semibold flex items-center justify-center gap-2 shadow-md shadow-orange-900/20 cursor-pointer"
                >
                  <span>Continuar a Vehículo y Movilidad</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* PASO 2 TRABAJADOR: Vehículo & Transporte */}
            {workerStep === 2 && (
              <form onSubmit={onWorkerStep2Submit} className="space-y-4" noValidate>
                <div>
                  <label className="block text-xs font-bold text-[#1d1d1f] dark:text-white mb-2">
                    ¿Cuentas con vehículo para atender emergencias a domicilio?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setHasVehicle(true)}
                      className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        hasVehicle
                          ? 'bg-[#c2410c] text-white border-[#c2410c]'
                          : 'bg-[#f5f5f7] dark:bg-white/[0.06] border-black/[0.08]'
                      }`}
                    >
                      <Bike className="w-4 h-4" />
                      <span>Sí, tengo vehículo</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasVehicle(false)}
                      className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        !hasVehicle
                          ? 'bg-[#c2410c] text-white border-[#c2410c]'
                          : 'bg-[#f5f5f7] dark:bg-white/[0.06] border-black/[0.08]'
                      }`}
                    >
                      <Footprints className="w-4 h-4" />
                      <span>A pie / Bus público</span>
                    </button>
                  </div>
                </div>

                {hasVehicle && (
                  <div className="space-y-3 p-3.5 bg-[#f5f5f7] dark:bg-white/[0.04] rounded-2xl border border-black/[0.06]">
                    <div>
                      <span className="text-xs font-semibold block mb-1">Tipo de vehículo:</span>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'moto', label: 'Moto', icon: Bike },
                          { id: 'carro', label: 'Carro', icon: Car },
                          { id: 'bicicleta', label: 'Bicicleta', icon: Bike },
                        ].map((v) => (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => setVehicleType(v.id as any)}
                            className={`p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border cursor-pointer ${
                              vehicleType === v.id
                                ? 'bg-[#c2410c] text-white border-[#c2410c]'
                                : 'bg-white dark:bg-[#2c2c2e] border-black/[0.08]'
                            }`}
                          >
                            <v.icon className="w-3.5 h-3.5" />
                            <span>{v.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-[#6e6e73] mb-1">Marca / Modelo</label>
                        <input
                          type="text"
                          value={vehicleName}
                          onChange={(e) => setVehicleName(e.target.value)}
                          placeholder="Ej: Boxer CT 100"
                          className={FIELD_NO_ICON}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#6e6e73] mb-1">Número de Placa</label>
                        <input
                          type="text"
                          value={vehiclePlate}
                          onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
                          placeholder="Ej: COF-82D"
                          className={`${FIELD_NO_ICON} uppercase font-bold tracking-wider`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#6e6e73] mb-1">Foto del Vehículo (opcional)</label>
                      <label className="cursor-pointer px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#2c2c2e] text-xs font-medium border border-black/[0.08] flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Camera className="w-4 h-4 text-[#c2410c]" />
                          <span>{vehiclePhoto ? 'Foto cargada ✓' : 'Subir foto del vehículo'}</span>
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, setVehiclePhoto)}
                        />
                      </label>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setWorkerStep(1)}
                    className="py-3 px-4 rounded-full border border-black/[0.1] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Atrás</span>
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 rounded-full bg-[#c2410c] text-white hover:bg-[#9a3412] text-sm font-semibold flex items-center justify-center gap-2 shadow-md shadow-orange-900/20 cursor-pointer"
                  >
                    <span>Continuar a Especialidad y Rol</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* PASO 3 TRABAJADOR: Rol & Oficio */}
            {workerStep === 3 && (
              <form onSubmit={onWorkerStep3Submit} className="space-y-4" noValidate>
                <div>
                  <label className="block text-xs font-bold text-[#1d1d1f] dark:text-white mb-1.5">
                    ¿Qué rol u oficio ejerces? (Recomendados frecuentes en la app):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                    {WORKER_ROLES_CATALOG.map((r) => {
                      const isSelected = selectedWorkerRole === r.title;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => {
                            setSelectedWorkerRole(r.title);
                            setCustomWorkerRole('');
                          }}
                          className={`p-2.5 rounded-xl text-left border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#c2410c] text-white border-[#c2410c] shadow-xs'
                              : 'bg-[#f5f5f7] dark:bg-white/[0.06] border-black/[0.06] hover:bg-orange-50'
                          }`}
                        >
                          <span>{r.title}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6e6e73] mb-1">
                    O escribe tu oficio personalizado si no está en la lista:
                  </label>
                  <input
                    type="text"
                    value={customWorkerRole}
                    onChange={(e) => {
                      setCustomWorkerRole(e.target.value);
                      if (e.target.value) setSelectedWorkerRole('');
                    }}
                    placeholder="Ej: Técnico en Portones Eléctricos"
                    className={FIELD_NO_ICON}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setWorkerStep(2)}
                    className="py-3 px-4 rounded-full border border-black/[0.1] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Atrás</span>
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 rounded-full bg-[#c2410c] text-white hover:bg-[#9a3412] text-sm font-semibold flex items-center justify-center gap-2 shadow-md shadow-orange-900/20 cursor-pointer"
                  >
                    <span>Continuar a Evidencias / Certificado</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* PASO 4 TRABAJADOR: Modalidad & Evidencias */}
            {workerStep === 4 && (
              <form onSubmit={onWorkerStep4Submit} className="space-y-4" noValidate>
                <div>
                  <label className="block text-xs font-bold text-[#1d1d1f] dark:text-white mb-2">
                    Modalidad y Acreditación de tu Trabajo:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsProfessional(true)}
                      className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                        isProfessional
                          ? 'bg-[#c2410c]/10 border-[#c2410c] text-[#c2410c]'
                          : 'bg-[#f5f5f7] dark:bg-white/[0.06] border-black/[0.08]'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-xs mb-1">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Técnico Certificado</span>
                      </div>
                      <p className="text-[11px] text-[#6e6e73]">
                        Cuento con título o certificación del SENA, Conte, ACIEM o tarjeta profesional.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsProfessional(false)}
                      className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                        !isProfessional
                          ? 'bg-[#c2410c]/10 border-[#c2410c] text-[#c2410c]'
                          : 'bg-[#f5f5f7] dark:bg-white/[0.06] border-black/[0.08]'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-xs mb-1">
                        <Wrench className="w-4 h-4" />
                        <span>Trabajador Empírico</span>
                      </div>
                      <p className="text-[11px] text-[#6e6e73]">
                        He aprendido con la práctica y tengo experiencia comprobable en trabajos previos.
                      </p>
                    </button>
                  </div>
                </div>

                <div className="p-3.5 bg-[#f5f5f7] dark:bg-white/[0.04] rounded-2xl border border-black/[0.06] space-y-2">
                  <span className="text-xs font-bold text-[#1d1d1f] dark:text-white block">
                    {isProfessional
                      ? 'Subir Foto de tu Certificado / Tarjeta Profesional'
                      : 'Subir Foto de Trabajos Realizados (Evidencia visual)'}
                  </span>
                  <p className="text-[11px] text-[#6e6e73]">
                    {isProfessional
                      ? 'Sube una foto clara de tu diploma o carné para otorgarte la insignia de Técnico Verificado.'
                      : 'Sube fotos de antes y después de alguna reparación o instalación para demostrar tu calidad.'}
                  </p>

                  <label className="cursor-pointer px-4 py-3 rounded-xl bg-white dark:bg-[#2c2c2e] text-xs font-medium border border-black/[0.08] flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#c2410c]" />
                      <span>{certOrWorkPhoto ? 'Archivo adjuntado con éxito ✓' : 'Seleccionar comprobante o foto'}</span>
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, setCertOrWorkPhoto)}
                    />
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setWorkerStep(3)}
                    className="py-3 px-4 rounded-full border border-black/[0.1] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Atrás</span>
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 rounded-full bg-[#c2410c] text-white hover:bg-[#9a3412] text-sm font-semibold flex items-center justify-center gap-2 shadow-md shadow-orange-900/20 cursor-pointer"
                  >
                    <span>Continuar a Kit de Herramientas</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* PASO 5 TRABAJADOR: Kit de Herramientas / Items Metales */}
            {workerStep === 5 && (
              <form onSubmit={onWorkerStep5Submit} className="space-y-4" noValidate>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-[#1d1d1f] dark:text-white flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-[#c2410c]" />
                      <span>Verificación de Herramientas (Items de Trabajo):</span>
                    </label>
                    <span className="text-[11px] font-bold text-[#c2410c]">
                      {selectedTools.length} seleccionadas
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6e6e73] mb-2">
                    Marca las herramientas con las que cuentas para garantizar a los clientes que puedes realizar los trabajos:
                  </p>
                  <div className="space-y-1.5 max-h-52 overflow-y-auto p-1">
                    {ESSENTIAL_TOOLS_KIT.map((tool) => {
                      const isSelected = selectedTools.includes(tool);
                      return (
                        <button
                          key={tool}
                          type="button"
                          onClick={() => toggleTool(tool)}
                          className={`w-full p-2.5 rounded-xl text-left border text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#c2410c]/10 text-[#c2410c] border-[#c2410c] font-semibold'
                              : 'bg-[#f5f5f7] dark:bg-white/[0.06] border-black/[0.06] text-[#6e6e73]'
                          }`}
                        >
                          <span>{tool}</span>
                          <span
                            className={`w-4 h-4 rounded-md border flex items-center justify-center text-xs ${
                              isSelected ? 'bg-[#c2410c] text-white border-[#c2410c]' : 'border-black/[0.2]'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setWorkerStep(4)}
                    className="py-3 px-4 rounded-full border border-black/[0.1] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Atrás</span>
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 rounded-full bg-[#c2410c] text-white hover:bg-[#9a3412] text-sm font-semibold flex items-center justify-center gap-2 shadow-md shadow-orange-900/20 cursor-pointer"
                  >
                    <span>Analizar y Validar Mi Perfil</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* PASO 6 TRABAJADOR: Análisis y Validación de Perfil */}
            {workerStep === 6 && (
              <div className="py-6 text-center space-y-4">
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 border-orange-200 dark:border-orange-950/60 animate-ping opacity-30" />
                  <div className="w-20 h-20 rounded-full bg-[#c2410c] text-white flex items-center justify-center shadow-xl shadow-orange-900/30">
                    <Sparkles className="w-10 h-10 animate-pulse" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-extrabold text-[#1d1d1f] dark:text-white">
                    Analizando y Verificando Perfil
                  </h3>
                  <p className="text-xs text-[#6e6e73] max-w-sm mx-auto mt-1">
                    Estamos validando tus credenciales encriptadas en la base de datos MySQL de XAMPP y asignando tu bono de bienvenida.
                  </p>
                </div>

                {/* Barra de progreso */}
                <div className="w-full bg-[#f5f5f7] dark:bg-white/[0.08] h-3 rounded-full overflow-hidden border border-black/[0.06]">
                  <div
                    className="bg-[#c2410c] h-full transition-all duration-300 rounded-full"
                    style={{ width: `${analysisProgress}%` }}
                  />
                </div>

                <div className="text-xs font-semibold text-[#c2410c] flex items-center justify-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>
                    {analysisProgress < 40
                      ? 'Encriptando datos y contraseña con bcrypt...'
                      : analysisProgress < 80
                      ? 'Comprobando kit de herramientas y placa...'
                      : '¡Acreditando $100.000 COP en tu billetera virtual!'}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
