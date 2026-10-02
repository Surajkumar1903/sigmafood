import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search, ShoppingCart, Menu, X, ChefHat, Heart, MapPin, User, ArrowRight, Smartphone
} from 'lucide-react';
import { useCartStore, useWishlistStore, useUIStore, useAuthStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Menu', href: '/menu' },
  { label: 'Reviews', href: '/#reviews' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  // Stores
  const setCartOpen = useUIStore(s => s.setCartOpen);
  const setSearchOpen = useUIStore(s => s.setSearchOpen);
  const isMobileMenuOpen = useUIStore(s => s.isMobileMenuOpen);
  const setMobileMenuOpen = useUIStore(s => s.setMobileMenuOpen);
  const cartCount = useCartStore(s => s.getTotalItems());
  const wishlistCount = useWishlistStore(s => s.items.length);
  const isLoggedIn = useAuthStore(s => s.isLoggedIn);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 25);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/' && !location.hash;
    if (href.startsWith('/#')) return location.hash === href.replace('/', '');
    return location.pathname.startsWith(href);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchInput.trim())}`);
      setSearchInput('');
    } else {
      setSearchOpen(true);
    }
  };

  return (
    <>
      <header className="fixed top-3 sm:top-5 left-0 right-0 z-50 px-3 sm:px-6 transition-all duration-300">
        <div
          className={`max-w-7xl mx-auto rounded-full transition-all duration-300 px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-[0_15px_40px_rgba(0,0,0,0.7)] ${
            scrolled
              ? 'bg-[rgba(10,10,10,0.92)] backdrop-blur-2xl border border-[rgba(245,166,35,0.25)] shadow-[0_15px_40px_rgba(0,0,0,0.85)]'
              : 'bg-[rgba(15,15,15,0.78)] backdrop-blur-xl border border-white/10'
          }`}
        >
          {/* Logo & Tagline */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#f5a623] to-[#ff6b35] flex items-center justify-center shadow-lg shadow-[rgba(245,166,35,0.3)] group-hover:scale-105 transition-transform">
              <ChefHat size={20} className="text-[#070707]" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-white font-extrabold text-base sm:text-lg leading-tight tracking-tight">
                Sigma <span className="text-[#f5a623]">Foods</span>
              </p>
              <p className="text-[10px] sm:text-[11px] text-[#f5a623]/80 leading-tight hidden md:block tracking-wide">
                More Than Food, It's an Experience
              </p>
            </div>
          </Link>

          {/* Center Navigation Links matching screenshot */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {NAV_LINKS.map(link => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`relative py-1 text-sm font-medium transition-colors duration-200 ${
                    active ? 'text-[#f5a623]' : 'text-white/80 hover:text-white'
                  }`}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-[#f5a623] rounded-full shadow-[0_0_10px_#f5a623]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Side Controls matching screenshot */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Search Pill Input */}
            <form onSubmit={handleSearchSubmit} className="hidden xl:flex items-center relative">
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Search for your favorite food..."
                className="w-48 2xl:w-56 pl-3.5 pr-8 py-1.5 rounded-full bg-white/5 border border-white/10 text-white placeholder-white/35 text-xs focus:outline-none focus:border-[#f5a623] transition-all"
              />
              <button
                type="submit"
                className="absolute right-2.5 text-white/40 hover:text-[#f5a623] transition-colors cursor-pointer"
                aria-label="Search"
              >
                <Search size={14} />
              </button>
            </form>

            {/* Mobile/Tablet Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="xl:hidden p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Search"
            >
              <Search size={17} />
            </button>

            {/* Location Icon */}
            <Link
              to="/contact"
              className="hidden sm:flex p-2 rounded-full text-white/70 hover:text-[#f5a623] hover:bg-white/10 transition-colors"
              aria-label="Location Rohini Sector 2"
              title="Shop No. 4, Sector-2, Rohini"
            >
              <MapPin size={17} />
            </Link>

            {/* Account Icon */}
            <Link
              to={isLoggedIn ? '/account' : '/login'}
              className="hidden sm:flex p-2 rounded-full text-white/70 hover:text-[#f5a623] hover:bg-white/10 transition-colors"
              aria-label="Account"
              title="Account"
            >
              <User size={17} />
            </Link>

            {/* Wishlist Icon with badge matching screenshot */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-full text-white/70 hover:text-[#f5a623] hover:bg-white/10 transition-colors"
              aria-label="Wishlist"
              title="Wishlist"
            >
              <Heart size={18} />
              {wishlistCount > 0 && (
                <span className="absolute 0 top-0.5 right-0.5 w-4 h-4 bg-[#f5a623] text-[#070707] text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-md">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart Icon with red badge matching screenshot */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-full text-white/80 hover:text-[#f5a623] hover:bg-white/10 transition-colors cursor-pointer"
              aria-label={`Cart (${cartCount} items)`}
              title="Cart"
            >
              <ShoppingCart size={18} />
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#e03131] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-md animate-pulse">
                {cartCount}
              </span>
            </button>

            {/* Virtual Mobile Simulator Button */}
            <Link
              to="/mobile"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-[#f5a623] text-xs font-semibold transition-all shadow cursor-pointer ml-1"
              title="Open Virtual Mobile Simulator"
            >
              <Smartphone size={14} className="text-[#f5a623]" />
              <span>Mobile View</span>
            </Link>

            {/* Order Now Pill Button */}
            <Link
              to="/menu"
              className="hidden md:flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full bg-gradient-to-r from-[#f5a623] to-[#ff6b35] text-[#070707] font-extrabold text-xs sm:text-sm hover:shadow-[0_0_20px_rgba(245,166,35,0.4)] hover:scale-105 transition-all btn-shine ml-1 shrink-0"
            >
              Order Now <ArrowRight size={14} strokeWidth={2.5} />
            </Link>

            {/* Mobile Hamburger Drawer Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full text-white/70 hover:bg-white/10 transition-colors"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 h-full w-72 bg-[#0e0e0e] border-l border-white/10 flex flex-col p-6 z-10"
            >
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#f5a623] to-[#ff6b35] flex items-center justify-center">
                    <ChefHat size={16} className="text-[#070707]" />
                  </div>
                  <span className="text-white font-bold">Sigma Foods</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-white/50 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="flex flex-col gap-2 flex-1">
                {NAV_LINKS.map(link => (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl font-medium transition-all ${
                      isActive(link.href)
                        ? 'bg-[rgba(245,166,35,0.15)] text-[#f5a623] border border-[rgba(245,166,35,0.3)]'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="space-y-3 pt-4 border-t border-white/10">
                <Link
                  to="/menu"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#f5a623] text-[#070707] font-bold btn-shine"
                >
                  Order Now <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
