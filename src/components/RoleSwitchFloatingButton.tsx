import React, { useState } from 'react';
import { HardHat, User, Sparkles, ArrowRight, ShieldCheck, Wrench, Check } from 'lucide-react';

interface RoleSwitchFloatingButtonProps {
  currentTab: 'browse' | 'active_jobs' | 'worker_mode' | 'guarantee';
  isLoggedIn: boolean;
  currentUserRole?: 'client' | 'worker' | 'admin';
  hasWorkerProfile: boolean;
  isWorkerMode?: boolean;
  onSwitchToWorker: () => void;
  onSwitchToClient: () => void;
}

export const RoleSwitchFloatingButton: React.FC<RoleSwitchFloatingButtonProps> = ({
  currentTab,
  isLoggedIn: _isLoggedIn,
  currentUserRole: _currentUserRole,
  hasWorkerProfile,
  isWorkerMode,
  onSwitchToWorker,
  onSwitchToClient,
}) => {
  const isWorkerTab = isWorkerMode !== undefined ? isWorkerMode : currentTab === 'worker_mode';
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="fixed bottom-[140px] md:bottom-[78px] right-5 z-40 flex flex-col items-end pointer-events-auto"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Tooltip informativo flotante */}
      {showTooltip && (
        <div className="mb-2 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#161617]/95 text-white text-[11px] shadow-xl border border-white/[0.1] backdrop-blur-md animate-in fade-in slide-in-from-bottom-1 duration-150 max-w-xs text-right">
          <span className="text-[#a1a1a6]">
            {isWorkerTab
              ? 'Pasa a contratar servicios como cliente. Tu perfil de técnico permanece 100% guardado.'
              : hasWorkerProfile
              ? 'Volver a tu panel de técnico y recibir solicitudes de camello.'
              : 'Completa los requisitos de técnico para empezar a trabajar con esta cuenta.'}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#f05023] shrink-0" />
        </div>
      )}

      {/* Botón flotante según el modo actual */}
      {isWorkerTab ? (
        // MODO TRABAJADOR ACTIVO -> BOTÓN PARA IR A CONTRATAR COMO CLIENTE
        <button
          onClick={onSwitchToClient}
          className="group relative flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-2.5 bg-gradient-to-r from-[#1c1c1e] to-[#2c2c2e] text-white rounded-full shadow-[0_8px_25px_rgba(0,113,227,0.25)] border border-[#0071e3]/40 hover:border-[#0071e3] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          aria-label="Ir a contratar a alguien como cliente"
          title="Ir a contratar a alguien como cliente (tu perfil de técnico se conserva intacto)"
        >
          {/* Avatar icono cliente */}
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0071e3] to-[#005bb5] flex items-center justify-center text-white shadow-xs">
            <User className="w-3.5 h-3.5" />
          </div>

          <div className="text-left">
            <span className="text-xs font-bold font-display block leading-none text-white flex items-center gap-1.5">
              <span>Contratar como Cliente</span>
              <span className="text-[9px] bg-[#0071e3]/20 text-[#2997ff] px-1.5 py-0.2 rounded-full font-semibold">
                Modo Cliente
              </span>
            </span>
            <span className="text-[10px] text-[#86868b] group-hover:text-[#a1a1a6] font-medium leading-tight">
              Conserva tu perfil de técnico
            </span>
          </div>

          {/* Indicador de perfil técnico activo */}
          <span
            className="w-2.5 h-2.5 rounded-full bg-[#34c759] border-2 border-[#1c1c1e] shrink-0"
            title="Perfil de técnico guardado"
          />
        </button>
      ) : (
        // MODO CLIENTE ACTIVO -> BOTÓN PARA CAMBIAR A TRABAJADOR / MODO TÉCNICO
        <button
          onClick={onSwitchToWorker}
          className="group relative flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-2.5 bg-gradient-to-r from-[#161617] to-[#242426] text-white rounded-full shadow-[0_8px_25px_rgba(240,80,35,0.25)] border border-[#f05023]/40 hover:border-[#f05023] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          aria-label="Cambiar cuenta a modo trabajador"
          title={
            hasWorkerProfile
              ? 'Volver a Modo Trabajador'
              : 'Cambiar la cuenta a trabajador (actualiza los datos con los requisitos de técnico)'
          }
        >
          {/* Avatar icono trabajador */}
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#f05023] to-[#c2410c] flex items-center justify-center text-white shadow-xs">
            <HardHat className="w-3.5 h-3.5" />
          </div>

          <div className="text-left">
            <span className="text-xs font-bold font-display block leading-none text-white flex items-center gap-1.5">
              <span>{hasWorkerProfile ? 'Modo Trabajador' : 'Cambiar a Trabajador'}</span>
              <span className="text-[9px] bg-[#f05023]/20 text-[#ff7a50] px-1.5 py-0.2 rounded-full font-semibold">
                {hasWorkerProfile ? 'Activo' : 'Gana plata'}
              </span>
            </span>
            <span className="text-[10px] text-[#86868b] group-hover:text-[#a1a1a6] font-medium leading-tight">
              {hasWorkerProfile ? 'Abrir panel de técnico' : 'Completa requisitos'}
            </span>
          </div>

          <ArrowRight className="w-3.5 h-3.5 text-[#ff7a50] group-hover:translate-x-0.5 transition-transform shrink-0" />
        </button>
      )}
    </div>
  );
};
