
import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Icon } from './Icons';

export const PublicHub: React.FC = () => {
  const { products, claimProduct, theme, claimEvents, placeBid } = useStore();
  const isDark = theme === 'dark';

  const activeEvent = claimEvents.find(e => e.activa);
  // Obtenemos los productos del evento activo
  const claimProducts = products.filter(p => activeEvent?.productIds.includes(p.id));
  const auctions = products.filter(p => p.is_auction && p.stock > 0);

  // El host está "esperando" solo si NO hay un evento activo configurado
  const isWaitingForHost = !activeEvent;

  const [bidInputs, setBidInputs] = useState<Record<string, number>>({});

  return (
    <div className={`min-h-screen pb-32 ${isDark ? 'bg-[#0a0c10]' : 'bg-slate-50'}`}>
      {/* Header Compacto y Agresivo */}
      <div className="bg-black p-8 text-white rounded-b-[3rem] shadow-2xl relative overflow-hidden border-b border-[#d4af37]/30">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Icon name="zap" className="w-64 h-64" />
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <span className="bg-rose-500 px-3 py-1 rounded-lg text-[9px] font-black animate-pulse tracking-tighter">TCG NOA LIVE</span>
               <span className="text-[#d4af37] text-[10px] font-black uppercase tracking-[0.2em]">{activeEvent?.titulo || 'MODO ESPERA'}</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
              TCG <span className="text-[#d4af37]">NOA</span> CLAIM
            </h1>
          </div>
          
          {!isWaitingForHost && (
            <div className="flex gap-4">
               <div className="bg-white/5 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 text-center">
                  <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Items Totales</p>
                  <p className="text-xl font-black text-white">{claimProducts.length}</p>
               </div>
               <div className="bg-[#d4af37]/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-[#d4af37]/30 text-center">
                  <p className="text-[8px] font-black text-[#d4af37] uppercase mb-1">Disponibles</p>
                  <p className="text-xl font-black text-[#d4af37]">{claimProducts.filter(p => p.stock > 0).length}</p>
               </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12">
        
        {/* GRID MASIVO DE CLAIMS */}
        <section className="mb-20">
          {isWaitingForHost ? (
            <div className="py-32 text-center opacity-20">
              <Icon name="package" className="w-20 h-20 mx-auto mb-6" />
              <h3 className="text-2xl font-black uppercase tracking-widest italic">Grid Fuera de Línea</h3>
              <p className="font-medium">El administrador no ha iniciado el evento todavía.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {claimProducts.map(p => {
                const isSoldOut = p.stock <= 0;
                return (
                  <div 
                    key={p.id} 
                    className={`group relative flex flex-col rounded-3xl overflow-hidden border transition-all duration-300 ${
                      isDark ? 'bg-[#15181e] border-slate-800' : 'bg-white border-slate-200 shadow-lg'
                    } ${isSoldOut ? 'opacity-40 grayscale pointer-events-none' : 'hover:scale-[1.05] hover:z-10 hover:shadow-2xl hover:shadow-[#d4af37]/20 hover:border-[#d4af37]/50'}`}
                  >
                    {/* Overlay Reclamado */}
                    {isSoldOut && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center p-2">
                         <div className="bg-rose-600/95 text-white px-3 py-2 rounded-xl font-black text-[10px] border-2 border-white shadow-2xl rotate-[-15deg] uppercase tracking-tighter text-center">
                            CLAIMED!
                         </div>
                      </div>
                    )}

                    {/* Imagen del Producto */}
                    <div className="aspect-[3/4.2] overflow-hidden relative bg-black/20">
                      <img src={p.image_url} className="w-full h-full object-cover" alt="" />
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-md text-[8px] font-black text-white rounded-md uppercase">
                        {p.condition}
                      </div>
                    </div>

                    {/* Info e Interacción */}
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div className="mb-2">
                         <h3 className="font-black text-[10px] leading-tight truncate text-slate-300 uppercase">{p.name}</h3>
                         <p className="text-[8px] text-slate-500 font-bold truncate">{p.details.set_name}</p>
                      </div>
                      
                      <div className="flex items-center justify-between gap-2">
                         <span className="text-sm font-black text-[#d4af37]">${p.sale_price}</span>
                         <button 
                           onClick={() => claimProduct(p)}
                           className={`flex-1 py-2 rounded-xl text-[9px] font-black tracking-widest transition-all ${
                             isSoldOut ? 'bg-slate-800 text-slate-600' : 'bg-emerald-500 text-white hover:bg-emerald-400'
                           }`}
                         >
                           {isSoldOut ? 'SOLD' : 'CLAIM!'}
                         </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* AUCTIONS */}
        {auctions.length > 0 && (
          <section className="mb-20">
             <h2 className="text-xl font-black mb-8 flex items-center gap-3 italic">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                SUBASTAS ACTIVAS
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {auctions.map(p => (
                   <div key={p.id} className={`p-6 rounded-[2.5rem] border flex gap-6 ${isDark ? 'bg-[#15181e] border-slate-800' : 'bg-white shadow-xl'}`}>
                      <img src={p.image_url} className="w-24 h-32 object-cover rounded-2xl shadow-2xl shrink-0" alt="" />
                      <div className="flex-1">
                         <h3 className="font-black text-lg mb-1 leading-tight">{p.name}</h3>
                         <div className="mb-4">
                            <span className="text-[10px] font-black text-amber-500 uppercase block">Oferta Actual</span>
                            <span className="text-3xl font-black">${p.current_bid || p.sale_price}</span>
                         </div>
                         <div className="flex gap-2">
                            <input 
                               type="number" 
                               placeholder="$$$"
                               value={bidInputs[p.id] || ''}
                               onChange={e => setBidInputs({...bidInputs, [p.id]: parseFloat(e.target.value)})}
                               className={`w-20 p-2 rounded-xl outline-none font-black text-sm ${isDark ? 'bg-black/50 border-slate-800' : 'bg-slate-100'}`}
                            />
                            <button 
                              onClick={() => {
                                if (bidInputs[p.id]) {
                                  placeBid(p.id, bidInputs[p.id]);
                                  setBidInputs({...bidInputs, [p.id]: 0});
                                }
                              }}
                              className="flex-1 bg-amber-500 text-slate-900 rounded-xl font-black text-[10px]"
                            >
                              PUJAR
                            </button>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </section>
        )}
      </div>

      {/* Barra de Navegación del Portal Cliente */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-6">
        <div className="bg-black/80 backdrop-blur-2xl border border-white/10 p-4 rounded-3xl shadow-2xl flex items-center justify-around">
           <div className="text-center group cursor-pointer">
              <Icon name="zap" className="w-5 h-5 text-[#d4af37] mx-auto mb-1" />
              <p className="text-[8px] font-black text-white uppercase tracking-tighter">Live Claim</p>
           </div>
           <div className="text-center opacity-40 hover:opacity-100 transition-all cursor-pointer">
              <Icon name="stars" className="w-5 h-5 mx-auto mb-1" />
              <p className="text-[8px] font-black text-white uppercase tracking-tighter">Sorteos</p>
           </div>
           <div className="text-center opacity-40 hover:opacity-100 transition-all cursor-pointer">
              <Icon name="user" className="w-5 h-5 mx-auto mb-1" />
              <p className="text-[8px] font-black text-white uppercase tracking-tighter">Mis Compras</p>
           </div>
        </div>
      </div>
    </div>
  );
};