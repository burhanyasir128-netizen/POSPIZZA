import { Category, Product, InventoryItem, Supplier, Customer, RiderRecord, DealRecord, CouponRecord, DeliveryZone, Order, User, ExpenseRecord, ShiftRecord, ShopSettings } from './types';

export const INITIAL_SETTINGS: ShopSettings = {
  shopName: 'Crust & Co. Artisan Pizza',
  tagline: 'Authentic Italian Crust, Local Pakistani Flavors',
  address: 'Main Boulevard, Gulberg III, Lahore, Pakistan',
  phone: '+92 42 111 222 333',
  email: 'orders@crustandco.pk',
  currency: 'Rs.',
  taxName: 'GST',
  taxPercentage: 5,
  receiptFooter: 'Thank you for dining with Crust & Co! Please rate us on Google. WiFi: crust_guest',
  lowStockThreshold: 5,
  logoUrl: '',
  developerName: 'Crust & Co. POS Systems',
  googleSheetWebAppUrl: 'https://script.google.com/macros/s/AKfycbzZ3lmCMBSHoKL2zm50vfiZJ3Qkj-nQUJEA1_0LWqWldfSkGw9OuotY-qZiFQNN5_E4/exec',
};

export const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Zainab Malik', email: 'admin@crustandco.pk', role: 'Super Admin', phone: '+92 300 1234567', active: true, pin: '1234' },
  { id: 'u2', name: 'Farhan Ahmed', email: 'owner@crustandco.pk', role: 'Owner', phone: '+92 301 2345678', active: true, pin: '2345' },
  { id: 'u3', name: 'Bilal Khan', email: 'manager@crustandco.pk', role: 'Manager', phone: '+92 302 3456789', active: true, pin: '3456' },
  { id: 'u4', name: 'Usman Cashier', email: 'cashier@crustandco.pk', role: 'Cashier', phone: '+92 303 4567890', active: true, pin: '4567' },
  { id: 'u5', name: 'Chef Tariq', email: 'kitchen@crustandco.pk', role: 'Kitchen Staff', phone: '+92 304 5678901', active: true, pin: '5678' },
  { id: 'u6', name: 'Rider Ali', email: 'rider@crustandco.pk', role: 'Delivery Rider', phone: '+92 305 6789012', active: true, pin: '6789' },
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Pizzas', icon: 'Pizza', displayOrder: 1 },
  { id: 'c2', name: 'Burgers & Sandwiches', icon: 'Utensils', displayOrder: 2 },
  { id: 'c3', name: 'Sides & Fries', icon: 'Flame', displayOrder: 3 },
  { id: 'c4', name: 'Wings & Starters', icon: 'Drumstick', displayOrder: 4 },
  { id: 'c5', name: 'Pasta', icon: 'Soup', displayOrder: 5 },
  { id: 'c6', name: 'Deals & Combos', icon: 'Gift', displayOrder: 6 },
  { id: 'c7', name: 'Drinks & Desserts', icon: 'CupSoda', displayOrder: 7 },
  { id: 'c8', name: 'Extras', icon: 'PlusCircle', displayOrder: 8 },
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'inv1', name: 'Pizza Flour (Maida)', sku: 'FLR-01', category: 'Dry Goods', unit: 'KG', currentStock: 85, minStock: 20, purchasePrice: 220, supplierId: 'sup1', supplierName: 'Punjab Flour Mills' },
  { id: 'inv2', name: 'Mozzarella Cheese', sku: 'CHE-01', category: 'Dairy', unit: 'KG', currentStock: 42, minStock: 15, purchasePrice: 1450, supplierId: 'sup2', supplierName: 'Adams Dairy Foods' },
  { id: 'inv3', name: 'Boneless Chicken', sku: 'CHK-01', category: 'Meat', unit: 'KG', currentStock: 60, minStock: 20, purchasePrice: 720, supplierId: 'sup3', supplierName: 'Al-Madina Poultry' },
  { id: 'inv4', name: 'Pizza Sauce', sku: 'SAU-01', category: 'Sauces', unit: 'Liter', currentStock: 28, minStock: 8, purchasePrice: 650, supplierId: 'sup4', supplierName: 'Italian Imports Co.' },
  { id: 'inv5', name: 'Cooking Oil', sku: 'OIL-01', category: 'Groceries', unit: 'Liter', currentStock: 35, minStock: 10, purchasePrice: 540, supplierId: 'sup4', supplierName: 'Italian Imports Co.' },
  { id: 'inv6', name: 'Jalapeno Slices', sku: 'VEG-01', category: 'Vegetables', unit: 'KG', currentStock: 12, minStock: 4, purchasePrice: 850, supplierId: 'sup5', supplierName: 'Fresh Veggies Lahore' },
  { id: 'inv7', name: 'Black Olives', sku: 'VEG-02', category: 'Vegetables', unit: 'KG', currentStock: 15, minStock: 5, purchasePrice: 980, supplierId: 'sup5', supplierName: 'Fresh Veggies Lahore' },
  { id: 'inv8', name: 'Onions & Capsicum', sku: 'VEG-03', category: 'Vegetables', unit: 'KG', currentStock: 25, minStock: 10, purchasePrice: 180, supplierId: 'sup5', supplierName: 'Fresh Veggies Lahore' },
  { id: 'inv9', name: '1.5L Coke Bottles', sku: 'DRK-01', category: 'Beverages', unit: 'Box', currentStock: 18, minStock: 5, purchasePrice: 2400, supplierId: 'sup6', supplierName: 'Coca-Cola Beverages' },
  { id: 'inv10', name: 'Pizza Boxes (Large)', sku: 'PKG-01', category: 'Packaging', unit: 'Piece', currentStock: 250, minStock: 50, purchasePrice: 45, supplierId: 'sup7', supplierName: 'Master Packaging' },
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 'sup1', name: 'Punjab Flour Mills', contactPerson: 'Malik Riaz', phone: '+92 300 4455667', address: 'Badami Bagh Lahore', openingBalance: 0, outstandingBalance: 12500 },
  { id: 'sup2', name: 'Adams Dairy Foods', contactPerson: 'Sohail Butt', phone: '+92 321 5566778', address: 'Multan Road Lahore', openingBalance: 0, outstandingBalance: 35000 },
  { id: 'sup3', name: 'Al-Madina Poultry', contactPerson: 'Haji Iqbal', phone: '+92 333 7788990', address: 'Township Lahore', openingBalance: 0, outstandingBalance: 18000 },
  { id: 'sup4', name: 'Italian Imports Co.', contactPerson: 'Mr. David', phone: '+92 302 9988776', address: 'DHA Phase 5 Lahore', openingBalance: 0, outstandingBalance: 45000 },
  { id: 'sup5', name: 'Fresh Veggies Lahore', contactPerson: 'Aslam Sabzi Wala', phone: '+92 312 1122334', address: 'Kot Lakhpat Lahore', openingBalance: 0, outstandingBalance: 4200 },
  { id: 'sup6', name: 'Coca-Cola Beverages', contactPerson: 'Zubair Sales', phone: '+92 42 111 222 444', address: 'Sunder Industrial Estate', openingBalance: 0, outstandingBalance: 28000 },
  { id: 'sup7', name: 'Master Packaging', contactPerson: 'Kamran Ali', phone: '+92 300 9988111', address: 'Ferozepur Road Lahore', openingBalance: 0, outstandingBalance: 15000 },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Chicken Tikka Pizza',
    categoryId: 'c1',
    categoryName: 'Pizzas',
    description: 'Spicy marinated chicken tikka, onions, capsicum, signature tikka sauce & 100% mozzarella cheese.',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600',
    hasSizes: true,
    available: true,
    isPizza: true,
    prices: { small: 699, medium: 999, large: 1399, xl: 1799 },
    recipe: [
      { ingredientId: 'inv1', ingredientName: 'Pizza Flour (Maida)', quantity: 250, unit: 'g' },
      { ingredientId: 'inv2', ingredientName: 'Mozzarella Cheese', quantity: 180, unit: 'g' },
      { ingredientId: 'inv3', ingredientName: 'Boneless Chicken', quantity: 150, unit: 'g' },
      { ingredientId: 'inv4', ingredientName: 'Pizza Sauce', quantity: 80, unit: 'Liter' },
      { ingredientId: 'inv8', ingredientName: 'Onions & Capsicum', quantity: 60, unit: 'g' },
      { ingredientId: 'inv10', ingredientName: 'Pizza Boxes (Large)', quantity: 1, unit: 'Piece' },
    ],
    addons: [
      { id: 'ao1', name: 'Extra Cheese', price: 150 },
      { id: 'ao2', name: 'Jalapeno Topping', price: 80 },
      { id: 'ao3', name: 'Garlic Dip', price: 70 },
    ],
  },
  {
    id: 'p2',
    name: 'Fajita Special Pizza',
    categoryId: 'c1',
    categoryName: 'Pizzas',
    description: 'Mexican fajita chicken, mushrooms, jalapenos, black olives, onions and special herbs.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600',
    hasSizes: true,
    available: true,
    isPizza: true,
    prices: { small: 749, medium: 1049, large: 1449, xl: 1849 },
    recipe: [
      { ingredientId: 'inv1', ingredientName: 'Pizza Flour (Maida)', quantity: 250, unit: 'g' },
      { ingredientId: 'inv2', ingredientName: 'Mozzarella Cheese', quantity: 190, unit: 'g' },
      { ingredientId: 'inv3', ingredientName: 'Boneless Chicken', quantity: 160, unit: 'g' },
      { ingredientId: 'inv4', ingredientName: 'Pizza Sauce', quantity: 80, unit: 'Liter' },
      { ingredientId: 'inv6', ingredientName: 'Jalapeno Slices', quantity: 30, unit: 'g' },
      { ingredientId: 'inv7', ingredientName: 'Black Olives', quantity: 30, unit: 'g' },
      { ingredientId: 'inv10', ingredientName: 'Pizza Boxes (Large)', quantity: 1, unit: 'Piece' },
    ],
    addons: [
      { id: 'ao1', name: 'Extra Cheese', price: 150 },
      { id: 'ao2', name: 'Jalapeno Topping', price: 80 },
    ],
  },
  {
    id: 'p3',
    name: 'Cheese Burst Super Pizza',
    categoryId: 'c1',
    categoryName: 'Pizzas',
    description: 'Double layered crust filled with molten liquid cheese and topped with pepperoni and herbs.',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=600',
    hasSizes: true,
    available: true,
    isPizza: true,
    prices: { small: 849, medium: 1199, large: 1649, xl: 2099 },
    recipe: [
      { ingredientId: 'inv1', ingredientName: 'Pizza Flour (Maida)', quantity: 320, unit: 'g' },
      { ingredientId: 'inv2', ingredientName: 'Mozzarella Cheese', quantity: 280, unit: 'g' },
      { ingredientId: 'inv3', ingredientName: 'Boneless Chicken', quantity: 120, unit: 'g' },
      { ingredientId: 'inv4', ingredientName: 'Pizza Sauce', quantity: 90, unit: 'Liter' },
    ],
    addons: [
      { id: 'ao1', name: 'Extra Cheese', price: 180 },
    ],
  },
  {
    id: 'p4',
    name: 'Crown Crust Pizza',
    categoryId: 'c1',
    categoryName: 'Pizzas',
    description: 'Stuffed crust pockets filled with chicken kebab and cheese.',
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&q=80&w=600',
    hasSizes: true,
    available: true,
    isPizza: true,
    prices: { small: 799, medium: 1149, large: 1599, xl: 1999 },
    recipe: [
      { ingredientId: 'inv1', ingredientName: 'Pizza Flour (Maida)', quantity: 300, unit: 'g' },
      { ingredientId: 'inv2', ingredientName: 'Mozzarella Cheese', quantity: 200, unit: 'g' },
      { ingredientId: 'inv3', ingredientName: 'Boneless Chicken', quantity: 180, unit: 'g' },
      { ingredientId: 'inv4', ingredientName: 'Pizza Sauce', quantity: 80, unit: 'Liter' },
    ],
    addons: [],
  },
  {
    id: 'p5',
    name: 'Zinger Burger & Fries',
    categoryId: 'c2',
    categoryName: 'Burgers & Sandwiches',
    description: 'Crispy fried chicken thigh with spicy mayo, iceberg lettuce in a sesame brioche bun.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600',
    hasSizes: false,
    available: true,
    isPizza: false,
    prices: { regular: 549 },
    recipe: [
      { ingredientId: 'inv3', ingredientName: 'Boneless Chicken', quantity: 180, unit: 'g' },
      { ingredientId: 'inv5', ingredientName: 'Cooking Oil', quantity: 50, unit: 'ML' },
    ],
    addons: [
      { id: 'ao4', name: 'Extra Cheese Slice', price: 60 },
      { id: 'ao5', name: 'Jalapeno', price: 50 },
    ],
  },
  {
    id: 'p6',
    name: 'Loaded Garlic Bread with Cheese',
    categoryId: 'c3',
    categoryName: 'Sides & Fries',
    description: 'Freshly baked baguette loaded with garlic herb butter and lots of melted mozzarella.',
    image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&q=80&w=600',
    hasSizes: false,
    available: true,
    isPizza: false,
    prices: { regular: 449 },
    recipe: [
      { ingredientId: 'inv1', ingredientName: 'Pizza Flour (Maida)', quantity: 150, unit: 'g' },
      { ingredientId: 'inv2', ingredientName: 'Mozzarella Cheese', quantity: 100, unit: 'g' },
    ],
    addons: [],
  },
  {
    id: 'p7',
    name: 'Hot Buffalo Wings (8 Pcs)',
    categoryId: 'c4',
    categoryName: 'Wings & Starters',
    description: 'Crispy chicken wings tossed in fiery buffalo hot sauce.',
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&q=80&w=600',
    hasSizes: false,
    available: true,
    isPizza: false,
    prices: { regular: 699 },
    recipe: [
      { ingredientId: 'inv3', ingredientName: 'Boneless Chicken', quantity: 250, unit: 'g' },
      { ingredientId: 'inv5', ingredientName: 'Cooking Oil', quantity: 80, unit: 'ML' },
    ],
    addons: [],
  },
  {
    id: 'p8',
    name: 'Creamy Alfredo Pasta',
    categoryId: 'c5',
    categoryName: 'Pasta',
    description: 'Penne pasta tossed in rich white mushroom and cream sauce with grilled chicken.',
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281297?auto=format&fit=crop&q=80&w=600',
    hasSizes: false,
    available: true,
    isPizza: false,
    prices: { regular: 899 },
    recipe: [
      { ingredientId: 'inv3', ingredientName: 'Boneless Chicken', quantity: 150, unit: 'g' },
      { ingredientId: 'inv2', ingredientName: 'Mozzarella Cheese', quantity: 70, unit: 'g' },
    ],
    addons: [],
  },
  {
    id: 'p9',
    name: 'Family Deal #1 (2 Large Pizzas + 1.5L Drink)',
    categoryId: 'c6',
    categoryName: 'Deals & Combos',
    description: 'Any 2 Large Pizzas of your choice + 1 Garlic Bread + 1.5L Cold Drink.',
    image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&q=80&w=600',
    hasSizes: false,
    available: true,
    isPizza: false,
    prices: { regular: 2899 },
    recipe: [
      { ingredientId: 'inv1', ingredientName: 'Pizza Flour (Maida)', quantity: 500, unit: 'g' },
      { ingredientId: 'inv2', ingredientName: 'Mozzarella Cheese', quantity: 360, unit: 'g' },
      { ingredientId: 'inv3', ingredientName: 'Boneless Chicken', quantity: 300, unit: 'g' },
      { ingredientId: 'inv9', ingredientName: '1.5L Coke Bottles', quantity: 1, unit: 'Piece' },
    ],
    addons: [],
  },
  {
    id: 'p10',
    name: '1.5L Cold Drink (Coke/Sprite)',
    categoryId: 'c7',
    categoryName: 'Drinks & Desserts',
    description: 'Chilled refreshing soft drink bottle.',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=600',
    hasSizes: false,
    available: true,
    isPizza: false,
    prices: { regular: 250 },
    recipe: [
      { ingredientId: 'inv9', ingredientName: '1.5L Coke Bottles', quantity: 1, unit: 'Piece' },
    ],
    addons: [],
  },
  {
    id: 'p11',
    name: 'Molten Lava Chocolate Cake',
    categoryId: 'c7',
    categoryName: 'Drinks & Desserts',
    description: 'Warm chocolate cake with oozing gooey chocolate center.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600',
    hasSizes: false,
    available: true,
    isPizza: false,
    prices: { regular: 399 },
    recipe: [],
    addons: [],
  },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust1',
    name: 'Dr. Kamran Akram',
    phone: '03001234567',
    whatsapp: '03001234567',
    email: 'kamran@gmail.com',
    addresses: [
      { id: 'addr1', title: 'Home', area: 'Johar Town', address: 'House 42, Block H, Near Emporium Mall', city: 'Lahore' },
      { id: 'addr2', title: 'Clinic', area: 'Gulberg', address: 'Suite 302, Siddiq Trade Centre', city: 'Lahore' },
    ],
    notes: 'Prefers extra spicy chicken tikka, contactless delivery.',
    totalOrders: 14,
    totalSpending: 28500,
    loyaltyPoints: 285,
    lastOrderDate: '2026-10-06 20:15',
  },
  {
    id: 'cust2',
    name: 'Ayesha Tariq',
    phone: '03219876543',
    whatsapp: '03219876543',
    email: 'ayesha.t@yahoo.com',
    addresses: [
      { id: 'addr3', title: 'Home', area: 'Wapda Town', address: 'Street 12, Phase 1, Block C', city: 'Lahore' },
    ],
    notes: 'Always ask for extra napkins.',
    totalOrders: 8,
    totalSpending: 14200,
    loyaltyPoints: 140,
    lastOrderDate: '2026-10-05 19:30',
  },
  {
    id: 'cust3',
    name: 'Hamza Shahbaz',
    phone: '03334455667',
    whatsapp: '03334455667',
    email: 'hamza@techcorp.pk',
    addresses: [
      { id: 'addr4', title: 'Office', area: 'Gulberg', address: 'Office 14, Main Boulevard Gulberg III', city: 'Lahore' },
    ],
    notes: 'Company order corporate client.',
    totalOrders: 22,
    totalSpending: 65000,
    loyaltyPoints: 650,
    lastOrderDate: '2026-10-04 14:00',
  },
];

