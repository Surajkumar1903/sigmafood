import { useState } from 'react';
import { Star, ShoppingCart, Check, Heart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useCartStore, useWishlistStore, useUIStore } from '../store';
import type { Product } from '../data/products';

interface Props {
  product: Product;
  view?: 'grid' | 'list';
}

export default function ProductCard({ product, view = 'grid' }: Props) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore(s => s.addItem);
  const { isWishlisted, toggle } = useWishlistStore();
  const setActiveProductId = useUIStore(s => s.setActiveProductId);
  const wishlisted = isWishlisted(product.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    toast.success(`${product.name} added to cart! 🛒`);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product);
    toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️');
  };

  const getBadgeStyle = (badge?: string) => {
    switch (badge) {
      case 'Popular':
        return 'bg-[#f5a623] text-[#070707] font-bold';
      case 'Top Pick':
        return 'bg-[#e03131] text-white font-semibold';
      case 'Bestseller':
        return 'bg-[#2b8a3e] text-white font-semibold';
      case 'Hot':
      case 'Spicy':
        return 'bg-[#e8590c] text-white font-semibold';
      default:
        return 'bg-[rgba(245,166,35,0.15)] text-[#f5a623] border border-[rgba(245,166,35,0.3)] font-semibold';
    }
  };

  const getBadgeIcon = (badge?: string) => {
    switch (badge) {
      case 'Popular': return '@';
      case 'Top Pick': return '📍';
      case 'Bestseller': return '🥬';
      case 'Hot':
      case 'Spicy': return '🔥';
      default: return '✨';
    }
  };

  if (view === 'list') {
    return (
      <Link to={`/product/${product.id}`} className="block">
        <motion.div
          whileHover={{ y: -4, borderColor: 'rgba(245,166,35,0.35)' }}
          className="glass rounded-2xl p-4 flex gap-4 cursor-pointer transition-colors border border-white/8 bg-[#0c0c0c]"
        >
          <div className="w-28 h-28 rounded-xl overflow-hidden bg-black/40 shrink-0 relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
              loading="lazy"
            />
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  {product.badge && (
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] mb-1.5 ${getBadgeStyle(product.badge)}`}>
                      <span>{getBadgeIcon(product.badge)}</span>
                      <span>{product.badge}</span>
                    </span>
                  )}
                  <h3 className="text-white font-bold text-base">{product.name}</h3>
                  <p className="text-white/45 text-xs line-clamp-1 mt-0.5">{product.description}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.85 }}
                  onClick={handleWishlist}
                  className={`p-1.5 rounded-lg ${wishlisted ? 'text-red-400' : 'text-white/30 hover:text-red-400'} transition-colors shrink-0`}
                >
                  <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
                </motion.button>
              </div>
              <div className="flex items-center gap-1.5 mt-1.5">
                <Star size={13} className="text-[#f5a623]" fill="#f5a623" />
                <span className="text-white font-semibold text-xs">{product.rating}</span>
                <span className="text-white/40 text-xs">({product.reviewCount}+ reviews)</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-baseline gap-1.5">
                <span className="text-white font-extrabold text-lg">₹ {product.price}</span>
                {product.originalPrice && <span className="text-white/30 text-xs line-through">₹ {product.originalPrice}</span>}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.94 }}
                onClick={handleAdd}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#f5a623] hover:bg-[#e09618] text-[#070707] text-xs font-bold transition-colors shadow-[0_0_15px_rgba(245,166,35,0.25)] cursor-pointer"
              >
                {added ? <><Check size={14} /> Added</> : <><ShoppingCart size={14} /> Add to Cart</>}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <div className="glass rounded-2xl overflow-hidden border border-white/8 hover:border-[rgba(245,166,35,0.4)] transition-all duration-300 flex flex-col justify-between group relative bg-[#0d0d0d] shadow-lg hover:shadow-[0_20px_45px_rgba(0,0,0,0.7)] h-full">
      {/* Top Image Container */}
      <Link to={`/product/${product.id}`} className="block relative h-36 xs:h-44 sm:h-52 overflow-hidden bg-black/40">
        {/* Badge */}
        {product.badge && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-[11px] shadow-lg ${getBadgeStyle(product.badge)}`}>
              <span>{getBadgeIcon(product.badge)}</span>
              <span>{product.badge}</span>
            </span>
          </div>
        )}

        {/* Top Right Action Buttons: Quick View & Wishlist */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 flex items-center gap-1 sm:gap-1.5">
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setActiveProductId(product.id);
            }}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-[#f5a623] hover:border-[#f5a623]/40 transition-all cursor-pointer"
            aria-label="Quick View"
            title="Quick View"
          >
            <Eye size={12} className="sm:w-3.5 sm:h-3.5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            onClick={handleWishlist}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all cursor-pointer ${
              wishlisted ? 'text-red-400 border-red-400/30' : 'text-white/50 hover:text-red-400'
            }`}
            aria-label="Wishlist"
            title="Wishlist"
          >
            <Heart size={12} className="sm:w-3.5 sm:h-3.5" fill={wishlisted ? 'currentColor' : 'none'} />
          </motion.button>
        </div>

        {/* 3D Food Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent opacity-60" />
      </Link>

      {/* Card Content */}
      <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/product/${product.id}`} className="block">
            <h3 className="text-white font-bold text-xs sm:text-base mb-1 group-hover:text-[#f5a623] transition-colors truncate">
              {product.name}
            </h3>
          </Link>
          <p className="text-white/50 text-[10px] sm:text-xs leading-relaxed mb-2 line-clamp-1 sm:line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center gap-1 sm:gap-1.5 mb-2.5 sm:mb-4">
            <Star size={11} className="text-[#f5a623] sm:w-3 sm:h-3" fill="#f5a623" />
            <span className="text-white font-semibold text-[10px] sm:text-xs">{product.rating}</span>
            <span className="text-white/40 text-[9px] sm:text-xs">({product.reviewCount}+)</span>
          </div>
        </div>

        {/* Price & Add to Cart button */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            <span className="text-white font-extrabold text-sm sm:text-xl">₹ {product.price}</span>
            {product.originalPrice && (
              <span className="text-white/30 text-[10px] sm:text-xs line-through">₹ {product.originalPrice}</span>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.94 }}
            onClick={handleAdd}
            className={`w-full flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 rounded-xl font-bold text-[11px] sm:text-sm transition-colors duration-200 btn-shine cursor-pointer ${
              added
                ? 'bg-green-500 text-white shadow-[0_0_20px_rgba(74,222,128,0.3)]'
                : 'bg-[#f5a623] hover:bg-[#e09618] text-[#070707] shadow-[0_0_20px_rgba(245,166,35,0.25)] hover:shadow-[0_0_25px_rgba(245,166,35,0.45)]'
            }`}
          >
            {added ? (
              <><Check size={14} className="shrink-0" /> Added</>
            ) : (
              <><ShoppingCart size={14} className="shrink-0" /> Add to Cart</>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
