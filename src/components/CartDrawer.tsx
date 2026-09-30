import { X, Plus, Minus, ShoppingCart, Trash2, ArrowRight, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useCartStore, useUIStore } from '../store';

export default function CartDrawer() {
  const isOpen = useUIStore(s => s.isCartOpen);
  const setCartOpen = useUIStore(s => s.setCartOpen);
  const { items, removeItem, updateQuantity, getSubtotal, getDeliveryFee, getTax, getTotal, applyCoupon, removeCoupon, coupon, discount } = useCartStore();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const tax = getTax();
  const total = getTotal();
  const discountAmt = Math.round((subtotal * discount) / 100);
  const freeDeliveryLeft = 299 - subtotal;

  const handleApplyCoupon = () => {
    if (applyCoupon(couponInput)) {
      toast.success(`Coupon applied! ${couponInput.toUpperCase()} - ${discount}% off`);
    } else {
      toast.error('Invalid coupon code');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
      <div className="absolute top-0 right-0 h-full w-full max-w-md bg-[#0c0c0c] border-l border-white/5 flex flex-col animate-slide-right">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} className="text-[#f5a623]" />
            <h2 className="text-white font-bold text-lg">Your Cart</h2>
            <span className="px-2 py-0.5 rounded-full bg-[rgba(245,166,35,0.15)] text-[#f5a623] text-xs font-semibold">{items.length}</span>
          </div>
          <button onClick={() => setCartOpen(false)} className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-all">
            <X size={18} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
            <div className="text-6xl">🛒</div>
            <div className="text-center">
              <p className="text-white font-semibold mb-1">Your cart is empty</p>
              <p className="text-white/40 text-sm">Add something delicious!</p>
            </div>
            <button
              onClick={() => { setCartOpen(false); navigate('/menu'); }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#f5a623] to-[#ff6b35] text-white font-semibold text-sm hover:shadow-[0_0_20px_rgba(245,166,35,0.3)] transition-all"
            >
              Explore Menu
            </button>
          </div>
        ) : (
          <>
            {/* Free Delivery Progress */}
            {freeDeliveryLeft > 0 && (
              <div className="mx-5 mt-4 p-3 rounded-xl bg-[rgba(245,166,35,0.08)] border border-[rgba(245,166,35,0.15)]">
                <p className="text-[#f5a623] text-xs font-semibold mb-1.5">Add ₹{freeDeliveryLeft} more for FREE DELIVERY 🚀</p>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#f5a623] to-[#ff6b35] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((subtotal / 299) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
            {freeDeliveryLeft <= 0 && (
              <div className="mx-5 mt-4 p-3 rounded-xl bg-[rgba(74,222,128,0.08)] border border-[rgba(74,222,128,0.2)]">
                <p className="text-green-400 text-xs font-semibold">🎉 You've unlocked FREE DELIVERY!</p>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-3 p-3 rounded-xl glass">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-black/40 shrink-0 border border-white/10">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{product.name}</p>
                    <p className="text-[#f5a623] font-bold text-sm">₹{product.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="w-6 h-6 rounded-lg bg-white/8 flex items-center justify-center text-white hover:bg-[rgba(245,166,35,0.2)] transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-white font-semibold text-sm w-6 text-center">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="w-6 h-6 rounded-lg bg-white/8 flex items-center justify-center text-white hover:bg-[rgba(245,166,35,0.2)] transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={() => { removeItem(product.id); toast.error('Removed from cart'); }}
                        className="ml-auto w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div className="px-5 pb-3">
              {coupon ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-[rgba(74,222,128,0.08)] border border-[rgba(74,222,128,0.2)]">
                  <div className="flex items-center gap-2">
                    <Tag size={14} className="text-green-400" />
                    <span className="text-green-400 text-sm font-semibold">{coupon} applied ({discount}% off)</span>
                  </div>
                  <button onClick={removeCoupon} className="text-white/40 hover:text-red-400 text-xs">Remove</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value)}
                      placeholder="Coupon code (try SIGMA10)"
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/8 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[rgba(245,166,35,0.4)]"
                      onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                    />
                  </div>
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2.5 rounded-xl bg-[rgba(245,166,35,0.15)] text-[#f5a623] text-sm font-semibold hover:bg-[rgba(245,166,35,0.25)] transition-colors border border-[rgba(245,166,35,0.2)]"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="px-5 pb-5 space-y-2">
              <div className="p-4 rounded-xl glass space-y-2">
                <div className="flex justify-between text-sm text-white/60">
                  <span>Subtotal</span>
                  <span className="text-white">₹{subtotal}</span>
                </div>
                {discountAmt > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400">Discount ({discount}%)</span>
                    <span className="text-green-400">-₹{discountAmt}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-white/60">
                  <span>Delivery</span>
                  <span className={deliveryFee === 0 ? 'text-green-400' : 'text-white'}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-sm text-white/60">
                  <span>GST (5%)</span>
                  <span className="text-white">₹{tax}</span>
                </div>
                <div className="flex justify-between font-bold text-white pt-2 border-t border-white/8">
                  <span>Total</span>
                  <span className="text-[#f5a623]">₹{total}</span>
                </div>
              </div>

              <button
                onClick={() => { setCartOpen(false); navigate('/checkout'); }}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#f5a623] to-[#ff6b35] text-white font-bold hover:shadow-[0_0_25px_rgba(245,166,35,0.35)] hover:scale-[1.02] transition-all btn-shine"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>
              <button
                onClick={() => { setCartOpen(false); navigate('/menu'); }}
                className="w-full py-2.5 rounded-xl border border-white/10 text-white/60 text-sm hover:text-white hover:border-white/20 transition-all"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
