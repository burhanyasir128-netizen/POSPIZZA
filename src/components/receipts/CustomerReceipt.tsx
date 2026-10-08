import React from 'react';
import { Order, ShopSettings } from '../../types';
import { INITIAL_SETTINGS } from '../../mockData';

interface CustomerReceiptProps {
  order: Order;
  settings?: ShopSettings;
}

export const CustomerReceipt: React.FC<CustomerReceiptProps> = ({ order, settings = INITIAL_SETTINGS }) => {
  return (
    <div className="receipt-box bg-white text-slate-900 p-3 font-mono text-xs space-y-3 w-[80mm] max-w-[80mm] mx-auto border border-dashed border-slate-300">
      <div className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold text-center text-[11px] mb-1">
        CUSTOMER COPY (BILL)
      </div>

      <div className="text-center pb-2 border-b border-dashed border-slate-400 space-y-1">
        <div className="flex justify-center mb-1">
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt="Shop Logo" className="w-12 h-12 object-contain mx-auto" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm">
              🍕
            </div>
          )}
        </div>
        <h2 className="font-black text-sm">{settings.shopName}</h2>
        <p className="text-[10px] text-slate-600">{settings.address}</p>
        <p className="text-[10px] text-slate-600">Phone: {settings.phone}</p>
      </div>

      <div className="space-y-0.5 text-[11px]">
        <div className="flex justify-between">
          <span><b>Order #:</b> {order.orderNumber}</span>
          <span><b>Type:</b> {order.type} {order.tableNumber ? `(${order.tableNumber})` : ''}</span>
        </div>
        <p><b>Date:</b> {order.createdAt}</p>
        <p><b>Cashier:</b> {order.cashierName}</p>
        <p><b>Customer:</b> {order.customer?.name} ({order.customer?.phone})</p>
      </div>

      <div className="border-t border-b border-dashed border-slate-400 py-2 space-y-1.5">
        <div className="flex justify-between font-bold text-[11px] pb-1 border-b border-slate-200">
          <span>Item</span>
          <span>Total</span>
        </div>
        {order.items.map((it, idx) => (
          <div key={idx} className="flex justify-between items-start gap-2">
            <div>
              <p className="font-bold">{it.quantity}x {it.name}</p>
              {it.crust && <p className="text-[10px] text-slate-600">Crust: {it.crust} | Sauce: {it.sauce}</p>}
              {it.toppings && it.toppings.length > 0 && (
                <p className="text-[10px] text-slate-500">Toppings: {it.toppings.join(', ')}</p>
              )}
            </div>
            <span className="font-bold shrink-0">Rs. {it.itemTotal}</span>
          </div>
        ))}
      </div>

      <div className="space-y-1 text-right text-[11px] pt-1">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>Rs. {order.subtotal}</span>
        </div>
        {order.discountAmount > 0 && (
          <div className="flex justify-between text-emerald-700">
            <span>Discount:</span>
            <span>- Rs. {order.discountAmount}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>GST ({settings.taxPercentage}%):</span>
          <span>Rs. {order.taxAmount}</span>
        </div>
        {order.deliveryCharges > 0 && (
          <div className="flex justify-between">
            <span>Delivery Fee:</span>
            <span>Rs. {order.deliveryCharges}</span>
          </div>
        )}
        <div className="flex justify-between font-black text-sm pt-1 border-t border-slate-400">
          <span>Total:</span>
          <span>Rs. {order.total}</span>
        </div>
        <div className="flex justify-between font-bold text-slate-800 pt-1">
          <span>Payment:</span>
          <span>{order.paymentMethod} ({order.paymentStatus})</span>
        </div>
      </div>

      <div className="text-center pt-2 border-t border-dashed border-slate-400 text-[10px] text-slate-600 space-y-1">
        <p>{settings.receiptFooter}</p>
        <p className="text-[9px] text-slate-400 font-sans tracking-wide pt-1 border-t border-slate-200">
          Powered by {settings.developerName || 'Crust & Co. POS Systems'}
        </p>
      </div>
    </div>
  );
};
