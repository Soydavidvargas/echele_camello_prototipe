/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
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
} from 'lucide-react';
import {
  CITIES,
  CATEGORIES,
  TECHNICIANS,
  INITIAL_ACTIVE_JOB,
  AVAILABLE_OPPORTUNITIES,
} from './data/mockData';
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

export default function App() {
  // Navigation & Location
  const [currentCity, setCurrentCity] = useState<CityId>('neiva');
  const [activeTab, setActiveTab] = useState<'browse' | 'active_jobs' | 'worker_mode' | 'guarantee'>('browse');

  // Search & Filters
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyAvailableNow, setOnlyAvailableNow] = useState(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'price_low' | 'speed'>('recommended');

  // Active jobs & Opportunities state
  const [activeJobs, setActiveJobs] = useState<ActiveJob[]>([INITIAL_ACTIVE_JOB]);
  const [selectedJobId, setSelectedJobId] = useState<string>(INITIAL_ACTIVE_JOB.id);
  const [opportunities, setOpportunities] = useState<AvailableOpportunity[]>(AVAILABLE_OPPORTUNITIES);

  // Modals
  const [selectedTechModal, setSelectedTechModal] = useState<Technician | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingTechnician, setBookingTechnician] = useState<Technician | null>(null);
  const [bookingPresetService, setBookingPresetService] = useState<ServiceTariff | null>(null);
  const [isGuaranteeModalOpen, setIsGuaranteeModalOpen] = useState(false);

  // City Object
  const currentCityObj = useMemo(() => {
    return CITIES.find((c) => c.id === currentCity) || CITIES[0];
  }, [currentCity]);

  // Filtered Technicians
  const filteredTechnicians = useMemo(() => {
    let list = TECHNICIANS.filter((t) => t.city === currentCity);

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
          t.services.some((s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q))
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
  }, [currentCity, selectedCategory, onlyAvailableNow, searchQuery, sortBy]);

  // Handler: Open Emergency flow
  const handleOpenEmergency = () => {
    setBookingTechnician(null);
    setBookingPresetService(null);
    setIsBookingModalOpen(true);
  };

  // Handler: Open Booking from Technician
  const handleOpenBooking = (tech: Technician, presetService?: ServiceTariff) => {
    setBookingTechnician(tech);
    setBookingPresetService(presetService || null);
    setSelectedTechModal(null);
    setIsBookingModalOpen(true);
  };

  // Handler: New Job created
  const handleJobCreated = (newJob: ActiveJob) => {
    setActiveJobs((prev) => [newJob, ...prev]);
    setSelectedJobId(newJob.id);
    setActiveTab('active_jobs');
  };

  // Handler: Update active job status
  const handleUpdateJobStatus = (newStatus: JobStatus) => {
    setActiveJobs((prev) =>
      prev.map((j) => (j.id === selectedJobId ? { ...j, status: newStatus } : j))
    );
  };

  // Handler: Chat message in active job
  const handleSendMessage = (jobId: string, text: string) => {
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

    // Simulate technician reply after 1.4 seconds
    setTimeout(() => {
      const replies = [
        '¡Entendido mi estimado! Ya casi llego al punto, voy atento.',
        'Perfecto, gracias por el aviso. Llevo la herramienta lista para revisar.',
        'Listo vecino, no se preocupe que eso queda solucionado y garantizado.',
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
    }, 1400);
  };

  // Handler: Finish and rate job
  const handleFinishJob = (jobId: string, rating: number, comment: string) => {
    setActiveJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'completado' } : j))
    );
  };

  // Handler: Worker accepts opportunity
  const handleAcceptOpportunity = (opp: AvailableOpportunity) => {
    // Remove from radar
    setOpportunities((prev) => prev.filter((o) => o.id !== opp.id));

    // Create active job for worker
    const workerJob: ActiveJob = {
      id: `job-worker-${Date.now()}`,
      code: `CAM-${Math.floor(1000 + Math.random() * 9000)}`,
      technician: TECHNICIANS[0],
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

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col font-sans pb-16 md:pb-0">
      {/* Universal Header with Top Bar Contract */}
      <Header
        currentCity={currentCity}
        cities={CITIES}
        onSelectCity={setCurrentCity}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        activeJobsCount={activeJobs.filter((j) => j.status !== 'completado').length}
        onOpenEmergency={handleOpenEmergency}
        isWorkerMode={activeTab === 'worker_mode'}
        onToggleWorkerMode={() =>
          setActiveTab(activeTab === 'worker_mode' ? 'browse' : 'worker_mode')
        }
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full">
        {/* VIEW 1: BROWSE & EXPLORE CAMELOS */}
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

            {/* Search & Utility Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar daño, plomero, cerrajero, calentador, barrio..."
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                  >
                    Limpiar
                  </button>
                )}
              </div>

              {/* Filters & Sorting */}
              <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
                {/* Available now toggle */}
                <button
                  onClick={() => setOnlyAvailableNow(!onlyAvailableNow)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                    onlyAvailableNow
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-500/10'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      onlyAvailableNow ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
                    }`}
                  />
                  <span>Disponibles Ya</span>
                </button>

                {/* Sort selector */}
                <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200 text-xs text-slate-600 shrink-0">
                  <ListFilter className="w-3.5 h-3.5 text-slate-500" />
                  <label htmlFor="sort-select" className="sr-only">Ordenar</label>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(e.target.value as 'recommended' | 'price_low' | 'speed')
                    }
                    className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer text-xs py-1"
                  >
                    <option value="recommended">Mejor calificados</option>
                    <option value="speed">Llegada más rápida</option>
                    <option value="price_low">Menor visita técnica</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Quick search tags */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 text-xs text-slate-500 scrollbar-none mb-4">
              <span className="font-semibold text-slate-700 shrink-0">Búsquedas frecuentes:</span>
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
                  onClick={() => setSearchQuery(tag)}
                  className="px-2.5 py-1 bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 rounded-lg text-slate-600 hover:text-orange-700 whitespace-nowrap transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Technician Grid Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Técnicos & Maestros en {currentCityObj.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Mostrando {filteredTechnicians.length} profesionales verificados con antecedentes al día
                </p>
              </div>

              {onlyAvailableNow && (
                <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  ● Filtro "En vivo" activo
                </span>
              )}
            </div>

            {/* Technicians Grid */}
            {filteredTechnicians.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredTechnicians.map((tech) => (
                  <TechnicianCard
                    key={tech.id}
                    technician={tech}
                    onViewProfile={setSelectedTechModal}
                    onBookTechnician={(t) => handleOpenBooking(t)}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
                <Wrench className="w-10 h-10 text-slate-400 mx-auto" />
                <h4 className="text-base font-bold text-slate-800 font-display">
                  No encontramos técnicos con esos filtros en {currentCityObj.name}
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Prueba cambiando la categoría, desactivando el filtro de "Disponibles Ya" o limpiando el texto de búsqueda.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setOnlyAvailableNow(false);
                  }}
                  className="px-4 py-2 bg-[#ea580c] text-white text-xs font-semibold rounded-xl hover:bg-[#c2410c] transition-colors cursor-pointer"
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
              <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase">
                  Tus Camellos:
                </span>
                {activeJobs.map((j) => (
                  <button
                    key={j.id}
                    onClick={() => setSelectedJobId(j.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      j.id === selectedJobId
                        ? 'bg-[#ea580c] text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200'
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
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-slate-400 mx-auto" />
                <h4 className="text-base font-bold text-slate-800">
                  No tienes servicios en curso en este momento
                </h4>
                <p className="text-xs text-slate-500">
                  Puedes buscar un maestro o solicitar una visita de urgencia de inmediato.
                </p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="px-4 py-2 bg-[#ea580c] text-white text-xs font-bold rounded-xl"
                >
                  Explorar Técnicos
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: WORKER MODE PANEL */}
        {activeTab === 'worker_mode' && (
          <WorkerModeView
            opportunities={opportunities}
            onAcceptOpportunity={handleAcceptOpportunity}
            onExitWorkerMode={() => setActiveTab('browse')}
          />
        )}

        {/* VIEW 4: GUARANTEE HUB */}
        {activeTab === 'guarantee' && (
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
              <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-600/20">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 font-display">
                  Garantía Camello: Seguridad & Confianza
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  El estándar que protege a las familias y dignifica a los maestros de obra en toda Colombia.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-[#f8fafc] border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-base">
                  1. Depósito en Custodia (Escrow)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Cuando solicitas un servicio por Nequi, Daviplata o PSE, el dinero no se le entrega al técnico antes de tiempo. Queda protegido en la plataforma y solo se libera cuando tú firmes digitalmente tu conformidad.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#f8fafc] border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-base">
                  2. Verificación de Cédula & Antecedentes
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Cotejo directo con la Policía Nacional de Colombia, Procuraduría General de la Nación y Contraloría. Ningún técnico ingresa a un hogar sin estar 100% aprobado.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#f8fafc] border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-base">
                  3. Garantía de Mano de Obra de 30 Días
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Si un destape de cañería, cambio de grifería, arreglo de chapa o punto eléctrico vuelve a fallar dentro del mes, el técnico regresa sin costo o asignamos a otro especialista de inmediato.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#f8fafc] border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-base">
                  4. Cobertura por Daños hasta $5.000.000 COP
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Póliza colectiva contra accidentes locativos o roturas involuntarias de tuberías durante la prestación de la labor.
                </p>
              </div>
            </div>

            <div className="p-6 bg-orange-50 rounded-2xl border border-orange-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  ¿Necesitas un técnico con Garantía ahora mismo?
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Escoge un profesional o solicita una visita de urgencia de 30 minutos.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('browse')}
                className="px-6 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0"
              >
                Buscar Técnicos Verificados
              </button>
            </div>
          </div>
        )}
      </main>

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

      {/* Mobile Persistent Bottom Tab Bar (Touch Pattern 1 - min-h-[48px], hitboxes >= 44px) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg">
        <div className="grid grid-cols-4 items-center h-12">
          <button
            onClick={() => setActiveTab('browse')}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
              activeTab === 'browse' ? 'text-[#ea580c] font-bold' : 'text-slate-500'
            }`}
          >
            <Search className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Explorar</span>
          </button>

          <button
            onClick={() => setActiveTab('active_jobs')}
            className={`min-h-[44px] flex flex-col items-center justify-center relative transition-colors cursor-pointer ${
              activeTab === 'active_jobs' ? 'text-[#ea580c] font-bold' : 'text-slate-500'
            }`}
          >
            <Wrench className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Mi Camello</span>
            {activeJobs.filter((j) => j.status !== 'completado').length > 0 && (
              <span className="absolute top-1 right-5 w-2 h-2 rounded-full bg-[#ea580c]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('guarantee')}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
              activeTab === 'guarantee' ? 'text-[#ea580c] font-bold' : 'text-slate-500'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Garantía</span>
          </button>

          <button
            onClick={() => setActiveTab('worker_mode')}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
              activeTab === 'worker_mode' ? 'text-[#ea580c] font-bold' : 'text-slate-500'
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
