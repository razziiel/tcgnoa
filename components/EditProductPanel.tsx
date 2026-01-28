import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { Product, Condition } from '../types';

const CONDITIONS: Condition[] = ['Menta', 'Casi Nueva (NM)', 'Poco Uso (LP)', 'Uso Moderado (MP)', 'Muy Usada (HP)', 'Dañada'];

export const EditProductPanel: React.FC = () => {
  const { editingProduct, setEditingProduct, updateProduct, theme, showNotification, uploadImage } = useStore();
  const [formData, setFormData] = useState<Product | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingProduct) {
      setFormData({ ...editingProduct });
    }
  }, [editingProduct]);

  if (!editingProduct || !formData) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadImage(file);
      setFormData(prev => prev ? ({ ...prev, image_url: url }) : null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    updateProduct(formData.id, formData);
    showNotification("Cambios guardados", "success");
    setEditingProduct(null);
  };

  const isDark = theme === 'dark';
  const inputClass = `w-full p-3 rounded-xl border focus:border-[#d4af37] outline-none ${isDark ? 'bg-[#15181e] border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setEditingProduct(null)} />
      <div className={`relative w-full max-w-lg h-full overflow-y-auto shadow-2xl p-8 ${isDark ? 'bg-[#1a1c23] text-white' : 'bg-white'}`}>
        <header className="mb-8">
            <h2 className="text-2xl font-black">Editar <span className="text-[#d4af37]">Item</span></h2>
        </header>

        <div className="space-y-6">
          <div className="flex gap-6 items-start">
            <div 
              onClick={() => fileRef.current?.click()}
              className={`w-24 h-32 rounded-xl border shrink-0 overflow-hidden relative cursor-pointer ${isDark ? 'bg-[#0f1115]' : 'bg-slate-200'}`}
            >
              {isUploading ? <div className="absolute inset-0 flex items-center justify-center bg-black/50"><div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /></div> : null}
              <img src={formData.image_url} className="w-full h-full object-cover" alt="" />
              <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>
            <div className="flex-1">
                <label className="text-[10px] font-black uppercase text-slate-500 mb-1 block">Nombre</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="text-[10px] font-black uppercase text-slate-500 mb-1 block">Stock</label>
                <input type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} className={inputClass} />
             </div>
             <div>
                <label className="text-[10px] font-black uppercase text-slate-500 mb-1 block">Condición</label>
                <select value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value as any})} className={inputClass}>
                  {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
             </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex gap-4">
            <button onClick={() => setEditingProduct(null)} className="flex-1 py-3 font-bold">Cancelar</button>
            <button onClick={handleSave} className="flex-1 bg-[#d4af37] text-slate-900 py-3 rounded-xl font-black">GUARDAR</button>
          </div>
        </div>
      </div>
    </div>
  );
};