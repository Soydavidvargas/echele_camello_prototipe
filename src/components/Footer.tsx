import React from 'react';
import { Wrench, ShieldCheck, Heart } from 'lucide-react';
import { CategoryId } from '../types';

interface FooterProps {
  onOpenGuarantee: () => void;
  onSelectCategory: (cat: CategoryId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenGuarantee, onSelectCategory }) => {
  return (
    <footer className="bg-[#0f172a] text-slate-400 text-xs border-t border-slate-800 mt-16 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#ea580c] flex items-center justify-center text-white">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white font-display">
                Échele Camello
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              El puente digital más confiable de Colombia entre técnicos calificados, maestros de obra y familias que necesitan reparaciones seguras.
            </p>
            <div className="pt-1 flex items-center gap-1.5 text-emerald-400 text-[11px] font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Antecedentes validados ante Policía Nacional</span>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Oficios Populares
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button
                  onClick={() => onSelectCategory('plomeria')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Plomería & Destape de Tuberías
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('cerrajeria')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Cerrajería 24/7 y Guardas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('electricidad')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Electricidad y Breakers RETIE
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('electrodomesticos')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Reparación de Lavadoras & Neveras
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('pintura')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Pintura y Resanes Drywall
                </button>
              </li>
            </ul>
          </div>

          {/* Coverage in Colombia */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Ciudades de Cobertura
            </h4>
            <ul className="space-y-1 text-slate-400">
              <li className="text-orange-300 font-semibold">Neiva, Huila (Quirinal, Ipanema, Las Ceibas, Altico, Cándido)</li>
              <li>Bogotá D.C. (Usaquén, Chapinero, Suba, Teusaquillo)</li>
              <li>Medellín (El Poblado, Laureles, Envigado, Belén)</li>
              <li>Cali (Granada, San Antonio, Ciudad Jardín)</li>
              <li>Barranquilla y Bucaramanga</li>
            </ul>
          </div>

          {/* Trust and Safety */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Seguridad & Garantía
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button
                  onClick={onOpenGuarantee}
                  className="text-orange-400 hover:text-orange-300 font-semibold cursor-pointer"
                >
                  ¿Cómo funciona la Garantía Camello?
                </button>
              </li>
              <li>Pago seguro en custodia (Nequi, Daviplata, PSE)</li>
              <li>Póliza contra daños accidentales hasta $5M COP</li>
              <li>Garantía de 30 días en mano de obra</li>
              <li>
                <a
                  href="https://wa.me/573114928821"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Línea de Soporte WhatsApp 24/7
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <span>© 2026 Échele Camello S.A.S. · NIT 901.849.201-4</span>
            <span aria-hidden="true">·</span>
            <span>República de Colombia</span>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <span>Hecho con berraquera para técnicos y hogares colombianos</span>
            <Heart className="w-3.5 h-3.5 text-orange-500 fill-orange-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
