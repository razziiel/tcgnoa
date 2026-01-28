
import React from 'react';
import { useStore } from '../store/useStore';
import { Icon } from './Icons';

export const ArqueoHistory: React.FC = () => {
  const { arqueos, theme } = useStore();
  const isDark = theme === 'dark';

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header Fijo */}
      <header className={`shrink-0 flex items-center justify-between p-8 border-b sticky top-0 z-10 backdrop-blur-md ${
        isDark ? 'bg-[#0f1115]/80 border-slate-800' : 'bg-[#f8fafc]/80 border-slate-200'
      }`}>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Reportes de <span className="text-[#d4af37]">Arqueo</span></h1>
          <p className="text-sm text-slate-500 font-medium">Auditoría detallada de cierres de caja y rendimiento de terminales.</p>
        </div>
      </header>

      {/* Scroll Interno */}
      <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
        {arqueos.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 py-32">
            <Icon name="inventory" className="w-16 h-16 opacity-10 mb-4" />
            <h3 className="font-black text-lg uppercase tracking-widest">Sin arqueos registrados</h3>
            <p className="text-xs font-medium">Al cerrar una terminal, el reporte consolidado aparecerá aquí.</p>
          </div>
        ) : (
          <div className="space-y-4 pb-20">
            {arqueos.map((arq) => (
              <div key={arq.id} className={`p-6 rounded-[2.5rem] border transition-all ${
                isDark ? 'bg-[#15181e] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-black text-[#d4af37] uppercase tracking-widest">{arq.id}</span>
                      <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Terminal: {arq.terminalNombre}</span>
                    </div>
                    <h3 className="font-black text-xl uppercase italic">Arqueo por {arq.vendedorNombre}</h3>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Saldo Final</p>
                    <p className="text-3xl font-black text-emerald-500 drop-shadow-md">${arq.totalVentas.toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-3xl bg-black/30 border border-white/5">
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Apertura</p>
                    <p className="text-xs font-bold text-slate-300">{new Date(arq.fechaApertura).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Cierre</p>
                    <p className="text-xs font-bold text-slate-300">{new Date(arq.fechaCierre).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Operaciones</p>
                    <p className="text-xs font-bold text-slate-300">{arq.cantidadVentas} Ventas</p>
                  </div>
                  <div className="flex items-end justify-start lg:justify-end">
                     <button className="text-[10px] font-black text-[#d4af37] hover:underline uppercase tracking-widest bg-[#d4af37]/10 px-4 py-2 rounded-xl transition-all">Ver Detalle</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
