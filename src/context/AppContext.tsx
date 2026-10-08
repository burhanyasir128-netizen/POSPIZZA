import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, UserRole, Order, Product, Category, InventoryItem, Supplier, 
  Customer, RiderRecord, DealRecord, CouponRecord, DeliveryZone, 
  ExpenseRecord, ShiftRecord, AuditLog, ShopSettings, CartItem, OrderStatus 
} from '../types';
import { 
  INITIAL_SETTINGS, INITIAL_USERS, INITIAL_CATEGORIES, INITIAL_INVENTORY, 
  INITIAL_SUPPLIERS, INITIAL_PRODUCTS, INITIAL_CUSTOMERS, INITIAL_RIDERS, 
  INITIAL_DEALS, INITIAL_COUPONS, INITIAL_ZONES, INITIAL_EXPENSES, 
  INITIAL_SHIFTS, INITIAL_ORDERS 
} from '../mockData';
import { syncOrderToGoogleSheet, syncExpenseToGoogleSheet, fetchAllDataFromGoogleSheet } from '../services/googleSheets';
import { getLicenseInfo } from '../services/license';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  users: User[];
  settings: ShopSettings;
  updateSettings: (newSettings: ShopSettings) => void;
  categories: Category[];
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  toggleProductAvailability: (id: string) => void;
  inventory: InventoryItem[];
  updateInventoryStock: (id: string, newStock: number) => void;
  addInventoryItem: (item: InventoryItem) => void;
  suppliers: Supplier[];
  customers: Customer[];
  addCustomer: (customer: Customer) => void;
  riders: RiderRecord[];
  updateRiderStatus: (id: string, status: 'Available' | 'Busy' | 'Offline') => void;
  deals: DealRecord[];
  coupons: CouponRecord[];
  zones: DeliveryZone[];
  orders: Order[];
  createOrder: (orderData: Partial<Order>) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, notes?: string) => void;
  cancelOrder: (orderId: string, reason: string) => void;
  refundOrder: (orderId: string, reason: string) => void;
  assignRider: (orderId: string, riderId: string) => void;
  expenses: ExpenseRecord[];
  addExpense: (expense: Omit<ExpenseRecord, 'id'>) => void;
  shifts: ShiftRecord[];
  currentShift: ShiftRecord;
  closeShift: (actualCash: number) => void;
  auditLogs: AuditLog[];
  addAuditLog: (action: string, details: string) => void;
  toastMessage: { text: string; type: 'success' | 'error' | 'warning' } | null;
  showToast: (text: string, type?: 'success' | 'error' | 'warning') => void;
  backupDatabase: () => string;
  restoreDatabase: (jsonString: string) => boolean;
  seedClientDummyData: () => Promise<void>;
  resetGoogleSheets: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const license = getLicenseInfo();
  const clientName = license.clientName || 'Default Client';

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('crust_current_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const defaultList: User[] = [
      { id: 'u1', name: 'Super Admin', email: 'admin@pos.com', role: 'Super Admin', phone: '03001234567', pin: '1234', active: true }
    ];
    try {
      const localUsers = JSON.parse(localStorage.getItem('crust_client_users') || '[]');
      return [...localUsers, ...defaultList];
    } catch {
      return defaultList;
    }
  });

  const [settings, setSettings] = useState<ShopSettings>(() => {
    const saved = localStorage.getItem('crust_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  useEffect(() => {
    // Fetch saved URL from server-side config file
    fetch('/api/get-google-sheet-url')
      .then(res => res.json())
      .then(data => {
        if (data.googleSheetWebAppUrl) {
          setSettings(prev => ({
            ...prev,
            googleSheetWebAppUrl: data.googleSheetWebAppUrl
          }));
        }
      })
      .catch(err => console.error('Failed to load server config:', err));
  }, []);

  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [suppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [riders, setRiders] = useState<RiderRecord[]>(INITIAL_RIDERS);
  const [deals] = useState<DealRecord[]>(INITIAL_DEALS);
  const [coupons] = useState<CouponRecord[]>(INITIAL_COUPONS);
  const [zones] = useState<DeliveryZone[]>(INITIAL_ZONES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(INITIAL_EXPENSES);
  const [shifts, setShifts] = useState<ShiftRecord[]>(INITIAL_SHIFTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'warning' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const addAuditLog = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `al-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      userName: currentUser?.name || 'System',
      role: currentUser?.role || 'Admin',
      action,
      details,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Fetch all data from Google Sheet on mount if URL is configured
  useEffect(() => {
    if (settings.googleSheetWebAppUrl) {
      fetchAllDataFromGoogleSheet(settings.googleSheetWebAppUrl, clientName).then(data => {
        if (data && typeof data === 'object') {
          // Users
          if (data.Users && Array.isArray(data.Users) && data.Users.length > 0) {
            const mappedUsers: User[] = data.Users.map((u: any, idx: number) => ({
              id: `u-${idx}`,
              name: u.Name || 'User',
              email: u.Email || '',
              role: u.Role || 'Cashier',
              phone: u.Phone || '',
              pin: u.Pin || '1234',
              active: true
            }));
            setUsers(prev => {
              const combined = [...mappedUsers, ...prev];
              // Remove duplicates by email
              return combined.filter((u, index, self) => index === self.findIndex(t => t.email.toLowerCase() === u.email.toLowerCase()));
            });
          }
          // Products
          if (data.Products && Array.isArray(data.Products) && data.Products.length > 0) {
            const mappedProds: Product[] = data.Products.map((p: any, idx: number) => ({
              id: `p-${idx}`,
              categoryId: p.Category === 'Appetizers' ? 'c2' : p.Category === 'Beverages' ? 'c4' : p.Category === 'Desserts' ? 'c3' : 'c1',
              name: p.Name || 'Item',
              description: '',
              prices: {
                large: Number(p.PriceLarge) || 1200,
                medium: Number(p.PriceMedium) || 900,
                small: Number(p.PriceSmall) || 600,
                regular: Number(p.PriceLarge) || 1000
              },
              available: p.Available === true || p.Available === 'TRUE',
              isPizza: p.Category === 'Pizzas'
            }));
            setProducts(mappedProds);
          }
          // Orders
          if (data.Orders && Array.isArray(data.Orders) && data.Orders.length > 0) {
            const mappedOrders: Order[] = data.Orders.map((o: any, idx: number) => ({
              id: `ord-${idx}`,
              orderNumber: Number(o.OrderNumber) || 101,
              type: o.Type || 'Dine-In',
              status: o.Status || 'Completed',
              customer: { name: o.CustomerName, phone: o.CustomerPhone },
              items: [],
              subtotal: Number(o.TotalPKR) || 1000,
              discountAmount: 0,
              taxAmount: 0,
              deliveryCharges: 0,
              total: Number(o.TotalPKR) || 1000,
              paymentMethod: o.PaymentMethod || 'Cash',
              paymentStatus: o.PaymentStatus || 'Paid',
              cashierName: o.Cashier || 'Admin',
              createdAt: o.Date || new Date().toISOString(),
              auditTrail: []
            }));
            setOrders(mappedOrders);
          }
          // Expenses
          if (data.Expenses && Array.isArray(data.Expenses) && data.Expenses.length > 0) {
            const mappedExp: ExpenseRecord[] = data.Expenses.map((ex: any, idx: number) => ({
              id: `ex-${idx}`,
              category: ex.Category || 'Miscellaneous',
              amount: Number(ex.AmountPKR) || 0,
              description: ex.Description || '',
              date: ex.Date || '',
              recordedBy: ex.RecordedBy || 'Admin'
            }));
            setExpenses(mappedExp);
          }
        }
      });
    }
  }, [settings.googleSheetWebAppUrl, clientName]);

  const seedClientDummyData = async () => {
    if (!settings.googleSheetWebAppUrl) {
      showToast('Please configure Google Sheets Web App URL first.', 'error');
      return;
    }
    try {
      await fetch(settings.googleSheetWebAppUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'seed_dummy', client: clientName })
      });
      showToast('Dummy data seeded to Google Sheet successfully for ' + clientName + '!');
      window.location.reload();
    } catch (err) {
      showToast('Failed to seed dummy data.', 'error');
    }
  };

  const resetGoogleSheets = async () => {
    if (!settings.googleSheetWebAppUrl) {
      showToast('Please configure Google Sheets Web App URL first.', 'error');
      return;
    }
    try {
      await fetch(settings.googleSheetWebAppUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset_sheets' })
      });
      showToast('Google Sheet successfully reset with fresh tables and Super Admin!');
      window.location.reload();
    } catch (err) {
      showToast('Failed to reset Google Sheet.', 'error');
    }
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('crust_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('crust_current_user');
    }
  }, [currentUser]);

  const updateSettings = (newSettings: ShopSettings) => {
    setSettings(newSettings);
    addAuditLog('Update Settings', 'Shop configuration settings updated.');
    showToast('Settings saved successfully!');
  };

  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
    addAuditLog('Add Product', `Created new product: ${product.name}`);
    showToast(`Product ${product.name} created successfully.`);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    addAuditLog('Update Product', `Updated product: ${updatedProduct.name}`);
    showToast(`Product ${updatedProduct.name} updated.`);
  };

  const deleteProduct = (id: string) => {
    const prod = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    addAuditLog('Delete Product', `Deleted product ID: ${id}`);
    showToast(`Product ${prod?.name || ''} deleted.`, 'warning');
  };

  const toggleProductAvailability = (id: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const newStatus = !p.available;
        addAuditLog('Toggle Availability', `${p.name} availability set to ${newStatus ? 'Available' : 'Out of Stock'}`);
        return { ...p, available: newStatus };
      }
      return p;
    }));
  };

  const updateInventoryStock = (id: string, newStock: number) => {
    setInventory(prev => prev.map(inv => inv.id === id ? { ...inv, currentStock: newStock } : inv));
    addAuditLog('Stock Adjustment', `Manual stock adjustment for item ID ${id} to ${newStock}`);
    showToast('Inventory stock updated.');
  };

  const addInventoryItem = (item: InventoryItem) => {
    setInventory(prev => [item, ...prev]);
    addAuditLog('Add Inventory', `Added raw material: ${item.name}`);
    showToast(`Inventory item ${item.name} added.`);
  };

  const addCustomer = (newCust: Customer) => {
    setCustomers(prev => [newCust, ...prev]);
    showToast(`Customer ${newCust.name} added.`);
  };

  const updateRiderStatus = (id: string, status: 'Available' | 'Busy' | 'Offline') => {
    setRiders(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    showToast('Rider status updated.');
  };

  const addExpense = (expData: Omit<ExpenseRecord, 'id'>) => {
    const newExp: ExpenseRecord = {
      id: `exp-${Date.now()}`,
      ...expData,
    };
    setExpenses(prev => [newExp, ...prev]);
    addAuditLog('Add Expense', `Recorded expense of Rs. ${newExp.amount} for ${newExp.category}`);
    showToast('Expense recorded successfully.');

    if (settings.googleSheetWebAppUrl) {
      syncExpenseToGoogleSheet(newExp, settings.googleSheetWebAppUrl, clientName);
    }
  };

  const createOrder = (orderData: Partial<Order>): Order => {
    const nextOrderNum = orders.length > 0 ? Math.max(...orders.map(o => o.orderNumber)) + 1 : 101;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: nextOrderNum,
      type: orderData.type || 'Dine-In',
      status: 'New',
      customer: orderData.customer,
      tableNumber: orderData.tableNumber,
      persons: orderData.persons,
      items: orderData.items || [],
      subtotal: orderData.subtotal || 0,
      discountAmount: orderData.discountAmount || 0,
      discountType: orderData.discountType,
      discountReason: orderData.discountReason,
      taxAmount: orderData.taxAmount || 0,
      deliveryCharges: orderData.deliveryCharges || 0,
      total: orderData.total || 0,
      paymentMethod: orderData.paymentMethod || 'Cash',
      paymentStatus: orderData.paymentStatus || 'Paid',
      cashierName: currentUser?.name || 'Cashier',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      estimatedMinutes: orderData.type === 'Delivery' ? 40 : 20,
      notes: orderData.notes,
      auditTrail: [
        { timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16), action: `Order #${nextOrderNum} created`, user: currentUser?.name || 'Cashier' }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    addAuditLog('Create Order', `Order #${nextOrderNum} (${newOrder.type}) created for Rs. ${newOrder.total}`);
    showToast(`Order #${nextOrderNum} created successfully!`);

    if (settings.googleSheetWebAppUrl) {
      syncOrderToGoogleSheet(newOrder, settings.googleSheetWebAppUrl, clientName);
    }

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, notes?: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const trail = [...o.auditTrail, {
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          action: `Status changed to ${newStatus}${notes ? ` (${notes})` : ''}`,
          user: currentUser?.name || 'Staff'
        }];
        return { ...o, status: newStatus, auditTrail: trail };
      }
      return o;
    }));
    addAuditLog('Update Order Status', `Order ID ${orderId} updated to ${newStatus}`);
    showToast(`Order status updated to ${newStatus}`);
  };

  const cancelOrder = (orderId: string, reason: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const trail = [...o.auditTrail, {
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          action: `Order Cancelled: ${reason}`,
          user: currentUser?.name || 'Manager'
        }];
        return { ...o, status: 'Cancelled', cancelReason: reason, auditTrail: trail };
      }
      return o;
    }));
    addAuditLog('Cancel Order', `Order ID ${orderId} cancelled. Reason: ${reason}`);
    showToast(`Order cancelled.`, 'warning');
  };

  const refundOrder = (orderId: string, reason: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const trail = [...o.auditTrail, {
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          action: `Order Refunded: ${reason}`,
          user: currentUser?.name || 'Manager'
        }];
        return { ...o, status: 'Refunded', paymentStatus: 'Refunded', refundReason: reason, auditTrail: trail };
      }
      return o;
    }));
    addAuditLog('Refund Order', `Order ID ${orderId} refunded. Reason: ${reason}`);
    showToast(`Order marked as refunded.`);
  };

  const assignRider = (orderId: string, riderId: string) => {
    const rider = riders.find(r => r.id === riderId);
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const trail = [...o.auditTrail, {
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          action: `Assigned to Rider ${rider?.name || riderId}`,
          user: currentUser?.name || 'Staff'
        }];
        return { ...o, riderId, riderName: rider?.name, status: 'Out for Delivery', auditTrail: trail };
      }
      return o;
    }));
    addAuditLog('Assign Rider', `Assigned order ${orderId} to rider ${rider?.name}`);
    showToast(`Order assigned to rider ${rider?.name}.`);
  };

  const currentShift = shifts[0] || INITIAL_SHIFTS[0];

  const closeShift = (actualCash: number) => {
    const cashSales = orders.filter(o => o.paymentStatus === 'Paid' && o.paymentMethod === 'Cash').reduce((acc, o) => acc + o.total, 0);
    const cardSales = orders.filter(o => o.paymentStatus === 'Paid' && o.paymentMethod === 'Debit/Credit Card').reduce((acc, o) => acc + o.total, 0);
    const onlineSales = orders.filter(o => o.paymentStatus === 'Paid' && (o.paymentMethod === 'JazzCash' || o.paymentMethod === 'Easypaisa')).reduce((acc, o) => acc + o.total, 0);
    const expected = currentShift.openingCash + cashSales;
    const diff = actualCash - expected;

    const closed: ShiftRecord = {
      ...currentShift,
      endTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      cashSales,
      cardSales,
      onlineSales,
      expectedCash: expected,
      actualCash,
      difference: diff,
      status: 'Closed'
    };

    setShifts(prev => [closed, ...prev.slice(1)]);
    addAuditLog('Close Shift', `Cash drawer closed. Expected: Rs. ${expected}, Actual: Rs. ${actualCash}, Diff: Rs. ${diff}`);
    showToast('Shift successfully closed.');
  };

  const backupDatabase = (): string => {
    const backupData = {
      settings,
      products,
      inventory,
      customers,
      orders,
      expenses,
      shifts,
      auditLogs,
      timestamp: new Date().toISOString()
    };
    addAuditLog('Database Backup', 'System database exported successfully.');
    return JSON.stringify(backupData, null, 2);
  };

  const restoreDatabase = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.settings) setSettings(data.settings);
      if (data.products) setProducts(data.products);
      if (data.inventory) setInventory(data.inventory);
      if (data.customers) setCustomers(data.customers);
      if (data.orders) setOrders(data.orders);
      if (data.expenses) setExpenses(data.expenses);
      if (data.auditLogs) setAuditLogs(data.auditLogs);
      addAuditLog('Database Restore', 'System database restored successfully from backup.');
      showToast('Database restored successfully!');
      return true;
    } catch {
      showToast('Invalid backup JSON format.', 'error');
      return false;
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser, setCurrentUser, users, settings, updateSettings,
      categories, products, addProduct, updateProduct, deleteProduct, toggleProductAvailability,
      inventory, updateInventoryStock, addInventoryItem, suppliers,
      customers, addCustomer, riders, updateRiderStatus, deals, coupons, zones,
      orders, createOrder, updateOrderStatus, cancelOrder, refundOrder, assignRider,
      expenses, addExpense, shifts, currentShift, closeShift,
      auditLogs, addAuditLog, toastMessage, showToast, backupDatabase, restoreDatabase,
      seedClientDummyData, resetGoogleSheets
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
