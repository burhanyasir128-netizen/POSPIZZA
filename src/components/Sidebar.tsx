import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, ShoppingCart, ClipboardList, Users, 
  Bike, Package, ShoppingBag, Receipt, Wallet, UtensilsCrossed, 
  Gift, BarChart3, Settings, ShieldCheck, Pizza, Key
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser, orders } = useApp();
  const role = currentUser?.role || 'Cashier';

  const newOrdersCount = orders.filter(o => o.status === 'New').length;
  const deliveryOrdersCount = orders.filter(o => o.status === 'Ready' || o.status === 'Out for Delivery').length;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Super Admin', 'Owner', 'Manager'] },
    { id: 'pos', label: 'POS Terminal', icon: ShoppingCart, roles: ['Super Admin', 'Owner', 'Manager', 'Cashier'] },
    { id: 'orders', label: 'Orders History', icon: ClipboardList, roles: ['Super Admin', 'Owner', 'Manager', 'Cashier'] },
    { id: 'customers', label: 'Customers CRM', icon: Users, roles: ['Super Admin', 'Owner', 'Manager', 'Cashier'] },
    { id: 'delivery', label: 'Delivery & Riders', icon: Bike, badge: deliveryOrdersCount > 0 ? deliveryOrdersCount : null, roles: ['Super Admin', 'Owner', 'Manager', 'Delivery Rider'] },
    { id: 'inventory', label: 'Inventory & Recipe', icon: Package, roles: ['Super Admin', 'Owner', 'Manager'] },
    { id: 'purchases', label: 'Purchases & Supp.', icon: ShoppingBag, roles: ['Super Admin', 'Owner', 'Manager'] },
    { id: 'expenses', label: 'Expenses', icon: Receipt, roles: ['Super Admin', 'Owner', 'Manager'] },
    { id: 'shifts', label: 'Shift & Cash Drawer', icon: Wallet, roles: ['Super Admin', 'Owner', 'Manager', 'Cashier'] },
    { id: 'products', label: 'Products & Menu', icon: UtensilsCrossed, roles: ['Super Admin', 'Owner', 'Manager'] },
    { id: 'deals', label: 'Deals & Coupons', icon: Gift, roles: ['Super Admin', 'Owner', 'Manager'] },
    { id: 'reports', label: 'Reports & P&L', icon: BarChart3, roles: ['Super Admin', 'Owner', 'Manager'] },
    { id: 'licenseManager', label: 'License Manager', icon: Key, roles: ['Super Admin'] },
    { id: 'settings', label: 'Settings & Audit', icon: Settings, roles: ['Super Admin', 'Owner'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(role));

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen border-r border-slate-800 select-none shadow-xl">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3 bg-slate-950">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
          <Pizza className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h1 className="font-bold text-white tracking-wide text-base">Crust & Co.</h1>
          <p className="text-xs text-amber-400 font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            Offline POS (100% Local)
          </p>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 custom-scrollbar">
        {filteredItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                isActive 
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-semibold' 
                  : 'hover:bg-slate-800 hover:text-white text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-slate-950 text-amber-400' : 'bg-orange-600 text-white animate-pulse'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Current Role Card */}
      <div className="p-4 border-t border-slate-800 bg-slate-950">
        <div className="flex items-center gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
          <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-sm">
            {currentUser?.name?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{currentUser?.name || 'Guest'}</p>
            <p className="text-[11px] text-amber-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              {currentUser?.role || 'User'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
