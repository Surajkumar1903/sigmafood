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
      <nav className="bg-[rgba(12,12,12,0.94)] backdrop-blur-2xl border-t border-white/10 flex items-center justify-around px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-10px_35px_rgba(0,0,0,0.9)]">
        {[
          { icon: Home, label: 'Home', path: '/' },
        ].map(item => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all relative ${
                active ? 'text-[#f5a623]' : 'text-white/45 hover:text-white'
              }`}
            >
              <item.icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              <span className={`text-[10px] ${active ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
              {active && <span className="absolute bottom-0 w-4 h-0.5 bg-[#f5a623] rounded-full shadow-[0_0_8px_#f5a623]" />}
            </Link>
          );
        })}
        <Link
          to="/menu"
          className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all relative ${
            isActive('/menu') ? 'text-[#f5a623]' : 'text-white/45 hover:text-white'
          }`}
        >
          <UtensilsCrossed size={20} strokeWidth={isActive('/menu') ? 2.5 : 1.8} />
          <span className={`text-[10px] ${isActive('/menu') ? 'font-bold' : 'font-medium'}`}>Menu</span>
          {isActive('/menu') && <span className="absolute bottom-0 w-4 h-0.5 bg-[#f5a623] rounded-full shadow-[0_0_8px_#f5a623]" />}
        </Link>
        <button
          onClick={() => setSearchOpen(true)}
          className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-white/45 hover:text-white transition-all cursor-pointer"
        >
          <Search size={20} strokeWidth={1.8} />
          <span className="text-[10px] font-medium">Search</span>
        </button>
        <button
          onClick={() => setCartOpen(true)}
          className="relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-white/45 hover:text-white transition-all cursor-pointer"
        >
          <ShoppingCart size={20} strokeWidth={1.8} />
          {cartCount > 0 && (
            <span className="absolute top-0 right-1 w-4 h-4 bg-[#e03131] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-md animate-pulse">
              {cartCount > 9 ? '9+' : cartCount}
            </span>
          )}
          <span className="text-[10px] font-medium">Cart</span>
        </button>
        <Link
          to="/account"
          className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all relative ${
            isActive('/account') ? 'text-[#f5a623]' : 'text-white/45 hover:text-white'
          }`}
        >
          <User size={20} strokeWidth={isActive('/account') ? 2.5 : 1.8} />
          <span className={`text-[10px] ${isActive('/account') ? 'font-bold' : 'font-medium'}`}>Account</span>
          {isActive('/account') && <span className="absolute bottom-0 w-4 h-0.5 bg-[#f5a623] rounded-full shadow-[0_0_8px_#f5a623]" />}
        </Link>
      </nav>
    </div>
  );
}
