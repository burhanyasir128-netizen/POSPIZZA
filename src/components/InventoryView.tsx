import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Package, Plus, AlertTriangle, X } from 'lucide-react';
import { InventoryItem } from '../types';

export const InventoryView: React.FC = () => {
  const { inventory, updateInventoryStock, addInventoryItem, suppliers } = useApp();
  const [showModal, setShowModal] = useState(false);
  
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Dry Goods');
  const [unit, setUnit] = useState<'KG' | 'Gram' | 'Liter' | 'ML' | 'Piece' | 'Box' | 'Pack'>('KG');
  const [currentStock, setCurrentStock] = useState<number>(50);
  const [minStock, setMinStock] = useState<number>(10);
  const [purchasePrice, setPurchasePrice] = useState<number>(200);
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || 'sup1');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sku) return;
    const sup = suppliers.find(s => s.id === selectedSupplierId);
    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      name,
      sku,
      category,
      unit,
      currentStock,
      minStock,
      purchasePrice,
      supplierId: selectedSupplierId,
      supplierName: sup?.name || 'Primary Supplier'
    };
    addInventoryItem(newItem);
    setShowModal(false);
    setName('');
    setSku('');
  };

  return (
    <div className="p-8 space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Inventory & Recipe Ingredients</h1>
          <p className="text-sm text-slate-500">Track raw materials stock, automatic recipe consumption deduction & low stock alerts.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-amber-500 text-slate-950 font-black px-5 py-3 rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 hover:bg-amber-400"
        >
          <Plus className="w-5 h-5" />
          <span>Add Raw Material</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 uppercase text-xs">
                <th className="p-4">Item Name</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Category</th>
                <th className="p-4">Current Stock</th>
                <th className="p-4">Min Stock</th>
                <th className="p-4">Purchase Price</th>
                <th className="p-4">Supplier</th>
                <th className="p-4 text-right">Quick Stock Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {inventory.map(item => {
                const isLow = item.currentStock <= item.minStock;
                return (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {isLow && <AlertTriangle className="w-4 h-4 text-rose-500" />}
                      {item.name}
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-400">{item.sku}</td>
                    <td className="p-4">{item.category}</td>
                    <td className="p-4">
                      <span className={`font-black ${isLow ? 'text-rose-600' : 'text-slate-800 dark:text-slate-100'}`}>
                        {item.currentStock} {item.unit}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">{item.minStock} {item.unit}</td>
                    <td className="p-4 font-bold text-amber-600">Rs. {item.purchasePrice}</td>
                    <td className="p-4 text-slate-500">{item.supplierName}</td>
                    <td className="p-4 text-right">
                      <input 
                        type="number"
                        value={item.currentStock}
                        onChange={e => updateInventoryStock(item.id, Number(e.target.value))}
                        className="w-24 bg-slate-100 dark:bg-slate-800 p-2 rounded-xl text-xs font-bold text-center border border-slate-200 dark:border-slate-700"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Add Raw Material</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Item Name</label>
                <input 
                  type="text" 
                  required
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Cheddar Cheese"
                  className="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">SKU Code</label>
                  <input 
                    type="text" 
                    required
                    value={sku} 
                    onChange={e => setSku(e.target.value)}
                    placeholder="CHE-02"
                    className="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Unit</label>
                  <select 
                    value={unit} 
                    onChange={e => setUnit(e.target.value as any)}
                    className="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-sm font-semibold"
                  >
                    {['KG', 'Gram', 'Liter', 'ML', 'Piece', 'Box', 'Pack'].map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Opening Stock</label>
                  <input 
                    type="number" 
                    value={currentStock} 
                    onChange={e => setCurrentStock(Number(e.target.value))}
                    className="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Min Alert Stock</label>
                  <input 
                    type="number" 
                    value={minStock} 
                    onChange={e => setMinStock(Number(e.target.value))}
                    className="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Purchase Price per Unit (PKR)</label>
                <input 
                  type="number" 
                  value={purchasePrice} 
                  onChange={e => setPurchasePrice(Number(e.target.value))}
                  className="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-sm font-semibold"
                />
              </div>

              <button type="submit" className="w-full bg-amber-500 text-slate-950 font-black py-4 rounded-xl shadow-lg">
                Save Inventory Item
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
