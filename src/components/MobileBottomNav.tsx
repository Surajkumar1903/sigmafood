import { Link, useLocation } from 'react-router-dom';
import { Home, UtensilsCrossed, Search, ShoppingCart, User } from 'lucide-react';
import { useCartStore, useUIStore } from '../store';

export default function MobileBottomNav() {
  const location = useLocation();
  const cartCount = useCartStore(s => s.getTotalItems());
  const setCartOpen = useUIStore(s => s.setCartOpen);
  const setSearchOpen = useUIStore(s => s.setSearchOpen);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bottom-nav">
      <nav className="bg-[rgba(10,10,10,0.97)] backdrop-blur-xl border-t border-white/8 flex items-center justify-around px-2 py-2">
        {[
          { icon: Home, label: 'Home', path: '/' },
        ].map(item => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
              isActive(item.path) ? 'text-[#f5a623]' : 'text-white/40 hover:text-white'
            }`}
          >
            <item.icon size={20} strokeWidth={isActive(item.path) ? 2.5 : 1.8} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}
        <Link
          to="/menu"
          className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
            isActive('/menu') ? 'text-[#f5a623]' : 'text-white/40 hover:text-white'
          }`}
        >
          <UtensilsCrossed size={20} strokeWidth={isActive('/menu') ? 2.5 : 1.8} />
          <span className="text-[10px] font-medium">Menu</span>
        </Link>
        <button
          onClick={() => setSearchOpen(true)}
          className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-white/40 hover:text-white transition-all"
        >
          <Search size={20} strokeWidth={1.8} />
          <span className="text-[10px] font-medium">Search</span>
        </button>
        <button
          onClick={() => setCartOpen(true)}
          className="relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-white/40 hover:text-white transition-all"
        >
          <ShoppingCart size={20} strokeWidth={1.8} />
          {cartCount > 0 && (
            <span className="absolute top-0 right-1 w-4 h-4 bg-[#f5a623] text-[#070707] text-[9px] font-bold rounded-full flex items-center justify-center">
              {cartCount > 9 ? '9+' : cartCount}
            </span>
          )}
          <span className="text-[10px] font-medium">Cart</span>
        </button>
        <Link
          to="/account"
          className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
            isActive('/account') ? 'text-[#f5a623]' : 'text-white/40 hover:text-white'
          }`}
        >
          <User size={20} strokeWidth={isActive('/account') ? 2.5 : 1.8} />
          <span className="text-[10px] font-medium">Account</span>
        </Link>
      </nav>
    </div>
  );
}
