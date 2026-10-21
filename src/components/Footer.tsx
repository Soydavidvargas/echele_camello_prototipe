import React from 'react';
import { Wrench, ShieldCheck, Heart } from 'lucide-react';
import { CategoryId } from '../types';

interface FooterProps {
  onOpenGuarantee: () => void;
  onSelectCategory: (cat: CategoryId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenGuarantee, onSelectCategory }) => {
  return (
    <footer className="bg-[#161617] text-[#86868b] text-xs border-t border-white/[0.08] mt-20 pt-14 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3.5 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#f05023] to-[#e03d10] flex items-center justify-center text-white shadow-xs">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white font-display">
                Échele Camello
              </span>
            </div>
            <p className="text-xs text-[#a1a1a6] leading-relaxed">
              La plataforma más confiable de Colombia que conecta maestros certificados y técnicos con familias bajo pago en custodia y estándares de calidad.
            </p>
            <div className="pt-1 flex items-center gap-2 text-[#34c759] text-[11px] font-medium">
              <ShieldCheck className="w-4 h-4 text-[#34c759]" />
              <span>Antecedentes verificados ante Policía Nacional</span>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold text-white uppercase tracking-wider">
              Oficios Principales
            </h4>
            <ul className="space-y-2 text-[#a1a1a6]">
              <li>
                <button
                  onClick={() => onSelectCategory('plomeria')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Plomería & Destape de Tuberías
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('cerrajeria')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Cerrajería 24/7 y Cerraduras
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('electricidad')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Electricidad y Tableros RETIE
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('electrodomesticos')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Reparación de Lavadoras & Neveras
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('pintura')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Pintura y Resanes Drywall
                </button>
              </li>
            </ul>
          </div>

          {/* Coverage in Colombia */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold text-white uppercase tracking-wider">
              Ciudades de Cobertura
            </h4>
            <ul className="space-y-1.5 text-[#a1a1a6]">
              <li className="text-[#ff9500] font-medium">Neiva, Huila (Quirinal, Ipanema, Altico, Las Ceibas)</li>
              <li>Bogotá D.C. (Usaquén, Chapinero, Suba, Teusaquillo)</li>
              <li>Medellín (El Poblado, Laureles, Envigado, Belén)</li>
              <li>Cali (Granada, San Antonio, Ciudad Jardín)</li>
              <li>Barranquilla y Bucaramanga</li>
            </ul>
          </div>

          {/* Trust and Safety */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold text-white uppercase tracking-wider">
              Seguridad & Respaldo
            </h4>
            <ul className="space-y-2 text-[#a1a1a6]">
              <li>
                <button
                  onClick={onOpenGuarantee}
                  className="text-[#f05023] hover:text-[#ff7a50] font-medium cursor-pointer"
                >
                  ¿Cómo funciona la Garantía Camello?
                </button>
              </li>
              <li>Pago seguro en custodia (Nequi, Daviplata, PSE)</li>
              <li>Póliza colectiva contra daños accidentales</li>
              <li>Garantía de 30 días en mano de obra</li>
              <li>
                <a
                  href="https://wa.me/573114928821"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Línea WhatsApp de Soporte 24/7
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#86868b]">
          <div className="flex items-center gap-2">
            <span>© 2026 Échele Camello S.A.S.</span>
            <span>·</span>
            <span>NIT 901.849.201-4</span>
            <span>·</span>
            <span>Colombia</span>
          </div>

          <div className="flex items-center gap-1.5 text-[#a1a1a6]">
            <span>Diseñado con excelencia para maestros y familias</span>
            <Heart className="w-3.5 h-3.5 text-[#f05023] fill-[#f05023] inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
