import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  TrendingUp, ShoppingBag, DollarSign, Receipt, 
  AlertTriangle, ArrowUpRight, Clock, ChefHat, Bike, CheckCircle 
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { orders, inventory, products } = useApp();
  const [timeRange, setTimeRange] = useState<'today' | 'yesterday' | '7days' | '30days'>('today');

  // Calculations
  const todayOrders = orders.filter(o => o.status !== 'Cancelled');
  const totalSales = todayOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = todayOrders.length;
  const estimatedProfit = Math.round(totalSales * 0.42); // 42% average margin
  const totalExpenses = 180000; // Simulated monthly / daily expenses

  const cashSales = todayOrders.filter(o => o.paymentMethod === 'Cash').reduce((s, o) => s + o.total, 0);
  const onlineSales = todayOrders.filter(o => o.paymentMethod !== 'Cash').reduce((s, o) => s + o.total, 0);
  const deliverySales = todayOrders.filter(o => o.type === 'Delivery').reduce((s, o) => s + o.total, 0);
  const dineInSales = todayOrders.filter(o => o.type === 'Dine-In').reduce((s, o) => s + o.total, 0);
  const takeawaySales = todayOrders.filter(o => o.type === 'Takeaway').reduce((s, o) => s + o.total, 0);

  const statusNew = orders.filter(o => o.status === 'New').length;
  const statusPreparing = orders.filter(o => o.status === 'Preparing').length;
  const statusReady = orders.filter(o => o.status === 'Ready').length;
  const statusDelivery = orders.filter(o => o.status === 'Out for Delivery').length;
  const statusCompleted = orders.filter(o => o.status === 'Completed').length;

  const lowStockItems = inventory.filter(i => i.currentStock <= i.minStock);

  return (
    <div className="p-8 space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100">
      {/* Top Banner & Time Range Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Business Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Real-time overview of sales, orders, and inventory status in PKR.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl">
          {(['today', 'yesterday', '7days', '30days'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                timeRange === range 
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {range === 'today' ? 'Today' : range === 'yesterday' ? 'Yesterday' : range === '7days' ? 'Last 7 Days' : 'Last 30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">Today's Sales</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">Rs. {totalSales.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight className="w-4 h-4" />
            <span>+18.4% vs yesterday</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">Total Orders</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalOrdersCount}</h3>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Clock className="w-4 h-4" />
            <span>Avg preparation time: 18 mins</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">Estimated Profit</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">Rs. {estimatedProfit.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <span>Food cost ratio: ~38%</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">Expenses (MTD)</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">Rs. {totalExpenses.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl">
              <Receipt className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-rose-500">
            <span>Rent, utilities & supplies</span>
          </div>
        </div>
      </div>

      {/* Sales breakdown & Order status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment & Order Type breakdown */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Payment & Channels</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-semibold mb-1">
                <span>Cash Sales</span>
                <span>Rs. {cashSales.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${totalSales ? (cashSales / totalSales) * 100 : 0}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-semibold mb-1">
                <span>Online / Card Payments</span>
                <span>Rs. {onlineSales.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: `${totalSales ? (onlineSales / totalSales) * 100 : 0}%` }}></div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <p className="text-xs text-slate-400">Dine-In</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1">Rs. {dineInSales}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <p className="text-xs text-slate-400">Delivery</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1">Rs. {deliverySales}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <p className="text-xs text-slate-400">Takeaway</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1">Rs. {takeawaySales}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Status Overview */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Active Order Status</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/50 rounded-2xl">
              <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase">New Orders</span>
              <p className="text-3xl font-black text-orange-700 dark:text-orange-300 mt-2">{statusNew}</p>
            </div>
            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">Preparing</span>
              <p className="text-3xl font-black text-amber-700 dark:text-amber-300 mt-2">{statusPreparing}</p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-2xl">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">Ready</span>
              <p className="text-3xl font-black text-blue-700 dark:text-blue-300 mt-2">{statusReady}</p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/50 rounded-2xl">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">Out for Delivery</span>
              <p className="text-3xl font-black text-purple-700 dark:text-purple-300 mt-2">{statusDelivery}</p>
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Low Stock Alerts
            </h3>
            <span className="text-xs bg-rose-100 text-rose-600 font-bold px-2.5 py-1 rounded-full">
              {lowStockItems.length} items
            </span>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto">
            {lowStockItems.length === 0 ? (
              <div className="text-center py-8 text-sm text-slate-400">All inventory levels are healthy!</div>
            ) : (
              lowStockItems.map(item => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <div>
                    <p className="font-bold text-sm text-slate-800 dark:text-slate-100">{item.name}</p>
                    <p className="text-xs text-rose-500 font-medium">Remaining: {item.currentStock} {item.unit}</p>
                  </div>
                  <span className="text-xs bg-rose-500 text-white font-bold px-2 py-1 rounded-lg">Critical</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
