import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Plus } from 'lucide-react';

export const PurchasesView: React.FC = () => {
  const { suppliers } = useApp();

  return (
    <div className="p-8 space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Purchases & Supplier Ledger</h1>
          <p className="text-sm text-slate-500">Manage supplier accounts, outstanding balances, and raw material purchase orders.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map(sup => (
          <div key={sup.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h3 className="font-black text-lg text-slate-900 dark:text-white">{sup.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">Contact: {sup.contactPerson} • {sup.phone}</p>
              <p className="text-xs text-slate-500 mt-1">{sup.address}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
              <span>Outstanding Ledger:</span>
              <span className="font-black text-rose-600 text-sm">Rs. {sup.outstandingBalance.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