export const INITIAL_RIDERS: RiderRecord[] = [
  { id: 'r1', name: 'Ahmed Ali', phone: '03009988112', cnic: '35202-1234567-1', vehicle: 'Honda CD 70', vehicleNumber: 'LE-21-4567', status: 'Available', active: true, deliveriesCompleted: 18, cashCollected: 12500 },
  { id: 'r2', name: 'Bilal Hussain', phone: '03125566443', cnic: '35201-9876543-3', vehicle: 'Yamaha YBR', vehicleNumber: 'RI-22-8901', status: 'Busy', active: true, deliveriesCompleted: 14, cashCollected: 9400 },
  { id: 'r3', name: 'Zohaib Hassan', phone: '03223344556', cnic: '35204-5544332-9', vehicle: 'Suzuki GD110', vehicleNumber: 'LE-20-1122', status: 'Offline', active: true, deliveriesCompleted: 9, cashCollected: 5600 },
];

export const INITIAL_DEALS: DealRecord[] = [
  { id: 'd1', name: 'Family Weekend Deal', description: '2 Large Pizzas + Garlic Bread + 1.5L Drink', price: 2899, originalPrice: 3500, active: true, startDate: '2026-10-01', endDate: '2026-10-31', itemsSummary: '2x Large Pizza, 1x Garlic Bread, 1x 1.5L Coke' },
  { id: 'd2', name: 'Student Midnight Combo', description: '1 Medium Pizza + 2 Zinger Burgers + 1L Drink', price: 1899, originalPrice: 2300, active: true, startDate: '2026-10-01', endDate: '2026-10-31', itemsSummary: '1x Medium Pizza, 2x Zinger Burger, 1x Drink' },
];

