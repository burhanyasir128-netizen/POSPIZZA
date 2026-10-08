import React from 'react';
import { useApp } from '../context/AppContext';
import { BarChart3, TrendingUp, DollarSign, PieChart } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { orders, expenses } = useApp();

  const totalSales = orders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + o.total, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const estimatedProfit = Math.round(totalSales * 0.42) - totalExpenses;

  const cashTotal = orders.filter(o => o.paymentStatus === 'Paid' && o.paymentMethod === 'Cash').reduce((s, o) => s + o.total, 0);
  const cardTotal = orders.filter(o => o.paymentStatus === 'Paid' && o.paymentMethod === 'Debit/Credit Card').reduce((s, o) => s + o.total, 0);
  const onlineTotal = orders.filter(o => o.paymentStatus === 'Paid' && (o.paymentMethod === 'JazzCash' || o.paymentMethod === 'Easypaisa')).reduce((s, o) => s + o.total, 0);

  return (
    <div className="p-8 space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Reports & Profit / Loss Statement</h1>
          <p className="text-sm text-slate-500">Comprehensive sales breakdown, payment reconciliation, food cost ratios, and net profit in PKR.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Gross Sales</p>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-2">Rs. {totalSales.toLocaleString()}</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Total Expenses</p>
          <h3 className="text-3xl font-black text-rose-600 mt-2">Rs. {totalExpenses.toLocaleString()}</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Estimated Net Profit</p>
          <h3 className="text-3xl font-black text-emerald-600 mt-2">Rs. {estimatedProfit.toLocaleString()}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Payment Method Reconciliation</h3>
          <div className="space-y-3">
            <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <span>Cash Payments</span>
              <span className="font-bold">Rs. {cashTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <span>Credit / Debit Card</span>
              <span className="font-bold">Rs. {cardTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <span>JazzCash / Easypaisa Online</span>
              <span className="font-bold">Rs. {onlineTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
