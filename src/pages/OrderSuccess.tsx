import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, MapPin, Package } from 'lucide-react';
import { useOrdersStore } from '../store';
import { useEffect, useState } from 'react';

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const order = useOrdersStore(s => s.orders.find(o => o.id === orderId));
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  useEffect(() => { setTimeout(() => setShow(true), 100); }, []);

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4" style={{ backgroundColor: '#070707' }}>
      <div className={`max-w-lg w-full text-center transition-all duration-700 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {/* Success icon */}
        <div className="relative inline-flex mb-8">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-green-400/20 to-green-500/10 flex items-center justify-center border border-green-500/20 animate-pulse-glow">
            <CheckCircle size={56} className="text-green-400" />
          </div>
          <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 60px rgba(74,222,128,0.2)' }} />
        </div>
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
          Order <span className="text-green-400">Confirmed!</span>
        </h1>
        <p className="text-white/50 mb-2">Your order has been placed successfully.</p>
        {orderId && <p className="text-[#f5a623] font-semibold mb-8">Order ID: #{orderId}</p>}

        {/* Order details */}
        {order && (
          <div className="glass rounded-2xl p-6 mb-6 text-left">
            <div className="flex items-center gap-2 mb-4">
              <Package size={18} className="text-[#f5a623]" />
              <h3 className="text-white font-semibold">Order Items</h3>
            </div>
            <div className="space-y-2 mb-4">
              {order.items.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{product.emoji}</span>
                    <span className="text-white/70 text-sm">{product.name} x{quantity}</span>
                  </div>
                  <span className="text-[#f5a623] font-semibold text-sm">₹{product.price * quantity}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold border-t border-white/8 pt-3">
              <span className="text-white">Total</span>
              <span className="text-[#f5a623]">₹{order.total}</span>
            </div>
          </div>
        )}

        {/* ETA */}
        <div className="glass rounded-2xl p-5 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[rgba(245,166,35,0.1)] flex items-center justify-center">
            <MapPin size={18} className="text-[#f5a623]" />
          </div>
          <div className="text-left">
            <p className="text-white/40 text-xs">Estimated Delivery</p>
            <p className="text-white font-semibold">30 – 45 minutes</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {orderId && (
            <Link to={`/order-tracking/${orderId}`} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#f5a623] to-[#ff6b35] text-white font-bold hover:shadow-[0_0_25px_rgba(245,166,35,0.4)] transition-all btn-shine">
              Track Order
            </Link>
          )}
          <Link to="/menu" className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl glass border border-white/10 text-white/60 hover:text-white hover:border-white/20 font-semibold transition-all">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