export const INITIAL_COUPONS: CouponRecord[] = [
  { code: 'PIZZA20', discountType: 'percentage', discountValue: 20, minOrderAmount: 1500, active: true },
  { code: 'CRUST500', discountType: 'fixed', discountValue: 500, minOrderAmount: 2500, active: true },
  { code: 'WELCOME10', discountType: 'percentage', discountValue: 10, minOrderAmount: 500, active: true },
];

export const INITIAL_ZONES: DeliveryZone[] = [
  { id: 'z1', area: 'Gulberg III', fee: 100, estimatedMinutes: 30 },
  { id: 'z2', area: 'Johar Town', fee: 150, estimatedMinutes: 40 },
  { id: 'z3', area: 'Wapda Town', fee: 200, estimatedMinutes: 45 },
  { id: 'z4', area: 'DHA Phase 5', fee: 250, estimatedMinutes: 50 },
  { id: 'z5', area: 'Model Town', fee: 150, estimatedMinutes: 35 },
];

export const INITIAL_EXPENSES: ExpenseRecord[] = [
  { id: 'exp1', category: 'Electricity', amount: 45000, description: 'WAPDA Monthly Bill - Sep 2026', date: '2026-10-02', recordedBy: 'Zainab Malik' },
  { id: 'exp2', category: 'Rent', amount: 120000, description: 'Commercial Plaza Rent - Gulberg Branch', date: '2026-10-01', recordedBy: 'Zainab Malik' },
  { id: 'exp3', category: 'Marketing', amount: 15000, description: 'Facebook & Instagram Sponsor Ads', date: '2026-10-05', recordedBy: 'Bilal Khan' },
];

