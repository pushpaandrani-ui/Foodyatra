
export type AppScreen = 'location' | 'village' | 'restaurants' | 'menu' | 'cart' | 'checkout' | 'success' | 'profile' | 'favorites' | 'orders' | 'login' | 'admin-login' | 'admin-dashboard' | 'tracking';

export interface Village {
  id: string;
  name: string;
  distance: number; // Distance from Vadnagar center in KM
  timeEstimate?: string;
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  isVeg: boolean;
  image: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  image: string;
  dishes: Dish[];
}

export interface CartItem {
  dish: Dish;
  quantity: number;
}

export interface User {
  name: string;
  phone: string;
  address?: string;
}

export interface Rider {
  id: string;
  name: string;
  phone: string;
  active: boolean;
}

export interface Order {
  id: string;
  date: string;
  timestamp: number; // For sorting/analytics
  restaurantName: string;
  restaurantId: string;
  items: string;
  itemsList: CartItem[]; // Full object for analysis
  totalAmount: number;
  deliveryFee: number;
  discount: number;
  status: 'Pending' | 'Confirmed' | 'Cooking' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  village: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  riderId?: string; // Assigned rider
  isPaid: boolean;
}
