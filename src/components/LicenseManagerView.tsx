import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Key, Shield, Calendar, Check, Copy, AlertTriangle, Plus, Users, Mail, Lock, Building2 } from 'lucide-react';
import { getLicenseInfo, generateLicenseKey, getGeneratedLicenses, GeneratedLicenseRecord } from '../services/license';
import { fetchAllDataFromGoogleSheet } from '../services/googleSheets';

export const LicenseManagerView: React.FC = () => {
  const { showToast, settings } = useApp();
  const [clientNameInput, setClientNameInput] = useState('');
  const [clientEmailInput, setClientEmailInput] = useState('');
  const [adminPinInput, setAdminPinInput] = useState('1234');
  const [licenseDays, setLicenseDays] = useState(365);
  const [generatedKey, setGeneratedKey] = useState('');
  const [generatedList, setGeneratedList] = useState<GeneratedLicenseRecord[]>([]);

  useEffect(() => {
    if (settings.googleSheetWebAppUrl) {
      fetchAllDataFromGoogleSheet(settings.googleSheetWebAppUrl, '').then(data => {
        if (data && data.Licenses && Array.isArray(data.Licenses)) {
          const sheetLicenses: GeneratedLicenseRecord[] = data.Licenses.map((l: any, idx: number) => ({
            id: `lic-sheet-${idx}`,
            clientName: l.ClientName || 'Client',
            clientEmail: l.ClientEmail || 'N/A',
            adminPin: '****',
            key: l.LicenseKey || '',
            days: Number(l.DurationDays) || 365,
            expiryDate: l.ExpiryDate || new Date().toISOString(),
            createdAt: l.CreatedAt || ''
          }));
          setGeneratedList(sheetLicenses);
        } else {
          setGeneratedList(getGeneratedLicenses());
        }
      }).catch(() => {
        setGeneratedList(getGeneratedLicenses());
      });
    } else {
      setGeneratedList(getGeneratedLicenses());
    }
  }, [settings.googleSheetWebAppUrl]);

  const handleGenerateLicense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientNameInput.trim() || !clientEmailInput.trim() || !adminPinInput.trim()) {
      showToast('Please fill in client name, email, and admin PIN.', 'error');
      return;
    }
    const key = generateLicenseKey(licenseDays, clientNameInput, clientEmailInput, adminPinInput);
    setGeneratedKey(key);
    setGeneratedList(getGeneratedLicenses());
    setClientNameInput('');
    setClientEmailInput('');
    setAdminPinInput('1234');
    showToast('Client license & login generated and synced to Google Sheet successfully!');
  };

  const licenseInfo = getLicenseInfo();

  return (
    <div className="p-8 space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Key className="w-7 h-7 text-amber-500" />
            SaaS Client & License Manager (Super Admin)
          </h1>
          <p className="text-sm text-slate-500">Create new client accounts, issue license keys, set subscription plans, and manage SaaS tenants with real-time Google Sheet sync.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Generator Form */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-amber-500" />
            Register New Client & Generate Key
          </h3>

          <form onSubmit={handleGenerateLicense} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Client Business Name</label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input 
                  type="text" 
                  required
                  value={clientNameInput} 
                  onChange={e => setClientNameInput(e.target.value)}
                  placeholder="e.g. Lahore Pizza Hub"
                  className="w-full bg-slate-100 dark:bg-slate-800 pl-10 pr-4 py-3 rounded-xl text-sm font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Client Admin Email (Login)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input 
                  type="email" 
                  required
                  value={clientEmailInput} 
                  onChange={e => setClientEmailInput(e.target.value)}
                  placeholder="admin@lahorepizza.com"
                  className="w-full bg-slate-100 dark:bg-slate-800 pl-10 pr-4 py-3 rounded-xl text-sm font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Initial Admin PIN Code</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input 
                  type="text" 
                  required
                  maxLength={6}
                  value={adminPinInput} 
                  onChange={e => setAdminPinInput(e.target.value)}
                  placeholder="1234"
                  className="w-full bg-slate-100 dark:bg-slate-800 pl-10 pr-4 py-3 rounded-xl text-sm font-mono tracking-widest font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Subscription Plan</label>
              <select 
                value={licenseDays}
                onChange={e => setLicenseDays(Number(e.target.value))}
                className="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-sm font-semibold"
              >
                <option value={7}>7 Days (Free Trial)</option>
                <option value={14}>14 Days (Extended Trial)</option>
                <option value={30}>30 Days (1 Month)</option>
                <option value={90}>90 Days (3 Months)</option>
                <option value={365}>365 Days (1 Year)</option>
                <option value={730}>730 Days (2 Years)</option>
              </select>
            </div>

            <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-4 rounded-xl shadow-lg transition-colors">
              Generate License & Login
            </button>
          </form>

          {generatedKey && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-900/50 space-y-2">
              <p className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase">Generated Credentials:</p>
              <div className="space-y-1 text-xs font-mono">
                <p className="text-slate-600 dark:text-slate-300">Key: <b className="text-amber-600">{generatedKey}</b></p>
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(generatedKey);
                  showToast('License key copied to clipboard!');
                }}
                className="w-full bg-amber-500 text-slate-950 py-2 rounded-lg text-xs font-bold mt-2"
              >
                Copy License Key
              </button>
            </div>
          )}
        </div>

        {/* Right: Active Clients Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-500" />
              Registered SaaS Clients ({generatedList.length})
            </h3>
            <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full font-bold">
              Real-Time Google Sheet Sync
            </span>
          </div>

          <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 uppercase">
                  <th className="p-3">Client Business</th>
                  <th className="p-3">Login Email</th>
                  <th className="p-3">License Key</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Expires</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                {generatedList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 font-sans">No clients registered in Google Sheet yet.</td>
                  </tr>
                ) : (
                  generatedList.map(item => {
                    const isExpired = new Date(item.expiryDate).getTime() < Date.now();
                    return (
                      <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                        <td className="p-3 font-bold text-slate-900 dark:text-white font-sans">{item.clientName}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-300">{item.clientEmail || 'N/A'}</td>
                        <td className="p-3 text-amber-600 font-bold">{item.key}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-300">{item.days} Days</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded font-bold ${isExpired ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {new Date(item.expiryDate).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(`Email: ${item.clientEmail}\nPIN: ${item.adminPin}\nKey: ${item.key}`);
                              showToast(`Credentials for ${item.clientName} copied!`);
                            }}
                            className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold"
                          >
                            Copy Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
