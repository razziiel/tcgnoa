
import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Icon } from './Icons';
import { Gasto } from '../types';

export const ExpensesManager: React.FC = () => {
  const { expenses, addExpense, removeExpense, theme } = useStore();
  const isDark = theme === 'dark';
  const [formData, setFormData] = useState<Partial<Gasto>>({
    descripcion: '',
    monto: 0,
    categoria: 'Marketing'
  });

  const handleAdd = () => {
    if (!formData.descripcion || !formData.monto) return;
    addExpense({
      id: Math.random().toString(36).substr(2, 9),
      descripcion: formData.descripcion!,
      monto: formData.monto!,
      categoria: formData.categoria as any,
      fecha: new Date().toISOString()
    });
    setFormData({ descripcion: '', monto: 0, categoria: 'Marketing' });
  };

  const inputClass = `w-full p-4 rounded-2xl border outline-none transition-all font-bold ${
    isDark ? 'bg-black/40 border-slate-700 text-white focus:border-[#d4af37]' : 'bg-white border-slate-200 text-slate-900 focus:border-[#d4af37]'
  }`;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header Fijo */}
      <header className={`shrink-0 flex items-center justify-between p-8 border-b sticky top-0 z-10 backdrop-blur-md ${
        isDark ? 'bg-[#0f1115]/80 border-slate-800' : 'bg-[#f8fafc]/80 border-slate-200'
      }`}>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Gestión de <span className="text-rose-500">Gastos</span></h1>
          <p className="text-sm text-slate-500 font-medium">Registra costos de logística, stands, marketing y gastos fijos.</p>
        </div>
      </header>

      {/* Scroll Interno */}
      <div className="flex-1 overflow-y-auto p-8 no-scrollbar space-y-12">
        <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-[#15181e] border-slate-800 shadow-2xl' : 'bg-white border-slate-100 shadow-sm'}`}>
          <h3 className="text-lg font-black mb-8 flex items-center gap-3 uppercase italic">
            <Icon name="plus" className="text-rose-500 w-6 h-6" />
            Nuevo Registro Operativo
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-1">Descripción del Egreso</label>
              <input 
                type="text" 
                placeholder="Ej: Pago de Stand Expo"
                value={formData.descripcion}
                onChange={e => setFormData({...formData, descripcion: e.target.value})}
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-1">Monto ($)</label>
              <input 
                type="number" 
                placeholder="0.00"
                value={formData.monto || ''}
                onChange={e => setFormData({...formData, monto: parseFloat(e.target.value)})}
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-1">Categoría</label>
              <select 
                value={formData.categoria}
                onChange={e => setFormData({...formData, categoria: e.target.value as any})}
                className={`${inputClass} appearance-none cursor-pointer`}
              >
                {['Logística', 'Marketing', 'Personal', 'Alquiler/Stand', 'Otros'].map(c => <option key={c} value={c} className="bg-[#15181e]">{c}</option>)}
              </select>
            </div>
          </div>
          <button 
            onClick={handleAdd}
            className="mt-8 w-full bg-rose-500 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-rose-500/10 hover:bg-rose-600 transition-all active:scale-[0.98] uppercase tracking-widest"
          >
            CONFIRMAR Y REGISTRAR GASTO
          </button>
        </div>

        <div className="space-y-4 pb-20">
          <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest px-1">Historial de Salidas de Caja</h3>
          {expenses.map(e => (
            <div key={e.id} className={`p-6 rounded-3xl border flex items-center justify-between group transition-all ${isDark ? 'bg-[#15181e] border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center shrink-0">
                   <Icon name="trash" className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <p className="font-black text-sm uppercase italic">{e.descripcion}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{new Date(e.fecha).toLocaleDateString()}</span>
                    <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-rose-500 bg-rose-500/5 px-2 py-0.5 rounded">{e.categoria}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <p className="text-2xl font-black text-rose-500 italic drop-shadow-sm">-${e.monto.toLocaleString()}</p>
                <button 
                  onClick={() => removeExpense(e.id)}
                  className="p-3 text-slate-500 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all bg-white/5 rounded-xl"
                >
                  <Icon name="trash" className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {expenses.length === 0 && (
            <div className="py-20 text-center opacity-20 flex flex-col items-center">
              <Icon name="info" className="w-14 h-14 mb-4" />
              <p className="font-black uppercase tracking-widest text-xs">Sin gastos registrados en el periodo actual.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
