import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product, CartItem, OrderType, PaymentMethod, Customer } from '../types';
import { CustomerReceipt } from './receipts/CustomerReceipt';
import { KitchenTicket } from './receipts/KitchenTicket';
import { 
  ShoppingCart, Plus, Minus, Trash2, Printer, CheckCircle, 
  Search, User, MapPin, Tag, Flame, Percent, CreditCard, Sparkles, X, ArrowRight
} from 'lucide-react';

export const POSView: React.FC = () => {
  const { 
    categories, products, customers, zones, coupons, 
    createOrder, settings, showToast 
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('c1');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>('Dine-In');
  const [tableNumber, setTableNumber] = useState('Table 1');
  const [persons, setPersons] = useState<number>(2);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(customers[0] || null);
  const [selectedZone, setSelectedZone] = useState(zones[0]);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed' | 'coupon' | null>(null);
  const [discountValue, setDiscountValue] = useState(0);
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [notes, setNotes] = useState('');

  // Modals
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<'small' | 'medium' | 'large' | 'xl' | 'regular'>('large');
  const [crust, setCrust] = useState('Cheese Burst');
  const [sauce, setSauce] = useState('Pizza Sauce');
  const [cheese, setCheese] = useState('Extra Cheese');
  const [toppings, setToppings] = useState<string[]>(['Chicken', 'Jalapeno', 'Mushrooms']);
  const [selectedAddons, setSelectedAddons] = useState<{ id: string; name: string; price: number }[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Payment & Receipt Modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [amountReceived, setAmountReceived] = useState<string>('');
  const [completedOrderReceipt, setCompletedOrderReceipt] = useState<any | null>(null);

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesCat = p.categoryId === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.itemTotal, 0);
  
  let calculatedDiscount = 0;
  if (discountType === 'percentage') {
    calculatedDiscount = Math.round((subtotal * discountValue) / 100);
  } else if (discountType === 'fixed') {
    calculatedDiscount = discountValue;
  }

  const taxRate = settings.taxPercentage || 5;
  const taxAmount = Math.round(((subtotal - calculatedDiscount) * taxRate) / 100);
  const deliveryFee = orderType === 'Delivery' ? selectedZone.fee : 0;
  const total = Math.max(0, subtotal - calculatedDiscount + taxAmount + deliveryFee);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handleCheckoutSubmit();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (cartItems.length > 0) {
          const newOrder = createOrder({
            type: orderType,
            customer: selectedCustomer ? { id: selectedCustomer.id, name: selectedCustomer.name, phone: selectedCustomer.phone, address: selectedCustomer.addresses[0]?.address, area: selectedZone.area } : { name: 'Walk-in Customer', phone: '03000000000' },
            tableNumber: orderType === 'Dine-In' ? tableNumber : undefined,
            persons: orderType === 'Dine-In' ? persons : undefined,
            items: cartItems,
            subtotal,
            discountAmount: calculatedDiscount,
            discountType: discountType || undefined,
            taxAmount,
            deliveryCharges: deliveryFee,
            total,
            paymentMethod: 'Cash',
            paymentStatus: 'Pending',
            notes,
          });
          setCompletedOrderReceipt(newOrder);
          setCartItems([]);
          showToast('Order sent to kitchen successfully!');
        } else {
          showToast('Cart is empty.', 'error');
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        if (cartItems.length > 0) {
          setCartItems([]);
          showToast('Cart cleared.', 'warning');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cartItems, orderType, selectedCustomer, selectedZone, tableNumber, persons, subtotal, calculatedDiscount, discountType, taxAmount, deliveryFee, total, notes]);

  // Add product to cart directly or open customizer for pizzas
  const handleProductClick = (product: Product) => {
    if (!product.available) {
      showToast(`${product.name} is currently out of stock.`, 'warning');
      return;
    }

    if (product.isPizza) {
      setCustomizingProduct(product);
      setSelectedSize('large');
      setCrust('Cheese Burst');
      setSauce('Pizza Sauce');
      setCheese('Extra Cheese');
      setToppings(['Chicken', 'Mushrooms']);
      setSelectedAddons([]);
      setSpecialInstructions('');
    } else {
      // Add non-pizza item directly
      const price = product.prices.regular || product.prices.medium || 500;
      const newItem: CartItem = {
        cartItemId: `ci-${Date.now()}-${Math.random()}`,
        productId: product.id,
        name: product.name,
        price,
        quantity: 1,
        itemTotal: price
      };
      setCartItems([...cartItems, newItem]);
      showToast(`Added ${product.name} to cart.`);
    }
  };

  const handleAddToCartCustomized = () => {
    if (!customizingProduct) return;
    const basePrice = customizingProduct.prices[selectedSize] || customizingProduct.prices.large || 1299;
    const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
    const itemUnitPrice = basePrice + addonsTotal;

    const newItem: CartItem = {
      cartItemId: `ci-${Date.now()}`,
      productId: customizingProduct.id,
      name: `${customizingProduct.name} (${selectedSize.toUpperCase()})`,
      size: selectedSize,
      sizeLabel: `${selectedSize.toUpperCase()} Pizza`,
      price: itemUnitPrice,
      quantity: 1,
      crust,
      sauce,
      cheese,
      toppings,
      addons: selectedAddons,
      specialInstructions,
      itemTotal: itemUnitPrice
    };

    setCartItems([...cartItems, newItem]);
    setCustomizingProduct(null);
    showToast(`Customized ${customizingProduct.name} added to cart!`);
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCartItems(cartItems.map(item => {
      if (item.cartItemId === cartItemId) {
        const newQty = Math.max(1, item.quantity + delta);
        const unitPrice = item.itemTotal / item.quantity;
        return { ...item, quantity: newQty, itemTotal: unitPrice * newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems(cartItems.filter(item => item.cartItemId !== cartItemId));
  };

  const applyCoupon = () => {
    const coupon = coupons.find(c => c.code.toUpperCase() === couponCodeInput.toUpperCase() && c.active);
    if (!coupon) {
      showToast('Invalid or expired coupon code.', 'error');
      return;
    }
    if (subtotal < coupon.minOrderAmount) {
      showToast(`Minimum order amount for ${coupon.code} is Rs. ${coupon.minOrderAmount}`, 'warning');
      return;
    }
    setDiscountType('percentage');
    setDiscountValue(coupon.discountValue);
    showToast(`Coupon ${coupon.code} applied successfully!`);
  };

  const handleCheckoutSubmit = () => {
    if (cartItems.length === 0) {
      showToast('Cart is empty.', 'error');
      return;
    }
    setShowPaymentModal(true);
  };

  const confirmPaymentAndCreateOrder = () => {
    const newOrder = createOrder({
      type: orderType,
      customer: selectedCustomer ? { id: selectedCustomer.id, name: selectedCustomer.name, phone: selectedCustomer.phone, address: selectedCustomer.addresses[0]?.address, area: selectedZone.area } : { name: 'Walk-in Customer', phone: '03000000000' },
      tableNumber: orderType === 'Dine-In' ? tableNumber : undefined,
      persons: orderType === 'Dine-In' ? persons : undefined,
      items: cartItems,
      subtotal,
      discountAmount: calculatedDiscount,
      discountType: discountType || undefined,
      taxAmount,
      deliveryCharges: deliveryFee,
      total,
      paymentMethod,
      paymentStatus: 'Paid',
      notes,
    });

    setCompletedOrderReceipt(newOrder);
    setShowPaymentModal(false);
    setCartItems([]);
  };

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-950 overflow-hidden">
      {/* Left & Center: Categories and Products */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Category Header Tabs */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center gap-3 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-2xl font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedCategory === cat.id 
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Product Catalog Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map(product => {
              const basePrice = product.prices.large || product.prices.medium || product.prices.regular || 500;
              return (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className={`bg-white dark:bg-slate-900 rounded-2xl p-4 border transition-all cursor-pointer group flex flex-col justify-between shadow-xs hover:shadow-xl hover:border-amber-500/50 ${
                    !product.available ? 'opacity-60 grayscale' : ''
                  }`}
                >
                  <div>
                    <div className="relative h-40 rounded-xl overflow-hidden mb-3 bg-slate-100 dark:bg-slate-800">
                      <img 
                        src={product.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600'} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {!product.available && (
                        <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center">
                          <span className="bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Out of Stock</span>
                        </div>
                      )}
                      {product.isPizza && (
                        <span className="absolute top-2 left-2 bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase shadow">
                          Customizable
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-amber-500 transition-colors">{product.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{product.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400">Starts from</span>
                      <p className="text-base font-black text-amber-600 dark:text-amber-400">Rs. {basePrice}</p>
                    </div>
                    <button className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Side: Current Cart & POS Panel */}
      <div className="w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col h-full shadow-2xl">
        {/* Order Type & Table Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
          <div className="grid grid-cols-3 gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {(['Dine-In', 'Takeaway', 'Delivery'] as const).map(type => (
              <button
                key={type}
                onClick={() => setOrderType(type)}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  orderType === type 
                    ? 'bg-amber-500 text-slate-950 shadow' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {orderType === 'Dine-In' && (
            <div className="flex gap-2">
              <select 
                value={tableNumber} 
                onChange={e => setTableNumber(e.target.value)}
                className="flex-1 bg-slate-100 dark:bg-slate-800 text-sm font-semibold p-2.5 rounded-xl border-none focus:ring-2 focus:ring-amber-500"
              >
                {['Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5', 'VIP Table 6'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <select 
                value={persons} 
                onChange={e => setPersons(Number(e.target.value))}
                className="w-24 bg-slate-100 dark:bg-slate-800 text-sm font-semibold p-2.5 rounded-xl border-none focus:ring-2 focus:ring-amber-500"
              >
                {[1, 2, 3, 4, 6, 8, 10].map(p => <option key={p} value={p}>{p} Persons</option>)}
              </select>
            </div>
          )}

          {orderType === 'Delivery' && (
            <div className="space-y-2">
              <select 
                value={selectedZone.id} 
                onChange={e => {
                  const z = zones.find(zn => zn.id === e.target.value);
                  if (z) setSelectedZone(z);
                }}
                className="w-full bg-slate-100 dark:bg-slate-800 text-sm font-semibold p-2.5 rounded-xl border-none focus:ring-2 focus:ring-amber-500"
              >
                {zones.map(z => <option key={z.id} value={z.id}>{z.area} (Fee: Rs. {z.fee})</option>)}
              </select>
              {selectedCustomer && (
                <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl flex justify-between items-center">
                  <span>Customer: <b>{selectedCustomer.name}</b> ({selectedCustomer.phone})</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100 dark:divide-slate-800">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-3">
              <ShoppingCart className="w-12 h-12 text-slate-300 dark:text-slate-700 animate-pulse" />
              <p className="text-sm font-medium">Cart is empty. Select items from the menu to start order.</p>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.cartItemId} className="pt-3 first:pt-0 flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-bold text-sm text-slate-900 dark:text-white">{item.name}</p>
                  {item.crust && <p className="text-xs text-amber-600 dark:text-amber-400">Crust: {item.crust} | Sauce: {item.sauce}</p>}
                  {item.toppings && item.toppings.length > 0 && (
                    <p className="text-[11px] text-slate-400">Toppings: {item.toppings.join(', ')}</p>
                  )}
                  {item.addons && item.addons.length > 0 && (
                    <p className="text-[11px] text-emerald-600">Addons: {item.addons.map(a => a.name).join(', ')}</p>
                  )}
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">Rs. {item.itemTotal}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.cartItemId, -1)} className="w-7 h-7 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center font-bold hover:bg-slate-200">
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.cartItemId, 1)} className="w-7 h-7 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center font-bold hover:bg-slate-200">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => removeFromCart(item.cartItemId)} className="text-rose-500 hover:text-rose-700 ml-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Discount & Coupon Bar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 space-y-2">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Enter Coupon (e.g. PIZZA20)" 
              value={couponCodeInput}
              onChange={e => setCouponCodeInput(e.target.value)}
              className="flex-1 bg-white dark:bg-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 uppercase font-bold"
            />
            <button onClick={applyCoupon} className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-3 py-2 rounded-xl text-xs font-bold">
              Apply
            </button>
          </div>
        </div>

        {/* Totals & Checkout Button */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Subtotal</span>
            <span>Rs. {subtotal}</span>
          </div>
          {calculatedDiscount > 0 && (
            <div className="flex justify-between text-xs text-emerald-600 font-semibold">
              <span>Discount</span>
              <span>- Rs. {calculatedDiscount}</span>
            </div>
          )}
          <div className="flex justify-between text-xs text-slate-500">
            <span>GST ({taxRate}%)</span>
            <span>Rs. {taxAmount}</span>
          </div>
          {orderType === 'Delivery' && (
            <div className="flex justify-between text-xs text-slate-500">
              <span>Delivery Charges</span>
              <span>Rs. {deliveryFee}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
            <span>Total Amount</span>
            <span className="text-amber-600 dark:text-amber-400">Rs. {total}</span>
          </div>

          <button 
            onClick={handleCheckoutSubmit}
            disabled={cartItems.length === 0}
            className="w-full mt-2 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black py-3.5 rounded-xl shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 disabled:opacity-50 hover:brightness-110 transition-all"
          >
            <span>Charge & Send to Kitchen</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Pizza Customizer Modal */}
      {customizingProduct && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">{customizingProduct.name}</h2>
                <p className="text-xs text-slate-500">Customize size, crust, sauce and toppings</p>
              </div>
              <button onClick={() => setCustomizingProduct(null)} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Size selection */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Select Size</label>
              <div className="grid grid-cols-4 gap-3">
                {(['small', 'medium', 'large', 'xl'] as const).map(sz => {
                  const p = customizingProduct.prices[sz];
                  if (!p) return null;
                  return (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        selectedSize === sz 
                          ? 'bg-amber-500 text-slate-950 font-black border-amber-500 shadow-md' 
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <p className="text-xs uppercase font-bold">{sz}</p>
                      <p className="text-sm font-black mt-1">Rs. {p}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Crust selection */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Crust Type</label>
              <div className="grid grid-cols-3 gap-3">
                {['Regular Thin', 'Cheese Burst', 'Stuffed Crust', 'Crown Crust'].map(c => (
                  <button
                    key={c}
                    onClick={() => setCrust(c)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                      crust === c 
                        ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-transparent shadow' 
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Sauce Selection */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Sauce</label>
              <div className="grid grid-cols-3 gap-3">
                {['Pizza Sauce', 'BBQ Sauce', 'Creamy Garlic', 'Special Hot'].map(s => (
                  <button
                    key={s}
                    onClick={() => setSauce(s)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                      sauce === s 
                        ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-transparent shadow' 
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Special Instructions</label>
              <input 
                type="text" 
                placeholder="e.g. Less spicy, well baked..."
                value={specialInstructions}
                onChange={e => setSpecialInstructions(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-sm border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <button 
              onClick={handleAddToCartCustomized}
              className="w-full bg-amber-500 text-slate-950 font-black py-4 rounded-2xl shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-colors"
            >
              Add Customized Pizza to Cart
            </button>
          </div>
        </div>
      )}

      {/* Payment & Checkout Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Process Payment</h2>
              <button onClick={() => setShowPaymentModal(false)} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center py-4 bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-200 dark:border-amber-900/50">
              <p className="text-xs text-slate-500 uppercase font-bold">Total Payable Amount</p>
              <p className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">Rs. {total}</p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Payment Method</label>
              <div className="grid grid-cols-2 gap-3">
                {(['Cash', 'JazzCash', 'Easypaisa', 'Debit/Credit Card'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => setPaymentMethod(m)}
                    className={`py-3 px-4 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      paymentMethod === m 
                        ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md' 
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span>{m}</span>
                  </button>
                ))}
              </div>
            </div>

            {paymentMethod === 'Cash' && (
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Amount Tendered</label>
                <input 
                  type="number" 
                  placeholder="Enter cash received..."
                  value={amountReceived}
                  onChange={e => setAmountReceived(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl font-bold text-base border border-slate-200 dark:border-slate-700"
                />
                {Number(amountReceived) >= total && (
                  <p className="text-sm font-bold text-emerald-600 mt-2">Change to Return: Rs. {Number(amountReceived) - total}</p>
                )}
              </div>
            )}

            <button 
              onClick={confirmPaymentAndCreateOrder}
              className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-600/30 hover:bg-emerald-500 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Confirm Payment & Print Receipt</span>
            </button>
          </div>
        </div>
      )}

      {/* Completed Order Dual Receipt Thermal Modal */}
      {completedOrderReceipt && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-100 dark:bg-slate-900 rounded-3xl max-w-4xl w-full p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-300 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Order #{completedOrderReceipt.orderNumber} Successful!</h2>
                <p className="text-xs text-slate-500">Dual receipts generated (Customer Bill + Kitchen Prep Ticket)</p>
              </div>
              <button onClick={() => setCompletedOrderReceipt(null)} className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Print Container holding both receipts with page-break */}
            <div className="print-receipt-container grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomerReceipt order={completedOrderReceipt} settings={settings} />
              <KitchenTicket order={completedOrderReceipt} />
            </div>

            <div className="flex gap-4 pt-2">
              <button 
                onClick={() => window.print()} 
                className="flex-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl"
              >
                <Printer className="w-5 h-5" />
                <span>Print Both Receipts on Thermal Printer</span>
              </button>
              <button 
                onClick={() => setCompletedOrderReceipt(null)}
                className="bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-8 py-4 rounded-2xl font-bold"
              >
                Done / Next Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
