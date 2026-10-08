import React from 'react';
import { Order } from '../../types';

interface KitchenTicketProps {
  order: Order;
}

export const KitchenTicket: React.FC<KitchenTicketProps> = ({ order }) => {
  return (
    <div className="receipt-box bg-white text-slate-900 p-4 font-mono text-xs space-y-3 w-[80mm] mx-auto border border-dashed border-slate-300">
      <div className="bg-rose-700 text-white px-2 py-1 rounded font-bold text-center text-xs mb-1 uppercase tracking-wider">
        KITCHEN TICKET (PREP COPY)
      </div>

      <div className="text-center pb-2 border-b border-dashed border-slate-400">
        <h2 className="font-black text-base">ORDER #{order.orderNumber}</h2>
        <p className="text-sm font-black text-rose-700 mt-0.5">{order.type.toUpperCase()} {order.tableNumber ? `• ${order.tableNumber}` : ''}</p>
        <p className="text-[10px] text-slate-600 mt-0.5">Time: {order.createdAt}</p>
      </div>

      <div className="border-t border-b border-dashed border-slate-400 py-3 space-y-3">
        {order.items.map((it, idx) => (
          <div key={idx} className="space-y-1 pb-2 border-b border-slate-200 last:border-b-0">
            <p className="font-black text-sm text-slate-900">{it.quantity}x {it.name}</p>
            {it.crust && <p className="text-[11px] text-slate-700"><b>Crust:</b> {it.crust} | <b>Sauce:</b> {it.sauce}</p>}
            {it.toppings && it.toppings.length > 0 && (
              <p className="text-[11px] text-slate-700"><b>Toppings:</b> {it.toppings.join(', ')}</p>
            )}
            {it.specialInstructions && (
              <p className="text-xs bg-rose-100 text-rose-900 p-1.5 rounded font-bold">NOTE: {it.specialInstructions}</p>
            )}
          </div>
        ))}
      </div>

      {order.notes && (
        <div className="p-2 bg-amber-100 rounded text-xs font-bold text-amber-900">
          Order Note: {order.notes}
        </div>
      )}
    </div>
  );
};
