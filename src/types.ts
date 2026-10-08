export type UserRole = 'Super Admin' | 'Owner' | 'Manager' | 'Cashier' | 'Kitchen Staff' | 'Delivery Rider';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  active: boolean;
  pin?: string;
}

export type OrderType = 'Dine-In' | 'Takeaway' | 'Delivery' | 'Phone Order' | 'Online Order';
export type OrderStatus = 'New' | 'Accepted' | 'Preparing' | 'Ready' | 'Out for Delivery' | 'Completed' | 'Cancelled' | 'Refunded';
export type PaymentMethod = 'Cash' | 'JazzCash' | 'Easypaisa' | 'Bank Transfer' | 'Debit/Credit Card' | 'Split Payment';

export interface CustomerAddress {
  id: string;
  title: string; // e.g. "Home", "Office"
  area: string;
  address: string;
  city: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  addresses: CustomerAddress[];
  notes?: string;
  totalOrders: number;
  totalSpending: number;
  loyaltyPoints: number;
  lastOrderDate?: string;
}

export interface IngredientRecipeItem {
  ingredientId: string;
  ingredientName: string;
  quantity: number; // e.g. 180 (grams/ml)
  unit: string; // 'g' | 'ml' | 'piece'
}

export interface ProductAddon {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  description?: string;
  image?: string;
  prices: {
    small?: number;
    medium?: number;
    large?: number;
    xl?: number;
    regular?: number;
  };
  hasSizes: boolean;
  available: boolean;
  isPizza: boolean;
  recipe: IngredientRecipeItem[];
  addons: ProductAddon[];
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  displayOrder: number;
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  name: string;
  size?: 'small' | 'medium' | 'large' | 'xl' | 'regular';
  sizeLabel?: string;
  price: number;
  quantity: number;
  crust?: string;
  sauce?: string;
  cheese?: string;
  toppings?: string[];
  isHalfAndHalf?: boolean;
  leftFlavor?: string;
  rightFlavor?: string;
  addons?: { id: string; name: string; price: number }[];
  specialInstructions?: string;
  itemTotal: number;
}

export interface Order {
  id: string;
  orderNumber: number;
  type: OrderType;
  status: OrderStatus;
  customer?: {
    id?: string;
    name: string;
    phone: string;
    address?: string;
    area?: string;
  };
  tableNumber?: string;
  persons?: number;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  discountType?: 'percentage' | 'fixed' | 'coupon' | 'customer';
  discountReason?: string;
  taxAmount: number;
  deliveryCharges: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  cashierName: string;
  riderId?: string;
  riderName?: string;
  createdAt: string;
  estimatedMinutes?: number;
  notes?: string;
  cancelReason?: string;
  refundReason?: string;
  auditTrail: {
    timestamp: string;
    action: string;
    user: string;
  }[];
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  unit: 'KG' | 'Gram' | 'Liter' | 'ML' | 'Piece' | 'Box' | 'Pack';
  currentStock: number;
  minStock: number;
  purchasePrice: number; // per unit
  supplierId: string;
  supplierName: string;
  expiryDate?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  whatsapp?: string;
  address: string;
  openingBalance: number;
  outstandingBalance: number;
}

export interface PurchaseItem {
  inventoryItemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PurchaseRecord {
  id: string;
  purchaseNumber: string;
  supplierId: string;
  supplierName: string;
  items: PurchaseItem[];
  totalAmount: number;
  paidAmount: number;
  date: string;
  status: 'Received' | 'Pending';
  cashierName: string;
}

export interface ExpenseRecord {
  id: string;
  category: 'Rent' | 'Electricity' | 'Gas' | 'Salaries' | 'Internet' | 'Maintenance' | 'Marketing' | 'Packaging' | 'Transportation' | 'Miscellaneous';
  amount: number;
  description: string;
  date: string;
  recordedBy: string;
}

export interface ShiftRecord {
  id: string;
  cashierName: string;
  startTime: string;
  endTime?: string;
  openingCash: number;
  closingCash?: number;
  cashSales: number;
  cardSales: number;
  onlineSales: number;
  expensesTotal: number;
  refundsTotal: number;
  expectedCash: number;
  actualCash?: number;
  difference?: number;
  status: 'Open' | 'Closed';
}

export interface RiderRecord {
  id: string;
  name: string;
  phone: string;
  cnic?: string;
  vehicle: string;
  vehicleNumber: string;
  status: 'Available' | 'Busy' | 'Offline';
  active: boolean;
  deliveriesCompleted: number;
  cashCollected: number;
}

export interface DealRecord {
  id: string;
  name: string;
  description: string;
  image?: string;
  price: number;
  originalPrice: number;
  active: boolean;
  startDate: string;
  endDate: string;
  itemsSummary: string;
}

export interface CouponRecord {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  active: boolean;
}

export interface DeliveryZone {
  id: string;
  area: string;
  fee: number;
  estimatedMinutes: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  role: string;
  action: string;
  details: string;
}

export interface ShopSettings {
  shopName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  currency: string;
  taxName: string;
  taxPercentage: number;
  receiptFooter: string;
  lowStockThreshold: number;
  logoUrl?: string;
  developerName?: string;
  googleSheetWebAppUrl?: string;
}
