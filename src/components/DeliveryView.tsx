import React from 'react';
import { useApp } from '../context/AppContext';
import { Bike, Phone, CheckCircle2, Clock, MapPin } from 'lucide-react';

export const DeliveryView: React.FC = () => {
  const { riders, updateRiderStatus, orders, assignRider } = useApp();

  const activeDeliveryOrders = orders.filter(o => o.type === 'Delivery' && (o.status === 'Ready' || o.status === 'Out for Delivery'));

  return (
    <div className="p-8 space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Delivery & Rider Dispatch</h1>
          <p className="text-sm text-slate-500">Monitor delivery orders, assign riders, and track cash collected.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Riders status list */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <Bike className="w-5 h-5 text-amber-500" />
            Delivery Riders
          </h3>

          <div className="space-y-3">
            {riders.map(r => (
              <div key={r.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{r.name}</h4>
                    <p className="text-xs text-slate-400">{r.vehicle} ({r.vehicleNumber})</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    r.status === 'Available' ? 'bg-emerald-100 text-emerald-700' :
                    r.status === 'Busy' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-200 text-slate-600'
                  }`}>
                    {r.status}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span>Deliveries: <b>{r.deliveriesCompleted}</b></span>
                  <span>Cash: <b className="text-amber-600">Rs. {r.cashCollected}</b></span>
                </div>

                <div className="flex gap-2 pt-2">
                  {(['Available', 'Busy', 'Offline'] as const).map(st => (
                    <button
                      key={st}
                      onClick={() => updateRiderStatus(r.id, st)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        r.status === st ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Deliveries Queue */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Active Deliveries Queue</h3>

          <div className="space-y-4">
            {activeDeliveryOrders.length === 0 ? (
              <div className="text-center py-12 text-slate-400">No active delivery orders currently out or ready.</div>
            ) : (
              activeDeliveryOrders.map(ord => (
                <div key={ord.id} className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-amber-600">Order #{ord.orderNumber}</span>
                      <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2.5 py-0.5 rounded-full font-bold">{ord.status}</span>
                    </div>
                    <p className="font-bold text-sm text-slate-900 dark:text-white">{ord.customer?.name} ({ord.customer?.phone})</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      {ord.customer?.address || 'Address provided'} • {ord.customer?.area}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900 dark:text-white">Rs. {ord.total}</p>
                    <p className="text-xs text-slate-400 mt-1">Rider: <b className="text-amber-500">{ord.riderName || 'Unassigned'}</b></p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
