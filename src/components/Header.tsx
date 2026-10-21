import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  MapPin,
  Wrench,
  HardHat,
  AlertCircle,
  ChevronDown,
  User,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { CityId, CityInfo } from '../types';
import { AccessibilityMenu } from './AccessibilityMenu';
import { UserSession } from '../services/api';

interface HeaderProps {
  currentCity: CityId;
  cities: CityInfo[];
  onSelectCity: (cityId: CityId) => void;
  activeTab: 'browse' | 'active_jobs' | 'worker_mode' | 'guarantee';
  onSelectTab: (tab: 'browse' | 'active_jobs' | 'worker_mode' | 'guarantee') => void;
  activeJobsCount: number;
  onOpenEmergency: () => void;
  isWorkerMode: boolean;
  onToggleWorkerMode: () => void;
  currentUser: UserSession | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onShow3DIntro?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCity,
  cities,
  onSelectCity,
  activeTab,
  onSelectTab,
  activeJobsCount,
  onOpenEmergency,
  isWorkerMode,
  onToggleWorkerMode,
  currentUser,
  onOpenAuth,
  onLogout,
  onShow3DIntro,
}) => {
  const selectedCityObj = cities.find((c) => c.id === currentCity) || cities[0];

  // Sombra y blur más marcados al hacer scroll
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-200">
      {/* Apple Micro Status Bar */}
      <div className="bg-[#161617] text-[#86868b] px-4 py-1.5 text-xs border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34c759] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34c759]"></span>
            </span>
            <span className="font-medium text-[#d2d2d7] text-[11px] sm:text-xs">
              480+ técnicos verificados en{' '}
              <strong className="text-white font-semibold">{selectedCityObj.name}</strong>
            </span>
            {onShow3DIntro && (
              <button
                onClick={onShow3DIntro}
                className="hidden lg:flex items-center gap-1 text-[11px] text-[#ffaa00] hover:underline ml-2 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>Ver Intro 3D</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* City Selector Pill */}
            <div className="relative flex items-center text-xs">
              <label htmlFor="city-select" className="sr-only">
                Seleccionar Ciudad
              </label>
              <div className="flex items-center gap-1.5 bg-white/[0.08] hover:bg-white/[0.14] text-[#f5f5f7] px-2.5 py-1 rounded-full transition-colors cursor-pointer border border-white/[0.06]">
                <MapPin className="w-3 h-3 text-[#c2410c]" />
                <select
                  id="city-select"
                  value={currentCity}
                  onChange={(e) => onSelectCity(e.target.value as CityId)}
                  className="bg-transparent text-white text-[11px] font-medium appearance-none pr-4 focus:outline-none cursor-pointer"
                >
                  {cities.map((city) => (
                    <option key={city.id} value={city.id} className="bg-[#1d1d1f] text-white">
                      {city.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-[#86868b] absolute right-2 pointer-events-none" />
              </div>
            </div>

            {/* Mode switch button */}
            <button
              onClick={onToggleWorkerMode}
              className={`flex items-center gap-1.5 text-[11px] sm:text-xs px-2.5 py-1 rounded-full transition-all cursor-pointer border active:scale-[0.98] ${
                isWorkerMode
                  ? 'bg-[#ff9500]/20 text-[#ffaa00] border-[#ff9500]/40 font-bold'
                  : 'text-[#f5f5f7] hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border-white/[0.06]'
              }`}
            >
              <HardHat className="w-3 h-3 text-[#ff9500]" />
              <span className="hidden sm:inline font-medium">
                {isWorkerMode ? 'Modo Cliente' : 'Soy Técnico'}
              </span>
              <span className="sm:hidden font-medium">
                {isWorkerMode ? 'Cliente' : 'Técnico'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Glassmorphic Navigation Bar */}
      <div className={`apple-glass dark:bg-[#1c1c1e]/90 border-b border-black/[0.06] dark:border-white/[0.08] transition-shadow duration-300 ease-in-out ${scrolled ? 'shadow-[0_8px_30px_rgb(0,0,0,0.08)]' : 'shadow-[0_2px_12px_rgba(0,0,0,0.03)]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Zone 1: Apple Brand Wordmark */}
            <div className="flex items-center">
              <button
                onClick={() => onSelectTab('browse')}
                aria-current={activeTab === 'browse' ? 'page' : undefined}
                className="group flex items-center gap-3 cursor-pointer text-left focus:outline-none"
              >
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md transition-all ${
                    isWorkerMode
                      ? 'bg-gradient-to-b from-[#d97706] to-[#b45309] shadow-amber-500/20'
                      : 'bg-gradient-to-b from-[#c94a10] to-[#9a3412] shadow-orange-500/20'
                  }`}
                >
                  <Wrench className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-[19px] font-bold tracking-tight text-[#1d1d1f] dark:text-white block leading-tight font-display">
                    Échele Camello
                  </span>
                  <span className="text-[10px] text-[#86868b] font-semibold tracking-wider uppercase block">
                    {isWorkerMode ? 'Portal Oficial de Maestros' : 'Técnicos Certificados Colombia'}
                  </span>
                </div>
              </button>
            </div>

            {/* Zone 2: Apple Segmented Pill Navigation */}
            <nav aria-label="Secciones principales" className="hidden md:flex items-center bg-[#000000]/[0.05] dark:bg-white/[0.08] p-1 rounded-full border border-black/[0.04] dark:border-white/[0.06]">
              <button
                onClick={() => onSelectTab('browse')}
                aria-current={activeTab === 'browse' ? 'page' : undefined}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  activeTab === 'browse'
                    ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] scale-[1.01]'
                    : 'text-[#6e6e73] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white'
                }`}
              >
                Explorar Técnicos
              </button>

              <button
                onClick={() => onSelectTab('active_jobs')}
                aria-current={activeTab === 'active_jobs' ? 'page' : undefined}
                className={`relative px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'active_jobs'
                    ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] scale-[1.01]'
                    : 'text-[#6e6e73] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white'
                }`}
              >
                <span>Mi Camello</span>
                {activeJobsCount > 0 && (
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold text-white bg-[#c2410c] rounded-full tabular-nums shadow-xs">
                    {activeJobsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => onSelectTab('guarantee')}
                aria-current={activeTab === 'guarantee' ? 'page' : undefined}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'guarantee'
                    ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] scale-[1.01]'
                    : 'text-[#6e6e73] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#34c759]" />
                <span>Garantía Camello</span>
              </button>

              <button
                onClick={() => onSelectTab('worker_mode')}
                aria-current={activeTab === 'worker_mode' ? 'page' : undefined}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'worker_mode'
                    ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] scale-[1.01]'
                    : 'text-[#6e6e73] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white'
                }`}
              >
                <HardHat className="w-3.5 h-3.5 text-[#ff9500]" />
                <span>Panel Técnico</span>
              </button>
            </nav>

            {/* Zone 3: Accessibility Menu + User Auth + Emergency Button */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Accessibility Dropdown */}
              <AccessibilityMenu />

              {/* User Session Pill or Login Trigger */}
              {currentUser ? (
                <div className="flex items-center gap-1.5 bg-black/[0.05] dark:bg-white/[0.08] px-2.5 py-1 rounded-full text-xs border border-black/[0.06] dark:border-white/[0.08]">
                  <span className="w-2 h-2 rounded-full bg-[#34c759]" />
                  <span className="font-semibold text-[#1d1d1f] dark:text-white max-w-[90px] sm:max-w-[120px] truncate">
                    {currentUser.name}
                  </span>
                  <button
                    onClick={onLogout}
                    title="Cerrar Sesión"
                    className="p-1 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3 h-3 text-[#86868b]" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="px-3.5 py-1.5 bg-white dark:bg-[#2c2c2e] hover:bg-[#fafafc] border border-black/[0.1] dark:border-white/[0.12] text-xs font-semibold rounded-full flex items-center gap-1.5 cursor-pointer shadow-xs apple-press text-[#1d1d1f] dark:text-white"
                >
                  <User className="w-3.5 h-3.5 text-[#c2410c]" />
                  <span>Ingresar</span>
                </button>
              )}

              {/* Urgent CTA Button */}
              <button
                onClick={onOpenEmergency}
                className="apple-pill-primary px-3.5 sm:px-4 py-1.5 text-xs font-semibold rounded-full flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs"
              >
                <AlertCircle className="w-3.5 h-3.5 text-white" />
                <span className="hidden sm:inline">Urgencia 24/7 (30 min)</span>
                <span className="sm:hidden">Urgencia</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
