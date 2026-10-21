import React, { useState } from 'react';
import {
  Briefcase,
  DollarSign,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Award,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Send,
  Zap,
} from 'lucide-react';
import { AvailableOpportunity, WorkerAd, CategoryId } from '../types';

interface ExploreClientsViewProps {
  opportunities: AvailableOpportunity[];
  onAcceptOpportunity: (opportunity: AvailableOpportunity) => void;
  onPublishAd: (ad: WorkerAd) => void;
  workerName?: string;
  workerPhone?: string;
}

export const ExploreClientsView: React.FC<ExploreClientsViewProps> = ({
  opportunities,
  onAcceptOpportunity,
  onPublishAd,
  workerName = 'Técnico Aliado',
  workerPhone = '312 458 9210',
}) => {
  // Estado para el formulario de anuncios dorados
  const [adTitle, setAdTitle] = useState('');
  const [adCategory, setAdCategory] = useState<CategoryId>('plomeria');
  const [adStartingPrice, setAdStartingPrice] = useState<number>(45000);
  const [adNeighborhood, setAdNeighborhood] = useState('Toda la ciudad');
  const [adPhone, setAdPhone] = useState(workerPhone);
  const [adPaymentMethod, setAdPaymentMethod] = useState<'llave_nequi' | 'llave_daviplata' | 'transferencia_bancaria'>('llave_nequi');
  const [adPaymentRef, setAdPaymentRef] = useState('');
  const [adFeatures, setAdFeatures] = useState('Garantía de 30 días, Llegada en 25 min, Pago Nequi');
  const [adSuccessMsg, setAdSuccessMsg] = useState(false);
  const [adErrorMsg, setAdErrorMsg] = useState('');

  // Filtro de categoría para solicitudes de clientes
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('all');

  const filteredOpportunities = opportunities.filter((opp) => {
    if (selectedFilterCategory === 'all') return true;
    return opp.category === selectedFilterCategory;
  });

  const handleCreateAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adTitle.trim()) {
      setAdErrorMsg('Por favor ingresa un título llamativo para tu anuncio.');
      return;
    }
    if (!adPaymentRef.trim()) {
      setAdErrorMsg('Por favor ingresa el número o código de comprobante de la transferencia o llave.');
      return;
    }

    const categoryNames: Record<CategoryId, string> = {
      plomeria: 'Plomería & Fugas',
      cerrajeria: 'Cerrajería 24/7',
      electricidad: 'Electricidad',
      electrodomesticos: 'Línea Blanca',
      pintura: 'Pintura & Acabados',
      carpinteria: 'Carpintería',
      impermeabilizacion: 'Impermeabilización',
      aseo: 'Aseo & Limpieza',
    };

    const newAd: WorkerAd = {
      id: `ad-gold-${Date.now()}`,
      technicianName: workerName,
      title: adTitle.trim(),
      category: adCategory,
      categoryName: categoryNames[adCategory],
      neighborhood: adNeighborhood.trim() || 'Toda la ciudad',
      city: 'Neiva (Huila)',
      phone: adPhone.trim() || '312 000 0000',
      startingPriceCOP: Number(adStartingPrice),
      rating: 4.95,
      completedJobs: 1,
      features: adFeatures.split(',').map((f) => f.trim()).filter(Boolean),
      isGoldVip: true,
      paymentMethod: adPaymentMethod,
      paymentReference: adPaymentRef.trim(),
      createdAt: 'Recién publicado',
    };

    onPublishAd(newAd);
    setAdSuccessMsg(true);
    setAdErrorMsg('');
    setTimeout(() => {
      setAdSuccessMsg(false);
      setAdTitle('');
      setAdPaymentRef('');
    }, 3000);
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      {/* ============================================================== */}
      {/* SECCIÓN 1: CLIENTES QUE PIDEN A TRABAJADORES (EN VIVO)         */}
      {/* ============================================================== */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/[0.06] dark:border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-[#c2410c] dark:text-orange-400 text-xs font-bold uppercase mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Radar de Camellos Disponibles</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1d1d1f] dark:text-white font-display">
              Clientes que Necesitan Camellador
            </h2>
            <p className="text-xs sm:text-sm text-[#6e6e73] dark:text-[#a1a1a6]">
              Acepta los trabajos publicados por los clientes con su oferta de pago directa.
            </p>
          </div>

          {/* Filtro rápido por categoría */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#86868b] hidden md:inline">Filtrar:</span>
            <select
              value={selectedFilterCategory}
              onChange={(e) => setSelectedFilterCategory(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-white dark:bg-[#1c1c1e] border border-black/[0.08] dark:border-white/[0.1] rounded-xl outline-none cursor-pointer"
            >
              <option value="all">Todas las categorías</option>
              <option value="plomeria">Plomería</option>
              <option value="cerrajeria">Cerrajería</option>
              <option value="electricidad">Electricidad</option>
              <option value="electrodomesticos">Electrodomésticos</option>
              <option value="pintura">Pintura</option>
              <option value="carpinteria">Carpintería</option>
            </select>
          </div>
        </div>

        {/* Lista de solicitudes de clientes */}
        {filteredOpportunities.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-[#1c1c1e] rounded-3xl border border-black/[0.06] dark:border-white/[0.08] space-y-2">
            <Briefcase className="w-10 h-10 text-[#86868b] mx-auto" />
            <h4 className="text-base font-bold text-[#1d1d1f] dark:text-white">
              No hay solicitudes en esta categoría por ahora
            </h4>
            <p className="text-xs text-[#86868b]">
              Tan pronto un cliente publique una necesidad con "Necesito Camellador", aparecerá aquí de inmediato.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredOpportunities.map((opp) => (
              <div
                key={opp.id}
                className="group relative rounded-3xl bg-white dark:bg-[#1c1c1e] border border-black/[0.08] dark:border-white/[0.1] p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Bar: Category & Urgency */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#c2410c] dark:text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full">
                      {opp.categoryName}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                        opp.urgency === 'alta'
                          ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                          : opp.urgency === 'media'
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                      }`}
                    >
                      {opp.urgency === 'alta' ? '🚨 Urgente' : opp.urgency === 'media' ? '⚡ Para Hoy' : '📅 Flexible'}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#1d1d1f] dark:text-white font-display leading-tight group-hover:text-[#c2410c] transition-colors">
                      {opp.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#6e6e73] dark:text-[#a1a1a6] mt-1.5 line-clamp-3 leading-relaxed">
                      {opp.description}
                    </p>
                  </div>

                  {/* Metadata */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-black/[0.04] dark:border-white/[0.06]">
                    <div className="flex items-center gap-1.5 text-[#6e6e73] dark:text-[#a1a1a6]">
                      <MapPin className="w-3.5 h-3.5 text-[#c2410c]" />
                      <span className="truncate">{opp.neighborhood}, {opp.city}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#6e6e73] dark:text-[#a1a1a6] justify-end">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{opp.postedAgo}</span>
                    </div>
                  </div>

                  {/* Client Info if present */}
                  {opp.clientName && (
                    <div className="text-[11px] text-[#86868b] flex items-center justify-between bg-black/[0.02] dark:bg-white/[0.02] px-3 py-1.5 rounded-xl">
                      <span>Cliente: <strong>{opp.clientName}</strong></span>
                      {opp.clientPhone && <span>Tel: {opp.clientPhone}</span>}
                    </div>
                  )}
                </div>

                {/* Bottom CTA & Payment Offer */}
                <div className="pt-4 mt-4 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-[#86868b] block font-medium">El cliente ofrece</span>
                    <span className="text-base sm:text-lg font-black text-[#15803d] dark:text-emerald-400 font-mono">
                      ${opp.offerCOP.toLocaleString('es-CO')} COP
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {opp.clientPhone && (
                      <a
                        href={`https://wa.me/57${opp.clientPhone.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(
                          opp.clientName || 'vecino'
                        )},%20vi%20tu%20solicitud%20en%20%C3%89chele%20Camello%20para%20${encodeURIComponent(
                          opp.title
                        )}.`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 sm:px-3 sm:py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20 flex items-center gap-1.5 transition-colors"
                        title="Contactar al cliente"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => onAcceptOpportunity(opp)}
                      className="py-2 px-4 rounded-xl bg-gradient-to-r from-[#ea580c] to-[#c2410c] hover:brightness-110 active:scale-95 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Aceptar Camello</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ============================================================== */}
      {/* SECCIÓN 2: PUBLICAR ANUNCIOS EN LA SECCIÓN DORADA DE CLIENTES  */}
      {/* ============================================================== */}
      <section className="rounded-3xl bg-gradient-to-b from-[#241a06] via-[#161208] to-[#12100a] border border-amber-500/40 p-6 sm:p-10 shadow-[0_12px_40px_rgba(217,119,6,0.15)] text-white space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-amber-500/20 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold tracking-wide uppercase">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Publicidad para Trabajadores · Sección Dorada VIP</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
              Publica tu Anuncio en el Portal de Clientes
            </h2>
            <p className="text-xs sm:text-sm text-amber-100/75 max-w-2xl leading-relaxed">
              Tu perfil aparecerá fijado en la <strong>Sección Dorada VIP</strong> del portal de clientes.
              Paga tu activación mediante transferencia bancaria o llave (Nequi / Daviplata / Bre-B) al administrador.
            </p>
          </div>

          {/* Tarjeta de Datos de Pago al Admin */}
          <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/30 text-xs space-y-2 shrink-0 md:max-w-xs w-full">
            <div className="flex items-center justify-between">
              <span className="text-amber-300 font-bold">💳 Datos de Pago / Llave</span>
              <span className="text-[10px] bg-amber-400/20 text-amber-200 px-2 py-0.5 rounded-full font-mono">
                $25.000 COP / mes
              </span>
            </div>
            <div className="space-y-1 text-amber-100/80">
              <p>📱 <strong>Llave Nequi / Daviplata:</strong> <span className="font-mono text-white font-bold select-all">312 456 7890</span></p>
              <p>🏦 <strong>Bancolombia Ahorros:</strong> <span className="font-mono text-white font-bold select-all">745-928192-31</span></p>
              <p>👤 <strong>Titular:</strong> Échele Camello Publicidad Oficial</p>
            </div>
          </div>
        </div>

        {/* Formulario de Anuncio */}
        <form onSubmit={handleCreateAd} className="space-y-5">
          {adSuccessMsg && (
            <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 rounded-2xl flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              <div>
                <h5 className="font-bold text-sm">¡Anuncio Dorado Activado con Éxito!</h5>
                <p className="text-xs text-emerald-100/80">
                  Tu anuncio ya está visible en la Sección Dorada de la Web Cliente. Los clientes te contactarán directamente.
                </p>
              </div>
            </div>
          )}

          {adErrorMsg && (
            <div className="p-3 bg-red-500/20 border border-red-500/40 text-red-200 rounded-xl flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{adErrorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Título del anuncio */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-amber-200 mb-1">
                Título del Anuncio (Llamativo para los clientes) *
              </label>
              <input
                type="text"
                value={adTitle}
                onChange={(e) => setAdTitle(e.target.value)}
                placeholder="Ej: Maestro Plomero 24/7 · Destapes de cañerías con máquina eléctrica y garantía total"
                className="w-full px-4 py-2.5 bg-black/40 border border-amber-500/30 rounded-xl text-white text-xs sm:text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                required
              />
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-xs font-semibold text-amber-200 mb-1">
                Especialidad / Categoría
              </label>
              <select
                value={adCategory}
                onChange={(e) => setAdCategory(e.target.value as CategoryId)}
                className="w-full px-3 py-2.5 bg-black/40 border border-amber-500/30 rounded-xl text-white text-xs sm:text-sm outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="plomeria" className="bg-[#1c1c1e] text-white">Plomería & Fugas</option>
                <option value="cerrajeria" className="bg-[#1c1c1e] text-white">Cerrajería 24/7</option>
                <option value="electricidad" className="bg-[#1c1c1e] text-white">Electricidad & Redes</option>
                <option value="electrodomesticos" className="bg-[#1c1c1e] text-white">Electrodomésticos</option>
                <option value="pintura" className="bg-[#1c1c1e] text-white">Pintura & Acabados</option>
                <option value="carpinteria" className="bg-[#1c1c1e] text-white">Carpintería</option>
                <option value="impermeabilizacion" className="bg-[#1c1c1e] text-white">Impermeabilización</option>
                <option value="aseo" className="bg-[#1c1c1e] text-white">Aseo & Limpieza</option>
              </select>
            </div>

            {/* Tarifa desde */}
            <div>
              <label className="block text-xs font-semibold text-amber-200 mb-1">
                Tarifa Mínima Desde ($ COP)
              </label>
              <input
                type="number"
                min={20000}
                max={10000000}
                step={5000}
                value={adStartingPrice}
                onChange={(e) => setAdStartingPrice(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-black/40 border border-amber-500/30 rounded-xl text-white text-xs sm:text-sm outline-none focus:border-amber-400 font-mono"
              />
            </div>

            {/* Zona o Barrios */}
            <div>
              <label className="block text-xs font-semibold text-amber-200 mb-1">
                Barrios o Zonas que atiendes
              </label>
              <input
                type="text"
                value={adNeighborhood}
                onChange={(e) => setAdNeighborhood(e.target.value)}
                placeholder="Ej: Quirinal, Ipanema, o Toda la ciudad"
                className="w-full px-4 py-2.5 bg-black/40 border border-amber-500/30 rounded-xl text-white text-xs sm:text-sm outline-none focus:border-amber-400"
              />
            </div>

            {/* Teléfono / WhatsApp */}
            <div>
              <label className="block text-xs font-semibold text-amber-200 mb-1">
                Teléfono / WhatsApp de contacto *
              </label>
              <input
                type="tel"
                value={adPhone}
                onChange={(e) => setAdPhone(e.target.value)}
                placeholder="312 000 0000"
                className="w-full px-4 py-2.5 bg-black/40 border border-amber-500/30 rounded-xl text-white text-xs sm:text-sm outline-none focus:border-amber-400"
                required
              />
            </div>

            {/* Método de Pago del Anuncio */}
            <div>
              <label className="block text-xs font-semibold text-amber-200 mb-1">
                ¿Por dónde me pagaste el anuncio? *
              </label>
              <select
                value={adPaymentMethod}
                onChange={(e) => setAdPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-black/40 border border-amber-500/30 rounded-xl text-white text-xs sm:text-sm outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="llave_nequi" className="bg-[#1c1c1e] text-white">Llave Nequi (312 456 7890)</option>
                <option value="llave_daviplata" className="bg-[#1c1c1e] text-white">Llave Daviplata (312 456 7890)</option>
                <option value="transferencia_bancaria" className="bg-[#1c1c1e] text-white">Transferencia Bancolombia / PSE</option>
              </select>
            </div>

            {/* Comprobante / Referencia de Pago */}
            <div>
              <label className="block text-xs font-semibold text-amber-200 mb-1">
                Comprobante o Código de Transferencia / Llave *
              </label>
              <input
                type="text"
                value={adPaymentRef}
                onChange={(e) => setAdPaymentRef(e.target.value)}
                placeholder="Ej: M1928420 o Nro de aprobación"
                className="w-full px-4 py-2.5 bg-black/40 border border-amber-500/30 rounded-xl text-white text-xs sm:text-sm outline-none focus:border-amber-400 font-mono"
                required
              />
            </div>
          </div>

          {/* Características o ventajas */}
          <div>
            <label className="block text-xs font-semibold text-amber-200 mb-1">
              Ventajas destacadas (separadas por coma)
            </label>
            <input
              type="text"
              value={adFeatures}
              onChange={(e) => setAdFeatures(e.target.value)}
              placeholder="Garantía de 30 días, Llegada en 25 min, Pago Nequi, etc."
              className="w-full px-4 py-2 bg-black/40 border border-amber-500/30 rounded-xl text-white text-xs outline-none focus:border-amber-400"
            />
          </div>

          {/* Botón de Enviar */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto py-3 px-8 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:brightness-110 active:scale-95 text-black font-extrabold text-xs sm:text-sm shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>Activar mi Anuncio en la Sección Dorada VIP ($25.000 COP)</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
