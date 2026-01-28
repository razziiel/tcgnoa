import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Icon } from './Icons';

export const InventoryManager: React.FC = () => {
  const { products, theme, setEditingProduct, setIsAddingProduct, toggleAuction } = useStore();
  const [showArchived, setShowArchived] = useState(false);
  const isDark = theme === 'dark';

  const filteredProducts = useMemo(() => {
    return products.filter(p => !!p.archived_at === showArchived);
  }, [products, showArchived]);

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <header className={`shrink-0 flex items-center justify-between p-6 md:p-8 border-b z-30 w-full backdrop-blur-md ${
        isDark ? 'bg-[#0f1115]/80 border-slate-800' : 'bg-[#f8fafc]/80 border-slate-200'
      }`}>
        <div className="flex-1">
          <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase italic">Inventario <span className="text-[#d4af37]">Stock</span></h1>
          <p className="hidden sm:block text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-widest">Control patrimonial centralizado.</p>
        </div>
        <div className="flex gap-4 items-center shrink-0">
          <div className={`flex p-1 rounded-xl ${isDark ? 'bg-white/5 border border-white/5' : 'bg-slate-100'}`}>
            <button 
              onClick={() => setShowArchived(false)}
              className={`px-4 py-2 rounded-lg text-[9px] font-black transition-all uppercase tracking-widest ${!showArchived ? 'bg-[#d4af37] text-slate-900' : 'text-slate-500 hover:text-white'}`}
            >
              Venta
            </button>
            <button 
              onClick={() => setShowArchived(true)}
              className={`px-4 py-2 rounded-lg text-[9px] font-black transition-all uppercase tracking-widest ${showArchived ? 'bg-rose-500 text-white' : 'text-slate-500 hover:text-white'}`}
            >
              Archivados
            </button>
          </div>
          <button 
            onClick={() => setIsAddingProduct(true)}
            className="bg-[#d4af37] text-slate-900 h-10 px-6 rounded-xl font-black text-[10px] flex items-center gap-2 transition-all uppercase tracking-widest"
          >
            <Icon name="plus" className="w-4 h-4" />
            NUEVO
          </button>
        </div>
      </header>

      <div className="flex-1 min-h-0 p-4 md:p-8 w-full">
        <div className={`h-full flex flex-col rounded-2xl border overflow-hidden w-full ${
          isDark ? 'bg-[#15181e] border-slate-800' : 'bg-white border-slate-100'
        }`}>
          <div className="flex-1 overflow-auto no-scrollbar relative w-full">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="z-20">
                  <th className={`sticky top-0 px-6 py-4 border-b border-white/5 text-slate-500 text-[9px] font-black uppercase tracking-widest ${isDark ? 'bg-[#1a1c23]' : 'bg-slate-50'}`}>Item</th>
                  <th className={`sticky top-0 px-6 py-4 border-b border-white/5 text-slate-500 text-[9px] font-black uppercase tracking-widest ${isDark ? 'bg-[#1a1c23]' : 'bg-slate-50'}`}>Estado</th>
                  <th className={`sticky top-0 px-6 py-4 border-b border-white/5 text-slate-500 text-[9px] font-black uppercase tracking-widest ${isDark ? 'bg-[#1a1c23]' : 'bg-slate-50'}`}>{showArchived ? 'Fecha' : 'Costo'}</th>
                  <th className={`sticky top-0 px-6 py-4 border-b border-white/5 text-[#d4af37] text-[9px] font-black uppercase tracking-widest ${isDark ? 'bg-[#1a1c23]' : 'bg-slate-50'}`}>PVP</th>
                  <th className={`sticky top-0 px-6 py-4 border-b border-white/5 text-slate-500 text-[9px] font-black uppercase tracking-widest ${isDark ? 'bg-[#1a1c23]' : 'bg-slate-50'}`}>Stock</th>
                  <th className={`sticky top-0 px-6 py-4 border-b border-white/5 text-slate-500 text-[9px] font-black uppercase tracking-widest text-right ${isDark ? 'bg-[#1a1c23]' : 'bg-slate-50'}`}>Live</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProducts.map((p) => (
                  <tr 
                    key={p.id} 
                    className={`transition-all duration-200 group ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}
                  >
                    <td className="px-6 py-4 cursor-pointer" onClick={() => !showArchived && setEditingProduct(p)}>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-14 rounded-lg overflow-hidden border border-slate-700/50 shadow-sm shrink-0">
                          <img src={p.image_url} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-sm truncate max-w-[200px] md:max-w-[400px] uppercase tracking-tight">{p.name}</div>
                          <div className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-0.5 opacity-60">
                            {p.details.set_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest border ${
                        isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 border-slate-200 text-slate-600'
                      }`}>
                        {p.condition}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-500 text-sm">
                      {showArchived ? new Date(p.archived_at!).toLocaleDateString() : `$${p.purchase_price}`}
                    </td>
                    <td className="px-6 py-4 font-black text-[#d4af37] text-base italic">${p.sale_price}</td>
                    <td className="px-6 py-4">
                       <div className={`h-8 px-3 rounded-lg inline-flex items-center gap-2 font-black text-[10px] ${
                         p.stock < 5 ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'
                       }`}>
                          {p.stock} <span className="text-[8px] opacity-60 uppercase tracking-widest">U</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => toggleAuction(p.id, !p.is_auction)}
                            title={p.is_auction ? "Quitar de subasta" : "Marcar como subasta"}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
                              p.is_auction ? 'bg-amber-500 text-slate-900 shadow-lg' : 'bg-white/5 text-slate-500 hover:text-white'
                            }`}
                          >
                             <Icon name="zap" className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingProduct(p)} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-lg text-slate-500 hover:text-[#d4af37] transition-all">
                             <Icon name="settings" className="w-4 h-4" />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};