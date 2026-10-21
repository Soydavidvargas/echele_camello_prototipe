import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, DollarSign, MapPin, Briefcase, Clock, Phone, User } from 'lucide-react';
import { CategoryId, AvailableOpportunity, CityInfo } from '../types';

interface NeedWorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  cities: CityInfo[];
  currentCityName: string;
  defaultClientName?: string;
  onSubmit: (opportunity: AvailableOpportunity) => void;
}

export const NeedWorkerModal: React.FC<NeedWorkerModalProps> = ({
  isOpen,
  onClose,
  cities,
  currentCityName,
  defaultClientName = '',
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryId>('plomeria');
  const [description, setDescription] = useState('');
  const [offerCOP, setOfferCOP] = useState<number>(60000);
  const [cityName, setCityName] = useState(currentCityName);
  const [neighborhood, setNeighborhood] = useState('');
  const [urgency, setUrgency] = useState<'alta' | 'media' | 'normal'>('alta');
  const [clientName, setClientName] = useState(defaultClientName || '');
  const [clientPhone, setClientPhone] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Por favor indica qué necesitas solucionar o reparar.');
      return;
    }
    if (!neighborhood.trim()) {
      setErrorMsg('Por favor especifica tu barrio o sector.');
      return;
    }
    if (offerCOP < 20000) {
      setErrorMsg('La oferta mínima es de $20.000 COP.');
      return;
    }
    if (offerCOP > 10000000) {
      setErrorMsg('La oferta máxima por camello es de $10.000.000 COP.');
      return;
    }
    if (!clientPhone.trim() || clientPhone.replace(/\D/g, '').length < 7) {
      setErrorMsg('Por favor ingresa un número de teléfono o WhatsApp válido.');
      return;
    }

    const categoryNames: Record<CategoryId, string> = {
      plomeria: 'Plomería & Fugas',
      cerrajeria: 'Cerrajería 24/7',
      electricidad: 'Electricidad & Redes',
      electrodomesticos: 'Línea Blanca',
      pintura: 'Pintura & Acabados',
      carpinteria: 'Carpintería & Madera',
      impermeabilizacion: 'Impermeabilización',
      aseo: 'Aseo & Limpieza Profunda',
    };

    const newOpp: AvailableOpportunity = {
      id: `opp-client-${Date.now()}`,
      category,
      categoryName: categoryNames[category],
      title: title.trim(),
      description: description.trim() || 'El cliente solicita atención técnica para esta labor.',
      neighborhood: neighborhood.trim(),
      city: cityName,
      distanceKm: 1.0,
      offerCOP: Number(offerCOP),
      urgency,
      postedAgo: 'Recién publicado',
      clientName: clientName.trim() || 'Cliente Échele Camello',
      clientPhone: clientPhone.trim(),
    };

    onSubmit(newOpp);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      // Reset form
      setTitle('');
      setDescription('');
      setNeighborhood('');
      setClientPhone('');
      setErrorMsg('');
    }, 1800);
  };

  const presetOffers = [40000, 60000, 90000, 150000, 300000];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1c1c1e] w-full max-w-xl rounded-3xl border border-black/[0.08] dark:border-white/[0.1] shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Modal */}
        <div className="px-6 py-5 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#ea580c] to-[#c2410c] text-white flex items-center justify-center text-lg shadow-md shadow-orange-500/20">
              📢
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1d1d1f] dark:text-white font-display">
                Necesito un Camellador
              </h3>
              <p className="text-xs text-[#6e6e73] dark:text-[#a1a1a6]">
                Publica qué necesitas y cuánto ofreces para que los técnicos postulen o acepten
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/[0.04] dark:bg-white/[0.08] hover:bg-black/[0.08] flex items-center justify-center text-[#6e6e73] hover:text-[#1d1d1f] dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content / Form */}
        <div className="p-6 overflow-y-auto space-y-5">
          {isSuccess ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-[#1d1d1f] dark:text-white font-display">
                ¡Solicitud Publicada con Éxito!
              </h4>
              <p className="text-xs text-[#6e6e73] dark:text-[#a1a1a6] max-w-sm mx-auto">
                Tu solicitud ya aparece en el radar de los trabajadores en <strong>{cityName}</strong>. Te contactarán de inmediato.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Título de la necesidad */}
              <div>
                <label className="block text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-1">
                  ¿Qué necesitas solucionar o contratar? *
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej: Fuga en lavaplatos, arreglo de chapa, pintar sala..."
                    className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm bg-[#f5f5f7] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] rounded-xl outline-none focus:border-[#ea580c] focus:ring-2 focus:ring-[#ea580c]/15"
                    required
                  />
                </div>
              </div>

              {/* Categoría & Urgencia */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-1">
                    Tipo de Trabajo
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryId)}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm bg-[#f5f5f7] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] rounded-xl outline-none focus:border-[#ea580c] cursor-pointer"
                  >
                    <option value="plomeria" className="bg-[#1c1c1e] text-white">Plomería & Fugas</option>
                    <option value="cerrajeria" className="bg-[#1c1c1e] text-white">Cerrajería 24/7</option>
                    <option value="electricidad" className="bg-[#1c1c1e] text-white">Electricidad & Redes</option>
                    <option value="electrodomesticos" className="bg-[#1c1c1e] text-white">Electrodomésticos</option>
                    <option value="pintura" className="bg-[#1c1c1e] text-white">Pintura & Drywall</option>
                    <option value="carpinteria" className="bg-[#1c1c1e] text-white">Carpintería</option>
                    <option value="impermeabilizacion" className="bg-[#1c1c1e] text-white">Impermeabilización</option>
                    <option value="aseo" className="bg-[#1c1c1e] text-white">Aseo & Limpieza</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-1">
                    Nivel de Urgencia
                  </label>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setUrgency('alta')}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        urgency === 'alta'
                          ? 'bg-red-500/15 border-red-500 text-red-500'
                          : 'bg-[#f5f5f7] dark:bg-white/[0.06] border-black/[0.06] dark:border-white/[0.08] text-[#86868b]'
                      }`}
                    >
                      🚨 Urgente
                    </button>
                    <button
                      type="button"
                      onClick={() => setUrgency('media')}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        urgency === 'media'
                          ? 'bg-amber-500/15 border-amber-500 text-amber-500'
                          : 'bg-[#f5f5f7] dark:bg-white/[0.06] border-black/[0.06] dark:border-white/[0.08] text-[#86868b]'
                      }`}
                    >
                      ⚡ Hoy
                    </button>
                    <button
                      type="button"
                      onClick={() => setUrgency('normal')}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        urgency === 'normal'
                          ? 'bg-blue-500/15 border-blue-500 text-blue-500'
                          : 'bg-[#f5f5f7] dark:bg-white/[0.06] border-black/[0.06] dark:border-white/[0.08] text-[#86868b]'
                      }`}
                    >
                      📅 Flexible
                    </button>
                  </div>
                </div>
              </div>

              {/* ¿Cuánto ofreces? */}
              <div className="p-4 bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/20 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#1d1d1f] dark:text-white flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-[#ea580c]" />
                    <span>¿Cuánto ofreces por el camello? (Mínimo $20.000 COP)</span>
                  </label>
                  <span className="text-xs font-bold text-[#ea580c] font-mono">
                    ${Number(offerCOP || 0).toLocaleString('es-CO')} COP
                  </span>
                </div>

                <input
                  type="number"
                  min={20000}
                  max={10000000}
                  step={5000}
                  value={offerCOP}
                  onChange={(e) => setOfferCOP(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-[#1c1c1e] border border-black/[0.1] dark:border-white/[0.15] rounded-xl outline-none focus:border-[#ea580c] font-semibold"
                />

                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-[#86868b]">Sugerencias:</span>
                  {presetOffers.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setOfferCOP(preset)}
                      className={`text-[11px] px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                        offerCOP === preset
                          ? 'bg-[#ea580c] text-white border-[#ea580c]'
                          : 'bg-white dark:bg-white/[0.06] border-black/[0.08] dark:border-white/[0.1] text-[#6e6e73] hover:text-[#1d1d1f] dark:hover:text-white'
                      }`}
                    >
                      ${preset / 1000}k
                    </button>
                  ))}
                </div>
              </div>

              {/* Ubicación: Ciudad y Barrio */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-1">
                    Ciudad
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#86868b] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={cityName}
                      onChange={(e) => setCityName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-[#f5f5f7] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] rounded-xl outline-none focus:border-[#ea580c] cursor-pointer"
                    >
                      {cities.map((c) => (
                        <option key={c.id} value={c.name} className="bg-[#1c1c1e] text-white">
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-1">
                    Barrio o Sector *
                  </label>
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="Ej: Quirinal, Ipanema, Las Granjas..."
                    className="w-full px-3 py-2.5 text-xs sm:text-sm bg-[#f5f5f7] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] rounded-xl outline-none focus:border-[#ea580c]"
                    required
                  />
                </div>
              </div>

              {/* Descripción opcional */}
              <div>
                <label className="block text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-1">
                  Detalles adicionales del daño o trabajo
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ej: El agua se filtra por debajo del sifón, tengo el empaque nuevo..."
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#f5f5f7] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] rounded-xl outline-none focus:border-[#ea580c] resize-none"
                />
              </div>

              {/* Datos de contacto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-1">
                    Tu Nombre
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#86868b] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Nombre del cliente"
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#f5f5f7] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] rounded-xl outline-none focus:border-[#ea580c]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-1">
                    WhatsApp o Teléfono *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#86868b] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="312 000 0000"
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#f5f5f7] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] rounded-xl outline-none focus:border-[#ea580c]"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Botón de Enviar */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-[#ea580c] via-[#c2410c] to-[#9a3412] hover:brightness-110 active:scale-[0.99] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>📢 Publicar para que los Maestros Acepten</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
