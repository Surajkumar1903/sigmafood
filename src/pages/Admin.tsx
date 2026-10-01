import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChefHat, Package, DollarSign, Users, Star, CheckCircle, Clock,
  Truck, ArrowLeft, LogOut, ToggleLeft, ToggleRight, Search, Eye,
  Database, Smartphone, Sparkles, Check
} from 'lucide-react';
import { useOrdersStore, useAuthStore } from '../store';
import { PRODUCTS, type Product } from '../data/products';
import { db, type DbUser, type DbChatMessage } from '../services/db';
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

  useState(() => {
    db.getAllUsers().then(setDbUsers);
    db.getChatHistory().then(setDbChats);
  });

  const refreshDatabase = async () => {
    const users = await db.getAllUsers();
    const chats = await db.getChatHistory();
    setDbUsers(users);
    setDbChats(chats);
    toast.success('Database refreshed! 🔄');
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
                      onChange={e => {
                        updateStatus(order.id, e.target.value as 'Confirmed' | 'Preparing' | 'Out for Delivery' | 'Delivered');
                        toast.success(`Order ${order.id} status updated to ${e.target.value}`);
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
            {/* Database Engine Status */}
            <div className="p-6 rounded-2xl bg-[rgba(245,166,35,0.06)] border border-[rgba(245,166,35,0.25)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#f5a623]/20 flex items-center justify-center text-[#f5a623]">
                  <Database size={24} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base flex items-center gap-2">
                    SigmaFoodsDB <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">IndexedDB Active</span>
                  </h3>
                  <p className="text-white/50 text-xs mt-0.5">
                    Real browser database engine with persistent tables for Users, Orders, and Chat Logs.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={refreshDatabase}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw size={13} /> Refresh Records
                </button>
              </div>
            </div>

            {/* 1. USERS TABLE */}
            <div className="glass rounded-2xl p-6 border border-white/8 bg-[#0c0c0c]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-white font-bold text-base flex items-center gap-2">
                    <Users size={18} className="text-[#f5a623]" />
                    Registered Users ({dbUsers.length})
                  </h4>
                  <p className="text-white/40 text-xs">Accounts created via Google, Phone OTP, or Email</p>
                </div>
              </div>

              {dbUsers.length === 0 ? (
                <div className="py-8 text-center text-white/40 text-sm">
                  No custom users saved in DB yet. Login with Google or Phone OTP to populate!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-white/50 font-semibold uppercase tracking-wider">
                        <th className="py-3 px-3">User</th>
                        <th className="py-3 px-3">Auth Method</th>
                        <th className="py-3 px-3">Phone</th>
                        <th className="py-3 px-3">Registered At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-white/80">
                      {dbUsers.map((u) => (
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
                              <div>
                                <p className="font-bold text-white">{u.name}</p>
                                <p className="text-white/40 text-[11px]">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                              u.authProvider === 'google'
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                : u.authProvider === 'phone'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                            }`}>
                              {u.authProvider === 'google' ? 'Google' : u.authProvider === 'phone' ? 'Phone OTP' : 'Email/Password'}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono">{u.phone || 'N/A'}</td>
                          <td className="py-3 px-3 text-white/40">{new Date(u.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
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
          </div>
        )}
      </div>
    </div>
  );
}
