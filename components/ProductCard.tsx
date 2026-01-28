
import React from 'react';
import { Product } from '../types';
import { useStore } from '../store/useStore';
import { Icon } from './Icons';

interface ProductCardProps {
  product: Product;
}

const CONDITION_COLORS: Record<string, string> = {
  'Menta': 'bg-emerald-500 text-white',
  'Casi Nueva (NM)': 'bg-blue-500 text-white',
  'Poco Uso (LP)': 'bg-[#d4af37] text-slate-900',
  'Uso Moderado (MP)': 'bg-orange-500 text-white',
  'Muy Usada (HP)': 'bg-rose-500 text-white',
  'Dañada': 'bg-red-500 text-white',
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { activeProfile, addToCart, theme } = useStore();
  const isAdmin = activeProfile?.role === 'Administrador';
  const isDark = theme === 'dark';

  return (
    <div className={`rounded-2xl border p-4 transition-all group relative overflow-hidden flex flex-col ${
      isDark ? 'bg-[#1e2128] border-slate-700/50 hover:border-slate-600' : 'bg-white border-slate-100 shadow-sm hover:shadow-md'
    } duration-300`}>
      {/* Etiqueta de Condición */}
      <div className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider z-10 shadow-sm ${CONDITION_COLORS[product.condition] || 'bg-slate-100'}`}>
        {product.condition}
      </div>

      <div className={`aspect-[3/4.2] rounded-xl overflow-hidden mb-4 flex items-center justify-center relative ${isDark ? 'bg-[#15171e]' : 'bg-slate-50'}`}>
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Indicador de Acabado */}
        {product.details.finish !== 'No-Foil' && (
          <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#d4af37]/90 text-slate-900 rounded-md text-[8px] font-black uppercase tracking-widest">
            {product.details.finish}
          </div>
        )}
      </div>

      <div className="space-y-1 mb-4 px-1">
        <h4 className="font-bold text-sm truncate uppercase tracking-tight" title={product.name}>{product.name}</h4>
        <div className="flex items-center gap-1.5 overflow-hidden opacity-60">
           <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide truncate">{product.details.set_name}</span>
           <span className="w-1 h-1 bg-slate-700 rounded-full shrink-0"></span>
           <span className="text-[9px] font-bold text-[#d4af37] shrink-0">{product.details.card_number}</span>
        </div>
      </div>

      <div className={`flex items-center justify-between mt-auto pt-4 border-t ${isDark ? 'border-slate-700/50' : 'border-slate-100'}`}>
        <div className="flex flex-col">
          <span className="text-lg font-black text-[#d4af37] tracking-tight">${product.sale_price}</span>
          {isAdmin && (
            <span className="text-[8px] text-slate-500 font-bold">
              COSTO: <span className="text-rose-500">${product.purchase_price}</span>
            </span>
          )}
        </div>
        
        <button
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            product.stock > 0 
            ? 'bg-[#d4af37] text-slate-900 hover:bg-[#c5a059]' 
            : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
          }`}
        >
          {product.stock > 0 ? <Icon name="plus" className="w-5 h-5" /> : <span className="text-[7px] font-black leading-tight text-center">N/S</span>}
        </button>
      </div>

      {product.stock > 0 && product.stock <= 2 && (
        <div className="absolute top-3 left-3 px-1.5 py-0.5 bg-rose-500 text-white rounded text-[7px] font-black uppercase tracking-widest">
          LAST {product.stock}
        </div>
      )}
    </div>
  );
};
