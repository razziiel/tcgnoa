import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Icon } from './Icons';
import { ClaimEvent } from '../types';

export const AdminLiveManager: React.FC = () => {
  const { 
    products, sorteos = [], realizarSorteo, addSorteo,
    claimEvents = [], addClaimEvent, toggleClaimEvent, updateClaimEvent,
    transactions = [], updateTransactionStatus, theme 
  } = useStore();
  const isDark = theme === 'dark';

  const [searchTerm, setSearchTerm] = useState('');
  const [showEventCreator, setShowEventCreator] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [eventForm, setEventForm] = useState<Partial<ClaimEvent>>({
    titulo: '',
    descripcion: '',
    productIds: []
  });

  const pendingClaims = transactions.filter(t => t.source === 'CLAIM' && t.status === 'Pendiente');

  const availableProducts = useMemo(() => {
    return products.filter(p => 
      !p.archived_at && 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const handleOpenCreator = (eventToEdit?: ClaimEvent) => {
    if (eventToEdit) {
      setEditingEventId(eventToEdit.id);
      setEventForm({
        titulo: eventToEdit.titulo,
        descripcion: eventToEdit.descripcion,
        productIds: eventToEdit.productIds || []
      });
    } else {
      setEditingEventId(null);
      setEventForm({ titulo: '', descripcion: '', productIds: [] });
    }
    setShowEventCreator(true);
  };

  const handleSaveEvent = async () => {
    if (!eventForm.titulo) return alert("El título es obligatorio");
    setIsSaving(true);
    try {
      if (editingEventId) {
        await updateClaimEvent(editingEventId, eventForm);
      } else {
        await addClaimEvent({
          titulo: eventForm.titulo,
          descripcion: eventForm.descripcion || '',
          fecha: new Date().toISOString(),
          activa: false,
          productIds: eventForm.productIds || []
        });
      }
      setShowEventCreator(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleProductInEvent = (id: string) => {
    const currentIds = [...(eventForm.productIds || [])];
    if (currentIds.includes(id)) {
      setEventForm({ ...eventForm, productIds: currentIds.filter(pid => pid !== id) });
    } else {
      setEventForm({ ...eventForm, productIds: [...currentIds, id] });
    }
  };

  const cardClass = `p-6 md:p-8 rounded-2xl border ${isDark ? 'bg-[#15181e] border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`;
  const inputClass = `w-full p-4 rounded-xl border outline-none transition-all font-bold ${
    isDark ? 'bg-black/40 border-slate-700 text-white focus:border-[#d4af37]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#d4af37]'
  }`;

  return (
    <div className="flex flex-col h-full w-full overflow-hidden relative">
      <header className={`shrink-0 flex items-center justify-between p-6 md:p-8 border-b z-10 w-full backdrop-blur-md ${
        isDark ? 'bg-[#0f1115]/80 border-slate-800' : 'bg-[#f8fafc]/80 border-slate-200'
      }`}>
        <div className="flex-1">
          <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase italic">Consola <span className="text-[#d4af37]">Live</span></h1>
          <p className="hidden sm:block text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-widest">Gestión de eventos en vivo.</p>
        </div>
        <div className="shrink-0">
          <button 
            onClick={() => handleOpenCreator()}
            className="bg-[#d4af37] text-slate-900 h-10 px-6 rounded-xl font-black text-[10px] flex items-center gap-2 transition-all uppercase tracking-widest active:scale-95"
          >
            <Icon name="plus" className="w-4 h-4" />
            NUEVA COLECCIÓN
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar space-y-8 w-full">
        {/* CLAIMS PENDIENTES */}
        <section className={cardClass}>
          <div className="flex items-center justify-between mb-8">
             <h2 className="text-lg font-black flex items-center gap-3 uppercase italic">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                Claims Pendientes
             </h2>
             <span className="px-3 py-1 bg-rose-500/10 text-rose-500 rounded-lg text-[9px] font-black uppercase tracking-widest">
               {pendingClaims.length} RECLAMADOS
             </span>
          </div>
          
          <div className="grid gap-4">
             {pendingClaims.length > 0 ? pendingClaims.map(tx => (
               <div key={tx.id} className="flex items-center justify-between p-6 rounded-xl bg-black/40 border border-white/5 group hover:border-[#d4af37]/30 transition-all">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37]">
                        <Icon name="cart" className="w-5 h-5" />
                     </div>
                     <div className="min-w-0">
                        <p className="font-bold text-sm uppercase tracking-tight text-white truncate max-w-[150px] md:max-w-none">{tx.items[0].name}</p>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide mt-0.5">
                          {tx.cliente} • {new Date(tx.fecha).toLocaleTimeString()}
                        </p>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                     <p className="text-xl font-black text-[#d4af37] italic tracking-tighter">${tx.total}</p>
                     <div className="flex gap-2">
                        <button onClick={() => updateTransactionStatus(tx.id, 'Pagado')} className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest">OK</button>
                        <button onClick={() => updateTransactionStatus(tx.id, 'Cancelado')} className="bg-rose-500/10 text-rose-500 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border border-rose-500/20">X</button>
                     </div>
                  </div>
               </div>
             )) : (
               <div className="text-center py-10 opacity-30 text-xs font-bold uppercase tracking-widest">Sin reclamos activos</div>
             )}
          </div>
        </section>

        {/* EVENTOS Y SORTEOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          <section className={cardClass}>
             <h2 className="text-lg font-black mb-6 uppercase italic">Catálogos Live</h2>
             <div className="space-y-4">
               {claimEvents.map(e => (
                 <div key={e.id} className={`p-5 rounded-xl border transition-all ${e.activa ? 'bg-[#d4af37]/10 border-[#d4af37]' : 'bg-black/20 border-white/5'}`}>
                    <div className="flex justify-between items-center mb-4">
                       <p className="font-bold text-sm uppercase italic">{e.titulo}</p>
                       <div className="flex gap-2">
                          <button onClick={() => handleOpenCreator(e)} className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg text-slate-400 hover:text-white"><Icon name="settings" className="w-4 h-4" /></button>
                          <button 
                            onClick={() => toggleClaimEvent(e.id)}
                            className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${e.activa ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'}`}
                          >
                            {e.activa ? 'OFF' : 'ON'}
                          </button>
                       </div>
                    </div>
                    <span className="px-2 py-0.5 bg-black/50 text-[#d4af37] text-[8px] font-black rounded uppercase tracking-widest">{(e.productIds || []).length} ITEMS</span>
                 </div>
               ))}
             </div>
          </section>

          <section className={cardClass}>
            <h2 className="text-lg font-black mb-6 uppercase italic">Sorteos</h2>
            <div className="space-y-4">
               {sorteos.map(s => (
                 <div key={s.id} className="p-5 rounded-xl bg-black/30 border border-white/5">
                    <h4 className="font-bold text-sm uppercase italic mb-1">{s.titulo}</h4>
                    <p className="text-[9px] font-bold text-slate-500 uppercase mb-4 tracking-widest">{s.participantes?.length || 0} PARTICIPANTES</p>
                    {s.ganador ? (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-center">
                         <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">GANADOR: {s.ganador} 🏆</p>
                      </div>
                    ) : (
                      <button onClick={() => realizarSorteo(s.id)} className="w-full bg-[#d4af37] text-slate-900 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest">GIRAR</button>
                    )}
                 </div>
               ))}
               <button onClick={() => addSorteo({titulo: 'Sorteo Live', participantes: ['Chat User #1', 'User #2'], activo: true})} className="w-full py-4 rounded-xl border-2 border-dashed border-slate-800 text-[9px] font-black text-slate-600 hover:text-white uppercase tracking-widest">+ NUEVO</button>
            </div>
          </section>
        </div>
      </div>

      {/* MODAL CREATOR - Renderizado Seguro al Final */}
      {showEventCreator && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
           <div className={`w-full max-w-4xl max-h-[90vh] flex flex-col rounded-[2.5rem] border shadow-2xl overflow-hidden ${
             isDark ? 'bg-[#1a1c23] border-slate-700' : 'bg-white border-slate-200'
           } animate-in zoom-in-95 duration-200`}>
              <header className="p-8 border-b border-white/5 flex items-center justify-between shrink-0">
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">
                  {editingEventId ? 'Editar' : 'Nueva'} <span className="text-[#d4af37]">Colección</span>
                </h3>
                <button onClick={() => setShowEventCreator(false)} className="text-slate-500 hover:text-white font-bold transition-colors">Cerrar</button>
              </header>

              <div className="flex-1 overflow-y-auto p-8 no-scrollbar flex flex-col gap-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                       <div>
                          <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block tracking-widest">Título del Evento</label>
                          <input 
                            type="text" 
                            placeholder="Ej: Pokemon Drop Special"
                            value={eventForm.titulo}
                            onChange={e => setEventForm({...eventForm, titulo: e.target.value})}
                            className={inputClass}
                          />
                       </div>
                       <div>
                          <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block tracking-widest">Descripción</label>
                          <textarea 
                            rows={3}
                            placeholder="Detalles para el chat..."
                            value={eventForm.descripcion}
                            onChange={e => setEventForm({...eventForm, descripcion: e.target.value})}
                            className={`${inputClass} resize-none`}
                          />
                       </div>
                    </div>

                    <div className="flex flex-col">
                       <div className="bg-[#d4af37]/10 p-6 rounded-3xl border border-[#d4af37]/20 flex-1 flex flex-col justify-center text-center">
                          <p className="text-[10px] font-black text-[#d4af37] uppercase tracking-[0.2em] mb-2">Items Seleccionados</p>
                          <p className="text-5xl font-black text-white italic">{(eventForm.productIds || []).length}</p>
                          <p className="text-[9px] font-bold text-slate-500 uppercase mt-2">Listos para el Hub</p>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <h4 className="text-sm font-black uppercase italic">Seleccionar Productos</h4>
                       <div className="relative w-64">
                          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input 
                            type="text" 
                            placeholder="Filtrar..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-black/40 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-xs font-bold text-white outline-none focus:border-[#d4af37]"
                          />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                       {availableProducts.map(p => {
                         const isSelected = eventForm.productIds?.includes(p.id);
                         return (
                           <div 
                             key={p.id}
                             onClick={() => toggleProductInEvent(p.id)}
                             className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col gap-2 relative ${
                               isSelected ? 'bg-[#d4af37]/20 border-[#d4af37]' : 'bg-black/20 border-white/5 hover:bg-black/40'
                             }`}
                           >
                              {isSelected && <Icon name="check" className="absolute top-2 right-2 w-4 h-4 text-[#d4af37]" />}
                              <div className="aspect-[3/4.2] rounded-lg overflow-hidden bg-black/40 border border-white/5">
                                 <img src={p.image_url} className="w-full h-full object-cover" alt="" />
                              </div>
                              <p className="text-[10px] font-black uppercase truncate leading-tight">{p.name}</p>
                              <p className="text-[9px] font-bold text-[#d4af37]">${p.sale_price}</p>
                           </div>
                         );
                       })}
                    </div>
                 </div>
              </div>

              <footer className="p-8 border-t border-white/5 shrink-0 flex gap-4">
                 <button 
                   onClick={() => setShowEventCreator(false)}
                   className="flex-1 py-4 font-black text-slate-500 uppercase text-xs tracking-widest"
                 >
                   Cancelar
                 </button>
                 <button 
                   onClick={handleSaveEvent}
                   disabled={isSaving}
                   className="flex-[2] bg-[#d4af37] text-slate-900 py-4 rounded-2xl font-black shadow-lg shadow-[#d4af37]/20 hover:scale-[1.02] transition-all uppercase text-xs tracking-widest disabled:opacity-50"
                 >
                   {isSaving ? 'GUARDANDO...' : (editingEventId ? 'GUARDAR CAMBIOS' : 'CREAR COLECCIÓN LIVE')}
                 </button>
              </footer>
           </div>
        </div>
      )}
    </div>
  );
};