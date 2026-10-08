import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Pizza, Shield, Lock, User as UserIcon, ArrowRight, Mail } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { users, setCurrentUser, showToast } = useApp();
  const [emailInput, setEmailInput] = useState('');
  const [pin, setPin] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.email.toLowerCase() === emailInput.trim().toLowerCase());
    if (!user) {
      showToast('User email not found or unauthorized.', 'error');
      return;
    }
    if (user.pin && user.pin !== pin) {
      showToast('Incorrect security PIN code.', 'error');
      return;
    }
    setCurrentUser(user);
    showToast(`Welcome back, ${user.name}! (${user.role})`);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-100 select-none">
      <div className="max-w-md w-full bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl space-y-8">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white mx-auto shadow-xl shadow-orange-500/20">
            <Pizza className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-wide">Crust & Co. POS</h1>
            <p className="text-xs text-amber-400 font-medium mt-1">Multi-Client Secure SaaS Terminal</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">User Email</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input 
                type="email" 
                required
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                placeholder="Enter email (e.g. admin@pos.com)"
                className="w-full bg-slate-800 text-slate-100 pl-12 pr-4 py-3.5 rounded-2xl text-sm font-semibold border border-slate-700 focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Security PIN Code</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input 
                type="password" 
                required
                maxLength={6}
                value={pin}
                onChange={e => setPin(e.target.value)}
                placeholder="Enter PIN code"
                className="w-full bg-slate-800 text-slate-100 pl-12 pr-4 py-3.5 rounded-2xl text-sm font-mono tracking-widest border border-slate-700 focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">Default Super Admin: admin@pos.com | PIN: 1234</p>
          </div>

          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black py-4 rounded-2xl shadow-xl shadow-orange-500/30 flex items-center justify-center gap-2 hover:brightness-110 transition-all text-base"
          >
            <span>Login to POS Terminal</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
