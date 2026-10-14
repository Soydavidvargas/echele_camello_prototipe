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
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-800 tracking-wide uppercase">
          Especialidades & Oficios
        </h3>
        <span className="text-xs text-slate-500">
          Precios regulados y visita garantizada
        </span>
      </div>

      {/* Horizontal scroller on mobile, clean flex-wrap on desktop */}
      <div
        role="group"
        aria-label="Filtrar por oficio"
        className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none"
      >
        <button
          type="button"
          onClick={() => onSelectCategory('all')}
          aria-pressed={selectedCategory === 'all'}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
            selectedCategory === 'all'
              ? 'bg-[#0f172a] text-white border-[#0f172a] shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
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
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                isSelected
                  ? 'bg-[#ea580c] text-white border-[#ea580c] shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span className={isSelected ? 'text-white' : 'text-slate-500'}>
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
