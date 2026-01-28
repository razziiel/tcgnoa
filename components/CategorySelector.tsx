
import React from 'react';
import { useStore } from '../store/useStore';
import { MOCK_CATEGORIES } from '../lib/mockData';
import { Icon } from './Icons';
import { SubCategoryType } from '../types';

const SUB_CATEGORIES: { id: SubCategoryType; label: string; icon: string }[] = [
  { id: 'Cartas Sueltas', label: 'Cartas', icon: 'sword' },
  { id: 'Sobres', label: 'Sobres', icon: 'zap' },
  { id: 'Sellados', label: 'Sellados', icon: 'package' },
  { id: 'Carpetas', label: 'Carpetas', icon: 'shield' },
  { id: 'Protectores', label: 'Protectores', icon: 'stars' },
];

export const CategorySelector: React.FC = () => {
  const { selectedCategoryId, setSelectedCategoryId, selectedSubCategory, setSelectedSubCategory, theme } = useStore();
  const isDark = theme === 'dark';

  const btnBase = "flex-shrink-0 px-5 py-2.5 rounded-xl text-[10px] font-black transition-all flex items-center gap-2.5 border-2 uppercase tracking-widest";
  const activeClass = "bg-[#d4af37] border-[#d4af37] text-slate-900 shadow-lg shadow-[#d4af37]/20";
  const inactiveClass = isDark ? "bg-white/5 border-transparent text-slate-500 hover:text-slate-300" : "bg-slate-100 border-transparent text-slate-500 hover:bg-slate-200";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => { setSelectedCategoryId(null); setSelectedSubCategory(null); }}
          className={`${btnBase} ${!selectedCategoryId ? activeClass : inactiveClass}`}
        >
          <Icon name="package" className="w-3.5 h-3.5" />
          TODOS LOS JUEGOS
        </button>

        {MOCK_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategoryId(cat.id === selectedCategoryId ? null : cat.id)}
            className={`${btnBase} ${selectedCategoryId === cat.id ? activeClass : inactiveClass}`}
          >
            <Icon name={cat.icon} className="w-3.5 h-3.5" />
            {cat.name}
          </button>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {SUB_CATEGORIES.map((sub) => (
          <button
            key={sub.id}
            onClick={() => setSelectedSubCategory(sub.id === selectedSubCategory ? null : sub.id)}
            className={`px-4 py-2 rounded-lg text-[9px] font-black flex items-center gap-2 transition-all border uppercase tracking-wider ${
              selectedSubCategory === sub.id
                ? 'bg-white text-slate-900 border-white'
                : isDark ? 'bg-white/5 border-white/10 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}
          >
            {sub.label}
          </button>
        ))}
      </div>
    </div>
  );
};
