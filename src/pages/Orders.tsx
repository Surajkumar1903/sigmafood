import { Link, useNavigate } from 'react-router-dom';
import { Eye, RotateCcw } from 'lucide-react';
import { useOrdersStore, useCartStore } from '../store';
import toast from 'react-hot-toast';

const STATUS_STYLES: Record<string, string> = {
  Confirmed: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  Preparing: 'bg-[rgba(245,166,35,0.15)] text-[#f5a623] border-[rgba(245,166,35,0.2)]',
  'Out for Delivery': 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  Delivered: 'bg-green-500/15 text-green-400 border-green-500/20',
  Cancelled: 'bg-red-500/15 text-red-400 border-red-500/20',
};

export default function OrdersPage() {
  const orders = useOrdersStore(s => s.orders);
  const addItem = useCartStore(s => s.addItem);
  const navigate = useNavigate();

  if (orders.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center text-center px-4">
        <div className="text-8xl mb-6">📦</div>
        <h2 className="text-white font-bold text-2xl mb-3">No orders yet</h2>
        <p className="text-white/40 mb-8">Your delicious orders will appear here!</p>
        <Link to="/menu" className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#f5a623] to-[#ff6b35] text-white font-bold hover:shadow-[0_0_25px_rgba(245,166,35,0.4)] transition-all btn-shine">
          Order Now
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16" style={{ backgroundColor: '#070707' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-extrabold text-white mb-8">My Orders</h1>
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="glass rounded-2xl p-5 border border-white/6 hover:border-[rgba(245,166,35,0.15)] transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[#f5a623] font-bold">#{order.id}</p>
                  <p className="text-white/40 text-sm">{order.date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[order.status]}`}>
                  {order.status}
                </span>
              </div>
              <div className="flex gap-2 mb-4 overflow-x-auto scroll-x">
                {order.items.map(({ product }) => (
                  <div key={product.id} className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xl" title={product.name}>
                    {product.emoji}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/40 text-xs">{order.items.length} item{order.items.length !== 1 ? 's' : ''} • {order.paymentMethod}</p>
                  <p className="text-[#f5a623] font-bold">₹{order.total}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { order.items.forEach(({ product, quantity }) => { for (let i = 0; i < quantity; i++) addItem(product); }); toast.success('Items added to cart!'); navigate('/cart'); }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl glass border border-white/10 text-white/60 text-sm hover:text-white hover:border-white/20 transition-all"
                  >
                    <RotateCcw size={13} /> Reorder
                  </button>
                  <Link
                    to={`/order-tracking/${order.id}`}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[rgba(245,166,35,0.1)] border border-[rgba(245,166,35,0.2)] text-[#f5a623] text-sm hover:bg-[rgba(245,166,35,0.15)] transition-all"
                  >
                    <Eye size={13} /> Track
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
