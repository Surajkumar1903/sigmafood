import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Package, Heart, MapPin, LogOut, Edit2, Save, X,
  Plus, Trash2, Star, Phone, Clock, ChefHat
} from 'lucide-react';
import { useAuthStore, useCartStore, useOrdersStore, useWishlistStore } from '../store';
import toast from 'react-hot-toast';

const TABS = ['Profile', 'Orders', 'Wishlist', 'Addresses'] as const;
type Tab = typeof TABS[number];

export default function AccountPage() {
  const { user, isLoggedIn, logout, updateUser, addresses, addAddress, removeAddress, setDefault } = useAuthStore();
  const orders = useOrdersStore(s => s.orders);
  const wishlist = useWishlistStore(s => s.items);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('Profile');
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  const [showAddAddr, setShowAddAddr] = useState(false);
  const [newAddr, setNewAddr] = useState({ fullName: '', phone: '', house: '', street: '', area: '', city: 'Delhi', state: 'Delhi', pin: '' });

  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center text-center px-4">
        <div className="text-8xl mb-6">👤</div>
        <h2 className="text-white font-bold text-2xl mb-3">Sign in to your account</h2>
        <p className="text-white/40 mb-8">Access your orders, wishlist, and profile.</p>
        <div className="flex gap-3">
          <Link to="/login" className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#f5a623] to-[#ff6b35] text-white font-bold btn-shine">
            Sign In
          </Link>
          <Link to="/register" className="px-6 py-3 rounded-xl glass border border-white/10 text-white font-semibold hover:border-white/20">
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  const handleSaveProfile = () => {
    updateUser(editForm);
    setEditing(false);
    toast.success('Profile updated!');
  };

  const handleAddAddress = () => {
    if (!newAddr.fullName || !newAddr.house) { toast.error('Please fill required fields'); return; }
    addAddress(newAddr as any);
    setNewAddr({ fullName: '', phone: '', house: '', street: '', area: '', city: 'Delhi', state: 'Delhi', pin: '' });
    setShowAddAddr(false);
    toast.success('Address added!');
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out!');
    navigate('/');
  };

  const TAB_ICONS = { Profile: User, Orders: Package, Wishlist: Heart, Addresses: MapPin };

  return (
    <div className="min-h-screen pt-16" style={{ backgroundColor: '#070707' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-2xl object-cover shadow-lg border border-white/10" />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#f5a623] to-[#ff6b35] flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              {user.name}
              {user.email.includes('gmail') && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold">
                  Google Verified
                </span>
              )}
            </h1>
            <p className="text-white/40 text-sm">{user.email} {user.phone ? `• ${user.phone}` : ''}</p>
          </div>
          <button onClick={handleLogout} className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/8 text-white/50 hover:text-red-400 hover:border-red-400/20 text-sm transition-all cursor-pointer">
            <LogOut size={15} /> Logout
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="glass rounded-2xl p-2 space-y-1">
              {TABS.map(tab => {
                const Icon = TAB_ICONS[tab];
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      activeTab === tab
                        ? 'bg-[rgba(245,166,35,0.1)] text-[#f5a623] border border-[rgba(245,166,35,0.2)]'
                        : 'text-white/50 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={17} />
                    {tab}
                    {tab === 'Orders' && orders.length > 0 && (
                      <span className="ml-auto text-xs bg-[rgba(245,166,35,0.15)] text-[#f5a623] px-1.5 py-0.5 rounded-full">{orders.length}</span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Quick stats */}
            <div className="glass rounded-2xl p-4 mt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/40 text-sm">Total Orders</span>
                <span className="text-white font-bold">{orders.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/40 text-sm">Wishlist</span>
                <span className="text-white font-bold">{wishlist.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/40 text-sm">Addresses</span>
                <span className="text-white font-bold">{addresses.length}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Profile */}
            {activeTab === 'Profile' && (
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-white font-bold text-lg">Profile Information</h2>
                  {!editing ? (
                    <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/10 text-white/60 text-sm hover:text-white">
                      <Edit2 size={14} /> Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={handleSaveProfile} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[rgba(245,166,35,0.15)] text-[#f5a623] text-sm border border-[rgba(245,166,35,0.2)] hover:bg-[rgba(245,166,35,0.25)]">
                        <Save size={14} /> Save
                      </button>
                      <button onClick={() => setEditing(false)} className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/10 text-white/50 text-sm">
                        <X size={14} /> Cancel
                      </button>
                    </div>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  {[
                    ['name', 'Full Name', 'text', User],
                    ['email', 'Email Address', 'email', Package],
                    ['phone', 'Phone Number', 'tel', Phone],
                  ].map(([field, label, type, _Icon]) => (
                    <div key={field as string} className={field === 'email' ? 'sm:col-span-2' : ''}>
                      <label className="block text-white/40 text-xs mb-1.5">{label as string}</label>
                      {editing ? (
                        <input
                          type={type as string}
                          value={(editForm as Record<string, string>)[field as string]}
                          onChange={e => setEditForm(prev => ({ ...prev, [field as string]: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/8 text-white focus:outline-none focus:border-[rgba(245,166,35,0.4)] transition-colors"
                        />
                      ) : (
                        <p className="px-4 py-3 rounded-xl bg-white/3 border border-white/5 text-white/80">
                          {(user as unknown as Record<string, string>)[field as string] || 'Not set'}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Orders tab */}
            {activeTab === 'Orders' && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="glass rounded-2xl p-12 text-center">
                    <p className="text-6xl mb-4">📦</p>
                    <p className="text-white font-semibold mb-2">No orders yet</p>
                    <Link to="/menu" className="text-[#f5a623] hover:underline text-sm">Order something delicious!</Link>
                  </div>
                ) : orders.map(order => (
                  <div key={order.id} className="glass rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-[#f5a623] font-bold">#{order.id}</p>
                        <p className="text-white/40 text-xs">{order.date}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        order.status === 'Delivered' ? 'bg-green-500/15 text-green-400 border-green-500/20' :
                        order.status === 'Cancelled' ? 'bg-red-500/15 text-red-400 border-red-500/20' :
                        'bg-[rgba(245,166,35,0.15)] text-[#f5a623] border-[rgba(245,166,35,0.2)]'
                      }`}>{order.status}</span>
                    </div>
                    <div className="flex gap-2 mb-3">
                      {order.items.slice(0, 5).map(({ product }) => (
                        <span key={product.id} title={product.name} className="text-xl">{product.emoji}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#f5a623] font-bold">₹{order.total}</span>
                      <Link to={`/order-tracking/${order.id}`} className="text-sm text-[#f5a623] hover:underline">View Details →</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Wishlist tab */}
            {activeTab === 'Wishlist' && (
              <div className="grid sm:grid-cols-2 gap-4">
                {wishlist.length === 0 ? (
                  <div className="sm:col-span-2 glass rounded-2xl p-12 text-center">
                    <p className="text-6xl mb-4">❤️</p>
                    <p className="text-white font-semibold mb-2">Your wishlist is empty</p>
                    <Link to="/menu" className="text-[#f5a623] hover:underline text-sm">Browse the menu</Link>
                  </div>
                ) : wishlist.map(product => (
                  <div key={product.id} className="glass rounded-2xl p-4 flex items-center gap-3">
                    <span className="text-3xl">{product.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{product.name}</p>
                      <p className="text-[#f5a623] font-bold">₹{product.price}</p>
                    </div>
                    <Link to={`/product/${product.id}`} className="text-[#f5a623] text-xs hover:underline shrink-0">View</Link>
                  </div>
                ))}
              </div>
            )}

            {/* Addresses tab */}
            {activeTab === 'Addresses' && (
              <div className="space-y-4">
                {addresses.map(addr => (
                  <div key={addr.id} className={`glass rounded-2xl p-5 border ${addr.isDefault ? 'border-[rgba(245,166,35,0.3)]' : 'border-white/6'}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        {addr.isDefault && (
                          <span className="inline-block px-2 py-0.5 rounded-full bg-[rgba(245,166,35,0.15)] text-[#f5a623] text-xs font-bold mb-2">Default</span>
                        )}
                        <p className="text-white font-semibold">{addr.fullName}</p>
                        <p className="text-white/50 text-sm">{addr.house}, {addr.street}, {addr.area}</p>
                        <p className="text-white/50 text-sm">{addr.city}, {addr.state} – {addr.pin}</p>
                        <p className="text-white/40 text-sm mt-1">{addr.phone}</p>
                      </div>
                      <div className="flex gap-2">
                        {!addr.isDefault && (
                          <button onClick={() => setDefault(addr.id)} className="text-[#f5a623] text-xs hover:underline">Set Default</button>
                        )}
                        <button onClick={() => { removeAddress(addr.id); toast.success('Address removed'); }} className="p-1.5 rounded-lg text-white/30 hover:text-red-400">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {showAddAddr ? (
                  <div className="glass rounded-2xl p-6">
                    <h3 className="text-white font-semibold mb-4">Add New Address</h3>
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      {[['fullName', 'Full Name'], ['phone', 'Phone'], ['house', 'House/Flat'], ['street', 'Street'], ['area', 'Area'], ['city', 'City'], ['state', 'State'], ['pin', 'PIN Code']].map(([field, label]) => (
                        <div key={field}>
                          <label className="block text-white/40 text-xs mb-1">{label}</label>
                          <input
                            value={(newAddr as Record<string, string>)[field]}
                            onChange={e => setNewAddr(prev => ({ ...prev, [field]: e.target.value }))}
                            placeholder={label}
                            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/8 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[rgba(245,166,35,0.4)]"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <button onClick={handleAddAddress} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#f5a623] to-[#ff6b35] text-white font-semibold text-sm">Save Address</button>
                      <button onClick={() => setShowAddAddr(false)} className="px-5 py-2.5 rounded-xl glass border border-white/10 text-white/50 text-sm">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setShowAddAddr(true)} className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl glass border border-dashed border-white/15 text-white/40 hover:text-[#f5a623] hover:border-[rgba(245,166,35,0.3)] transition-all">
                    <Plus size={16} /> Add New Address
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
