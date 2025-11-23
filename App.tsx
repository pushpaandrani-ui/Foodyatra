
import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, MapPin, ChevronLeft, CheckCircle, Bike, Utensils, Sparkles, Loader2, Phone, Send, Search, X, Tag, Home, User as UserIcon, Heart, Star, ChevronRight, Plus, Minus, LogIn, Settings, ArrowRight, AlertCircle, Clock, Zap, History, LogOut, ShoppingCart, Copy, Check, LayoutDashboard, DollarSign, Users, BarChart, Shield, Calendar, Navigation, Lock, FileText, Moon, Sun, Edit3, Trash2, Power, Eye, ArrowUp, ArrowDown, Save } from 'lucide-react';
import { VILLAGES, RESTAURANTS as INITIAL_RESTAURANTS, RIDERS as INITIAL_RIDERS } from './constants';
import { Village, Restaurant, Dish, CartItem, AppScreen, User, Order, Rider } from './types';
import { AiAssistant } from './components/AiAssistant';

// --- Brand Components ---

// Professional FY Logo (Vector Style) - Redesigned
const FYLogo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg viewBox="0 0 512 512" className={className} xmlns="http://www.w3.org/2000/svg" aria-label="Foodyatra Logo">
    <defs>
      <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4F46E5" /> {/* Indigo-600 */}
        <stop offset="100%" stopColor="#9333EA" /> {/* Purple-600 */}
      </linearGradient>
      <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#4F46E5" floodOpacity="0.3"/>
      </filter>
    </defs>
    
    {/* Background Shape - Modern Squircle */}
    <rect x="32" y="32" width="448" height="448" rx="128" fill="url(#brandGradient)" filter="url(#dropShadow)" />
    
    {/* Icon: Abstract Monogram / Location Pin + Cutlery */}
    <path d="M256 120C190 120 140 170 140 240C140 310 256 420 256 420C256 420 372 310 372 240C372 170 322 120 256 120Z" fill="white" />
    <path d="M256 180V300" stroke="url(#brandGradient)" strokeWidth="24" strokeLinecap="round" />
    <path d="M220 210H292" stroke="url(#brandGradient)" strokeWidth="24" strokeLinecap="round" />
  </svg>
);

