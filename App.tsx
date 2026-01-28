import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom';
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

// --- Components for Layouts ---

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeProfile } = useStore();
  const currentPath = location.pathname;

  const isAdmin = activeProfile?.role === 'Administrador';

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path);
  const btnClass = (path: string) => `p-3 rounded-xl transition-all ${isActive(path) ? 'bg-[#d4af37] text-slate-900' : 'text-slate-500 hover:bg-white/5'}`;

  return (
    <aside className="hidden md:flex w-20 border-r flex-col items-center py-8 gap-6 z-20 shrink-0 bg-[#15181e] border-slate-800">
      <div 
        onClick={() => navigate('/admin/pos')}
        className="w-12 h-12 bg-[#d4af37] rounded-xl flex items-center justify-center shadow-lg shadow-[#d4af37]/20 transform hover:scale-105 transition-transform cursor-pointer mb-4"
      >
        <Icon name="zap" className="text-slate-900 w-6 h-6" />
      </div>
      
      <nav className="flex flex-col gap-3 flex-1 overflow-y-auto no-scrollbar">
        <button onClick={() => navigate('/admin/pos')} title="Punto de Venta" className={btnClass('/admin/pos')}><Icon name="cart" className="w-5 h-5" /></button>
        <button onClick={() => navigate('/admin/live')} title="Consola Live" className={btnClass('/admin/live')}><Icon name="zap" className="w-5 h-5" /></button>
        <button onClick={() => navigate('/admin/inventory')} title="Inventario" className={btnClass('/admin/inventory')}><Icon name="inventory" className="w-5 h-5" /></button>
        <button onClick={() => navigate('/admin/terminals')} title="Gestión de Cajas" className={btnClass('/admin/terminals')}><Icon name="palette" className="w-5 h-5" /></button>
        
        {isAdmin && (
          <>
            <button onClick={() => navigate('/admin/arqueos')} title="Historial de Arqueos" className={btnClass('/admin/arqueos')}><Icon name="shield" className="w-5 h-5" /></button>
            <button onClick={() => navigate('/admin/dashboard')} title="Reportes Financieros" className={btnClass('/admin/dashboard')}><Icon name="trends" className="w-5 h-5" /></button>
            <button onClick={() => navigate('/admin/expenses')} title="Gastos" className={btnClass('/admin/expenses')}><Icon name="trash" className="w-5 h-5" /></button>
          </>
        )}
        
        <button onClick={() => navigate('/admin/sales')} title="Historial Ventas" className={btnClass('/admin/sales')}><Icon name="dashboard" className="w-5 h-5" /></button>
      </nav>

      <button onClick={() => navigate('/admin/settings')} title="Ajustes" className="p-3 text-slate-500 hover:text-white transition-colors"><Icon name="settings" className="w-5 h-5" /></button>
    </aside>
  );
};

const AdminLayout = () => {
  const { theme, notification, isAddingProduct, activeProfile } = useStore();
  const themeBg = theme === 'dark' ? 'bg-[#0f1115] text-white' : 'bg-[#f8fafc] text-slate-900';

  if (!activeProfile) {
    return <Navigate to="/live" replace />;
  }

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

      <Sidebar />
      
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden w-full relative">
        <Outlet />
      </main>
    </div>
  );
};

const PosView = () => {
  const { activeTerminalId, activeProfile, theme, products, selectedCategoryId, selectedSubCategory } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const sidebarClass = theme === 'dark' ? 'bg-[#15181e] border-slate-800' : 'bg-white border-slate-100';

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = !selectedCategoryId || p.category_id === selectedCategoryId;
      const matchesSub = !selectedSubCategory || p.sub_category === selectedSubCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.details.set_name.toLowerCase().includes(searchQuery.toLowerCase());
      return !p.archived_at && matchesCategory && matchesSub && matchesSearch;
    });
  }, [products, selectedCategoryId, selectedSubCategory, searchQuery]);

  return (
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
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{activeProfile?.role}</p>
                  <p className="text-xs font-bold">{activeProfile?.nombre}</p>
                </div>
                <img src={activeProfile?.avatar_url} className="w-10 h-10 rounded-xl border border-[#d4af37]/30" alt="" />
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
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const { initListeners, activeProfile } = useStore();

  useEffect(() => {
    initListeners();
  }, [initListeners]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas / Live */}
        <Route path="/live" element={<PublicHub />} />
        <Route path="/" element={<Navigate to={activeProfile ? "/admin/pos" : "/live"} replace />} />

        {/* Rutas de Administración Protegidas */}
        <Route path="/admin" element={<AdminLayout />}>
           <Route path="pos" element={<PosView />} />
           <Route path="inventory" element={<InventoryManager />} />
           <Route path="sales" element={<SalesHistory />} />
           <Route path="terminals" element={<TerminalsManager />} />
           <Route path="live" element={<AdminLiveManager />} />
           <Route path="dashboard" element={<FinancialDashboard />} />
           <Route path="settings" element={<SettingsView />} />
           <Route path="expenses" element={<ExpensesManager />} />
           <Route path="arqueos" element={<ArqueoHistory />} />
           {/* Fallback admin route */}
           <Route index element={<Navigate to="pos" replace />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;