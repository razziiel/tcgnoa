import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Icon } from './Icons';
import { Terminal } from '../types';

export const TerminalsManager: React.FC = () => {
  const { terminals, addTerminal, openTerminal, closeTerminal, activeTerminalId, theme, transactions, activeProfile, showNotification } = useStore();
  const isDark = theme === 'dark';
  const [showSummary, setShowSummary] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTerminalData, setNewTerminalData] = useState({ nombre: '', ubicacion: '' });

  const handleOpen = (id: string) => {
    if (activeTerminalId) return;
    openTerminal(id);
  };

  const handleCloseConfirm = () => {
    if (showSummary) {
      closeTerminal(showSummary);
      setShowSummary(null);
    }
  };

  const handleCreateTerminal = () => {
    if (!newTerminalData.nombre || !newTerminalData.ubicacion) {
      showNotification("Por favor completa todos los campos", "error");
      return;
    }
    const newTerminal: Terminal = {
      id: `T${terminals.length + 1}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      nombre: newTerminalData.nombre,
      ubicacion: newTerminalData.ubicacion,
      activa: false
    };
    addTerminal(newTerminal);
    setShowCreateModal(false);
    setNewTerminalData({ nombre: '', ubicacion: '' });
    showNotification("Terminal creada con éxito", "success");
  };

  const getSessionSales = (terminal: Terminal) => {
    if (!terminal.ultimaApertura) return 0;
    const openingDate = new Date(terminal.ultimaApertura);
    return transactions
      .filter(tx => tx.terminalId === terminal.id && new Date(tx.fecha) >= openingDate)
      .reduce((acc, curr) => acc + curr.total, 0);
  };

  const cardClass = `p-6 rounded-[2.5rem] border transition-all ${isDark ? 'bg-[#15181e] border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`;
  const inputClass = `w-full p-4 rounded-2xl border outline-none transition-all font-bold ${
    isDark ? 'bg-black/40 border-slate-700 text-white focus:border-[#d4af37]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#d4af37]'
  }`;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header Fijo */}
      <header className={`shrink-0 flex items-center justify-between p-8 border-b sticky top-0 z-10 backdrop-blur-md ${
        isDark ? 'bg-[#0f1115]/80 border-slate-800' : 'bg-[#f8fafc]/80 border-slate-200'
      }`}>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Red de <span className="text-[#d4af37]">Terminales</span></h1>
          <p className="text-sm text-slate-500 font-medium">Control operativo y auditoría de flujo de caja de todas las sucursales.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-[#d4af37] text-slate-900 px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2 shadow-lg shadow-[#d4af37]/20 hover:scale-105 transition-all"
        >
          <Icon name="plus" className="w-4 h-4" />
          NUEVA TERMINAL
        </button>
      </header>

      {/* Scroll Interno */}
      <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          {terminals.map(t => {
            const isCurrentMySession = activeTerminalId === t.id;
            const isOccupiedByOther = t.activa && t.userId !== activeProfile.id;
            const sessionSales = getSessionSales(t);

            return (
              <div key={t.id} className={`${cardClass} ${isCurrentMySession ? 'ring-2 ring-[#d4af37] ring-offset-4 ring-offset-[#0f1115]' : ''} ${isOccupiedByOther ? 'opacity-70' : ''}`}>
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${t.activa ? 'bg-[#d4af37] shadow-lg shadow-[#d4af37]/20' : 'bg-slate-800'}`}>
                    <Icon name="cart" className={`w-7 h-7 ${t.activa ? 'text-slate-900' : 'text-slate-500'}`} />
                  </div>
                  <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${t.activa ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'}`}>
                    {t.activa ? (isOccupiedByOther ? 'OCUPADA' : 'TU SESIÓN') : 'CERRADA'}
                  </div>
                </div>
                
                <h3 className="font-black text-xl mb-1 uppercase italic">{t.nombre}</h3>
                <p className="text-slate-500 text-xs mb-4 font-medium uppercase tracking-tighter">{t.ubicacion}</p>
                
                {t.activa && (
                  <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-black/20 border border-white/5">
                     <div className="w-8 h-8 rounded-lg bg-[#d4af37]/20 flex items-center justify-center">
                        <Icon name="user" className="w-4 h-4 text-[#d4af37]" />
                     </div>
                     <div>
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Operador Actual</p>
                        <p className="text-[10px] font-black text-white uppercase">{t.userName || 'Usuario'}</p>
                     </div>
                  </div>
                )}

                {t.activa ? (
                  <div className="space-y-4">
                     <div className="p-4 rounded-xl bg-black/20 border border-white/5 text-center">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Recaudación Sesión</p>
                        <p className="text-2xl font-black text-[#d4af37]">${sessionSales.toLocaleString()}</p>
                     </div>
                     <button 
                      onClick={() => setShowSummary(t.id)}
                      disabled={isOccupiedByOther}
                      className={`w-full py-4 rounded-2xl font-black text-[10px] tracking-widest transition-all border uppercase ${
                        isOccupiedByOther 
                        ? 'border-slate-800 text-slate-700 cursor-not-allowed' 
                        : 'border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white shadow-lg shadow-rose-500/10'
                      }`}
                    >
                      {isOccupiedByOther ? 'BLOQUEADA POR OTRO USUARIO' : 'FINALIZAR Y ARQUEAR CAJA'}
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleOpen(t.id)}
                    disabled={activeTerminalId !== null}
                    className={`w-full py-4 rounded-2xl font-black text-[10px] tracking-widest transition-all border uppercase ${
                      activeTerminalId 
                      ? 'border-slate-800 text-slate-700 cursor-not-allowed' 
                      : 'border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-slate-900 shadow-lg shadow-[#d4af37]/10'
                    }`}
                  >
                    ABRIR TERMINAL DE COBRO
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL CREAR TERMINAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
           <div className={`w-full max-w-md p-8 rounded-[2.5rem] border ${isDark ? 'bg-[#1a1c23] border-slate-700 shadow-2xl' : 'bg-white border-slate-100'} animate-in zoom-in-95 duration-200`}>
              <h3 className="text-2xl font-black mb-2 uppercase italic">Nueva <span className="text-[#d4af37]">Terminal</span></h3>
              <p className="text-slate-500 text-sm mb-8 font-medium">Registra un nuevo punto de venta en el sistema.</p>
              
              <div className="space-y-6 mb-8">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block tracking-widest">Nombre de la Terminal</label>
                  <input 
                    type="text" 
                    placeholder="Ej: Caja Stand Expo"
                    value={newTerminalData.nombre}
                    onChange={e => setNewTerminalData({...newTerminalData, nombre: e.target.value})}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block tracking-widest">Ubicación / Punto</label>
                  <input 
                    type="text" 
                    placeholder="Ej: Stand #4 - Galería"
                    value={newTerminalData.ubicacion}
                    onChange={e => setNewTerminalData({...newTerminalData, ubicacion: e.target.value})}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                 <button onClick={() => setShowCreateModal(false)} className="flex-1 py-4 font-black text-slate-500 uppercase text-xs tracking-widest">Cancelar</button>
                 <button 
                  onClick={handleCreateTerminal}
                  className="flex-[2] bg-[#d4af37] text-slate-900 py-4 rounded-2xl font-black shadow-lg shadow-[#d4af37]/20 hover:scale-[1.02] transition-all uppercase text-xs tracking-widest"
                 >
                   REGISTRAR PUNTO
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* MODAL RESUMEN CIERRE */}
      {showSummary && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
           <div className={`w-full max-w-md p-8 rounded-[2.5rem] border ${isDark ? 'bg-[#1a1c23] border-slate-700' : 'bg-white border-slate-100'} shadow-2xl`}>
              <h3 className="text-2xl font-black mb-2 uppercase italic">Resumen de <span className="text-rose-500">Cierre</span></h3>
              <p className="text-slate-500 text-sm mb-6 font-medium">Confirma los montos para consolidar el reporte de arqueo.</p>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-4 border-b border-white/5">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">Total en Efectivo</span>
                  <span className="font-black text-emerald-500 text-2xl">${getSessionSales(terminals.find(t => t.id === showSummary)!).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-4">
                 <button onClick={() => setShowSummary(null)} className="flex-1 py-4 font-black text-slate-500 uppercase text-xs tracking-widest">Volver</button>
                 <button 
                  onClick={handleCloseConfirm}
                  className="flex-[2] bg-rose-500 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-rose-600 transition-all uppercase text-xs tracking-widest"
                 >
                   CONFIRMAR ARQUEO
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};