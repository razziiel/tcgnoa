
import React, { useEffect, useMemo, useState } from 'react';
import { useStore } from './store/useStore';
import { CategorySelector } from './components/CategorySelector';
import { ProductCard } from './components/ProductCard';
import { PosCart } from './components/PosCart';
import { InventoryManager } from './components/InventoryManager';
import { SalesHistory } from './components/SalesHistory';
import { TerminalsManager } from './components/TerminalsManager';
import { PublicHub } from './components/PublicHub';
import { AdminLiveManager } from './components/AdminLiveManager';
import { FinancialDashboard } from './components/FinancialDashboard';
import { SettingsView } from './components/Settings';
import { EditProductPanel } from './components/EditProductPanel';
import { AddProductView } from './components/AddProductView';
import { ExpensesManager } from './components/ExpensesManager';
import { ArqueoHistory } from './components/ArqueoHistory';
import { Icon } from './components/Icons';

type View = 'POS' | 'INVENTARIO' | 'VENTAS' | 'DASHBOARD' | 'CONFIGURACION' | 'TERMINALES' | 'LIVE_ADMIN' | 'GASTOS' | 'ARQUEOS';

const App: React.FC = () => {
  const { 
    initListeners, theme, notification, activeTerminalId, 
    isAddingProduct, products, selectedCategoryId,
    activeProfile, selectedSubCategory 
  } = useStore();
  
  const [currentView, setCurrentView] = useState<View>('POS');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    initListeners();
  }, [initListeners]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = !selectedCategoryId || p.category_id === selectedCategoryId;
      const matchesSub = !selectedSubCategory || p.sub_category === selectedSubCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.details.set_name.toLowerCase().includes(searchQuery.toLowerCase());
      return !p.archived_at && matchesCategory && matchesSub && matchesSearch;
    });
  }, [products, selectedCategoryId, selectedSubCategory, searchQuery]);

  // REGLA DE NEGOCIO: Si no está logueado, es un cliente externo -> PublicHub
  if (!activeProfile) {
    return (
      <div className={theme === 'dark' ? 'dark bg-[#0a0c10] text-white min-h-screen' : 'bg-slate-50 min-h-screen'}>
        <PublicHub />
      </div>
    );
  }

  const isAdmin = activeProfile.role === 'Administrador';

  return (
    <div className={`flex h-screen transition-colors duration-300 overflow-hidden w-full ${themeBg}`}>
      <EditProductPanel />
      {isAddingProduct && <AddProductView />}

      {notification && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[250] px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${
          notification.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
        }`}>
          <Icon name="check" className="w-4 h-4" />
          <span className="font-bold text-[11px] uppercase tracking-wider">{notification.message}</span>
        </div>
      )}

      {/* Sidebar Principal - Solo Admin/Staff */}
      <aside className={`hidden md:flex w-20 border-r flex-col items-center py-8 gap-6 z-20 shrink-0 ${sidebarClass}`}>
        <div 
          onClick={() => setCurrentView('POS')}
          className="w-12 h-12 bg-[#d4af37] rounded-xl flex items-center justify-center shadow-lg shadow-[#d4af37]/20 transform hover:scale-105 transition-transform cursor-pointer mb-4"
        >
          <Icon name="zap" className="text-slate-900 w-6 h-6" />
        </div>
        
        <nav className="flex flex-col gap-3 flex-1 overflow-y-auto no-scrollbar">
          <button onClick={() => setCurrentView('POS')} title="Punto de Venta" className={`p-3 rounded-xl transition-all ${currentView === 'POS' ? 'bg-[#d4af37] text-slate-900' : 'text-slate-500 hover:bg-white/5'}`}><Icon name="cart" className="w-5 h-5" /></button>
          <button onClick={() => setCurrentView('LIVE_ADMIN')} title="Consola Live" className={`p-3 rounded-xl transition-all ${currentView === 'LIVE_ADMIN' ? 'bg-amber-500 text-slate-900' : 'text-slate-500 hover:bg-white/5'}`}><Icon name="zap" className="w-5 h-5" /></button>
          <button onClick={() => setCurrentView('INVENTARIO')} title="Inventario" className={`p-3 rounded-xl transition-all ${currentView === 'INVENTARIO' ? 'bg-[#d4af37] text-slate-900' : 'text-slate-500 hover:bg-white/5'}`}><Icon name="inventory" className="w-5 h-5" /></button>
          <button onClick={() => setCurrentView('TERMINALES')} title="Gestión de Cajas" className={`p-3 rounded-xl transition-all ${currentView === 'TERMINALES' ? 'bg-[#d4af37] text-slate-900' : 'text-slate-500 hover:bg-white/5'}`}><Icon name="palette" className="w-5 h-5" /></button>
          
          {isAdmin && (
            <>
              <button onClick={() => setCurrentView('ARQUEOS')} title="Historial de Arqueos" className={`p-3 rounded-xl transition-all ${currentView === 'ARQUEOS' ? 'bg-[#d4af37] text-slate-900' : 'text-slate-500 hover:bg-white/5'}`}><Icon name="shield" className="w-5 h-5" /></button>
              <button onClick={() => setCurrentView('DASHBOARD')} title="Reportes Financieros" className={`p-3 rounded-xl transition-all ${currentView === 'DASHBOARD' ? 'bg-[#d4af37] text-slate-900' : 'text-slate-500 hover:bg-white/5'}`}><Icon name="trends" className="w-5 h-5" /></button>
              <button onClick={() => setCurrentView('GASTOS')} title="Gastos" className={`p-3 rounded-xl transition-all ${currentView === 'GASTOS' ? 'bg-[#d4af37] text-slate-900' : 'text-slate-500 hover:bg-white/5'}`}><Icon name="trash" className="w-5 h-5" /></button>
            </>
          )}
          
          <button onClick={() => setCurrentView('VENTAS')} title="Historial Ventas" className={`p-3 rounded-xl transition-all ${currentView === 'VENTAS' ? 'bg-[#d4af37] text-slate-900' : 'text-slate-500 hover:bg-white/5'}`}><Icon name="dashboard" className="w-5 h-5" /></button>
        </nav>

        <button onClick={() => setCurrentView('CONFIGURACION')} title="Ajustes" className="p-3 text-slate-500 hover:text-white transition-colors"><Icon name="settings" className="w-5 h-5" /></button>
      </aside>

      {/* Área de Trabajo */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden w-full relative">
        {currentView === 'POS' ? (
          <div className="flex flex-col md:flex-row w-full h-full">
            <section className="flex-1 flex flex-col overflow-hidden min-w-0">
               <header className="p-6 md:p-8 border-b shrink-0 w-full flex flex-col gap-6">
                 <div className="flex justify-between items-center w-full">
                    <div>
                      <h1 className="text-2xl font-black uppercase italic tracking-tighter">TCG <span className="text-[#d4af37]">NOA</span></h1>
                      <p className={`text-[9px] font-black uppercase tracking-[0.2em] mt-1 flex items-center gap-2 ${activeTerminalId ? 'text-emerald-500' : 'text-rose-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${activeTerminalId ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                        {activeTerminalId ? `Terminal Activa` : 'SISTEMA OFFLINE'}
                      </p>
                    </div>

                    <div className="flex-1 max-w-md mx-8 relative hidden lg:block">
                      <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input 
                        type="text" 
                        placeholder="Buscar por nombre, set o número..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full pl-12 pr-4 py-3 rounded-2xl border text-xs font-bold outline-none transition-all ${
                          theme === 'dark' ? 'bg-white/5 border-white/5 focus:border-[#d4af37] text-white' : 'bg-slate-100 border-transparent focus:bg-white focus:border-[#d4af37]'
                        }`}
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{activeProfile.role}</p>
                        <p className="text-xs font-bold">{activeProfile.nombre}</p>
                      </div>
                      <img src={activeProfile.avatar_url} className="w-10 h-10 rounded-xl border border-[#d4af37]/30" alt="" />
                    </div>
                 </div>

                 {/* Selector de Categorías Directo */}
                 <div className="w-full">
                   <CategorySelector />
                 </div>
               </header>
               
               <div className="flex-1 overflow-y-auto p-6 md:p-8 no-scrollbar w-full">
                  {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 pb-20 animate-in fade-in duration-500">
                      {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-30">
                      <Icon name="package" className="w-16 h-16 mb-4" />
                      <p className="font-black uppercase tracking-widest text-xs">No hay productos que coincidan</p>
                    </div>
                  )}
               </div>
            </section>
            <section className={`w-full md:w-[380px] p-6 md:p-8 border-t md:border-t-0 md:border-l shrink-0 ${sidebarClass} shadow-xl flex flex-col h-1/2 md:h-full`}>
              <PosCart />
            </section>
          </div>
        ) : (
          <div className="w-full h-full overflow-hidden">
             {currentView === 'INVENTARIO' ? <InventoryManager /> 
             : currentView === 'LIVE_ADMIN' ? <AdminLiveManager />
             : currentView === 'TERMINALES' ? <TerminalsManager />
             : currentView === 'VENTAS' ? <SalesHistory />
             : currentView === 'DASHBOARD' ? <FinancialDashboard />
             : currentView === 'GASTOS' ? <ExpensesManager />
             : currentView === 'ARQUEOS' ? <ArqueoHistory />
             : <SettingsView />}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
