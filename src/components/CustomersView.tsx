import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Customer } from '../types';
import { Users, Phone, MapPin, Award, Plus, X } from 'lucide-react';

export const CustomersView: React.FC = () => {
  const { customers, addCustomer } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('Gulberg');
  const [notes, setNotes] = useState('');

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name,
      phone,
      addresses: [{ id: `addr-${Date.now()}`, title: 'Home', area, address, city: 'Lahore' }],
      notes,
      totalOrders: 0,
      totalSpending: 0,
      loyaltyPoints: 0,
    };
    addCustomer(newCust);
    setShowAddModal(false);
    setName('');
    setPhone('');
    setAddress('');
  };

  return (
    <div className="p-8 space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Customer CRM & Loyalty</h1>
          <p className="text-sm text-slate-500">Manage customer database, saved delivery addresses, and loyalty points.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-amber-500 text-slate-950 font-black px-5 py-3 rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 hover:bg-amber-400"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Customer</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map(cust => (
          <div key={cust.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-black text-lg text-slate-900 dark:text-white">{cust.name}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                  <Phone className="w-3.5 h-3.5 text-amber-500" />
                  {cust.phone}
                </p>
              </div>
              <span className="bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                {cust.loyaltyPoints} Pts
              </span>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <p className="text-slate-500 font-bold uppercase tracking-wider">Saved Addresses:</p>
              {cust.addresses.map(adr => (
                <div key={adr.id} className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{adr.title} ({adr.area})</p>
                    <p className="text-slate-500">{adr.address}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-between items-center text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800">
              <span>Total Orders: <b>{cust.totalOrders}</b></span>
              <span>Total Spend: <b className="text-amber-600">Rs. {cust.totalSpending}</b></span>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Add Customer</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Ali Raza"
                  className="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-sm font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Phone Number</label>
                <input 
                  type="text" 
                  required
                  value={phone} 
                  onChange={e => setPhone(e.target.value)}
                  placeholder="e.g. 03001234567"
                  className="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-sm font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Area / Delivery Zone</label>
                <input 
                  type="text" 
                  value={area} 
                  onChange={e => setArea(e.target.value)}
                  placeholder="e.g. Gulberg III"
                  className="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-sm font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Delivery Address</label>
                <input 
                  type="text" 
                  value={address} 
                  onChange={e => setAddress(e.target.value)}
                  placeholder="House #, Street #, Landmark"
                  className="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-sm font-semibold"
                />
              </div>

              <button type="submit" className="w-full bg-amber-500 text-slate-950 font-black py-4 rounded-xl shadow-lg">
                Save Customer
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
