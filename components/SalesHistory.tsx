
import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Icon } from './Icons';
import { TransactionStatus, Transaction } from '../types';

const StatusBadge = ({ status }: { status: TransactionStatus }) => {
  const colors = {
    Pagado: 'bg-emerald-500 text-white',
    Pendiente: 'bg-amber-500 text-slate-900',
    Cancelado: 'bg-rose-500 text-white',
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider ${colors[status]}`}>
      {status}
    </span>
  );
};

export const SalesHistory: React.FC = () => {
  const { transactions, updateTransactionStatus, theme } = useStore();
  const [filter, setFilter] = useState<TransactionStatus | 'Todos'>('Todos');
  const [selectedTrx, setSelectedTrx] = useState<Transaction | null>(null);
  const isDark = theme === 'dark';

  const filtered = transactions.filter(t => filter === 'Todos' || t.status === filter);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header Fijo */}
      <header className={`shrink-0 flex items-center justify-between p-8 border-b sticky top-0 z-10 backdrop-blur-md ${
        isDark ? 'bg-[#0f1115]/80 border-slate-800' : 'bg-[#f8fafc]/80 border-slate-200'
      }`}>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Historial de <span className="text-[#d4af37]">Operaciones</span></h1>
          <p className="text-sm text-slate-500 font-medium">Control unificado de ingresos POS y eventos de Reclamo.</p>
        </div>
        
        <div className="flex p-1 bg-black/20 rounded-xl">
           {['Todos', 'Pendiente', 'Pagado', 'Cancelado'].map(f => (
             <button 
               key={f}
               onClick={() => setFilter(f as any)}
               className={`px-4 py-2 rounded-lg text-[9px] font-black transition-all ${filter === f ? 'bg-[#d4af37] text-slate-900 shadow-lg' : 'text-slate-500 hover:text-white'}`}
             >
               {f.toUpperCase()}
             </button>
           ))}
        </div>
      </header>

      {/* Scroll Interno */}
      <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
        {filtered.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 py-32">
            <div className="w-20 h-20 rounded-full bg-slate-800/10 flex items-center justify-center mb-6">
              <Icon name="trends" className="w-10 h-10 opacity-20" />
            </div>
            <h3 className="font-black text-lg text-center uppercase tracking-widest">Sin actividad comercial</h3>
            <p className="text-xs font-medium">Las ventas de POS y Live Claims aparecerán en esta lista.</p>
          </div>
        ) : (
          <div className="space-y-4 pb-20">
            {filtered.map((trx) => (
              <div 
                key={trx.id} 
                onClick={() => setSelectedTrx(trx)}
                className={`p-6 rounded-[2.5rem] border cursor-pointer transition-all hover:scale-[1.01] active:scale-100 group ${
                  isDark ? 'bg-[#15181e] border-slate-800 hover:border-[#d4af37]/50' : 'bg-white border-slate-200 shadow-sm hover:border-[#d4af37]/50'
                }`}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex gap-4">
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${trx.source === 'CLAIM' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'}`}>
                        <Icon name={trx.source === 'CLAIM' ? 'zap' : 'cart'} className="w-7 h-7" />
                     </div>
                     <div>
                       <div className="flex items-center gap-3 mb-2">
                         <StatusBadge status={trx.status} />
                         <span className="text-[10px] text-slate-500 font-black tracking-widest uppercase">{trx.id}</span>
                       </div>
                       <h3 className="font-black text-lg uppercase leading-none group-hover:text-[#d4af37] transition-colors">
                         {trx.items[0].name} {trx.items.length > 1 && <span className="text-[#d4af37]"> +{trx.items.length - 1}</span>}
                       </h3>
                       <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-tighter">
                          Vendido por {trx.vendedor} • {new Date(trx.fecha).toLocaleString()}
                       </p>
                     </div>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Monto Total</p>
                    <p className={`text-4xl font-black italic drop-shadow-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>${trx.total.toFixed(2)}</p>
                  </div>
                </div>

                {trx.status === 'Pendiente' && (
                  <div className="flex gap-2 mt-6 pt-6 border-t border-white/5" onClick={(e) => e.stopPropagation()}>
                     <button 
                       onClick={() => updateTransactionStatus(trx.id, 'Pagado')}
                       className="flex-1 bg-emerald-500 text-white px-6 py-3 rounded-2xl text-[10px] font-black hover:bg-emerald-400 transition-all uppercase tracking-widest shadow-lg shadow-emerald-500/20"
                     >
                       VALIDAR COBRO
                     </button>
                     <button 
                       onClick={() => updateTransactionStatus(trx.id, 'Cancelado')}
                       className="flex-1 bg-rose-500/10 text-rose-500 border border-rose-500/20 px-6 py-3 rounded-2xl text-[10px] font-black hover:bg-rose-500 hover:text-white transition-all uppercase tracking-widest"
                     >
                       CANCELAR
                     </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Detalle de Transacción */}
      {selectedTrx && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
           <div className={`w-full max-w-2xl max-h-[90vh] flex flex-col rounded-[3rem] border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ${
             isDark ? 'bg-[#1a1c23] border-slate-700' : 'bg-white border-slate-200'
           }`}>
              <header className="p-8 border-b border-white/5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${selectedTrx.source === 'CLAIM' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'}`}>
                    <Icon name={selectedTrx.source === 'CLAIM' ? 'zap' : 'cart'} className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter">Detalle de <span className="text-[#d4af37]">Venta</span></h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">{selectedTrx.id}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedTrx(null)} className="p-3 hover:bg-white/5 rounded-2xl transition-all">
                  <Icon name="plus" className="w-6 h-6 text-slate-500 rotate-45" />
                </button>
              </header>

              <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                <div className="grid grid-cols-2 gap-8 mb-10">
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest block mb-1">Cliente</label>
                      <p className="font-bold text-lg">{selectedTrx.cliente}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest block mb-1">Fecha y Hora</label>
                      <p className="font-bold text-slate-400">{new Date(selectedTrx.fecha).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="space-y-4 text-right">
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest block mb-1">Vendedor</label>
                      <p className="font-bold text-lg uppercase">{selectedTrx.vendedor}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest block mb-1">Estado</label>
                      <div className="flex justify-end">
                        <StatusBadge status={selectedTrx.status} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-4">Artículos Desglosados</h4>
                  {selectedTrx.items.map((item, idx) => (
                    <div key={idx} className={`p-4 rounded-2xl border flex items-center justify-between ${
                      isDark ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-100'
                    }`}>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 flex items-center justify-center font-black text-[#d4af37]">
                          {item.quantity}x
                        </div>
                        <div>
                          <p className="font-black text-sm uppercase">{item.name}</p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase">PVP: ${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <p className="font-black text-lg text-white italic">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <footer className="p-8 border-t border-white/5 bg-black/20 shrink-0">
                <div className="flex justify-between items-center">
                  <span className="font-black text-slate-500 uppercase tracking-[0.3em] text-xs">TOTAL OPERACIÓN</span>
                  <span className="text-4xl font-black text-[#d4af37] italic drop-shadow-2xl">${selectedTrx.total.toFixed(2)}</span>
                </div>
                {selectedTrx.status === 'Pendiente' && (
                   <div className="flex gap-4 mt-8">
                     <button 
                       onClick={() => { updateTransactionStatus(selectedTrx.id, 'Pagado'); setSelectedTrx(null); }}
                       className="flex-1 bg-[#d4af37] text-slate-900 py-4 rounded-2xl font-black text-sm shadow-xl shadow-[#d4af37]/20 uppercase tracking-widest hover:scale-[1.02] transition-all"
                     >
                       VALIDAR COBRO
                     </button>
                   </div>
                )}
              </footer>
           </div>
        </div>
      )}
    </div>
  );
};
