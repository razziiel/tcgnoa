import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Icon } from './Icons';

export const PosCart: React.FC = () => {
  const { cart, updateCartQuantity, clearCart, theme, completeSale, activeTerminalId } = useStore();
  const [customerName, setCustomerName] = useState('');
  const isDark = theme === 'dark';

  const currentTotal = cart.reduce((acc, item) => acc + (item.sale_price * item.quantity), 0);

  if (!activeTerminalId) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500 p-6 text-center">
        <Icon name="shield" className="w-12 h-12 opacity-20 mb-4 text-[#d4af37]" />
        <h4 className={`text-sm font-black mb-2 uppercase italic ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>CAJA CERRADA</h4>
        <p className="text-[10px] font-medium leading-relaxed uppercase tracking-tight">Abre una terminal para comenzar.</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500 p-6 text-center">
        <Icon name="cart" className="w-12 h-12 opacity-20 mb-4 text-[#d4af37]" />
        <h4 className={`text-sm font-black mb-2 uppercase italic ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>Venta Vacía</h4>
        <p className="text-[10px] font-medium uppercase tracking-tight">Escanea o selecciona ítems.</p>
      </div>
    );
  }

  const handleCompleteSale = () => {
    completeSale(customerName);
    setCustomerName('');
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h3 className="font-black text-lg uppercase italic tracking-tighter">Ticket <span className="text-[#d4af37]">POS</span></h3>
        <button onClick={clearCart} className="text-[8px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 px-2 py-1.5 rounded-lg border border-rose-500/20">Anular</button>
      </div>

      <div className="mb-6 shrink-0">
        <label className="text-[9px] font-black uppercase text-slate-500 mb-2 block tracking-widest">Cliente</label>
        <div className="relative">
          <input 
            type="text" 
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Consumidor Final..."
            className={`w-full p-3.5 rounded-xl border text-xs font-bold focus:border-[#d4af37] outline-none transition-all ${isDark ? 'bg-[#1e2128] border-slate-700 text-white shadow-inner' : 'bg-slate-50 border-slate-200'}`}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-3 no-scrollbar pb-6">
        {cart.map((item) => (
          <div key={item.id} className={`flex gap-4 p-4 rounded-xl border group transition-all ${isDark ? 'bg-[#1e2128] border-white/5' : 'bg-white border-slate-100'}`}>
            <div className={`w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 border shrink-0 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-200 border-slate-300'}`}>
              <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <h4 className="font-bold text-[11px] truncate uppercase tracking-tight mb-0.5">{item.name}</h4>
              <p className="text-[8px] font-black uppercase text-[#d4af37] mb-2">{item.condition}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-[#d4af37] italic">${(item.sale_price * item.quantity)}</span>
                
                <div className={`flex items-center gap-2 rounded-lg p-1 border ${isDark ? 'bg-black/40 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
                  <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="w-6 h-6 rounded flex items-center justify-center transition-all bg-slate-800 text-white text-xs">-</button>
                  <span className="text-[10px] font-black w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="w-6 h-6 rounded flex items-center justify-center transition-all bg-slate-800 text-white text-xs">+</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={`mt-auto pt-6 border-t-2 ${isDark ? 'border-white/5' : 'border-slate-200'} shrink-0`}>
        <div className="flex justify-between items-center mb-4 px-1">
          <span className="font-black text-slate-500 uppercase tracking-widest text-[10px]">Total</span>
          <span className="font-black text-2xl text-[#d4af37] italic">${currentTotal}</span>
        </div>
        <button 
          onClick={handleCompleteSale}
          className="w-full bg-[#d4af37] text-slate-900 h-14 rounded-xl font-black text-sm hover:bg-[#c5a059] shadow-lg transition-all active:scale-95 uppercase tracking-widest"
        >
          PAGAR
        </button>
      </div>
    </div>
  );
};