// --- Cart Notification Pop-up ---
const CartNotification = ({ 
  show, 
  item, 
  total, 
  time,
  count,
  onClick
}: { 
  show: boolean, 
  item: string, 
  total: number, 
  time: string,
  count: number,
  onClick: () => void
}) => {
  if (!show) return null;
  
  return (
    <div 
      onClick={onClick}
      className="fixed top-20 left-4 right-4 z-50 animate-in slide-in-from-top-5 fade-in duration-300 cursor-pointer"
    >
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-slate-700 hover:bg-slate-800 transition-colors">
        <div className="flex items-center gap-3">
          <div className="bg-green-500 w-10 h-10 rounded-full flex items-center justify-center text-slate-900 font-bold">
            {count}
          </div>
          <div>
            <p className="font-bold text-sm text-slate-200">Added {item}</p>
            <p className="text-xs text-slate-400">Total: ₹{total} • ~{time}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-orange-400 font-bold text-sm">
          <span>View Cart</span>
          <ArrowRight size={16} />
        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---

const PageTransition = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
  <div className={`animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out ${className}`}>
    {children}
  </div>
);

const BottomNav = ({ 
  screen, 
  setScreen, 
  cartCount, 
  selectedVillage, 
  onSearchClick 
}: { 
  screen: AppScreen, 
  setScreen: (s: AppScreen) => void, 
  cartCount: number,
  selectedVillage: Village | null,
  onSearchClick: () => void
}) => {
  if (screen === 'location' || screen === 'success' || screen === 'admin-dashboard' || screen === 'tracking') return null;

  return (
    <div className="fixed bottom-0 left-0 w-full glass-nav pb-safe pt-2 px-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50 flex justify-between items-center h-[72px]">
      <button 
        onClick={() => {
          if (selectedVillage) setScreen('restaurants');
          else setScreen('village');
        }}
        className={`flex flex-col items-center gap-1 transition-all duration-300 active:scale-90 ${['restaurants', 'village', 'menu'].includes(screen) ? 'text-indigo-600 -translate-y-1' : 'text-slate-400'}`}
      >
        <div className={`p-1.5 rounded-2xl ${['restaurants', 'village', 'menu'].includes(screen) ? 'bg-indigo-50' : ''}`}>
          <Home size={24} strokeWidth={['restaurants', 'village', 'menu'].includes(screen) ? 2.5 : 2} />
        </div>
      </button>

      <button 
        onClick={() => setScreen('favorites')}
        className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${screen === 'favorites' ? 'text-red-500 -translate-y-1' : 'text-slate-400'}`}
      >
         <Heart size={24} strokeWidth={2} fill={screen === 'favorites' ? "currentColor" : "none"} />
      </button>

      <div className="relative -top-6">
        <button 
          onClick={() => setScreen('cart')}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl shadow-indigo-200 transition-all transform active:scale-90 hover:-translate-y-1 ${screen === 'cart' || screen === 'checkout' ? 'bg-slate-900 text-white' : 'bg-indigo-600 text-white'}`}
        >
          <ShoppingBag size={28} />
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white animate-bounce">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      <button 
        onClick={onSearchClick}
        className="flex flex-col items-center gap-1 text-slate-400 transition-all active:scale-90"
      >
         <div className="relative">
           <Search size={24} strokeWidth={2} />
         </div>
      </button>

      <button 
        onClick={() => setScreen('profile')}
        className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${screen === 'profile' ? 'text-indigo-600 -translate-y-1' : 'text-slate-400'}`}
      >
         <UserIcon size={24} strokeWidth={2} />
      </button>
    </div>
  );
};

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  transparent?: boolean;
}

const ModernHeader: React.FC<HeaderProps> = ({ title, subtitle, showBack, onBack, rightAction, transparent }) => (
  <div className={`sticky top-0 z-40 px-4 py-3 flex items-center justify-between transition-all duration-300 ${transparent ? 'bg-transparent' : 'bg-white/90 backdrop-blur-lg border-b border-slate-100/50'}`}>
    <div className="flex items-center gap-3">
      {showBack ? (
        <button onClick={onBack} className="w-10 h-10 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center text-slate-700 active:scale-90 transition-transform hover:shadow-md">
          <ChevronLeft size={24} />
        </button>
      ) : (
        <div className="w-10 h-10 flex items-center justify-center transform hover:rotate-12 transition-transform">
          <FYLogo className="w-10 h-10 shadow-md rounded-xl" />
        </div>
      )}
      <div>
        {title && <h1 className="font-heading font-bold text-slate-900 text-lg leading-tight">{title}</h1>}
        {subtitle && <p className="text-slate-500 text-xs font-medium flex items-center gap-1"><MapPin size={10} /> {subtitle}</p>}
      </div>
    </div>
    {rightAction}
  </div>
);

// Extracted Tracking Screen Component to avoid Hook errors
const TrackingScreen = ({ order, riders, onBack }: { order: Order, riders: Rider[], onBack: () => void }) => {
  // Simulated progress based on time elapsed since order
  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState("Calculating...");
  
  const rider = riders.find(r => r.id === order.riderId) || { name: 'Assigned Rider', phone: '', active: true, id: 'unknown' };

  useEffect(() => {
    // Simulate tracking animation
    const orderTime = order.timestamp || Date.now();
    const now = Date.now();
    const elapsedMinutes = (now - orderTime) / 60000;
    
    // Assuming average delivery takes 30 mins
    let calculatedProgress = (elapsedMinutes / 30) * 100;
    if (order.status === 'Delivered') calculatedProgress = 100;
    if (calculatedProgress > 100) calculatedProgress = 95; // Cap at 95 if not delivered
    if (calculatedProgress < 5) calculatedProgress = 5; // Start at 5
    
    setProgress(calculatedProgress);
    
    const remainingMins = Math.max(5, 30 - Math.round(elapsedMinutes));
    setEta(order.status === 'Delivered' ? "Arrived" : `${remainingMins} mins`);

    const interval = setInterval(() => {
      setProgress(p => {
         if (p >= 95) return p;
         return p + 0.5;
      });
    }, 2000);
    
    return () => clearInterval(interval);
  }, [order]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <ModernHeader title={`Track Order #${order.id}`} showBack onBack={onBack} />
      
      <div className="flex-1 relative">
         {/* Map Background (Abstract Representation) */}
         <div className="absolute inset-0 bg-indigo-50/50">
            <div className="w-full h-full opacity-10 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>
         </div>
         
         <div className="relative z-10 p-6 flex flex-col items-center h-full">
            
            {/* Status Card */}
            <div className="w-full bg-white rounded-3xl shadow-lg border border-slate-100 p-5 mb-8 animate-in slide-in-from-top-5">
               <div className="flex justify-between items-start mb-4">
                  <div>
                     <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Estimated Arrival</p>
                     <h2 className="text-3xl font-heading font-bold text-slate-800">{eta}</h2>
                  </div>
                  <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full font-bold text-sm flex items-center gap-2">
                     <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Live
                  </div>
               </div>
               
               {/* Progress Bar */}
               <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-2">
                 <div 
                    className="h-full bg-green-500 rounded-full transition-all duration-1000 ease-out relative"
                    style={{ width: `${progress}%` }}
                 >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md"></div>
                 </div>
               </div>
               <p className="text-xs text-slate-500 text-right">On the way to {order.village}</p>
            </div>

            {/* Rider Card */}
            {order.status !== 'Pending' && (
              <div className="w-full bg-white rounded-3xl shadow-lg border border-slate-100 p-5 mb-4 animate-in slide-in-from-bottom-5">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 border-2 border-white shadow-sm">
                       <UserIcon size={28} />
                    </div>
                    <div>
                       <h3 className="font-bold text-slate-900 text-lg">{rider.name}</h3>
                       <p className="text-slate-500 text-sm">Delivery Partner</p>
                    </div>
                    {rider.phone && (
                        <a href={`tel:${rider.phone}`} className="ml-auto w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors">
                           <Phone size={20} />
                        </a>
                    )}
                 </div>
                 <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-500 flex items-center gap-2">
                    <Shield size={14} className="text-indigo-500" />
                    Vaccinated & Temperature Checked
                 </div>
              </div>
            )}
            
            {/* Order Details Mini */}
            <div className="w-full bg-white/80 backdrop-blur-md rounded-3xl p-5 mt-auto border border-slate-100">
               <h4 className="font-bold text-slate-900 mb-2">Order Summary</h4>
               <p className="text-sm text-slate-600 mb-1">{order.restaurantName}</p>
               <p className="text-xs text-slate-400 line-clamp-1">{order.items}</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('location');
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Dynamic Data State (Instead of Constants)
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  // User Data State
  const [userName, setUserName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const [orderId, setOrderId] = useState('');
  const [isAiOpen, setIsAiOpen] = useState(false);
  
  // User & Profile State
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]); // Dish IDs
  const [pastOrders, setPastOrders] = useState<Order[]>([]);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null); // For tracking screen
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Riders State
  const [riders, setRiders] = useState<Rider[]>([]);
  
  // UI State
  const [notification, setNotification] = useState<{ show: boolean, item: string, total: number, time: string, count: number }>({ show: false, item: '', total: 0, time: '', count: 0 });
  
  // Fake Live Viewers for FOMO
  const [liveViewers, setLiveViewers] = useState(48);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponMessage, setCouponMessage] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Login Form State
  const [loginPhone, setLoginPhone] = useState('');
  const [loginName, setLoginName] = useState('');
  
  // Admin State
  const [adminPin, setAdminPin] = useState('');
  const [adminTab, setAdminTab] = useState<'ops' | 'finance' | 'riders' | 'restaurants'>('ops');
  const [newRiderName, setNewRiderName] = useState('');
  const [newRiderPhone, setNewRiderPhone] = useState('');
  const [showAddRider, setShowAddRider] = useState(false);
  
  // Admin Restaurant Edit State
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [showAddRestaurant, setShowAddRestaurant] = useState(false);
  const [newRestName, setNewRestName] = useState('');
  const [newRestCuisine, setNewRestCuisine] = useState('');
  const [newRestRating, setNewRestRating] = useState('4.0');
  const [newRestImage, setNewRestImage] = useState('');

  // Admin Menu Edit State
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [showAddDish, setShowAddDish] = useState(false);
  const [newDishName, setNewDishName] = useState('');
  const [newDishPrice, setNewDishPrice] = useState('');
  const [newDishVeg, setNewDishVeg] = useState(true);
  const [newDishDesc, setNewDishDesc] = useState('');


  // Effects
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  // Load data from local storage
  useEffect(() => {
    const savedUser = localStorage.getItem('fy_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      // Pre-fill info if user exists
      if (parsedUser.name) setUserName(parsedUser.name);
      if (parsedUser.phone) setPhoneNumber(parsedUser.phone);
      if (parsedUser.address) setAddress(parsedUser.address);
    }
    
    const savedFavs = localStorage.getItem('fy_favorites');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
    
    const savedOrders = localStorage.getItem('fy_orders');
    if (savedOrders) setPastOrders(JSON.parse(savedOrders));

    const savedDarkMode = localStorage.getItem('fy_dark_mode');
    if (savedDarkMode) setDarkMode(savedDarkMode === 'true');

    // Load Riders
    const savedRiders = localStorage.getItem('fy_riders');
    if (savedRiders) {
      setRiders(JSON.parse(savedRiders));
    } else {
      setRiders(INITIAL_RIDERS);
    }

    // Load Restaurants
    const savedRestaurants = localStorage.getItem('fy_restaurants');
    if (savedRestaurants) {
      setRestaurants(JSON.parse(savedRestaurants));
    } else {
      setRestaurants(INITIAL_RESTAURANTS);
    }
  }, []);

  // Update localStorage when user changes (especially for address)
  useEffect(() => {
     if (user) {
        localStorage.setItem('fy_user', JSON.stringify(user));
        if(user.address) setAddress(user.address);
        if(user.phone) setPhoneNumber(user.phone);
        if(user.name) setUserName(user.name);
     }
  }, [user]);

  // Fluctuate Live Viewers
  useEffect(() => {
    if (screen === 'menu') {
        const interval = setInterval(() => {
            // Fluctuate between 45 and 70
            setLiveViewers(prev => {
                const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
                let next = prev + change;
                if (next < 45) next = 48;
                if (next > 75) next = 70;
                return next;
            });
        }, 3000);
        return () => clearInterval(interval);
    }
  }, [screen]);

  // Save restaurants whenever they change
  useEffect(() => {
    if (restaurants.length > 0) {
        localStorage.setItem('fy_restaurants', JSON.stringify(restaurants));
    }
  }, [restaurants]);


  // Calculated Values
  const platformFee = 2; // Fixed platform fee
  
  const cartTotal = cart.reduce((sum, item) => sum + (item.dish.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const calculateDeliveryFee = () => {
    if (!selectedVillage) return 0;
    if (selectedVillage.distance === 0) return 10; // Minimum base fee for local
    
    // 3 Rs per KM
    let fee = Math.ceil(selectedVillage.distance * 3);
    if (fee < 10) fee = 10; // Minimum floor
    
    return fee;
  };
  const deliveryFee = calculateDeliveryFee();
  const discount = appliedCoupon === 'FIRSTFREE' ? deliveryFee : 0;
  const finalTotal = cartTotal + deliveryFee + platformFee - discount;
  const hasPendingPriceItems = cart.some(item => item.dish.price === 0);
  const estimatedTime = selectedVillage?.timeEstimate || "20-30 min";

  // Cart Logic
  const addToCart = (dish: Dish) => {
    setCart(prev => {
      const existing = prev.find(item => item.dish.id === dish.id);
      if (existing) return prev.map(item => item.dish.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { dish, quantity: 1 }];
    });

    // Calculate temporary new total for notifications
    const newTotal = cartTotal + dish.price;
    const newCount = cartCount + 1;

    setNotification({
      show: true,
      item: dish.name,
      total: newTotal,
      time: estimatedTime,
      count: newCount
    });

    // Auto hide notification
    setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 3000);
  };

  const removeFromCart = (dishId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.dish.id === dishId);
      if (existing && existing.quantity > 1) return prev.map(item => item.dish.id === dishId ? { ...item, quantity: item.quantity - 1 } : item);
      return prev.filter(item => item.dish.id !== dishId);
    });
  };

  const toggleFavorite = (dishId: string) => {
    setFavorites(prev => {
      const newFavs = prev.includes(dishId) ? prev.filter(id => id !== dishId) : [...prev, dishId];
      localStorage.setItem('fy_favorites', JSON.stringify(newFavs));
      return newFavs;
    });
  };

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText("FIRSTFREE");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyCoupon = () => {
    if (!couponCode) return;
    
    if (pastOrders.length > 0) {
      setCouponMessage('Coupon valid only for your first order!');
      setAppliedCoupon(null);
      return;
    }

    if (couponCode.toUpperCase() === 'FIRSTFREE') {
      setAppliedCoupon('FIRSTFREE');
      setCouponMessage('First delivery free applied!');
    } else {
      setCouponMessage('Invalid coupon code');
      setAppliedCoupon(null);
    }
  };

  // Navigation
  const handleBack = () => {
    switch (screen) {
      case 'village': setScreen('location'); break;
      case 'restaurants': setScreen('village'); break;
      case 'menu': setScreen('restaurants'); break;
      case 'cart': 
        if (selectedRestaurant) setScreen('menu');
        else setScreen('restaurants');
        break;
      case 'checkout': setScreen('cart'); break;
      case 'profile': 
        if (selectedVillage) setScreen('restaurants');
        else setScreen('location'); 
        break;
      case 'orders': setScreen('profile'); break;
      case 'login': setScreen('profile'); break;
      case 'favorites': 
        if (selectedVillage) setScreen('restaurants');
        else setScreen('location');
        break;
      case 'success': setScreen('restaurants'); break;
      case 'admin-login': setScreen('profile'); break;
      case 'admin-dashboard': setScreen('profile'); break;
      case 'tracking': setScreen('orders'); break;
      default: setScreen('location');
    }
  };

  const handleSearchClick = () => {
    setScreen('restaurants');
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const generateOrderId = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    let counter = 1;
    const savedCounter = localStorage.getItem('fy_order_counter');
    if (savedCounter) {
      counter = parseInt(savedCounter, 10) + 1;
    }
    localStorage.setItem('fy_order_counter', counter.toString());

    return `FY-${day}${month}-${counter}`;
  };

  const handlePlaceOrder = () => {
    const newOrderId = generateOrderId();
    setOrderId(newOrderId);

    // Auto-save user details if they are new or updated (Acting as Sign Up)
    const finalUser: User = {
      name: userName || 'Guest',
      phone: phoneNumber,
      address: address
    };
    
    // Update global user state if it wasn't set or changed
    setUser(finalUser);
    localStorage.setItem('fy_user', JSON.stringify(finalUser));
    
    // Save order to history
    const newOrder: Order = {
      id: newOrderId,
      date: new Date().toLocaleDateString(),
      timestamp: Date.now(),
      restaurantName: selectedRestaurant?.name || 'Unknown',
      restaurantId: selectedRestaurant?.id || '',
      items: cart.map(c => `${c.quantity}x ${c.dish.name}`).join(', '),
      itemsList: cart,
      totalAmount: finalTotal,
      deliveryFee: deliveryFee - discount, // Effective fee paid
      discount: discount,
      status: 'Pending',
      village: selectedVillage?.name || '',
      customerName: finalUser.name,
      customerPhone: phoneNumber,
      customerAddress: address,
      isPaid: false
    };
    
    // Update global order list for Admin viewing
    const existingOrders = JSON.parse(localStorage.getItem('fy_orders') || '[]');
    const updatedOrders = [newOrder, ...existingOrders];
    setPastOrders(updatedOrders);
    localStorage.setItem('fy_orders', JSON.stringify(updatedOrders));

    setScreen('success');
  };

  // Admin Functions
  const handleAdminLogin = () => {
    if (adminPin === '7426') {
      setScreen('admin-dashboard');
    } else {
      alert('Invalid Password');
    }
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const updated = pastOrders.map(o => o.id === orderId ? { ...o, status } : o);
    setPastOrders(updated);
    localStorage.setItem('fy_orders', JSON.stringify(updated));
  };

  const assignRider = (orderId: string, riderId: string) => {
    const updated = pastOrders.map(o => o.id === orderId ? { ...o, riderId, status: 'Confirmed' as const } : o);
    setPastOrders(updated);
    localStorage.setItem('fy_orders', JSON.stringify(updated));
  };

  const markAsPaid = (orderId: string) => {
    const updated = pastOrders.map(o => o.id === orderId ? { ...o, isPaid: true } : o);
    setPastOrders(updated);
    localStorage.setItem('fy_orders', JSON.stringify(updated));
  };

  // Admin: Rider Management
  const handleAddRider = () => {
    if(!newRiderName || newRiderPhone.length !== 10) {
      alert("Please enter a valid Name and 10-digit Phone Number.");
      return;
    }
    const newRider: Rider = {
      id: `rider_${Date.now()}`,
      name: newRiderName,
      phone: newRiderPhone,
      active: true
    };
    const updatedRiders = [...riders, newRider];
    setRiders(updatedRiders);
    localStorage.setItem('fy_riders', JSON.stringify(updatedRiders));
    setNewRiderName('');
    setNewRiderPhone('');
    setShowAddRider(false);
  };

  const toggleRiderStatus = (id: string) => {
    const updatedRiders = riders.map(r => r.id === id ? { ...r, active: !r.active } : r);
    setRiders(updatedRiders);
    localStorage.setItem('fy_riders', JSON.stringify(updatedRiders));
  };

  const getRiderStats = (riderId: string) => {
    const currentMonth = new Date().getMonth();
    const deliveredOrders = pastOrders.filter(o => 
        o.riderId === riderId && 
        o.status === 'Delivered' && 
        new Date(o.timestamp).getMonth() === currentMonth
    );
    const count = deliveredOrders.length;
    // Commmission Calculation: Flat 20 Rs per order + any delivery fee surplus if applicable
    // Simplified: Rider gets the delivery fee.
    const earnings = deliveredOrders.reduce((sum, o) => sum + (o.deliveryFee || 0), 0);
    return { count, earnings };
  };

  // Admin: Restaurant Management
  const moveRestaurant = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === restaurants.length - 1) return;

    const newRestaurants = [...restaurants];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newRestaurants[index], newRestaurants[targetIndex]] = [newRestaurants[targetIndex], newRestaurants[index]];
    
    setRestaurants(newRestaurants);
  };

  const handleAddRestaurant = () => {
    if(!newRestName) return;
    const newRest: Restaurant = {
        id: `rest_${Date.now()}`,
        name: newRestName,
        cuisine: newRestCuisine || 'Multi-Cuisine',
        image: newRestImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
        rating: parseFloat(newRestRating) || 4.0,
        dishes: []
    };
    setRestaurants([...restaurants, newRest]);
    setNewRestName('');
    setNewRestCuisine('');
    setNewRestImage('');
    setShowAddRestaurant(false);
  };

  const handleUpdateRestaurant = (restId: string, updates: Partial<Restaurant>) => {
    const updated = restaurants.map(r => r.id === restId ? { ...r, ...updates } : r);
    setRestaurants(updated);
    if(editingRestaurant?.id === restId) {
        setEditingRestaurant(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const handleDeleteRestaurant = (id: string) => {
    if(confirm('Delete this restaurant?')) {
        setRestaurants(restaurants.filter(r => r.id !== id));
        if(editingRestaurant?.id === id) setEditingRestaurant(null);
    }
  };

  // Admin: Dish Management
  const handleAddDish = () => {
     if(!editingRestaurant || !newDishName) return;
     const newDish: Dish = {
         id: `dish_${Date.now()}`,
         name: newDishName,
         price: parseInt(newDishPrice) || 0,
         isVeg: newDishVeg,
         description: newDishDesc || 'Tasty dish',
         image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80'
     };
     
     const updatedRest = {
         ...editingRestaurant,
         dishes: [...editingRestaurant.dishes, newDish]
     };
     
     // Update local state and global state
     setEditingRestaurant(updatedRest);
     setRestaurants(restaurants.map(r => r.id === editingRestaurant.id ? updatedRest : r));
     
     setNewDishName('');
     setNewDishPrice('');
     setNewDishDesc('');
     setShowAddDish(false);
  };

  const handleUpdateDish = (dishId: string, updates: Partial<Dish>) => {
    if(!editingRestaurant) return;
    const updatedDishes = editingRestaurant.dishes.map(d => d.id === dishId ? { ...d, ...updates } : d);
    const updatedRest = { ...editingRestaurant, dishes: updatedDishes };
    
    setEditingRestaurant(updatedRest);
    setRestaurants(restaurants.map(r => r.id === editingRestaurant.id ? updatedRest : r));
  };

  const handleDeleteDish = (dishId: string) => {
    if(!editingRestaurant) return;
    const updatedDishes = editingRestaurant.dishes.filter(d => d.id !== dishId);
    const updatedRest = { ...editingRestaurant, dishes: updatedDishes };
    setEditingRestaurant(updatedRest);
    setRestaurants(restaurants.map(r => r.id === editingRestaurant.id ? updatedRest : r));
  };
  
  // Login Logic
  const handleLogin = () => {
    if (loginPhone.length !== 10 || !loginName) {
      alert("Please enter a valid Name and 10-digit Phone Number.");
      return;
    }

    const newUser: User = {
        name: loginName,
        phone: loginPhone,
        address: '' // Address added later via popup
    };

    setUser(newUser);
    localStorage.setItem('fy_user', JSON.stringify(newUser));
    setPhoneNumber(loginPhone);
    setUserName(loginName);
    setScreen('profile');
    
    // Clear Form
    setLoginName('');
    setLoginPhone('');
  };

  const handleSaveAddress = (newAddress: string) => {
    if (!user) return;
    const updatedUser = { ...user, address: newAddress };
    setUser(updatedUser); // This triggers the useEffect to save to localStorage
    setAddress(newAddress); // Sync with checkout form
    setShowAddressPopup(false);
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('fy_dark_mode', String(!darkMode));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('fy_user');
    // Clear form
    setLoginName('');
    setLoginPhone('');
    setUserName('');
    setAddress('');
    setPhoneNumber('');
  };

  // --- Screens ---

  const renderLocationScreen = () => (
    <PageTransition className="flex flex-col h-screen bg-white relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute top-1/3 -left-20 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-50"></div>

      <div className="flex-1 flex flex-col justify-center items-center p-8 z-10 relative">
        
        {/* Animated Logo Section */}
        <div className="mb-10 relative group cursor-default">
           <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
           <div className="transform transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
              <FYLogo className="w-48 h-48 drop-shadow-2xl" />
           </div>
        </div>
        
        <h1 className="text-5xl font-heading font-extrabold text-slate-900 text-center mb-3 tracking-tight leading-none">
          Food<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">yatra</span>
        </h1>
        <p className="text-slate-500 text-center text-lg mb-12 max-w-xs leading-relaxed font-medium">
          Delicious food from Vadnagar's best kitchens to your village.
        </p>
        
        <button 
          onClick={() => setScreen('village')}
          className="w-full max-w-xs bg-slate-900 text-white p-5 rounded-2xl font-bold text-lg shadow-xl shadow-slate-200 hover:shadow-slate-400 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-between group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <span className="relative z-10">Start Ordering</span>
          <div className="bg-white/20 rounded-full p-2 group-hover:bg-white/30 transition-colors relative z-10">
            <ArrowRight size={20} />
          </div>
        </button>
      </div>
    </PageTransition>
  );

  const renderVillageScreen = () => {
    const filteredVillages = VILLAGES.filter(v => v.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
      <div className="min-h-screen bg-slate-50 pb-24">
        <ModernHeader title="Select Location" showBack onBack={handleBack} />
        <PageTransition className="px-4 mt-2">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text"
              placeholder="Search your village..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-none shadow-sm rounded-2xl py-4 pl-12 pr-4 text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-slate-400 transition-shadow"
            />
          </div>
          <div className="grid gap-3">
            {filteredVillages.map(village => (
              <button
                key={village.id}
                onClick={() => {
                  setSelectedVillage(village);
                  setScreen('restaurants');
                  setSearchQuery('');
                }}
                className="group bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:border-indigo-500 transition-all flex items-center justify-between active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-inner">
                    <MapPin size={20} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-slate-800 text-lg group-hover:text-indigo-700 transition-colors">{village.name}</h3>
                    <p className="text-slate-400 text-sm flex items-center gap-2">
                      <span>{village.distance === 0 ? "City Center" : `${village.distance} km`}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Clock size={10}/> {village.timeEstimate}
                      </span>
                    </p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
              </button>
            ))}
          </div>
        </PageTransition>
      </div>
    );
  };

  const renderRestaurantsScreen = () => {
    // Uses state 'restaurants' now
    const filteredRestaurants = restaurants.filter(r => 
      (activeCategory === 'All' || r.cuisine.includes(activeCategory)) &&
      (r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    const categories = ["All", "Punjabi", "South Indian", "Fast Food", "Gujarati"];

    return (
      <div className="min-h-screen bg-slate-50 pb-28">
        <ModernHeader 
          title="Restaurants" 
          subtitle={selectedVillage?.name}
          showBack
          onBack={handleBack}
          rightAction={
            <button onClick={() => setScreen('village')} className="text-indigo-600 text-xs font-bold bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors">
              Change
            </button>
          }
        />

        <div className="px-4 pb-2 sticky top-[64px] z-30 bg-slate-50/95 backdrop-blur-md pt-2 transition-all">
           <div className="relative mb-4 group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input 
              ref={searchInputRef}
              type="text"
              placeholder="Cravings? Search here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white shadow-sm border-none rounded-2xl py-3.5 pl-12 pr-4 text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all transform active:scale-95
                  ${activeCategory === cat 
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                    : 'bg-white text-slate-600 shadow-sm border border-slate-100 hover:bg-slate-50'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <PageTransition>
          {/* Promo Banner */}
          <div className="px-4 mb-6">
            <div 
              onClick={handleCopyCoupon}
              className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-5 text-white shadow-lg shadow-indigo-200 relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                   <span className="bg-white/20 px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider">Offer</span>
                </div>
                <h3 className="font-heading font-bold text-2xl mb-1">Free Delivery</h3>
                <div className="text-indigo-100 text-sm mb-4 w-3/4 opacity-90">
                  <p className="mb-2">Use code on your first order</p>
                  <button className="bg-white text-indigo-600 px-3 py-1.5 rounded-lg font-mono font-bold flex items-center gap-2 hover:bg-indigo-50 transition-colors active:scale-95">
                    FIRSTFREE
                    {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                    {copied ? "Code Copied!" : "Tap to Copy"}
                  </span>
                </div>
              </div>
              <Sparkles className="absolute -right-2 -top-2 text-white opacity-20 w-32 h-32 animate-pulse" />
              <div className="absolute -right-4 -bottom-4 text-6xl transform group-hover:rotate-12 transition-transform duration-500">🛵</div>
            </div>
          </div>

          <div className="px-4 grid gap-6">
            <div className="flex items-center justify-between">
               <h2 className="font-heading font-bold text-lg text-slate-800">Near You</h2>
               <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">{filteredRestaurants.length} Places</span>
            </div>
            
            {filteredRestaurants.length > 0 ? (
              filteredRestaurants.map((rest, index) => (
                <div 
                  key={rest.id}
                  onClick={() => {
                    setSelectedRestaurant(rest);
                    setScreen('menu');
                  }}
                  className="group bg-white rounded-[2rem] p-3 shadow-sm hover:shadow-xl hover:shadow-slate-200 transition-all duration-300 cursor-pointer border border-slate-100 relative overflow-hidden active:scale-[0.98]"
                >
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-black/50 backdrop-blur-md text-white px-2 py-1 rounded-lg text-xs font-bold">#{index + 1}</span>
                  </div>
                  <div className="h-52 rounded-[1.5rem] overflow-hidden relative bg-slate-100">
                    <img 
                      src={rest.image} 
                      alt={rest.name} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                    
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-xl flex items-center gap-1 shadow-sm">
                      <Star size={14} className="text-orange-500 fill-orange-500" />
                      <span className="text-xs font-bold text-slate-800">{rest.rating}</span>
                    </div>
                    
                    <div className="absolute bottom-3 left-3 text-white">
                       <div className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-full inline-flex items-center gap-1 mb-1">
                         <Clock size={12} className="text-white"/>
                         <span className="text-xs font-bold">30-40 min</span>
                       </div>
                    </div>
                  </div>
                  
                  <div className="px-2 pt-4 pb-2 relative">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-heading font-bold text-xl text-slate-900 leading-tight">{rest.name}</h3>
                    </div>
                    <p className="text-slate-500 text-sm font-medium mb-3">{rest.cuisine}</p>
                    <div className="w-full h-px bg-slate-100 mb-3"></div>
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wide">
                       <Utensils size={14} />
                       <span>View Menu</span>
                    </div>
                    
                    <div className="absolute bottom-4 right-4 bg-slate-100 p-2 rounded-full text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:rotate-45">
                        <ArrowRight size={18} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 border-dashed">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={24} className="text-slate-400" />
                </div>
                <p className="text-slate-500 font-medium">No restaurants matching "{searchQuery}"</p>
                <button onClick={() => {setSearchQuery(''); setActiveCategory('All');}} className="mt-4 text-indigo-600 font-bold text-sm">Clear Filters</button>
              </div>
            )}
          </div>
        </PageTransition>
      </div>
    );
  };

  const renderMenuScreen = () => (
    <div className="min-h-screen bg-slate-50 pb-28">
      {selectedRestaurant && (
        <PageTransition>
          {/* Hero Header */}
          <div className="relative h-72">
             <img src={selectedRestaurant.image} className="w-full h-full object-cover" loading="eager" />
             <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80"></div>
             
             <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-20">
               <button onClick={handleBack} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors border border-white/10">
                 <ChevronLeft size={24} />
               </button>
               <div className="flex gap-3">
                 <button onClick={() => setScreen('favorites')} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors border border-white/10">
                   <Heart size={20} />
                 </button>
                 <button onClick={handleSearchClick} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors border border-white/10">
                   <Search size={20} />
                 </button>
               </div>
             </div>
             
             <div className="absolute bottom-8 left-6 right-6 text-white">
               <h1 className="font-heading font-bold text-3xl mb-2 leading-tight shadow-black drop-shadow-lg">{selectedRestaurant.name}</h1>
               <div className="flex items-center gap-3 text-sm font-medium text-slate-200">
                  <span className="bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-white border border-white/10">{selectedRestaurant.cuisine}</span>
                  <span className="flex items-center gap-1"><Star size={14} className="fill-yellow-400 text-yellow-400"/> {selectedRestaurant.rating}</span>
               </div>
             </div>
          </div>

          <div className="px-4 -mt-6 relative z-10">
            {/* Live Viewers Banner - FOMO Feature */}
            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-3 rounded-2xl mb-4 shadow-lg flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-2">
                    <Eye size={18} />
                    <span className="font-bold text-sm">{liveViewers} people viewing this menu</span>
                </div>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-md font-bold">Hurry!</span>
            </div>

            <div className="bg-white rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] min-h-screen p-6">
              <div className="flex justify-center mb-8">
                <div className="w-12 h-1.5 bg-slate-200 rounded-full opacity-60"></div>
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-bold text-xl text-slate-800">Recommended</h2>
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-600 border border-green-200"></span>
                  <span className="w-3 h-3 rounded-full bg-red-600 border border-red-200"></span>
                </div>
              </div>

              <div className="space-y-8">
                {selectedRestaurant.dishes.map(dish => {
                  const inCart = cart.find(c => c.dish.id === dish.id);
                  const isFav = favorites.includes(dish.id);
                  return (
                    <div key={dish.id} className="flex gap-4 relative animate-in slide-in-from-bottom-4 fade-in duration-700 fill-mode-backwards" style={{ animationDelay: '0.1s' }}>
                      <div className="flex-1 py-1">
                         <div className="flex items-start gap-2 mb-2">
                            <span className={`mt-1.5 w-4 h-4 border ${dish.isVeg ? 'border-green-600' : 'border-red-600'} flex items-center justify-center p-[2px] flex-shrink-0`}>
                              <span className={`w-full h-full rounded-full ${dish.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></span>
                            </span>
                            <h3 className="font-bold text-slate-800 text-lg leading-tight">{dish.name}</h3>
                         </div>
                         <div className="font-bold text-slate-900 text-lg mb-2">
                           {dish.price === 0 ? <span className="text-orange-500 text-sm font-bold bg-orange-50 px-2 py-0.5 rounded-md">Price on Request</span> : `₹${dish.price}`}
                         </div>
                         <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">{dish.description}</p>
                      </div>
                      
                      <div className="relative w-36 flex-shrink-0 flex flex-col items-center">
                        <div className="h-32 w-36 rounded-2xl overflow-hidden bg-slate-100 shadow-md relative group">
                          <img src={dish.image} className="w-full h-full object-cover" loading="lazy" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                          <button 
                             onClick={(e) => { e.stopPropagation(); toggleFavorite(dish.id); }}
                             className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full"
                          >
                            <Heart size={16} className={isFav ? "text-red-500 fill-red-500" : "text-slate-400"} />
                          </button>
                        </div>
                        <div className="absolute -bottom-3 shadow-xl rounded-xl w-28">
                          {inCart ? (
                            <div className="bg-white border border-slate-200 rounded-xl flex items-center justify-between py-2 px-3 h-10">
                              <button onClick={() => removeFromCart(dish.id)} className="text-slate-400 hover:text-orange-600 active:scale-90 transition-transform"><Minus size={16} strokeWidth={3}/></button>
                              <span className="font-bold text-slate-900 text-base">{inCart.quantity}</span>
                              <button onClick={() => addToCart(dish)} className="text-green-600 active:scale-90 transition-transform"><Plus size={16} strokeWidth={3}/></button>
                            </div>
                          ) : (
                            <button onClick={() => addToCart(dish)} className="w-full bg-white text-indigo-600 font-bold text-sm py-2.5 rounded-xl shadow-md border border-indigo-50 hover:bg-indigo-50 transition-colors">
                              ADD
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Floating Cart Button if items in cart */}
          {cart.length > 0 && (
            <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-10">
              <button 
                onClick={() => setScreen('cart')}
                className="w-full bg-slate-900 text-white p-4 rounded-2xl shadow-xl shadow-indigo-200 flex items-center justify-between"
              >
                <div className="flex flex-col text-left">
                   <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">{cartCount} Items</span>
                   <span className="font-heading font-bold text-lg">₹{cartTotal} <span className="text-slate-500 text-sm font-normal">+ taxes</span></span>
                </div>
                <div className="flex items-center gap-2 font-bold text-lg">
                  View Cart <ArrowRight size={20} />
                </div>
              </button>
            </div>
          )}
        </PageTransition>
      )}
    </div>
  );
  
  const renderCartScreen = () => (
    <div className="min-h-screen bg-slate-50 pb-32">
      <ModernHeader title="Your Cart" showBack onBack={handleBack} />
      
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center px-8">
          <div className="bg-indigo-50 p-8 rounded-full mb-6">
             <ShoppingBag size={64} className="text-indigo-300" />
          </div>
          <h3 className="font-heading font-bold text-2xl text-slate-800 mb-2">Hungry?</h3>
          <p className="text-slate-500 mb-8 max-w-xs">Your cart is empty. Add some delicious food from the menu!</p>
          <button onClick={() => setScreen('restaurants')} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors">
            Browse Restaurants
          </button>
        </div>
      ) : (
        <PageTransition className="px-4 mt-4">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-6">
             <div className="p-4 bg-indigo-50 border-b border-indigo-100 flex items-center gap-3">
               <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-sm">
                 <Utensils size={20} />
               </div>
               <div>
                 <h3 className="font-bold text-slate-800">{selectedRestaurant?.name}</h3>
                 <p className="text-xs text-slate-500">{selectedRestaurant?.cuisine}</p>
               </div>
             </div>
             
             <div className="p-4 divide-y divide-slate-100">
               {cart.map(item => (
                 <div key={item.dish.id} className="py-4 flex gap-4">
                   <div className="w-2 h-2 mt-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.dish.isVeg ? '#16a34a' : '#dc2626' }}></div>
                   <div className="flex-1">
                     <h4 className="font-bold text-slate-800 text-lg leading-tight mb-1">{item.dish.name}</h4>
                     <div className="flex items-center justify-between mt-2">
                       <span className="font-bold text-slate-900">₹{item.dish.price * item.quantity}</span>
                       
                       <div className="bg-white border border-slate-200 rounded-lg flex items-center h-9 shadow-sm">
                          <button onClick={() => removeFromCart(item.dish.id)} className="px-3 text-slate-600 hover:text-red-500 transition-colors"><Minus size={16}/></button>
                          <span className="font-bold text-slate-900 w-6 text-center">{item.quantity}</span>
                          <button onClick={() => addToCart(item.dish)} className="px-3 text-green-600 transition-colors"><Plus size={16}/></button>
                       </div>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          </div>

          {/* Bill Details */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 mb-6">
             <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2"><Tag size={18} className="text-indigo-600"/> Bill Summary</h3>
             
             <div className="space-y-3 text-sm">
               <div className="flex justify-between text-slate-600">
                 <span>Item Total</span>
                 <span className="font-medium">₹{cartTotal}</span>
               </div>
               <div className="flex justify-between text-slate-600">
                 <span>Delivery Fee ({selectedVillage?.distance} km)</span>
                 <span className="font-medium">₹{deliveryFee}</span>
               </div>
               <div className="flex justify-between text-slate-600">
                 <span>Platform Fee</span>
                 <span className="font-medium">₹{platformFee}</span>
               </div>
               
               {/* Coupon Section */}
               <div className="py-3 border-y border-dashed border-slate-200 my-2">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between text-green-600 bg-green-50 p-2 rounded-lg border border-green-100">
                      <span className="flex items-center gap-1 font-bold"><CheckCircle size={14}/> Coupon '{appliedCoupon}' applied</span>
                      <span className="font-bold">- ₹{discount}</span>
                    </div>
                  ) : (
                     <div className="flex gap-2">
                       <input 
                         type="text" 
                         placeholder="Coupon Code" 
                         value={couponCode}
                         onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                         className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-indigo-500"
                       />
                       <button 
                         onClick={handleApplyCoupon}
                         className="bg-slate-900 text-white px-4 rounded-lg text-xs font-bold hover:bg-slate-800"
                       >
                         APPLY
                       </button>
                     </div>
                  )}
                  {couponMessage && !appliedCoupon && <p className="text-red-500 text-xs mt-1">{couponMessage}</p>}
               </div>

               <div className="flex justify-between text-lg font-bold text-slate-900 pt-2">
                 <span>To Pay</span>
                 <span>₹{finalTotal}</span>
               </div>
               {hasPendingPriceItems && (
                 <div className="bg-orange-50 text-orange-700 text-xs p-2 rounded-lg mt-2 border border-orange-100 flex items-start gap-2">
                   <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                   <p>Some items have variable pricing. Final amount will be confirmed on WhatsApp.</p>
                 </div>
               )}
             </div>
          </div>

          <button 
            onClick={() => setScreen('checkout')}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-200 hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2 mb-6"
          >
            Proceed to Address <ArrowRight size={20} />
          </button>
        </PageTransition>
      )}
    </div>
  );

  const renderCheckoutScreen = () => (
    <div className="min-h-screen bg-slate-50 pb-10">
      <ModernHeader title="Details" showBack onBack={handleBack} />
      
      <PageTransition className="px-4 mt-4">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 mb-6">
           <div className="flex items-center justify-between mb-6">
             <h2 className="font-heading font-bold text-xl text-slate-800">Contact & Delivery</h2>
             <div className="bg-indigo-50 text-indigo-600 p-2 rounded-full">
               <MapPin size={24} />
             </div>
           </div>

           {/* Name Input - Required for new customers */}
           <div className="mb-4">
             <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
             <input
               type="text"
               placeholder="Enter your name"
               value={userName}
               onChange={(e) => setUserName(e.target.value)}
               className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
             />
           </div>

           {/* Phone Input */}
           <div className="mb-6">
             <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
             <div className="relative">
               <span className="absolute left-4 top-3.5 text-slate-400 font-medium">+91</span>
               <input
                 type="tel"
                 maxLength={10}
                 placeholder="Enter 10 digit number"
                 value={phoneNumber}
                 onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                 className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
               />
               {phoneNumber.length === 10 && (
                 <CheckCircle className="absolute right-4 top-3.5 text-green-500" size={20} />
               )}
             </div>
           </div>

           {/* Address Input */}
           <div className="mb-4">
             <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Delivery Address</label>
             <div className="relative">
                <textarea
                  rows={4}
                  placeholder="House No, Street, Landmark..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                />
             </div>
           </div>
        </div>

        <button 
          onClick={handlePlaceOrder}
          disabled={!phoneNumber || phoneNumber.length !== 10 || address.length < 10 || !userName}
          className="w-full bg-green-600 disabled:bg-slate-300 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-green-200 hover:bg-green-700 hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
        >
          Review Order <ArrowRight size={20} />
        </button>
      </PageTransition>
    </div>
  );

  const renderSuccessScreen = () => {
    const whatsAppNumber = "917069432614";
    const itemList = cart.map(i => `${i.quantity} x ${i.dish.name}${i.dish.price === 0 ? ' (Price on Request)' : ` (₹${i.dish.price * i.quantity})`}`).join('\n');
    
    const totalLine = appliedCoupon === 'FIRSTFREE' 
      ? `Total: ₹${finalTotal} (Coupon FIRSTFREE Applied)` 
      : `Total: ₹${finalTotal}`;
      
    const message = encodeURIComponent(
`*New Order #${orderId}* 🛵
------------------
*Customer:* ${userName}
Phone: ${phoneNumber}
Address: ${address}
Village: ${selectedVillage?.name}

*Order:*
${itemList}
------------------
*${totalLine}*
Delivery Fee: ₹${deliveryFee - discount}
Platform Fee: ₹${platformFee}

Please confirm availability and time.`
    );

    const waLink = `https://wa.me/${whatsAppNumber}?text=${message}`;

    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/food.png')] opacity-5"></div>
         
         <PageTransition className="z-10 w-full max-w-sm text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-500">
              <Bike size={48} className="text-green-600" />
            </div>
            
            <h2 className="font-heading font-bold text-3xl text-slate-900 mb-2">One Last Step!</h2>
            <p className="text-slate-500 mb-8">Your order is ready to be sent. Click below to send details to the restaurant on WhatsApp.</p>
            
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 text-left">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
                 <span className="text-slate-500 text-sm uppercase font-bold tracking-wider">Order ID</span>
                 <span className="font-mono font-bold text-slate-800">{orderId}</span>
              </div>
              <div className="space-y-2 text-sm text-slate-600">
                <p><strong>Deliver To:</strong> {selectedVillage?.name}</p>
                <p><strong>Amount:</strong> ₹{finalTotal}</p>
                <p><strong>Status:</strong> Pending Confirmation</p>
              </div>
            </div>

            <a 
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-green-200 hover:bg-[#128C7E] hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-3"
            >
              <Send size={24} /> Send on WhatsApp
            </a>
            
            <button 
               onClick={() => setScreen('restaurants')}
               className="mt-6 text-slate-400 font-medium hover:text-slate-600 transition-colors"
            >
              Back to Home
            </button>
         </PageTransition>
      </div>
    );
  };

  const renderOrdersScreen = () => (
    <div className="min-h-screen bg-slate-50 pb-24">
      <ModernHeader title="My Orders" showBack onBack={() => setScreen('profile')} />
      <PageTransition className="p-4">
        {pastOrders.length === 0 ? (
          <div className="text-center py-12">
             <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
               <History size={24} />
             </div>
             <h3 className="font-bold text-slate-800 text-lg">No Past Orders</h3>
             <p className="text-slate-500 text-sm">Your order history will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pastOrders.map((order) => (
              <div key={order.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                 <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-slate-800">{order.restaurantName}</h3>
                      <p className="text-xs text-slate-500">{order.village}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${order.status === 'Delivered' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>{order.status}</span>
                 </div>
                 <div className="text-sm text-slate-600 mb-3 line-clamp-2">
                   {order.items}
                 </div>
                 <div className="flex justify-between items-center text-xs font-medium pt-3 border-t border-slate-100">
                    <span className="text-slate-400">{order.date}</span>
                    <div className="flex items-center gap-2">
                      {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                        <button 
                          onClick={() => {
                            setTrackingOrder(order);
                            setScreen('tracking');
                          }}
                          className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md shadow-indigo-100 active:scale-90 transition-transform"
                        >
                          <Navigation size={12} /> Track
                        </button>
                      )}
                      <span className="text-slate-900 font-bold text-base">₹{order.totalAmount}</span>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        )}
      </PageTransition>
    </div>
  );

  const AddressPopup = () => {
    const [tempAddress, setTempAddress] = useState(user?.address || '');

    if (!showAddressPopup) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in zoom-in duration-300">
           <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-lg text-slate-900">Saved Address</h3>
             <button onClick={() => setShowAddressPopup(false)} className="bg-slate-100 p-2 rounded-full hover:bg-slate-200">
               <X size={20} className="text-slate-600"/>
             </button>
           </div>
           
           <p className="text-xs text-slate-500 mb-4">This address will be pre-filled for your future orders.</p>
           
           <textarea
             rows={4}
             placeholder="Enter your full address (House No, Street, Landmark...)"
             value={tempAddress}
             onChange={(e) => setTempAddress(e.target.value)}
             className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none mb-6"
           />
           
           <button 
             onClick={() => handleSaveAddress(tempAddress)}
             disabled={tempAddress.length < 5}
             className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
           >
             Save Address
           </button>
        </div>
      </div>
    );
  };

  const renderProfileScreen = () => (
    <div className={`min-h-screen pb-24 ${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <ModernHeader title="Profile" showBack={false} />
      
      <PageTransition className="px-4 mt-4">
        {user ? (
          <>
            <div className={`rounded-3xl p-6 shadow-sm border mb-6 flex items-center gap-4 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
               <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-200">
                 {user.name.charAt(0).toUpperCase()}
               </div>
               <div>
                 <h2 className={`font-heading font-bold text-xl ${darkMode ? 'text-white' : 'text-slate-900'}`}>{user.name}</h2>
                 <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} text-sm`}>+91 {user.phone}</p>
                 <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><MapPin size={10} /> {user.address || 'Address not set'}</p>
               </div>
            </div>
            
            {/* Menu Links */}
            <div className="space-y-3 mb-6">
              <button onClick={() => setScreen('orders')} className={`w-full p-4 rounded-2xl shadow-sm border flex items-center justify-between group transition-all ${darkMode ? 'bg-slate-800 border-slate-700 hover:border-indigo-500' : 'bg-white border-slate-100 hover:border-indigo-500'}`}>
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                     <ShoppingBag size={20} />
                   </div>
                   <span className={`font-bold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>My Orders</span>
                 </div>
                 <ChevronRight size={20} className="text-slate-300 group-hover:text-indigo-500" />
              </button>
              
              <button onClick={() => setScreen('favorites')} className={`w-full p-4 rounded-2xl shadow-sm border flex items-center justify-between group transition-all ${darkMode ? 'bg-slate-800 border-slate-700 hover:border-indigo-500' : 'bg-white border-slate-100 hover:border-indigo-500'}`}>
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center">
                     <Heart size={20} />
                   </div>
                   <span className={`font-bold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>Favorites</span>
                 </div>
                 <ChevronRight size={20} className="text-slate-300 group-hover:text-indigo-500" />
              </button>

              {user.phone === '5555566666' && (
                <button onClick={() => setScreen('admin-login')} className={`w-full p-4 rounded-2xl shadow-sm border flex items-center justify-between group transition-all ${darkMode ? 'bg-slate-800 border-slate-700 hover:border-indigo-500' : 'bg-white border-slate-100 hover:border-indigo-500'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
                      <LayoutDashboard size={20} />
                    </div>
                    <span className={`font-bold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>Admin Dashboard</span>
                  </div>
                  <ChevronRight size={20} className="text-slate-300 group-hover:text-indigo-500" />
                </button>
              )}
            </div>

            {/* App Settings Section */}
            <div className={`rounded-3xl p-5 shadow-sm border mb-6 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
              <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                <Settings size={20} className="text-slate-400"/> App Settings
              </h3>
              
              <div className="space-y-4">
                {/* Dark Mode Toggle */}
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-indigo-900 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                        {darkMode ? <Moon size={16} /> : <Sun size={16} />}
                     </div>
                     <span className={`font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Dark Mode</span>
                   </div>
                   <button 
                     onClick={handleToggleDarkMode}
                     className={`w-12 h-6 rounded-full relative transition-colors ${darkMode ? 'bg-indigo-600' : 'bg-slate-200'}`}
                   >
                     <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${darkMode ? 'left-7' : 'left-1'}`}></div>
                   </button>
                </div>

                {/* Default Address */}
                <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900/50 border-slate-600' : 'bg-slate-50 border-slate-100'}`}>
                   <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saved Address</span>
                      <button onClick={() => setShowAddressPopup(true)} className="text-indigo-500 hover:text-indigo-600">
                        <Edit3 size={16} />
                      </button>
                   </div>
                   <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                     {user.address || 'No default address saved.'}
                   </p>
                   {!user.address && (
                     <button onClick={() => setShowAddressPopup(true)} className="text-xs font-bold text-indigo-600 mt-2">
                       + Add Address
                     </button>
                   )}
                </div>
              </div>
            </div>
            
            <button onClick={handleLogout} className={`w-full p-4 rounded-2xl shadow-sm border flex items-center justify-between group hover:border-red-500 transition-all ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                     <LogOut size={20} />
                   </div>
                   <span className="font-bold text-red-600">Logout</span>
                 </div>
            </button>
          </>
        ) : (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center">
             <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
               <LogIn size={32} />
             </div>
             
             <h2 className="font-heading font-bold text-2xl text-slate-900 mb-2">Welcome</h2>
             <p className="text-slate-500 mb-6">Login to track orders and save your details.</p>
             
             <div className="space-y-4">
               <input
                 type="text"
                 placeholder="Your Name"
                 value={loginName}
                 onChange={(e) => setLoginName(e.target.value)}
                 className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
               />
               <div className="relative">
                  <span className="absolute left-4 top-3.5 text-slate-400 text-sm font-bold">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="Phone Number"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
               </div>
               
               <button 
                 onClick={handleLogin}
                 disabled={loginPhone.length !== 10 || !loginName}
                 className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold shadow-lg shadow-slate-200 disabled:bg-slate-300 disabled:shadow-none transition-all"
               >
                 Login
               </button>
             </div>
          </div>
        )}
      </PageTransition>
      <AddressPopup />
    </div>
  );

  const renderFavoritesScreen = () => {
    // Uses restaurants state now
    const favDishes: { dish: Dish, restaurant: Restaurant }[] = [];
    restaurants.forEach(r => {
      r.dishes.forEach(d => {
        if (favorites.includes(d.id)) {
          favDishes.push({ dish: d, restaurant: r });
        }
      });
    });

    return (
      <div className="min-h-screen bg-slate-50 pb-24">
        <ModernHeader title="Favorites" showBack onBack={handleBack} />
        <PageTransition className="px-4 mt-4">
          {favDishes.length === 0 ? (
            <div className="text-center py-12">
               <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                 <Heart size={24} />
               </div>
               <h3 className="font-bold text-slate-800 text-lg">No Favorites Yet</h3>
               <p className="text-slate-500 text-sm">Heart items you love to find them here!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {favDishes.map(({ dish, restaurant }) => (
                <div key={dish.id} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex gap-3">
                   <img src={dish.image} className="w-24 h-24 rounded-xl object-cover bg-slate-100" />
                   <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h3 className="font-bold text-slate-900">{dish.name}</h3>
                        <p className="text-xs text-slate-500">{restaurant.name}</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="font-bold text-slate-900">₹{dish.price}</span>
                        <button 
                          onClick={() => addToCart(dish)}
                          className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg text-xs font-bold"
                        >
                          ADD
                        </button>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          )}
        </PageTransition>
      </div>
    );
  };

  // Admin Screens
  const renderAdminLogin = () => (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
       <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
          <h2 className="font-heading font-bold text-2xl text-center mb-6">Admin Access</h2>
          <input
            type="password"
            placeholder="Enter PIN"
            value={adminPin}
            onChange={(e) => setAdminPin(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-4 text-center font-mono text-lg outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button 
             onClick={handleAdminLogin}
             className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold"
          >
            Enter Dashboard
          </button>
          <button 
             onClick={() => setScreen('profile')}
             className="w-full mt-4 text-slate-400 text-sm font-bold"
          >
            Cancel
          </button>
       </div>
    </div>
  );

  const renderAdminDashboard = () => {
    // Mock Analytics Calculation
    const totalRevenue = pastOrders.reduce((sum, o) => sum + (o.isPaid ? o.totalAmount : 0), 0);
    const pendingOrders = pastOrders.filter(o => o.status === 'Pending');
    const activeOrders = pastOrders.filter(o => ['Confirmed', 'Cooking', 'Out for Delivery'].includes(o.status));
    
    return (
      <div className="min-h-screen bg-slate-50 pb-24">
        <div className="bg-slate-900 text-white pt-6 pb-8 px-6 rounded-b-[2rem] shadow-xl">
           <div className="flex justify-between items-center mb-6">
             <h1 className="font-heading font-bold text-2xl">Admin Panel</h1>
             <button onClick={() => setScreen('profile')} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
               <X size={20} />
             </button>
           </div>
           
           <div className="grid grid-cols-2 gap-4 mb-2">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/5">
                <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">Total Sales</p>
                <h3 className="text-2xl font-bold">₹{totalRevenue}</h3>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/5">
                <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">Active Orders</p>
                <h3 className="text-2xl font-bold">{activeOrders.length}</h3>
              </div>
           </div>
        </div>
        
        <div className="px-4 -mt-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-2 flex mb-6 overflow-x-auto no-scrollbar gap-1">
            <button onClick={() => setAdminTab('ops')} className={`flex-1 min-w-[90px] py-2 rounded-xl text-xs font-bold transition-all ${adminTab === 'ops' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-400'}`}>Orders</button>
            <button onClick={() => setAdminTab('finance')} className={`flex-1 min-w-[90px] py-2 rounded-xl text-xs font-bold transition-all ${adminTab === 'finance' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-400'}`}>Finance</button>
            <button onClick={() => setAdminTab('restaurants')} className={`flex-1 min-w-[90px] py-2 rounded-xl text-xs font-bold transition-all ${adminTab === 'restaurants' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-400'}`}>Hotels</button>
            <button onClick={() => setAdminTab('riders')} className={`flex-1 min-w-[90px] py-2 rounded-xl text-xs font-bold transition-all ${adminTab === 'riders' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-400'}`}>Riders</button>
          </div>

          {/* --- OPERATIONS TAB --- */}
          {adminTab === 'ops' && (
            <div className="space-y-4">
               <h3 className="font-bold text-slate-800 px-2">Live Orders ({pendingOrders.length + activeOrders.length})</h3>
               {pendingOrders.length === 0 && activeOrders.length === 0 && (
                 <p className="text-center text-slate-400 py-8">No active orders right now.</p>
               )}
               
               {[...pendingOrders, ...activeOrders].map(order => (
                 <div key={order.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-start mb-3">
                       <span className="font-mono font-bold text-slate-500 text-xs bg-slate-100 px-2 py-1 rounded">{order.id}</span>
                       <span className="text-xs font-bold text-slate-800">{order.timestamp ? new Date(order.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 mb-1">{order.customerName} <span className="text-slate-400 font-normal">in</span> {order.village}</h4>
                    <p className="text-xs text-slate-500 mb-3">{order.items}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                       {order.status === 'Pending' && (
                         <button onClick={() => updateOrderStatus(order.id, 'Confirmed')} className="flex-1 bg-green-50 text-green-600 py-2 rounded-lg text-xs font-bold border border-green-100">Confirm</button>
                       )}
                       {order.status === 'Confirmed' && (
                         <button onClick={() => updateOrderStatus(order.id, 'Cooking')} className="flex-1 bg-orange-50 text-orange-600 py-2 rounded-lg text-xs font-bold border border-orange-100">Start Cooking</button>
                       )}
                       {order.status === 'Cooking' && (
                         <button onClick={() => updateOrderStatus(order.id, 'Out for Delivery')} className="flex-1 bg-indigo-50 text-indigo-600 py-2 rounded-lg text-xs font-bold border border-indigo-100">Dispatch</button>
                       )}
                       {order.status === 'Out for Delivery' && (
                         <button onClick={() => updateOrderStatus(order.id, 'Delivered')} className="flex-1 bg-slate-800 text-white py-2 rounded-lg text-xs font-bold">Mark Delivered</button>
                       )}
                       <button onClick={() => updateOrderStatus(order.id, 'Cancelled')} className="px-3 py-2 rounded-lg text-xs font-bold text-red-500 bg-red-50 border border-red-100">X</button>
                    </div>

                    {!order.riderId && (order.status === 'Confirmed' || order.status === 'Cooking') && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <p className="text-xs font-bold text-slate-400 mb-2">Assign Rider</p>
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {riders.filter(r => r.active).map(rider => (
                            <button 
                              key={rider.id}
                              onClick={() => assignRider(order.id, rider.id)}
                              className="flex-shrink-0 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border border-slate-200"
                            >
                              {rider.name.split(' ')[0]}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                 </div>
               ))}
            </div>
          )}

          {/* --- FINANCE TAB --- */}
          {adminTab === 'finance' && (
            <div className="space-y-4">
               <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                 <h3 className="font-bold text-slate-800 mb-4">Recent Transactions</h3>
                 {pastOrders.slice(0, 10).map(order => (
                   <div key={order.id} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
                      <div>
                        <p className="text-sm font-bold text-slate-700">{order.id}</p>
                        <p className="text-xs text-slate-400">{order.date}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-sm font-bold text-slate-900">₹{order.totalAmount}</p>
                         <button 
                           onClick={() => markAsPaid(order.id)}
                           disabled={order.isPaid}
                           className={`text-[10px] font-bold px-2 py-0.5 rounded ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                         >
                           {order.isPaid ? 'PAID' : 'UNPAID'}
                         </button>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {/* --- RESTAURANTS TAB --- */}
          {adminTab === 'restaurants' && (
             <div className="space-y-4">
               {/* Add New Button */}
               <button 
                 onClick={() => setShowAddRestaurant(!showAddRestaurant)} 
                 className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
               >
                 <Plus size={18} /> Add New Hotel
               </button>
               
               {/* Add Form */}
               {showAddRestaurant && (
                 <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 animate-in slide-in-from-top-2">
                   <h4 className="font-bold text-slate-800 mb-3">New Hotel Details</h4>
                   <div className="space-y-3">
                     <input placeholder="Hotel Name" className="w-full bg-slate-50 p-3 rounded-lg text-sm border-none outline-none" value={newRestName} onChange={e => setNewRestName(e.target.value)} />
                     <input placeholder="Cuisine (e.g. Punjabi, South Indian)" className="w-full bg-slate-50 p-3 rounded-lg text-sm border-none outline-none" value={newRestCuisine} onChange={e => setNewRestCuisine(e.target.value)} />
                     <input placeholder="Rating (e.g. 4.5)" className="w-full bg-slate-50 p-3 rounded-lg text-sm border-none outline-none" value={newRestRating} onChange={e => setNewRestRating(e.target.value)} />
                     <input placeholder="Image URL (Unsplash)" className="w-full bg-slate-50 p-3 rounded-lg text-sm border-none outline-none" value={newRestImage} onChange={e => setNewRestImage(e.target.value)} />
                     <button onClick={handleAddRestaurant} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold text-sm">Save Hotel</button>
                   </div>
                 </div>
               )}
               
               {/* List */}
               {restaurants.map((rest, index) => (
                 <div key={rest.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    {/* Header with Sort Controls */}
                    <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                       <div className="flex items-center gap-2">
                         <span className="font-bold text-slate-400 text-xs">#{index + 1}</span>
                         <h3 className="font-bold text-slate-900">{rest.name}</h3>
                       </div>
                       <div className="flex items-center gap-1">
                          <button onClick={() => moveRestaurant(index, 'up')} className="p-1.5 hover:bg-white rounded-md text-slate-500"><ArrowUp size={16}/></button>
                          <button onClick={() => moveRestaurant(index, 'down')} className="p-1.5 hover:bg-white rounded-md text-slate-500"><ArrowDown size={16}/></button>
                       </div>
                    </div>
                    
                    {/* Body */}
                    <div className="p-3 flex gap-3">
                       <img src={rest.image} className="w-16 h-16 rounded-lg object-cover bg-slate-200" />
                       <div className="flex-1">
                          {editingRestaurant?.id === rest.id ? (
                             <div className="space-y-2 mb-2">
                                <input value={editingRestaurant.name} onChange={e => setEditingRestaurant({...editingRestaurant, name: e.target.value})} className="w-full bg-slate-50 p-2 rounded text-xs border border-slate-200" />
                                <input value={editingRestaurant.rating} onChange={e => setEditingRestaurant({...editingRestaurant, rating: parseFloat(e.target.value)})} className="w-full bg-slate-50 p-2 rounded text-xs border border-slate-200" type="number" step="0.1"/>
                                <div className="flex gap-2">
                                  <button onClick={() => handleUpdateRestaurant(rest.id, editingRestaurant)} className="flex-1 bg-green-500 text-white py-1 rounded text-xs font-bold">Save</button>
                                  <button onClick={() => setEditingRestaurant(null)} className="flex-1 bg-slate-200 text-slate-600 py-1 rounded text-xs font-bold">Cancel</button>
                                </div>
                             </div>
                          ) : (
                             <>
                                <div className="flex justify-between items-start">
                                   <p className="text-xs text-slate-500">{rest.cuisine}</p>
                                   <p className="text-xs font-bold text-orange-500 flex items-center gap-1"><Star size={10} fill="currentColor"/> {rest.rating}</p>
                                </div>
                                <div className="flex gap-2 mt-2">
                                   <button onClick={() => setEditingRestaurant(rest)} className="flex-1 bg-indigo-50 text-indigo-600 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1"><Edit3 size={12}/> Edit</button>
                                   <button onClick={() => handleDeleteRestaurant(rest.id)} className="px-2 bg-red-50 text-red-500 rounded-lg"><Trash2 size={14}/></button>
                                </div>
                             </>
                          )}
                       </div>
                    </div>

                    {/* Menu Management Inside Card */}
                    {editingRestaurant?.id === rest.id && (
                      <div className="border-t border-slate-100 p-3 bg-slate-50/50">
                        <h4 className="font-bold text-xs text-slate-500 uppercase mb-2">Menu Items</h4>
                        <div className="space-y-2 mb-3">
                           {rest.dishes.map(dish => (
                              <div key={dish.id} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-100">
                                 <div className={`w-2 h-2 rounded-full ${dish.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                 <input 
                                   className="flex-1 text-xs font-bold outline-none" 
                                   value={dish.name}
                                   onChange={(e) => handleUpdateDish(dish.id, { name: e.target.value })}
                                 />
                                 <span className="text-xs font-bold text-slate-400">₹</span>
                                 <input 
                                   className="w-12 text-xs font-bold outline-none" 
                                   value={dish.price}
                                   type="number"
                                   onChange={(e) => handleUpdateDish(dish.id, { price: parseInt(e.target.value) })}
                                 />
                                 <button onClick={() => handleDeleteDish(dish.id)} className="text-red-400 hover:text-red-600"><X size={14}/></button>
                              </div>
                           ))}
                        </div>
                        
                        {/* Add Dish Toggle */}
                        {showAddDish ? (
                           <div className="bg-white p-3 rounded-lg border border-indigo-100">
                              <p className="text-xs font-bold text-indigo-600 mb-2">New Dish</p>
                              <div className="space-y-2">
                                <input placeholder="Dish Name" className="w-full text-xs p-2 bg-slate-50 rounded" value={newDishName} onChange={e => setNewDishName(e.target.value)} />
                                <input placeholder="Price" type="number" className="w-full text-xs p-2 bg-slate-50 rounded" value={newDishPrice} onChange={e => setNewDishPrice(e.target.value)} />
                                <div className="flex gap-2">
                                   <button onClick={() => setNewDishVeg(true)} className={`flex-1 py-1 rounded text-xs font-bold ${newDishVeg ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}>Veg</button>
                                   <button onClick={() => setNewDishVeg(false)} className={`flex-1 py-1 rounded text-xs font-bold ${!newDishVeg ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-400'}`}>Non-Veg</button>
                                </div>
                                <button onClick={handleAddDish} className="w-full bg-indigo-600 text-white py-1.5 rounded text-xs font-bold">Add to Menu</button>
                              </div>
                           </div>
                        ) : (
                           <button onClick={() => setShowAddDish(true)} className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-slate-400 text-xs font-bold hover:bg-white hover:border-indigo-300 hover:text-indigo-500 transition-colors">+ Add Dish</button>
                        )}
                      </div>
                    )}
                 </div>
               ))}
             </div>
          )}
          
          {/* --- RIDERS TAB --- */}
          {adminTab === 'riders' && (
            <div className="space-y-4">
               {/* Add Rider Button */}
               <button 
                  onClick={() => setShowAddRider(!showAddRider)}
                  className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 mb-4"
               >
                 <Plus size={18} /> Add New Rider
               </button>

               {/* Add Rider Form */}
               {showAddRider && (
                 <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 animate-in slide-in-from-top-2 mb-4">
                    <h3 className="font-bold text-slate-800 mb-3">Register Rider</h3>
                    <input 
                       type="text" 
                       placeholder="Full Name" 
                       value={newRiderName}
                       onChange={(e) => setNewRiderName(e.target.value)}
                       className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 mb-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input 
                       type="tel" 
                       maxLength={10}
                       placeholder="Phone Number (10 digits)"
                       value={newRiderPhone}
                       onChange={(e) => setNewRiderPhone(e.target.value.replace(/\D/g, ''))}
                       className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 mb-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button 
                       onClick={handleAddRider}
                       className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold text-sm"
                    >
                      Save Rider
                    </button>
                 </div>
               )}

              {riders.map(rider => {
                 const stats = getRiderStats(rider.id);
                 return (
                  <div key={rider.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                     <div className="flex items-center justify-between mb-3">
                       <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 relative">
                           <Bike size={20} />
                           <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${rider.active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                         </div>
                         <div>
                           <h4 className="font-bold text-slate-900">{rider.name}</h4>
                           <p className="text-xs text-slate-500">{rider.phone}</p>
                         </div>
                       </div>
                       <button 
                          onClick={() => toggleRiderStatus(rider.id)}
                          className={`p-2 rounded-full ${rider.active ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-green-50 text-green-500 hover:bg-green-100'}`}
                          title={rider.active ? "Deactivate" : "Activate"}
                       >
                          <Power size={18} />
                       </button>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-100">
                        <div className="text-center p-2 bg-slate-50 rounded-lg">
                           <p className="text-xs text-slate-400 font-bold uppercase">This Month</p>
                           <p className="font-bold text-slate-800 text-lg">{stats.count} Orders</p>
                        </div>
                        <div className="text-center p-2 bg-slate-50 rounded-lg relative overflow-hidden">
                           <div className="absolute top-0 right-0 bg-green-100 text-green-600 text-[10px] px-1 rounded-bl">Comm.</div>
                           <p className="text-xs text-slate-400 font-bold uppercase">Earnings</p>
                           <p className="font-bold text-green-600 text-lg">₹{stats.earnings}</p>
                        </div>
                     </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl overflow-hidden relative font-sans">
      {screen === 'location' && renderLocationScreen()}
      {screen === 'village' && renderVillageScreen()}
      {screen === 'restaurants' && renderRestaurantsScreen()}
      {screen === 'menu' && renderMenuScreen()}
      {screen === 'cart' && renderCartScreen()}
      {screen === 'checkout' && renderCheckoutScreen()}
      {screen === 'success' && renderSuccessScreen()}
      {screen === 'profile' && renderProfileScreen()}
      {screen === 'favorites' && renderFavoritesScreen()}
      {screen === 'orders' && renderOrdersScreen()}
      {screen === 'tracking' && trackingOrder && <TrackingScreen order={trackingOrder} riders={riders} onBack={() => setScreen('orders')} />}
      {screen === 'login' && renderProfileScreen()} 
      {screen === 'admin-login' && renderAdminLogin()}
      {screen === 'admin-dashboard' && renderAdminDashboard()}

      <BottomNav 
        screen={screen} 
        setScreen={setScreen} 
        cartCount={cartCount} 
        selectedVillage={selectedVillage}
        onSearchClick={handleSearchClick}
      />

      <CartNotification 
        show={notification.show}
        item={notification.item}
        total={notification.total}
        time={notification.time}
        count={notification.count}
        onClick={() => setScreen('cart')}
      />

      {/* AI Assistant Button */}
      {['restaurants', 'menu'].includes(screen) && (
        <button
          onClick={() => setIsAiOpen(true)}
          className="fixed bottom-24 right-4 bg-white p-3 rounded-full shadow-xl shadow-indigo-200 text-indigo-600 border border-indigo-50 z-40 animate-bounce hover:scale-110 transition-transform"
        >
          <Sparkles size={24} />
        </button>
      )}
      
      {isAiOpen && (
        <AiAssistant 
          onClose={() => setIsAiOpen(false)}
          restaurants={restaurants}
          onDishSelect={(dish, restaurant) => {
            setSelectedRestaurant(restaurant);
            addToCart(dish);
            setIsAiOpen(false);
            setScreen('menu');
          }}
        />
      )}
    </div>
  );
}
