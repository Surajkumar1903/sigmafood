import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingCart, Zap, Heart, Check, Flame, Leaf, Plus, Minus } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { useUIStore, useCartStore, useWishlistStore } from '../store';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function QuickViewModal() {
  const activeProductId = useUIStore(s => s.activeProductId);
  const setActiveProductId = useUIStore(s => s.setActiveProductId);
  const addItem = useCartStore(s => s.addItem);
  const { isWishlisted, toggle } = useWishlistStore();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const product = PRODUCTS.find(p => p.id === activeProductId);

  if (!product) return null;

  const wishlisted = isWishlisted(product.id);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  const handleClose = () => {
    setActiveProductId(null);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    setAdded(true);
    toast.success(`${quantity}x ${product.name} added to cart! 🛒`);
    setTimeout(() => {
      setAdded(false);
      handleClose();
    }, 1200);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    handleClose();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-2xl bg-[#0e0e0e] rounded-3xl border border-white/12 shadow-[0_30px_90px_rgba(0,0,0,0.9)] overflow-hidden z-10"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>

          <div className="grid sm:grid-cols-2 gap-0">
            {/* Left – Food Image */}
            <div className="relative h-64 sm:h-full min-h-[260px] bg-black/50 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-transparent to-transparent opacity-80" />
              {product.badge && (
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#f5a623] text-[#070707] shadow-lg">
                    {product.badge}
                  </span>
                </div>
              )}
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-green-400 text-xs font-semibold flex items-center gap-1">
                  <Leaf size={12} /> 100% Veg
                </span>
                {product.spiceLevel > 0 && (
                  <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-red-400 text-xs font-semibold flex items-center gap-1">
                    <Flame size={12} /> Spicy
                  </span>
                )}
              </div>
            </div>

            {/* Right – Details */}
            <div className="p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[#f5a623] text-xs font-bold uppercase tracking-wider">
                    {product.category}
                  </span>
                  <button
                    onClick={() => {
                      toggle(product);
                      toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️');
                    }}
                    className={`p-1.5 rounded-lg transition-colors ${
                      wishlisted ? 'text-red-400' : 'text-white/40 hover:text-red-400'
                    }`}
                  >
                    <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
                  </button>
                </div>

                <h3 className="text-white font-extrabold text-xl sm:text-2xl mb-2">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="text-[#f5a623]" fill="#f5a623" />
                    ))}
                  </div>
                  <span className="text-white font-bold text-xs">{product.rating}</span>
                  <span className="text-white/40 text-xs">({product.reviewCount}+ reviews)</span>
                </div>

                {/* Description */}
                <p className="text-white/60 text-xs sm:text-sm leading-relaxed mb-4">
                  {product.longDescription || product.description}
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-2.5 mb-5">
                  <span className="text-[#f5a623] font-extrabold text-2xl sm:text-3xl">
                    ₹ {product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-white/30 text-sm line-through">
                      ₹ {product.originalPrice}
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="px-2 py-0.5 rounded-md bg-green-500/15 text-green-400 text-xs font-bold">
                      {discount}% OFF
                    </span>
                  )}
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-white/50 text-xs font-medium">Quantity:</span>
                  <div className="flex items-center gap-2 p-1 rounded-xl bg-white/5 border border-white/10">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-8 text-center text-white font-bold text-sm">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  <span className="text-white/40 text-xs">
                    Subtotal: <span className="text-white font-bold">₹ {product.price * quantity}</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 pt-2 border-t border-white/8">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#f5a623] hover:bg-[#e09618] text-[#070707] font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,166,35,0.3)] btn-shine cursor-pointer"
                >
                  {added ? (
                    <><Check size={16} /> Added!</>
                  ) : (
                    <><ShoppingCart size={16} /> Add to Cart</>
                  )}
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm transition-all flex items-center justify-center gap-1.5 border border-white/10 cursor-pointer"
                >
                  <Zap size={16} className="text-[#f5a623]" /> Buy Now
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
