import React, { useState, useEffect } from 'react';
import { Eye, Sun, Moon, Type, Sliders, Check, X } from 'lucide-react';

export type ColorBlindMode = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'monochrome';
export type FontSize = 'normal' | 'large' | 'extralarge';

interface AccessibilitySettings {
  isDark: boolean;
  colorBlind: ColorBlindMode;
  fontSize: FontSize;
  highContrast: boolean;
}

const STORAGE_KEY = 'echele_camello_a11y';

export const AccessibilityMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      isDark: false,
      colorBlind: 'normal',
      fontSize: 'normal',
      highContrast: false,
    };
  });

  // Apply settings to document element and body
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Dark mode
    if (settings.isDark) {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
    }

    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
      body.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
      body.classList.remove('high-contrast');
    }

    // Font size
    root.classList.remove('font-size-normal', 'font-size-large', 'font-size-extralarge');
    root.classList.add(`font-size-${settings.fontSize}`);

    // Color blind mode
    const colorBlindClasses = [
      'colorblind-protanopia',
      'colorblind-deuteranopia',
      'colorblind-tritanopia',
      'colorblind-monochrome',
    ];
    root.classList.remove(...colorBlindClasses);
    body.classList.remove(...colorBlindClasses);

    if (settings.colorBlind !== 'normal') {
      root.classList.add(`colorblind-${settings.colorBlind}`);
      body.classList.add(`colorblind-${settings.colorBlind}`);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Opciones de Accesibilidad"
        aria-label="Abrir menú de accesibilidad"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
          isOpen
            ? 'bg-[#f05023] text-white border-[#f05023] shadow-sm'
            : 'bg-black/[0.05] hover:bg-black/[0.08] dark:bg-white/[0.08] dark:hover:bg-white/[0.14] text-[#1d1d1f] dark:text-white border-black/[0.06] dark:border-white/[0.08]'
        } apple-press`}
      >
        <Eye className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Accesibilidad</span>
      </button>

      {/* Floating Apple Popover Card */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 z-50 bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-white rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.18)] border border-black/[0.08] dark:border-white/[0.1] space-y-4 animate-in fade-in zoom-in duration-150">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#f05023]" />
                <h4 className="font-bold text-sm font-display">
                  Accesibilidad & Visión
                </h4>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-black/[0.05] dark:bg-white/[0.1] flex items-center justify-center text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 1. Tema Claro / Oscuro */}
            <div>
              <label className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider block mb-2">
                Modo Visual
              </label>
              <div className="grid grid-cols-2 gap-2 bg-[#f5f5f7] dark:bg-white/[0.06] p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, isDark: false })}
                  className={`py-1.5 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    !settings.isDark
                      ? 'bg-white text-[#1d1d1f] shadow-xs font-bold'
                      : 'text-[#86868b] hover:text-[#1d1d1f]'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-[#ff9500]" />
                  <span>Claro</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, isDark: true })}
                  className={`py-1.5 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    settings.isDark
                      ? 'bg-[#2c2c2e] text-white shadow-xs font-bold'
                      : 'text-[#86868b] hover:text-white'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-[#0071e3]" />
                  <span>Oscuro</span>
                </button>
              </div>
            </div>

            {/* 2. Daltonismo (Color Blind Filters) */}
            <div>
              <label className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider block mb-2">
                Filtro para Daltonismo
              </label>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {[
                  { id: 'normal', label: 'Estándar', desc: 'Colores originales' },
                  { id: 'protanopia', label: 'Protanopia', desc: 'Rojo atenuado' },
                  { id: 'deuteranopia', label: 'Deuteranopia', desc: 'Verde atenuado' },
                  { id: 'tritanopia', label: 'Tritanopia', desc: 'Azul atenuado' },
                  { id: 'monochrome', label: 'Monocromático', desc: 'Escala de grises' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setSettings({ ...settings, colorBlind: item.id as ColorBlindMode })
                    }
                    className={`p-2 rounded-xl text-left border flex items-center justify-between transition-all cursor-pointer ${
                      item.id === 'monochrome' ? 'col-span-2' : ''
                    } ${
                      settings.colorBlind === item.id
                        ? 'border-[#f05023] bg-[#f05023]/10 font-bold text-[#f05023]'
                        : 'border-black/[0.06] dark:border-white/[0.08] hover:bg-black/[0.03] dark:hover:bg-white/[0.04]'
                    }`}
                  >
                    <div>
                      <span className="text-[11px] block font-semibold">{item.label}</span>
                      <span className="text-[9px] text-[#86868b] block">{item.desc}</span>
                    </div>
                    {settings.colorBlind === item.id && <Check className="w-3.5 h-3.5 text-[#f05023] shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Tamaño de Letra */}
            <div>
              <label className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider block mb-2">
                Tamaño del Texto
              </label>
              <div className="grid grid-cols-3 gap-1.5 bg-[#f5f5f7] dark:bg-white/[0.06] p-1 rounded-2xl">
                {[
                  { id: 'normal', label: 'Normal (100%)' },
                  { id: 'large', label: 'Grande' },
                  { id: 'extralarge', label: 'X-Grande' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setSettings({ ...settings, fontSize: item.id as FontSize })
                    }
                    className={`py-1.5 text-[11px] font-semibold rounded-xl transition-all cursor-pointer text-center ${
                      settings.fontSize === item.id
                        ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white shadow-xs'
                        : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Alto Contraste Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
              <div>
                <span className="text-xs font-bold block">Alto Contraste</span>
                <span className="text-[10px] text-[#86868b]">Bordes y textos reforzados</span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setSettings({ ...settings, highContrast: !settings.highContrast })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  settings.highContrast ? 'bg-[#34c759]' : 'bg-black/[0.15] dark:bg-white/20'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-xs ${
                    settings.highContrast ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
