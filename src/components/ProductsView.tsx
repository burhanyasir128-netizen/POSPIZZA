import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UtensilsCrossed, Plus, X, CheckCircle2, XCircle } from 'lucide-react';
import { Product } from '../types';

export const ProductsView: React.FC = () => {
  const { products, addProduct, categories, toggleProductAvailability } = useApp();
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'c1');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [isPizza, setIsPizza] = useState(true);
  const [smallPrice, setSmallPrice] = useState<number>(699);
  const [mediumPrice, setMediumPrice] = useState<number>(999);
  const [largePrice, setLargePrice] = useState<number>(1399);
  const [regularPrice, setRegularPrice] = useState<number>(499);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    const cat = categories.find(c => c.id === categoryId);

    const newProd: Product = {
      id: `p-${Date.now()}`,
      name,
      categoryId,
      categoryName: cat?.name || 'Pizzas',
      description,
      image: image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600',
      hasSizes: isPizza,
      available: true,
      isPizza,
      prices: isPizza ? { small: smallPrice, medium: mediumPrice, large: largePrice } : { regular: regularPrice },
      recipe: [],
      addons: []
    };

    addProduct(newProd);
    setShowModal(false);
    setName('');
    setDescription('');
    setImage('');
  };

  return (
    <div className="p-8 space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Products & Menu Management</h1>
          <p className="text-sm text-slate-500">Manage item pricing, recipes, and quick out-of-stock availability toggles for the POS.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-amber-500 text-slate-950 font-black px-5 py-3 rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 hover:bg-amber-400"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Product</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 uppercase text-xs">
              <th className="p-4">Product Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Pricing (PKR)</th>
              <th className="p-4">Status / Availability</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {products.map(prod => (
              <tr key={prod.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="p-4 font-bold text-slate-900 dark:text-white">{prod.name}</td>
                <td className="p-4">{prod.categoryName}</td>
                <td className="p-4 font-black text-amber-600">
                  {prod.isPizza ? `S: ${prod.prices.small} | M: ${prod.prices.medium} | L: ${prod.prices.large}` : `Rs. ${prod.prices.regular}`}
                </td>
                <td className="p-4">
                  <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                    prod.available ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {prod.available ? 'Available' : 'Out of Stock'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => toggleProductAvailability(prod.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      prod.available ? 'bg-rose-100 text-rose-700 hover:bg-rose-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                    }`}
                  >
                    {prod.available ? 'Mark Out of Stock' : 'Make Available'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Add New Product / Menu Item</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Product Name</label>
                <input 
                  type="text" 
                  required
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Crown Crust Pizza or Zinger Burger"
                  className="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Category</label>
                  <select 
                    value={categoryId} 
                    onChange={e => setCategoryId(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-sm font-semibold"
                  >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Product Type</label>
                  <select 
                    value={isPizza ? 'pizza' : 'other'} 
                    onChange={e => setIsPizza(e.target.value === 'pizza')}
                    className="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-sm font-semibold"
                  >
                    <option value="pizza">Pizza (Multi-size S/M/L)</option>
                    <option value="other">Standard Item (Single Price)</option>
                  </select>
                </div>
              </div>

              {isPizza ? (
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Small Price</label>
                    <input 
                      type="number" 
                      value={smallPrice} 
                      onChange={e => setSmallPrice(Number(e.target.value))}
                      className="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Medium Price</label>
                    <input 
                      type="number" 
                      value={mediumPrice} 
                      onChange={e => setMediumPrice(Number(e.target.value))}
                      className="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Large Price</label>
                    <input 
                      type="number" 
                      value={largePrice} 
                      onChange={e => setLargePrice(Number(e.target.value))}
                      className="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-sm font-semibold"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Price (PKR)</label>
                  <input 
                    type="number" 
                    value={regularPrice} 
                    onChange={e => setRegularPrice(Number(e.target.value))}
                    className="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-sm font-semibold"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Description</label>
                <input 
                  type="text" 
                  value={description} 
                  onChange={e => setDescription(e.target.value)}
                  placeholder="e.g. Spicy chicken tikka with mozzarella cheese"
                  className="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-sm font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Image URL (optional)</label>
                <input 
                  type="text" 
                  value={image} 
                  onChange={e => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-sm font-semibold"
                />
              </div>

              <button type="submit" className="w-full bg-amber-500 text-slate-950 font-black py-4 rounded-xl shadow-lg hover:bg-amber-400 transition-colors">
                Save & Add Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
