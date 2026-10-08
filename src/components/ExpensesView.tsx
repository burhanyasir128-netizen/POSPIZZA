import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Receipt, Plus, X } from 'lucide-react';

export const ExpensesView: React.FC = () => {
  const { expenses, addExpense, currentUser } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState<'Rent' | 'Electricity' | 'Gas' | 'Salaries' | 'Internet' | 'Maintenance' | 'Marketing' | 'Packaging' | 'Transportation' | 'Miscellaneous'>('Electricity');
  const [amount, setAmount] = useState<number>(5000);
  const [description, setDescription] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;
    addExpense({
      category,
      amount,
      description,
      date: new Date().toISOString().replace('T', ' ').substring(0, 10),
      recordedBy: currentUser?.name || 'Admin'
    });
    setShowModal(false);
    setDescription('');
    setAmount(5000);
  };

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="p-8 space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Shop Expenses</h1>
          <p className="text-sm text-slate-500">Track utility bills, rent, salaries, packaging, and miscellaneous shop expenses.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-amber-500 text-slate-950 font-black px-5 py-3 rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 hover:bg-amber-400"
        >
          <Plus className="w-5 h-5" />
          <span>Record Expense</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Total Expenses Recorded</p>
          <h3 className="text-3xl font-black text-rose-600 mt-2">Rs. {totalExpenses.toLocaleString()}</h3>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 uppercase text-xs">
              <th className="p-4">Category</th>
              <th className="p-4">Description</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Date</th>
              <th className="p-4">Recorded By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {expenses.map(exp => (
              <tr key={exp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="p-4 font-bold">{exp.category}</td>
                <td className="p-4 text-slate-600 dark:text-slate-300">{exp.description}</td>
                <td className="p-4 font-black text-rose-600">Rs. {exp.amount.toLocaleString()}</td>
                <td className="p-4 text-xs text-slate-400">{exp.date}</td>
                <td className="p-4 text-xs">{exp.recordedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Record Expense</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Category</label>
                <select 
                  value={category} 
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-sm font-semibold"
                >
                  {['Rent', 'Electricity', 'Gas', 'Salaries', 'Internet', 'Maintenance', 'Marketing', 'Packaging', 'Transportation', 'Miscellaneous'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Amount (PKR)</label>
                <input 
                  type="number" 
                  required
                  value={amount} 
                  onChange={e => setAmount(Number(e.target.value))}
                  className="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-sm font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Description</label>
                <input 
                  type="text" 
                  required
                  value={description} 
                  onChange={e => setDescription(e.target.value)}
                  placeholder="e.g. Generator repair bill"
                  className="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-sm font-semibold"
                />
              </div>

              <button type="submit" className="w-full bg-amber-500 text-slate-950 font-black py-4 rounded-xl shadow-lg">
                Save Expense
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