export const INITIAL_SHIFTS: ShiftRecord[] = [
  { id: 'sh1', cashierName: 'Usman Cashier', startTime: '2026-10-07 10:00 AM', openingCash: 10000, cashSales: 18450, cardSales: 8900, onlineSales: 4500, expensesTotal: 0, refundsTotal: 0, expectedCash: 28450, actualCash: 28450, difference: 0, status: 'Open' },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 101,
    type: 'Delivery',
    status: 'Ready',
    customer: { id: 'cust1', name: 'Dr. Kamran Akram', phone: '03001234567', address: 'House 42, Block H, Near Emporium Mall', area: 'Johar Town' },
    items: [
      { cartItemId: 'ci-1', productId: 'p1', name: 'Chicken Tikka Pizza', size: 'large', sizeLabel: 'Large (14")', price: 1399, quantity: 1, crust: 'Cheese Burst', sauce: 'Pizza Sauce', cheese: 'Extra Cheese', toppings: ['Jalapeno', 'Mushrooms'], itemTotal: 1549 }
    ],
    subtotal: 1549,
    discountAmount: 0,
    taxAmount: 77,
    deliveryCharges: 150,
    total: 1776,
    paymentMethod: 'Cash',
    paymentStatus: 'Pending',
    cashierName: 'Usman Cashier',
    riderId: 'r1',
    riderName: 'Ahmed Ali',
    createdAt: '2026-10-07 19:42',
    estimatedMinutes: 35,
    auditTrail: [
      { timestamp: '2026-10-07 19:42', action: 'Order created', user: 'Usman Cashier' },
      { timestamp: '2026-10-07 19:45', action: 'Sent to Kitchen', user: 'Usman Cashier' },
      { timestamp: '2026-10-07 19:50', action: 'Marked Ready', user: 'Chef Tariq' },
      { timestamp: '2026-10-07 19:52', action: 'Assigned to Rider Ahmed Ali', user: 'Bilal Khan' }
    ]
  },
  {
    id: 'ord-102',
    orderNumber: 102,
    type: 'Dine-In',
    status: 'Preparing',
    customer: { name: 'Ayesha Tariq', phone: '03219876543' },
    tableNumber: 'Table 4',
    persons: 3,
    items: [
      { cartItemId: 'ci-2', productId: 'p3', name: 'Cheese Burst Super Pizza', size: 'medium', sizeLabel: 'Medium (12")', price: 1199, quantity: 1, crust: 'Regular', sauce: 'Pizza Sauce', cheese: 'Regular', toppings: [], itemTotal: 1199 },
      { cartItemId: 'ci-3', productId: 'p6', name: 'Loaded Garlic Bread with Cheese', price: 449, quantity: 2, itemTotal: 898 }
    ],
    subtotal: 2097,
    discountAmount: 200,
    discountType: 'fixed',
    discountReason: 'Manager Special',
    taxAmount: 95,
    deliveryCharges: 0,
    total: 1992,
    paymentMethod: 'JazzCash',
    paymentStatus: 'Paid',
    cashierName: 'Usman Cashier',
    createdAt: '2026-10-07 20:10',
    estimatedMinutes: 20,
    auditTrail: [
      { timestamp: '2026-10-07 20:10', action: 'Dine-in Order created for Table 4', user: 'Usman Cashier' },
      { timestamp: '2026-10-07 20:12', action: 'Sent to Kitchen', user: 'Usman Cashier' }
    ]
  },
  {
    id: 'ord-103',
    orderNumber: 103,
    type: 'Takeaway',
    status: 'New',
    customer: { name: 'Hamza Shahbaz', phone: '03334455667' },
    items: [
      { cartItemId: 'ci-4', productId: 'p5', name: 'Zinger Burger & Fries', price: 549, quantity: 3, itemTotal: 1647 }
    ],
    subtotal: 1647,
    discountAmount: 0,
    taxAmount: 82,
    deliveryCharges: 0,
    total: 1729,
    paymentMethod: 'Debit/Credit Card',
    paymentStatus: 'Paid',
    cashierName: 'Usman Cashier',
    createdAt: '2026-10-07 20:25',
    estimatedMinutes: 15,
    auditTrail: [
      { timestamp: '2026-10-07 20:25', action: 'Takeaway Order created & Paid', user: 'Usman Cashier' }
    ]
  }
];
