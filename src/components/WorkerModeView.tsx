import React, { useState } from 'react';
import {
  HardHat,
  Wallet,
  CheckCircle2,
  Bell,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Award,
  Zap,
  TrendingUp,
  Smartphone,
} from 'lucide-react';
import { motion } from 'motion/react';
import { AvailableOpportunity } from '../types';
import { fadeUp, staggerContainer, VIEWPORT_ONCE } from '../lib/motion';

const metricsContainer = staggerContainer(0.12, 0.2);
const metricItem = fadeUp(24, 0.6);
const listContainer = staggerContainer(0.12);
const listItem = fadeUp(50, 0.7);

interface WorkerModeViewProps {
  opportunities: AvailableOpportunity[];
  onAcceptOpportunity: (opportunity: AvailableOpportunity) => void;
  onExitWorkerMode: () => void;
  workerName?: string;
}

export const WorkerModeView: React.FC<WorkerModeViewProps> = ({
  opportunities,
  onAcceptOpportunity,
  onExitWorkerMode,
  workerName = 'Técnico Aliado',
}) => {
  const initials = workerName.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('') || 'TR';
  const [isOnline, setIsOnline] = useState(true);
  const [walletBalance, setWalletBalance] = useState(0);
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'radar' | 'wallet' | 'profile'>('radar');

  const handleWithdraw = (platform: string) => {
    if (walletBalance <= 0) return;
    const amount = walletBalance;
    setWalletBalance(0);
    setPayoutSuccessMsg(
      `¡Transferencia de $${amount.toLocaleString('es-CO')} COP enviada exitosamente a tu ${platform}!`
    );
    setTimeout(() => setPayoutSuccessMsg(''), 5000);
  };

  return (
    <motion.section aria-label="Panel del técnico" className="max-w-5xl mx-auto space-y-8">
      {/* Top Banner: Apple Obsidian Worker Profile */}
      <header className="bg-[#161617] text-white rounded-3xl p-6 sm:p-8 border border-white/[0.1] shadow-[0_8px_30px_rgb(0,0,0,0.18)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div aria-hidden="true" className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#c94a10] to-[#9a3412] text-white font-bold text-2xl flex items-center justify-center font-display shadow-[0_4px_16px_rgba(194,65,12,0.35)]">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
                  {workerName}
                </h2>
                <span className="text-[11px] text-[#ff9500] font-semibold bg-[#ff9500]/15 px-2.5 py-0.5 rounded-full border border-[#ff9500]/30">
                  Nuevo perfil
                </span>
              </div>
              <p className="text-xs text-[#a1a1a6] mt-0.5">
                Completa tu perfil para recibir más solicitudes
              </p>
            </div>
          </div>

          {/* iOS Style Availability Toggle & Exit */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 bg-white/[0.08] px-4 py-2.5 rounded-full border border-white/[0.08]">
              <span className="text-xs font-semibold text-[#f5f5f7]">
                {isOnline ? 'Disponible' : 'En Pausa'}
              </span>
              {/* iOS Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={isOnline}
                aria-label="Disponibilidad para recibir solicitudes"
                onClick={() => setIsOnline(!isOnline)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white focus-visible:ring-offset-[#161617] ${
                  isOnline ? 'bg-[#34c759]' : 'bg-white/20'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-xs ${
                    isOnline ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <button
              type="button"
              onClick={onExitWorkerMode}
              aria-label="Salir del panel de técnico"
              className="text-xs font-semibold text-[#d2d2d7] hover:text-white px-3.5 py-2 rounded-full transition-colors cursor-pointer bg-white/[0.06] hover:bg-white/[0.1] apple-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white focus-visible:ring-offset-[#161617]"
            >
              Salir
            </button>
          </div>
        </div>

        {/* 3 Metric Cards: Apple Health/Fitness Style */}
        <motion.dl
          variants={metricsContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/[0.08] text-xs"
        >
          <motion.div variants={metricItem} className="bg-white/[0.05] p-4 rounded-2xl border border-white/[0.06]">
            <dt className="text-[#a1a1a6] block mb-1">Saldo en Billetera</dt>
            <dd className="text-xl sm:text-2xl font-bold text-white font-display tabular-nums">
              ${walletBalance.toLocaleString('es-CO')}{' '}
              <span className="text-xs font-normal text-[#a1a1a6]">COP</span>
            </dd>
          </motion.div>

          <motion.div variants={metricItem} className="bg-white/[0.05] p-4 rounded-2xl border border-white/[0.06]">
            <dt className="text-[#a1a1a6] block mb-1">Camellos este mes</dt>
            <dd className="text-xl sm:text-2xl font-bold text-[#ff9500] font-display tabular-nums">
              0 completados
            </dd>
          </motion.div>

          <motion.div variants={metricItem} className="bg-white/[0.05] p-4 rounded-2xl border border-white/[0.06]">
            <dt className="text-[#a1a1a6] block mb-1">Puntualidad</dt>
            <dd className="text-xl sm:text-2xl font-bold text-[#34c759] font-display tabular-nums">
              Sin datos aún
            </dd>
          </motion.div>
        </motion.dl>
      </header>

      {payoutSuccessMsg && (
        <div role="status" className="p-4 bg-[#34c759]/15 text-[#1d1d1f] border border-[#34c759]/30 rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-semibold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#34c759] shrink-0" />
          <span>{payoutSuccessMsg}</span>
        </div>
      )}

      {/* Navigation Tabs for Worker: Apple Segmented Pill Container */}
      <div role="tablist" aria-label="Secciones del panel" className="flex items-center gap-1 bg-black/[0.05] p-1 rounded-full border border-black/[0.04] max-w-fit overflow-x-auto">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'radar'}
          onClick={() => setActiveTab('radar')}
          className={`px-4 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#c2410c] ${
            activeTab === 'radar'
              ? 'bg-white text-[#1d1d1f] shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
              : 'text-[#6e6e73] hover:text-[#1d1d1f]'
          }`}
        >
          Radar de Solicitudes ({opportunities.length})
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'wallet'}
          onClick={() => setActiveTab('wallet')}
          className={`px-4 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#c2410c] ${
            activeTab === 'wallet'
              ? 'bg-white text-[#1d1d1f] shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
              : 'text-[#6e6e73] hover:text-[#1d1d1f]'
          }`}
        >
          Billetera & Retiros
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'profile'}
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#c2410c] ${
            activeTab === 'profile'
              ? 'bg-white text-[#1d1d1f] shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
              : 'text-[#6e6e73] hover:text-[#1d1d1f]'
          }`}
        >
          Documentos & Certificados
        </button>
      </div>

      {/* TAB 1: RADAR DE CAMELOS */}
      {activeTab === 'radar' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-semibold text-[#6e6e73] uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#c2410c]" />
              <span>Solicitudes Cercanas a tu Ubicación</span>
            </h3>
            <span className="text-xs text-[#6e6e73]">
              Actualizado en tiempo real por GPS
            </span>
          </div>

          {!isOnline ? (
            <div className="p-10 text-center bg-white rounded-3xl border border-black/[0.06] space-y-3 shadow-xs">
              <Clock className="w-10 h-10 text-[#6e6e73] mx-auto" />
              <h4 className="font-bold text-[#1d1d1f] text-base font-display">Estás en modo Pausa</h4>
              <p className="text-xs text-[#6e6e73] max-w-sm mx-auto">
                Activa tu disponibilidad en la parte superior para recibir llamadas y solicitudes de clientes en tu zona.
              </p>
              <button
                onClick={() => setIsOnline(true)}
                className="mt-2 px-6 py-2 bg-[#34c759] text-white text-xs font-semibold rounded-full shadow-sm cursor-pointer apple-press"
              >
                Activar ahora
              </button>
            </div>
          ) : opportunities.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-3xl border border-black/[0.06] space-y-3 shadow-xs">
              <CheckCircle2 className="w-10 h-10 text-[#34c759] mx-auto" />
              <h4 className="font-bold text-[#1d1d1f] text-base font-display">
                ¡Todo al día! No hay más solicitudes pendientes
              </h4>
              <p className="text-xs text-[#6e6e73]">
                Has tomado todas las oportunidades cercanas. Te notificaremos apenas entre un nuevo camello.
              </p>
            </div>
          ) : (
            <motion.ul
              variants={listContainer}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT_ONCE}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {opportunities.map((opp) => (
                <motion.li
                  key={opp.id}
                  variants={listItem}
                  className="bg-white rounded-3xl border border-black/[0.06] hover:border-black/[0.12] p-6 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_24px_60px_rgb(0,0,0,0.10)] hover:-translate-y-2 transition-[translate,box-shadow,border-color] duration-300 ease-in-out flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[#6e6e73] uppercase tracking-wider">
                        {opp.categoryName}
                      </span>
                      <span className="text-[11px] text-[#6e6e73] bg-[#f5f5f7] px-2.5 py-0.5 rounded-full font-medium">
                        {opp.postedAgo}
                      </span>
                    </div>

                    <h4 className="font-bold text-[#1d1d1f] text-base font-display">
                      {opp.title}
                    </h4>

                    <p className="text-xs text-[#6e6e73] leading-relaxed">
                      {opp.description}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-[#6e6e73] pt-1">
                      <span className="flex items-center gap-1 font-medium text-[#1d1d1f]">
                        <MapPin className="w-3.5 h-3.5 text-[#c2410c]" />
                        {opp.neighborhood}{opp.distanceKm > 0 ? ` · ${opp.distanceKm} km` : ''}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-black/[0.06] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#6e6e73] font-semibold block leading-tight">
                        Pago Ofertado
                      </span>
                      <span className="text-base font-bold text-[#1d1d1f] font-display tabular-nums">
                        ${opp.offerCOP.toLocaleString('es-CO')}{' '}
                        <span className="text-xs font-normal text-[#6e6e73]">COP</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onAcceptOpportunity(opp)}
                      aria-label={`Aceptar camello: ${opp.title}`}
                      className="apple-pill-primary px-4 py-2 text-xs font-semibold rounded-full flex items-center gap-1.5 cursor-pointer shadow-sm apple-press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#c2410c]"
                    >
                      <span>Aceptar Camello</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </div>
      )}

      {/* TAB 2: WALLET & PAYOUT */}
      {activeTab === 'wallet' && (
        <div className="bg-white rounded-3xl border border-black/[0.06] p-6 sm:p-8 space-y-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-6 bg-[#f5f5f7] rounded-3xl border border-black/[0.04]">
            <div>
              <span className="text-xs text-[#6e6e73] font-semibold uppercase tracking-wider block mb-1">
                Saldo Disponible en Cuenta
              </span>
              <span className="text-3xl sm:text-4xl font-bold text-[#1d1d1f] font-display tabular-nums">
                ${walletBalance.toLocaleString('es-CO')}{' '}
                <span className="text-base font-normal text-[#6e6e73]">COP</span>
              </span>
              <span className="text-xs text-[#248a3d] block mt-1.5 font-medium">
                ✓ 0% comisión retenida sobre tus propinas
              </span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <button
                disabled={walletBalance <= 0}
                onClick={() => handleWithdraw('Nequi')}
                className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white text-xs font-semibold rounded-full flex items-center gap-2 cursor-pointer shadow-xs transition-all apple-press"
              >
                <Smartphone className="w-4 h-4" />
                <span>Retirar a Nequi</span>
              </button>

              <button
                disabled={walletBalance <= 0}
                onClick={() => handleWithdraw('Daviplata')}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-semibold rounded-full flex items-center gap-2 cursor-pointer shadow-xs transition-all apple-press"
              >
                <Smartphone className="w-4 h-4" />
                <span>Retirar a Daviplata</span>
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold text-[#6e6e73] uppercase tracking-wider mb-3">
              Historial de pagos
            </h4>
            <div className="p-8 text-center bg-[#f5f5f7] rounded-2xl border border-black/[0.04] space-y-2">
              <Wallet className="w-8 h-8 text-[#6e6e73] mx-auto" aria-hidden="true" />
              <p className="text-sm font-semibold text-[#1d1d1f]">Aún no tienes movimientos</p>
              <p className="text-xs text-[#6e6e73]">Tus pagos aparecerán aquí cuando completes tu primer camello.</p>
            </div>
          </div>
        </div>
      )}
      {/* TAB 3: DOCUMENTS & VERIFICATION */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-black/[0.06] p-8 sm:p-12 text-center space-y-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <ShieldCheck className="w-10 h-10 text-[#6e6e73] mx-auto" aria-hidden="true" />
          <h3 className="font-bold text-[#1d1d1f] text-base font-display">Aún no has cargado documentos</h3>
          <p className="text-xs sm:text-sm text-[#6e6e73] max-w-md mx-auto leading-relaxed">
            Cuando verifiques tu cédula, antecedentes y certificaciones, aparecerán aquí para que los clientes confíen en tu perfil.
          </p>
        </div>
      )}
    </motion.section>
  );
};
