/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, MotionConfig } from 'motion/react';
import { pageEnter, staggerContainer, VIEWPORT_ONCE } from './lib/motion';
import {
  Search,
  Wrench,
  CheckCircle2,
  HardHat,
  ShieldCheck,
  Zap,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  ListFilter,
  Check,
  X,
} from 'lucide-react';
import {
  CITIES,
  CATEGORIES,
  TECHNICIANS as FALLBACK_TECHNICIANS,
  INITIAL_ACTIVE_JOB,
  AVAILABLE_OPPORTUNITIES as FALLBACK_OPPORTUNITIES,
} from './data/mockData';
import { setAuthCookie, getAuthCookie, deleteAuthCookie } from './data/colombiaData';
import {
  CityId,
  CategoryId,
  Technician,
  ServiceTariff,
  ActiveJob,
  JobStatus,
  AvailableOpportunity,
} from './types';
import { Header } from './components/Header';
import { UrgentBanner } from './components/UrgentBanner';
import { CategoryFilter } from './components/CategoryFilter';
import { TechnicianCard } from './components/TechnicianCard';
import { TechnicianDetailModal } from './components/TechnicianDetailModal';
import { BookingFlowModal } from './components/BookingFlowModal';
import { ActiveJobTracker } from './components/ActiveJobTracker';
import { WorkerModeView } from './components/WorkerModeView';
import { GuaranteeModal } from './components/GuaranteeModal';
import { Footer } from './components/Footer';
import { FirstTimeCamelLoader } from './components/FirstTimeCamelLoader';
import { ElCamelloBot } from './components/ElCamelloBot';
import { RoleSwitchFloatingButton } from './components/RoleSwitchFloatingButton';
import { WorkerUpgradeModal } from './components/WorkerUpgradeModal';
import { AuthModal } from './components/AuthModal';
import { Home } from './components/Home';
import { apiService, UserSession } from './services/api';

const gridContainer = staggerContainer(0.12);

const TOKEN_KEY = 'echele_camello_token';
const USER_KEY = 'echele_camello_user';
const VISITED_KEY = 'echele_camello_visited';

