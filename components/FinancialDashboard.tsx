
import React, { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Icon } from './Icons';
import { MOCK_CATEGORIES } from '../lib/mockData';
import { SubCategoryType } from '../types';

const SUB_CATEGORIES: SubCategoryType[] = ['Cartas Sueltas', 'Sobres', 'Sellados', 'Carpetas', 'Protectores'];

export const FinancialDashboard: React.FC = () => {
  const { products, expenses, theme, activeProfile } = useStore();
  const isDark = theme === 'dark';
  const isAdmin = activeProfile?.role === 'Administrador';

  const stats = useMemo(() => {
    let totalCost = 0;
    let totalRevenue = 0;
    let totalItems = 0;
    
    const categoryStats: Record<string, { cost: number; revenue: number; count: number }> = {};
    const subStats: Record<string, { cost: number; revenue: number; count: number }> = {};

    products.forEach(p => {
      const cost = p.purchase_price * p.stock;
      const revenue = p.sale_price * p.stock;
      
      totalCost += cost;
      totalRevenue += revenue;
      totalItems += p.stock;

      if (!categoryStats[p.category_id]) {
        categoryStats[p.category_id] = { cost: 0, revenue: 0, count: 0 };
      }
      categoryStats[p.category_id].cost += cost;
      categoryStats[p.category_id].revenue += revenue;
      categoryStats[p.category_id].count += p.stock;

      if (!subStats[p.sub_category]) {
        subStats[p.sub_category] = { cost: 0, revenue: 0, count: 0 };
      }
      subStats[p.sub_category].cost += cost;
      subStats[p.sub_category].revenue += revenue;
      subStats[p.sub_category].count += p.stock;
    });

    const totalExpenses = expenses.reduce((acc, e) => acc + e.monto, 0);
    const expectedGrossProfit = totalRevenue - totalCost;
    const netProfit = expectedGrossProfit - totalExpenses;
    const avgMargin = totalCost > 0 ? (expectedGrossProfit / totalCost) * 100 : 0;

    return { totalCost, totalRevenue, expectedGrossProfit, netProfit, totalExpenses, avgMargin, totalItems, categoryStats, subStats };
  }, [products, expenses]);

  if (!isAdmin) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
         <div className="w-24 h-24 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mb-6 border border-rose-500/20">
            <Icon name="shield" className="w-10 h-10" />
         </div>
         <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-2">Acceso <span className="text-rose-500">Restringido</span></h2>
         <p className="text-slate-500 text-sm max-w-xs font-medium uppercase tracking-widest leading-relaxed">
            Esta sección contiene información patrimonial sensible. Solo administradores autorizados pueden visualizar el ROI y los márgenes de ganancia.
         </p>
      </div>
    );
  }

  const cardClass = `p-8 rounded-[2.5rem] border transition-all ${isDark ? 'bg-[#15181e] border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <header className={`shrink-0 flex items-center justify-between p-8 border-b sticky top-0 z-10 backdrop-blur-md ${
        isDark ? 'bg-[#0f1115]/80 border-slate-800' : 'bg-[#f8fafc]/80 border-slate-200'
      }`}>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Análisis <span className="text-[#d4af37]">Patrimonial</span></h1>
          <p className="text-sm text-slate-500 font-medium">Control de ROI, valoración de stock y egresos operativos.</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 no-scrollbar space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={cardClass}>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Valoración Inventario</p>
            <p className="text-3xl font-black text-slate-300">${stats.totalCost.toLocaleString()}</p>
          </div>
          <div className={cardClass}>
            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2">Gastos Totales</p>
            <p className="text-3xl font-black text-rose-500">-${stats.totalExpenses.toLocaleString()}</p>
          </div>
          <div className={`${cardClass} bg-[#d4af37] border-none shadow-2xl shadow-[#d4af37]/20`}>
            <p className="text-[10px] font-black text-slate-900/50 uppercase tracking-widest mb-2">Utilidad Estimada</p>
            <p className="text-3xl font-black text-slate-900">${stats.netProfit.toLocaleString()}</p>
          </div>
          <div className={cardClass}>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Margen ROI</p>
            <p className="text-3xl font-black text-emerald-500">+{stats.avgMargin.toFixed(1)}%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
          <div className={cardClass}>
            <h3 className="text-xl font-bold mb-8 flex items-center gap-3 italic">Concentración TCG</h3>
            <div className="space-y-6">
              {MOCK_CATEGORIES.map(cat => {
                const cStat = stats.categoryStats[cat.id] || { cost: 0, revenue: 0, count: 0 };
                const percentage = stats.totalCost > 0 ? (cStat.cost / stats.totalCost) * 100 : 0;
                return (
                  <div key={cat.id} className="space-y-2">
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                      <span>{cat.name}</span>
                      <span className="text-slate-500">${cStat.cost.toLocaleString()}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-[#d4af37]" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={cardClass}>
            <h3 className="text-xl font-bold mb-8 flex items-center gap-3 italic">ROI por Clasificación</h3>
            <div className="space-y-6">
              {SUB_CATEGORIES.map(sub => {
                const sStat = stats.subStats[sub] || { cost: 0, revenue: 0, count: 0 };
                const roi = sStat.cost > 0 ? ((sStat.revenue - sStat.cost) / sStat.cost) * 100 : 0;
                return (
                  <div key={sub} className="flex justify-between items-center p-4 rounded-2xl bg-black/20 border border-white/5">
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest">{sub}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Stock: {sStat.count}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-black ${roi > 50 ? 'text-emerald-500' : 'text-[#d4af37]'}`}>+{roi.toFixed(1)}%</p>
                      <p className="text-[8px] font-black text-slate-600 uppercase">MARGEN ROI</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
