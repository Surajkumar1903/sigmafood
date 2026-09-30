import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, Heart, ArrowRight, Tag } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useCartStore, useWishlistStore } from '../store';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, getDeliveryFee, getTax, getTotal,
    applyCoupon, removeCoupon, coupon, discount } = useCartStore();
  const { toggle, isWishlisted } = useWishlistStore();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const tax = getTax();
  const total = getTotal();
  const discountAmt = Math.round((subtotal * discount) / 100);
  const freeDelivLeft = 299 - subtotal;

  const handleCoupon = () => {
    if (applyCoupon(couponInput)) toast.success(`Coupon ${couponInput.toUpperCase()} applied!`);
    else toast.error('Invalid coupon code');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center text-center px-4">
        <div className="text-8xl mb-6">🛒</div>
        <h2 className="text-white font-bold text-2xl mb-3">Your cart is empty</h2>
        <p className="text-white/40 mb-8">Add something delicious to get started!</p>
        <Link to="/menu" className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#f5a623] to-[#ff6b35] text-white font-bold hover:shadow-[0_0_25px_rgba(245,166,35,0.4)] transition-all btn-shine">
          Explore Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16" style={{ backgroundColor: '#070707' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-extrabold text-white mb-8">Your Cart <span className="text-[#f5a623]">({items.length})</span></h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {freeDelivLeft > 0 && (
              <div className="p-4 rounded-2xl glass border border-[rgba(245,166,35,0.2)]">
                <p className="text-[#f5a623] text-sm font-semibold mb-2">Add ₹{freeDelivLeft} more for FREE DELIVERY</p>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#f5a623] to-[#ff6b35] rounded-full" style={{ width: `${Math.min((subtotal/299)*100, 100)}%`, transition: 'width 0.5s' }} />
                </div>
              </div>
            )}

            {items.map(({ product, quantity }) => (
              <div key={product.id} className="glass rounded-2xl p-5 flex gap-4">
                <Link to={`/product/${product.id}`}>
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/40 shrink-0 border border-white/10 hover:scale-105 transition-transform">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link to={`/product/${product.id}`}>
                        <h3 className="text-white font-semibold hover:text-[#f5a623] transition-colors">{product.name}</h3>
                      </Link>
                      <p className="text-white/40 text-sm">{product.category}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { toggle(product); toast.success(isWishlisted(product.id) ? 'Removed from wishlist' : 'Added to wishlist'); }}
                        className={`p-2 rounded-lg transition-colors ${isWishlisted(product.id) ? 'text-red-400' : 'text-white/30 hover:text-red-400'}`}
                      >
                        <Heart size={15} fill={isWishlisted(product.id) ? 'currentColor' : 'none'} />
                      </button>
                      <button onClick={() => { removeItem(product.id); toast.error('Removed from cart'); }} className="p-2 rounded-lg text-white/30 hover:text-red-400 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3">
                      <button onClick={() => updateQuantity(product.id, quantity - 1)} className="w-8 h-8 rounded-lg glass flex items-center justify-center text-white hover:bg-[rgba(245,166,35,0.15)] hover:text-[#f5a623] transition-all">
                        <Minus size={14} />
                      </button>
                      <span className="text-white font-bold w-6 text-center">{quantity}</span>
                      <button onClick={() => updateQuantity(product.id, quantity + 1)} className="w-8 h-8 rounded-lg glass flex items-center justify-center text-white hover:bg-[rgba(245,166,35,0.15)] hover:text-[#f5a623] transition-all">
                        <Plus size={14} />
                      </button>
                    </div>
                    <p className="text-[#f5a623] font-bold text-lg">₹{product.price * quantity}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex gap-3">
              <Link to="/menu" className="flex items-center gap-2 px-5 py-3 rounded-xl glass border border-white/10 text-white/60 text-sm hover:text-white hover:border-white/20 transition-all">
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            {/* Coupon */}
            {coupon ? (
              <div className="glass rounded-2xl p-4 border border-green-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag size={14} className="text-green-400" />
                  <span className="text-green-400 text-sm font-semibold">{coupon} – {discount}% off applied</span>
                </div>
                <button onClick={removeCoupon} className="text-white/30 hover:text-red-400 text-xs">Remove</button>
              </div>
            ) : (
              <div className="glass rounded-2xl p-4">
                <p className="text-white/50 text-sm font-semibold mb-3">Have a coupon?</p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value)}
                      placeholder="Enter code (SIGMA10)"
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/8 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[rgba(245,166,35,0.4)]"
                      onKeyDown={e => e.key === 'Enter' && handleCoupon()}
                    />
                  </div>
                  <button onClick={handleCoupon} className="px-4 py-2.5 rounded-xl bg-[rgba(245,166,35,0.15)] text-[#f5a623] font-semibold text-sm border border-[rgba(245,166,35,0.2)] hover:bg-[rgba(245,166,35,0.25)] transition-colors">
                    Apply
                  </button>
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-5">Order Summary</h3>
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Subtotal ({items.reduce((a, i) => a + i.quantity, 0)} items)</span>
                  <span className="text-white">₹{subtotal}</span>
                </div>
                {discountAmt > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400">Discount ({discount}%)</span>
                    <span className="text-green-400">-₹{discountAmt}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Delivery Fee</span>
                  <span className={deliveryFee === 0 ? 'text-green-400' : 'text-white'}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">GST (5%)</span>
                  <span className="text-white">₹{tax}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-3 border-t border-white/8">
                  <span className="text-white">Total</span>
                  <span className="text-[#f5a623]">₹{total}</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-[#f5a623] to-[#ff6b35] text-white font-bold hover:shadow-[0_0_25px_rgba(245,166,35,0.4)] hover:scale-[1.02] transition-all btn-shine"
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
