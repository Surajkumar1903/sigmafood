import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Clock, Package, Truck, Home } from 'lucide-react';
import { useOrdersStore } from '../store';

const TRACKING_STEPS = [
  { key: 'Confirmed', icon: CheckCircle, label: 'Order Confirmed', desc: 'Your order has been placed successfully.' },
  { key: 'Preparing', icon: Package, label: 'Preparing Your Food', desc: 'Our chefs are preparing your delicious meal.' },
  { key: 'Out for Delivery', icon: Truck, label: 'Out for Delivery', desc: 'Your food is on its way to you!' },
  { key: 'Delivered', icon: Home, label: 'Delivered', desc: 'Enjoy your meal! Bon appétit!' },
];

const STATUS_INDEX: Record<string, number> = {
  Confirmed: 0, Preparing: 1, 'Out for Delivery': 2, Delivered: 3, Cancelled: -1,
};

export default function OrderTrackingPage() {
  const { orderId } = useParams();
  const order = useOrdersStore(s => s.orders.find(o => o.id === orderId));

  if (!order) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center">
        <p className="text-white font-bold text-xl mb-4">Order not found</p>
        <Link to="/orders" className="text-[#f5a623] hover:underline">View All Orders</Link>
      </div>
    );
  }

  const currentIdx = STATUS_INDEX[order.status];

  return (
    <div className="min-h-screen pt-20" style={{ backgroundColor: '#070707' }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-extrabold text-white mb-2">Track Order</h1>
        <p className="text-[#f5a623] font-semibold mb-8">#{order.id}</p>

        {/* Tracking Steps */}
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="space-y-0">
            {TRACKING_STEPS.map((step, idx) => {
              const isDone = currentIdx > idx;
              const isActive = currentIdx === idx;
              const Icon = step.icon;
              return (
                <div key={step.key} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      isDone ? 'bg-green-500 border-green-500' :
                      isActive ? 'bg-[rgba(245,166,35,0.2)] border-[#f5a623] animate-pulse' :
                      'bg-white/5 border-white/15'
                    }`}>
                      <Icon size={18} className={isDone ? 'text-white' : isActive ? 'text-[#f5a623]' : 'text-white/25'} />
                    </div>
                    {idx < TRACKING_STEPS.length - 1 && (
                      <div className={`w-0.5 h-12 my-1 rounded-full ${
                        isDone ? 'bg-green-500' : 'bg-white/10'
                      }`} />
                    )}
                  </div>
                  <div className="pb-8 last:pb-0">
                    <p className={`font-semibold ${
                      isDone ? 'text-green-400' : isActive ? 'text-[#f5a623]' : 'text-white/30'
                    }`}>{step.label}</p>
                    <p className={`text-sm ${
                      isActive ? 'text-white/60' : 'text-white/25'
                    }`}>{step.desc}</p>
                    {isActive && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <Clock size={12} className="text-[#f5a623]" />
                        <span className="text-[#f5a623] text-xs">In Progress...</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Info */}
        <div className="glass rounded-2xl p-6 mb-6">
          <h3 className="text-white font-semibold mb-4">Order Details</h3>
          <div className="space-y-2 mb-4">
            {order.items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span>{product.emoji}</span>
                  <span className="text-white/70 text-sm">{product.name} x{quantity}</span>
                </div>
                <span className="text-[#f5a623] text-sm">₹{product.price * quantity}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold border-t border-white/8 pt-3 text-white">
            <span>Total</span>
            <span className="text-[#f5a623]">₹{order.total}</span>
          </div>
        </div>

        {/* ETA */}
        <div className="glass rounded-2xl p-4 mb-6 flex items-center gap-3">
          <Clock size={18} className="text-[#f5a623]" />
          <div>
            <p className="text-white/40 text-xs">Estimated Delivery</p>
            <p className="text-white font-semibold">30 – 45 minutes</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Link to="/orders" className="flex-1 text-center py-3 rounded-xl glass border border-white/10 text-white/60 hover:text-white font-semibold transition-all">
            All Orders
          </Link>
          <Link to="/menu" className="flex-1 text-center py-3 rounded-xl bg-gradient-to-r from-[#f5a623] to-[#ff6b35] text-white font-bold transition-all btn-shine">
            Order More
          </Link>
        </div>
      </div>
    </div>
  );
}
