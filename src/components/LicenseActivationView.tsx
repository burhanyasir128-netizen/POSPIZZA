import React, { useState } from 'react';
import { Key, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { activateLicenseKey, getLicenseInfo } from '../services/license';

export const LicenseActivationView: React.FC<{ onActivated: () => void }> = ({ onActivated }) => {
  const [licenseKeyInput, setLicenseKeyInput] = useState('');
  const [error, setError] = useState('');
  const licenseInfo = getLicenseInfo();

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseKeyInput) return;
    const success = activateLicenseKey(licenseKeyInput);
    if (success) {
      setError('');
      onActivated();
    } else {
      setError('Invalid License Key. Please contact Super Admin for a valid key.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-100 select-none">
      <div className="max-w-md w-full bg-slate-900 rounded-3xl p-8 border border-rose-900/50 shadow-2xl space-y-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-rose-600/20 text-rose-500 flex items-center justify-center mx-auto border border-rose-500/30">
            <ShieldAlert className="w-8 h-8 animate-bounce" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Software License Expired</h1>
            <p className="text-xs text-rose-400 mt-1">Your 1-year POS software license has expired or is inactive.</p>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-1 font-mono">
          <p className="text-slate-400">Client: <span className="text-white font-bold">{licenseInfo.clientName}</span></p>
          <p className="text-slate-400">Current Expiry: <span className="text-rose-400 font-bold">{new Date(licenseInfo.expiryDate).toLocaleDateString()}</span></p>
        </div>

        <form onSubmit={handleActivate} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Enter New License Key</label>
            <div className="relative">
              <Key className="w-5 h-5 text-amber-500 absolute left-3.5 top-3.5" />
              <input 
                type="text" 
                required
                value={licenseKeyInput}
                onChange={e => setLicenseKeyInput(e.target.value)}
                placeholder="e.g. CRUST-365-CLIENT-XYZ"
                className="w-full bg-slate-800 text-slate-100 pl-12 pr-4 py-3.5 rounded-2xl text-sm font-mono tracking-wider border border-slate-700 focus:ring-2 focus:ring-amber-500 uppercase"
              />
            </div>
            {error && <p className="text-xs font-bold text-rose-500 mt-2">{error}</p>}
          </div>

          <button 
            type="submit"
            className="w-full bg-amber-500 text-slate-950 font-black py-4 rounded-2xl shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 hover:bg-amber-400 transition-colors"
          >
            <span>Activate Software License</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <p className="text-center text-[11px] text-slate-500">
          Note: Only the Super Admin can generate valid license extension keys.
        </p>
      </div>
    </div>
  );
};
