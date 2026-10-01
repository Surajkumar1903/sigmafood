import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChefHat, Package, DollarSign, Users, Star, CheckCircle, Clock,
  Truck, ArrowLeft, LogOut, ToggleLeft, ToggleRight, Search, Eye,
  Database, Smartphone, Sparkles, Check, Cloud, KeyRound, Copy, RefreshCw,
  Flame, Settings, ExternalLink, ShieldCheck
} from 'lucide-react';
import { useOrdersStore, useAuthStore } from '../store';
import { PRODUCTS, type Product } from '../data/products';
import { db, type DbUser, type DbChatMessage } from '../services/db';
import { cloudDb } from '../services/cloudDb';
import {
  firebaseGetOrders,
  firebaseListenToOrders,
  firebaseUpdateOrderStatus,
  getActiveFirebaseConfig,
  saveActiveFirebaseConfig,
  type FirebaseConfig,
  type FirebaseOrder,
} from '../services/firebase';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const navigate = useNavigate();
  const { orders, updateStatus } = useOrdersStore();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'database'>('orders');
  const [productSearch, setProductSearch] = useState('');
  const [productList, setProductList] = useState<Product[]>(PRODUCTS);
  const [dbUsers, setDbUsers] = useState<DbUser[]>([]);
  const [dbChats, setDbChats] = useState<DbChatMessage[]>([]);
  const [showAllPasswords, setShowAllPasswords] = useState(true);
  const [cloudStatus, setCloudStatus] = useState<any>({ connected: true, provider: 'sigma-cloud', totalCloudUsers: 4 });
  const [firebaseOrders, setFirebaseOrders] = useState<FirebaseOrder[]>([]);
  const [firebaseConfig, setFirebaseConfig] = useState<FirebaseConfig>(getActiveFirebaseConfig());
  const [showFirebaseModal, setShowFirebaseModal] = useState(false);
  const [configInputs, setConfigInputs] = useState<FirebaseConfig>(getActiveFirebaseConfig());

  useEffect(() => {
    db.getAllUsers().then(setDbUsers);
    db.getChatHistory().then(setDbChats);
    cloudDb.getCloudStatus().then(setCloudStatus);

    const unsub = firebaseListenToOrders((fbOrders) => {
      setFirebaseOrders(fbOrders);
    });
    return () => unsub();
  }, []);

  const refreshDatabase = async () => {
    const users = await db.getAllUsers();
    const chats = await db.getChatHistory();
    const cStatus = await cloudDb.getCloudStatus();
    const fbOrders = await firebaseGetOrders();
    setDbUsers(users);
    setDbChats(chats);
    setCloudStatus(cStatus);
    setFirebaseOrders(fbOrders);
    toast.success('Database, Firestore & Cloud Synced! 🔄');
  };

  const handleSaveFirebaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveActiveFirebaseConfig(configInputs);
    setFirebaseConfig(configInputs);
    setShowFirebaseModal(false);
    toast.success('Firebase Configuration Saved! 🚀');
  };

  const toggleAvailability = (id: string) => {
    setProductList(prev =>
      prev.map(p => (p.id === id ? { ...p, isAvailable: !p.isAvailable } : p))
    );
    toast.success('Product availability updated');
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Mock initial orders if none exist so the admin panel looks alive immediately!
  const allOrders = orders.length > 0 ? orders : [
    {
      id: 'SF-89241',
      items: [
        { product: PRODUCTS[0], quantity: 2 },
        { product: PRODUCTS[1], quantity: 1 },
      ],
      total: 347,
      status: 'Preparing' as const,
      address: {
        fullName: 'Rahul Sharma',
        phone: '+91 98112 34567',
        house: 'Flat 102',
        street: 'Pocket 6-2',
        area: 'Sector 2',
        city: 'Rohini, Delhi',
        state: 'Delhi',
        pin: '110085',
      },
      paymentMethod: 'UPI' as const,
      date: 'September 30, 2026',
    },
    {
      id: 'SF-89240',
      items: [
        { product: PRODUCTS[2], quantity: 1 },
        { product: PRODUCTS[3], quantity: 2 },
      ],
      total: 437,
      status: 'Out for Delivery' as const,
      address: {
        fullName: 'Priya Verma',
        phone: '+91 98765 43210',
        house: 'House 45',
        street: 'Pocket 4',
        area: 'Sector 3',
        city: 'Rohini, Delhi',
        state: 'Delhi',
        pin: '110085',
      },
      paymentMethod: 'Card' as const,
      date: 'September 30, 2026',
    },
    {
      id: 'SF-89239',
      items: [
        { product: PRODUCTS[0], quantity: 1 },
      ],
      total: 99,
      status: 'Delivered' as const,
      address: {
        fullName: 'Amit Kumar',
        phone: '+91 99887 76655',
        house: 'Pocket 6-2',
        street: 'Sector 2',
        area: 'Rohini',
        city: 'Delhi',
        state: 'Delhi',
        pin: '110085',
      },
      paymentMethod: 'COD' as const,
      date: 'September 30, 2026',
    },
  ];

  const totalRevenue = allOrders.reduce((sum, o) => sum + o.total, 0);

  const filteredProducts = productList.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#070707] text-white pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/8">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f5a623] to-[#ff6b35] flex items-center justify-center shadow-[0_0_25px_rgba(245,166,35,0.4)]">
              <ChefHat size={26} className="text-[#070707]" strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Sigma Foods <span className="text-[#f5a623]">Admin Portal</span>
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 text-[10px] font-bold">
                  LIVE
                </span>
              </div>
              <p className="text-white/40 text-xs sm:text-sm mt-0.5">
                Logged in as: <span className="text-white font-medium">{user?.email || 'admin@sigmafoods.com'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-semibold transition-colors"
            >
              <Eye size={14} /> View Store
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 text-xs font-semibold transition-colors"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Revenue', value: `₹ ${totalRevenue}`, icon: DollarSign, color: '#f5a623', sub: '+18% today' },
            { label: 'Active Orders', value: allOrders.length, icon: Package, color: '#38bdf8', sub: 'Real-time sync' },
            { label: 'Menu Items', value: productList.length, icon: ChefHat, color: '#4ade80', sub: '7 Categories' },
            { label: 'Google Rating', value: '5.0 / 5', icon: Star, color: '#f5a623', sub: '13+ Reviews' },
          ].map(({ label, value, icon: Icon, color, sub }) => (
            <div
              key={label}
              className="glass rounded-2xl p-5 border border-white/8 bg-[#0c0c0c] flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/45 text-xs font-medium">{label}</span>
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${color}18` }}
                >
                  <Icon size={16} style={{ color }} />
                </div>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">{value}</p>
                <p className="text-[11px] text-white/40 mt-1">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mb-6 border-b border-white/8 pb-3">
          {[
            { id: 'orders', label: `Orders (${allOrders.length})` },
            { id: 'products', label: `Menu Items (${productList.length})` },
            { id: 'database', label: `Database Inspector 🗄️ (${dbUsers.length} Users)` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as 'orders' | 'products' | 'database');
                if (tab.id === 'database') refreshDatabase();
              }}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#f5a623] text-[#070707] shadow-[0_0_15px_rgba(245,166,35,0.3)]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Orders Management */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {allOrders.map(order => (
              <div
                key={order.id}
                className="glass rounded-2xl p-5 sm:p-6 border border-white/8 bg-[#0d0d0d] flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* Left: Order Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2.5 mb-2">
                    <span className="text-white font-extrabold text-base tracking-wide">{order.id}</span>
                    <span className="text-white/30">•</span>
                    <span className="text-white/50 text-xs">
                      {order.date}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.status === 'Delivered'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : order.status === 'Out for Delivery'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : order.status === 'Preparing'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-white/10 text-white/80'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Customer details */}
                  <div className="text-xs text-white/50 mb-3 space-y-0.5">
                    <p><span className="text-white/70 font-semibold">{order.address.fullName}</span> • {order.address.phone}</p>
                    <p>{order.address.house}, {order.address.street}, {order.address.area}, {order.address.city}</p>
                  </div>

                  {/* Items list */}
                  <div className="flex flex-wrap gap-2">
                    {order.items.map(({ product, quantity }) => (
                      <span
                        key={product.id}
                        className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-xs text-white/80 flex items-center gap-1.5"
                      >
                        <img src={product.image} alt={product.name} className="w-4 h-4 rounded-full object-cover" />
                        <span>{quantity}x {product.name}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right: Payment & Status Change */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-white/6">
                  <div className="text-left lg:text-right">
                    <p className="text-white/40 text-[11px]">Total ({order.paymentMethod})</p>
                    <p className="text-[#f5a623] font-extrabold text-xl">₹ {order.total}</p>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <select
                      value={order.status}
                      onChange={async e => {
                        const newStatus = e.target.value as 'Confirmed' | 'Preparing' | 'Out for Delivery' | 'Delivered';
                        updateStatus(order.id, newStatus);
                        await firebaseUpdateOrderStatus(order.id, newStatus);
                        toast.success(`Order ${order.id} status updated to ${e.target.value} (Firestore synced)`);
                      }}
                      className="px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-[#f5a623]"
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Menu Items Management */}
        {activeTab === 'products' && (
          <div>
            <div className="mb-6 relative max-w-md">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={productSearch}
                onChange={e => setProductSearch(e.target.value)}
                placeholder="Search products by name or category..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:border-[#f5a623]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map(p => (
                <div
                  key={p.id}
                  className="glass rounded-2xl p-4 border border-white/8 bg-[#0c0c0c] flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 bg-black/40"
                    />
                    <div className="min-w-0">
                      <p className="text-white font-bold text-sm truncate">{p.name}</p>
                      <p className="text-white/40 text-xs">{p.category} • <span className="text-[#f5a623] font-semibold">₹ {p.price}</span></p>
                      <p className="text-[11px] mt-0.5">
                        {p.isAvailable ? (
                          <span className="text-green-400 font-semibold">In Stock</span>
                        ) : (
                          <span className="text-red-400 font-semibold">Out of Stock</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleAvailability(p.id)}
                    className="p-1 rounded-xl hover:bg-white/5 transition-colors shrink-0"
                    title={p.isAvailable ? 'Mark as Out of Stock' : 'Mark as In Stock'}
                  >
                    {p.isAvailable ? (
                      <ToggleRight size={32} className="text-green-400" />
                    ) : (
                      <ToggleLeft size={32} className="text-white/30" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Database Inspector (Live IndexedDB Records) */}
        {activeTab === 'database' && (
          <div className="space-y-6 animate-fade-up">
            {/* Database & Cloud Sync Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Firebase Cloud Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/30 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 shadow-lg shadow-amber-500/20">
                      <Flame size={22} />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm flex items-center gap-1.5">
                        Firebase Cloud <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Active 🟢</span>
                      </h3>
                      <p className="text-white/50 text-[11px] mt-0.5 font-mono">
                        ID: {firebaseConfig.projectId}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-white/5 space-y-1 text-[11px]">
                  <p className="text-white/70 flex items-center justify-between">
                    <span>Auth Providers:</span>
                    <span className="text-amber-400 font-semibold">Google, OTP, Email</span>
                  </p>
                  <p className="text-white/70 flex items-center justify-between">
                    <span>Firestore Orders:</span>
                    <span className="text-emerald-400 font-bold">{firebaseOrders.length} Synced</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setConfigInputs(firebaseConfig);
                    setShowFirebaseModal(true);
                  }}
                  className="mt-3.5 w-full py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Settings size={13} /> Firebase Settings
                </button>
              </div>

              {/* Local IndexedDB Card */}
              <div className="p-5 rounded-2xl bg-[rgba(245,166,35,0.06)] border border-[rgba(245,166,35,0.25)] flex flex-col justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#f5a623]/20 flex items-center justify-center text-[#f5a623] shrink-0">
                    <Database size={22} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm flex items-center gap-1.5">
                      SigmaFoodsDB <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">IndexedDB Active</span>
                    </h3>
                    <p className="text-white/40 text-xs mt-0.5">
                      Local persistent client storage
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-white/5 space-y-1 text-[11px]">
                  <p className="text-white/70 flex items-center justify-between">
                    <span>Users Stored:</span>
                    <span className="text-white font-semibold">{dbUsers.length}</span>
                  </p>
                  <p className="text-white/70 flex items-center justify-between">
                    <span>Chat Queries:</span>
                    <span className="text-white font-semibold">{dbChats.length}</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={refreshDatabase}
                  className="mt-3.5 w-full py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <RefreshCw size={12} /> Sync Database
                </button>
              </div>

              {/* Cloud Database Card */}
              <div className="p-5 rounded-2xl bg-[rgba(56,189,248,0.06)] border border-[rgba(56,189,248,0.25)] flex flex-col justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
                    <Cloud size={22} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm flex items-center gap-1.5">
                      Cloud Sync <span className="text-[10px] px-2 py-0.2 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">Online 🟢</span>
                    </h3>
                    <p className="text-white/40 text-xs mt-0.5">
                      Latency: 38ms • Bi-directional
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-white/5 space-y-1 text-[11px]">
                  <p className="text-white/70 flex items-center justify-between">
                    <span>Replication:</span>
                    <span className="text-sky-400 font-semibold">Continuous</span>
                  </p>
                  <p className="text-white/70 flex items-center justify-between">
                    <span>Cloud Users:</span>
                    <span className="text-sky-400 font-bold">{dbUsers.length} Active</span>
                  </p>
                </div>

                <div className="mt-3.5 py-1.5 px-3 rounded-xl bg-sky-500/10 text-sky-300 text-center text-xs font-semibold border border-sky-500/20">
                  ⚡ Auto-Synced with Firestore
                </div>
              </div>
            </div>

            {/* 1. USERS & CREDENTIALS TABLE */}
            <div className="glass rounded-2xl p-6 border border-white/8 bg-[#0c0c0c]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                  <h4 className="text-white font-bold text-base flex items-center gap-2">
                    <Users size={18} className="text-[#f5a623]" />
                    Registered Users & Credentials ({dbUsers.length})
                  </h4>
                  <p className="text-white/40 text-xs mt-0.5">
                    Live accounts available for instant login (IDs & Passwords revealed below)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAllPasswords(!showAllPasswords)}
                    className="px-3.5 py-1.5 rounded-xl bg-[rgba(245,166,35,0.15)] hover:bg-[rgba(245,166,35,0.25)] text-[#f5a623] text-xs font-bold border border-[rgba(245,166,35,0.25)] transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <KeyRound size={13} />
                    {showAllPasswords ? 'Hide Passwords' : 'Show All Passwords'}
                  </button>
                </div>
              </div>

              {dbUsers.length === 0 ? (
                <div className="py-8 text-center text-white/40 text-sm">
                  Loading users from database...
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-white/50 font-semibold uppercase tracking-wider">
                        <th className="py-3 px-3">User Name</th>
                        <th className="py-3 px-3">Login ID (Email/Phone)</th>
                        <th className="py-3 px-3">Password / Code</th>
                        <th className="py-3 px-3">Auth Method</th>
                        <th className="py-3 px-3">Role</th>
                        <th className="py-3 px-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-white/80">
                      {dbUsers.map((u) => {
                        const displayPw = u.password || (u.authProvider === 'phone' ? '482910 (OTP)' : 'Google Token');
                        return (
                          <tr key={u.id} className="hover:bg-white/5 transition-colors">
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2.5">
                                {u.avatar ? (
                                  <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                                ) : (
                                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#f5a623] to-[#ff6b35] flex items-center justify-center font-bold text-white text-[10px]">
                                    {u.name.slice(0, 1).toUpperCase()}
                                  </div>
                                )}
                                <span className="font-bold text-white">{u.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-3 font-mono font-semibold text-white/90 select-all">
                              {u.email || u.phone}
                            </td>
                            <td className="py-3 px-3">
                              <span className="font-mono px-2 py-1 rounded bg-black/60 border border-white/10 text-[#f5a623] font-bold select-all">
                                {showAllPasswords ? displayPw : '••••••••'}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                                u.authProvider === 'google'
                                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                  : u.authProvider === 'phone'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                              }`}>
                                {u.authProvider === 'google' ? 'Google' : u.authProvider === 'phone' ? 'Phone OTP' : 'Email/Pass'}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <span className={`text-[10px] font-bold uppercase ${u.role === 'admin' ? 'text-amber-400' : 'text-white/40'}`}>
                                {u.role === 'admin' ? '👑 Admin' : 'Customer'}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(`${u.email || u.phone} / ${displayPw}`);
                                  toast.success(`Copied login credentials for ${u.name}! 📋`);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Copy size={11} /> Copy ID/Pass
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* 2. CHATBOT AUDIT LOGS */}
            <div className="glass rounded-2xl p-6 border border-white/8 bg-[#0c0c0c]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-white font-bold text-base flex items-center gap-2">
                    <Sparkles size={18} className="text-[#f5a623]" />
                    AI Chatbot Activity Logs ({dbChats.length})
                  </h4>
                  <p className="text-white/40 text-xs">Customer interactions recorded in database</p>
                </div>
              </div>

              {dbChats.length === 0 ? (
                <div className="py-8 text-center text-white/40 text-sm">
                  No chatbot queries logged yet. Chat with Sigma AI to see live records!
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {dbChats.slice(-15).reverse().map((c) => (
                    <div key={c.id} className="p-3 rounded-xl bg-white/3 border border-white/5 flex items-start justify-between gap-3 text-xs">
                      <div className="min-w-0 flex-1">
                        <span className={`inline-block px-1.5 py-0.2 rounded font-bold text-[9px] uppercase tracking-wider mb-1 ${
                          c.sender === 'user' ? 'bg-[#f5a623]/20 text-[#f5a623]' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {c.sender === 'user' ? 'Customer' : 'Sigma AI'}
                        </span>
                        <p className="text-white/85 truncate">{c.text}</p>
                      </div>
                      <span className="text-white/30 text-[10px] shrink-0">
                        {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. FIRESTORE LIVE ORDERS COLLECTION */}
            <div className="glass rounded-2xl p-6 border border-white/8 bg-[#0c0c0c]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-white font-bold text-base flex items-center gap-2">
                    <Flame size={18} className="text-amber-400" />
                    Firestore Orders Collection ({firebaseOrders.length})
                  </h4>
                  <p className="text-white/40 text-xs">
                    Real-time cloud replicated orders from Firebase Firestore
                  </p>
                </div>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  onSnapshot Live
                </span>
              </div>

              {firebaseOrders.length === 0 ? (
                <div className="py-8 text-center text-white/40 text-sm">
                  No orders in Firestore yet. Place an order at checkout to see real-time sync!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-white/50 font-semibold uppercase tracking-wider">
                        <th className="py-3 px-3">Order ID</th>
                        <th className="py-3 px-3">Customer</th>
                        <th className="py-3 px-3">Items</th>
                        <th className="py-3 px-3">Total</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3">Payment</th>
                        <th className="py-3 px-3">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-white/80">
                      {firebaseOrders.map((ord) => (
                        <tr key={ord.orderId} className="hover:bg-white/2 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-amber-400">
                            #{ord.orderId}
                          </td>
                          <td className="py-3 px-3">
                            <p className="font-semibold text-white">{ord.customerName}</p>
                            <p className="text-white/40 text-[10px]">{ord.customerPhone}</p>
                          </td>
                          <td className="py-3 px-3 text-white/70">
                            {ord.items?.length || 0} items
                          </td>
                          <td className="py-3 px-3 font-bold text-[#f5a623]">
                            ₹{ord.total}
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              {ord.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-white/60">
                            {ord.paymentMethod} ({ord.paymentStatus})
                          </td>
                          <td className="py-3 px-3 text-white/40 text-[10px]">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── FIREBASE CREDENTIALS MODAL ───────────────────────── */}
        {showFirebaseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-lg bg-[#0e0e0e] border border-amber-500/30 rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-white/8 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                    <Flame size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base">Firebase Configuration</h3>
                    <p className="text-white/40 text-xs">Auth & Cloud Firestore Credentials</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowFirebaseModal(false)}
                  className="p-1.5 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveFirebaseConfig} className="space-y-3.5">
                <div>
                  <label className="block text-white/50 text-xs mb-1 font-semibold">Firebase API Key</label>
                  <input
                    type="text"
                    value={configInputs.apiKey}
                    onChange={(e) => setConfigInputs({ ...configInputs, apiKey: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                    placeholder="AIzaSy..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/50 text-xs mb-1 font-semibold">Auth Domain</label>
                    <input
                      type="text"
                      value={configInputs.authDomain}
                      onChange={(e) => setConfigInputs({ ...configInputs, authDomain: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                      placeholder="project.firebaseapp.com"
                    />
                  </div>
                  <div>
                    <label className="block text-white/50 text-xs mb-1 font-semibold">Project ID</label>
                    <input
                      type="text"
                      value={configInputs.projectId}
                      onChange={(e) => setConfigInputs({ ...configInputs, projectId: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                      placeholder="sigma-foods-delhi"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/50 text-xs mb-1 font-semibold">Messaging Sender ID</label>
                    <input
                      type="text"
                      value={configInputs.messagingSenderId}
                      onChange={(e) => setConfigInputs({ ...configInputs, messagingSenderId: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                      placeholder="102938475610"
                    />
                  </div>
                  <div>
                    <label className="block text-white/50 text-xs mb-1 font-semibold">App ID</label>
                    <input
                      type="text"
                      value={configInputs.appId}
                      onChange={(e) => setConfigInputs({ ...configInputs, appId: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                      placeholder="1:102938475610:web:8a9b0c..."
                    />
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200/90 leading-relaxed flex items-start gap-2">
                  <ShieldCheck size={16} className="text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    Firebase handles Google OAuth 1-tap, SMS OTP verification, and Firestore cloud synchronization for orders & customers. Pre-configured with Sigma Foods live defaults.
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem('sigma_firebase_custom_config');
                      setConfigInputs(getActiveFirebaseConfig());
                      setFirebaseConfig(getActiveFirebaseConfig());
                      toast.success('Reset to Sigma Foods Default Firebase');
                      setShowFirebaseModal(false);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-xs font-semibold transition-all cursor-pointer"
                  >
                    Reset Defaults
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-[#070707] text-xs font-extrabold shadow-lg transition-all cursor-pointer"
                  >
                    Save & Connect Firebase
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
