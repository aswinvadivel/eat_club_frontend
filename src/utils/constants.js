// Colors
export const COLORS = {
  PRIMARY_GREEN: '#22c55e',
  DARK_GREEN: '#16a34a',
  LIGHT_GREEN: '#dcfce7',
  BLACK: '#000000',
  DARK_GRAY: '#1f2937',
  LIGHT_GRAY: '#f3f4f6',
  WHITE: '#ffffff',
  ERROR: '#ef4444',
  WARNING: '#f59e0b',
  SUCCESS: '#22c55e',
};

// Cuisine Types
export const CUISINE_TYPES = [
  'All',
  'North Indian',
  'South Indian',
  'Chinese',
  'Continental',
  'Fast Food',
  'Desserts',
];

// Sort Options
export const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'delivery-time', label: 'Fastest Delivery' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
];

// Order Status
export const ORDER_STATUS = {
  CONFIRMED: 'CONFIRMED',
  PREPARING: 'PREPARING',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};

export const ORDER_STATUS_DISPLAY = {
  CONFIRMED: 'Order Confirmed',
  PREPARING: 'Preparing',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
};

// Payment Methods
export const PAYMENT_METHODS = ['CREDIT_CARD', 'DEBIT_CARD', 'UPI', 'WALLET'];

// Filter Categories
export const MENU_CATEGORIES = [
  'All',
  'Main Course',
  'Bread',
  'Rice',
  'Appetizer',
  'Soup',
  'Dessert',
  'Beverage',
];