export default function App() {
  // 1. First-time visitor 3D Camel check
  const [show3DIntro, setShow3DIntro] = useState<boolean>(() => {
    return !localStorage.getItem(VISITED_KEY);
  });

  // 2. Authentication & Session State with Random Hash Routing
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    try {
      const u = localStorage.getItem(USER_KEY);
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });

  const [sessionToken, setSessionToken] = useState<string>(() => {
    return localStorage.getItem(TOKEN_KEY) || '';
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authDefaultRole, setAuthDefaultRole] = useState<'client' | 'worker'>('client');

  // Landing de marca: se muestra primero salvo que ya exista sesión, cookie o ruta segura
  const [showLanding, setShowLanding] = useState<boolean>(() => {
    const hasRoute = /^#\/(client|worker)\/[a-zA-Z0-9_-]+$/.test(window.location.hash);
    const hasCookie = getAuthCookie('ec_logged_in') === 'true' || !!getAuthCookie('ec_user_session');
    return !hasRoute && !hasCookie && !localStorage.getItem(USER_KEY);
  });

  // Navigation & Location: Recuerda si estaba en trabajador o cliente por cookies
  const [currentCity, setCurrentCity] = useState<CityId>('neiva');
  const [activeTab, setActiveTab] = useState<'browse' | 'active_jobs' | 'worker_mode' | 'guarantee'>(() => {
    const savedMode = getAuthCookie('ec_active_mode') || localStorage.getItem('ec_active_mode');
    if (savedMode === 'worker') return 'worker_mode';
    return 'browse';
  });

  // Search & Filters
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyAvailableNow, setOnlyAvailableNow] = useState(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'price_low' | 'speed'>('recommended');

  // Data from MySQL / API
  const [techniciansList, setTechniciansList] = useState<Technician[]>(FALLBACK_TECHNICIANS);
  const [activeJobs, setActiveJobs] = useState<ActiveJob[]>([INITIAL_ACTIVE_JOB]);
  const [selectedJobId, setSelectedJobId] = useState<string>(INITIAL_ACTIVE_JOB.id);
  const [opportunities, setOpportunities] = useState<AvailableOpportunity[]>(FALLBACK_OPPORTUNITIES);

  // Modals
  const [selectedTechModal, setSelectedTechModal] = useState<Technician | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingTechnician, setBookingTechnician] = useState<Technician | null>(null);
  const [bookingPresetService, setBookingPresetService] = useState<ServiceTariff | null>(null);
  const [isGuaranteeModalOpen, setIsGuaranteeModalOpen] = useState(false);
  const [isWorkerUpgradeModalOpen, setIsWorkerUpgradeModalOpen] = useState(false);
  const [toastNotification, setToastNotification] = useState<{
    title: string;
    message: string;
    type: 'client' | 'worker';
  } | null>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toastNotification) return;
    const timer = setTimeout(() => setToastNotification(null), 5500);
    return () => clearTimeout(timer);
  }, [toastNotification]);

  // City Object
  const currentCityObj = useMemo(() => {
    return CITIES.find((c) => c.id === currentCity) || CITIES[0];
  }, [currentCity]);

  // Load Technicians from MySQL API
  useEffect(() => {
    let isMounted = true;
    apiService.getTechnicians(currentCity).then((res) => {
      if (isMounted && res.success && res.technicians && res.technicians.length > 0) {
        setTechniciansList(res.technicians);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [currentCity]);

  // Load Active Jobs & Worker Radar from MySQL API
  useEffect(() => {
    let isMounted = true;
    apiService.getJobs().then((res) => {
      if (isMounted && res.success && res.jobs && res.jobs.length > 0) {
        setActiveJobs(res.jobs);
        setSelectedJobId(res.jobs[0].id);
      }
    });

    apiService.getWorkerRadar().then((res) => {
      if (isMounted && res.success && res.opportunities && res.opportunities.length > 0) {
        setOpportunities(res.opportunities);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // 3. Ciberseguridad: Verificación de rutas (#/client/<token> o #/worker/<token>) con persistencia de cookies
  useEffect(() => {
    const handleHashRoute = async () => {
      const hash = window.location.hash; // Ej: #/client/mock... o #/worker/mock...
      const match = hash.match(/^#\/(client|worker)\/([a-zA-Z0-9_-]+)$/);

      if (match) {
        const routeRole = match[1] as 'client' | 'worker';
        const routeToken = match[2];
        const currentStoredToken = localStorage.getItem(TOKEN_KEY) || getAuthCookie('ec_user_session');
        const cookieLoggedIn = getAuthCookie('ec_logged_in') === 'true';

        // 1. Si el usuario ya está autenticado (en memoria o con cookies/localStorage) con este token:
        // NO solicitar logueo; sincronizar el modo activo en cookies y vista de inmediato
        if (
          (currentUser && (sessionToken === routeToken || currentStoredToken === routeToken)) ||
          (cookieLoggedIn && currentStoredToken === routeToken)
        ) {
          setSessionToken(routeToken);
          setShowLanding(false);
          setAuthCookie('ec_user_session', routeToken);
          setAuthCookie('ec_active_mode', routeRole);
          setAuthCookie('ec_logged_in', 'true');
          localStorage.setItem('ec_active_mode', routeRole);
          if (routeRole === 'worker') {
            setActiveTab('worker_mode');
          } else {
            setActiveTab('browse');
          }
          return;
        }

        // 2. Si es una recarga limpia, validar token contra MySQL en XAMPP
        const valRes = await apiService.validateSession(routeToken, routeRole);
        if (valRes && valRes.success && valRes.valid) {
          setSessionToken(routeToken);
          setShowLanding(false);
          setCurrentUser(valRes.user);
          localStorage.setItem(TOKEN_KEY, routeToken);
          localStorage.setItem(USER_KEY, JSON.stringify(valRes.user));
          setAuthCookie('ec_user_session', routeToken);
          setAuthCookie('ec_active_mode', routeRole);
          setAuthCookie('ec_user_role', valRes.user.role || routeRole);
          setAuthCookie('ec_logged_in', 'true');
          setAuthCookie(`ec_registered_${valRes.user.role || routeRole}`, 'true');
          localStorage.setItem('ec_active_mode', routeRole);
          if (routeRole === 'worker') {
            setActiveTab('worker_mode');
          } else {
            setActiveTab('browse');
          }
        } else {
          // 3. Fallback: verificar si hay cookies activas o usuario almacenado localmente para no bloquearlo
          const storedUser = localStorage.getItem(USER_KEY);
          if (storedUser && currentStoredToken) {
            try {
              const u = JSON.parse(storedUser);
              setCurrentUser(u);
              setSessionToken(currentStoredToken);
              setShowLanding(false);
              setAuthCookie('ec_user_session', currentStoredToken);
              setAuthCookie('ec_active_mode', routeRole);
              setAuthCookie('ec_logged_in', 'true');
              if (routeRole === 'worker') {
                setActiveTab('worker_mode');
              } else {
                setActiveTab('browse');
              }
              return;
            } catch {
              // ignore
            }
          }

          // Solo si NO existe ninguna sesión auténtica ni cookies:
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          deleteAuthCookie('ec_user_session');
          deleteAuthCookie('ec_active_mode');
          deleteAuthCookie('ec_logged_in');
          setCurrentUser(null);
          setSessionToken('');
          window.location.hash = '';
          setAuthDefaultRole(routeRole);
          setIsAuthModalOpen(true);
        }
      }
    };

    handleHashRoute();
    window.addEventListener('hashchange', handleHashRoute);
    return () => window.removeEventListener('hashchange', handleHashRoute);
  }, [currentUser, sessionToken]);

  // Sync URL hash with secure session token
  useEffect(() => {
    if (sessionToken && currentUser) {
      const rolePrefix = activeTab === 'worker_mode' ? 'worker' : 'client';
      const expectedHash = `#/${rolePrefix}/${sessionToken}`;
      if (window.location.hash !== expectedHash) {
        window.location.hash = expectedHash;
      }
    }
  }, [sessionToken, currentUser, activeTab]);

  // Auth Success Handler: Guarda cookies persistentes de sesión y rol
  const handleLoginSuccess = (user: UserSession, token: string, role: 'client' | 'worker') => {
    setCurrentUser(user);
    setShowLanding(false);
    setSessionToken(token);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem('ec_active_mode', role);

    // Guardar cookies para no volver a pedir login
    setAuthCookie('ec_user_session', token);
    setAuthCookie('ec_active_mode', role);
    setAuthCookie('ec_user_role', role);
    setAuthCookie('ec_logged_in', 'true');
    setAuthCookie(`ec_registered_${role}`, 'true');

    window.location.hash = `#/${role}/${token}`;
    if (role === 'worker') {
      setActiveTab('worker_mode');
    } else {
      setActiveTab('browse');
    }
  };

  // Logout Handler: Limpia localStorage y cookies
  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('ec_active_mode');
    deleteAuthCookie('ec_user_session');
    deleteAuthCookie('ec_active_mode');
    deleteAuthCookie('ec_logged_in');
    deleteAuthCookie('ec_user_role');
    setCurrentUser(null);
    setSessionToken('');
    window.location.hash = '';
    setActiveTab('browse');
    setShowLanding(true);
  };

  // Landing: entrar como cliente o trabajador (requiere login)
  const handleEnterAs = (role: 'client' | 'worker') => {
    if (currentUser) {
      setActiveTab(role === 'worker' ? 'worker_mode' : 'browse');
      setShowLanding(false);
      return;
    }
    setAuthDefaultRole(role);
    setIsAuthModalOpen(true);
  };

  // Comprueba si el usuario ya tiene perfil de trabajador registrado
  const hasWorkerProfile = useMemo(() => {
    if (!currentUser) {
      return (
        getAuthCookie('ec_registered_worker') === 'true' ||
        localStorage.getItem('ec_registered_worker') === 'true'
      );
    }
    if (currentUser.role === 'worker') return true;
    if (getAuthCookie('ec_registered_worker') === 'true') return true;
    if (localStorage.getItem('ec_registered_worker') === 'true') return true;
    if (localStorage.getItem(`ec_worker_profile_${currentUser.email.toLowerCase()}`)) return true;
    return false;
  }, [currentUser]);

  // Cambiar a Modo Cliente desde trabajador: CONSERVA INTACTO el perfil de trabajador y guarda cookies
  const handleSwitchToClient = () => {
    setActiveTab('browse');
    setShowLanding(false);

    // Guardar cookies para mantener la sesión y el modo activo sin volver a pedir login
    setAuthCookie('ec_active_mode', 'client');
    if (sessionToken) {
      setAuthCookie('ec_user_session', sessionToken);
      setAuthCookie('ec_logged_in', 'true');
    }
    setAuthCookie('ec_registered_client', 'true');
    localStorage.setItem('ec_active_mode', 'client');

    setToastNotification({
      title: '🛒 Modo Cliente Activado',
      message: 'Puedes buscar y contratar servicios. Tu perfil de técnico sigue 100% activo y guardado en cookies.',
      type: 'client',
    });
  };

  // Cambiar a Modo Trabajador desde cliente: guarda cookies
  const handleSwitchToWorker = () => {
    if (!currentUser) {
      setAuthDefaultRole('worker');
      setIsAuthModalOpen(true);
      return;
    }

    if (hasWorkerProfile) {
      // Ya tiene perfil completado: cambio instantáneo sin volver a pedir requisitos
      setActiveTab('worker_mode');
      setShowLanding(false);

      // Guardar cookies para mantener la sesión y el modo trabajador sin volver a pedir login
      setAuthCookie('ec_active_mode', 'worker');
      if (sessionToken) {
        setAuthCookie('ec_user_session', sessionToken);
        setAuthCookie('ec_logged_in', 'true');
      }
      setAuthCookie('ec_registered_worker', 'true');
      localStorage.setItem('ec_active_mode', 'worker');

      setToastNotification({
        title: '💼 Panel de Técnico Activado',
        message: '¡Bienvenido de vuelta! Estás listo para recibir solicitudes y aceptar camellos.',
        type: 'worker',
      });
    } else {
      // Es cliente y aún no ha completado los requisitos de técnico: abrir modal de actualización
      setIsWorkerUpgradeModalOpen(true);
    }
  };

  // Callback al completar requisitos de trabajador desde la cuenta de cliente
  const handleWorkerUpgradeSuccess = (upgradedUser: UserSession, token: string) => {
    setCurrentUser(upgradedUser);
    localStorage.setItem(USER_KEY, JSON.stringify(upgradedUser));
    const finalToken = token || sessionToken;
    if (finalToken) {
      setSessionToken(finalToken);
      localStorage.setItem(TOKEN_KEY, finalToken);
      setAuthCookie('ec_user_session', finalToken);
    }

    // Guardar cookies persistentes completas
    setAuthCookie('ec_active_mode', 'worker');
    setAuthCookie('ec_user_role', 'worker');
    setAuthCookie('ec_registered_worker', 'true');
    setAuthCookie('ec_logged_in', 'true');
    localStorage.setItem('ec_active_mode', 'worker');
    localStorage.setItem('ec_registered_worker', 'true');

    setActiveTab('worker_mode');
    setShowLanding(false);
    setToastNotification({
      title: '🎉 ¡Perfil de Trabajador Activado!',
      message: 'Tus requisitos fueron verificados y guardados en cookies. Ahora puedes prestar tus servicios sin perder tu cuenta de cliente.',
      type: 'worker',
    });
  };

  // First time 3D finish
  const handleFinish3D = () => {
    localStorage.setItem(VISITED_KEY, 'true');
    setShow3DIntro(false);
  };

  // Filtered Technicians
  const filteredTechnicians = useMemo(() => {
    let list = techniciansList.filter((t) => t.city === currentCity);

    // Filter by Category
    if (selectedCategory !== 'all') {
      list = list.filter((t) => t.categoryId === selectedCategory);
    }

    // Filter by Online status
    if (onlyAvailableNow) {
      list = list.filter((t) => t.isAvailableNow);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.categoryName.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q) ||
          t.bio.toLowerCase().includes(q) ||
          t.neighborhoods.some((n) => n.toLowerCase().includes(q)) ||
          t.services.some(
            (s) =>
              s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
          )
      );
    }

    // Sort
    if (sortBy === 'price_low') {
      list.sort((a, b) => a.visitFeeCOP - b.visitFeeCOP);
    } else if (sortBy === 'speed') {
      list.sort((a, b) => a.responseTimeMinutes - b.responseTimeMinutes);
    } else {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [currentCity, selectedCategory, onlyAvailableNow, searchQuery, sortBy, techniciansList]);

  // Handler: Open Emergency flow
  const handleOpenEmergency = () => {
    if (!currentUser) {
      setAuthDefaultRole('client');
      setIsAuthModalOpen(true);
      return;
    }
    setBookingTechnician(null);
    setBookingPresetService(null);
    setIsBookingModalOpen(true);
  };

  // Handler: Open Booking from Technician
  const handleOpenBooking = (tech: Technician, presetService?: ServiceTariff) => {
    if (!currentUser) {
      setAuthDefaultRole('client');
      setIsAuthModalOpen(true);
      return;
    }
    setBookingTechnician(tech);
    setBookingPresetService(presetService || null);
    setSelectedTechModal(null);
    setIsBookingModalOpen(true);
  };

  // Handler: New Job created & saved to MySQL
  const handleJobCreated = async (newJob: ActiveJob) => {
    setActiveJobs((prev) => [newJob, ...prev]);
    setSelectedJobId(newJob.id);
    setActiveTab('active_jobs');

    // Persistir en MySQL XAMPP
    try {
      await apiService.createJob({
        id: newJob.id,
        code: newJob.code,
        technician_id: newJob.technician.id,
        category: newJob.category,
        problemTitle: newJob.problemTitle,
        description: newJob.description,
        address: newJob.address,
        city: newJob.city,
        neighborhood: newJob.neighborhood,
        scheduledTime: newJob.scheduledTime,
        estimatedCostCOP: newJob.estimatedCostCOP,
        paymentMethod: newJob.paymentMethod,
      });
    } catch (e) {}
  };

  // Handler: Update active job status in MySQL
  const handleUpdateJobStatus = async (newStatus: JobStatus) => {
    setActiveJobs((prev) =>
      prev.map((j) => (j.id === selectedJobId ? { ...j, status: newStatus } : j))
    );
    try {
      await apiService.updateJobStatus(selectedJobId, newStatus);
    } catch (e) {}
  };

  // Handler: Chat message in active job & MySQL save
  const handleSendMessage = async (jobId: string, text: string) => {
    const newMsg = {
      id: `client-${Date.now()}`,
      sender: 'client' as const,
      text,
      time: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
    };

    setActiveJobs((prev) =>
      prev.map((j) => {
        if (j.id !== jobId) return j;
        return {
          ...j,
          chatMessages: [...j.chatMessages, newMsg],
        };
      })
    );

    // Guardar en MySQL
    try {
      await apiService.sendChatMessage(jobId, 'client', text);
    } catch (e) {}

    // Respuesta simulada del maestro
    setTimeout(async () => {
      const replies = [
        '¡Entendido mi estimado! Ya voy saliendo con las herramientas.',
        'Perfecto, gracias por el aviso. Voy en camino atento al citófono.',
        'Listo vecino, no se preocupe que eso queda garantizado.',
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      const techMsg = {
        id: `tech-${Date.now()}`,
        sender: 'technician' as const,
        text: randomReply,
        time: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      };

      setActiveJobs((prev) =>
        prev.map((j) => {
          if (j.id !== jobId) return j;
          return {
            ...j,
            chatMessages: [...j.chatMessages, techMsg],
          };
        })
      );

      try {
        await apiService.sendChatMessage(jobId, 'technician', randomReply);
      } catch (e) {}
    }, 1400);
  };

  // Handler: Finish and rate job
  const handleFinishJob = async (jobId: string, rating: number, comment: string) => {
    setActiveJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'completado' } : j))
    );
    try {
      await apiService.updateJobStatus(jobId, 'completado');
    } catch (e) {}
  };

  // Handler: Worker accepts opportunity in MySQL
  const handleAcceptOpportunity = async (opp: AvailableOpportunity) => {
    // Remove from local radar
    setOpportunities((prev) => prev.filter((o) => o.id !== opp.id));

    try {
      await apiService.acceptOpportunity(opp.id);
    } catch (e) {}

    // Create active job for worker
    const workerJob: ActiveJob = {
      id: `job-worker-${Date.now()}`,
      code: `CAM-${Math.floor(1000 + Math.random() * 9000)}`,
      technician: techniciansList[0] || FALLBACK_TECHNICIANS[0],
      category: opp.category,
      problemTitle: opp.title,
      description: opp.description,
      address: `Sector ${opp.neighborhood}, ${opp.city}`,
      city: opp.city,
      neighborhood: opp.neighborhood,
      scheduledTime: 'Inmediato (Aceptado por Don Jairo)',
      status: 'en_camino',
      etaMinutes: 15,
      createdAt: 'Aceptado recién',
      estimatedCostCOP: opp.offerCOP,
      paymentMethod: 'nequi',
      isGuaranteeActive: true,
      chatMessages: [
        {
          id: 'worker-start',
          sender: 'system',
          text: `Aceptaste el camello "${opp.title}". El cliente ya fue notificado y te está esperando.`,
          time: 'Ahora',
        },
      ],
    };

    setActiveJobs((prev) => [workerJob, ...prev]);
    setSelectedJobId(workerJob.id);
    setActiveTab('active_jobs');
  };

  const currentActiveJob =
    activeJobs.find((j) => j.id === selectedJobId) || activeJobs[0];

  if (showLanding) {
    return (
      <>
        {show3DIntro && <FirstTimeCamelLoader onFinish={handleFinish3D} />}
        <Home onHire={() => handleEnterAs('client')} onWork={() => handleEnterAs('worker')} />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          defaultRole={authDefaultRole}
        />
      </>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col font-sans pb-20 md:pb-0 transition-colors duration-200 ${
        activeTab === 'worker_mode'
          ? 'bg-[#f4f4f5] dark:bg-[#121214] text-[#18181b] dark:text-[#f4f4f5]'
          : 'bg-slate-50 dark:bg-[#121214] text-[#1d1d1f] dark:text-[#f5f5f7]'
      }`}
    >
      {/* 1. Loading 3D del camello caminando para primerizos */}
      {show3DIntro && <FirstTimeCamelLoader onFinish={handleFinish3D} />}

      {/* 2. Apple Frosted Sticky Header con Accesibilidad & Auth */}
      <Header
        currentCity={currentCity}
        cities={CITIES}
        onSelectCity={setCurrentCity}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        activeJobsCount={activeJobs.filter((j) => j.status !== 'completado').length}
        onOpenEmergency={handleOpenEmergency}
        isWorkerMode={activeTab === 'worker_mode'}
        onToggleWorkerMode={() => {
          if (!currentUser && activeTab !== 'worker_mode') {
            setAuthDefaultRole('worker');
            setIsAuthModalOpen(true);
            return;
          }
          setActiveTab(activeTab === 'worker_mode' ? 'browse' : 'worker_mode');
        }}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onShow3DIntro={() => setShow3DIntro(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-12 w-full">
       <MotionConfig reducedMotion="user">
        <motion.div key={activeTab} {...pageEnter}>
        {/* VIEW 1: BROWSE & EXPLORE CAMELOS (CLIENTE) */}
        {activeTab === 'browse' && (
          <div>
            {/* Urgent 24/7 Emergency Alert Banner */}
            <UrgentBanner
              cityName={currentCityObj.name}
              onOpenEmergency={handleOpenEmergency}
              onFilterUrgent={() => setOnlyAvailableNow(!onlyAvailableNow)}
              isUrgentFiltered={onlyAvailableNow}
            />

            {/* Category Filter Bar */}
            <CategoryFilter
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* Apple Spotlight Style Search & Utility Bar */}
            <div className="bg-white dark:bg-[#1c1c1e] rounded-3xl border border-black/[0.06] dark:border-white/[0.08] p-4 sm:p-5 mb-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5">
              {/* Search input with Apple style */}
              <div className="relative flex-1">
                <label htmlFor="tech-search" className="sr-only">
                  Buscar técnicos
                </label>
                <Search aria-hidden="true" className="w-4 h-4 text-[#6e6e73] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="tech-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar daño, plomero, cerrajero, calentador, barrio..."
                  className="w-full pl-11 pr-16 py-2.5 text-xs sm:text-sm bg-[#f5f5f7] dark:bg-white/[0.06] focus:bg-white dark:focus:bg-[#2c2c2e] border border-black/[0.06] dark:border-white/[0.08] focus:border-[#c2410c] focus:ring-4 focus:ring-[#c2410c]/15 rounded-2xl transition-all outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Limpiar búsqueda"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-[#6e6e73] hover:text-[#1d1d1f] dark:hover:text-white bg-black/[0.04] dark:bg-white/[0.08] px-2 py-0.5 rounded-full cursor-pointer"
                  >
                    Limpiar
                  </button>
                )}
              </div>

              {/* Filters & Sorting */}
              <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                {/* iOS Toggle Switch for "Disponibles Ya" */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={onlyAvailableNow}
                  onClick={() => setOnlyAvailableNow(!onlyAvailableNow)}
                  className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border transition-all cursor-pointer select-none ${
                    onlyAvailableNow
                      ? 'bg-[#34c759]/10 border-[#34c759]/30 text-[#1d1d1f] dark:text-white'
                      : 'bg-white dark:bg-[#2c2c2e] border-black/[0.06] dark:border-white/[0.08] text-[#6e6e73] dark:text-[#a1a1a6] hover:border-black/[0.12]'
                  } apple-press`}
                >
                  {/* Switch */}
                  <span
                    aria-hidden="true"
                    className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                      onlyAvailableNow ? 'bg-[#34c759]' : 'bg-black/[0.15] dark:bg-white/20'
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-xs ${
                        onlyAvailableNow ? 'translate-x-4.5' : 'translate-x-0.5'
                      }`}
                    />
                  </span>
                  <span className="text-xs font-semibold whitespace-nowrap">
                    Disponibles Ya
                  </span>
                </button>

                {/* Apple Sort Selector */}
                <div className="flex items-center gap-1.5 bg-[#f5f5f7] dark:bg-white/[0.06] px-3 py-1.5 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] text-xs text-[#6e6e73] dark:text-[#a1a1a6] shrink-0">
                  <ListFilter className="w-3.5 h-3.5 text-[#6e6e73]" />
                  <label htmlFor="sort-select" className="sr-only">
                    Ordenar
                  </label>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(e.target.value as 'recommended' | 'price_low' | 'speed')
                    }
                    className="bg-transparent text-[#1d1d1f] dark:text-white font-semibold focus:outline-none cursor-pointer text-xs py-0.5"
                  >
                    <option value="recommended">Mejor calificados</option>
                    <option value="speed">Llegada más rápida</option>
                    <option value="price_low">Menor visita técnica</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Quick search tags Apple Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 text-xs text-[#6e6e73] scrollbar-none mb-5 -mx-4 px-4 sm:mx-0 sm:px-0">
              <span className="font-semibold text-[#1d1d1f] dark:text-white shrink-0">
                Frecuentes:
              </span>
              {[
                'Destape tubería',
                'Chapa trancada',
                'Calentador a gas',
                'Fuga de agua',
                'Cortocircuito',
                'Lavadora Samsung',
                'Pintura alcoba',
              ].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSearchQuery(tag)}
                  className="px-3.5 py-1.5 bg-white dark:bg-[#1c1c1e] hover:bg-[#fafafc] dark:hover:bg-[#2c2c2e] border border-black/[0.06] dark:border-white/[0.08] rounded-full text-[#1d1d1f] dark:text-white whitespace-nowrap transition-all cursor-pointer shadow-xs apple-press"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Technician Grid Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#1d1d1f] dark:text-white font-display">
                  Técnicos & Maestros en {currentCityObj.name}
                </h3>
                <p className="text-xs text-[#6e6e73] mt-0.5">
                  Conectado a MySQL XAMPP · {filteredTechnicians.length} profesionales verificados
                </p>
              </div>

              {onlyAvailableNow && (
                <span className="text-xs text-[#248a3d] dark:text-[#34c759] font-semibold bg-[#34c759]/10 px-3 py-1 rounded-full border border-[#34c759]/20 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#34c759] animate-pulse" />
                  <span>En vivo</span>
                </span>
              )}
            </div>

            {/* Technicians Grid */}
            {filteredTechnicians.length > 0 ? (
              <motion.div
                key={`${currentCity}-${selectedCategory}-${sortBy}-${onlyAvailableNow}`}
                variants={gridContainer}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT_ONCE}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
              >
                {filteredTechnicians.map((tech) => (
                  <TechnicianCard
                    key={tech.id}
                    technician={tech}
                    onViewProfile={setSelectedTechModal}
                    onBookTechnician={(t) => handleOpenBooking(t)}
                  />
                ))}
              </motion.div>
            ) : (
              <div className="p-12 text-center bg-white dark:bg-[#1c1c1e] rounded-3xl border border-black/[0.06] dark:border-white/[0.08] shadow-xs space-y-3">
                <Wrench className="w-10 h-10 text-[#6e6e73] mx-auto" />
                <h4 className="text-base font-bold text-[#1d1d1f] dark:text-white font-display">
                  No encontramos técnicos con esos filtros en {currentCityObj.name}
                </h4>
                <p className="text-xs text-[#6e6e73] dark:text-[#a1a1a6] max-w-md mx-auto">
                  Prueba cambiando la categoría, desactivando el filtro de "Disponibles Ya" o limpiando el texto de búsqueda.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setOnlyAvailableNow(false);
                  }}
                  className="apple-pill-primary px-5 py-2 text-xs font-semibold rounded-full cursor-pointer"
                >
                  Restablecer todos los filtros
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: ACTIVE JOB TRACKER */}
        {activeTab === 'active_jobs' && (
          <div>
            {/* Multiple jobs selector if more than 1 */}
            {activeJobs.length > 1 && (
              <div className="mb-5 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                <span className="text-xs font-semibold text-[#6e6e73] uppercase tracking-wider">
                  Tus Camellos:
                </span>
                {activeJobs.map((j) => (
                  <button
                    key={j.id}
                    onClick={() => setSelectedJobId(j.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      j.id === selectedJobId
                        ? 'bg-[#c2410c] text-white shadow-xs'
                        : 'bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-white border border-black/[0.06] dark:border-white/[0.08]'
                    }`}
                  >
                    {j.code} · {j.problemTitle.slice(0, 20)}...
                  </button>
                ))}
              </div>
            )}

            {currentActiveJob ? (
              <ActiveJobTracker
                job={currentActiveJob}
                onUpdateJobStatus={handleUpdateJobStatus}
                onSendMessage={handleSendMessage}
                onFinishJob={handleFinishJob}
                onBackToBrowse={() => setActiveTab('browse')}
              />
            ) : (
              <div className="p-12 text-center bg-white dark:bg-[#1c1c1e] rounded-3xl border border-black/[0.06] dark:border-white/[0.08] shadow-xs space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#6e6e73] mx-auto" />
                <h4 className="text-base font-bold text-[#1d1d1f] dark:text-white">
                  No tienes servicios en curso en este momento
                </h4>
                <p className="text-xs text-[#6e6e73] dark:text-[#a1a1a6]">
                  Puedes buscar un maestro certificado o solicitar una visita de urgencia de inmediato.
                </p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="apple-pill-primary px-5 py-2.5 text-xs font-semibold rounded-full cursor-pointer"
                >
                  Explorar Técnicos
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: WORKER MODE PANEL (TRABAJADOR) */}
        {activeTab === 'worker_mode' && (
          <WorkerModeView
            opportunities={opportunities}
            onAcceptOpportunity={handleAcceptOpportunity}
            onExitWorkerMode={() => setActiveTab('browse')}
            workerName={currentUser?.name || 'Técnico Aliado'}
          />
        )}

        {/* VIEW 4: GUARANTEE HUB */}
        {activeTab === 'guarantee' && (
          <div className="max-w-4xl mx-auto bg-white dark:bg-[#1c1c1e] rounded-3xl p-6 sm:p-10 border border-black/[0.06] dark:border-white/[0.08] shadow-[0_2px_16px_rgba(0,0,0,0.03)] space-y-8">
            <div className="flex items-center gap-4 border-b border-black/[0.06] dark:border-white/[0.08] pb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-[#34c759] to-[#28a745] text-white rounded-2xl flex items-center justify-center shadow-[0_4px_16px_rgba(52,199,89,0.3)] shrink-0">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] dark:text-white font-display">
                  Garantía Camello: Seguridad & Confianza
                </h2>
                <p className="text-sm text-[#6e6e73] dark:text-[#a1a1a6] mt-1">
                  El estándar que protege a las familias y dignifica el trabajo de los maestros en toda Colombia.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-6 rounded-2xl bg-[#f5f5f7] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.06] space-y-2">
                <h4 className="font-bold text-[#1d1d1f] dark:text-white text-base">
                  1. Depósito en Custodia (Escrow)
                </h4>
                <p className="text-xs sm:text-sm text-[#6e6e73] dark:text-[#a1a1a6] leading-relaxed">
                  Cuando solicitas un servicio por Nequi, Daviplata o PSE, el dinero no se le entrega al técnico por adelantado. Queda protegido en la plataforma y solo se libera cuando tú confirmes que todo quedó perfecto.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#f5f5f7] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.06] space-y-2">
                <h4 className="font-bold text-[#1d1d1f] dark:text-white text-base">
                  2. Verificación de Cédula & Antecedentes
                </h4>
                <p className="text-xs sm:text-sm text-[#6e6e73] dark:text-[#a1a1a6] leading-relaxed">
                  Cotejo directo con la Policía Nacional de Colombia, Procuraduría General de la Nación y Contraloría. Ningún técnico ingresa a un hogar sin estar 100% aprobado.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#f5f5f7] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.06] space-y-2">
                <h4 className="font-bold text-[#1d1d1f] dark:text-white text-base">
                  3. Garantía de Mano de Obra de 30 Días
                </h4>
                <p className="text-xs sm:text-sm text-[#6e6e73] dark:text-[#a1a1a6] leading-relaxed">
                  Si un destape de cañería, cambio de grifería, arreglo de chapa o punto eléctrico vuelve a fallar dentro del mes, el técnico regresa sin costo o asignamos a otro especialista de inmediato.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#f5f5f7] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.06] space-y-2">
                <h4 className="font-bold text-[#1d1d1f] dark:text-white text-base">
                  4. Cobertura por Daños hasta $5.000.000 COP
                </h4>
                <p className="text-xs sm:text-sm text-[#6e6e73] dark:text-[#a1a1a6] leading-relaxed">
                  Póliza colectiva contra accidentes locativos o roturas involuntarias de tuberías durante la prestación de la labor.
                </p>
              </div>
            </div>

            <div className="p-6 bg-[#f05023]/5 rounded-3xl border border-[#f05023]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-[#1d1d1f] dark:text-white text-sm sm:text-base">
                  ¿Necesitas un técnico garantizado ahora mismo?
                </h4>
                <p className="text-xs text-[#6e6e73] dark:text-[#a1a1a6] mt-0.5">
                  Escoge un profesional verificado o solicita una visita de urgencia en 30 minutos.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('browse')}
                className="apple-pill-primary px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-full shadow-sm shrink-0 cursor-pointer"
              >
                Buscar Técnicos Verificados
              </button>
            </div>
          </div>
        )}
        </motion.div>
       </MotionConfig>
      </main>

      {/* 2.5 Botón flotante para alternar entre Cliente y Trabajador (Encima del Bot) */}
      <RoleSwitchFloatingButton
        currentTab={activeTab}
        isLoggedIn={!!currentUser}
        currentUserRole={currentUser?.role}
        hasWorkerProfile={hasWorkerProfile}
        onSwitchToWorker={handleSwitchToWorker}
        onSwitchToClient={handleSwitchToClient}
      />

      {/* 3. Floating Action Bot "El Camello" */}
      <ElCamelloBot mode={activeTab === 'worker_mode' ? 'worker' : 'client'} />

      {/* Footer */}
      <Footer
        onOpenGuarantee={() => setIsGuaranteeModalOpen(true)}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setActiveTab('browse');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* MODALS */}
      {/* 1. Technician Detail Profile Modal */}
      <TechnicianDetailModal
        technician={selectedTechModal}
        onClose={() => setSelectedTechModal(null)}
        onBookService={handleOpenBooking}
      />

      {/* 2. Quoting & Booking Flow Wizard */}
      <BookingFlowModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        technician={bookingTechnician}
        presetService={bookingPresetService}
        defaultCategory={bookingTechnician ? bookingTechnician.categoryId : 'plomeria'}
        defaultCityName={currentCityObj.name}
        onJobCreated={handleJobCreated}
      />

      {/* 3. Trust & Guarantee Modal */}
      <GuaranteeModal
        isOpen={isGuaranteeModalOpen}
        onClose={() => setIsGuaranteeModalOpen(false)}
      />

      {/* 4. Secure Authentication Modal (PHPMailer 2FA + MySQL XAMPP) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        defaultRole={authDefaultRole}
      />

      {/* 5. Modal de Actualización a Trabajador (Para clientes que completan requisitos) */}
      <WorkerUpgradeModal
        isOpen={isWorkerUpgradeModalOpen}
        onClose={() => setIsWorkerUpgradeModalOpen(false)}
        currentUser={currentUser}
        onUpgradeSuccess={handleWorkerUpgradeSuccess}
      />

      {/* Notificación flotante de cambio de rol */}
      {toastNotification && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-[90vw] sm:w-auto p-4 rounded-2xl bg-[#161617]/95 dark:bg-[#1c1c1e]/95 text-white shadow-[0_12px_40px_rgba(0,0,0,0.35)] border border-white/[0.12] backdrop-blur-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-sm ${
              toastNotification.type === 'worker'
                ? 'bg-gradient-to-br from-[#f05023] to-[#c2410c]'
                : 'bg-gradient-to-br from-[#0071e3] to-[#005bb5]'
            }`}
          >
            {toastNotification.type === 'worker' ? '🛠️' : '🛒'}
          </div>
          <div className="flex-1 pr-2">
            <h5 className="text-xs font-bold font-display text-white">
              {toastNotification.title}
            </h5>
            <p className="text-[11px] text-[#a1a1a6] mt-0.5 leading-snug">
              {toastNotification.message}
            </p>
          </div>
          <button
            onClick={() => setToastNotification(null)}
            className="text-[#86868b] hover:text-white transition-colors cursor-pointer"
            aria-label="Cerrar notificación"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Mobile iOS Frosted Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 apple-glass dark:bg-[#1c1c1e]/90 border-t border-black/[0.06] dark:border-white/[0.08] px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-4 items-center h-12">
          <button
            onClick={() => setActiveTab('browse')}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
              activeTab === 'browse' ? 'text-[#c2410c] font-bold' : 'text-[#6e6e73]'
            }`}
          >
            <Search className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Explorar</span>
          </button>

          <button
            onClick={() => setActiveTab('active_jobs')}
            className={`min-h-[44px] flex flex-col items-center justify-center relative transition-colors cursor-pointer ${
              activeTab === 'active_jobs' ? 'text-[#c2410c] font-bold' : 'text-[#6e6e73]'
            }`}
          >
            <Wrench className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Mi Camello</span>
            {activeJobs.filter((j) => j.status !== 'completado').length > 0 && (
              <span className="absolute top-1.5 right-5 w-2 h-2 rounded-full bg-[#f05023]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('guarantee')}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
              activeTab === 'guarantee' ? 'text-[#c2410c] font-bold' : 'text-[#6e6e73]'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Garantía</span>
          </button>

          <button
            onClick={() => {
              if (!currentUser && activeTab !== 'worker_mode') {
                setAuthDefaultRole('worker');
                setIsAuthModalOpen(true);
                return;
              }
              setActiveTab('worker_mode');
            }}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
              activeTab === 'worker_mode' ? 'text-[#ff9500] font-bold' : 'text-[#6e6e73]'
            }`}
          >
            <HardHat className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Soy Técnico</span>
          </button>
        </div>
      </div>
    </div>
  );
}
