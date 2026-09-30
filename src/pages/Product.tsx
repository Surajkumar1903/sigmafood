import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { Star, Heart, Minus, Plus, ShoppingCart, Zap, ArrowLeft, Leaf, Flame } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { useCartStore, useWishlistStore } from '../store';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = PRODUCTS.find(p => p.id === id);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'nutrition' | 'reviews'>('description');
  const addItem = useCartStore(s => s.addItem);
  const updateQuantity = useCartStore(s => s.updateQuantity);
  const items = useCartStore(s => s.items);
  const { isWishlisted, toggle } = useWishlistStore();

  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center">
        <p className="text-6xl mb-4">🔍</p>
        <h1 className="text-white font-bold text-2xl mb-2">Product not found</h1>
        <Link to="/menu" className="text-[#f5a623] hover:underline">Back to Menu</Link>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);
  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const spiceLabels = ['Not Spicy', 'Mild', 'Medium', 'Hot'];

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addItem(product);
    toast.success(`${qty}x ${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < qty; i++) addItem(product);
    navigate('/checkout');
  };

  const TABS = ['description', 'ingredients', 'nutrition', 'reviews'] as const;

  return (
    <div className="min-h-screen pt-16" style={{ backgroundColor: '#070707' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-white/40 hover:text-white transition-colors">
            <ArrowLeft size={15} /> Back
          </button>
          <span className="text-white/20">/</span>
          <Link to="/menu" className="text-white/40 hover:text-[#f5a623]">Menu</Link>
          <span className="text-white/20">/</span>
          <Link to={`/menu?category=${product.category}`} className="text-white/40 hover:text-[#f5a623]">{product.category}</Link>
          <span className="text-white/20">/</span>
          <span className="text-white/70">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Left – Image */}
          <div className="space-y-4">
            <div
              className="rounded-3xl overflow-hidden relative group aspect-square sm:aspect-[4/3] bg-[#0d0d0d] border border-white/10 shadow-2xl"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <span className="text-3xl p-2 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10">{product.emoji}</span>
              </div>
            </div>
          </div>

          {/* Right – Info */}
          <div>
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {product.isVeg && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-semibold border border-green-500/20">
                  <Leaf size={11} /> Veg
                </span>
              )}
              {product.badge && (
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  product.badge === 'Best Seller' ? 'bg-[#f5a623] text-[#070707]' : 'glass text-white/70'
                }`}>{product.badge}</span>
              )}
              {product.isNew && (
                <span className="px-3 py-1 rounded-full bg-blue-500/15 text-blue-400 text-xs font-bold border border-blue-500/20">New</span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < Math.floor(product.rating) ? 'text-[#f5a623]' : 'text-white/20'} fill={i < Math.floor(product.rating) ? '#f5a623' : 'none'} />
                ))}
              </div>
              <span className="text-white font-semibold">{product.rating}</span>
              <span className="text-white/40 text-sm">({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-4xl font-extrabold text-[#f5a623]">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-white/30 text-xl line-through">₹{product.originalPrice}</span>
              )}
              {discount > 0 && (
                <span className="px-2.5 py-1 rounded-full bg-green-500/15 text-green-400 text-sm font-bold border border-green-500/20">{discount}% OFF</span>
              )}
            </div>

            {/* Spice */}
            <div className="flex items-center gap-2 mb-6">
              <Flame size={14} className={product.spiceLevel > 0 ? 'text-red-400' : 'text-white/20'} />
              <span className="text-white/45 text-sm">{spiceLabels[product.spiceLevel]}</span>
            </div>

            <p className="text-white/55 leading-relaxed mb-8">{product.longDescription}</p>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <p className="text-white/50 text-sm">Quantity</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 rounded-xl glass flex items-center justify-center text-white hover:bg-[rgba(245,166,35,0.15)] hover:text-[#f5a623] transition-colors">
                  <Minus size={15} />
                </button>
                <span className="text-white font-bold text-lg w-8 text-center">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-9 h-9 rounded-xl glass flex items-center justify-center text-white hover:bg-[rgba(245,166,35,0.15)] hover:text-[#f5a623] transition-colors">
                  <Plus size={15} />
                </button>
              </div>
              <span className="text-white/30 text-sm">Total: <span className="text-[#f5a623] font-semibold">₹{product.price * qty}</span></span>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl glass border border-[rgba(245,166,35,0.3)] text-[#f5a623] font-bold hover:bg-[rgba(245,166,35,0.1)] transition-all"
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-[#f5a623] to-[#ff6b35] text-white font-bold hover:shadow-[0_0_25px_rgba(245,166,35,0.4)] hover:scale-[1.02] transition-all btn-shine"
              >
                <Zap size={18} /> Buy Now
              </button>
              <button
                onClick={() => { toggle(product); toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️'); }}
                className={`w-12 h-12 rounded-xl glass flex items-center justify-center transition-all ${
                  wishlisted ? 'text-red-400 border-red-400/30' : 'text-white/40 hover:text-red-400'
                }`}
              >
                <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Info pills */}
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 rounded-full glass text-white/50 text-xs">100% Veg</span>
              <span className="px-3 py-1.5 rounded-full glass text-white/50 text-xs">Fresh Daily</span>
              <span className="px-3 py-1.5 rounded-full glass text-white/50 text-xs">Hygienic</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-1 p-1 rounded-xl glass w-fit mb-8">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                  activeTab === tab ? 'bg-[#f5a623] text-[#070707]' : 'text-white/50 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="glass rounded-2xl p-6">
            {activeTab === 'description' && (
              <p className="text-white/60 leading-relaxed">{product.longDescription}</p>
            )}
            {activeTab === 'ingredients' && (
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map(ing => (
                  <span key={ing} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/8 text-white/60 text-sm">{ing}</span>
                ))}
              </div>
            )}
            {activeTab === 'nutrition' && (
              product.nutrition ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {Object.entries(product.nutrition).map(([key, val]) => (
                    <div key={key} className="text-center p-4 rounded-xl bg-white/3 border border-white/5">
                      <p className="text-[#f5a623] font-bold text-xl">{val}</p>
                      <p className="text-white/40 text-xs capitalize mt-1">{key}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/40 text-sm">Nutrition information not available.</p>
              )
            )}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-extrabold text-[#f5a623]">{product.rating}</span>
                  <div>
                    <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} size={16} className="text-[#f5a623]" fill={i < Math.floor(product.rating) ? '#f5a623' : 'none'} />)}</div>
                    <p className="text-white/40 text-xs">{product.reviewCount} reviews</p>
                  </div>
                </div>
                <p className="text-white/40 text-sm">Verified customer reviews available on Google.</p>
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-extrabold text-white mb-6">Related Items</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
