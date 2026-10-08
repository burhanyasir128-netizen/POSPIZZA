import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Bell, Shield, ChevronDown, Check, Clock, LogOut, Cloud, AlertTriangle } from 'lucide-react';
import { getSyncQueueCount } from '../services/googleSheets';

export const Header: React.FC = () => {
  const { currentUser, setCurrentUser, users, orders, currentShift, settings, inventory } = useApp();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [queueCount, setQueueCount] = useState(getSyncQueueCount());

  useEffect(() => {
    const interval = setInterval(() => {
      setQueueCount(getSyncQueueCount());
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const pendingOrders = orders.filter(o => o.status === 'New' || o.status === 'Preparing');
  const lowStockItems = inventory.filter(i => i.currentStock <= i.minStock);
  const totalAlerts = pendingOrders.length + lowStockItems.length;

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Quick Search */}
      <div className="flex items-center gap-3 w-96">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input 
            type="text" 
            placeholder="Search order #, customer phone, product name..."
            className="w-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 border border-transparent dark:border-slate-700"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Google Sheet Sync Status Indicator */}
        {settings.googleSheetWebAppUrl && (
          <div className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${
            !navigator.onLine || queueCount > 0 
              ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800' 
              : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
          }`} title="Google Sheets Auto-Sync Status">
            <Cloud className="w-4 h-4 animate-pulse" />
            <span>{!navigator.onLine ? 'Offline / Queued' : queueCount > 0 ? `Syncing... (${queueCount})` : 'Synced'}</span>
          </div>
        )}

        {/* Shift status badge */}
        <div className="hidden lg:flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
          <Clock className="w-4 h-4" />
          <span>Shift Open: {currentShift.cashierName}</span>
        </div>

        {/* Notifications & Low Stock Alerts */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-xl transition-colors ${
              lowStockItems.length > 0 
                ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 animate-pulse' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {lowStockItems.length > 0 ? <AlertTriangle className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
            {totalAlerts > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {totalAlerts}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-3 z-50">
              <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className="font-bold text-sm text-slate-800 dark:text-slate-100">System Alerts & Notifications</span>
                <span className="text-xs bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-full font-semibold">
                  {totalAlerts} Total
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {lowStockItems.length > 0 && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/30">
                    <p className="text-xs font-black text-rose-700 dark:text-rose-400 flex items-center gap-1.5 mb-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Low Stock Ingredients Warning ({lowStockItems.length})</span>
                    </p>
                    {lowStockItems.map(item => (
                      <div key={item.id} className="text-xs text-slate-700 dark:text-slate-300 flex justify-between py-0.5">
                        <span>{item.name}</span>
                        <span className="font-bold text-rose-600">{item.currentStock} {item.unit} left (Min: {item.minStock})</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="p-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pending Kitchen Orders</p>
                  {pendingOrders.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-2">No pending orders</p>
                  ) : (
                    pendingOrders.map(ord => (
                      <div key={ord.id} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors">
                        <div className="flex justify-between items-center text-xs font-bold text-slate-800 dark:text-slate-200">
                          <span>Order #{ord.orderNumber} ({ord.type})</span>
                          <span className="text-orange-600 dark:text-orange-400">Rs. {ord.total}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{ord.customer?.name || 'Walk-in'} • {ord.status}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher & Logout Selector */}
        <div className="relative">
          <button 
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 transition-all border border-slate-200 dark:border-slate-700"
          >
            <Shield className="w-4 h-4 text-amber-500" />
            <span>{currentUser?.role}: {currentUser?.name}</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <p className="text-xs font-semibold text-slate-400">LOGGED IN USER</p>
                <button 
                  onClick={() => setCurrentUser(null)}
                  className="text-xs text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1 hover:underline"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {users.map(u => (
                  <button
                    key={u.id}
                    onClick={() => {
                      setCurrentUser(u);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                      currentUser?.id === u.id ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 font-semibold' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div>
                      <p className="font-medium">{u.name}</p>
                      <p className="text-xs text-slate-400">{u.role}</p>
                    </div>
                    {currentUser?.id === u.id && <Check className="w-4 h-4 text-amber-500" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
