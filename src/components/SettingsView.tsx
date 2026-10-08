import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Shield, Database, Download, Upload, Check, FileSpreadsheet, Copy, Sparkles, RefreshCw } from 'lucide-react';
import { APPS_SCRIPT_TEMPLATE } from '../services/googleSheets';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, auditLogs, backupDatabase, restoreDatabase, showToast, currentUser, seedClientDummyData, resetGoogleSheets } = useApp();
  const [shopName, setShopName] = useState(settings.shopName);
  const [phone, setPhone] = useState(settings.phone);
  const [address, setAddress] = useState(settings.address);
  const [taxPercentage, setTaxPercentage] = useState(settings.taxPercentage);
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl || '');
  const [developerName, setDeveloperName] = useState(settings.developerName || 'Crust & Co. POS Systems');
  const [googleSheetWebAppUrl, setGoogleSheetWebAppUrl] = useState(settings.googleSheetWebAppUrl || '');
  const [restoreJsonInput, setRestoreJsonInput] = useState('');
  const [copiedScript, setCopiedScript] = useState(false);
  const [isSavingUrl, setIsSavingUrl] = useState(false);

  const isSuperAdmin = currentUser?.role === 'Super Admin';

  const handleSaveUrlToCode = async () => {
    if (!googleSheetWebAppUrl) {
      showToast('Please enter a valid URL first.', 'warning');
      return;
    }
    
    setIsSavingUrl(true);
    try {
      const response = await fetch('/api/save-google-sheet-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: googleSheetWebAppUrl })
      });
      const result = await response.json();
      if (result.success) {
        showToast('Google Sheet URL saved to source code successfully!');
      } else {
        showToast('Failed to save to code.', 'error');
      }
    } catch (err) {
      console.error('Failed to save URL to server:', err);
      showToast('Error connecting to backend.', 'error');
    } finally {
      setIsSavingUrl(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update local context and localStorage
    updateSettings({
      ...settings,
      shopName,
      phone,
      address,
      taxPercentage,
      logoUrl,
      ...(isSuperAdmin ? { developerName, googleSheetWebAppUrl } : {})
    });
    
    showToast('Settings saved successfully!');
  };

  const handleExportBackup = () => {
    const jsonStr = backupDatabase();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crust_pizza_backup_${new Date().toISOString().substring(0, 10)}.json`;
    a.click();
    showToast('Database backup downloaded successfully.');
  };

  const handleRestore = () => {
    if (!restoreJsonInput) return;
    const success = restoreDatabase(restoreJsonInput);
    if (success) setRestoreJsonInput('');
  };

  const copyAppsScriptCode = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_TEMPLATE);
    setCopiedScript(true);
    showToast('Google Apps Script code copied to clipboard!');
    setTimeout(() => setCopiedScript(false), 3000);
  };

  return (
    <div className="p-8 space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">System Settings & Controls</h1>
          <p className="text-sm text-slate-500">Configure shop details, branding, and Google Sheets backend sync and reset tools.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings Form */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-500" />
            General Shop Settings
          </h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Shop Name</label>
              <input 
                type="text" 
                value={shopName} 
                onChange={e => setShopName(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-sm font-semibold"
              />
            </div>

            {/* SUPER ADMIN ONLY: Branding / Developer Name */}
            {isSuperAdmin && (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-200 dark:border-amber-900/50 space-y-4">
                <p className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider">Super Admin Exclusive Controls</p>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Shop Branding / Developer Name ('Powered by')</label>
                  <input 
                    type="text" 
                    value={developerName} 
                    onChange={e => setDeveloperName(e.target.value)}
                    placeholder="e.g. Crust & Co. POS Systems"
                    className="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-sm font-semibold"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Custom Logo Image URL</label>
              <input 
                type="text" 
                value={logoUrl} 
                onChange={e => setLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.png"
                className="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-sm font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Phone Number</label>
              <input 
                type="text" 
                value={phone} 
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-sm font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Address</label>
              <input 
                type="text" 
                value={address} 
                onChange={e => setAddress(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-sm font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">GST Tax Percentage (%)</label>
              <input 
                type="number" 
                value={taxPercentage} 
                onChange={e => setTaxPercentage(Number(e.target.value))}
                className="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-sm font-semibold"
              />
            </div>

            <button type="submit" className="w-full bg-amber-500 text-slate-950 font-black py-4 rounded-xl shadow-lg">
              Save Settings
            </button>
          </form>
        </div>

        {/* Right Column: Google Sheets Backend & Reset Tools (Super Admin Only) */}
        <div className="space-y-8">
          {/* SUPER ADMIN ONLY: Google Sheets Backend & Reset */}
          {isSuperAdmin && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
                Google Sheets Backend & Setup Tools (Super Admin)
              </h3>

              <div className="space-y-4">
                <p className="text-xs text-slate-500">
                  All orders, expenses, products, and users sync to Google Sheets securely separated by Client Name.
                </p>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Google Apps Script Web App URL</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={googleSheetWebAppUrl} 
                      onChange={e => setGoogleSheetWebAppUrl(e.target.value)}
                      placeholder="https://script.google.com/macros/s/.../exec"
                      className="flex-1 bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-xs font-mono"
                    />
                    <button 
                      onClick={handleSaveUrlToCode}
                      disabled={isSavingUrl}
                      className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {isSavingUrl ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                      <span>Save to Code</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <button 
                    onClick={seedClientDummyData}
                    className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-xl text-xs shadow transition-colors flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Seed Dummy Menu & User to Google Sheet</span>
                  </button>

                  <button 
                    onClick={() => {
                      if (window.confirm('Are you sure you want to WIPE and RESET all tables in Google Sheet? This cannot be undone.')) {
                        resetGoogleSheets();
                      }
                    }}
                    className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 rounded-xl text-xs shadow transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Reset & Setup Google Sheet (Wipe & Re-create Tables)</span>
                  </button>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Apps Script Code Template</span>
                    <button 
                      onClick={copyAppsScriptCode}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedScript ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                  </div>
                  <pre className="bg-slate-950 text-emerald-400 p-3 rounded-xl text-[10px] font-mono overflow-x-auto max-h-36">
                    {APPS_SCRIPT_TEMPLATE}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* Database Backup & Restore */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-amber-500" />
              Database Backup & Restore
            </h3>

            <div className="space-y-4">
              <button 
                onClick={handleExportBackup}
                className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow text-xs"
              >
                <Download className="w-4 h-4" />
                <span>Download Database JSON Backup</span>
              </button>

              <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <textarea 
                  rows={2}
                  placeholder="Paste backup JSON string here..."
                  value={restoreJsonInput}
                  onChange={e => setRestoreJsonInput(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-xs font-mono"
                />
                <button 
                  onClick={handleRestore}
                  className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Restore Database</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
