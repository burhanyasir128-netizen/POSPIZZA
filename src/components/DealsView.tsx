import React from 'react';
import { useApp } from '../context/AppContext';
import { Gift, Tag } from 'lucide-react';

export const DealsView: React.FC = () => {
  const { deals, coupons } = useApp();

  return (
    <div className="p-8 space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Deals, Combos & Coupons</h1>
          <p className="text-sm text-slate-500">Manage promotional combo deals and discount voucher codes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <Gift className="w-5 h-5 text-amber-500" />
            Active Combo Deals
          </h3>
          <div className="space-y-4">
            {deals.map(d => (
              <div key={d.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{d.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">{d.itemsSummary}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-amber-600 text-base">Rs. {d.price}</p>
                  <p className="text-xs line-through text-slate-400">Rs. {d.originalPrice}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-amber-500" />
            Discount Coupons
          </h3>
          <div className="space-y-4">
            {coupons.map(c => (
              <div key={c.code} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex justify-between items-center">
                <div>
                  <h4 className="font-black text-slate-900 dark:text-white font-mono">{c.code}</h4>
                  <p className="text-xs text-slate-400 mt-1">Min Order: Rs. {c.minOrderAmount}</p>
                </div>
                <span className="bg-amber-100 text-amber-700 font-bold text-xs px-3 py-1 rounded-full">
                  {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `Rs. ${c.discountValue} OFF`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
