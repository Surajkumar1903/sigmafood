import { ShoppingCart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useWishlistStore, useCartStore } from '../store';

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const addToCart = useCartStore(s => s.addItem);

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center text-center px-4">
        <div className="text-8xl mb-6">❤️</div>
        <h2 className="text-white font-bold text-2xl mb-3">Your wishlist is waiting for something delicious.</h2>
        <p className="text-white/40 mb-8">Save your favorites for later!</p>
        <Link to="/menu" className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#f5a623] to-[#ff6b35] text-white font-bold hover:shadow-[0_0_25px_rgba(245,166,35,0.4)] transition-all btn-shine">
          Explore Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16" style={{ backgroundColor: '#070707' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-extrabold text-white mb-2">Wishlist <span className="text-[#f5a623]">({items.length})</span></h1>
        <p className="text-white/40 mb-8">Your saved favorites</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map(product => (
            <div key={product.id} className="glass rounded-2xl overflow-hidden border border-white/6 hover:border-[rgba(245,166,35,0.2)] transition-all group">
              <Link to={`/product/${product.id}`}>
                <div className="h-44 overflow-hidden bg-black/40 relative">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500" />
                </div>
              </Link>
              <div className="p-4">
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-white font-semibold mb-1 hover:text-[#f5a623] transition-colors">{product.name}</h3>
                </Link>
                <p className="text-white/40 text-xs mb-3">{product.category}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[#f5a623] font-bold text-lg">₹{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-white/25 text-sm line-through">₹{product.originalPrice}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { addToCart(product); toast.success(`${product.name} added to cart!`); }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-[#f5a623] to-[#ff6b35] text-white text-sm font-semibold hover:shadow-[0_0_15px_rgba(245,166,35,0.3)] transition-all"
                  >
                    <ShoppingCart size={14} /> Add to Cart
                  </button>
                  <button
                    onClick={() => { removeItem(product.id); toast.success('Removed from wishlist'); }}
                    className="w-9 h-9 rounded-xl glass flex items-center justify-center text-white/40 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
