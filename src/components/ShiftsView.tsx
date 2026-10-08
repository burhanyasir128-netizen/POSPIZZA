import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Wallet, Clock, CheckCircle } from 'lucide-react';

export const ShiftsView: React.FC = () => {
  const { currentShift, closeShift, orders } = useApp();
  const [actualCashInput, setActualCashInput] = useState('');

  const cashSales = orders.filter(o => o.paymentStatus === 'Paid' && o.paymentMethod === 'Cash').reduce((acc, o) => acc + o.total, 0);
  const expectedCash = currentShift.openingCash + cashSales;

  const handleCloseShift = () => {
    if (!actualCashInput) return;
    closeShift(Number(actualCashInput));
    setActualCashInput('');
  };

  return (
    <div className="p-8 space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Shift & Cash Drawer</h1>
          <p className="text-sm text-slate-500">Manage cashier shift opening, live cash drawer reconciliation, and shift closing.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Wallet className="w-5 h-5 text-amber-500" />
              Current Active Shift
            </h3>
            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">
              {currentShift.status}
            </span>
          </div>

          <div className="space-y-3 text-sm divide-y divide-slate-100 dark:divide-slate-800">
            <div className="flex justify-between pt-2">
              <span className="text-slate-500">Cashier</span>
              <span className="font-bold">{currentShift.cashierName}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-slate-500">Start Time</span>
              <span className="font-bold">{currentShift.startTime}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-slate-500">Opening Cash</span>
              <span className="font-bold">Rs. {currentShift.openingCash}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-slate-500">Today's Cash Sales</span>
              <span className="font-bold text-emerald-600">Rs. {cashSales}</span>
            </div>
            <div className="flex justify-between pt-2 text-base font-black">
              <span>Expected Cash in Drawer</span>
              <span className="text-amber-600">Rs. {expectedCash}</span>
            </div>
          </div>

          {currentShift.status === 'Open' && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase block">Actual Cash Count at Closing</label>
              <div className="flex gap-3">
                <input 
                  type="number"
                  placeholder="Enter physical cash count..."
                  value={actualCashInput}
                  onChange={e => setActualCashInput(e.target.value)}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 p-3 rounded-xl font-bold border border-slate-200 dark:border-slate-700"
                />
                <button 
                  onClick={handleCloseShift}
                  className="bg-emerald-600 text-white font-black px-6 py-3 rounded-xl shadow hover:bg-emerald-500 transition-colors"
                >
                  Close Shift
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
