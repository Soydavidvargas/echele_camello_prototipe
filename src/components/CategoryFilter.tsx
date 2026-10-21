import React from 'react';
import {
  Wrench,
  KeyRound,
  Zap,
  Cpu,
  Paintbrush,
  Hammer,
  ShieldCheck,
  Sparkles,
  LayoutGrid,
} from 'lucide-react';
import { Category, CategoryId } from '../types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: CategoryId | 'all';
  onSelectCategory: (id: CategoryId | 'all') => void;
}

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Wrench':
      return <Wrench className="w-4 h-4" />;
    case 'KeyRound':
      return <KeyRound className="w-4 h-4" />;
    case 'Zap':
      return <Zap className="w-4 h-4" />;
    case 'Cpu':
      return <Cpu className="w-4 h-4" />;
    case 'Paintbrush':
      return <Paintbrush className="w-4 h-4" />;
    case 'Hammer':
      return <Hammer className="w-4 h-4" />;
    case 'ShieldCheck':
      return <ShieldCheck className="w-4 h-4" />;
    case 'Sparkles':
      return <Sparkles className="w-4 h-4" />;
    default:
      return <Wrench className="w-4 h-4" />;
  }
};

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="mb-7">
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <h3 className="text-xs font-semibold text-[#86868b] tracking-wider uppercase">
            Especialidades & Oficios
          </h3>
        </div>
        <span className="text-xs text-[#86868b]">
          Tarifas reguladas y visita protegida
        </span>
      </div>

      {/* Apple-style horizontal scrollable pill row */}
      <div
        role="group"
        aria-label="Filtrar por oficio"
        className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        <button
          type="button"
          onClick={() => onSelectCategory('all')}
          aria-pressed={selectedCategory === 'all'}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
            selectedCategory === 'all'
              ? 'bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] border-[#1d1d1f] dark:border-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] scale-[1.02]'
              : 'bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-[#f5f5f7] border-black/[0.06] dark:border-white/[0.08] hover:border-black/[0.12] dark:hover:border-white/[0.16] hover:bg-[#fafafc] dark:hover:bg-[#252528] shadow-[0_1px_3px_rgba(0,0,0,0.02)]'
          } apple-press`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>Todos los Oficios</span>
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              type="button"
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              aria-pressed={isSelected}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                isSelected
                  ? 'bg-[#f05023] text-white border-[#f05023] shadow-[0_4px_14px_rgba(240,80,35,0.3)] scale-[1.02]'
                  : 'bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-[#f5f5f7] border-black/[0.06] dark:border-white/[0.08] hover:border-black/[0.12] dark:hover:border-white/[0.16] hover:bg-[#fafafc] dark:hover:bg-[#252528] shadow-[0_1px_3px_rgba(0,0,0,0.02)]'
              } apple-press`}
            >
              <span className={isSelected ? 'text-white' : 'text-[#86868b] dark:text-[#a1a1a6]'}>
                {getCategoryIcon(cat.icon)}
              </span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
