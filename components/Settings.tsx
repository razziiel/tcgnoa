
import React from 'react';
import { useStore } from '../store/useStore';
import { Icon } from './Icons';

export const SettingsView: React.FC = () => {
  const { theme, setTheme, activeProfile, activeTerminalId } = useStore();
  const isDark = theme === 'dark';

  const cardClass = `p-8 rounded-[2.5rem] border transition-all ${isDark ? 'bg-[#15181e] border-slate-800 shadow-xl' : 'bg-white border-slate-100 shadow-sm'}`;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header Fijo */}
      <header className={`shrink-0 flex items-center justify-between p-8 border-b sticky top-0 z-10 backdrop-blur-md ${
        isDark ? 'bg-[#0f1115]/80 border-slate-800' : 'bg-[#f8fafc]/80 border-slate-200'
      }`}>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Panel de <span className="text-[#d4af37]">Configuración</span></h1>
          <p className="text-sm text-slate-500 font-medium">Gestión administrativa avanzada y preferencias del sistema.</p>
        </div>
      </header>

      {/* Scroll Interno */}
      <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
          
          {/* Aviso de Terminal Activa */}
          {activeTerminalId && (
            <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
               <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                  <Icon name="check" className="w-6 h-6" />
               </div>
               <div>
                  <p className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.2em]">SISTEMA EN OPERACIÓN</p>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-tighter">Terminal activa vinculada: <span className="text-white">{activeTerminalId}</span></p>
               </div>
            </div>
          )}

          {/* Perfil Único Administrador */}
          <div className={cardClass}>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative shrink-0">
                <img src={activeProfile.avatar_url} className="w-28 h-28 rounded-[2rem] border-2 border-[#d4af37] p-1.5 bg-black/40 shadow-2xl" alt="" />
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-2 rounded-2xl border-4 border-[#15181e] shadow-xl">
                  <Icon name="check" className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-3xl font-black italic uppercase tracking-tighter">{activeProfile.nombre}</h3>
                <p className="text-slate-500 font-bold mb-5 tracking-wide">{activeProfile.email}</p>
                <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-[#d4af37] text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] shadow-lg shadow-[#d4af37]/10">
                  <Icon name="shield" className="w-4 h-4" />
                  ADMINISTRADOR MAESTRO
                </div>
              </div>
            </div>
          </div>

          {/* Apariencia Avanzada */}
          <div className={cardClass}>
            <div className="flex items-center gap-3 mb-10">
              <Icon name="palette" className="w-7 h-7 text-[#d4af37]" />
              <h3 className="font-black text-xl uppercase italic">Motor de Renderizado e Interfaz</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <button
                onClick={() => setTheme('light')}
                className={`group flex flex-col items-center gap-8 p-10 rounded-[2.5rem] border-2 transition-all duration-300 ${
                  theme === 'light' ? 'border-[#d4af37] bg-[#d4af37]/5 shadow-2xl shadow-[#d4af37]/10' : 'border-white/5 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all ${theme === 'light' ? 'bg-[#d4af37] shadow-xl scale-110' : 'bg-white shadow-sm'}`}>
                  <Icon name="sun" className={`w-10 h-10 ${theme === 'light' ? 'text-slate-900' : 'text-slate-400'}`} />
                </div>
                <span className={`font-black text-xs uppercase tracking-[0.3em] ${theme === 'light' ? 'text-slate-900' : 'text-slate-500'}`}>Light Engine</span>
              </button>

              <button
                onClick={() => setTheme('dark')}
                className={`group flex flex-col items-center gap-8 p-10 rounded-[2.5rem] border-2 transition-all duration-300 ${
                  theme === 'dark' ? 'border-[#d4af37] bg-[#d4af37]/10 shadow-2xl shadow-[#d4af37]/20' : 'border-white/5 bg-[#0a0c10] hover:bg-black'
                }`}
              >
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-[#d4af37] shadow-xl scale-110' : 'bg-slate-800 shadow-sm'}`}>
                  <Icon name="moon" className={`w-10 h-10 ${theme === 'dark' ? 'text-slate-900' : 'text-slate-600'}`} />
                </div>
                <span className={`font-black text-xs uppercase tracking-[0.3em] ${theme === 'dark' ? 'text-[#d4af37]' : 'text-slate-500'}`}>Deep Dark V2</span>
              </button>
            </div>
          </div>

          {/* Créditos y Versión */}
          <div className="flex flex-col items-center py-20 opacity-20">
             <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
               <Icon name="zap" className="w-6 h-6" />
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.6em] mb-2">TCG NOA POS Core</p>
             <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Enterprise Edition v2.5.4 • 2025 Release</p>
          </div>
        </div>
      </div>
    </div>
  );
};