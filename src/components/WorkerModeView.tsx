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
import { AvailableOpportunity } from '../types';

interface WorkerModeViewProps {
  opportunities: AvailableOpportunity[];
  onAcceptOpportunity: (opportunity: AvailableOpportunity) => void;
  onExitWorkerMode: () => void;
}

export const WorkerModeView: React.FC<WorkerModeViewProps> = ({
  opportunities,
  onAcceptOpportunity,
  onExitWorkerMode,
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [walletBalance, setWalletBalance] = useState(485000);
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
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner: Worker Identity & Availability Toggle */}
      <div className="bg-[#0f172a] text-white rounded-3xl p-6 border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-orange-600 text-white font-bold text-2xl flex items-center justify-center font-display shadow-lg shadow-orange-500/20">
              JB
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-display text-white">
                  Don Jairo Bermúdez
                </h2>
                <span className="text-xs text-orange-400 font-semibold bg-orange-500/20 px-2 py-0.5 rounded-md border border-orange-500/30">
                  Maestro Pro
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Plomero Certificado SENA · C.C. 79.***.892 Bogotá
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                <span className="text-emerald-400 font-semibold">★ 4.94 (184 camellos)</span>
                <span>·</span>
                <span>Bogotá Norte & Centro</span>
              </div>
            </div>
          </div>

          {/* Online Toggle & Exit */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 bg-slate-800/90 px-4 py-2.5 rounded-2xl border border-slate-700">
              <span
                className={`w-3 h-3 rounded-full ${
                  isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                }`}
              />
              <span className="text-xs font-semibold text-slate-200">
                {isOnline ? 'Recibiendo Camellos' : 'En Pausa (Desconectado)'}
              </span>
              <button
                onClick={() => setIsOnline(!isOnline)}
                className={`ml-2 text-xs px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                  isOnline
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                }`}
              >
                {isOnline ? 'Desactivar' : 'Activar'}
              </button>
            </div>

            <button
              onClick={onExitWorkerMode}
              className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-2 rounded-xl transition-colors cursor-pointer"
            >
              Salir del Panel
            </button>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 pt-6 border-t border-slate-800 text-xs">
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 block mb-0.5">Saldo en Billetera</span>
            <span className="text-lg font-bold text-white font-display tabular-nums">
              ${walletBalance.toLocaleString('es-CO')} COP
            </span>
          </div>

          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 block mb-0.5">Camellos este mes</span>
            <span className="text-lg font-bold text-orange-400 font-display tabular-nums">
              26 completados
            </span>
          </div>

          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 block mb-0.5">Puntualidad en moto</span>
            <span className="text-lg font-bold text-emerald-400 font-display tabular-nums">
              98.2% a tiempo
            </span>
          </div>
        </div>
      </div>

      {payoutSuccessMsg && (
        <div className="p-4 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-2xl flex items-center gap-3 text-sm font-semibold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>{payoutSuccessMsg}</span>
        </div>
      )}

      {/* Navigation Tabs for Worker */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('radar')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
            activeTab === 'radar'
              ? 'bg-[#ea580c] text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Radar de Solicitudes ({opportunities.length})
        </button>

        <button
          onClick={() => setActiveTab('wallet')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
            activeTab === 'wallet'
              ? 'bg-[#ea580c] text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Billetera & Retiros
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-[#ea580c] text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Documentos & Certificados
        </button>
      </div>

      {/* TAB 1: RADAR DE CAMELOS */}
      {activeTab === 'radar' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-600" />
              <span>Solicitudes Cercanas a tu Ubicación</span>
            </h3>
            <span className="text-xs text-slate-500">
              Actualizado en tiempo real por GPS
            </span>
          </div>

          {!isOnline ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
              <Clock className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="font-bold text-slate-800 text-sm">Estás en modo Pausa</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Activa tu disponibilidad en la parte superior para recibir llamadas y solicitudes de clientes en tu zona.
              </p>
              <button
                onClick={() => setIsOnline(true)}
                className="mt-2 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
              >
                Activar ahora
              </button>
            </div>
          ) : opportunities.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-slate-800 text-sm">
                ¡Todo al día! No hay más solicitudes pendientes
              </h4>
              <p className="text-xs text-slate-500">
                Has tomado todas las oportunidades cercanas. Te notificaremos apenas entre un nuevo camello.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {opportunities.map((opp) => (
                <div
                  key={opp.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-orange-300 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {opp.categoryName}
                      </span>
                      <span className="text-[11px] text-slate-400">{opp.postedAgo}</span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-base font-display">
                      {opp.title}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {opp.description}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-orange-600" />
                        {opp.neighborhood} · {opp.distanceKm} km
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Pago ofertado</span>
                      <span className="text-base font-bold text-slate-900 font-display tabular-nums">
                        ${opp.offerCOP.toLocaleString('es-CO')}{' '}
                        <span className="text-xs font-normal text-slate-500">COP</span>
                      </span>
                    </div>

                    <button
                      onClick={() => onAcceptOpportunity(opp)}
                      className="px-4 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
                    >
                      <span>Aceptar Camello</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: WALLET & PAYOUT */}
      {activeTab === 'wallet' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <span className="text-xs text-slate-500 font-semibold block">
                Total Acumulado Disponible
              </span>
              <span className="text-3xl font-extrabold text-slate-900 font-display tabular-nums">
                ${walletBalance.toLocaleString('es-CO')} <span className="text-sm font-normal text-slate-500">COP</span>
              </span>
              <span className="text-xs text-emerald-700 block mt-1">
                ✓ 0% comisión retenida sobre propinas
              </span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <button
                disabled={walletBalance <= 0}
                onClick={() => handleWithdraw('Nequi (311 492 8821)')}
                className="px-4 py-2.5 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs transition-all"
              >
                <Smartphone className="w-4 h-4" />
                <span>Transferir a Nequi</span>
              </button>

              <button
                disabled={walletBalance <= 0}
                onClick={() => handleWithdraw('Daviplata')}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs transition-all"
              >
                <Smartphone className="w-4 h-4" />
                <span>Transferir a Daviplata</span>
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
              Historial de Camellos Recientes Liquidados
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">
                    Destape de sifón en Cedritos
                  </span>
                  <span className="text-slate-400">Hoy, 11:30 AM · Pago en custodia liberado</span>
                </div>
                <span className="font-bold text-emerald-700 font-display tabular-nums text-sm">
                  +$85.000 COP
                </span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">
                    Cambio llave de paso en Chapinero Alto
                  </span>
                  <span className="text-slate-400">Ayer, 4:15 PM · Cliente: Valentina Osorio</span>
                </div>
                <span className="font-bold text-emerald-700 font-display tabular-nums text-sm">
                  +$110.000 COP
                </span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">
                    Mantenimiento de calentador de paso
                  </span>
                  <span className="text-slate-400">2 de Octubre · Chicó Norte</span>
                </div>
                <span className="font-bold text-emerald-700 font-display tabular-nums text-sm">
                  +$95.000 COP
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DOCUMENTS & VERIFICATION */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Documentación Verificada para Clientes
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="p-4 border border-emerald-200 bg-emerald-50/50 rounded-2xl flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-emerald-950 block">
                  Cédula & Antecedentes Judiciales
                </span>
                <span className="text-emerald-800">
                  Cotejado en bases de datos de la Policía Nacional y Procuraduría. Estado: Aprobado sin observaciones.
                </span>
              </div>
            </div>

            <div className="p-4 border border-emerald-200 bg-emerald-50/50 rounded-2xl flex items-start gap-3">
              <Award className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-emerald-950 block">
                  Certificación Técnica SENA
                </span>
                <span className="text-emerald-800">
                  Técnico en Instalaciones Hidrosanitarias y Gas. Registro oficial SENA verificado.
                </span>
              </div>
            </div>

            <div className="p-4 border border-emerald-200 bg-emerald-50/50 rounded-2xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-emerald-950 block">
                  Planilla ARL Sura al Día
                </span>
                <span className="text-emerald-800">
                  Cobertura vigente para trabajos en alturas y riesgos locativos.
                </span>
              </div>
            </div>

            <div className="p-4 border border-emerald-200 bg-emerald-50/50 rounded-2xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-emerald-950 block">
                  Seguro de Responsabilidad Civil
                </span>
                <span className="text-emerald-800">
                  Póliza colectiva "Échele Camello" con cobertura hasta $5.000.000 COP por siniestro.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
