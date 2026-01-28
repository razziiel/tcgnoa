import React, { useState, useCallback, useMemo, useRef } from 'react';
import { useStore } from '../store/useStore';
import { Product } from '../types';
import { MOCK_CATEGORIES } from '../lib/mockData';

export const AddProductView: React.FC = () => {
  const { addProduct, setIsAddingProduct, theme, uploadImage } = useStore();
  const [isUploading, setIsUploading] = useState(false);
  const isDark = theme === 'dark';
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [singleProduct, setSingleProduct] = useState<Partial<Product>>({
    name: '',
    category_id: MOCK_CATEGORIES[0].id,
    sub_category: 'Cartas Sueltas',
    condition: 'Casi Nueva (NM)',
    purchase_price: 0,
    sale_price: 0,
    stock: 1,
    details: { set_name: '', card_number: '', rarity: '', finish: 'No-Foil', year: new Date().getFullYear() },
    image_url: '' 
  });

  const [markup, setMarkup] = useState<number>(30);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadImage(file);
      setSingleProduct(p => ({ ...p, image_url: url }));
    } catch (err) {
      console.error("Error subiendo a Storage:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePriceChange = useCallback((field: 'cost' | 'sale' | 'markup', val: number) => {
    if (field === 'cost') {
      const newSale = val * (1 + (markup / 100));
      setSingleProduct(prev => ({ ...prev, purchase_price: val, sale_price: parseFloat(newSale.toFixed(2)) }));
    } else if (field === 'sale') {
      const cost = singleProduct.purchase_price || 0;
      const newMarkup = cost > 0 ? ((val - cost) / cost) * 100 : 0;
      setSingleProduct(prev => ({ ...prev, sale_price: val }));
      setMarkup(parseFloat(newMarkup.toFixed(1)));
    } else if (field === 'markup') {
      const cost = singleProduct.purchase_price || 0;
      const newSale = cost * (1 + (val / 100));
      setMarkup(val);
      setSingleProduct(prev => ({ ...prev, sale_price: parseFloat(newSale.toFixed(2)) }));
    }
  }, [markup, singleProduct.purchase_price]);

  const handleAddSingle = () => {
    if (!singleProduct.name) return alert('El nombre es obligatorio');
    addProduct({
      ...singleProduct,
      image_url: singleProduct.image_url || 'https://via.placeholder.com/300x400?text=No+Image',
    });
    setIsAddingProduct(false);
  };

  const inputClass = useMemo(() => `w-full p-4 rounded-2xl border outline-none transition-all font-bold ${
    isDark ? 'bg-[#15181e] border-slate-700 text-white focus:border-[#d4af37]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#d4af37]'
  }`, [isDark]);

  return (
    <div className={`fixed inset-0 z-[110] flex items-center justify-center p-6 ${isDark ? 'bg-black/90' : 'bg-slate-900/60'} backdrop-blur-md`}>
      <div className={`w-full max-w-4xl max-h-[95vh] flex flex-col rounded-[2.5rem] shadow-2xl overflow-hidden border ${isDark ? 'bg-[#1a1c23] border-slate-700' : 'bg-white border-slate-200'}`}>
        <header className="p-8 border-b flex items-center justify-between">
            <h2 className="text-2xl font-black">Nuevo <span className="text-[#d4af37]">Producto</span></h2>
            <button onClick={() => setIsAddingProduct(false)} className="text-slate-500 font-bold">Cerrar</button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                  <div 
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    className={`aspect-[3/4.2] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group ${
                      isDark ? 'bg-black/20 border-slate-700 hover:border-[#d4af37]' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    {isUploading ? <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#d4af37]" /> : 
                     singleProduct.image_url ? <img src={singleProduct.image_url} className="w-full h-full object-cover" /> :
                     <span className="text-xs font-black uppercase text-slate-500">Subir Imagen</span>
                    }
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block tracking-widest">Nombre del Producto</label>
                    <input type="text" placeholder="Charizard VMAX..." value={singleProduct.name} onChange={e => setSingleProduct(p => ({...p, name: e.target.value}))} className={inputClass} />
                  </div>
              </div>

              <div className="space-y-6">
                <div className={`p-8 rounded-[2rem] border space-y-6 ${isDark ? 'bg-[#d4af37]/5 border-[#d4af37]/20' : 'bg-amber-50'}`}>
                   <h4 className="text-xs font-black uppercase text-[#d4af37] tracking-widest">Precios</h4>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] font-black text-slate-500 uppercase mb-2 block">Costo ($)</label>
                        <input type="number" value={singleProduct.purchase_price} onChange={e => handlePriceChange('cost', parseFloat(e.target.value))} className={inputClass} />
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-[#d4af37] uppercase mb-2 block">Margen (%)</label>
                        <input type="number" value={markup} onChange={e => handlePriceChange('markup', parseFloat(e.target.value))} className={inputClass} />
                      </div>
                   </div>
                   <div className="pt-4 border-t border-[#d4af37]/10">
                      <label className="text-[9px] font-black text-[#d4af37] uppercase mb-2 block">PVP FINAL</label>
                      <input type="number" value={singleProduct.sale_price} onChange={e => handlePriceChange('sale', parseFloat(e.target.value))} className={`${inputClass} text-2xl border-[#d4af37]`} />
                   </div>
                </div>
              </div>
            </div>
        </div>

        <footer className="p-8 border-t flex gap-4">
           <button onClick={handleAddSingle} disabled={isUploading} className="flex-1 bg-[#d4af37] text-slate-900 py-4 rounded-2xl font-black text-lg shadow-2xl active:scale-95 transition-all">
             {isUploading ? 'SUBIENDO...' : 'REGISTRAR ITEM'}
           </button>
        </footer>
      </div>
    </div>
  );
};