import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Order, OrderStatus } from '../types';
import { ClipboardList, Search, Eye, XCircle, RotateCcw, Bike, CheckCircle2, Printer, X } from 'lucide-react';

export const OrdersView: React.FC = () => {
  const { orders, cancelOrder, refundOrder, assignRider, riders, updateOrderStatus } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Cancel / Refund modal
  const [actionModal, setActionModal] = useState<{ type: 'cancel' | 'refund' | 'assign'; order: Order } | null>(null);
  const [reasonInput, setReasonInput] = useState('');
  const [selectedRiderId, setSelectedRiderId] = useState('');

  const filteredOrders = orders.filter(o => {
    const matchesStatus = filterStatus === 'All' || o.status === filterStatus;
    const matchesSearch = o.orderNumber.toString().includes(searchQuery) || (o.customer?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (o.customer?.phone || '').includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const handleExecuteAction = () => {
    if (!actionModal) return;
    if (actionModal.type === 'cancel') {
      cancelOrder(actionModal.order.id, reasonInput || 'Cancelled by manager');
    } else if (actionModal.type === 'refund') {
      refundOrder(actionModal.order.id, reasonInput || 'Customer refund');
    } else if (actionModal.type === 'assign') {
      assignRider(actionModal.order.id, selectedRiderId);
    }
    setActionModal(null);
    setReasonInput('');
  };

  return (
    <div className="p-8 space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Orders Management</h1>
          <p className="text-sm text-slate-500">View complete transaction history, assign riders, process refunds & cancellations.</p>
        </div>
        <div className="flex gap-2">
          {['All', 'New', 'Preparing', 'Ready', 'Completed', 'Cancelled', 'Refunded'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterStatus === st 
                  ? 'bg-amber-500 text-slate-950 shadow' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by order #, customer name, phone..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm focus:outline-none"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 uppercase text-xs">
                <th className="p-4">Order #</th>
                <th className="p-4">Type</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Total (PKR)</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4">Time</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">No orders found matching criteria.</td>
                </tr>
              ) : (
                filteredOrders.map(ord => (
                  <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-black text-slate-900 dark:text-white">#{ord.orderNumber}</td>
                    <td className="p-4 font-semibold">{ord.type} {ord.tableNumber ? `(${ord.tableNumber})` : ''}</td>
                    <td className="p-4">
                      <p className="font-bold">{ord.customer?.name || 'Walk-in'}</p>
                      <p className="text-xs text-slate-400">{ord.customer?.phone}</p>
                    </td>
                    <td className="p-4 font-black text-amber-600 dark:text-amber-400">Rs. {ord.total}</td>
                    <td className="p-4">
                      <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {ord.paymentMethod} ({ord.paymentStatus})
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                        ord.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                        ord.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' :
                        ord.status === 'Refunded' ? 'bg-purple-100 text-purple-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-slate-400">{ord.createdAt}</td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => setSelectedOrder(ord)} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200">
                        <Eye className="w-4 h-4" />
                      </button>
                      {ord.type === 'Delivery' && ord.status === 'Ready' && (
                        <button onClick={() => setActionModal({ type: 'assign', order: ord })} className="p-2 rounded-xl bg-purple-100 text-purple-700 hover:bg-purple-200" title="Assign Rider">
                          <Bike className="w-4 h-4" />
                        </button>
                      )}
                      {ord.status !== 'Cancelled' && ord.status !== 'Refunded' && (
                        <>
                          <button onClick={() => setActionModal({ type: 'cancel', order: ord })} className="p-2 rounded-xl bg-rose-100 text-rose-700 hover:bg-rose-200" title="Cancel Order">
                            <XCircle className="w-4 h-4" />
                          </button>
                          <button onClick={() => setActionModal({ type: 'refund', order: ord })} className="p-2 rounded-xl bg-amber-100 text-amber-700 hover:bg-amber-200" title="Refund Order">
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Order Details #{selectedOrder.orderNumber}</h2>
              <button onClick={() => setSelectedOrder(null)} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                <div>
                  <p className="text-xs text-slate-400">Order Type</p>
                  <p className="font-bold">{selectedOrder.type} {selectedOrder.tableNumber ? `(${selectedOrder.tableNumber})` : ''}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Status</p>
                  <p className="font-bold text-amber-600">{selectedOrder.status}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Customer</p>
                  <p className="font-bold">{selectedOrder.customer?.name || 'Walk-in'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Phone</p>
                  <p className="font-bold">{selectedOrder.customer?.phone || 'N/A'}</p>
                </div>
              </div>

              <div>
                <p className="font-bold text-sm mb-2">Ordered Items</p>
                <div className="space-y-2 max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {selectedOrder.items.map((it, i) => (
                    <div key={i} className="pt-2 flex justify-between">
                      <div>
                        <p className="font-bold">{it.quantity}x {it.name}</p>
                        {it.crust && <p className="text-xs text-slate-400">Crust: {it.crust} | Sauce: {it.sauce}</p>}
                      </div>
                      <span className="font-bold">Rs. {it.itemTotal}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-1 text-right">
                <p className="text-xs text-slate-500">Subtotal: Rs. {selectedOrder.subtotal}</p>
                {selectedOrder.discountAmount > 0 && <p className="text-xs text-emerald-600">Discount: - Rs. {selectedOrder.discountAmount}</p>}
                <p className="text-xs text-slate-500">GST: Rs. {selectedOrder.taxAmount}</p>
                {selectedOrder.deliveryCharges > 0 && <p className="text-xs text-slate-500">Delivery: Rs. {selectedOrder.deliveryCharges}</p>}
                <p className="text-base font-black text-amber-600">Total: Rs. {selectedOrder.total}</p>
              </div>

              {/* Audit trail */}
              <div>
                <p className="font-bold text-xs uppercase text-slate-400 mb-2">Audit Trail</p>
                <div className="space-y-1 text-xs text-slate-500">
                  {selectedOrder.auditTrail.map((at, idx) => (
                    <p key={idx}>[{at.timestamp}] {at.action} by <b>{at.user}</b></p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Modal (Cancel / Refund / Assign Rider) */}
      {actionModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <h2 className="text-xl font-black text-slate-900 dark:text-white capitalize">
              {actionModal.type} Order #{actionModal.order.orderNumber}
            </h2>

            {actionModal.type === 'assign' ? (
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Select Delivery Rider</label>
                <select 
                  value={selectedRiderId} 
                  onChange={e => setSelectedRiderId(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-xl font-bold"
                >
                  <option value="">Choose Rider</option>
                  {riders.map(r => <option key={r.id} value={r.id}>{r.name} ({r.vehicle})</option>)}
                </select>
              </div>
            ) : (
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Reason for {actionModal.type}</label>
                <input 
                  type="text" 
                  placeholder="Enter reason..."
                  value={reasonInput}
                  onChange={e => setReasonInput(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-xl font-bold text-sm"
                />
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setActionModal(null)} className="flex-1 bg-slate-200 dark:bg-slate-800 font-bold py-3 rounded-xl">
                Close
              </button>
              <button onClick={handleExecuteAction} className="flex-1 bg-amber-500 text-slate-950 font-black py-3 rounded-xl shadow">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
