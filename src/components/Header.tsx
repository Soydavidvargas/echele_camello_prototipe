import React from 'react';
import { ShieldCheck, MapPin, Wrench, HardHat, AlertCircle } from 'lucide-react';
import { CityId, CityInfo } from '../types';

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
}) => {
  const selectedCityObj = cities.find((c) => c.id === currentCity) || cities[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top micro bar for quick city switch & emergency alert */}
      <div className="bg-[#0f172a] text-slate-200 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-slate-300">
              Más de 480 técnicos verificados disponibles en {selectedCityObj.name}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* City Selector */}
            <div className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-orange-400" />
              <label htmlFor="city-select" className="sr-only">Ciudad</label>
              <select
                id="city-select"
                value={currentCity}
                onChange={(e) => onSelectCity(e.target.value as CityId)}
                className="bg-[#1e293b] text-slate-100 text-xs py-0.5 px-2 rounded border border-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                {cities.map((city) => (
                  <option key={city.id} value={city.id} className="bg-slate-900 text-white">
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Mode switch button */}
            <button
              onClick={onToggleWorkerMode}
              className="flex items-center gap-1.5 text-xs text-orange-300 hover:text-orange-200 transition-colors font-medium cursor-pointer"
            >
              <HardHat className="w-3.5 h-3.5" />
              <span>{isWorkerMode ? 'Cambiar a Modo Cliente' : 'Soy Técnico (Ofrecer Camello)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectTab('browse')}
              className="text-left group flex items-center gap-2.5 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-[#ea580c] flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:bg-[#c2410c] transition-colors">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-[#0f172a] block font-display leading-tight">
                  Échele Camello
                </span>
                <span className="text-[11px] text-slate-500 font-medium tracking-wide uppercase">
                  Técnicos & Maestros Colombia
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => onSelectTab('browse')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                activeTab === 'browse'
                  ? 'text-[#ea580c] bg-orange-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Buscar Camellos
            </button>

            <button
              onClick={() => onSelectTab('active_jobs')}
              className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'active_jobs'
                  ? 'text-[#ea580c] bg-orange-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>Mi Camello en Curso</span>
              {activeJobsCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-[#ea580c] rounded-full tabular-nums">
                  {activeJobsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectTab('guarantee')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'guarantee'
                  ? 'text-[#ea580c] bg-orange-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Garantía Camello</span>
            </button>

            <button
              onClick={() => onSelectTab('worker_mode')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'worker_mode'
                  ? 'text-[#ea580c] bg-orange-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <HardHat className="w-4 h-4 text-slate-700" />
              <span>Panel del Técnico</span>
            </button>
          </nav>

          {/* Zone 3: Primary action button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenEmergency}
              className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#ea580c] hover:bg-[#c2410c] active:scale-[0.98] transition-all rounded-xl shadow-sm cursor-pointer whitespace-nowrap"
            >
              <AlertCircle className="w-4 h-4 animate-bounce" />
              <span>Urgencia 24/7 (30 min)</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
